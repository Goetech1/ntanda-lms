<?php
namespace App\Http\Controllers;
use App\Models\Exam;
use App\Models\ExamAttempt;
use Illuminate\Http\Request;

class ExamController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Exam::where('tenant_id', $request->user()->tenant_id)->with('course:id,title')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid', 'title' => 'required', 'durationMinutes' => 'required|integer']);
        return response()->json(Exam::create([
            'tenant_id' => $request->user()->tenant_id,
            'course_id' => $request->courseId,
            'title' => $request->title,
            'scheduled_at' => $request->scheduledAt,
            'duration_minutes' => $request->durationMinutes,
            'require_webcam' => $request->requireWebcam ?? false,
            'secure_browser' => $request->secureBrowser ?? false,
        ]), 201);
    }

    public function show(Request $request, string $id)
    {
        return response()->json(Exam::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->with('attempts')->firstOrFail());
    }

    public function byCourse(Request $request, string $courseId)
    {
        return response()->json(
            Exam::where('course_id', $courseId)
                ->where('tenant_id', $request->user()->tenant_id)
                ->with('course:id,title')
                ->orderBy('scheduled_at')
                ->get()
        );
    }

    public function startAttempt(Request $request, string $examId)
    {
        return response()->json(ExamAttempt::create([
            'tenant_id' => $request->user()->tenant_id,
            'exam_id' => $examId,
            'user_id' => $request->user()->id,
        ]), 201);
    }

    public function completeAttempt(Request $request, string $attemptId)
    {
        $attempt = ExamAttempt::where('id', $attemptId)->where('tenant_id', $request->user()->tenant_id)->firstOrFail();
        $attempt->update(['completed_at' => now(), 'score' => $request->score]);
        return response()->json($attempt);
    }
}
