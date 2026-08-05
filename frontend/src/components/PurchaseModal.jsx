import { useEffect, useState } from "react";

import api from "../services/api";

import PurchaseItemRow from "./PurchaseItemRow";

import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function PurchaseModal({

    open,
    onClose,
    onSaved

}) {

    const [suppliers, setSuppliers] = useState([]);

    const [products, setProducts] = useState([]);

    const [supplierId, setSupplierId] = useState("");

    const [items, setItems] = useState([

        {

            productId: "",

            quantity: 1,

            buyingPrice: 0

        }

    ]);

    useEffect(() => {

        if (!open) return;

        loadSuppliers();

        loadProducts();

    }, [open]);

    async function loadSuppliers() {

        const response = await api.get("/suppliers");

        setSuppliers(response.data);

    }

    async function loadProducts() {

        const response = await api.get("/products");

        setProducts(response.data);

    }

    function updateItem(index, field, value) {

        const updated = [...items];

        updated[index][field] = value;

        setItems(updated);

    }

    function addRow() {

        setItems([

            ...items,

            {

                productId: "",

                quantity: 1,

                buyingPrice: 0

            }

        ]);

    }

    function removeRow(index) {

        if (items.length === 1) return;

        setItems(

            items.filter((_, i) => i !== index)

        );

    }

    async function savePurchase(e) {

        e.preventDefault();

        if (!supplierId) {

            alert("Choose a supplier.");

            return;

        }

        const request = {

            supplierId: Number(supplierId),

            items: items.map(item => ({

                productId: Number(item.productId),

                quantity: Number(item.quantity),

                buyingPrice: Number(item.buyingPrice)

            }))

        };

        try {

            await api.post(

                "/purchases",

                request

            );

            onSaved();

            onClose();

        }

        catch (error) {

            console.error(error);

            alert("Unable to save purchase.");

        }

    }

    const grandTotal = items.reduce(

        (sum, item) =>

            sum +

            (

                Number(item.quantity || 0)

                *

                Number(item.buyingPrice || 0)

            ),

        0

    );

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-5xl p-8">

                <h2 className="text-2xl font-bold mb-6">

                    New Purchase

                </h2>

                <form

                    onSubmit={savePurchase}

                    className="space-y-6"

                >

                    <select

                        className="w-full border rounded-lg p-3"

                        value={supplierId}

                        onChange={(e) =>

                            setSupplierId(e.target.value)

                        }

                    >

                        <option value="">

                            Select Supplier

                        </option>

                        {

                            suppliers.map(supplier => (

                                <option

                                    key={supplier.id}

                                    value={supplier.id}

                                >

                                    {supplier.name}

                                </option>

                            ))

                        }

                    </select>

                    {

                        items.map((item, index) => (

                            <PurchaseItemRow

                                key={index}

                                index={index}

                                item={item}

                                products={products}

                                updateItem={updateItem}

                                removeRow={removeRow}

                            />

                        ))

                    }

                    <button

                        type="button"

                        className="bg-slate-200 px-4 py-2 rounded"

                        onClick={addRow}

                    >

                        + Add Another Item

                    </button>

                    <div className="text-right text-2xl font-bold">

                        Grand Total :

                        KSh {grandTotal.toLocaleString()}

                    </div>

                    <div className="flex justify-end gap-3">

                        <SecondaryButton

                            type="button"

                            onClick={onClose}

                        >

                            Cancel

                        </SecondaryButton>

                        <PrimaryButton

                            type="submit"

                        >

                            Save Purchase

                        </PrimaryButton>

                    </div>

                </form>

            </div>

        </div>

    );

}