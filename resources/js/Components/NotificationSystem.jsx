import { useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import { usePage } from "@inertiajs/react";
import { getNotificationColor, getNotificationIcon, getNotificationTitle } from "@/Utils/notifications.js";

export default function NotificationSystem() {
    const audioRef = useRef(new Audio("/sounds/notification.mp3"));
    const audioContextRef = useRef(null);
    const sourceNodeRef = useRef(null);
    const hasInteracted = useRef(false);
    const auth = usePage().props.auth;

    // Initialize audio context after user interaction
    const initializeAudioContext = () => {
        if (!hasInteracted.current && !audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            sourceNodeRef.current = audioContextRef.current.createMediaElementSource(audioRef.current);
            sourceNodeRef.current.connect(audioContextRef.current.destination);
            hasInteracted.current = true;

            // Remove event listeners after first interaction
            document.removeEventListener('click', initializeAudioContext);
            document.removeEventListener('keydown', initializeAudioContext);
        }
    };

    const playNotificationSound = async () => {
        const audio = audioRef.current;
        const context = audioContextRef.current;

        try {
            if (context) {
                // Resume AudioContext if it's suspended
                if (context.state === 'suspended') {
                    await context.resume();
                }
            }
            // Reset and play the audio
            audio.currentTime = 0;
            await audio.play();
        } catch (error) {
            console.warn('Error playing notification sound:', error);
        }
    };

    useEffect(() => {

        // Add event listeners for user interaction
        document.addEventListener('click', initializeAudioContext);
        document.addEventListener('keydown', initializeAudioContext);

        // Preload the audio
        audioRef.current.load();

        window.Echo.private(`challenges`)
            .listen("ChallengeEvent", (notification) => {
                // Play sound if specified
                if (notification.sound) {
                    playNotificationSound();
                }

                console.log('notification received:', notification);

                try {
                    notifications.show({
                        title: getNotificationTitle(notification.eventType),
                        message: notification.message || 'New challenge update',
                        color: getNotificationColor(notification.eventType),
                        // icon: getNotificationIcon(notification.eventType),
                        autoClose: 5000
                    });
                } catch (error) {
                    console.error('Error showing notification:', error);
                    // Fallback notification
                    notifications.show({
                        title: 'Challenge Update',
                        message: 'There is a new update to a challenge',
                        color: 'blue',
                        autoClose: 5000
                    });
                }
            });

        return () => {
            document.removeEventListener('click', initializeAudioContext);
            document.removeEventListener('keydown', initializeAudioContext);
            window.Echo.disconnect();

            // Cleanup audio context
            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
                sourceNodeRef.current = null;
            }
        };
    }, []);

    return null;  // Component doesn't need to render anything
}
