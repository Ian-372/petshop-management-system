import { useEffect, useState } from "react";

import api from "../services/api";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

import ProductModal from "../components/ProductModal";
import CategoryModal from "../components/CategoryModal";

export default function Products() {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [showProductModal, setShowProductModal] = useState(false);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);

    useEffect(() => {

        loadProducts();


    }, []);

    async function loadProducts() {

        try {

            const response = await api.get("/products");

            setProducts(response.data);

        }

        catch (error) {

            console.error(error);

        }

    }
    async function deleteProduct(id) {

        const confirmed = window.confirm(

            "Delete this product?"

        );

        if (!confirmed) {

            return;

        }

        try {

            await api.delete(`/products/${id}`);

            loadProducts();

        }

        catch (error) {

            console.error(error);

            alert("Unable to delete product.");

        }

    }

    const filteredProducts = products.filter(product =>

        product.name.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <div>

            <PageHeader title="Products">

                <div className="flex flex-col md:flex-row justify-between gap-4">

                    <SearchBar

                        value={search}

                        onChange={setSearch}

                        placeholder="Search products..."

                    />

                    <div className="flex gap-3">

                        <SecondaryButton

                            onClick={() => setShowCategoryModal(true)}

                        >

                            Manage Categories

                        </SecondaryButton>

                        <PrimaryButton

                            onClick={() => {

                                setSelectedProduct(null);

                                setShowProductModal(true);

                            }}

                        >

                            + Add Product

                        </PrimaryButton>

                    </div>

                </div>

            </PageHeader>

            <div className="bg-white rounded-xl shadow overflow-hidden">

                <table className="w-full">

                    <thead className="bg-slate-100">

                        <tr>

                            <th className="text-left p-4">

                                Product

                            </th>

                            <th className="text-left p-4">

                                Category

                            </th>

                            <th className="text-left p-4">

                                Buying

                            </th>

                            <th className="text-left p-4">

                                Selling

                            </th>

                            <th className="text-left p-4">

                                Quantity

                            </th>

                            <th className="text-center p-4">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredProducts.map(product => (

                                <tr

                                    key={product.id}

                                    className="border-t hover:bg-slate-50"

                                >

                                    <td className="p-4">

                                        {product.name}

                                    </td>

                                    <td className="p-4">

                                        {product.categoryName}

                                    </td>

                                    <td className="p-4">

                                        KSh {product.buyingPrice}

                                    </td>

                                    <td className="p-4">

                                        KSh {product.sellingPrice}

                                    </td>

                                    <td className="p-4">

                                        {

                                            product.quantity === 0 ?

                                                <span className="text-red-600 font-bold">

                                                    Out of Stock

                                                </span>

                                                :

                                                product.quantity <= 10 ?

                                                    <span className="text-orange-500 font-bold">

                                                        {product.quantity} (Low)

                                                    </span>

                                                    :

                                                    <span className="text-green-600 font-bold">

                                                        {product.quantity}

                                                    </span>

                                        }

                                    </td>

                                    <td className="text-center p-4">

                                        <div className="flex justify-center gap-2">

                                            <button

                                                className="px-3 py-1 rounded bg-blue-600 text-white hover:bg-blue-700"

                                                onClick={() => {

                                                    setSelectedProduct(product);

                                                    setShowProductModal(true);

                                                }}

                                            >

                                                Edit

                                            </button>

                                            <button

                                                className="px-3 py-1 rounded bg-red-600 text-white hover:bg-red-700"

                                                onClick={() => deleteProduct(product.id)}

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

            <ProductModal

                open={showProductModal}

                product={selectedProduct}

                onClose={() => {

                    setShowProductModal(false);

                    setSelectedProduct(null);

                }}

                onSaved={() => {

                    loadProducts();

                    setSelectedProduct(null);

                }}

            />

            <CategoryModal

                open={showCategoryModal}

                onClose={() => setShowCategoryModal(false)}

            />

        </div>

    );

}