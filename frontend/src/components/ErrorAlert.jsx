import { FaTimes, FaExclamationCircle } from "react-icons/fa";

export default function ErrorAlert({ message, onClose }) {
    return (
        <div className="fixed top-4 right-4 z-50 max-w-md animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="bg-red-50 border-l-4 border-red-500 rounded-lg shadow-lg overflow-hidden">
                <div className="flex items-start gap-4 p-4">
                    <div className="flex-shrink-0 pt-0.5">
                        <FaExclamationCircle className="text-red-600 text-xl" />
                    </div>
                    <div className="flex-1">
                        <h3 className="font-bold text-red-900 mb-1">Error</h3>
                        <p className="text-red-700 text-sm leading-relaxed">
                            {message || "An unexpected error occurred. Please try again."}
                        </p>
                    </div>
                    <button
                        onClick={onClose}
                        className="flex-shrink-0 text-red-600 hover:text-red-900 hover:bg-red-100 p-1 rounded transition-colors"
                        aria-label="Close error message"
                    >
                        <FaTimes />
                    </button>
                </div>
            </div>
        </div>
    );
}
