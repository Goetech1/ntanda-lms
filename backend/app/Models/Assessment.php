<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Assessment extends Model
{
    use HasUuids, SoftDeletes;
    protected $fillable = ['tenant_id', 'course_id', 'title', 'type', 'time_limit_minutes', 'total_points'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function course() { return $this->belongsTo(Course::class); }
    public function questions() { return $this->hasMany(Question::class); }
    public function submissions() { return $this->hasMany(Submission::class); }
}
