<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChallengeAssignment extends Model
{
    protected $fillable = [
        'user_id',
        'challenge_id',
        'challenge_variant_id',
        'is_solved',
        'started_at',
        'solved_at',
    ];

    protected $casts = [
        'is_solved' => 'boolean',
        'started_at' => 'datetime',
        'solved_at' => 'datetime',
    ];

    public function user()
    {
        return $this->belongsTo(User::class);
    }

    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    public function variant()
    {
        return $this->belongsTo(ChallengeVariant::class, 'challenge_variant_id');
    }
}
