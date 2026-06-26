<?php
namespace App\Models;
use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Course extends Model
{
    use HasUuids, SoftDeletes;
    protected $fillable = ['tenant_id', 'instructor_id', 'title', 'description', 'thumbnail_url', 'status', 'price', 'category_id', 'version'];
    protected $casts = ['price' => 'decimal:2'];

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function instructor() { return $this->belongsTo(User::class, 'instructor_id'); }
    public function category() { return $this->belongsTo(CourseCategory::class, 'category_id'); }
    public function modules() { return $this->hasMany(CourseModule::class); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function assessments() { return $this->hasMany(Assessment::class); }
    public function exams() { return $this->hasMany(Exam::class); }
    public function payments() { return $this->hasMany(Payment::class); }
    public function certificates() { return $this->hasMany(Certificate::class); }
    public function attendance() { return $this->hasMany(Attendance::class); }
}
