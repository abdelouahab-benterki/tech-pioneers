<?php

namespace App\Http\Controllers;

use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class LeaderboardController extends Controller
{
    public function index()
    {
        $users = User::role('competitor')
            ->with(['challengeAttempts' => function($query) {
                $query->where('is_correct', true);
            }])
            ->orderBy('points', 'desc')
            ->get()
            ->map(function($user) {
                return [
                    'id' => $user->id,
                    'name' => $user->name,
                    'points' => $user->points,
                    'challenges_solved' => $user->challengeAttempts->count(),
                    'avatar' => $user->avatar,
                ];
            });

        return Inertia::render('Leaderboard/Index', [
            'users' => $users
        ]);
    }
}
