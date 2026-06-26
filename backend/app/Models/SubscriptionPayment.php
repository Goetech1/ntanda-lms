<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class SubscriptionPayment extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'institution_id',
        'subscription_id',
        'lipila_transaction_id',
        'reference_number',
        'amount',
        'currency',
        'payment_status',
        'payment_date',
        'invoice_number',
        'receipt_number',
    ];

    protected $casts = [
        'payment_date' => 'datetime',
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

    public function subscription(): BelongsTo
    {
        return $this->belongsTo(InstitutionSubscription::class);
    }
}
