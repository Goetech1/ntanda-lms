<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class WebhookSubscription extends Model
{
    use HasUuids;

    protected $fillable = [
        'tenant_id',
        'url',
        'event_type',
        'secret',
        'is_active'
    ];

    protected $casts = [
        'is_active' => 'boolean'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }
}
