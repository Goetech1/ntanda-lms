<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::create('question_categories', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('name');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        Schema::create('questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->uuid('category_id')->nullable();
            $table->enum('type', ['multiple_choice', 'essay', 'true_false']);
            $table->text('text');
            $table->json('options_json')->nullable();
            $table->json('answer_json')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('category_id')->references('id')->on('question_categories')->onDelete('set null');
        });

        Schema::create('quiz_questions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('quiz_id'); // Assuming lesson_id that is a quiz
            $table->uuid('question_id');
            $table->integer('points')->default(1);
            $table->timestamps();

            $table->foreign('quiz_id')->references('id')->on('lessons')->onDelete('cascade');
            $table->foreign('question_id')->references('id')->on('questions')->onDelete('cascade');
        });

        Schema::create('peer_reviews', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('assignment_id'); // Assuming lesson_id that is an assignment
            $table->uuid('reviewer_id');
            $table->uuid('reviewee_id');
            $table->integer('score')->nullable();
            $table->text('feedback')->nullable();
            $table->timestamps();

            $table->foreign('assignment_id')->references('id')->on('lessons')->onDelete('cascade');
            $table->foreign('reviewer_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('reviewee_id')->references('id')->on('users')->onDelete('cascade');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('peer_reviews');
        Schema::dropIfExists('quiz_questions');
        Schema::dropIfExists('questions');
        Schema::dropIfExists('question_categories');
    }
};
