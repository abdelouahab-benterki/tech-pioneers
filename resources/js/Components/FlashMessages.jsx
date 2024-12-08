// Components/FlashMessages.jsx
import { Notification, Transition } from '@mantine/core';
import { useEffect, useState } from 'react';
import { usePage } from '@inertiajs/react';
import { CheckCircle2, AlertCircle, Info, XCircle } from 'lucide-react';

export default function FlashMessages() {
    const [visible, setVisible] = useState(false);  // Start as false for entrance animation
    const { props } = usePage();

    useEffect(() => {
        if (props.flash?.success || props.flash?.error || props.flash?.message) {
            setVisible(true);
            const timer = setTimeout(() => setVisible(false), 4000);
            return () => clearTimeout(timer);
        }
    }, [props.flash]);

    const getMessage = () => {
        const flash = props.flash;
        if (flash?.success) return { type: 'success', text: flash.success };
        if (flash?.error) return { type: 'error', text: flash.error };
        if (flash?.message) return { type: 'info', text: flash.message };
        return null;
    };

    const message = getMessage();
    if (!message) return null;

    const getNotificationStyles = (type) => {
        const styles = {
            success: {
                backgroundColor: '#10B981',
                color: 'white',
                icon: <CheckCircle2 className="h-5 w-5" />,
            },
            error: {
                backgroundColor: '#EF4444',
                color: 'white',
                icon: <XCircle className="h-5 w-5" />,
            },
            info: {
                backgroundColor: '#3B82F6',
                color: 'white',
                icon: <Info className="h-5 w-5" />,
            }
        };
        return styles[type] || styles.info;
    };

    const notificationStyle = getNotificationStyles(message.type);

    return (
        <Transition
            mounted={visible}
            transition="slide-left"
            duration={400}
            timingFunction="ease"
        >
            {(styles) => (
                <div
                    style={{
                        ...styles,
                        position: 'fixed',
                        top: '20px',
                        right: '20px',
                        zIndex: 9999,
                        maxWidth: '400px',
                        width: '100%'
                    }}
                >
                    <Notification
                        onClose={() => setVisible(false)}
                        withCloseButton
                        icon={notificationStyle.icon}
                        className="shadow-lg"
                        styles={{
                            root: {
                                backgroundColor: notificationStyle.backgroundColor,
                                color: notificationStyle.color,
                                border: 'none',
                                padding: '1rem',
                            },
                            closeButton: {
                                color: notificationStyle.color,
                                '&:hover': {
                                    backgroundColor: 'rgba(255, 255, 255, 0.2)',
                                },
                            },
                            icon: {
                                backgroundColor: 'transparent',
                            },
                            description: {
                                color: notificationStyle.color,
                                fontSize: '0.9rem',
                            },
                        }}
                    >
                        <div className="font-medium">
                            {message.text}
                        </div>
                    </Notification>
                </div>
            )}
        </Transition>
    );
}
