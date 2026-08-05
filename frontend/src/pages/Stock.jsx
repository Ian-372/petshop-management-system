import { useEffect, useState } from "react";

import api from "../services/api";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";
import StockAdjustmentModal from "../components/StockAdjustmentModal";

export default function Stock() {

    const [stock, setStock] = useState([]);

    const [search, setSearch] = useState("");

    const [showLowOnly, setShowLowOnly] = useState(false);

    const [showAdjustModal, setShowAdjustModal] = useState(false);

    useEffect(() => {

        loadStock();

    }, []);

    async function loadStock() {

        try {

            const endpoint = showLowOnly
                ? "/stock/low"
                : "/stock";

            const response = await api.get(endpoint);

            setStock(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }

    useEffect(() => {

        loadStock();

    }, [showLowOnly]);

    const filteredStock = stock.filter(item =>

        item.productName
            .toLowerCase()
            .includes(search.toLowerCase())

    );

    return (

        <div>

            <PageHeader title="Stock Inventory">

                <div className="flex flex-col md:flex-row gap-4">

                    <SearchBar
                        value={search}
                        onChange={setSearch}
                        placeholder="Search products..."
                    />

                    <SecondaryButton
                        onClick={() => setShowLowOnly(!showLowOnly)}
                    >

                        {

                            showLowOnly

                                ? "Show All"

                                : "Low Stock"

                        }

                    </SecondaryButton>

                    <PrimaryButton
                        onClick={() => setShowAdjustModal(true)}
                    >

                        Adjust Stock

                    </PrimaryButton>

                </div>

            </PageHeader>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="p-4 text-left">

                                Product

                            </th>

                            <th className="p-4 text-left">

                                Category

                            </th>

                            <th className="p-4 text-center">

                                Stock

                            </th>

                            <th className="p-4 text-center">

                                Status

                            </th>

                            <th className="p-4 text-right">

                                Buying

                            </th>

                            <th className="p-4 text-right">

                                Selling

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredStock.map(item => (

                                <tr

                                    key={item.productId}

                                    className="border-t"

                                >

                                    <td className="p-4">

                                        {item.productName}

                                    </td>

                                    <td className="p-4">

                                        {item.category}

                                    </td>

                                    <td className="p-4 text-center font-bold">

                                        {item.quantity}

                                    </td>

                                    <td className="p-4 text-center">

                                        {

                                            item.quantity === 0 ?

                                                <span className="text-red-600 font-bold">

                                                    Out of Stock

                                                </span>

                                                :

                                                item.lowStock ?

                                                    <span className="text-orange-500 font-bold">

                                                        Low Stock

                                                    </span>

                                                    :

                                                    <span className="text-green-600 font-bold">

                                                        In Stock

                                                    </span>

                                        }

                                    </td>

                                    <td className="p-4 text-right">

                                        KSh {item.buyingPrice}

                                    </td>

                                    <td className="p-4 text-right">

                                        KSh {item.sellingPrice}

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>
            <StockAdjustmentModal

                open={showAdjustModal}

                onClose={() => setShowAdjustModal(false)}

                onSaved={() => {

                    loadStock();

                }}

            />

        </div>

    );

}