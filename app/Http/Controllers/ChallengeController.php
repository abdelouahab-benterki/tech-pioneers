<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\ChallengeAssignment;
use App\Models\ChallengeAttempt;
use App\Models\User;
use App\Notifications\ChallengeActivated;
use App\Notifications\ChallengeNotification;
use Carbon\Carbon;
use Illuminate\Http\Request;
use Illuminate\Support\Facades\Storage;
use Inertia\Inertia;

class ChallengeController extends Controller
{
    /**
     * Display a listing of the resource.
     */
    public function index()
    {
        $user = auth()->user();
        $query = Challenge::latest();

        if ($user->hasRole('competitor')) {
            $query->where('is_active', true);
        }

        $challenges = $query->get()->map(function ($challenge) {
            if ($challenge->is_active && $challenge->ends_at) {
                $now = now();
                $endsAt = Carbon::parse($challenge->ends_at);

                if ($now->gt($endsAt)) {
                    $challenge->is_active = false;
                    $challenge->save();
                    $challenge->time_remaining = $challenge->duration_minutes * 60;
                } else {
                    $challenge->time_remaining = abs($endsAt->diffInSeconds($now));
                }
            } else {
                $challenge->time_remaining = $challenge->duration_minutes * 60;
            }

            return $challenge;
        });

        return Inertia::render('Challenges/Index', [
            'challenges' => $challenges
        ]);
    }

    /**
     * Show the form for creating a new resource.
     */
    public function create()
    {
        return inertia('Challenges/Create');
    }

