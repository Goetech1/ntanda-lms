<?php

namespace App\Services;

use App\Models\StudentAccountTransaction;
use App\Models\StudentPayment;

class StudentAccountLedgerService
{
    public function recordPayment(StudentPayment $payment, string $description = 'Payment posted to student account'): StudentAccountTransaction
    {
        return StudentAccountTransaction::firstOrCreate(
            [
                'student_payment_id' => $payment->id,
                'source_type' => 'PAYMENT',
                'direction' => 'CREDIT',
            ],
            [
                'tenant_id' => $payment->tenant_id,
                'institution_id' => $payment->institution_id,
                'student_id' => $payment->student_id,
                'status' => 'POSTED',
                'amount' => $payment->amount,
                'reference_number' => $payment->reference_number,
                'description' => $description,
                'posted_at' => now(),
            ]
        );
    }
}
