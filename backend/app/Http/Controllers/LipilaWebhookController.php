<?php

namespace App\Http\Controllers;

use Illuminate\Http\Request;
use App\Models\WebhookLog;
use App\Models\SubscriptionPayment;
use App\Models\InstitutionSubscription;
use App\Services\StudentAccountLedgerService;
use Illuminate\Support\Facades\Log;

class LipilaWebhookController extends Controller
{
    private StudentAccountLedgerService $ledgerService;

    public function __construct(StudentAccountLedgerService $ledgerService)
    {
        $this->ledgerService = $ledgerService;
    }

    public function handle(Request $request)
    {
        $rawBody = $request->getContent();
        
        $webhookId = $request->header('webhook-id');
        $webhookTimestamp = $request->header('webhook-timestamp');
        $webhookSignature = $request->header('webhook-signature');

        // Extract v1 signature
        $signatureParts = explode(',', $webhookSignature);
        $signatureHash = null;
        foreach ($signatureParts as $part) {
            if (str_starts_with($part, 'v1,')) {
                $signatureHash = substr($part, 3);
            }
        }

        $payloadArray = json_decode($rawBody, true) ?? [];
        $referenceId = $payloadArray['referenceId'] ?? null;
        $status = $payloadArray['status'] ?? null;
        $transactionId = $payloadArray['transactionId'] ?? null;

        // Determine the appropriate Webhook Secret
        $lipilaSecret = env('LIPILA_WEBHOOK_SECRET'); // Default for SaaS Subscriptions
        $paymentRecord = null;
        $isStudentPayment = false;

        if ($referenceId) {
            if (str_starts_with($referenceId, 'STU_')) {
                $isStudentPayment = true;
                $paymentRecord = \App\Models\StudentPayment::where('reference_number', $referenceId)->with('paymentMethod')->first();
                if ($paymentRecord && $paymentRecord->paymentMethod) {
                    $credentials = $paymentRecord->paymentMethod->integration_credentials;
                    if (!empty($credentials['lipila_webhook_secret'])) {
                        $lipilaSecret = $credentials['lipila_webhook_secret'];
                    }
                }
            } else if (str_starts_with($referenceId, 'SUB_')) {
                $paymentRecord = \App\Models\SubscriptionPayment::where('reference_number', $referenceId)->first();
            }
        }

        // Validate HMAC Signature
        $signedPayload = "{$webhookId}.{$webhookTimestamp}.{$rawBody}";
        $expectedSignature = hash_hmac('sha256', $signedPayload, $lipilaSecret ?? '');

        if (!hash_equals($expectedSignature, $signatureHash ?? '')) {
            Log::warning('Invalid Lipila Webhook Signature', [
                'expected' => $expectedSignature,
                'received' => $signatureHash,
                'referenceId' => $referenceId
            ]);
            return response()->json(['message' => 'Invalid signature'], 400);
        }

        // Log Webhook
        $log = WebhookLog::create([
            'provider' => 'Lipila',
            'payload' => $payloadArray,
        ]);

        try {
            if ($paymentRecord) {
                if ($isStudentPayment) {
                    $paymentRecord->provider_reference = $transactionId;
                    
                    if ($status === 'SUCCESS' || $status === 'successful') {
                        $paymentRecord->status = 'Approved';
                        $paymentRecord->verified_at = now();
                        $this->ledgerService->recordPayment($paymentRecord, 'Automated mobile money payment posted to the student account.');
                        
                        \App\Models\PaymentAuditLog::create([
                            'payment_id' => $paymentRecord->id,
                            'action' => 'PAYMENT_APPROVED_AUTOMATED',
                            'performed_by' => null,
                            'notes' => 'Automated payment gateway verification.',
                        ]);
                    } elseif ($status === 'FAILED' || $status === 'failed') {
                        $paymentRecord->status = 'Rejected';
                    }
                    $paymentRecord->save();
                } else {
                    $paymentRecord->lipila_transaction_id = $transactionId;
                    
                    if ($status === 'SUCCESS' || $status === 'successful') {
                        $paymentRecord->payment_status = 'Successful';
                        $paymentRecord->payment_date = now();
                        
                        // Update Subscription Status
                        $subscription = InstitutionSubscription::find($paymentRecord->subscription_id);
                        if ($subscription) {
                            $subscription->status = 'ACTIVE';
                            $subscription->save();
                        }
                    } elseif ($status === 'FAILED' || $status === 'failed') {
                        $paymentRecord->payment_status = 'Failed';
                    }
                    $paymentRecord->save();
                }
            }

            $log->update(['processed' => true, 'response' => 'Success']);
            return response()->json(['message' => 'Webhook handled']);

        } catch (\Exception $e) {
            $log->update(['processed' => false, 'response' => $e->getMessage()]);
            return response()->json(['message' => 'Internal error'], 500);
        }
    }
}
