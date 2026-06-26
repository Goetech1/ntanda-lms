<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Submission extends Model
{
    use HasUuids;
    public $timestamps = false;
    protected $fillable = ['tenant_id', 'assessment_id', 'user_id', 'status', 'score', 'answers', 'submitted_at'];
    protected $casts = ['answers' => 'array', 'submitted_at' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function assessment() { return $this->belongsTo(Assessment::class); }
    public function user() { return $this->belongsTo(User::class); }
}
