<?php

namespace App\Services;

use App\Models\WebhookSubscription;
use Illuminate\Support\Facades\Http;
use Illuminate\Support\Facades\Log;

class WebhookSender
{
    /**
     * Dispatch webhook event to all active subscriptions of a tenant.
     *
     * @param string $tenantId
     * @param string $eventType
     * @param array $payload
     * @return void
     */
    public static function dispatch(string $tenantId, string $eventType, array $payload): void
    {
        // Fetch active subscriptions for this tenant and event type
        $subscriptions = WebhookSubscription::where('tenant_id', $tenantId)
            ->where('event_type', $eventType)
            ->where('is_active', true)
            ->get();

        foreach ($subscriptions as $sub) {
            // Dispatch async or sync request. Let's do a request with a short timeout.
            // In a production app this would be queued, but doing it in a try-catch with timeout works perfectly here.
            dispatch(function () use ($sub, $eventType, $payload) {
                try {
                    $timestamp = time();
                    $body = json_encode([
                        'event' => $eventType,
                        'timestamp' => $timestamp,
                        'data' => $payload
                    ]);

                    $signature = hash_hmac('sha256', $body, $sub->secret);

                    Http::withHeaders([
                        'Content-Type' => 'application/json',
                        'X-Ntanda-Signature' => $signature,
                        'X-Ntanda-Timestamp' => $timestamp,
                    ])->timeout(5)->post($sub->url, json_decode($body, true));

                } catch (\Exception $e) {
                    Log::error("Failed to deliver webhook to {$sub->url}: " . $e->getMessage());
                }
            })->afterResponse(); // Use Laravel afterResponse to avoid blocking the user request
        }
    }
}
