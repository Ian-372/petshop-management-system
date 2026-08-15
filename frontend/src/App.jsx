import { useEffect, useMemo, useState } from "react";
import AppRouter from "./router/AppRouter";
import StockAlertToast from "./components/StockAlertToast";
import api from "./services/api";
import { getSettings } from "./services/settingsService";
import SalesActivityToast from "./components/SalesActivityToast";

export default function App() {
    const [stockAlerts, setStockAlerts] = useState([]);
    const [appSettings, setAppSettings] = useState(null);
    const [salesNotifications, setSalesNotifications] = useState([]);

    useEffect(() => {
        let cancelled = false;

        async function loadSettings() {
            try {
                const settings = await getSettings();
                if (cancelled) {
                    return;
                }

                setAppSettings(settings);
                window.__PETSHOP_SETTINGS__ = settings;
            } catch (error) {
                console.error("Settings load failed:", error);
            }
        }

        loadSettings();
        const settingsTimer = setInterval(loadSettings, 60000);
        const handleSettingsChange = (event) => {
            setAppSettings(event.detail);
        };
        window.addEventListener("petshop-settings-changed", handleSettingsChange);

        return () => {
            cancelled = true;
            clearInterval(settingsTimer);
            window.removeEventListener("petshop-settings-changed", handleSettingsChange);
        };
    }, []);

    useEffect(() => {
        let cancelled = false;

        async function loadAlerts() {
            if (!appSettings || appSettings.lowStockAlerts === false) {
                setStockAlerts([]);
                return;
            }

            try {
                const response = await api.get("/stock");
                const items = response.data || [];

                if (cancelled) {
                    return;
                }

                const alerts = items
                    .filter((item) => item.quantity <= 10)
                    .map((item) => ({
                        id: `stock-${item.productId}`,
                        productName: item.productName,
                        quantity: item.quantity,
                        level: item.quantity === 0 ? "out" : "low"
                    }));

                setStockAlerts(alerts);
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
    }, [appSettings]);

    useEffect(() => {
        let cancelled = false;
        let knownSaleIds = null;

        async function checkForNewSales() {
            if (appSettings?.salesNotifications === false) {
                setSalesNotifications([]);
                knownSaleIds = null;
                return;
            }

            try {
                const response = await api.get("/sales");
                const sales = response.data || [];
                const currentSaleIds = new Set(sales.map((sale) => sale.id));

                if (knownSaleIds !== null && !cancelled) {
                    const newSales = sales
                        .filter((sale) => !knownSaleIds.has(sale.id))
                        .map((sale) => ({
                            id: `sale-${sale.id}`,
                            customerName: sale.customerName || "Walk-In customer",
                            total: sale.total,
                        }));

                    if (newSales.length) {
                        setSalesNotifications((previous) => [...newSales, ...previous]);
                    }
                }

                knownSaleIds = currentSaleIds;
            } catch (error) {
                console.error("Sale notification check failed:", error);
            }
        }

        checkForNewSales();
        const timer = setInterval(checkForNewSales, 60000);
        return () => {
            cancelled = true;
            clearInterval(timer);
        };
    }, [appSettings?.salesNotifications]);

    const visibleAlerts = useMemo(
        () => (appSettings?.lowStockAlerts === false ? [] : stockAlerts.filter((item) => item.quantity <= 10 && item.quantity >= 0)),
        [appSettings, stockAlerts]
    );

    const dismissAlert = (id) => {
        setStockAlerts((prev) => prev.filter((alert) => alert.id !== id));
    };

    return (
        <>
            <AppRouter />
            <StockAlertToast notifications={visibleAlerts} onClose={dismissAlert} />
            <SalesActivityToast
                notifications={salesNotifications}
                currency={appSettings?.currency || "KSh"}
                onClose={(id) => setSalesNotifications((previous) => previous.filter((notification) => notification.id !== id))}
            />
        </>
    );
}
