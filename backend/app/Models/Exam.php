<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Exam extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'course_id', 'title', 'scheduled_at', 'duration_minutes', 'require_webcam', 'secure_browser'];
    protected $casts = ['scheduled_at' => 'datetime', 'require_webcam' => 'boolean', 'secure_browser' => 'boolean'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function course() { return $this->belongsTo(Course::class); }
    public function attempts() { return $this->hasMany(ExamAttempt::class); }
}
