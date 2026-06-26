<?php
namespace App\Http\Controllers;
use App\Models\Course;
use App\Models\Enrollment;
use App\Models\InstructorProfile;
use App\Models\Payment;
use Illuminate\Http\Request;

class InstructorController extends Controller
{
    public function index(Request $request) { return response()->json(InstructorProfile::where('tenant_id', $request->user()->tenant_id)->with('user:id,full_name,email')->get()); }
    public function store(Request $request)
    {
        $request->validate(['userId' => 'required|uuid']);
        return response()->json(InstructorProfile::create(['tenant_id' => $request->user()->tenant_id, 'user_id' => $request->userId, 'bio' => $request->bio, 'expertise' => $request->expertise, 'qualifications' => $request->qualifications, 'teaching_subjects' => $request->teachingSubjects]), 201);
    }
    public function show(Request $request, string $id) { return response()->json(InstructorProfile::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->with('user:id,full_name,email')->firstOrFail()); }
    public function update(Request $request, string $id) { $p = InstructorProfile::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail(); $p->update($request->only(['bio', 'expertise', 'qualifications', 'teaching_subjects'])); return response()->json($p); }
    public function destroy(Request $request, string $id) { InstructorProfile::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()->delete(); return response()->json(['success' => true]); }

    public function myOverview(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $instructorId = $request->user()->id;
        $courseIds = Course::where('tenant_id', $tenantId)->where('instructor_id', $instructorId)->pluck('id');

        return response()->json([
            'courses_count' => $courseIds->count(),
            'published_courses_count' => Course::whereIn('id', $courseIds)->where('status', 'PUBLISHED')->count(),
            'students_count' => Enrollment::where('tenant_id', $tenantId)->whereIn('course_id', $courseIds)->distinct('user_id')->count('user_id'),
            'completed_enrollments_count' => Enrollment::where('tenant_id', $tenantId)->whereIn('course_id', $courseIds)->whereNotNull('completed_at')->count(),
            'earnings_total' => Payment::where('tenant_id', $tenantId)->whereIn('course_id', $courseIds)->where('status', 'COMPLETED')->sum('amount'),
        ]);
    }

    public function myCourses(Request $request)
    {
        return response()->json(
            Course::where('tenant_id', $request->user()->tenant_id)
                ->where('instructor_id', $request->user()->id)
                ->withCount('enrollments')
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function myStudents(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $courseIds = Course::where('tenant_id', $tenantId)->where('instructor_id', $request->user()->id)->pluck('id');

        return response()->json(
            Enrollment::where('tenant_id', $tenantId)
                ->whereIn('course_id', $courseIds)
                ->with(['user:id,full_name,email', 'course:id,title'])
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }

    public function myEarnings(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $courseIds = Course::where('tenant_id', $tenantId)->where('instructor_id', $request->user()->id)->pluck('id');

        return response()->json(
            Payment::where('tenant_id', $tenantId)
                ->whereIn('course_id', $courseIds)
                ->where('status', 'COMPLETED')
                ->with(['course:id,title', 'user:id,full_name,email'])
                ->orderBy('created_at', 'desc')
                ->get()
        );
    }
}
