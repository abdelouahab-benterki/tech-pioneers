<?php

namespace App\Http\Controllers;

use App\Models\Challenge;
use App\Models\User;
use Illuminate\Http\Request;
use Inertia\Inertia;

class PointsTrackingController extends Controller
{
    public function index()
    {
        $competitors = User::role('competitor')
            ->with(['challengeAttempts' => function($query) {
                $query->with('challenge')
                    ->where('is_correct', true);
            }])
            ->get();

        $challenges = Challenge::all();

        $pointsMatrix = $competitors->map(function($competitor) use ($challenges) {
            $challengePoints = $challenges->mapWithKeys(function($challenge) use ($competitor) {
                $attempt = $competitor->challengeAttempts
                    ->where('challenge_id', $challenge->id)
                    ->first();

                return [$challenge->id => [
                    'points' => $attempt ? $attempt->points_earned : 0,
                    'submitted_at' => $attempt ? $attempt->submitted_at : null,
                ]];
            });

            return [
                'id' => $competitor->id,
                'name' => $competitor->name,
                'total_points' => $competitor->points,
                'challenges' => $challengePoints
            ];
        });

        return Inertia::render('PointsTracking/Index', [
            'pointsMatrix' => $pointsMatrix,
            'challenges' => $challenges
        ]);
    }
}
