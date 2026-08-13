import { useEffect } from "react";
import { FaExclamationTriangle, FaBoxes } from "react-icons/fa";

export default function StockAlertToast({ notifications, onClose }) {
    useEffect(() => {
        if (!notifications.length) {
            return undefined;
        }

        const timers = notifications.map((notification) =>
            setTimeout(() => onClose(notification.id), 9000)
        );

        return () => timers.forEach((timer) => clearTimeout(timer));
    }, [notifications, onClose]);

    if (!notifications.length) {
        return null;
    }

    return (
        <div className="fixed top-5 right-5 z-50 w-full max-w-sm space-y-3 pointer-events-none">
            {notifications.map((notification) => (
                <div
                    key={notification.id}
                    className="pointer-events-auto rounded-2xl border border-amber-200 bg-white/95 shadow-xl backdrop-blur-sm"
                >
                    <div className="flex items-start gap-3 p-4">
                        <div className="flex-shrink-0 mt-0.5 rounded-lg bg-amber-100 p-2 text-amber-700">
                            {notification.quantity === 0 ? (
                                <FaBoxes className="text-lg" />
                            ) : (
                                <FaExclamationTriangle className="text-lg" />
                            )}
                        </div>

                        <div className="flex-1 min-w-0">
                            <p className="text-sm font-bold text-slate-900">
                                {notification.quantity === 0 ? "Out of Stock" : "Low Stock"}
                            </p>
                            <p className="mt-1 text-sm text-slate-700">
                                {notification.productName}
                            </p>
                            <div className="mt-2 flex items-center justify-between gap-3">
                                <span className="text-xs text-slate-500">
                                    Remaining: <span className="font-semibold text-slate-800">{notification.quantity}</span>
                                </span>
                                <button
                                    onClick={() => onClose(notification.id)}
                                    className="text-xs font-medium text-amber-700 hover:text-amber-900"
                                >
                                    Dismiss
                                </button>
                            </div>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
