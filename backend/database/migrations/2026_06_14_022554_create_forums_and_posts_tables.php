<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('forums', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('course_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();
            
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
            $table->index(['tenant_id', 'course_id']);
        });

        Schema::create('forum_posts', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('forum_id');
            $table->uuid('user_id');
            $table->uuid('parent_id')->nullable();
            $table->text('content');
            $table->boolean('is_pinned')->default(false);
            $table->boolean('is_resolved')->default(false);
            $table->timestamps();
            $table->softDeletes('deleted_at');

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('forum_id')->references('id')->on('forums')->onDelete('cascade');
            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('parent_id')->references('id')->on('forum_posts')->onDelete('cascade');
            $table->index(['tenant_id', 'forum_id']);
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('forum_posts');
        Schema::dropIfExists('forums');
    }
};
