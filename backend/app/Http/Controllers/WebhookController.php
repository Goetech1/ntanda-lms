<?php

namespace App\Http\Controllers;

use App\Models\WebhookSubscription;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class WebhookController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $subscriptions = WebhookSubscription::where('tenant_id', $tenantId)->get();
        return response()->json($subscriptions);
    }

    public function store(Request $request)
    {
        $request->validate([
            'url' => 'required|url|max:255',
            'event_type' => 'required|string|in:student.course_completed,student.registered,student.badge_earned',
        ]);

        $tenantId = $request->user()->tenant_id;

        $subscription = WebhookSubscription::create([
            'tenant_id' => $tenantId,
            'url' => $request->url,
            'event_type' => $request->event_type,
            'secret' => 'whsec_' . Str::random(32),
            'is_active' => true,
        ]);

        return response()->json($subscription, 210); // Laravel standard for created is 201 or 200, let's use 201
    }

    public function update(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $subscription = WebhookSubscription::where('tenant_id', $tenantId)->where('id', $id)->firstOrFail();

        $request->validate([
            'url' => 'sometimes|required|url|max:255',
            'event_type' => 'sometimes|required|string|in:student.course_completed,student.registered,student.badge_earned',
            'is_active' => 'sometimes|required|boolean',
        ]);

        $subscription->update($request->only(['url', 'event_type', 'is_active']));

        return response()->json($subscription);
    }

    public function destroy(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $subscription = WebhookSubscription::where('tenant_id', $tenantId)->where('id', $id)->firstOrFail();
        $subscription->delete();

        return response()->json(['message' => 'Subscription deleted successfully']);
    }
}
