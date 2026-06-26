<?php
namespace App\Http\Controllers;
use App\Models\Attendance;
use App\Models\Course;
use App\Models\StudentProfile;
use App\Models\User;
use Illuminate\Http\Request;

class AttendanceController extends Controller
{
    public function index(Request $request, string $courseId)
    {
        return response()->json(Attendance::where('course_id', $courseId)->where('tenant_id', $request->user()->tenant_id)->with('user:id,full_name')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid', 'userId' => 'required|uuid', 'date' => 'required|date', 'status' => 'required|in:PRESENT,ABSENT,LATE,EXCUSED']);
        return response()->json(Attendance::create([
            'tenant_id' => $request->user()->tenant_id,
            'course_id' => $request->courseId,
            'user_id' => $request->userId,
            'date' => $request->date,
            'status' => $request->status,
            'remarks' => $request->remarks,
        ]), 201);
    }

    public function batch(Request $request)
    {
        $validated = $request->validate([
            'courseId' => 'required|uuid|exists:courses,id',
            'date' => 'required|date',
            'studentsCSV' => 'required|string',
            'sessionType' => 'nullable|string|max:50',
        ]);

        $tenantId = $request->user()->tenant_id;
        Course::where('id', $validated['courseId'])->where('tenant_id', $tenantId)->firstOrFail();

        $emails = collect(explode(',', $validated['studentsCSV']))
            ->map(fn($email) => trim(strtolower($email)))
            ->filter()
            ->unique()
            ->values();

        $created = [];
        $skipped = [];

        foreach ($emails as $email) {
            $student = User::where('tenant_id', $tenantId)->where('email', $email)->first();
            if (!$student) {
                $skipped[] = ['email' => $email, 'reason' => 'Student user not found'];
                continue;
            }

            $attendance = Attendance::updateOrCreate(
                [
                    'tenant_id' => $tenantId,
                    'course_id' => $validated['courseId'],
                    'user_id' => $student->id,
                    'date' => $validated['date'],
                ],
                [
                    'status' => 'PRESENT',
                    'remarks' => 'Batch attendance import' . (!empty($validated['sessionType']) ? ' - ' . $validated['sessionType'] : ''),
                ]
            );

            $created[] = $attendance;
        }

        return response()->json([
            'created_count' => count($created),
            'skipped_count' => count($skipped),
            'created' => $created,
            'skipped' => $skipped,
        ], 201);
    }

    public function biometric(Request $request)
    {
        $validated = $request->validate([
            'studentIdString' => 'required|string',
            'courseId' => 'required|uuid|exists:courses,id',
            'date' => 'required|date',
            'status' => 'required|in:PRESENT,ABSENT,LATE,EXCUSED',
            'deviceId' => 'nullable|string|max:100',
        ]);

        $tenantId = $request->user()->tenant_id;
        Course::where('id', $validated['courseId'])->where('tenant_id', $tenantId)->firstOrFail();

        $student = StudentProfile::where('tenant_id', $tenantId)
            ->where('student_id_string', $validated['studentIdString'])
            ->with('user')
            ->first()?->user;

        if (!$student) {
            $student = User::where('tenant_id', $tenantId)
                ->where(function ($query) use ($validated) {
                    $query->where('id', $validated['studentIdString'])
                        ->orWhere('email', $validated['studentIdString'])
                        ->orWhere('full_name', $validated['studentIdString']);
                })
                ->first();
        }

        if (!$student) {
            return response()->json(['message' => 'Student card, email, user ID, or name not found'], 404);
        }

        $attendance = Attendance::updateOrCreate(
            [
                'tenant_id' => $tenantId,
                'course_id' => $validated['courseId'],
                'user_id' => $student->id,
                'date' => $validated['date'],
            ],
            [
                'status' => $validated['status'],
                'remarks' => 'Biometric device: ' . ($validated['deviceId'] ?? 'unknown'),
            ]
        );

        return response()->json($attendance->load('user:id,full_name,email'), 201);
    }

    public function byStudent(Request $request, string $userId)
    {
        return response()->json(Attendance::where('user_id', $userId)->where('tenant_id', $request->user()->tenant_id)->with('course:id,title')->get());
    }
}
