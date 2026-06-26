<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class ExamAttempt extends Model
{
    use HasUuids;
    public $timestamps = false;
    protected $fillable = ['tenant_id', 'exam_id', 'user_id', 'started_at', 'completed_at', 'score', 'anti_cheat_flags'];
    protected $casts = ['started_at' => 'datetime', 'completed_at' => 'datetime', 'anti_cheat_flags' => 'array'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function exam() { return $this->belongsTo(Exam::class); }
    public function user() { return $this->belongsTo(User::class); }
}
