<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    public function up(): void
    {
        Schema::table('payment_methods', function (Blueprint $table) {
            $table->enum('provider_type', ['BANK_ACCOUNT', 'MTN_MOMO', 'AIRTEL_MONEY', 'LIPILA', 'OTHER'])
                ->default('OTHER')
                ->after('method_name');
        });

        Schema::create('student_account_transactions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('institution_id')->index();
            $table->uuid('student_id')->index();
            $table->uuid('student_payment_id')->nullable()->index();
            $table->enum('direction', ['CREDIT', 'DEBIT'])->default('CREDIT');
            $table->enum('status', ['PENDING', 'POSTED', 'REVERSED'])->default('POSTED');
            $table->decimal('amount', 12, 2);
            $table->string('reference_number')->nullable();
            $table->string('source_type')->default('PAYMENT');
            $table->text('description')->nullable();
            $table->timestamp('posted_at')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('student_payment_id')->references('id')->on('student_payments')->onDelete('set null');
        });
    }

    public function down(): void
    {
        Schema::dropIfExists('student_account_transactions');

        Schema::table('payment_methods', function (Blueprint $table) {
            $table->dropColumn('provider_type');
        });
    }
};
