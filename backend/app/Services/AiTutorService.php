<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class AiTutorService
{
    protected string $apiKey;
    protected string $model;

    public function __construct()
    {
        $this->apiKey = env('OPENAI_API_KEY', '');
        $this->model = env('OPENAI_MODEL', 'gpt-4o-mini');
    }

    /**
     * Send a prompt to OpenAI and get a response.
     */
    public function ask(string $prompt, array $history = []): string
    {
        if (empty($this->apiKey)) {
            throw new Exception("OpenAI API key is not configured.");
        }

        $messages = [
            ['role' => 'system', 'content' => 'You are an expert, helpful AI tutor embedded in an educational LMS platform. Your goal is to guide students, explain concepts clearly, and help them understand the material without just giving them the answers directly.']
        ];

        // Append conversation history
        foreach ($history as $msg) {
            $messages[] = [
                'role' => $msg['role'] ?? 'user',
                'content' => $msg['content'] ?? ''
            ];
        }

        // Add the new prompt
        $messages[] = [
            'role' => 'user',
            'content' => $prompt
        ];

        $response = Http::withToken($this->apiKey)
            ->timeout(60)
            ->post('https://api.openai.com/v1/chat/completions', [
                'model' => $this->model,
                'messages' => $messages,
                'temperature' => 0.7,
            ]);

        if ($response->failed()) {
            throw new Exception("Failed to communicate with AI provider: " . $response->body());
        }

        $data = $response->json();

        return $data['choices'][0]['message']['content'] ?? 'Sorry, I could not generate a response.';
    }
}
