<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            // We keep video_url if it already exists, but let's add a structured media_type
            // Types: TEXT, YOUTUBE, VIMEO, RAW_VIDEO, PDF, SCORM
            $table->string('media_type')->default('TEXT')->after('content');
            $table->string('document_url')->nullable()->after('video_url');
            $table->integer('duration_minutes')->nullable()->after('document_url');
            $table->boolean('is_preview')->default(false)->after('duration_minutes');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('lessons', function (Blueprint $table) {
            $table->dropColumn(['media_type', 'document_url', 'duration_minutes', 'is_preview']);
        });
    }
};
