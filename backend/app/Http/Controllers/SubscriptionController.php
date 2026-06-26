<?php
namespace App\Http\Controllers;
use App\Models\Subscription;
use Illuminate\Http\Request;

class SubscriptionController extends Controller
{
    public function index(Request $request) { return response()->json(Subscription::where('tenant_id', $request->user()->tenant_id)->get()); }
    public function store(Request $request)
    {
        $request->validate(['planName' => 'required', 'stripeSubscriptionId' => 'required']);
        return response()->json(Subscription::create(['tenant_id' => $request->user()->tenant_id, 'plan_name' => $request->planName, 'stripe_subscription_id' => $request->stripeSubscriptionId, 'status' => $request->status ?? 'ACTIVE', 'current_period_end' => $request->currentPeriodEnd ?? now()->addYear()]), 201);
    }
    public function show(Request $request, string $id) { return response()->json(Subscription::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail()); }
    public function update(Request $request, string $id) { $s = Subscription::where('id', $id)->where('tenant_id', $request->user()->tenant_id)->firstOrFail(); $s->update($request->only(['plan_name', 'status', 'current_period_end'])); return response()->json($s); }
}
