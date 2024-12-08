<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\ChallengeAttempt;
use Illuminate\Http\Request;
use Inertia\Inertia;

class DashboardController extends Controller
{
    public function index()
    {
        $user = auth()->user();

        // Get all challenges and calculate overall stats
        $totalChallenges = Challenge::count();
        $solvedChallenges = ChallengeAttempt::where('user_id', $user->id)
            ->where('is_correct', true)
            ->count();

        // Calculate overall progress percentage
        $overallProgress = $totalChallenges > 0
            ? round(($solvedChallenges / $totalChallenges) * 100)
            : 0;

        // Get progress for each category
        $categoryProgress = [
            'analysis' => $this->getCategoryProgress($user, 'analysis'),
            'solution' => $this->getCategoryProgress($user, 'solution'),
            'optimization' => $this->getCategoryProgress($user, 'optimization'),
        ];

        // Get time elapsed since first attempt
        $firstAttempt = ChallengeAttempt::where('user_id', $user->id)
            ->oldest('created_at')
            ->first();

        $timeElapsed = $firstAttempt
            ? $firstAttempt->created_at->longAbsoluteDiffForHumans()
            : null;

        // Get active investigators (users who attempted challenges in last 24h)
        $activeInvestigators = ChallengeAttempt::where('created_at', '>=', now()->subHours(24))
            ->distinct('user_id')
            ->count();

        return Inertia::render('Dashboard', [
            'stats' => [
                'timeElapsed' => $timeElapsed,
                'activeInvestigators' => $activeInvestigators,
                'overallProgress' => $overallProgress,
                'solvedChallenges' => $solvedChallenges,
                'totalChallenges' => $totalChallenges,
            ],
            'categoryProgress' => $categoryProgress,
            'recentActivity' => $this->getRecentActivity($user),
        ]);
    }

    private function getCategoryProgress($user, $category)
    {
        $challenges = Challenge::where('category', $category)->get();
        $totalInCategory = $challenges->count();

        if ($totalInCategory === 0) {
            return [
                'total' => 0,
                'solved' => 0,
                'progress' => 0
            ];
        }

        $solved = ChallengeAttempt::where('user_id', $user->id)
            ->where('is_correct', true)
            ->whereIn('challenge_id', $challenges->pluck('id'))
            ->count();

        return [
            'total' => $totalInCategory,
            'solved' => $solved,
            'progress' => round(($solved / $totalInCategory) * 100)
        ];
    }

    private function getRecentActivity($user)
    {
        return ChallengeAttempt::with('challenge')
            ->where('user_id', $user->id)
            ->latest()
            ->take(5)
            ->get()
            ->map(function($attempt) {
                return [
                    'id' => $attempt->id,
                    'challenge_title' => $attempt->challenge->title,
                    'status' => $attempt->is_correct ? 'solved' : 'attempted',
                    'points_earned' => $attempt->points_earned,
                    'timestamp' => $attempt->created_at->diffForHumans()
                ];
            });
    }
}
