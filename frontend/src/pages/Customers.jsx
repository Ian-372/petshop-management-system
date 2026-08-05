import { useEffect, useState } from "react";

import api from "../services/api";

import PageHeader from "../components/PageHeader";
import PrimaryButton from "../components/PrimaryButton";
import SearchBar from "../components/SearchBar";
import AddCustomerModal from "../components/AddCustomerModal";


export default function Customers() {

    const [customers, setCustomers] = useState([]);

    const [search, setSearch] = useState("");
    const [showModal, setShowModal] = useState(false);
    const [selectedCustomer, setSelectedCustomer] = useState(null);

    useEffect(() => {

        loadCustomers();
        

    }, []);

    async function loadCustomers() {

        try {

            const response = await api.get("/customers");

            setCustomers(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }
    async function deleteCustomer(id) {

    const confirmed = window.confirm(

        "Are you sure you want to delete this customer?"

    );

    if (!confirmed) {

        return;

    }

    try {

        await api.delete(`/customers/${id}`);

        loadCustomers();

    }

    catch (error) {

        console.error(error);

        alert("Unable to delete customer.");

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

        <div className="space-y-6">

            <div className="flex justify-between items-center">

                <PageHeader title="Customers" />

                <PrimaryButton
                    onClick={() => {

                        setSelectedCustomer(null);

                        setShowModal(true);

                    }}
                >

                    Add Customer

                </PrimaryButton>

            </div>

            <SearchBar

                value={search}

                onChange={setSearch}

                placeholder="Search customers..."

            />

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="text-left p-4">Name</th>

                            <th className="text-left p-4">Phone</th>

                            <th className="text-left p-4">Email</th>

                            <th className="text-left p-4">Address</th>

                            <th className="text-right p-4">Spent</th>

                            <th className="text-right p-4">Points</th>

                            <th className="text-center p-4">Actions</th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredCustomers.length === 0 ? (

                                <tr>

                                    <td
                                        colSpan="7"
                                        className="text-center py-8 text-slate-500"
                                    >

                                        No customers found.

                                    </td>

                                </tr>

                            ) : (

                                filteredCustomers.map(customer => (

                                    <tr
                                        key={customer.id}
                                        className="border-t hover:bg-slate-50"
                                    >

                                        <td className="p-4">

                                            {customer.name}

                                        </td>

                                        <td className="p-4">

                                            {customer.phone}

                                        </td>

                                        <td className="p-4">

                                            {customer.email || "-"}

                                        </td>

                                        <td className="p-4">

                                            {customer.address || "-"}

                                        </td>

                                        <td className="text-right p-4">

                                            KSh {(customer.totalSpent ?? 0).toLocaleString()}

                                        </td>

                                        <td className="text-right p-4">

                                            ⭐ {customer.loyaltyPoints ?? 0}

                                        </td>

                                        <td className="text-center p-4">

                                            <button
                                                className="text-blue-600 hover:underline mr-3"
                                            >

                                                View

                                            </button>

                                            <button

                                                className="text-green-600 hover:underline mr-3"

                                                onClick={() => {

                                                    setSelectedCustomer(customer);

                                                    setShowModal(true);

                                                }}

                                            >

                                                Edit

                                            </button>

                                            <button

                                                className="text-red-600 hover:underline"

                                                onClick={() => deleteCustomer(customer.id)}

                                            >

                                                Delete

                                            </button>

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

        </div>

    );

}