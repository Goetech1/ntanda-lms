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
        Schema::create('lti_platforms', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id');
            $table->string('name')->comment('E.g., Canvas, Moodle');
            $table->string('issuer')->comment('The issuer (iss) identifier');
            $table->string('client_id')->comment('The client_id provided by the platform');
            $table->string('auth_login_url')->comment('OIDC Auth Login URL');
            $table->string('auth_token_url')->comment('OAuth2 Token URL');
            $table->string('key_set_url')->comment('JWKS URL');
            $table->string('deployment_id')->comment('Deployment ID');
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
        });

        Schema::create('lti_users', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('user_id');
            $table->uuid('lti_platform_id');
            $table->string('subject_id')->comment('The sub identifier from the platform');
            $table->timestamps();

            $table->foreign('user_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('lti_platform_id')->references('id')->on('lti_platforms')->onDelete('cascade');
            $table->unique(['lti_platform_id', 'subject_id']);
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('lti_users');
        Schema::dropIfExists('lti_platforms');
    }
};
