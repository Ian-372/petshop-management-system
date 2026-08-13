import { useEffect, useState } from "react";

import api from "../services/api";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import SecondaryButton from "../components/SecondaryButton";
import PrimaryButton from "../components/PrimaryButton";
import StockAdjustmentModal from "../components/StockAdjustmentModal";

import { FaWarehouse, FaFilter, FaEdit } from "react-icons/fa";

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

        <div className="space-y-8 pb-8">

            <div>
                <h1 className="text-4xl font-bold text-slate-900 mb-1">
                    Stock Inventory
                </h1>
                <p className="text-slate-500 text-sm">
                    Monitor and manage your product stock levels
                </p>
            </div>

            <div className="flex flex-col md:flex-row gap-4">

                <SearchBar
                    value={search}
                    onChange={setSearch}
                    placeholder="Search products by name..."
                />

                <button
                    onClick={() => setShowLowOnly(!showLowOnly)}
                    className={`px-6 py-2.5 rounded-lg font-medium transition-all duration-200 flex items-center gap-2 whitespace-nowrap ${
                        showLowOnly
                            ? 'bg-amber-100 text-amber-700 border border-amber-300'
                            : 'bg-slate-200 hover:bg-slate-300 text-slate-900'
                    }`}
                >

                    <FaFilter className="text-lg" />

                    {

                        showLowOnly

                            ? "Showing Low Stock"

                            : "Show All"

                    }

                </button>

                <PrimaryButton
                    onClick={() => setShowAdjustModal(true)}
                >

                    <FaEdit className="mr-2 inline" /> Adjust Stock

                </PrimaryButton>

            </div>

            <div className="card overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">

                        <tr>

                            <th className="p-4 text-left font-bold text-slate-700">

                                Product

                            </th>

                            <th className="p-4 text-left font-bold text-slate-700">

                                Category

                            </th>

                            <th className="p-4 text-center font-bold text-slate-700">

                                Current Stock

                            </th>

                            <th className="p-4 text-center font-bold text-slate-700">

                                Status

                            </th>

                            <th className="p-4 text-right font-bold text-slate-700">

                                Buying Price

                            </th>

                            <th className="p-4 text-right font-bold text-slate-700">

                                Selling Price

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredStock.length === 0 ? (

                                <tr>

                                    <td colSpan="6" className="text-center py-12">
                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                <FaWarehouse className="text-2xl text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 font-medium">
                                                No stock found
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {search ? "Try adjusting your search" : "No inventory to display"}
                                            </p>
                                        </div>
                                    </td>

                                </tr>

                            ) : (

                                filteredStock.map((item, idx) => (

                                    <tr

                                        key={item.productId}

                                        className={`border-t border-slate-100 transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}

                                    >

                                        <td className="p-4 font-medium text-slate-900">

                                            {item.productName}

                                        </td>

                                        <td className="p-4 text-slate-600">

                                            <span className="badge badge-info">
                                                {item.category}
                                            </span>

                                        </td>

                                        <td className="p-4 text-center">
                                            <span className="inline-block bg-blue-100 text-blue-700 px-3 py-1 rounded-full font-bold text-lg">

                                                {item.quantity}

                                            </span>
                                        </td>

                                        <td className="p-4 text-center">

                                            {

                                                item.quantity === 0 ?

                                                    <span className="badge badge-danger">

                                                        Out of Stock

                                                    </span>

                                                    :

                                                    item.lowStock ?

                                                        <span className="badge badge-warning">

                                                            Low Stock

                                                        </span>

                                                        :

                                                        <span className="badge badge-success">

                                                            In Stock

                                                        </span>

                                            }

                                        </td>

                                        <td className="p-4 text-right text-slate-900 font-semibold">

                                            KSh {item.buyingPrice.toLocaleString()}

                                        </td>

                                        <td className="p-4 text-right text-slate-900 font-semibold">

                                            KSh {item.sellingPrice.toLocaleString()}

                                        </td>

                                    </tr>

                                ))

                            )

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