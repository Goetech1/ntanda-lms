<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class RefreshToken extends Model
{
    use HasUuids;
    protected $fillable = ['user_id', 'token_hash', 'expires_at', 'is_revoked'];
    protected $casts = ['expires_at' => 'datetime', 'is_revoked' => 'boolean'];

    public function user() { return $this->belongsTo(User::class); }
}
