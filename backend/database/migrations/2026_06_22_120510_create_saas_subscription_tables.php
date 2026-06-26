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
        Schema::create('subscription_plans', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('name');
            $table->decimal('monthly_price', 12, 2);
            $table->decimal('annual_price', 12, 2);
            $table->integer('max_students')->nullable();
            $table->integer('max_staff')->nullable();
            $table->integer('storage_limit')->nullable(); // in GB
            $table->json('feature_access')->nullable();
            $table->boolean('is_active')->default(true);
            $table->timestamps();
        });

        Schema::create('institution_subscriptions', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('institution_id')->index();
            $table->uuid('plan_id');
            $table->enum('billing_cycle', ['MONTHLY', 'ANNUALLY']);
            $table->timestamp('start_date');
            $table->timestamp('end_date');
            $table->enum('status', ['ACTIVE', 'PAST_DUE', 'CANCELED', 'TRIAL'])->default('TRIAL');
            $table->boolean('auto_renew')->default(false);
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            $table->foreign('plan_id')->references('id')->on('subscription_plans')->onDelete('cascade');
        });

        Schema::create('subscription_payments', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->uuid('tenant_id')->index();
            $table->uuid('institution_id')->index();
            $table->uuid('subscription_id');
            $table->string('lipila_transaction_id')->nullable();
            $table->string('reference_number')->unique();
            $table->decimal('amount', 12, 2);
            $table->string('currency', 3)->default('ZMW');
            $table->enum('payment_status', ['Pending', 'Successful', 'Failed'])->default('Pending');
            $table->timestamp('payment_date')->nullable();
            $table->string('invoice_number')->nullable();
            $table->string('receipt_number')->nullable();
            $table->timestamps();

            $table->foreign('tenant_id')->references('id')->on('tenants')->onDelete('cascade');
            $table->foreign('institution_id')->references('id')->on('institutions')->onDelete('cascade');
            $table->foreign('subscription_id')->references('id')->on('institution_subscriptions')->onDelete('cascade');
        });

        Schema::create('webhook_logs', function (Blueprint $table) {
            $table->uuid('id')->primary();
            $table->string('provider')->default('Lipila');
            $table->json('payload')->nullable();
            $table->boolean('processed')->default(false);
            $table->text('response')->nullable();
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('webhook_logs');
        Schema::dropIfExists('subscription_payments');
        Schema::dropIfExists('institution_subscriptions');
        Schema::dropIfExists('subscription_plans');
    }
};
