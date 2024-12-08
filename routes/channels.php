<?php

use Illuminate\Support\Facades\Broadcast;


Broadcast::channel('challenges', function ($user) {
    return true; // Or add your authorization logic
});
