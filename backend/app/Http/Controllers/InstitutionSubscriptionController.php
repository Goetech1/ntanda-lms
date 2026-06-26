<?php

namespace App\Http\Controllers;

use App\Models\InstitutionSubscription;
use App\Models\SubscriptionPlan;
use App\Models\SubscriptionPayment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class InstitutionSubscriptionController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $subscription = InstitutionSubscription::where('tenant_id', $tenantId)
            ->with(['plan', 'payments'])
            ->latest('created_at')
            ->first();

        return response()->json($subscription);
    }

    public function initiatePayment(Request $request)
    {
        $request->validate([
            'plan_id' => 'required|uuid',
            'billing_cycle' => 'required|in:MONTHLY,ANNUALLY',
            'payment_provider' => 'required|in:BANK_ACCOUNT,MTN_MOMO,AIRTEL_MONEY,LIPILA',
            'account_number' => 'required_if:payment_provider,BANK_ACCOUNT|string',
            'mobile_number' => 'required_if:payment_provider,MTN_MOMO|string|required_if:payment_provider,AIRTEL_MONEY|string|required_if:payment_provider,LIPILA|string',
            'account_name' => 'nullable|string',
            'bank_name' => 'nullable|string',
        ]);

        $tenantId = $request->user()->tenant_id;
        $institutionId = \App\Models\Institution::where('tenant_id', $tenantId)->first()->id;

        $plan = SubscriptionPlan::findOrFail($request->plan_id);
        $amount = $request->billing_cycle === 'ANNUALLY' ? $plan->annual_price : $plan->monthly_price;
        $reference = 'SUB_' . strtoupper(Str::random(12));

        // Create pending subscription record or use existing
        $subscription = InstitutionSubscription::updateOrCreate(
            ['tenant_id' => $tenantId, 'institution_id' => $institutionId],
            [
                'plan_id' => $plan->id,
                'billing_cycle' => $request->billing_cycle,
                'start_date' => now(),
                'end_date' => $request->billing_cycle === 'ANNUALLY' ? now()->addYear() : now()->addMonth(),
                'status' => 'TRIAL', // Remains TRIAL or PAST_DUE until paid
            ]
        );

        $payment = SubscriptionPayment::create([
            'tenant_id' => $tenantId,
            'institution_id' => $institutionId,
            'subscription_id' => $subscription->id,
            'reference_number' => $reference,
            'amount' => $amount,
            'payment_status' => 'Pending',
        ]);

        $lipilaBaseUrl = env('LIPILA_BASE_URL', 'https://api.lipila.dev/v1');
        $lipilaApiKey = env('LIPILA_API_KEY');

        if ($request->payment_provider === 'BANK_ACCOUNT') {
            return response()->json([
                'message' => 'Bank transfer payment recorded as pending. Reconcile it after funds are received.',
                'reference' => $reference,
                'payment' => $payment,
            ], 201);
        }

        if (!$lipilaApiKey) {
            return response()->json([
                'message' => 'Lipila API key is not configured, so mobile money collection cannot be initiated.',
                'reference' => $reference,
            ], 503);
        }
        
        $payload = [];
        $endpoint = '';

        $endpoint = '/collections/momo';
        $payload = [
            'referenceId' => $reference,
            'amount' => $amount,
            'currency' => 'ZMW',
            'narration' => 'Subscription Payment',
            'accountNumber' => $request->mobile_number,
            'email' => $request->user()->email,
        ];

        try {
            $response = Http::withHeaders([
                'x-api-key' => $lipilaApiKey,
                'callbackUrl' => route('lipila.webhook'),
                'Content-Type' => 'application/json',
            ])->post($lipilaBaseUrl . $endpoint, $payload);

            if ($response->successful()) {
                return response()->json([
                    'message' => 'Payment initiated successfully',
                    'reference' => $reference,
                    'gateway_response' => $response->json(),
                ]);
            }

            return response()->json([
                'message' => 'Payment gateway rejected the collection request',
                'reference' => $reference,
                'gateway_response' => $response->json(),
            ], $response->status());

        } catch (\Exception $e) {
            return response()->json([
                'message' => 'Payment gateway request failed',
                'reference' => $reference,
                'error' => $e->getMessage(),
            ], 502);
        }
    }
}
