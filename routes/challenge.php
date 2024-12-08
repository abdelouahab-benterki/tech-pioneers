<?php

use App\Http\Controllers\ChallengeController;
use App\Http\Controllers\ChallengeVariantController;
use App\Http\Controllers\ChallengeReviewController;
use Illuminate\Support\Facades\Route;

Route::middleware(['auth'])->group(function () {
    // Public challenge routes (for all authenticated users)
    Route::get('/challenges', [ChallengeController::class, 'index'])
        ->name('challenges.index');

    // Admin-only routes - MOVED UP before wildcard routes
    Route::middleware(['role:admin'])->group(function () {
        // Review system - Keep at top of admin routes
        Route::get('/challenges/review', [ChallengeReviewController::class, 'index'])
            ->name('challenges.review');
        Route::post('/challenges/review/{attempt}', [ChallengeReviewController::class, 'review'])
            ->name('challenges.review.update');

        // Challenge management
        Route::get('/challenges/create', [ChallengeController::class, 'create'])
            ->name('challenges.create');
        Route::post('/challenges', [ChallengeController::class, 'store'])
            ->name('challenges.store');

        Route::get('/challenges/{challenge}/edit', [ChallengeController::class, 'edit'])
            ->name('challenges.edit');

        Route::post('/challenges/{challenge}', [ChallengeController::class, 'update'])
            ->name('challenges.update');

        Route::delete('/challenges/{challenge}', [ChallengeController::class, 'destroy'])
            ->name('challenges.destroy');

        // Challenge activation controls
        Route::post('/challenges/{challenge}/activate', [ChallengeController::class, 'activate'])
            ->name('challenges.activate');

        Route::post('/challenges/{challenge}/deactivate', [ChallengeController::class, 'deactivate'])
            ->name('challenges.deactivate');

        Route::post('/challenges/{challenge}/reset', [ChallengeController::class, 'reset'])
            ->name('challenges.reset');

        // Variant management
        Route::get('/challenges/{challenge}/variants', [ChallengeVariantController::class, 'index'])
            ->name('challenges.variants.index');

        Route::get('/challenges/{challenge}/variants/create', [ChallengeVariantController::class, 'create'])
            ->name('challenges.variants.create');

        Route::post('/challenges/{challenge}/variants', [ChallengeVariantController::class, 'store'])
            ->name('challenges.variants.store');

        Route::get('/challenges/{challenge}/variants/{variant}/edit', [ChallengeVariantController::class, 'edit'])
            ->name('challenges.variants.edit');

        Route::put('/challenges/{challenge}/variants/{variant}', [ChallengeVariantController::class, 'update'])
            ->name('challenges.variants.update');

        Route::delete('/challenges/{challenge}/variants/{variant}', [ChallengeVariantController::class, 'destroy'])
            ->name('challenges.variants.destroy');


        Route::get('/leaderboard', [\App\Http\Controllers\LeaderboardController::class, 'index'])
            ->name('leaderboard');


        Route::get('/points-tracking', [\App\Http\Controllers\PointsTrackingController::class, 'index'])
            ->name('points.tracking');

    });

    // Competitor-only routes
    Route::middleware(['role:competitor'])->group(function () {
        Route::post('/challenges/{challenge}/submit', [ChallengeController::class, 'submit'])
            ->name('challenges.submit');

        Route::get('/challenges/{challenge}/variants/{variant}/download', [ChallengeVariantController::class, 'download'])
            ->name('challenges.variants.download');
    });

    // Move this AFTER all specific routes
    Route::get('/challenges/{challenge}', [ChallengeController::class, 'show'])
        ->name('challenges.show');

    // Admin-only routes


});
