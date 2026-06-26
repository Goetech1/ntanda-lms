<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('learning_paths', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('title');
            $table->text('description')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        Schema::create('learning_path_courses', function (Blueprint $table) {
            $table->uuid('path_id');
            $table->uuid('course_id');
            $table->integer('sequence_order')->default(0);

            $table->primary(['path_id', 'course_id']);
            $table->foreign('path_id')->references('id')->on('learning_paths')->onDelete('cascade');
            $table->foreign('course_id')->references('id')->on('courses')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('learning_path_courses');
        Schema::dropIfExists('learning_paths');
    }
};
