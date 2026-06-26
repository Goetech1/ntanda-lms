<?php
namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class UserXpLog extends Model
{
    use HasUuids;

    public $timestamps = false;

    protected $table = 'user_xp_logs';

    protected $fillable = [
        'tenant_id',
        'user_id',
        'amount',
        'source_type',
        'source_id'
    ];

    public function tenant()
    {
        return $this->belongsTo(Tenant::class);
    }

    public function user()
    {
        return $this->belongsTo(User::class);
    }
}
