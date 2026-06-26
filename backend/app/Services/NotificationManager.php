<?php

namespace App\Services;

use Illuminate\Support\Facades\Http;
use Exception;

class NotificationManager
{
    /**
     * Send an SMS or WhatsApp message based on provider and channel
     */
    public function send(string $to, string $message, string $channel = 'SMS', string $provider = 'twilio'): bool
    {
        return match (strtolower($provider)) {
            'twilio' => $this->sendViaTwilio($to, $message, $channel),
            'messagebird' => $this->sendViaMessageBird($to, $message, $channel),
            default => throw new Exception("Unsupported notification provider: {$provider}"),
        };
    }

    /**
     * Send using Twilio API
     */
    protected function sendViaTwilio(string $to, string $message, string $channel): bool
    {
        $sid = env('TWILIO_ACCOUNT_SID');
        $token = env('TWILIO_AUTH_TOKEN');
        $from = env('TWILIO_PHONE_NUMBER');

        if (!$sid || !$token || !$from) {
            throw new Exception("Twilio credentials are not configured.");
        }

        // For WhatsApp, Twilio requires "whatsapp:" prefix
        if (strtoupper($channel) === 'WHATSAPP') {
            $from = "whatsapp:" . env('TWILIO_WHATSAPP_NUMBER', $from);
            $to = "whatsapp:" . $to;
        }

        $response = Http::withBasicAuth($sid, $token)
            ->asForm()
            ->post("https://api.twilio.com/2010-04-01/Accounts/{$sid}/Messages.json", [
                'From' => $from,
                'To' => $to,
                'Body' => $message,
            ]);

        if ($response->failed()) {
            throw new Exception("Twilio API Error: " . $response->body());
        }

        return true;
    }

    /**
     * Send using MessageBird (Bird) API
     */
    protected function sendViaMessageBird(string $to, string $message, string $channel): bool
    {
        $apiKey = env('MESSAGEBIRD_API_KEY');
        $originator = env('MESSAGEBIRD_ORIGINATOR', 'LMS-Platform');

        if (!$apiKey) {
            throw new Exception("MessageBird credentials are not configured.");
        }

        if (strtoupper($channel) === 'WHATSAPP') {
            // MessageBird WhatsApp API (Conversations API)
            $channelId = env('MESSAGEBIRD_WHATSAPP_CHANNEL_ID');
            $response = Http::withToken($apiKey, 'AccessKey')
                ->post("https://conversations.messagebird.com/v1/send", [
                    'to' => $to,
                    'type' => 'text',
                    'content' => [
                        'text' => $message
                    ],
                    'channelId' => $channelId
                ]);
        } else {
            // MessageBird standard SMS API
            $response = Http::withToken($apiKey, 'AccessKey')
                ->post("https://rest.messagebird.com/messages", [
                    'originator' => $originator,
                    'recipients' => [$to],
                    'body' => $message,
                ]);
        }

        if ($response->failed()) {
            throw new Exception("MessageBird API Error: " . $response->body());
        }

        return true;
    }
}
