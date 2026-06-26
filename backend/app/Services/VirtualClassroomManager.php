<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Illuminate\Support\Str;
use Exception;

class VirtualClassroomManager
{
    protected string $provider;

    public function __construct(string $provider = 'jitsi')
    {
        $this->provider = strtolower($provider);
    }

    /**
     * Create a virtual classroom meeting.
     */
    public function createMeeting(string $topic, int $durationMinutes = 60, array $settings = []): array
    {
        return match ($this->provider) {
            'zoom' => $this->createZoomMeeting($topic, $durationMinutes),
            'daily' => $this->createDailyMeeting($topic),
            'twilio' => $this->createTwilioRoom($topic),
            'jitsi', 'default' => $this->createJitsiMeeting($topic),
            default => throw new Exception("Unsupported virtual classroom provider: {$this->provider}"),
        };
    }

    /**
     * Jitsi implementation (Free, no strict API keys required for basic usage)
     */
    protected function createJitsiMeeting(string $topic): array
    {
        $roomId = Str::slug($topic) . '-' . Str::random(8);
        return [
            'provider' => 'jitsi',
            'roomId' => $roomId,
            'joinUrl' => "https://meet.jit.si/{$roomId}",
            'instructorUrl' => "https://meet.jit.si/{$roomId}",
        ];
    }

    /**
     * Daily.co implementation
     */
    protected function createDailyMeeting(string $topic): array
    {
        $apiKey = env('DAILY_API_KEY');
        if (!$apiKey) throw new Exception("Daily.co API key missing.");

        $response = Http::withToken($apiKey)->post('https://api.daily.co/v1/rooms', [
            'properties' => [
                'exp' => time() + (3600 * 24), // expires in 24 hrs
                'enable_chat' => true,
            ]
        ]);

        if ($response->failed()) throw new Exception("Failed to create Daily.co room: " . $response->body());

        $data = $response->json();
        return [
            'provider' => 'daily',
            'roomId' => $data['name'],
            'joinUrl' => $data['url'],
            'instructorUrl' => $data['url'],
        ];
    }

    /**
     * Zoom implementation (Requires OAuth App credentials)
     */
    protected function createZoomMeeting(string $topic, int $durationMinutes): array
    {
        $accountId = env('ZOOM_ACCOUNT_ID');
        $clientId = env('ZOOM_CLIENT_ID');
        $clientSecret = env('ZOOM_CLIENT_SECRET');

        if (!$accountId || !$clientId || !$clientSecret) {
            throw new Exception("Zoom API credentials missing.");
        }

        // 1. Get access token
        $tokenResponse = Http::withBasicAuth($clientId, $clientSecret)
            ->asForm()
            ->post("https://zoom.us/oauth/token", [
                'grant_type' => 'account_credentials',
                'account_id' => $accountId,
            ]);

        if ($tokenResponse->failed()) throw new Exception("Failed to authenticate with Zoom.");
        $token = $tokenResponse->json('access_token');

        // 2. Create meeting
        $response = Http::withToken($token)->post('https://api.zoom.us/v2/users/me/meetings', [
            'topic' => $topic,
            'type' => 2, // Scheduled meeting
            'duration' => $durationMinutes,
            'settings' => [
                'host_video' => true,
                'participant_video' => true,
                'join_before_host' => false,
                'waiting_room' => true,
            ]
        ]);

        if ($response->failed()) throw new Exception("Failed to create Zoom meeting.");

        $data = $response->json();
        return [
            'provider' => 'zoom',
            'roomId' => $data['id'],
            'joinUrl' => $data['join_url'],
            'instructorUrl' => $data['start_url'], // Requires instructor to be logged into Zoom
        ];
    }

    /**
     * Twilio Video implementation
     */
    protected function createTwilioRoom(string $topic): array
    {
        $sid = env('TWILIO_ACCOUNT_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        if (!$sid || !$token) throw new Exception("Twilio API credentials missing.");

        $roomId = Str::slug($topic) . '-' . Str::random(8);

        $response = Http::withBasicAuth($sid, $token)
            ->asForm()
            ->post("https://video.twilio.com/v1/Rooms", [
                'UniqueName' => $roomId,
                'Type' => 'group',
            ]);

        if ($response->failed()) throw new Exception("Failed to create Twilio Video room.");

        // Twilio requires frontend SDKs to actually join, so we just return the room name.
        return [
            'provider' => 'twilio',
            'roomId' => $roomId,
            'joinUrl' => null, // Client handles Twilio connection via JS SDK
            'instructorUrl' => null,
        ];
    }
}
