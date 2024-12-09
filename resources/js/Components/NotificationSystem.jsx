import { useEffect, useRef } from 'react';
import { notifications } from '@mantine/notifications';
import { usePage } from "@inertiajs/react";
import { getNotificationColor, getNotificationIcon, getNotificationTitle } from "@/Utils/notifications.js";

export default function NotificationSystem() {
    const audioRefs = useRef(new Map());
    const audioContextRef = useRef(null);
    const sourceNodesRef = useRef(new Map());
    const hasInteracted = useRef(false);
    const auth = usePage().props.auth;
    const userId = auth.user.id;

    // Initialize audio for a specific sound path
    const initializeAudio = (soundPath) => {
        if (!audioRefs.current.has(soundPath)) {
            const audio = new Audio(`/sounds/${soundPath}`);
            audioRefs.current.set(soundPath, audio);
            audio.load();

            if (audioContextRef.current) {
                const sourceNode = audioContextRef.current.createMediaElementSource(audio);
                sourceNode.connect(audioContextRef.current.destination);
                sourceNodesRef.current.set(soundPath, sourceNode);
            }
        }
    };

    // Initialize audio context after user interaction
    const initializeAudioContext = () => {
        if (!hasInteracted.current && !audioContextRef.current) {
            audioContextRef.current = new (window.AudioContext || window.webkitAudioContext)();
            hasInteracted.current = true;

            // Remove event listeners after first interaction
            document.removeEventListener('click', initializeAudioContext);
            document.removeEventListener('keydown', initializeAudioContext);
        }
    };

    const playNotificationSound = async (soundPath) => {
        // Initialize audio for this sound path if it doesn't exist
        initializeAudio(soundPath);

        const audio = audioRefs.current.get(soundPath);
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

        window.Echo.private(`user.${userId}`)
            .listen("ChallengeEvent", (notification) => {
                // Play sound if specified
                if (notification.sound) {
                    playNotificationSound(notification.sound);
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

            // Cleanup audio context and nodes
            sourceNodesRef.current.forEach(sourceNode => {
                sourceNode.disconnect();
            });

            if (audioContextRef.current) {
                audioContextRef.current.close();
                audioContextRef.current = null;
            }

            sourceNodesRef.current.clear();
            audioRefs.current.clear();
        };
    }, []);

    return null;
}
