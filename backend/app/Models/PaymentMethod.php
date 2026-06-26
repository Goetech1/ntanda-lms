<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class PaymentMethod extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'institution_id',
        'method_name',
        'provider_type',
        'account_name',
        'account_number',
        'bank_name',
        'payment_instructions',
        'is_active',
        'integration_type',
        'integration_credentials',
    ];

    protected $casts = [
        'is_active' => 'boolean',
        'integration_credentials' => 'encrypted:array',
    ];

    protected $hidden = [
        'integration_credentials',
    ];

    public function tenant(): BelongsTo
    {
        return $this->belongsTo(Tenant::class);
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }
}
