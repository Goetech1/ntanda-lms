<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Notification extends Model
{
    use HasUuids;
    public $timestamps = false;
    protected $fillable = ['tenant_id', 'user_id', 'title', 'message', 'channel', 'is_read', 'metadata', 'created_at'];
    protected $casts = ['is_read' => 'boolean', 'metadata' => 'array', 'created_at' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function user() { return $this->belongsTo(User::class); }
}
