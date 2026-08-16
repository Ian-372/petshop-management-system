import { FaExclamationTriangle } from "react-icons/fa";

export default function DebtAlertToast({ notifications, currency = "KSh", onClose }) {
    if (!notifications.length) return null;

    return (
        <div className="fixed bottom-5 right-5 z-50 w-full max-w-md space-y-3 pointer-events-none">
            {notifications.map((notification) => (
                <div key={notification.id} className="pointer-events-auto rounded-2xl border border-red-200 bg-white/95 shadow-xl backdrop-blur-sm">
                    <div className="flex items-start gap-3 p-4">
                        <div className="mt-0.5 rounded-lg bg-red-100 p-2 text-red-700"><FaExclamationTriangle className="text-lg" /></div>
                        <div className="min-w-0 flex-1">
                            <p className="text-sm font-bold text-slate-900">{notification.nearLimit ? "Debt limit warning" : "Long-outstanding debt"}</p>
                            <p className="mt-1 text-sm text-slate-700"><span className="font-semibold">{notification.customerName}</span> has an outstanding debt of <span className="font-semibold">{currency} {Number(notification.debt).toLocaleString()}</span>.</p>
                            <p className="mt-1 text-xs text-slate-500">{notification.nearLimit ? "This is near the KSh 2,000 debit limit." : `Debt has been outstanding for ${notification.ageDays} days.`}</p>
                            <button onClick={() => onClose(notification.id)} className="mt-3 text-xs font-semibold text-red-700 hover:text-red-900">Dismiss reminder</button>
                        </div>
                    </div>
                </div>
            ))}
        </div>
    );
}
