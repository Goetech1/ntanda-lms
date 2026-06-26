<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Subscription extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'plan_name', 'stripe_subscription_id', 'status', 'current_period_end'];
    protected $casts = ['current_period_end' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
}
