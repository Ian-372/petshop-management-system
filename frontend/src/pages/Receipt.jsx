import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";

import api from "../services/api";

export default function Receipt() {

    const { saleId } = useParams();

    const [receipt, setReceipt] = useState(null);

    const [loading, setLoading] = useState(true);

    useEffect(() => {

        loadReceipt();

    }, []);

    async function loadReceipt() {

        try {

            const response = await api.get(`/receipts/${saleId}`);

            setReceipt(response.data);

        }

        catch (error) {

            console.error(error);

            alert("Failed to load receipt.");

        }

        finally {

            setLoading(false);

        }

    }

    if (loading) {

        return (

            <div className="p-8">

                Loading receipt...

            </div>

        );

    }

    if (!receipt) {

        return (

            <div className="p-8">

                Receipt not found.

            </div>

        );

    }

    return (

        <div
            id="receipt"
            className="max-w-xl mx-auto bg-white shadow rounded-lg p-8"
        >

            <h1 className="text-3xl font-bold text-center mb-6">

                Receipt

            </h1>

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

                                    {item.unitPrice.toFixed(2)}

                                </td>

                                <td className="text-center">

                                    {item.subtotal.toFixed(2)}

                                </td>

                            </tr>

                        ))

                    }

                </tbody>

            </table>

            <div className="mt-8 text-right text-2xl font-bold">

                Total: KSh {receipt.total.toFixed(2)}

            </div>

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