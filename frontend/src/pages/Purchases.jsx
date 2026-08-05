import { useEffect, useState } from "react";

import api from "../services/api";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import PrimaryButton from "../components/PrimaryButton";

import PurchaseModal from "../components/PurchaseModal";

export default function Purchases() {

    const [purchases, setPurchases] = useState([]);

    const [search, setSearch] = useState("");

    const [showPurchaseModal, setShowPurchaseModal] = useState(false);

    useEffect(() => {

        loadPurchases();

    }, []);

    async function loadPurchases() {

        try {

            const response = await api.get("/purchases");

            setPurchases(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }

    const filteredPurchases = purchases.filter(

        purchase =>

            purchase.supplierName
                .toLowerCase()
                .includes(search.toLowerCase())

    );

    return (

        <div>

            <PageHeader title="Purchases">

                <div className="flex flex-col md:flex-row justify-between gap-4">

                    <SearchBar

                        value={search}

                        onChange={setSearch}

                        placeholder="Search supplier..."

                    />

                    <PrimaryButton

                        onClick={() => setShowPurchaseModal(true)}

                    >

                        + New Purchase

                    </PrimaryButton>

                </div>

            </PageHeader>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="text-left p-4">

                                Purchase #

                            </th>

                            <th className="text-left p-4">

                                Supplier

                            </th>

                            <th className="text-left p-4">

                                Purchase Date

                            </th>

                            <th className="text-right p-4">

                                Total

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredPurchases.length === 0 ?

                                (

                                    <tr>

                                        <td

                                            colSpan="4"

                                            className="text-center p-10 text-gray-500"

                                        >

                                            No purchases found.

                                        </td>

                                    </tr>

                                )

                                :

                                (

                                    filteredPurchases.map(purchase => (

                                        <tr

                                            key={purchase.id}

                                            className="border-t hover:bg-slate-50"

                                        >

                                            <td className="p-4">

                                                #{purchase.id}

                                            </td>

                                            <td className="p-4">

                                                {purchase.supplierName}

                                            </td>

                                            <td className="p-4">

                                                {

                                                    new Date(

                                                        purchase.purchaseDate

                                                    ).toLocaleString()

                                                }

                                            </td>

                                            <td className="p-4 text-right font-bold text-green-600">

                                                KSh {

                                                    Number(

                                                        purchase.total

                                                    ).toLocaleString()

                                                }

                                            </td>

                                        </tr>

                                    ))

                                )

                        }

                    </tbody>

                </table>

            </div>

            <PurchaseModal

                open={showPurchaseModal}

                onClose={() =>

                    setShowPurchaseModal(false)

                }

                onSaved={() => {

                    loadPurchases();

                }}

            />

        </div>

    );

}