import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";
import ErrorAlert from "../components/ErrorAlert";

export default function Receipt() {

    const { saleId } = useParams();

    const [receipt, setReceipt] = useState(null);

    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    useEffect(() => {

        loadReceipt();

    }, []);

    async function loadReceipt() {

        try {

            const response = await api.get(`/receipts/${saleId}`);

            setReceipt(response.data);
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Failed to load receipt";
            setError(errorMessage);
            console.error(errorMessage);

        }

        finally {

            setLoading(false);

        }

    }

    const currency = window.__PETSHOP_SETTINGS__?.currency || "KSh";
    const settings = window.__PETSHOP_SETTINGS__ || {};

    useEffect(() => {
        if (receipt && settings.autoPrintReceipt) {
            const printTimer = setTimeout(() => window.print(), 200);
            return () => clearTimeout(printTimer);
        }
        return undefined;
    }, [receipt, settings.autoPrintReceipt]);

    if (loading) {

        return (

            <div className="p-8">
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                Loading receipt...

            </div>

        );

    }

    if (!receipt) {

        return (

            <div className="p-8">
                {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

                Receipt not found.

            </div>

        );

    }

    return (

        <div
            id="receipt"
            className="max-w-xl mx-auto bg-white shadow rounded-lg p-8"
        >

            <div className="text-center mb-6">
                <h1 className="text-3xl font-bold">{settings.businessName || "Receipt"}</h1>
                {settings.address && <p className="mt-1 text-sm text-slate-600 whitespace-pre-line">{settings.address}</p>}
                {(settings.phone || settings.email) && (
                    <p className="mt-1 text-sm text-slate-600">{[settings.phone, settings.email].filter(Boolean).join(" · ")}</p>
                )}
                <p className="mt-3 text-sm font-semibold uppercase tracking-wide text-slate-500">Sales receipt</p>
            </div>

            <div className="space-y-2">

                <p>

                    <strong>Receipt No:</strong> {receipt.receiptNumber}

                </p>

                <p>

                    <strong>Sale ID:</strong> {receipt.saleId}

                </p>

                <p>

                    <strong>Date:</strong> {receipt.saleDate}

                </p>

                <p>

                    <strong>Customer:</strong> {receipt.customerName ?? "Walk-In"}

                </p>

                <p>

                    <strong>Phone:</strong> {receipt.phoneNumber ?? "-"}

                </p>

                <p>

                    <strong>Payment Method:</strong> {receipt.paymentMethod}

                </p>

                <p>

                    <strong>Payment Status:</strong> {receipt.paymentStatus}

                </p>

                {

                    receipt.paymentMethod === "MPESA" &&
                    receipt.mpesaReceipt && (

                        <p>

                            <strong>M-Pesa Receipt:</strong> {receipt.mpesaReceipt}

                        </p>

                    )

                }

            </div>

            <table className="w-full mt-8 border-collapse">

                <thead>

                    <tr className="border-b">

                        <th className="text-left py-2">Item</th>

                        <th>Qty</th>

                        <th>Price</th>

                        <th>Total</th>

                    </tr>

                </thead>

                <tbody>

                    {

                        receipt.items.map(item => (

                            <tr key={item.productName} className="border-b">

                                <td className="py-2">

                                    {item.productName}

                                </td>

                                <td className="text-center">

                                    {item.quantity}

                                </td>

                                <td className="text-center">

                                    {currency} {item.unitPrice.toFixed(2)}

                                </td>

                                <td className="text-center">

                                    {currency} {item.subtotal.toFixed(2)}

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

            <div className="mt-8 text-right text-2xl font-bold">

                Total: {currency} {receipt.total.toFixed(2)}

            </div>
            {Number(settings.taxPercentage) > 0 && (
                <p className="mt-2 text-right text-sm text-slate-500">
                    Tax rate: {Number(settings.taxPercentage).toFixed(1)}%
                </p>
            )}
            {
                receipt.qrCode && (

                    <div className="mt-8 flex flex-col items-center">

                        <img
                            src={`data:image/png;base64,${receipt.qrCode}`}
                            alt="Receipt QR Code"
                            className="w-40 h-40"
                        />

                        <p className="mt-2 text-sm text-gray-500">

                            Scan to verify receipt

                        </p>

                    </div>

                )
            }

            {settings.receiptFooter && (
                <p className="mt-8 border-t pt-4 text-center text-sm text-slate-600 whitespace-pre-line">{settings.receiptFooter}</p>
            )}

            <div className="mt-8 flex justify-end">

                <button

                    onClick={() => window.print()}

                    className="bg-blue-600 text-white px-6 py-3 rounded-lg"

                >

                    Print Receipt

                </button>

            </div>

        </div>

    );

}
