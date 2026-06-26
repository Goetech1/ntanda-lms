<?php
namespace App\Http\Controllers;
use Illuminate\Http\Request;
use App\Services\VirtualClassroomManager;

class VirtualClassroomController extends Controller
{
    public function create(Request $request) 
    { 
        $request->validate([
            'topic' => 'required|string',
            'durationMinutes' => 'required|integer',
            'provider' => 'nullable|string|in:zoom,daily,jitsi,twilio'
        ]);

        try {
            // Get provider from request, fallback to tenant settings, or default to jitsi
            $provider = $request->provider ?? 'jitsi'; 

            $manager = new VirtualClassroomManager($provider);
            $meetingDetails = $manager->createMeeting($request->topic, $request->durationMinutes);

            return response()->json([
                'success' => true,
                'message' => 'Virtual classroom created',
                'meeting' => $meetingDetails
            ]);

        } catch (\Exception $e) {
            return response()->json([
                'success' => false,
                'message' => $e->getMessage()
            ], 500);
        }
    }

    public function join(Request $request, string $roomId) 
    { 
        $provider = $request->query('provider', 'jitsi');

        if ($provider === 'twilio') {
            $accountSid = env('TWILIO_ACCOUNT_SID');
            $apiKey = env('TWILIO_API_KEY');
            $apiSecret = env('TWILIO_API_SECRET');
            
            if (!$accountSid || !$apiKey || !$apiSecret) {
                return response()->json(['success' => false, 'message' => 'Twilio credentials are not configured'], 503);
            }

            $identity = $request->user()->id;
            $now = time();
            $payload = [
                'jti' => $apiKey . '-' . $now,
                'iss' => $apiKey,
                'sub' => $accountSid,
                'exp' => $now + 3600,
                'grants' => [
                    'identity' => $identity,
                    'video' => ['room' => $roomId],
                ],
            ];
            $token = $this->signJwt(['typ' => 'JWT', 'alg' => 'HS256', 'cty' => 'twilio-fpa;v=1'], $payload, $apiSecret);
            
            return response()->json(['success' => true, 'provider' => 'twilio', 'roomId' => $roomId, 'token' => $token]);
        }

        return response()->json([
            'success' => true, 
            'message' => "Join process is handled via the provider's direct URL.", 
            'roomId' => $roomId
        ]);
    }

    private function signJwt(array $header, array $payload, string $secret): string
    {
        $segments = [
            $this->base64UrlEncode(json_encode($header)),
            $this->base64UrlEncode(json_encode($payload)),
        ];
        $signature = hash_hmac('sha256', implode('.', $segments), $secret, true);
        $segments[] = $this->base64UrlEncode($signature);

        return implode('.', $segments);
    }

    private function base64UrlEncode(string $value): string
    {
        return rtrim(strtr(base64_encode($value), '+/', '-_'), '=');
    }
}
