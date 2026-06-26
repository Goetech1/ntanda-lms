<?php

namespace App\Http\Controllers;

use App\Models\Payment;
use App\Models\Course;
use App\Models\User;
use App\Models\Enrollment;
use Illuminate\Http\Request;
use Illuminate\Support\Str;

class PaymentController extends Controller
{
    public function index(Request $request)
    {
        $tenantId = $request->user()->tenant_id;
        $role = $request->user()->role?->name;

        if (in_array($role, ['ADMIN', 'SUPER_ADMIN'])) {
            $payments = Payment::where('tenant_id', $tenantId)->with(['course', 'user'])->orderBy('created_at', 'desc')->get();
        } else {
            $payments = Payment::where('tenant_id', $tenantId)->where('user_id', $request->user()->id)->with('course')->orderBy('created_at', 'desc')->get();
        }

        return response()->json($payments);
    }

    public function checkoutStripe(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid', 'amount' => 'required|numeric']);
        $tenantId = $request->user()->tenant_id;
        $this->validateCheckout($tenantId, $request->user()->id, $request->courseId);

        $reference = 'stripe_' . Str::random(24);
        $payment = Payment::create([
            'tenant_id' => $tenantId,
            'user_id' => $request->user()->id,
            'course_id' => $request->courseId,
            'amount' => $request->amount,
            'stripe_session_id' => $reference,
            'status' => 'PENDING',
        ]);

        return response()->json([
            'sessionId' => $reference,
            'gateway' => 'MANUAL_INSTITUTION_PAYMENT',
            'payment' => $payment,
            'url' => "/student/billing?payment={$payment->id}",
            'message' => 'Payment record created. Complete payment using the institution payment instructions.',
        ]);
    }

    public function checkoutPaystack(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid', 'amount' => 'required|numeric']);
        $tenantId = $request->user()->tenant_id;
        $this->validateCheckout($tenantId, $request->user()->id, $request->courseId);

        $reference = 'ps_' . Str::random(24);
        Payment::create([
            'tenant_id' => $tenantId,
            'user_id' => $request->user()->id,
            'course_id' => $request->courseId,
            'amount' => $request->amount,
            'stripe_session_id' => $reference,
            'status' => 'PENDING',
        ]);

        return response()->json([
            'sessionId' => $reference,
            'gateway' => 'MANUAL_INSTITUTION_PAYMENT',
            'url' => "/student/billing?payment_reference={$reference}",
            'message' => 'Payment record created. Complete payment using the institution payment instructions.',
        ]);
    }

    public function checkoutFlutterwave(Request $request)
    {
        $request->validate(['courseId' => 'required|uuid', 'amount' => 'required|numeric']);
        $tenantId = $request->user()->tenant_id;
        $this->validateCheckout($tenantId, $request->user()->id, $request->courseId);

        $reference = 'flw_' . Str::random(24);
        Payment::create([
            'tenant_id' => $tenantId,
            'user_id' => $request->user()->id,
            'course_id' => $request->courseId,
            'amount' => $request->amount,
            'stripe_session_id' => $reference,
            'status' => 'PENDING',
        ]);

        return response()->json([
            'sessionId' => $reference,
            'gateway' => 'MANUAL_INSTITUTION_PAYMENT',
            'url' => "/student/billing?payment_reference={$reference}",
            'message' => 'Payment record created. Complete payment using the institution payment instructions.',
        ]);
    }

    public function webhookStripe(Request $request) { return response()->json(['received' => true]); }
    public function webhookPaystack(Request $request) { return response()->json(['received' => true]); }
    public function webhookFlutterwave(Request $request) { return response()->json(['received' => true]); }

    private function validateCheckout(string $tenantId, string $userId, string $courseId)
    {
        Course::where('id', $courseId)->where('tenant_id', $tenantId)->firstOrFail();
        if (Enrollment::where('tenant_id', $tenantId)->where('user_id', $userId)->where('course_id', $courseId)->exists()) {
            abort(400, 'User is already enrolled in this course');
        }
    }
}
