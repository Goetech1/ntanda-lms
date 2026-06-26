<?php

namespace App\Http\Controllers;

use App\Models\Notification;
use App\Services\NotificationManager;
use Illuminate\Http\Request;

class NotificationController extends Controller
{
    public function index(Request $request)
    {
        return response()->json(
            Notification::where('tenant_id', $request->user()->tenant_id)
                ->where('user_id', $request->user()->id)
                ->orderBy('created_at', 'desc')
                ->limit($request->query('limit', 50))
                ->get()
        );
    }

    public function store(Request $request, NotificationManager $notifier)
    {
        $request->validate(['userId' => 'required|uuid', 'title' => 'required', 'message' => 'required']);
        
        $channel = strtoupper($request->channel ?? 'IN_APP');

        $notification = Notification::create([
            'tenant_id' => $request->user()->tenant_id,
            'user_id' => $request->userId,
            'title' => $request->title,
            'message' => $request->message,
            'channel' => $channel,
            'metadata' => $request->metadata,
        ]);

        if (in_array($channel, ['SMS', 'WHATSAPP'])) {
            try {
                // Determine user phone number. In a real app, query User->profile->phone
                // We'll require it in the request or metadata for this example.
                $phone = $request->phone ?? $request->metadata['phone'] ?? null;
                $provider = $request->provider ?? 'twilio';

                if ($phone) {
                    $notifier->send($phone, $request->message, $channel, $provider);
                }
            } catch (\Exception $e) {
                // Log failure but don't fail the request since DB notification succeeded
                \Illuminate\Support\Facades\Log::error("SMS/WhatsApp failed: " . $e->getMessage());
            }
        }

        return response()->json($notification, 201);
    }

    public function markRead(Request $request, string $id)
    {
        $n = Notification::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail();
        $n->update(['is_read' => true]);
        return response()->json($n);
    }

    public function markAllRead(Request $request)
    {
        Notification::where('user_id', $request->user()->id)->where('is_read', false)->update(['is_read' => true]);
        return response()->json(['success' => true]);
    }

    public function destroy(Request $request, string $id)
    {
        Notification::where('id', $id)->where('user_id', $request->user()->id)->firstOrFail()->delete();
        return response()->json(['success' => true]);
    }
}
