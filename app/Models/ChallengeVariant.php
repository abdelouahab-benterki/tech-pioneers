<?php

namespace App\Models;

use Illuminate\Database\Eloquent\Model;

class ChallengeVariant extends Model
{
    protected $fillable = [
        'data',
        'solution',
    ];

    public function challenge()
    {
        return $this->belongsTo(Challenge::class);
    }

    public function assignments()
    {
        return $this->hasMany(ChallengeAssignment::class);
    }
}
