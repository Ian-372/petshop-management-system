import { useEffect, useState } from "react";
import api from "../services/api";

export default function ViewCustomerModal({
    open,
    customerId,
    onClose
}) {

    const [profile, setProfile] = useState(null);
    const [payments, setPayments] = useState([]);

    const [paymentAmount, setPaymentAmount] = useState("");
    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const [reference, setReference] = useState("");

    const [processingPayment, setProcessingPayment] = useState(false);


    useEffect(() => {

        if (!open || !customerId) {

            return;

        }

        loadProfile();
        loadPayments();

    }, [open, customerId]);


    async function loadProfile() {

        try {

            const response =
                await api.get(`/customers/${customerId}/profile`);

            setProfile(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }


    async function loadPayments() {

        try {

            const response =
                await api.get(
                    `/debt-payments/customer/${customerId}`
                );

            setPayments(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }


    async function makeDebtPayment() {

        const amount = Number(paymentAmount || 0);

        const currentDebt =
            Number(profile?.totalDebt || 0);


        if (amount <= 0) {

            alert("Enter a valid payment amount.");

            return;

        }


        if (amount > currentDebt) {

            alert(
                "Payment cannot exceed the customer's current debt."
            );

            return;

        }


        if (
            paymentMethod === "MPESA" &&
            !reference.trim()
        ) {

            alert(
                "Enter the M-Pesa transaction reference."
            );

            return;

        }


        try {

            setProcessingPayment(true);


            await api.post("/debt-payments", {

                customerId: customerId,

                amount: amount,

                paymentMethod: paymentMethod,

                reference:
                    reference.trim() || null,

                notes: "Debt repayment",

                receivedBy: "Cashier"

            });


            alert("Debt payment recorded successfully.");


            setPaymentAmount("");

            setReference("");


            /*
             * Reload the actual figures
             * from the database.
             */

            await loadProfile();

            await loadPayments();

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to record debt payment."

            );

        }

        finally {

            setProcessingPayment(false);

        }

    }


    if (!open) return null;


    if (!profile) {

        return (

            <div className="fixed inset-0 bg-black/40 flex items-center justify-center">

                <div className="bg-white rounded-xl p-8">

                    Loading...

                </div>

            </div>

        );

    }


    const currentDebt =
        Number(profile.totalDebt || 0);


    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-6 max-h-[90vh] overflow-y-auto">


                {/* HEADER */}

                <div className="flex justify-between items-center mb-6">

                    <h2 className="text-2xl font-bold">

                        Customer Profile

                    </h2>

                    <button

                        onClick={onClose}

                        className="text-xl"

                    >

                        ✕

                    </button>

                </div>


                {/* CUSTOMER DETAILS */}

                <div className="grid grid-cols-2 gap-4 mb-6">

                    <div>

                        <strong>Name</strong>

                        <p>{profile.name}</p>

                    </div>


                    <div>

                        <strong>Phone</strong>

                        <p>{profile.phone}</p>

                    </div>


                    <div>

                        <strong>Email</strong>

                        <p>{profile.email || "-"}</p>

                    </div>


                    <div>

                        <strong>Address</strong>

                        <p>{profile.address || "-"}</p>

                    </div>


                    <div>

                        <strong>Total Spent</strong>

                        <p>

                            KSh{" "}

                            {Number(
                                profile.totalSpent || 0
                            ).toLocaleString()}

                        </p>

                    </div>


                    <div>

                        <strong>Outstanding Debt</strong>

                        <p className="font-bold text-red-600">

                            KSh{" "}

                            {currentDebt.toLocaleString()}

                        </p>

                    </div>


                    <div>

                        <strong>Loyalty Points</strong>

                        <p>

                            {profile.loyaltyPoints}

                        </p>

                    </div>


                    <div>

                        <strong>Purchases</strong>

                        <p>

                            {profile.purchaseCount}

                        </p>

                    </div>


                    <div>

                        <strong>Last Purchase</strong>

                        <p>

                            {

                                profile.lastPurchase

                                    ? new Date(
                                        profile.lastPurchase
                                    ).toLocaleString()

                                    : "-"

                            }

                        </p>

                    </div>

                </div>


                {/* DEBT PAYMENT */}

                {currentDebt > 0 && (

                    <div className="border rounded-xl p-5 mb-8 bg-slate-50">

                        <h3 className="font-bold text-lg mb-4">

                            Pay Outstanding Debt

                        </h3>


                        <div className="mb-4">

                            <p className="text-sm text-slate-500">

                                Current Outstanding Debt

                            </p>

                            <p className="text-2xl font-bold text-red-600">

                                KSh{" "}

                                {currentDebt.toLocaleString()}

                            </p>

                        </div>


                        <div className="grid grid-cols-2 gap-4">


                            {/* AMOUNT */}

                            <div>

                                <label className="font-semibold">

                                    Payment Amount

                                </label>

                                <input

                                    type="number"

                                    min="1"

                                    max={currentDebt}

                                    value={paymentAmount}

                                    onChange={(e) =>
                                        setPaymentAmount(
                                            e.target.value
                                        )
                                    }

                                    placeholder="Enter amount"

                                    className="w-full border rounded-lg p-3 mt-2"

                                />

                            </div>


                            {/* METHOD */}

                            <div>

                                <label className="font-semibold">

                                    Payment Method

                                </label>

                                <select

                                    value={paymentMethod}

                                    onChange={(e) =>
                                        setPaymentMethod(
                                            e.target.value
                                        )
                                    }

                                    className="w-full border rounded-lg p-3 mt-2"

                                >

                                    <option value="CASH">

                                        Cash

                                    </option>

                                    <option value="MPESA">

                                        M-Pesa

                                    </option>

                                </select>

                            </div>


                            {/* MPESA REFERENCE */}

                            {paymentMethod === "MPESA" && (

                                <div className="col-span-2">

                                    <label className="font-semibold">

                                        M-Pesa Transaction Reference

                                    </label>

                                    <input

                                        value={reference}

                                        onChange={(e) =>
                                            setReference(
                                                e.target.value
                                            )
                                        }

                                        placeholder="e.g. QGH7ABC123"

                                        className="w-full border rounded-lg p-3 mt-2"

                                    />

                                </div>

                            )}


                        </div>


                        <button

                            onClick={makeDebtPayment}

                            disabled={processingPayment}

                            className="mt-4 w-full bg-green-600 text-white rounded-lg p-3 font-semibold hover:bg-green-700 disabled:opacity-50"

                        >

                            {processingPayment

                                ? "Processing..."

                                : "Record Debt Payment"

                            }

                        </button>

                    </div>

                )}


                {/* PAYMENT HISTORY */}

                <h3 className="font-bold text-lg mb-3">

                    Debt Payment History

                </h3>


                {payments.length === 0 ? (

                    <p className="text-slate-500 mb-8">

                        No debt payments recorded.

                    </p>

                ) : (

                    <div className="overflow-x-auto mb-8">

                        <table className="w-full">

                            <thead>

                                <tr className="bg-slate-100">

                                    <th className="p-3 text-left">

                                        Date

                                    </th>

                                    <th className="p-3 text-right">

                                        Amount

                                    </th>

                                    <th className="p-3 text-left">

                                        Method

                                    </th>

                                    <th className="p-3 text-left">

                                        Reference

                                    </th>

                                    <th className="p-3 text-right">

                                        Remaining

                                    </th>

                                </tr>

                            </thead>

                            <tbody>

                                {payments.map(payment => (

                                    <tr

                                        key={payment.id}

                                        className="border-t"

                                    >

                                        <td className="p-3">

                                            {

                                                new Date(
                                                    payment.paymentDate
                                                ).toLocaleString()

                                            }

                                        </td>

                                        <td className="p-3 text-right font-semibold">

                                            KSh{" "}

                                            {Number(
                                                payment.amount || 0
                                            ).toLocaleString()}

                                        </td>

                                        <td className="p-3">

                                            {payment.paymentMethod}

                                        </td>

                                        <td className="p-3">

                                            {payment.reference || "-"}

                                        </td>

                                        <td className="p-3 text-right">

                                            KSh{" "}

                                            {Number(
                                                payment.remainingDebt || 0
                                            ).toLocaleString()}

                                        </td>

                                    </tr>

                                ))}

                            </tbody>

                        </table>

                    </div>

                )}


                {/* PURCHASE HISTORY */}

                <h3 className="font-bold text-lg mb-3">

                    Purchase History

                </h3>


                <table className="w-full">

                    <thead>

                        <tr className="bg-slate-100">

                            <th className="p-3 text-left">

                                Date

                            </th>

                            <th className="p-3 text-left">

                                Items

                            </th>

                            <th className="p-3 text-right">

                                Total

                            </th>

                            <th className="p-3 text-left">

                                Payment

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            profile.purchases.map(sale => (

                                <tr

                                    key={sale.saleId}

                                    className="border-t"

                                >

                                    <td className="p-3">

                                        {

                                            new Date(
                                                sale.saleDate
                                            ).toLocaleString()

                                        }

                                    </td>

                                    <td className="p-3">

                                        {sale.items.join(", ")}

                                    </td>

                                    <td className="text-right p-3">

                                        KSh{" "}

                                        {Number(
                                            sale.total || 0
                                        ).toLocaleString()}

                                    </td>

                                    <td className="p-3">

                                        {sale.paymentMethod}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

        </div>

    );

}