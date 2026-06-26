<?php

namespace App\Http\Controllers;

use App\Models\StudentPayment;
use App\Models\PaymentAuditLog;
use App\Models\PaymentMethod;
use App\Services\StudentAccountLedgerService;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Illuminate\Support\Str;
use Illuminate\Support\Facades\Http;

class StudentPaymentController extends Controller
{
    private StudentAccountLedgerService $ledgerService;

    public function __construct(StudentAccountLedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function index(Request $request)
    {
        $user = $request->user();
        $tenantId = $user->tenant_id;
        $role = $user->role?->name;

        if (in_array($role, ['ADMIN', 'SUPER_ADMIN', 'FINANCE_OFFICER'])) {
            $payments = StudentPayment::where('tenant_id', $tenantId)
                ->with(['student', 'paymentMethod', 'verifier'])
                ->orderBy('created_at', 'desc')
                ->get();
        } else {
            $payments = StudentPayment::where('tenant_id', $tenantId)
                ->where('student_id', $user->id)
                ->with(['paymentMethod', 'verifier'])
                ->orderBy('created_at', 'desc')
                ->get();
        }

        return response()->json($payments);
    }

    public function store(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'payment_method_id' => 'required|uuid',
            'reference_number' => 'nullable|string',
            'payment_date' => 'required|date',
            'receipt_file' => 'nullable|file|mimes:jpeg,png,pdf|max:5120',
            'notes' => 'nullable|string',
            'invoice_id' => 'nullable|string',
        ]);

        $user = $request->user();
        $tenantId = $user->tenant_id;
        $institutionId = \App\Models\Institution::where('tenant_id', $tenantId)->first()->id;

        $receiptPath = null;
        if ($request->hasFile('receipt_file')) {
            $receiptPath = $request->file('receipt_file')->store('receipts', 'r2');
        }

        $payment = StudentPayment::create([
            'tenant_id' => $tenantId,
            'institution_id' => $institutionId,
            'student_id' => $user->id,
            'amount' => $request->amount,
            'payment_method_id' => $request->payment_method_id,
            'reference_number' => $request->reference_number,
            'payment_date' => $request->payment_date,
            'receipt_file' => $receiptPath ? Storage::disk('r2')->url($receiptPath) : null,
            'notes' => $request->notes,
            'invoice_id' => $request->invoice_id,
            'status' => 'Pending',
        ]);

        PaymentAuditLog::create([
            'payment_id' => $payment->id,
            'action' => 'PAYMENT_SUBMITTED',
            'performed_by' => $user->id,
            'notes' => 'Student submitted payment proof.',
        ]);

        return response()->json($payment, 201);
    }

    public function review(Request $request, $id)
    {
        $request->validate([
            'status' => 'required|in:Approved,Rejected,Partially Paid',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        $tenantId = $user->tenant_id;
        
        $payment = StudentPayment::where('tenant_id', $tenantId)->where('id', $id)->firstOrFail();
        
        $payment->update([
            'status' => $request->status,
            'verified_by' => $user->id,
            'verified_at' => now(),
        ]);

        if ($request->status === 'Approved') {
            $this->ledgerService->recordPayment($payment, 'Manual payment approved and posted to the student account.');
        }

        PaymentAuditLog::create([
            'payment_id' => $payment->id,
            'action' => 'PAYMENT_' . strtoupper(str_replace(' ', '_', $request->status)),
            'performed_by' => $user->id,
            'notes' => $request->notes,
        ]);

        return response()->json($payment);
    }

    public function show(Request $request, $id)
    {
        $tenantId = $request->user()->tenant_id;
        $payment = StudentPayment::where('tenant_id', $tenantId)
            ->where('id', $id)
            ->with(['student', 'paymentMethod', 'verifier', 'auditLogs', 'auditLogs.performer'])
            ->firstOrFail();

        return response()->json($payment);
    }

    public function initiateCollection(Request $request)
    {
        $request->validate([
            'amount' => 'required|numeric',
            'payment_method_id' => 'required|uuid',
            'mobile_number' => 'required|string',
            'notes' => 'nullable|string',
        ]);

        $user = $request->user();
        $tenantId = $user->tenant_id;
        $institutionId = \App\Models\Institution::where('tenant_id', $tenantId)->first()->id;

        $paymentMethod = PaymentMethod::where('tenant_id', $tenantId)->findOrFail($request->payment_method_id);

        if ($paymentMethod->integration_type !== 'LIPILA') {
            return response()->json(['message' => 'This payment method does not support automated collection.'], 400);
        }

        $credentials = $paymentMethod->integration_credentials;
        if (!$credentials || empty($credentials['lipila_api_key'])) {
            return response()->json(['message' => 'Institution automated payment gateway is not properly configured.'], 400);
        }

        $reference = 'STU_' . strtoupper(Str::random(12));

        $payment = StudentPayment::create([
            'tenant_id' => $tenantId,
            'institution_id' => $institutionId,
            'student_id' => $user->id,
            'amount' => $request->amount,
            'payment_method_id' => $paymentMethod->id,
            'reference_number' => $reference,
            'payment_date' => now(),
            'notes' => $request->notes,
            'status' => 'Pending',
        ]);

        PaymentAuditLog::create([
            'payment_id' => $payment->id,
            'action' => 'PAYMENT_INITIATED_AUTOMATED',
            'performed_by' => $user->id,
            'notes' => 'Student initiated automated MoMo collection.',
        ]);

        // Initiate Lipila Collection
        $lipilaBaseUrl = env('LIPILA_BASE_URL', 'https://api.lipila.dev/v1');
        
        $payload = [
            'referenceId' => $reference,
            'amount' => $request->amount,
            'currency' => 'ZMW',
            'narration' => 'Student Fees Payment',
            'accountNumber' => $request->mobile_number,
            'email' => $user->email,
        ];

        try {
            $response = Http::withHeaders([
                'x-api-key' => $credentials['lipila_api_key'],
                'callbackUrl' => route('lipila.webhook'),
                'Content-Type' => 'application/json',
            ])->post($lipilaBaseUrl . '/collections/momo', $payload);

            if ($response->successful()) {
                $gatewayRef = $response->json('transactionId');
                if ($gatewayRef) {
                    $payment->update(['provider_reference' => $gatewayRef]);
                }

                if (($response->json('status') ?? null) === 'SUCCESS' || ($response->json('status') ?? null) === 'successful') {
                    $payment->update([
                        'status' => 'Approved',
                        'verified_at' => now(),
                    ]);
                    $this->ledgerService->recordPayment($payment, 'Automated mobile money payment posted to the student account.');
                }

                return response()->json([
                    'message' => 'Payment initiated successfully. Please enter your PIN on your phone.',
                    'reference' => $reference,
                    'payment' => $payment
                ]);
            }

            return response()->json([
                'message' => 'Failed to initiate payment with the gateway.',
                'error' => $response->json(),
            ], 400);

        } catch (\Exception $e) {
            \Illuminate\Support\Facades\Log::error('Lipila Collection Error: ' . $e->getMessage());
            return response()->json([
                'message' => 'Payment gateway is currently unavailable. Please try again later or use manual payment.',
            ], 500);
        }
    }
}
