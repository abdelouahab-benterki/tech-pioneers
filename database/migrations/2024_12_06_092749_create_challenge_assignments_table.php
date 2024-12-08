<?php

use Illuminate\Database\Migrations\Migration;
use Illuminate\Database\Schema\Blueprint;
use Illuminate\Support\Facades\Schema;

return new class extends Migration
{
    /**
     * Run the migrations.
     */
    public function up()
    {
        Schema::create('challenge_assignments', function (Blueprint $table) {
            $table->id();
            $table->foreignIdFor(\App\Models\User::class);
            $table->foreignIdFor(\App\Models\Challenge::class);
            $table->foreignIdFor(\App\Models\ChallengeVariant::class);
            $table->boolean('is_solved')->default(false);
            $table->timestamp('started_at')->nullable();
            $table->timestamp('solved_at')->nullable();
            $table->timestamps();

            // Each user should have only one variant per challenge
            $table->unique(['user_id', 'challenge_id']);
        });
    }

    public function down()
    {
        Schema::dropIfExists('challenge_assignments');
    }
};
