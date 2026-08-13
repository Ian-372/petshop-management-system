import { useEffect, useState } from "react";

import api from "../services/api";
import ErrorAlert from "../components/ErrorAlert";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import PrimaryButton from "../components/PrimaryButton";
import SecondaryButton from "../components/SecondaryButton";

import ProductModal from "../components/ProductModal";
import CategoryModal from "../components/CategoryModal";

import { FaEdit, FaTrash } from "react-icons/fa";

export default function Products() {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [showProductModal, setShowProductModal] = useState(false);

    const [showCategoryModal, setShowCategoryModal] = useState(false);
    const [selectedProduct, setSelectedProduct] = useState(null);
    const [error, setError] = useState(null);

    useEffect(() => {

        loadProducts();


    }, []);

    async function loadProducts() {

        try {

            const response = await api.get("/products");

            setProducts(response.data);
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Failed to load products";
            setError(errorMessage);
            console.error(errorMessage);

        }

    }
    async function deleteProduct(id) {

        const requireDeleteConfirmation = window.__PETSHOP_SETTINGS__?.deleteConfirmation !== false;
        const confirmed = requireDeleteConfirmation
            ? window.confirm("Delete this product?")
            : true;

        if (!confirmed) {

            return;

        }

        try {

            await api.delete(`/products/${id}`);

            loadProducts();
            setError(null);

        }

        catch (error) {

            const errorMessage = error.response?.data?.message || error.message || "Unable to delete product";
            setError(errorMessage);
            console.error(errorMessage);

        }

    }

    const filteredProducts = products.filter(product =>

        product.name.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <div>

            {error && <ErrorAlert message={error} onClose={() => setError(null)} />}

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

            <div className="card overflow-hidden">

                <table className="w-full">

                    <thead className="bg-gradient-to-r from-slate-50 to-slate-100 border-b border-slate-200">

                        <tr>

                            <th className="text-left p-4 font-bold text-slate-700">

                                Product

                            </th>

                            <th className="text-left p-4 font-bold text-slate-700">

                                Category

                            </th>
                            <th className="text-left p-4 font-bold text-slate-700">
                                Supplier
                            </th>

                            <th className="text-left p-4 font-bold text-slate-700">

                                Buying

                            </th>

                            <th className="text-left p-4 font-bold text-slate-700">

                                Selling

                            </th>

                            <th className="text-left p-4 font-bold text-slate-700">

                                Quantity

                            </th>

                            <th className="text-center p-4 font-bold text-slate-700">

                                Actions

                            </th>

                        </tr>

                    </thead>

                    <tbody>

                        {

                            filteredProducts.map((product, idx) => (

                                <tr

                                    key={product.id}

                                    className={`border-t border-slate-100 transition-colors hover:bg-blue-50 ${idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/40'}`}

                                >

                                    <td className="p-4 font-medium text-slate-900">

                                        {product.name}

                                    </td>

                                    <td className="p-4 text-slate-600">

                                        <span className="badge badge-info">
                                            {product.categoryName}
                                        </span>

                                    </td>
                                    <td className="p-4 text-slate-600">
                                        {product.supplierName || "—"}
                                    </td>

                                    <td className="p-4 text-slate-900 font-semibold">

                                        KSh {product.buyingPrice}

                                    </td>

                                    <td className="p-4 text-slate-900 font-semibold">

                                        KSh {product.sellingPrice}

                                    </td>

                                    <td className="p-4">

                                        {

                                            product.quantity === 0 ?

                                                <span className="badge badge-danger">
                                                    Out of Stock
                                                </span>

                                                :

                                                product.quantity <= 10 ?

                                                    <span className="badge badge-warning">

                                                        {product.quantity} (Low)

                                                    </span>

                                                    :

                                                    <span className="badge badge-success">

                                                        {product.quantity}

                                                    </span>

                                        }

                                    </td>

                                    <td className="text-center p-4">

                                        <div className="flex justify-center gap-2">

                                            <button

                                                className="p-2 text-blue-600 hover:bg-blue-100 rounded-lg transition-colors"

                                                onClick={() => {

                                                    setSelectedProduct(product);

                                                    setShowProductModal(true);

                                                }}

                                                title="Edit product"

                                            >

                                                <FaEdit className="text-lg" />

                                            </button>

                                            <button

                                                className="p-2 text-red-600 hover:bg-red-100 rounded-lg transition-colors"

                                                onClick={() => deleteProduct(product.id)}

                                                title="Delete product"

                                            >

                                                <FaTrash className="text-lg" />

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