    /**
     * Store a newly created resource in storage.
     */
    public function store(Request $request)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'points' => 'required|numeric|min:0',
            'is_published' => 'boolean',
            'requires_review' => 'boolean',
            'category' => 'required|string|in:analysis,solution,optimization',
        ]);

        // Handle image upload if present
        if ($request->hasFile('image')) {
            $validated['image'] = $request->file('image')->store('challenges', 'public');
        }

        $challenge = Challenge::create($validated);

        return redirect()->route('challenges.index')
            ->with('success', 'Challenge created successfully!');
    }

    /**
     * Display the specified resource.
     */
    public function show(Challenge $challenge)
    {
        // If challenge requires review, assign the first variant to everyone
        if ($challenge->requires_review) {
            $variant = $challenge->variants()->first();

            if (!$variant) {
                return back()->with('error', 'No variant available for this challenge.');
            }

            // Get or create assignment with this variant
            $assignment = ChallengeAssignment::firstOrCreate([
                'user_id' => auth()->id(),
                'challenge_id' => $challenge->id,
                'challenge_variant_id' => $variant->id,
            ], [
                'started_at' => now(),
            ]);
        } else {
            // Existing logic for regular challenges
            $assignment = ChallengeAssignment::where([
                'user_id' => auth()->id(),
                'challenge_id' => $challenge->id,
            ])->first();

            if (!$assignment) {
                $availableVariant = $challenge->variants()
                    ->whereDoesntHave('assignments')
                    ->first();

                if (!$availableVariant) {
                    return back()->with('error', 'No available variants for this challenge.');
                }

                $assignment = ChallengeAssignment::create([
                    'user_id' => auth()->id(),
                    'challenge_id' => $challenge->id,
                    'challenge_variant_id' => $availableVariant->id,
                    'started_at' => now(),
                ]);
            }
        }

        $assignment->load('variant');

        return Inertia::render('Challenges/Solve', [
            'challenge' => $challenge,
            'assignment' => $assignment,
        ]);
    }

    public function submit(Request $request, Challenge $challenge)
    {
        if (!$challenge->is_active) {
            return back()->with('error', 'This challenge is not currently active.');
        }

        if (now() > $challenge->ends_at) {
            return back()->with('error', 'The challenge has ended.');
        }

        $attemptsCount = ChallengeAttempt::where('user_id', auth()->id())
            ->where('challenge_id', $challenge->id)
            ->count();

        $successfulAttempts = ChallengeAttempt::where('user_id', auth()->id())
            ->where('challenge_id', $challenge->id)
            ->where('is_correct', true)
            ->count();

        if ($successfulAttempts > 0) {
            return back()->with('error', 'You have already solved this challenge.');
        }


        if ($attemptsCount >= $challenge->max_attempts) {
            return back()->with('error', 'You have used all your attempts for this challenge.');
        }

        $validated = $request->validate([
            'solution' => 'required|string',
        ]);


        $variant = $challenge->assignments()->where('user_id', auth()->id())->first()->variant;

        if ($challenge->requires_review) {
            // For challenges requiring review, create attempt with pending status
            $attempt = ChallengeAttempt::create([
                'user_id' => auth()->id(),
                'challenge_id' => $challenge->id,
                'challenge_variant_id' => $variant->id,
                'submitted_at' => now(),
                'submitted_solution' => $validated['solution'],
                'review_status' => 'pending',
                'points_earned' => 0,
                'is_correct' => false,
            ]);
            User::role('admin')->each(function($user) use ($challenge) {
                $user->notify(new ChallengeNotification($challenge, 'needs_review', 'A new challenge solution needs review.'));
            });
            return redirect()->route('challenges.index')
                ->with('success', 'Solution submitted successfully and pending review.');
        } else {
            $isCorrect = $validated['solution'] === $variant->solution;

            // Calculate points based on time taken
            $timeElapsed = now()->diffInSeconds($challenge->starts_at);
            $totalTime = $challenge->duration_minutes * 60;

            // Calculate time bonus - faster answers get higher bonus
            // If answered immediately, timeRatio = 0 (maximum bonus)
            // If answered at the last second, timeRatio = 1 (minimum bonus)
            $timeRatio = $timeElapsed / $totalTime;

            // Base points for correct answer is 50% of total possible points
            // Time bonus can add up to another 50% of total points
            // Faster answers get more of the time bonus
            $basePoints = $challenge->points * 0.5;
            $timeBonus = $challenge->points * 0.5 * (1 - $timeRatio);

            $pointsEarned = $isCorrect ? ($basePoints + $timeBonus) : 0;

            // Round to 2 decimal places for cleaner numbers
            $pointsEarned = round($pointsEarned, 2);

            // Record attempt
            ChallengeAttempt::create([
                'user_id' => auth()->id(),
                'challenge_id' => $challenge->id,
                'challenge_variant_id' => $variant->id,
                'submitted_at' => now(),
                'submitted_solution' => $validated['solution'],
                'points_earned' => $pointsEarned,
                'is_correct' => $isCorrect,
            ]);

            if ($isCorrect) {
                // Update user points
                auth()->user()->increment('points', $pointsEarned);

                auth()->user()->notify(new ChallengeNotification($challenge, 'solved', 'A new challenge has been solved. Great Job!'));

                return redirect()->route('challenges.index')
                    ->with('success', "Correct! You earned {$pointsEarned} points!");
            }else{
                auth()->user()->notify(new ChallengeNotification($challenge, 'error', 'Incorrect solution!'));
            }

            return back()->with('error', 'Incorrect solution. Try again!');
        }


    }

    /**
     * Show the form for editing the specified resource.
     */
    public function edit(Challenge $Challenge)
    {
        return Inertia::render('Challenges/Edit', [
            'challenge' => $Challenge
        ]);
    }

    /**
     * Update the specified resource in storage.
     */
    public function update(Request $request, Challenge $challenge)
    {
        $validated = $request->validate([
            'title' => 'required|string|max:255',
            'description' => 'required|string',
            'image' => 'nullable|image|max:2048',
            'points' => 'required|numeric|min:0',
            'is_published' => 'boolean',
            'requires_review' => 'boolean',
            'category' => 'required|string|in:analysis,solution,optimization',
        ]);

        if ($request->hasFile('image')) {
            // Delete old image if exists
            if ($challenge->image) {
                Storage::disk('public')->delete($challenge->image);
            }
            $validated['image'] = $request->file('image')->store('challenges', 'public');
        }

        $challenge->update($validated);

        return redirect()->route('challenges.index')
            ->with('success', 'Challenge updated successfully!');
    }

    /**
     * Remove the specified resource from storage.
     */
    public function destroy(Challenge $challenge)
    {
        if ($challenge->image) {
            Storage::disk('public')->delete($challenge->image);
        }

        $challenge->delete();

        return redirect()->route('challenges.index')
            ->with('success', 'Challenge deleted successfully!');
    }

    public function activate(Challenge $challenge)
    {
        $remainingMinutes = $challenge->duration_minutes;

        if ($challenge->last_active_at) {
            $timeSpentBefore = Carbon::parse($challenge->last_active_at)->diffInMinutes(Carbon::parse($challenge->last_deactivated_at));
            $remainingMinutes = $challenge->duration_minutes - $timeSpentBefore;

            // If time has already expired
            if ($remainingMinutes <= 0) {
                return back()->with('error', 'This challenge has already used its full duration.');
            }
        }

        User::role('competitor')->each(function($user) use ($challenge) {
            $user->notify(new ChallengeNotification($challenge, 'activated', 'A new challenge has been activated. Solve it now!'));
        });

        $challenge->update([
            'is_active' => true,
            'starts_at' => now(),
            'ends_at' => now()->addMinutes($remainingMinutes),
            'last_active_at' => now()
        ]);

        return back()->with('success', 'Challenge activated successfully!');
    }

    public function deactivate(Challenge $challenge)
    {
        $challenge->update([
            'is_active' => false,
            'last_deactivated_at' => now(),
        ]);



        return back()->with('success', 'Challenge deactivated successfully!');
    }

    public function reset(Challenge $challenge)
    {
        // Reset challenge state
        $challenge->update([
            'is_active' => false,
            'starts_at' => null,
            'ends_at' => null,
            'last_active_at' => null,
            'last_deactivated_at' => null
        ]);


        return back()->with('success', 'Challenge time has been reset successfully!');
    }
}
