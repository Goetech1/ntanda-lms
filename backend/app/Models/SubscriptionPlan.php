<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class SubscriptionPlan extends Model
{
    use HasUuids;

    protected $fillable = [
        'name',
        'monthly_price',
        'annual_price',
        'max_students',
        'max_staff',
        'storage_limit',
        'feature_access',
        'is_active',
    ];

    protected $casts = [
        'feature_access' => 'array',
        'monthly_price' => 'decimal:2',
        'annual_price' => 'decimal:2',
        'is_active' => 'boolean',
    ];
}
