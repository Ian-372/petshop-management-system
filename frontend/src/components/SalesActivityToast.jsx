import { useEffect } from "react";
import { FaCashRegister } from "react-icons/fa";

export default function SalesActivityToast({ notifications, currency, onClose }) {
    useEffect(() => {
        const timers = notifications.map((notification) =>
            setTimeout(() => onClose(notification.id), 9000)
        );

        return () => timers.forEach((timer) => clearTimeout(timer));
    }, [notifications, onClose]);

    if (!notifications.length) {
        return null;
    }

    return (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-sm space-y-3 pointer-events-none">
            {notifications.map((notification) => (
                <div key={notification.id} className="pointer-events-auto rounded-2xl border border-violet-200 bg-white/95 shadow-xl backdrop-blur-sm">
                    <div className="flex items-start gap-3 p-4">
                        <div className="rounded-lg bg-violet-100 p-2 text-violet-700"><FaCashRegister /></div>
                        <div className="flex-1">
                            <p className="text-sm font-bold text-slate-900">New sale recorded</p>
                            <p className="mt-1 text-sm text-slate-600">{notification.customerName} — {currency} {Number(notification.total || 0).toFixed(2)}</p>
                        </div>
                        <button type="button" onClick={() => onClose(notification.id)} className="text-xs font-medium text-violet-700 hover:text-violet-900">Dismiss</button>
                    </div>
                </div>
            ))}
        </div>
    );
}
