import { useEffect, useState } from "react";

import api from "../services/api";

import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function ProductModal({

    open,
    onClose,
    onSaved

}) {

    const [categories, setCategories] = useState([]);

    const [name, setName] = useState("");

    const [buyingPrice, setBuyingPrice] = useState("");

    const [sellingPrice, setSellingPrice] = useState("");

    const [quantity, setQuantity] = useState("");

    const [categoryId, setCategoryId] = useState("");

    useEffect(() => {

        if (open) {

            loadCategories();

        }

    }, [open]);

    async function loadCategories() {

        try {

            const response = await api.get("/categories");

            setCategories(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }

    async function saveProduct(e) {

        e.preventDefault();

        if (

            !name ||

            !buyingPrice ||

            !sellingPrice ||

            !quantity ||

            !categoryId

        ) {

            alert("Please fill all fields.");

            return;

        }

        try {

            await api.post("/products", {

                name,

                buyingPrice: Number(buyingPrice),

                sellingPrice: Number(sellingPrice),

                quantity: Number(quantity),

                categoryId: Number(categoryId)

            });

            onSaved();

            onClose();

            setName("");

            setBuyingPrice("");

            setSellingPrice("");

            setQuantity("");

            setCategoryId("");

        }

        catch (error) {

            console.error(error);

            alert("Unable to save product.");

        }

    }

    if (!open) return null;

    return (

        <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Add Product

                </h2>

                <form

                    onSubmit={saveProduct}

                    className="space-y-4"

                >

                    <input

                        className="w-full border rounded-lg p-3"

                        placeholder="Product Name"

                        value={name}

                        onChange={(e) => setName(e.target.value)}

                    />

                    <input

                        className="w-full border rounded-lg p-3"

                        type="number"

                        placeholder="Buying Price"

                        value={buyingPrice}

                        onChange={(e) => setBuyingPrice(e.target.value)}

                    />

                    <input

                        className="w-full border rounded-lg p-3"

                        type="number"

                        placeholder="Selling Price"

                        value={sellingPrice}

                        onChange={(e) => setSellingPrice(e.target.value)}

                    />

                    <input

                        className="w-full border rounded-lg p-3"

                        type="number"

                        placeholder="Quantity"

                        value={quantity}

                        onChange={(e) => setQuantity(e.target.value)}

                    />

                    <select

                        className="w-full border rounded-lg p-3"

                        value={categoryId}

                        onChange={(e) => setCategoryId(e.target.value)}

                    >

                        <option value="">

                            Select Category

                        </option>

                        {

                            categories.map(category => (

                                <option

                                    key={category.id}

                                    value={category.id}

                                >

                                    {category.name}

                                </option>

                            ))

                        }

                    </select>

                    <div className="flex justify-end gap-3 pt-3">

                        <SecondaryButton

                            onClick={onClose}

                        >

                            Cancel

                        </SecondaryButton>

                        <PrimaryButton

                            type="submit"

                        >

                            Save Product

                        </PrimaryButton>

                    </div>

                </form>

            </div>

        </div>

    );

}