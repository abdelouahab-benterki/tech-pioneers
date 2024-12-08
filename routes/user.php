<?php
Route::middleware(['auth'])->group(function () {
    Route::middleware(['role:admin'])->group(function () {
        // List all users
        Route::get('/users', [\App\Http\Controllers\UserController::class, 'index'])
            ->name('users.index');

        // Show create user form
        Route::get('/users/create', [\App\Http\Controllers\UserController::class, 'create'])
            ->name('users.create');

        // Store a new user
        Route::post('/users', [\App\Http\Controllers\UserController::class, 'store'])
            ->name('users.store');

        // Show single user
        Route::get('/users/{user}', [\App\Http\Controllers\UserController::class, 'show'])
            ->name('users.show');

        // Show edit form
        Route::get('/users/{user}/edit', [\App\Http\Controllers\UserController::class, 'edit'])
            ->name('users.edit');

        // Update user
        Route::post('/users/{user}', [\App\Http\Controllers\UserController::class, 'update'])
            ->name('users.update');

        // Delete user
        Route::delete('/users/{user}', [\App\Http\Controllers\UserController::class, 'destroy'])
            ->name('users.destroy');
    });
});
