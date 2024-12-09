import { useEffect, useState } from 'react';

const ScreenshotPrevention = ({ children }) => {
    const [showWarning, setShowWarning] = useState(false);

    useEffect(() => {
        // Disable right-click context menu
        const handleContextMenu = (e) => {
            e.preventDefault();
            setShowWarning(true);
            setTimeout(() => setShowWarning(false), 3000);
        };

        // Detect print screen key
        const handleKeyDown = (e) => {
            if (e.key === 'PrintScreen') {
                e.preventDefault();
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 3000);
            }

            // Prevent Ctrl+P (Print)
            if (e.ctrlKey && e.key === 'p') {
                e.preventDefault();
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 3000);
            }

            // Prevent Ctrl+Shift+I (Developer Tools)
            if (e.ctrlKey && e.shiftKey && e.key === 'I') {
                e.preventDefault();
                setShowWarning(true);
                setTimeout(() => setShowWarning(false), 3000);
            }
        };

        document.addEventListener('contextmenu', handleContextMenu);
        document.addEventListener('keydown', handleKeyDown);

        // CSS to prevent text selection
        document.body.style.userSelect = 'none';
        document.body.style.webkitUserSelect = 'none';
        document.body.style.msUserSelect = 'none';

        return () => {
            document.removeEventListener('contextmenu', handleContextMenu);
            document.removeEventListener('keydown', handleKeyDown);
            document.body.style.userSelect = 'auto';
            document.body.style.webkitUserSelect = 'auto';
            document.body.style.msUserSelect = 'auto';
        };
    }, []);

    return (
        <div className="relative">
            {showWarning && (
                <div className="fixed top-32 right-4 z-40 bg-red-500 text-white p-4 rounded shadow-lg animate-fade-in">
                    Screenshots are not allowed on this page
                </div>
            )}
            <div
                className="screenshot-protected"
                style={{
                    // Additional protection against screen capture
                    WebkitTouchCallout: 'none',
                    // Blur content when window loses focus
                    filter: document.hasFocus() ? 'none' : 'blur(5px)'
                }}
            >
                {children}
            </div>
        </div>
    );
};

export default ScreenshotPrevention;
