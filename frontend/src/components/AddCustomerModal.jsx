import { useEffect, useState } from "react";

import api from "../services/api";

import PrimaryButton from "./PrimaryButton";

export default function AddCustomerModal({

    open,
    onClose,
    onSaved,
    customer

}) {

    const [name, setName] = useState("");

    const [phone, setPhone] = useState("");

    const [email, setEmail] = useState("");

    const [address, setAddress] = useState("");

    useEffect(() => {

        if (customer) {

            setName(customer.name);

            setPhone(customer.phone);

            setEmail(customer.email || "");

            setAddress(customer.address || "");

        }

        else {

            setName("");

            setPhone("");

            setEmail("");

            setAddress("");

        }

    }, [customer, open]);

    if (!open) return null;

    async function saveCustomer() {

        if (!name.trim()) {

            alert("Customer name is required.");

            return;

        }

        if (!phone.trim()) {

            alert("Phone number is required.");

            return;

        }

        try {

            if (customer) {

                await api.put(

                    `/customers/${customer.id}`,

                    {

                        name,
                        phone,
                        email,
                        address

                    }

                );

            }

            else {

                await api.post(

                    "/customers",

                    {

                        name,
                        phone,
                        email,
                        address

                    }

                );

            }

            setName("");
            setPhone("");
            setEmail("");
            setAddress("");

            onSaved();
            onClose();

        }

        catch (error) {

            console.error(error);

            alert("Unable to save customer.");

        }

    }

    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-md p-6 space-y-5">

                <h2 className="text-2xl font-bold">

                    {customer ? "Edit Customer" : "Add Customer"}

                </h2>

                <input
                    className="w-full border rounded-lg p-3"
                    placeholder="Full Name"
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                />

                <input
                    className="w-full border rounded-lg p-3"
                    placeholder="Phone Number"
                    value={phone}
                    onChange={(e) => setPhone(e.target.value)}
                />

                <input
                    className="w-full border rounded-lg p-3"
                    placeholder="Email (optional)"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                />

                <input
                    className="w-full border rounded-lg p-3"
                    placeholder="Address (optional)"
                    value={address}
                    onChange={(e) => setAddress(e.target.value)}
                />

                <div className="flex justify-end gap-3">

                    <button
                        onClick={onClose}
                        className="px-4 py-2 border rounded-lg"
                    >

                        Cancel

                    </button>

                    <PrimaryButton
                        onClick={saveCustomer}
                    >

                        {customer ? "Update Customer" : "Save Customer"}

                    </PrimaryButton>

                </div>

            </div>

        </div>

    );

}