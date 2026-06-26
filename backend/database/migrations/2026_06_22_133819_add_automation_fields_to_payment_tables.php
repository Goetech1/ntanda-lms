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
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->string('integration_type')->default('MANUAL')->after('payment_instructions');
            $table->text('integration_credentials')->nullable()->after('integration_type');
        });

        Schema::table('student_payments', function (Blueprint $table) {
            $table->string('provider_reference')->nullable()->after('reference_number');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->dropColumn(['integration_type', 'integration_credentials']);
        });

        Schema::table('student_payments', function (Blueprint $table) {
            $table->dropColumn(['provider_reference']);
        });
    }
};
