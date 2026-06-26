<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentAuditLog extends Model
{
    use HasUuids;

    protected $fillable = [
        'payment_id',
        'action',
        'performed_by',
        'notes',
    ];

    public function payment(): BelongsTo
    {
        return $this->belongsTo(StudentPayment::class, 'payment_id');
    }

    public function performer(): BelongsTo
    {
        return $this->belongsTo(User::class, 'performed_by');
    }
}
