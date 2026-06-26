<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Concerns\HasUuids;
use Illuminate\Database\Eloquent\SoftDeletes;
use Illuminate\Foundation\Auth\User as Authenticatable;
use Tymon\JWTAuth\Contracts\JWTSubject;

class User extends Authenticatable implements JWTSubject
{
    use HasUuids, SoftDeletes;

    protected $fillable = ['tenant_id', 'role_id', 'email', 'password_hash', 'full_name', 'avatar_url'];

    protected $hidden = ['password_hash'];

    // JWT Methods
    public function getJWTIdentifier() { return $this->getKey(); }
    public function getJWTCustomClaims()
    {
        return [
            'email' => $this->email,
            'role' => $this->role?->name,
            'permissions' => $this->role?->permissions?->map(fn($p) => "{$p->action}_{$p->resource}")->toArray() ?? [],
            'tenant_id' => $this->tenant_id,
        ];
    }

    // Override password field for Laravel auth
    public function getAuthPassword() { return $this->password_hash; }

    public function tenant() { return $this->belongsTo(Tenant::class); }
    public function role() { return $this->belongsTo(Role::class); }
    public function refreshTokens() { return $this->hasMany(RefreshToken::class); }
    public function studentProfile() { return $this->hasOne(StudentProfile::class); }
    public function instructorProfile() { return $this->hasOne(InstructorProfile::class); }
    public function courses() { return $this->hasMany(Course::class, 'instructor_id'); }
    public function enrollments() { return $this->hasMany(Enrollment::class); }
    public function examAttempts() { return $this->hasMany(ExamAttempt::class); }
    public function payments() { return $this->hasMany(Payment::class); }
    public function certificates() { return $this->hasMany(Certificate::class); }
    public function notifications() { return $this->hasMany(Notification::class); }
    public function attendance() { return $this->hasMany(Attendance::class); }
    public function submissions() { return $this->hasMany(Submission::class); }
    public function auditLogs() { return $this->hasMany(AuditLog::class); }
    public function aiInteractions() { return $this->hasMany(AiInteraction::class); }
}
