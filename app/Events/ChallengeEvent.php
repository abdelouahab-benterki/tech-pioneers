<?php

namespace App\Events;

use App\Models\Challenge;
use Illuminate\Broadcasting\Channel;
use Illuminate\Broadcasting\InteractsWithSockets;
use Illuminate\Broadcasting\PresenceChannel;
use Illuminate\Broadcasting\PrivateChannel;
use Illuminate\Contracts\Broadcasting\ShouldBroadcast;
use Illuminate\Foundation\Events\Dispatchable;
use Illuminate\Queue\SerializesModels;

class ChallengeEvent implements ShouldBroadcast
{
    use Dispatchable, InteractsWithSockets, SerializesModels;

    public $challenge;
    public $eventType;
    public $message;
    public $sound;
    public $notifiable_id;

    public function __construct(Challenge $challenge, string $eventType, string $message, $notifiable_id, $sound)
    {
        $this->challenge = $challenge;
        $this->eventType = $eventType; // activated, deactivated, solved, etc.
        $this->message = $message;
        $this->notifiable_id = $notifiable_id;
        $this->sound = $sound;
    }

    public function broadcastOn()
    {
        return new PrivateChannel('challenges');
    }


    public function broadcastWith()
    {
        return [
            'challenge_id' => $this->challenge->id,
            'event_type' => $this->eventType,
            'message' => $this->message,
            'title' => $this->challenge->title,
            'sound' => $this->sound,
            'timestamp' => now()->toISOString(),
        ];
    }
}
