<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Payment extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'user_id', 'course_id', 'stripe_session_id', 'amount', 'currency', 'status'];
    protected $casts = ['amount' => 'decimal:2'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function course() { return $this->belongsTo(Course::class); }
}
