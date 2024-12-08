<?php

namespace App\Notifications;

use App\Events\ChallengeEvent;
use App\Models\Challenge;
use Illuminate\Bus\Queueable;
use Illuminate\Contracts\Queue\ShouldQueue;
use Illuminate\Notifications\Messages\MailMessage;
use Illuminate\Notifications\Notification;

class ChallengeNotification extends Notification implements ShouldQueue
{
    use Queueable;

    public $challenge;
    public $eventType;
    public $message;

    public function __construct(Challenge $challenge, string $eventType, string $message)
    {
        $this->challenge = $challenge;
        $this->eventType = $eventType;
        $this->message = $message;
    }

    public function via($notifiable): array
    {
        return ['database'];
    }

    public function toArray($notifiable): array
    {
        event(new ChallengeEvent($this->challenge, $this->eventType, $this->message, $notifiable->id, $this->getSound()));
        return [
            'challenge_id' => $this->challenge->id,
            'event_type' => $this->eventType,
            'message' => $this->message,
            'title' => $this->challenge->title,
            'sound' => $this->getSound(),
        ];
    }

//    public function toBroadcast($notifiable): BroadcastMessage
//    {
//        return new BroadcastMessage($this->toArray($notifiable));
//    }

    private function getSound(): string
    {
        return match ($this->eventType) {
            'activated' => 'notification.mp3',
            'solved' => 'success.mp3',
            'needs_review' => 'alert.mp3',
            'error' => 'error.mp3',
            default => 'notification.mp3',
        };
    }
}
