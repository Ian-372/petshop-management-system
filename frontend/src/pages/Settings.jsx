import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../services/settingsService";
import ErrorAlert from "../components/ErrorAlert";

const defaultSettings = {
    businessName: "",
    phone: "",
    email: "",
    address: "",
    currency: "KSh",
    taxPercentage: 16,
    receiptFooter: "",
    autoPrintReceipt: false,
    lowStockAlerts: true,
    deleteConfirmation: true,
    salesNotifications: true,
    debtAlerts: true,
};

function normalizeSettings(data = {}) {
    return {
        businessName: data.businessName ?? "",
        phone: data.phone ?? "",
        email: data.email ?? "",
        address: data.address ?? "",
        currency: data.currency ?? "KSh",
        taxPercentage: Number(data.taxPercentage ?? 16),
        receiptFooter: data.receiptFooter ?? "",
        autoPrintReceipt: Boolean(data.autoPrintReceipt),
        lowStockAlerts: Boolean(data.lowStockAlerts),
        deleteConfirmation: Boolean(data.deleteConfirmation),
        salesNotifications: Boolean(data.salesNotifications),
        debtAlerts: data.debtAlerts !== false,
    };
}

export default function Settings() {
    const [loading, setLoading] = useState(true);
    const [saving, setSaving] = useState(false);
    const [error, setError] = useState(null);
    const [success, setSuccess] = useState(null);
    const [settings, setSettings] = useState(defaultSettings);

    useEffect(() => {
        loadSettings();
    }, []);

    async function loadSettings() {
        try {
            setError(null);
            const data = await getSettings();
            const normalized = normalizeSettings(data);
            setSettings(normalized);
            window.__PETSHOP_SETTINGS__ = normalized;
            window.dispatchEvent(new CustomEvent("petshop-settings-changed", { detail: normalized }));
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to load settings.";
            setError(message);
            console.error(message);
        } finally {
            setLoading(false);
        }
    }

    function handleChange(e) {
        const { name, value, type, checked } = e.target;

        setSettings((prev) => ({
            ...prev,
            [name]: type === "checkbox" ? checked : value,
        }));
    }

    async function handleSubmit(e) {
        e.preventDefault();
        setSaving(true);
        setError(null);
        setSuccess(null);

        try {
            const payload = {
                ...settings,
                taxPercentage: Number(settings.taxPercentage) || 0,
            };

            const updated = await updateSettings(payload);
            const normalized = normalizeSettings(updated);
            setSettings(normalized);
            window.__PETSHOP_SETTINGS__ = normalized;
            window.dispatchEvent(new CustomEvent("petshop-settings-changed", { detail: normalized }));
            setSuccess("Settings saved successfully.");
        } catch (error) {
            const message = error.response?.data?.message || error.message || "Failed to save settings.";
            setError(message);
            console.error(message);
        } finally {
            setSaving(false);
        }
    }

    if (loading) {
        return (
            <div className="max-w-6xl mx-auto p-8">
                <div className="card p-8 text-slate-600">Loading settings...</div>
            </div>
        );
    }

    return (
        <div className="mx-auto max-w-6xl space-y-6 pb-12 sm:p-6 lg:p-8">
            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
                <div>
                    <p className="text-sm font-semibold uppercase tracking-[0.2em] text-blue-600">Admin panel</p>
                    <h1 className="mt-2 text-2xl font-bold text-slate-900 sm:text-3xl lg:text-4xl">Business Settings</h1>
                    <p className="text-slate-500 mt-1">Configure your store information, receipt details, and operational preferences.</p>
                </div>

                <button
                    type="button"
                    onClick={loadSettings}
                    className="w-full rounded-lg border border-slate-200 bg-white px-4 py-2 text-slate-700 font-medium transition-colors hover:bg-slate-50 sm:w-auto"
                >
                    Refresh
                </button>
            </div>

            {success && (
                <div className="rounded-xl border border-emerald-200 bg-emerald-50 text-emerald-700 px-4 py-3 text-sm font-medium">
                    {success}
                </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-6">
                <section className="card p-4 sm:p-6">
                    <div className="flex items-center justify-between mb-5">
                        <h2 className="text-xl font-bold text-slate-900">Store profile</h2>
                        <span className="badge badge-info">Live</span>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">Business name</span>
                            <input
                                name="businessName"
                                value={settings.businessName}
                                onChange={handleChange}
                                placeholder="PetShop Management"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">Phone</span>
                            <input
                                name="phone"
                                value={settings.phone}
                                onChange={handleChange}
                                placeholder="2547XXXXXXXX"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">Email</span>
                            <input
                                type="email"
                                name="email"
                                value={settings.email}
                                onChange={handleChange}
                                placeholder="admin@petshop.co.ke"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>

                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">Currency</span>
                            <select
                                name="currency"
                                value={settings.currency}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            >
                                <option value="KSh">KSh - Kenyan Shilling</option>
                                <option value="USD">USD - US Dollar</option>
                                <option value="EUR">EUR - Euro</option>
                            </select>
                        </label>

                        <label className="space-y-2 md:col-span-2">
                            <span className="text-sm font-semibold text-slate-700">Address</span>
                            <textarea
                                name="address"
                                value={settings.address}
                                onChange={handleChange}
                                rows={3}
                                placeholder="Shop street, city, county"
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                    </div>
                </section>

                <section className="card p-4 sm:p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-5">Receipt & tax</h2>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
                        <label className="space-y-2">
                            <span className="text-sm font-semibold text-slate-700">Tax percentage</span>
                            <input
                                type="number"
                                min="0"
                                step="0.1"
                                name="taxPercentage"
                                value={settings.taxPercentage}
                                onChange={handleChange}
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>

                        <div className="rounded-2xl border border-blue-100 bg-blue-50 p-4">
                            <p className="text-xs uppercase tracking-[0.15em] text-blue-700 font-semibold">Receipt footer</p>
                            <p className="mt-2 text-sm text-slate-700">This text, the store profile, currency, and tax rate appear on printed or digital receipts.</p>
                        </div>

                        <label className="space-y-2 md:col-span-2">
                            <span className="text-sm font-semibold text-slate-700">Footer message</span>
                            <textarea
                                name="receiptFooter"
                                value={settings.receiptFooter}
                                onChange={handleChange}
                                rows={4}
                                placeholder="Thank you for shopping with us. We value your business."
                                className="w-full rounded-xl border border-slate-200 bg-slate-50 px-4 py-3 text-slate-900 placeholder-slate-400 focus:border-blue-400 focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-200"
                            />
                        </label>
                    </div>
                </section>

                <section className="card p-4 sm:p-6">
                    <h2 className="text-xl font-bold text-slate-900 mb-5">Operational preferences</h2>

                    <div className="space-y-4">
                        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <p className="font-semibold text-slate-900">Auto print receipt</p>
                                <p className="text-sm text-slate-500">Print customer receipts automatically after every successful sale.</p>
                            </div>
                            <button
                                type="button"
                                aria-pressed={settings.autoPrintReceipt}
                                onClick={() => setSettings((prev) => ({ ...prev, autoPrintReceipt: !prev.autoPrintReceipt }))}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.autoPrintReceipt ? "bg-blue-600" : "bg-slate-300"}`}
                            >
                                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${settings.autoPrintReceipt ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </label>

                        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <p className="font-semibold text-slate-900">Low stock alerts</p>
                                <p className="text-sm text-slate-500">Notify the admin when products drop below the safe stock level.</p>
                            </div>
                            <button
                                type="button"
                                aria-pressed={settings.lowStockAlerts}
                                onClick={() => setSettings((prev) => ({ ...prev, lowStockAlerts: !prev.lowStockAlerts }))}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.lowStockAlerts ? "bg-amber-500" : "bg-slate-300"}`}
                            >
                                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${settings.lowStockAlerts ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </label>

                        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <p className="font-semibold text-slate-900">Confirmation before delete</p>
                                <p className="text-sm text-slate-500">Require confirmation before deleting customers, products, and suppliers.</p>
                            </div>
                            <button
                                type="button"
                                aria-pressed={settings.deleteConfirmation}
                                onClick={() => setSettings((prev) => ({ ...prev, deleteConfirmation: !prev.deleteConfirmation }))}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.deleteConfirmation ? "bg-emerald-500" : "bg-slate-300"}`}
                            >
                                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${settings.deleteConfirmation ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </label>

                        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <p className="font-semibold text-slate-900">Sales notifications</p>
                                <p className="text-sm text-slate-500">Enable sale activity and reminder updates for the admin dashboard.</p>
                            </div>
                            <button
                                type="button"
                                aria-pressed={settings.salesNotifications}
                                onClick={() => setSettings((prev) => ({ ...prev, salesNotifications: !prev.salesNotifications }))}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.salesNotifications ? "bg-violet-500" : "bg-slate-300"}`}
                            >
                                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${settings.salesNotifications ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </label>

                        <label className="flex items-center justify-between gap-4 rounded-2xl border border-slate-200 bg-slate-50 p-4">
                            <div>
                                <p className="font-semibold text-slate-900">Debt reminder alerts</p>
                                <p className="text-sm text-slate-500">Notify the admin about customers near the KSh 2,000 limit or carrying debt for 30 days or more.</p>
                            </div>
                            <button
                                type="button"
                                aria-pressed={settings.debtAlerts}
                                onClick={() => setSettings((prev) => ({ ...prev, debtAlerts: !prev.debtAlerts }))}
                                className={`relative inline-flex h-7 w-12 items-center rounded-full transition-colors ${settings.debtAlerts ? "bg-red-500" : "bg-slate-300"}`}
                            >
                                <span className={`inline-block h-5 w-5 rounded-full bg-white shadow transform transition-transform ${settings.debtAlerts ? "translate-x-6" : "translate-x-1"}`} />
                            </button>
                        </label>
                    </div>
                </section>

                <div className="flex justify-end">
                    <button
                        type="submit"
                        disabled={saving}
                        className="px-6 py-3 rounded-xl bg-blue-600 text-white font-semibold hover:bg-blue-700 transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                    >
                        {saving ? "Saving settings..." : "Save settings"}
                    </button>
                </div>
            </form>
        </div>
    );
}
