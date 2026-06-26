<?php
namespace App\Http\Controllers;
use App\Models\AiInteraction;
use App\Services\AiTutorService;
use Illuminate\Http\Request;

class AiController extends Controller
{
    public function chat(Request $request, AiTutorService $aiTutor)
    {
        $request->validate([
            'prompt' => 'required|string|max:2000',
            'history' => 'nullable|array'
        ]);

        try {
            $prompt = $request->prompt;
            $history = $request->history ?? [];

            $response = $aiTutor->ask($prompt, $history);

            // Log interaction
            AiInteraction::create([
                'tenant_id' => $request->user()->tenant_id,
                'user_id' => $request->user()->id,
                'feature' => 'TUTOR',
                'prompt' => $prompt,
                'response' => $response,
                'tokens_used' => str_word_count($prompt) + str_word_count($response),
                'created_at' => now(),
            ]);

            return response()->json([
                'success' => true,
                'response' => $response
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function history(Request $request) { 
        return response()->json(AiInteraction::where('tenant_id', $request->user()->tenant_id)->where('user_id', $request->user()->id)->orderBy('created_at', 'desc')->limit(50)->get()); 
    }

    public function tutor(Request $request, AiTutorService $aiTutor)
    {
        return $this->chat($request, $aiTutor);
    }

    public function quizGenerator(Request $request, AiTutorService $aiTutor)
    {
        $request->validate([
            'topic' => 'nullable|string|max:500',
            'prompt' => 'nullable|string|max:2000',
            'questionCount' => 'nullable|integer|min:1|max:50',
        ]);

        $topic = $request->topic ?? $request->prompt ?? 'the selected course material';
        $count = $request->questionCount ?? 5;
        $prompt = "Generate {$count} quiz questions about {$topic}. Include answers and keep the format clear for an LMS teacher.";
        $response = $aiTutor->ask($prompt, []);

        AiInteraction::create([
            'tenant_id' => $request->user()->tenant_id,
            'user_id' => $request->user()->id,
            'feature' => 'QUIZ_GENERATOR',
            'prompt' => $prompt,
            'response' => $response,
            'tokens_used' => str_word_count($prompt) + str_word_count($response),
            'created_at' => now(),
        ]);

        return response()->json(['success' => true, 'response' => $response]);
    }

    public function recommendations(Request $request)
    {
        $recent = AiInteraction::where('tenant_id', $request->user()->tenant_id)
            ->where('user_id', $request->user()->id)
            ->orderBy('created_at', 'desc')
            ->limit(5)
            ->get();

        return response()->json([
            'success' => true,
            'recommendations' => $recent->isEmpty()
                ? ['Start with your active courses, complete pending assessments, and review recent lesson notes.']
                : $recent->map(fn($item) => 'Follow up on: ' . mb_substr($item->prompt, 0, 120))->values(),
        ]);
    }
}
