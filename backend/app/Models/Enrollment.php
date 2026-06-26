<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class Enrollment extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'user_id', 'course_id', 'progress_percentage', 'completed_at'];
    protected $casts = ['completed_at' => 'datetime'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function user() { return $this->belongsTo(User::class); }
    public function course() { return $this->belongsTo(Course::class); }
}
