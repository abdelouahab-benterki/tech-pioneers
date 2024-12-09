<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class Challenge extends Model
{
    protected $guarded = [];

    protected $withCount = ['variants'];

    public function variants()
    {
        return $this->hasMany(ChallengeVariant::class);
    }

    public function assignments()
    {
        return $this->hasMany(ChallengeAssignment::class);
    }

    public function attempts()
    {
        return $this->hasMany(ChallengeAttempt::class);
    }
}
