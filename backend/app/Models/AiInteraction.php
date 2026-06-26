<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class AiInteraction extends Model
{
    use HasUuids;
    public $timestamps = false;
    protected $fillable = ['tenant_id', 'user_id', 'feature', 'prompt', 'response', 'context_id', 'tokens_used', 'created_at'];
    protected $casts = ['created_at' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function user() { return $this->belongsTo(User::class); }
}
