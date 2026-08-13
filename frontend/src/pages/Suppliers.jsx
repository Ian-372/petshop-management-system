import { useEffect, useState } from "react";

import api from "../services/api";
import ErrorAlert from "../components/ErrorAlert";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import PrimaryButton from "../components/PrimaryButton";

import SupplierModal from "../components/SupplierModal";

export default function Suppliers() {

    const [suppliers, setSuppliers] = useState([]);

    const [search, setSearch] = useState("");

    const [showSupplierModal, setShowSupplierModal] = useState(false);

    const [selectedSupplier, setSelectedSupplier] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {

        loadSuppliers();

    }, []);

    async function loadSuppliers() {

        try {

            const response = await api.get("/suppliers");

            setSuppliers(response.data);
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Failed to load suppliers";
            setError(errorMessage);
            console.error(errorMessage);

        }

    }

    async function deleteSupplier(id) {

        const requireDeleteConfirmation = window.__PETSHOP_SETTINGS__?.deleteConfirmation !== false;
        const confirmed = requireDeleteConfirmation
            ? window.confirm("Delete this supplier?")
            : true;

        if (!confirmed) {

            return;

        }

        try {

            await api.delete(`/suppliers/${id}`);

            loadSuppliers();
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Unable to delete supplier";
            setError(errorMessage);
            console.error(errorMessage);

        }

    }

    const filteredSuppliers = suppliers.filter(

        supplier =>

            supplier.name.toLowerCase().includes(

                search.toLowerCase()

            )

    );

    return (
        <div className="space-y-6 pb-8">
            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

            <div>

                <PageHeader title="Suppliers">

                    <div className="flex flex-col md:flex-row justify-between gap-4">

                        <SearchBar

                            value={search}

                            onChange={setSearch}

                            placeholder="Search suppliers..."

                        />

                        <PrimaryButton

                            onClick={() => {

                                setSelectedSupplier(null);

                                setShowSupplierModal(true);

                            }}

                        >

                            + Add Supplier

                        </PrimaryButton>

                    </div>

                </PageHeader>

                <div className="bg-white rounded-xl shadow overflow-hidden">

                    <table className="w-full">

                        <thead className="bg-slate-100">

                            <tr>

                                <th className="text-left p-4">

                                    Name

                                </th>

                                <th className="text-left p-4">

                                    Phone

                                </th>

                                <th className="text-left p-4">

                                    Email

                                </th>

                                <th className="text-left p-4">

                                    Address

                                </th>

                                <th className="text-center p-4">

                                    Actions

                                </th>

                            </tr>

                        </thead>

                        <tbody>

                            {

                                filteredSuppliers.map(supplier => (

                                    <tr

                                        key={supplier.id}

                                        className="border-t hover:bg-slate-50"

                                    >

                                        <td className="p-4">

                                            {supplier.name}

                                        </td>

                                        <td className="p-4">

                                            {supplier.phone}

                                        </td>

                                        <td className="p-4">

                                            {supplier.email}

                                        </td>

                                        <td className="p-4">

                                            {supplier.address}

                                        </td>

                                        <td className="text-center p-4">

                                            <div className="flex justify-center gap-2">

                                                <button

                                                    className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"

                                                    onClick={() => {

                                                        setSelectedSupplier(supplier);

                                                        setShowSupplierModal(true);

                                                    }}

                                                >

                                                    Edit

                                                </button>

                                                <button

                                                    className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"

                                                    onClick={() => deleteSupplier(supplier.id)}

                                                >

                                                    Delete

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            }

                        </tbody>

                    </table>

                </div>

                <SupplierModal

                    open={showSupplierModal}

                    supplier={selectedSupplier}

                    onClose={() => {

                        setShowSupplierModal(false);

                        setSelectedSupplier(null);

                    }}

                    onSaved={() => {

                        loadSuppliers();

                        setSelectedSupplier(null);

                    }}

                />

            </div>

        </div>

    );

}