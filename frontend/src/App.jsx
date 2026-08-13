import { useEffect, useMemo, useState } from "react";
import AppRouter from "./router/AppRouter";
import StockAlertToast from "./components/StockAlertToast";
import api from "./services/api";

export default function App() {
    const [stockAlerts, setStockAlerts] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function loadAlerts() {
            try {
                const response = await api.get("/stock");
                const items = response.data || [];

                if (cancelled) {
                    return;
                }

                const alerts = items
                    .filter((item) => item.quantity <= (item.lowStock ? 5 : 0) || item.quantity === 0)
                    .map((item) => ({
                        id: `stock-${item.productId}`,
                        productName: item.productName,
                        quantity: item.quantity,
                        level: item.quantity === 0 ? "out" : "low"
                    }));

                setStockAlerts((prev) => {
                    const existing = new Map(prev.map((item) => [item.id, item]));
                    const next = alerts.map((alert) => existing.get(alert.id) || alert);
                    return next;
                });
            } catch (error) {
                console.error("Stock alert check failed:", error);
            }
        }

        loadAlerts();
        const timer = setInterval(loadAlerts, 60000);

        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, []);

    const visibleAlerts = useMemo(
        () => stockAlerts.filter((item) => item.quantity <= 5 && item.quantity >= 0),
        [stockAlerts]
    );

    const dismissAlert = (id) => {
        setStockAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <>
            <AppRouter />
            <StockAlertToast notifications={visibleAlerts} onClose={dismissAlert} />
        </>
    );
}