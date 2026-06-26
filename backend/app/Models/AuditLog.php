<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AuditLog extends Model
{
    use HasUuids;
    public $timestamps = false;
    protected $fillable = ['tenant_id', 'user_id', 'action', 'entity_type', 'entity_id', 'previous_state', 'new_state', 'ip_address', 'created_at'];
    protected $casts = ['previous_state' => 'array', 'new_state' => 'array', 'created_at' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function user() { return $this->belongsTo(User::class); }
}
