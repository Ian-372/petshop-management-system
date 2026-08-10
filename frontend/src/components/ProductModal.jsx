import { useEffect, useState } from "react";

import api from "../services/api";

import PrimaryButton from "./PrimaryButton";
import SecondaryButton from "./SecondaryButton";

export default function ProductModal({
    open,
    onClose,
    onSaved,
    product
}) {

    
const [categories, setCategories] = useState([]);

const [name, setName] = useState("");

const [buyingPrice, setBuyingPrice] = useState("");

const [sellingPrice, setSellingPrice] = useState("");

const [quantity, setQuantity] = useState("");

const [categoryId, setCategoryId] = useState("");

const [supplierName, setSupplierName] = useState("");

const [supplierPhone, setSupplierPhone] = useState("");

const [supplierEmail, setSupplierEmail] = useState("");

const [supplierAddress, setSupplierAddress] = useState("");

useEffect(() => {

    if (product) {

        setName(product.name || "");

        setBuyingPrice(product.buyingPrice ?? "");

        setSellingPrice(product.sellingPrice ?? "");

        setQuantity(product.quantity ?? "");

        setCategoryId(product.categoryId ?? "");

        setSupplierName(product.supplierName || "");

        setSupplierPhone(product.supplierPhone || "");

        setSupplierEmail(product.supplierEmail || "");

        setSupplierAddress(product.supplierAddress || "");

    }

    else {

        setName("");

        setBuyingPrice("");

        setSellingPrice("");

        setQuantity("");

        setCategoryId("");

        setSupplierName("");

        setSupplierPhone("");

        setSupplierEmail("");

        setSupplierAddress("");

    }

}, [product]);

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

        !name.trim() ||

        !buyingPrice ||

        !sellingPrice ||

        !quantity ||

        !categoryId ||

        !supplierName.trim()

    ) {

        alert("Please fill all required fields.");

        return;

    }

    try {

        const request = {

            name: name.trim(),

            buyingPrice: Number(buyingPrice),

            sellingPrice: Number(sellingPrice),

            quantity: Number(quantity),

            categoryId: Number(categoryId),

            supplierName: supplierName.trim(),

            supplierPhone: supplierPhone.trim(),

            supplierEmail: supplierEmail.trim(),

            supplierAddress: supplierAddress.trim()

        };

        if (product) {

           await api.put(
    `/ products / ${ product.id } `,
    request
);

        }

        else {

            await api.post(

                "/products",

                request

            );

        }

        onSaved();

        onClose();

        resetForm();

    }

    catch (error) {

        console.error(error);

        alert(

            error.response?.data?.message ||

            "Unable to save product."

        );

    }

}

function resetForm() {

    setName("");

    setBuyingPrice("");

    setSellingPrice("");

    setQuantity("");

    setCategoryId("");

    setSupplierName("");

    setSupplierPhone("");

    setSupplierEmail("");

    setSupplierAddress("");

}

if (!open) return null;

return (

    <div className="fixed inset-0 bg-black/50 flex justify-center items-center z-50">

        <div className="bg-white rounded-xl shadow-xl w-full max-w-lg p-8 max-h-[90vh] overflow-y-auto">

            <h2 className="text-2xl font-bold mb-6">

                {

                    product

                        ? "Edit Product"

                        : "Add Product"

                }

            </h2>

            <form
                onSubmit={saveProduct}
                className="space-y-4"
            >

                <div>

                    <label className="block text-sm font-medium mb-1">

                        Product Name *

                    </label>

                    <input

                        className="w-full border rounded-lg p-3"

                        placeholder="Product Name"

                        value={name}

                        onChange={(e) =>
                            setName(e.target.value)
                        }

                    />

                </div>

                <div>

                    <label className="block text-sm font-medium mb-1">

                        Buying Price *

                    </label>

                    <input

                        className="w-full border rounded-lg p-3"

                        type="number"

                        min="0"

                        step="0.01"

                        placeholder="Buying Price"

                        value={buyingPrice}

                        onChange={(e) =>
                            setBuyingPrice(e.target.value)
                        }

                    />

                </div>

                <div>

                    <label className="block text-sm font-medium mb-1">

                        Selling Price *

                    </label>

                    <input

                        className="w-full border rounded-lg p-3"

                        type="number"

                        min="0"

                        step="0.01"

                        placeholder="Selling Price"

                        value={sellingPrice}

                        onChange={(e) =>
                            setSellingPrice(e.target.value)
                        }

                    />

                </div>

                <div>

                    <label className="block text-sm font-medium mb-1">

                        Quantity *

                    </label>

                    <input

                        className="w-full border rounded-lg p-3"

                        type="number"

                        min="0"

                        placeholder="Quantity"

                        value={quantity}

                        onChange={(e) =>
                            setQuantity(e.target.value)
                        }

                    />

                </div>

                <div>

                    <label className="block text-sm font-medium mb-1">

                        Category *

                    </label>

                    <select

                        className="w-full border rounded-lg p-3"

                        value={categoryId}

                        onChange={(e) =>
                            setCategoryId(e.target.value)
                        }

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

                </div>

                <div className="border-t pt-5 mt-5">

                    <h3 className="text-lg font-semibold mb-4">

                        Supplier Information

                    </h3>

                    <div className="space-y-4">

                        <div>

                            <label className="block text-sm font-medium mb-1">

                                Supplier Name *

                            </label>

                            <input

                                className="w-full border rounded-lg p-3"

                                placeholder="Supplier Name"

                                value={supplierName}

                                onChange={(e) =>
                                    setSupplierName(e.target.value)
                                }

                            />

                        </div>

                        <div>

                            <label className="block text-sm font-medium mb-1">

                                Phone

                            </label>

                            <input

                                className="w-full border rounded-lg p-3"

                                placeholder="Supplier Phone"

                                value={supplierPhone}

                                onChange={(e) =>
                                    setSupplierPhone(e.target.value)
                                }

                            />

                        </div>

                        <div>

                            <label className="block text-sm font-medium mb-1">

                                Email

                            </label>

                            <input

                                className="w-full border rounded-lg p-3"

                                type="email"

                                placeholder="Supplier Email"

                                value={supplierEmail}

                                onChange={(e) =>
                                    setSupplierEmail(e.target.value)
                                }

                            />

                        </div>

                        <div>

                            <label className="block text-sm font-medium mb-1">

                                Address

                            </label>

                            <textarea

                                className="w-full border rounded-lg p-3"

                                placeholder="Supplier Address"

                                rows="3"

                                value={supplierAddress}

                                onChange={(e) =>
                                    setSupplierAddress(e.target.value)
                                }

                            />

                        </div>

                    </div>

                </div>

                <div className="flex justify-end gap-3 pt-3">

                    <SecondaryButton
                        onClick={onClose}
                        type="button"
                    >

                        Cancel

                    </SecondaryButton>

                    <PrimaryButton type="submit">

                        {

                            product

                                ? "Update Product"

                                : "Save Product"

                        }

                    </PrimaryButton>

                </div>

            </form>

        </div>

    </div>

);


}
