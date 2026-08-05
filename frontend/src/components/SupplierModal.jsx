import { useEffect, useState } from "react";

import api from "../services/api";

import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function SupplierModal({

    open,
    onClose,
    onSaved,
    supplier

}) {

    const [name, setName] = useState("");

    const [phone, setPhone] = useState("");

    const [email, setEmail] = useState("");

    const [address, setAddress] = useState("");

    useEffect(() => {

        if (supplier) {

            setName(supplier.name);

            setPhone(supplier.phone || "");

            setEmail(supplier.email || "");

            setAddress(supplier.address || "");

        }

        else {

            setName("");

            setPhone("");

            setEmail("");

            setAddress("");

        }

    }, [supplier]);

    async function saveSupplier(e) {

        e.preventDefault();

        if (!name.trim()) {

            alert("Supplier name is required.");

            return;

        }

        const request = {

            name,

            phone,

            email,

            address

        };

        try {

            if (supplier) {

                await api.put(

                    `/suppliers/${supplier.id}`,

                    request

                );

            }

            else {

                await api.post(

                    "/suppliers",

                    request

                );

            }

            onSaved();

            onClose();

        }

        catch (error) {

            console.error(error);

            alert("Unable to save supplier.");

        }

    }

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8">

                <h2 className="text-2xl font-bold mb-6">

                    {

                        supplier ?

                            "Edit Supplier"

                            :

                            "Add Supplier"

                    }

                </h2>

                <form

                    onSubmit={saveSupplier}

                    className="space-y-4"

                >

                    <input

                        className="w-full border rounded-lg p-3"

                        placeholder="Supplier Name"

                        value={name}

                        onChange={(e) => setName(e.target.value)}

                    />

                    <input

                        className="w-full border rounded-lg p-3"

                        placeholder="Phone"

                        value={phone}

                        onChange={(e) => setPhone(e.target.value)}

                    />

                    <input

                        className="w-full border rounded-lg p-3"

                        placeholder="Email"

                        value={email}

                        onChange={(e) => setEmail(e.target.value)}

                    />

                    <textarea

                        className="w-full border rounded-lg p-3"

                        placeholder="Address"

                        rows="3"

                        value={address}

                        onChange={(e) => setAddress(e.target.value)}

                    />

                    <div className="flex justify-end gap-3">

                        <SecondaryButton

                            onClick={onClose}

                            type="button"

                        >

                            Cancel

                        </SecondaryButton>

                        <PrimaryButton

                            type="submit"

                        >

                            {

                                supplier ?

                                    "Update Supplier"

                                    :

                                    "Save Supplier"

                            }

                        </PrimaryButton>

                    </div>

                </form>

            </div>

        </div>

    );

}