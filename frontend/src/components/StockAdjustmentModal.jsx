import { useEffect, useState } from "react";

import api from "../services/api";


export default function StockAdjustmentModal({

    open,

    onClose,

    onSaved

}) {

    const [products, setProducts] = useState([]);

    const [productId, setProductId] = useState("");

    const [type, setType] = useState("IN");

    const [quantity, setQuantity] = useState("");

    const [reason, setReason] = useState("");

    useEffect(() => {

        if (open) {

            loadProducts();

        }

    }, [open]);

    async function loadProducts() {

        try {

            const response = await api.get("/products");

            setProducts(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }



    if (!open) return null;
    async function handleSave() {

        if (!productId || !quantity || !reason) {

            alert("Please fill all fields.");

            return;

        }

        try {

            await api.post("/stock/adjust", {

                productId: Number(productId),

                adjustmentType: type,

                quantity: Number(quantity),

                reason

            });

            onSaved();

            onClose();

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to adjust stock."

            );

        }

    }
    return (

        <div className="fixed inset-0 bg-black/40 flex items-center justify-center z-50">

            <div className="bg-white rounded-xl shadow-xl w-full max-w-xl p-8">

                <h2 className="text-2xl font-bold mb-6">

                    Adjust Stock

                </h2>

                <div className="space-y-5">

                    <div>

                        <label className="font-semibold">

                            Product

                        </label>

                        <select

                            className="w-full border rounded-lg p-3 mt-2"

                            value={productId}

                            onChange={(e) =>

                                setProductId(e.target.value)

                            }

                        >

                            <option value="">

                                Select Product

                            </option>

                            {

                                products.map(product => (

                                    <option

                                        key={product.id}

                                        value={product.id}

                                    >

                                        {product.name}

                                    </option>

                                ))

                            }

                        </select>

                    </div>

                    <div>

                        <label className="font-semibold">

                            Adjustment

                        </label>

                        <div className="flex gap-6 mt-3">

                            <label>

                                <input

                                    type="radio"

                                    checked={type === "IN"}

                                    onChange={() =>

                                        setType("IN")

                                    }

                                />

                                <span className="ml-2">

                                    Increase

                                </span>

                            </label>

                            <label>

                                <input

                                    type="radio"

                                    checked={type === "OUT"}

                                    onChange={() =>

                                        setType("OUT")

                                    }

                                />

                                <span className="ml-2">

                                    Reduce

                                </span>

                            </label>

                        </div>

                    </div>

                    <div>

                        <label className="font-semibold">

                            Quantity

                        </label>

                        <input

                            type="number"

                            className="w-full border rounded-lg p-3 mt-2"

                            value={quantity}

                            onChange={(e) =>

                                setQuantity(e.target.value)

                            }

                        />

                    </div>

                    <div>

                        <label className="font-semibold">

                            Reason

                        </label>

                        <textarea

                            rows="3"

                            className="w-full border rounded-lg p-3 mt-2"

                            value={reason}

                            onChange={(e) =>

                                setReason(e.target.value)

                            }

                        />

                    </div>

                </div>

                <div className="flex justify-end gap-3 mt-8">

                    <button

                        onClick={onClose}

                        className="bg-gray-500 text-white px-5 py-2 rounded-lg"

                    >

                        Cancel

                    </button>

                    <button

                        onClick={handleSave}

                        className="bg-blue-600 text-white px-5 py-2 rounded-lg"

                    >

                        Save

                    </button>

                </div>

            </div>

        </div>

    );

}