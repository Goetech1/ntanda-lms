<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;
use Illuminate\Database\Eloquent\Relations\HasMany;

class StudentPayment extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'institution_id',
        'student_id',
        'invoice_id',
        'amount',
        'payment_method_id',
        'reference_number',
        'provider_reference',
        'payment_date',
        'receipt_file',
        'notes',
        'status',
        'verified_by',
        'verified_at',
    ];

    protected $casts = [
        'payment_date' => 'datetime',
        'verified_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function paymentMethod(): BelongsTo
    {
        return $this->belongsTo(PaymentMethod::class);
    }

    public function verifier(): BelongsTo
    {
        return $this->belongsTo(User::class, 'verified_by');
    }

    public function auditLogs(): HasMany
    {
        return $this->hasMany(PaymentAuditLog::class, 'payment_id');
    }
}
