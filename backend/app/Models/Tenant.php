<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;
use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;

class Tenant extends Model
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['name', 'domain', 'subdomain', 'status', 'branding'];

    protected $casts = [
        'branding' => 'array',
    ];

    public function roles() { return $this->hasMany(Role::class); }
    public function users() { return $this->hasMany(User::class); }
    public function institution() { return $this->hasOne(Institution::class); }
    public function departments() { return $this->hasMany(Department::class); }
    public function academicSessions() { return $this->hasMany(AcademicSession::class); }
    public function courses() { return $this->hasMany(Course::class); }
    public function modules() { return $this->hasMany(CourseModule::class); }
    public function lessons() { return $this->hasMany(Lesson::class); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function assessments() { return $this->hasMany(Assessment::class); }
    public function questions() { return $this->hasMany(Question::class); }
    public function submissions() { return $this->hasMany(Submission::class); }
    public function payments() { return $this->hasMany(Payment::class); }
    public function certificates() { return $this->hasMany(Certificate::class); }
    public function auditLogs() { return $this->hasMany(AuditLog::class); }
    public function studentProfiles() { return $this->hasMany(StudentProfile::class); }
    public function instructorProfiles() { return $this->hasMany(InstructorProfile::class); }
    public function attendance() { return $this->hasMany(Attendance::class); }
    public function courseCategories() { return $this->hasMany(CourseCategory::class); }
    public function subscriptions() { return $this->hasMany(Subscription::class); }
    public function exams() { return $this->hasMany(Exam::class); }
    public function examAttempts() { return $this->hasMany(ExamAttempt::class); }
    public function notifications() { return $this->hasMany(Notification::class); }
    public function aiInteractions() { return $this->hasMany(AiInteraction::class); }
}
