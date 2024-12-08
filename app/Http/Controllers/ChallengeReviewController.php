<?php

namespace App\Http\Controllers;

use App\Models\ChallengeAttempt;
use App\Notifications\ChallengeNotification;
use Illuminate\Http\Request;
use Inertia\Inertia;

class ChallengeReviewController extends Controller
{
    public function index()
    {
        $pendingAttempts = ChallengeAttempt::where('review_status', 'pending')
            ->with(['user', 'challenge'])
            ->latest()
            ->paginate(10);



        return Inertia::render('Challenges/Review/Index', [
            'attempts' => $pendingAttempts
        ]);
    }

    public function review(Request $request, ChallengeAttempt $attempt)
    {
        $validated = $request->validate([
            'is_correct' => 'required|boolean',
            'points_earned' => 'required|numeric|min:0',
            'review_comment' => 'nullable|string'
        ]);

        $attempt->update([
            'is_correct' => $validated['is_correct'],
            'points_earned' => $validated['points_earned'],
            'review_status' => $validated['is_correct'] ? 'approved' : 'rejected',
            'review_comment' => $validated['review_comment'],
            'reviewed_at' => now(),
            'reviewed_by' => auth()->id()
        ]);

        if ($validated['is_correct']) {
            // Update user's total points
            $attempt->user->increment('points', $validated['points_earned']);
            $attempt->user->notify(new ChallengeNotification($attempt->challenge, 'solved', 'You have solved the challenge.'));
        }
        $attempt->user->notify(new ChallengeNotification($attempt->challenge, 'error', 'Your Solution For The Challenge is Incorrect'));

        return back()->with('success', 'Attempt reviewed successfully.');
    }
}
