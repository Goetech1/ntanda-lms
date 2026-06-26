<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        // ─── Roles ───────────────────────────────────────────────────────
        Schema::create('roles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->nullable();
            $table->string('name');
            $table->string('description')->nullable();
            $table->boolean('is_system')->default(false);
            $table->timestamps();
            $table->unique(['tenant_id', 'name']);
        });

        // ─── Permissions ─────────────────────────────────────────────────
        Schema::create('permissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('action');
            $table->string('resource');
            $table->string('description')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->unique(['action', 'resource']);
        });

        // ─── Role-Permission Pivot ───────────────────────────────────────
        Schema::create('role_permissions', function (Blueprint $table) {
            $table->uuid('role_id');
            $table->uuid('permission_id');
            $table->primary(['role_id', 'permission_id']);
            $table->foreign('role_id')->references('id')->on('roles')->onDelete('cascade');
            $table->foreign('permission_id')->references('id')->on('permissions')->onDelete('cascade');
        });

        // ─── Tenants ─────────────────────────────────────────────────────
        Schema::create('tenants', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->string('domain')->unique();
            $table->string('subdomain')->unique();
            $table->enum('status', ['ACTIVE', 'INACTIVE', 'SUSPENDED'])->default('ACTIVE');
            $table->json('branding')->nullable();
            $table->timestamps();
            $table->softDeletes('deleted_at');
        });

        // Add foreign key for roles -> tenants
        Schema::table('roles', function (Blueprint $table) {
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // ─── Institutions ────────────────────────────────────────────────
        Schema::create('institutions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->unique();
            $table->string('name');
            $table->string('address')->nullable();
            $table->string('contact_email')->nullable();
            $table->string('contact_phone')->nullable();
            $table->string('motto')->nullable();
            $table->json('settings')->nullable();
            $table->timestamps();
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // ─── Departments ─────────────────────────────────────────────────
        Schema::create('departments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('institution_id');
            $table->string('name');
            $table->string('code');
            $table->string('description')->nullable();
            $table->timestamps();
            $table->unique(['institution_id', 'code']);
            $table->index('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
        });

        // ─── Academic Sessions ───────────────────────────────────────────
        Schema::create('academic_sessions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('institution_id');
            $table->string('name');
            $table->date('start_date');
            $table->date('end_date');
            $table->boolean('is_active')->default(false);
            $table->timestamps();
            $table->index('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
        });

        // ─── Users ───────────────────────────────────────────────────────
        Schema::create('users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->nullable();
            $table->uuid('role_id');
            $table->string('email');
            $table->string('password_hash');
            $table->string('full_name');
            $table->string('avatar_url')->nullable();
            $table->timestamps();
            $table->softDeletes('deleted_at');
            $table->unique(['tenant_id', 'email']);
            $table->index(['tenant_id', 'email']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('role_id')->references('id')->on('roles');
        });

        // ─── Refresh Tokens ─────────────────────────────────────────────
        Schema::create('refresh_tokens', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->string('token_hash');
            $table->timestamp('expires_at');
            $table->boolean('is_revoked')->default(false);
            $table->timestamps();
            $table->index('user_id');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ─── Course Categories ───────────────────────────────────────────
        Schema::create('course_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('name');
            $table->string('slug');
            $table->string('description')->nullable();
            $table->timestamps();
            $table->unique(['tenant_id', 'slug']);
            $table->index('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // ─── Courses ─────────────────────────────────────────────────────
        Schema::create('courses', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('instructor_id');
            $table->string('title');
            $table->text('description');
            $table->string('thumbnail_url')->nullable();
            $table->enum('status', ['DRAFT', 'PUBLISHED', 'ARCHIVED'])->default('DRAFT');
            $table->decimal('price', 10, 2);
            $table->uuid('category_id')->nullable();
            $table->integer('version')->default(1);
            $table->timestamps();
            $table->softDeletes('deleted_at');
            $table->index(['tenant_id', 'status']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('instructor_id')->references('id')->on('users');
            $table->foreign('category_id')->references('id')->on('course_categories')->nullOnDelete();
        });

        // ─── Course Modules ─────────────────────────────────────────────
        Schema::create('course_modules', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('course_id');
            $table->string('title');
            $table->integer('order_index');
            $table->timestamps();
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // ─── Lessons ─────────────────────────────────────────────────────
        Schema::create('lessons', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('module_id');
            $table->string('title');
            $table->text('content');
            $table->string('video_url')->nullable();
            $table->integer('order_index');
            $table->timestamps();
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('module_id')->references('id')->on('course_modules')->onDelete('cascade');
        });

        // ─── Enrollments ─────────────────────────────────────────────────
        Schema::create('enrollments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id');
            $table->uuid('course_id');
            $table->integer('progress_percentage')->default(0);
            $table->timestamp('completed_at')->nullable();
            $table->timestamps();
            $table->unique(['tenant_id', 'user_id', 'course_id']);
            $table->index(['tenant_id', 'user_id']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // ─── Assessments ─────────────────────────────────────────────────
        Schema::create('assessments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('course_id');
            $table->string('title');
            $table->enum('type', ['QUIZ', 'ASSIGNMENT', 'EXAM']);
            $table->integer('time_limit_minutes')->nullable();
            $table->integer('total_points');
            $table->timestamps();
            $table->softDeletes('deleted_at');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // ─── Questions ───────────────────────────────────────────────────
        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('assessment_id');
            $table->text('content');
            $table->json('options');
            $table->json('correct_answer');
            $table->integer('points');
            $table->integer('order_index');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('assessment_id')->references('id')->on('assessments')->onDelete('cascade');
        });

        // ─── Submissions ─────────────────────────────────────────────────
        Schema::create('submissions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('assessment_id');
            $table->uuid('user_id');
            $table->enum('status', ['PENDING', 'GRADED', 'RETURNED'])->default('PENDING');
            $table->integer('score')->nullable();
            $table->json('answers');
            $table->timestamp('submitted_at')->useCurrent();
            $table->index(['tenant_id', 'assessment_id', 'user_id']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('assessment_id')->references('id')->on('assessments')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ─── Payments ────────────────────────────────────────────────────
        Schema::create('payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id');
            $table->uuid('course_id')->nullable();
            $table->string('stripe_session_id')->unique();
            $table->decimal('amount', 10, 2);
            $table->string('currency')->default('USD');
            $table->enum('status', ['PENDING', 'COMPLETED', 'FAILED', 'REFUNDED'])->default('PENDING');
            $table->timestamps();
            $table->index(['tenant_id', 'status']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // ─── Certificates ────────────────────────────────────────────────
        Schema::create('certificates', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id');
            $table->uuid('course_id');
            $table->timestamp('issued_at')->useCurrent();
            $table->string('certificate_url');
            $table->string('validation_code')->unique();
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // ─── Audit Logs ──────────────────────────────────────────────────
        Schema::create('audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id');
            $table->string('action');
            $table->string('entity_type');
            $table->string('entity_id');
            $table->json('previous_state')->nullable();
            $table->json('new_state')->nullable();
            $table->string('ip_address');
            $table->timestamp('created_at')->useCurrent();
            $table->index(['tenant_id', 'entity_type', 'entity_id']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ─── Student Profiles ────────────────────────────────────────────
        Schema::create('student_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id')->unique();
            $table->string('student_id_string')->nullable();
            $table->date('date_of_birth')->nullable();
            $table->json('emergency_contact')->nullable();
            $table->string('address')->nullable();
            $table->decimal('gpa', 4, 2)->nullable();
            $table->timestamps();
            $table->index(['tenant_id', 'student_id_string']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ─── Instructor Profiles ─────────────────────────────────────────
        Schema::create('instructor_profiles', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id')->unique();
            $table->text('bio')->nullable();
            $table->json('expertise')->nullable();
            $table->json('qualifications')->nullable();
            $table->json('teaching_subjects')->nullable();
            $table->decimal('rating', 3, 2)->default(0);
            $table->integer('total_students')->default(0);
            $table->timestamps();
            $table->index('tenant_id');
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ─── Attendance ──────────────────────────────────────────────────
        Schema::create('attendance', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('course_id');
            $table->uuid('user_id');
            $table->date('date');
            $table->enum('status', ['PRESENT', 'ABSENT', 'LATE', 'EXCUSED'])->default('PRESENT');
            $table->string('remarks')->nullable();
            $table->timestamps();
            $table->unique(['tenant_id', 'course_id', 'user_id', 'date']);
            $table->index(['tenant_id', 'course_id']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ─── Subscriptions ───────────────────────────────────────────────
        Schema::create('subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('plan_name');
            $table->string('stripe_subscription_id')->unique();
            $table->enum('status', ['ACTIVE', 'PAST_DUE', 'CANCELED'])->default('ACTIVE');
            $table->timestamp('current_period_end');
            $table->timestamps();
            $table->index(['tenant_id', 'status']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        // ─── Exams ───────────────────────────────────────────────────────
        Schema::create('exams', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('course_id');
            $table->string('title');
            $table->timestamp('scheduled_at')->nullable();
            $table->integer('duration_minutes');
            $table->boolean('require_webcam')->default(false);
            $table->boolean('secure_browser')->default(false);
            $table->timestamps();
            $table->index(['tenant_id', 'course_id']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });

        // ─── Exam Attempts ───────────────────────────────────────────────
        Schema::create('exam_attempts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('exam_id');
            $table->uuid('user_id');
            $table->timestamp('started_at')->useCurrent();
            $table->timestamp('completed_at')->nullable();
            $table->integer('score')->nullable();
            $table->json('anti_cheat_flags')->nullable();
            $table->index(['tenant_id', 'exam_id', 'user_id']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('exam_id')->references('id')->on('exams')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ─── Notifications ───────────────────────────────────────────────
        Schema::create('notifications', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id');
            $table->string('title');
            $table->text('message');
            $table->enum('channel', ['IN_APP', 'EMAIL', 'SMS', 'WHATSAPP'])->default('IN_APP');
            $table->boolean('is_read')->default(false);
            $table->json('metadata')->nullable();
            $table->timestamp('created_at')->useCurrent();
            $table->index(['tenant_id', 'user_id', 'is_read']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });

        // ─── AI Interactions ─────────────────────────────────────────────
        Schema::create('ai_interactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('user_id');
            $table->enum('feature', ['TUTOR', 'QUIZ_GENERATOR', 'RECOMMENDATION']);
            $table->text('prompt');
            $table->text('response');
            $table->string('context_id')->nullable();
            $table->integer('tokens_used')->default(0);
            $table->timestamp('created_at')->useCurrent();
            $table->index(['tenant_id', 'user_id', 'feature']);
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('ai_interactions');
        Schema::dropIfExists('notifications');
        Schema::dropIfExists('exam_attempts');
        Schema::dropIfExists('exams');
        Schema::dropIfExists('subscriptions');
        Schema::dropIfExists('attendance');
        Schema::dropIfExists('instructor_profiles');
        Schema::dropIfExists('student_profiles');
        Schema::dropIfExists('audit_logs');
        Schema::dropIfExists('certificates');
        Schema::dropIfExists('payments');
        Schema::dropIfExists('submissions');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('assessments');
        Schema::dropIfExists('enrollments');
        Schema::dropIfExists('lessons');
        Schema::dropIfExists('course_modules');
        Schema::dropIfExists('courses');
        Schema::dropIfExists('course_categories');
        Schema::dropIfExists('refresh_tokens');
        Schema::dropIfExists('users');
        Schema::dropIfExists('academic_sessions');
        Schema::dropIfExists('departments');
        Schema::dropIfExists('institutions');
        Schema::table('roles', function (Blueprint $table) {
            $table->dropForeign(['tenant_id']);
        });
        Schema::dropIfExists('tenants');
        Schema::dropIfExists('role_permissions');
        Schema::dropIfExists('permissions');
        Schema::dropIfExists('roles');
    }
};
