import { useEffect, useState } from "react";

import api from "../services/api";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import PrimaryButton from "../components/PrimaryButton";
import ProductModal from "../components/ProductModal";

export default function Products() {

    const [products, setProducts] = useState([]);

    const [search, setSearch] = useState("");

    const [openModal, setOpenModal] = useState(false);

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

    const filteredProducts = products.filter(product =>

        product.name.toLowerCase().includes(search.toLowerCase())

    );

    return (

        <div>

            <PageHeader

                title="Products"

                buttonText="Add Product"

                onButtonClick={() => setOpenModal(true)}

            >

                <SearchBar

                    value={search}

                    onChange={setSearch}

                    placeholder="Search products..."

                />

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

                                        <PrimaryButton>

                                            Edit

                                        </PrimaryButton>

                                    </td>

                                </tr>

                            ))

                        }

                    </tbody>

                </table>

            </div>

            <ProductModal

                open={openModal}

                onClose={() => setOpenModal(false)}

                onSaved={loadProducts}

            />

        </div>

    );

}