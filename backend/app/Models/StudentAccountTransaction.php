<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\Relations\BelongsTo;

class StudentAccountTransaction extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'institution_id',
        'student_id',
        'student_payment_id',
        'direction',
        'status',
        'amount',
        'reference_number',
        'source_type',
        'description',
        'posted_at',
    ];

    protected $casts = [
        'posted_at' => 'datetime',
        'amount' => 'decimal:2',
    ];

    public function student(): BelongsTo
    {
        return $this->belongsTo(User::class, 'student_id');
    }

    public function institution(): BelongsTo
    {
        return $this->belongsTo(Institution::class);
    }

    public function studentPayment(): BelongsTo
    {
        return $this->belongsTo(StudentPayment::class);
    }
}
