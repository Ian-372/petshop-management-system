import { useEffect, useState } from "react";
import api from "../services/api";

export default function ViewCustomerModal({

    open,
    customerId,
    onClose

}) {

    const [profile, setProfile] = useState(null);

    useEffect(() => {

        if (!open || !customerId) {

            return;

        }

        loadProfile();

    }, [open, customerId]);

    async function loadProfile() {

        try {

            const response = await api.get(`/customers/${customerId}/profile`);

            setProfile(response.data);

        }

        catch (error) {

            console.error(error);

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

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-3xl p-6">

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

                        <p>KSh {profile.totalSpent.toLocaleString()}</p>

                    </div>

                    <div>

                        <strong>Loyalty Points</strong>

                        <p>{profile.loyaltyPoints}</p>

                    </div>

                    <div>

                        <strong>Purchases</strong>

                        <p>{profile.purchaseCount}</p>

                    </div>

                    <div>

                        <strong>Last Purchase</strong>

                        <p>

                            {

                                profile.lastPurchase

                                    ? new Date(profile.lastPurchase).toLocaleString()

                                    : "-"

                            }

                        </p>

                    </div>

                </div>

                <h3 className="font-bold text-lg mb-3">

                    Purchase History

                </h3>

                <table className="w-full">

                    <thead>

                        <tr className="bg-slate-100">

                            <th className="p-3 text-left">Date</th>

                            <th className="p-3 text-left">Items</th>

                            <th className="p-3 text-right">Total</th>

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

                                            new Date(sale.saleDate)

                                                .toLocaleString()

                                        }

                                    </td>

                                    <td className="p-3">

                                        {

                                            sale.items.join(", ")

                                        }

                                    </td>

                                    <td className="text-right p-3">

                                        KSh {sale.total.toLocaleString()}

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