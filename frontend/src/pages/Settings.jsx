import { useEffect, useState } from "react";
import { getSettings, updateSettings } from "../services/settingsService";

export default function Settings() {

    const [loading, setLoading] = useState(true);

    const [saving, setSaving] = useState(false);

    const [settings, setSettings] = useState({

        storeName: "",

        phoneNumber: "",

        email: "",

        address: "",

        currency: "KSh",

        receiptFooter: "",

        vatPercentage: 16,

        lowStockThreshold: 10,

        autoPrintReceipt: false,

        showQrCode: true

    });

    useEffect(() => {

        loadSettings();

    }, []);

    async function loadSettings() {

        try {

            const data = await getSettings();

            setSettings(data);

        }

        catch (error) {

            console.error(error);

            alert("Failed to load settings.");

        }

        finally {

            setLoading(false);

        }

    }

    function handleChange(e) {

        const { name, value, type, checked } = e.target;

        setSettings({

            ...settings,

            [name]: type === "checkbox"
                ? checked
                : value

        });

    }

    async function handleSubmit(e) {

        e.preventDefault();

        setSaving(true);

        try {

            const updated = await updateSettings(settings);

            setSettings(updated);

            alert("Settings saved successfully.");

        }

        catch (error) {

            console.error(error);

            alert("Failed to save settings.");

        }

        finally {

            setSaving(false);

        }

    }

    if (loading) {

        return <div className="p-8">Loading settings...</div>;

    }

    return (

        <div className="max-w-5xl mx-auto p-8">

            <h1 className="text-3xl font-bold mb-8">

                Settings

            </h1>

            <form
                onSubmit={handleSubmit}
                className="space-y-8"
            >

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-4">

                        Store Information

                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            name="storeName"
                            value={settings.storeName}
                            onChange={handleChange}
                            placeholder="Store Name"
                            className="border rounded-lg p-3"
                        />

                        <input
                            name="phoneNumber"
                            value={settings.phoneNumber}
                            onChange={handleChange}
                            placeholder="Phone Number"
                            className="border rounded-lg p-3"
                        />

                        <input
                            name="email"
                            value={settings.email}
                            onChange={handleChange}
                            placeholder="Email"
                            className="border rounded-lg p-3"
                        />

                        <input
                            name="address"
                            value={settings.address}
                            onChange={handleChange}
                            placeholder="Address"
                            className="border rounded-lg p-3"
                        />

                    </div>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-4">

                        Receipt Settings

                    </h2>

                    <textarea
                        name="receiptFooter"
                        value={settings.receiptFooter}
                        onChange={handleChange}
                        className="border rounded-lg p-3 w-full"
                        rows={3}
                    />

                    <div className="mt-5 space-y-3">

                        <label className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                name="showQrCode"
                                checked={settings.showQrCode}
                                onChange={handleChange}
                            />

                            Show QR Code on Receipts

                        </label>

                        <label className="flex items-center gap-3">

                            <input
                                type="checkbox"
                                name="autoPrintReceipt"
                                checked={settings.autoPrintReceipt}
                                onChange={handleChange}
                            />

                            Auto Print Receipt

                        </label>

                    </div>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-semibold mb-4">

                        Business Rules

                    </h2>

                    <div className="grid grid-cols-2 gap-4">

                        <input
                            type="number"
                            name="vatPercentage"
                            value={settings.vatPercentage}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            placeholder="VAT %"
                        />

                        <input
                            type="number"
                            name="lowStockThreshold"
                            value={settings.lowStockThreshold}
                            onChange={handleChange}
                            className="border rounded-lg p-3"
                            placeholder="Low Stock Threshold"
                        />

                    </div>

                </div>

                <button

                    disabled={saving}

                    className="bg-blue-600 text-white px-8 py-3 rounded-lg"

                >

                    {

                        saving

                            ? "Saving..."

                            : "Save Settings"

                    }

                </button>

            </form>

        </div>

    );

}