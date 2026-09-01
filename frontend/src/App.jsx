import { useEffect, useMemo, useState } from "react";
import AppRouter from "./router/AppRouter";
import StockAlertToast from "./components/StockAlertToast";
import api from "./services/api";
import { getSettings } from "./services/settingsService";
import SalesActivityToast from "./components/SalesActivityToast";
import DebtAlertToast from "./components/DebtAlertToast";

export default function App() {
    const [isAuthenticated, setIsAuthenticated] = useState(
        () => Boolean(localStorage.getItem("token"))
    );
    const [stockAlerts, setStockAlerts] = useState([]);
    const [appSettings, setAppSettings] = useState(null);
    const [salesNotifications, setSalesNotifications] = useState([]);
    const [debtAlerts, setDebtAlerts] = useState([]);
    const [dismissedDebtAlertIds, setDismissedDebtAlertIds] = useState([]);
    const [loginSuccess, setLoginSuccess] = useState(false);

    useEffect(() => {
        const syncAuthentication = (event) => {
            setIsAuthenticated(Boolean(localStorage.getItem("token")));

            if (event.detail?.type === "login") {
                setLoginSuccess(true);
            }
        };

        window.addEventListener("petshop-auth-changed", syncAuthentication);
        window.addEventListener("storage", syncAuthentication);

        return () => {
            window.removeEventListener("petshop-auth-changed", syncAuthentication);
            window.removeEventListener("storage", syncAuthentication);
        };
    }, []);

    useEffect(() => {
        if (!loginSuccess) {
            return undefined;
        }

        const timer = setTimeout(() => setLoginSuccess(false), 3000);
        return () => clearTimeout(timer);
    }, [loginSuccess]);

    useEffect(() => {
        if (!isAuthenticated) {
            return undefined;
        }

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
    }, [isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            return undefined;
        }

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
    }, [appSettings, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            return undefined;
        }

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
    }, [appSettings?.salesNotifications, isAuthenticated]);

    useEffect(() => {
        if (!isAuthenticated) {
            return undefined;
        }

        let cancelled = false;
        async function loadDebtAlerts() {
            if (appSettings?.debtAlerts === false) { setDebtAlerts([]); return; }
            try {
                const [customersResponse, transactionsResponse] = await Promise.all([api.get("/customers"), api.get("/reports/transactions")]);
                if (cancelled) return;
                const now = new Date();
                const alerts = (customersResponse.data || []).filter(customer => Number(customer.totalDebt || 0) > 0).map(customer => {
                    const oldestDebtSale = (transactionsResponse.data || []).filter(sale => sale.customerId === customer.id && sale.paymentStatus === "DEBT").reduce((oldest, sale) => !oldest || new Date(sale.saleDate) < new Date(oldest.saleDate) ? sale : oldest, null);
                    const ageDays = oldestDebtSale ? Math.max(0, Math.floor((now - new Date(oldestDebtSale.saleDate)) / 86400000)) : 0;
                    return { id: `debt-${customer.id}-${Number(customer.totalDebt)}`, customerName: customer.name, debt: customer.totalDebt, ageDays, nearLimit: Number(customer.totalDebt) >= 1600, longOutstanding: ageDays >= 30 };
                }).filter(alert => alert.nearLimit || alert.longOutstanding);
                setDebtAlerts(alerts);
            } catch (error) { console.error("Debt alert check failed:", error); }
        }
        loadDebtAlerts();
        const timer = setInterval(loadDebtAlerts, 60000);
        return () => { cancelled = true; clearInterval(timer); };
    }, [appSettings?.debtAlerts, isAuthenticated]);

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
            {loginSuccess && (
                <div className="fixed top-5 right-5 z-50 rounded-lg border border-emerald-200 bg-emerald-50 px-4 py-3 text-sm font-medium text-emerald-800 shadow-lg">
                    Signed in successfully.
                </div>
            )}
            <StockAlertToast notifications={visibleAlerts} onClose={dismissAlert} />
            <SalesActivityToast
                notifications={salesNotifications}
                currency={appSettings?.currency || "KSh"}
                onClose={(id) => setSalesNotifications((previous) => previous.filter((notification) => notification.id !== id))}
            />
            <DebtAlertToast
                notifications={appSettings?.debtAlerts === false ? [] : debtAlerts.filter((alert) => !dismissedDebtAlertIds.includes(alert.id))}
                currency={appSettings?.currency || "KSh"}
                onClose={(id) => setDismissedDebtAlertIds((previous) => [...previous, id])}
            />
        </>
    );
}
