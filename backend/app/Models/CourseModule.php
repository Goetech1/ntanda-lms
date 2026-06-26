<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;

class CourseModule extends Model
{
    use HasUuids;
    protected $fillable = ['tenant_id', 'course_id', 'title', 'order_index'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function course() { return $this->belongsTo(Course::class); }
    public function lessons() { return $this->hasMany(Lesson::class, 'module_id'); }
}
