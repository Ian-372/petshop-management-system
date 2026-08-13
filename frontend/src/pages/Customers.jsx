import { useEffect, useState } from "react";

import api from "../services/api";
import ErrorAlert from "../components/ErrorAlert";

import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SearchBar from "../components/SearchBar";
import AddCustomerModal from "../components/AddCustomerModal";
import ViewCustomerModal from "../components/ViewCustomerModal";

import { FaEye, FaEdit, FaTrash, FaUsers } from "react-icons/fa";

export default function Customers() {

    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);
    const [showProfile, setShowProfile] = useState(false);
    const [profileCustomerId, setProfileCustomerId] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {

        loadCustomers();


    }, []);

    async function loadCustomers() {

        try {

            const response = await api.get("/customers");

            setCustomers(response.data);
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Failed to load customers";
            setError(errorMessage);
            console.error(errorMessage);

        }

    }
    async function deleteCustomer(id) {

        const requireDeleteConfirmation = window.__PETSHOP_SETTINGS__?.deleteConfirmation !== false;
        const confirmed = requireDeleteConfirmation
            ? window.confirm("Are you sure you want to delete this customer?")
            : true;

        if (!confirmed) {

            return;

        }

        try {

            await api.delete(`/customers/${id}`);

            loadCustomers();
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Unable to delete customer";
            setError(errorMessage);
            console.error(errorMessage);

        }

    }

    const filteredCustomers = customers.filter(customer =>

        customer.name.toLowerCase().includes(search.toLowerCase()) ||

        customer.phone.toLowerCase().includes(search.toLowerCase()) ||

        (customer.email || "")
            .toLowerCase()
            .includes(search.toLowerCase())

    );

    return (

        <div className="space-y-8 pb-8">
            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}
            <div className="flex justify-between items-center">

                <div>
                    <h1 className="text-4xl font-bold text-slate-900 mb-1">
                        Customers
                    </h1>
                    <p className="text-slate-500 text-sm">
                        Manage your customer relationships and loyalty program
                    </p>
                </div>

                <PrimaryButton
                    onClick={() => {

                        setSelectedCustomer(null);

                        setShowModal(true);

                    }}
                >

                    + Add Customer

                </PrimaryButton>

            </div>

            <SearchBar

                value={search}

                onChange={setSearch}

                placeholder="Search by name, phone, or email..."

            />

            <div className="card overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">

                        <tr>

                            <th className="text-left p-4 font-bold text-slate-700">Name</th>

                            <th className="text-left p-4 font-bold text-slate-700">Phone</th>

                            <th className="text-left p-4 font-bold text-slate-700">Email</th>

                            <th className="text-left p-4 font-bold text-slate-700">Address</th>

                            <th className="text-right p-4 font-bold text-slate-700">Total Spent</th>
                            <th className="text-right p-4 font-bold text-slate-700">Outstanding Debt</th>
                            <th className="text-right p-4 font-bold text-slate-700">Loyalty Points</th>
                            <th className="text-center p-4 font-bold text-slate-700">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredCustomers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="8"
                                        className="text-center py-12"
                                    >

                                        <div className="flex flex-col items-center gap-3">
                                            <div className="w-16 h-16 bg-slate-100 rounded-full flex items-center justify-center">
                                                <FaUsers className="text-2xl text-slate-400" />
                                            </div>
                                            <p className="text-slate-500 font-medium">
                                                No customers found
                                            </p>
                                            <p className="text-xs text-slate-400">
                                                {search ? "Try adjusting your search criteria" : "Add your first customer to get started"}
                                            </p>
                                        </div>

                                    </td>

                                </tr>

                            ) : (

                                filteredCustomers.map((customer, idx) => (

                                    <tr
                                        key={customer.id}
                                        className={`border-t border-slate-100 transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}
                                    >

                                        <td className="p-4 font-medium text-slate-900">

                                            {customer.name}

                                        </td>

                                        <td className="p-4 text-slate-600">

                                            {customer.phone}

                                        </td>

                                        <td className="p-4 text-slate-600">

                                            {customer.email || "-"}

                                        </td>

                                        <td className="p-4 text-slate-600 text-sm">

                                            {customer.address || "-"}

                                        </td>

                                        <td className="text-right p-4 font-semibold text-slate-900">

                                            KSh {(customer.totalSpent ?? 0).toLocaleString()}

                                        </td>
                                        <td className="text-right p-4">

                                            {(customer.totalDebt ?? 0) > 0 ? (
                                                <span className="badge badge-warning">
                                                    KSh {(customer.totalDebt ?? 0).toLocaleString()}
                                                </span>
                                            ) : (
                                                <span className="badge badge-success">
                                                    Settled
                                                </span>
                                            )}

                                        </td>

                                        <td className="text-right p-4">

                                            <span className="badge badge-info">
                                                ⭐ {customer.loyaltyPoints ?? 0}
                                            </span>

                                        </td>

                                        <td className="text-center p-4">

                                            <div className="flex justify-center gap-2">

                                                <button

                                                    className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"

                                                    onClick={() => {

                                                        setProfileCustomerId(customer.id);

                                                        setShowProfile(true);

                                                    }}

                                                    title="View customer details"

                                                >

                                                    <FaEye className="text-lg" />

                                                </button>

                                                <button

                                                    className="p-2 text-emerald-600 hover:bg-emerald-100 rounded-lg transition-colors"

                                                    onClick={() => {

                                                        setSelectedCustomer(customer);

                                                        setShowModal(true);

                                                    }}

                                                    title="Edit customer"

                                                >

                                                    <FaEdit className="text-lg" />

                                                </button>

                                                <button

                                                    className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"

                                                    onClick={() => deleteCustomer(customer.id)}

                                                    title="Delete customer"

                                                >

                                                    <FaTrash className="text-lg" />

                                                </button>

                                            </div>

                                        </td>

                                    </tr>

                                ))

                            )

                        }

                    </tbody>

                </table>

            </div>
            <AddCustomerModal

                open={showModal}

                customer={selectedCustomer}

                onClose={() => {

                    setShowModal(false);

                    setSelectedCustomer(null);

                }}

                onSaved={loadCustomers}

            />
            <ViewCustomerModal

                open={showProfile}

                customerId={profileCustomerId}

                onClose={() => {

                    setShowProfile(false);

                    setProfileCustomerId(null);

                }}

            />

        </div>

    );

}