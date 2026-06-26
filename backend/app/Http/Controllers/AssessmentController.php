<?php

namespace App\Http\Controllers;

use App\Models\Assessment;
use App\Models\Question;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Schema;

class AssessmentController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(Assessment::where('tenant_id', $request->user()->tenant_id)->with('course:id,title')->get());
    }

    public function store(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid', 'title' => 'required', 'type' => 'required|in:QUIZ,ASSIGNMENT,EXAM', 'totalPoints' => 'required|integer']);
        return response()->json(Assessment::create([
            'tenant_id' => $request->user()->tenant_id,
            'course_id' => $request->courseId,
            'title' => $request->title,
            'type' => $request->type,
            'time_limit_minutes' => $request->timeLimitMinutes,
            'total_points' => $request->totalPoints,
        ]), 201);
    }

    public function show(Request $request, string $id)
    {
        return response()->json(Assessment::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->with('questions')->firstOrFail());
    }

    public function addQuestion(Request $request, string $id)
    {
        $assessment = Assessment::where('id', $id)
            ->where('tenant_id', $request->user()->tenant_id)
            ->firstOrFail();

        $validated = $request->validate([
            'type' => 'nullable|string',
            'text' => 'nullable|string',
            'content' => 'nullable|string',
            'options' => 'nullable|array',
            'options_json' => 'nullable|array',
            'correctAnswer' => 'nullable',
            'correct_answer' => 'nullable',
            'answer_json' => 'nullable',
            'points' => 'nullable|integer|min:0',
            'orderIndex' => 'nullable|integer|min:0',
            'category_id' => 'nullable|uuid|exists:question_categories,id',
        ]);

        $questionText = $validated['text'] ?? $validated['content'] ?? null;
        if (!$questionText) {
            return response()->json(['message' => 'Question text is required'], 422);
        }

        $payload = ['tenant_id' => $request->user()->tenant_id];
        if (Schema::hasColumn('questions', 'assessment_id')) {
            $payload['assessment_id'] = $assessment->id;
        }
        if (Schema::hasColumn('questions', 'category_id')) {
            $payload['category_id'] = $validated['category_id'] ?? null;
        }
        if (Schema::hasColumn('questions', 'type')) {
            $payload['type'] = $validated['type'] ?? 'multiple_choice';
        }
        if (Schema::hasColumn('questions', 'text')) {
            $payload['text'] = $questionText;
        }
        if (Schema::hasColumn('questions', 'content')) {
            $payload['content'] = $questionText;
        }
        if (Schema::hasColumn('questions', 'options_json')) {
            $payload['options_json'] = $validated['options_json'] ?? $validated['options'] ?? null;
        }
        if (Schema::hasColumn('questions', 'options')) {
            $payload['options'] = $validated['options'] ?? $validated['options_json'] ?? [];
        }
        if (Schema::hasColumn('questions', 'answer_json')) {
            $payload['answer_json'] = $validated['answer_json'] ?? $validated['correctAnswer'] ?? $validated['correct_answer'] ?? null;
        }
        if (Schema::hasColumn('questions', 'correct_answer')) {
            $payload['correct_answer'] = $validated['correct_answer'] ?? $validated['correctAnswer'] ?? $validated['answer_json'] ?? null;
        }
        if (Schema::hasColumn('questions', 'points')) {
            $payload['points'] = $validated['points'] ?? 1;
        }
        if (Schema::hasColumn('questions', 'order_index')) {
            $payload['order_index'] = $validated['orderIndex'] ?? Question::where('tenant_id', $request->user()->tenant_id)->where('assessment_id', $assessment->id)->count();
        }

        return response()->json(Question::create($payload), 201);
    }

    public function update(Request $request, string $id)
    {
        $a = Assessment::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail();
        $a->update($request->only(['title', 'type', 'time_limit_minutes', 'total_points']));
        return response()->json($a);
    }

    public function destroy(Request $request, string $id)
    {
        Assessment::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()->delete();
        return response()->json(['success' => true]);
    }
}
