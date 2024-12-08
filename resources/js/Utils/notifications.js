// resources/js/Utils/notifications.js
import { Trophy, Bell, Clock, AlertTriangle, CheckCircle } from 'lucide-react';

export const getNotificationTitle = (type) => {
    switch (type) {
        case 'activated':
            return 'New Challenge Available';
        case 'solved':
            return 'Challenge Completed!';
        case 'needs_review':
            return 'Review Required';
        case 'error':
            return 'Wrong Answer!';
        default:
            return 'Notification';
    }
};

export const getNotificationColor = (type) => {
    switch (type) {
        case 'activated':
            return 'blue';
        case 'solved':
            return 'green';
        case 'needs_review':
            return 'yellow';
        case 'error':
            return 'red';
        default:
            return 'gray';
    }
};

export const getNotificationIcon = (type) => {
    switch (type) {
        case 'activated':
            return Bell;
        case 'solved':
            return Trophy;
        case 'needs_review':
            return Clock;
        default:
            return Bell;
    }
};
