<?php

namespace App\Http\Controllers;

use App\Models\PaymentMethod;
use Illuminate\Http\Request;

class PaymentMethodController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $methods = PaymentMethod::where('tenant_id', $tenantId)->get();
        return response()->json($methods);
    }

    public function store(Request $request)
    {
        $request->validate([
            'method_name' => 'required|string|max:255',
            'provider_type' => 'required|string|in:BANK_ACCOUNT,MTN_MOMO,AIRTEL_MONEY,LIPILA,OTHER',
            'account_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'payment_instructions' => 'nullable|string',
            'is_active' => 'boolean',
            'integration_type' => 'nullable|string|in:MANUAL,LIPILA',
            'integration_credentials' => 'nullable|array',
        ]);

        $tenantId = $request->user()->tenant_id;
        // Default to the first institution of this tenant, or look up by tenant
        $institutionId = \App\Models\Institution::where('tenant_id', $tenantId)->first()->id;
        $providerType = $request->provider_type;
        $integrationType = $providerType === 'LIPILA'
            ? 'LIPILA'
            : ($request->integration_type ?? 'MANUAL');

        $method = PaymentMethod::create([
            'tenant_id' => $tenantId,
            'institution_id' => $institutionId,
            'method_name' => $request->method_name,
            'provider_type' => $providerType,
            'account_name' => $request->account_name,
            'account_number' => $request->account_number,
            'bank_name' => $request->bank_name,
            'payment_instructions' => $request->payment_instructions,
            'is_active' => $request->is_active ?? true,
            'integration_type' => $integrationType,
            'integration_credentials' => $request->integration_credentials,
        ]);

        return response()->json($method, 201);
    }

    public function show(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $method = PaymentMethod::where('tenant_id', $tenantId)->where('id', $id)->firstOrFail();
        return response()->json($method);
    }

    public function update(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $method = PaymentMethod::where('tenant_id', $tenantId)->where('id', $id)->firstOrFail();

        $request->validate([
            'method_name' => 'sometimes|required|string|max:255',
            'provider_type' => 'sometimes|required|string|in:BANK_ACCOUNT,MTN_MOMO,AIRTEL_MONEY,LIPILA,OTHER',
            'account_name' => 'nullable|string|max:255',
            'account_number' => 'nullable|string|max:255',
            'bank_name' => 'nullable|string|max:255',
            'payment_instructions' => 'nullable|string',
            'is_active' => 'boolean',
            'integration_type' => 'nullable|string|in:MANUAL,LIPILA',
            'integration_credentials' => 'nullable|array',
        ]);

        $data = $request->only([
            'method_name', 'provider_type', 'account_name', 'account_number', 'bank_name', 'payment_instructions', 'is_active', 'integration_type'
        ]);

        if (!empty($data['provider_type']) && $data['provider_type'] === 'LIPILA') {
            $data['integration_type'] = 'LIPILA';
        }
        
        if ($request->has('integration_credentials') && !empty($request->integration_credentials)) {
            $data['integration_credentials'] = $request->integration_credentials;
        }

        $method->update($data);

        return response()->json($method);
    }

    public function destroy(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $method = PaymentMethod::where('tenant_id', $tenantId)->where('id', $id)->firstOrFail();
        $method->delete();

        return response()->json(['message' => 'Payment method deleted successfully']);
    }
}
