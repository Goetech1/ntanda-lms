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
        Schema::create('payment_methods', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('institution_id')->index();
            $table->string('method_name');
            $table->string('account_name')->nullable();
            $table->string('account_number')->nullable();
            $table->string('bank_name')->nullable();
            $table->text('payment_instructions')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
            
            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
        });

        Schema::create('student_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('institution_id')->index();
            $table->uuid('student_id');
            $table->string('invoice_id')->nullable();
            $table->decimal('amount', 12, 2);
            $table->uuid('payment_method_id');
            $table->string('reference_number')->nullable();
            $table->timestamp('payment_date');
            $table->string('receipt_file')->nullable();
            $table->text('notes')->nullable();
            $table->enum('status', ['Pending', 'Approved', 'Rejected', 'Partially Paid', 'Refunded'])->default('Pending');
            $table->uuid('verified_by')->nullable();
            $table->timestamp('verified_at')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            $table->foreign('student_id')->references('id')->on('users')->onDelete('cascade');
            $table->foreign('payment_method_id')->references('id')->on('payment_methods')->onDelete('cascade');
            $table->foreign('verified_by')->references('id')->on('users')->onDelete('set null');
        });

        Schema::create('payment_audit_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('payment_id');
            $table->string('action');
            $table->uuid('performed_by');
            $table->text('notes')->nullable();
            $table->timestamps();

            $table->foreign('payment_id')->references('id')->on('student_payments')->onDelete('cascade');
            $table->foreign('performed_by')->references('id')->on('users')->onDelete('cascade');
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('payment_audit_logs');
        Schema::dropIfExists('student_payments');
        Schema::dropIfExists('payment_methods');
    }
};
