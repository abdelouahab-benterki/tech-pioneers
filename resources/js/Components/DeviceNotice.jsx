import { useState } from 'react';
import { X } from 'lucide-react';

const DeviceNotice = () => {
    const [isVisible, setIsVisible] = useState(true);

    if (!isVisible) return null;

    return (
        <div className="fixed bottom-4 right-4 bg-white text-secondary p-4 rounded-lg shadow-lg max-w-xs z-50">
            <button
                onClick={() => setIsVisible(false)}
                className="absolute top-2 right-2 text-gray-500 hover:text-gray-700"
            >
                <X size={16} />
            </button>
            <p className="text-sm">
                For the best experience, please view this website on a desktop or laptop computer.
            </p>
        </div>
    );
};

export default DeviceNotice;
