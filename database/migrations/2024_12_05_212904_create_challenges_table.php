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
        Schema::create('challenges', function (Blueprint $table) {
            $table->id();
            $table->string('title');
            $table->text('description');
            $table->string('image')->nullable();
            $table->float('points')->default(0);
            $table->boolean('is_published')->default(false);
            $table->boolean('requires_review')->default(false);
            $table->integer('duration_minutes')->default(30);
            $table->integer('max_attempts')->default(3);
            $table->dateTime('starts_at')->nullable();
            $table->dateTime('ends_at')->nullable();
            $table->boolean('is_active')->default(false);
            $table->timestamp('last_active_at')->nullable();
            $table->timestamp('last_deactivated_at')->nullable();
            $table->string('category')->default('analysis');
            $table->timestamps();
        });
    }

    /**
     * Reverse the migrations.
     */
    public function down(): void
    {
        Schema::dropIfExists('chalenges');
    }
};
