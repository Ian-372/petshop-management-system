import { useEffect, useState } from "react";

import api from "../services/api";

import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import SaleCartItem from "../components/SaleCartItem";
import PrimaryButton from "../components/PrimaryButton";

export default function Sales() {

    const [products, setProducts] = useState([]);

    const [cart, setCart] = useState([]);

    const [search, setSearch] = useState("");
    const [customerId, setCustomerId] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("CASH");

    const [phoneNumber, setPhoneNumber] = useState("");

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
    async function completeSale() {

        if (cart.length === 0) {

            alert("Cart is empty.");

            return;

        }

        try {

            const request = {

                customerId: customerId || null,

                items: cart.map(item => ({

                    productId: item.id,

                    quantity: item.quantity

                }))
            };

            const saleResponse = await api.post("/sales", request);

            const sale = saleResponse.data;

            if (paymentMethod === "MPESA") {

                await api.post("/payments/stkpush", {

                    saleId: sale.id,

                    phoneNumber

                });

                alert("STK Push sent to customer.");

            } else {

                await api.post(`/payments/cash/${sale.id}`);

                alert("Cash sale completed successfully.");

            }

            setCart([]);
            setCustomerId("");
            setPhoneNumber("");
            loadProducts();

        }

        catch (error) {

            console.error(error);

            alert(

                error.response?.data?.message ||

                "Unable to complete sale."

            );

        }

    }

    const filteredProducts = products.filter(product =>

        product.name.toLowerCase().includes(search.toLowerCase())

    );

    function addProduct(product) {

        const exists = cart.find(item => item.id === product.id);

        if (exists) {

            setCart(

                cart.map(item =>

                    item.id === product.id

                        ? {

                            ...item,

                            quantity: item.quantity + 1

                        }

                        : item

                )

            );

            return;

        }

        setCart([

            ...cart,

            {

                ...product,

                quantity: 1

            }

        ]);

    }

    function increase(id) {

        setCart(

            cart.map(item =>

                item.id === id

                    ? {

                        ...item,

                        quantity: item.quantity + 1

                    }

                    : item

            )

        );

    }

    function decrease(id) {

        setCart(

            cart

                .map(item =>

                    item.id === id

                        ? {

                            ...item,

                            quantity: item.quantity - 1

                        }

                        : item

                )

                .filter(item => item.quantity > 0)

        );

    }

    function remove(id) {

        setCart(

            cart.filter(item => item.id !== id)

        );

    }

    const subtotal = cart.reduce(

        (sum, item) =>

            sum + item.quantity * item.sellingPrice,

        0

    );

    return (

        <div className="space-y-6">

            <PageHeader title="Sales" />

            <div className="grid grid-cols-3 gap-6">

                <div className="col-span-2 bg-white rounded-xl shadow p-6">

                    <SearchBar

                        value={search}

                        onChange={setSearch}

                        placeholder="Search products..."

                    />

                    <div className="mt-6 space-y-2">

                        {

                            filteredProducts.map(product => (

                                <button

                                    key={product.id}

                                    onClick={() => addProduct(product)}

                                    className="w-full flex justify-between p-4 border rounded-lg hover:bg-slate-100"

                                >

                                    <span>

                                        {product.name}

                                    </span>

                                    <span>

                                        KSh {product.sellingPrice}

                                    </span>

                                </button>

                            ))

                        }

                    </div>

                </div>

                <div className="bg-white rounded-xl shadow p-6">

                    <h2 className="text-xl font-bold mb-4">

                        Cart

                    </h2>

                    <div className="space-y-3">

                        {

                            cart.map(item => (

                                <SaleCartItem

                                    key={item.id}

                                    item={item}

                                    increase={increase}

                                    decrease={decrease}

                                    remove={remove}

                                />

                            ))

                        }

                    </div>

                    <div className="border-t mt-6 pt-6 space-y-5">

                        <div>

                            <label className="font-semibold">

                                Customer ID

                            </label>

                            <input

                                type="number"

                                value={customerId}

                                onChange={(e) =>

                                    setCustomerId(e.target.value)

                                }

                                placeholder="Leave empty for walk-in"

                                className="w-full border rounded-lg p-3 mt-2"

                            />

                        </div>

                        <div>

                            <label className="font-semibold">

                                Payment Method

                            </label>

                            <select

                                className="w-full border rounded-lg p-3 mt-2"

                                value={paymentMethod}

                                onChange={(e) =>

                                    setPaymentMethod(e.target.value)

                                }

                            >

                                <option value="CASH">

                                    Cash

                                </option>

                                <option value="MPESA">

                                    M-Pesa

                                </option>

                            </select>

                        </div>

                        {

                            paymentMethod === "MPESA" && (

                                <div>

                                    <label className="font-semibold">

                                        Phone Number

                                    </label>

                                    <input

                                        value={phoneNumber}

                                        onChange={(e) =>

                                            setPhoneNumber(e.target.value)

                                        }

                                        placeholder="2547XXXXXXXX"

                                        className="w-full border rounded-lg p-3 mt-2"

                                    />

                                </div>

                            )

                        }

                        <div className="flex justify-between text-xl font-bold">

                            <span>Total</span>

                            <span>KSh {subtotal}</span>

                        </div>

                        <PrimaryButton

                            className="w-full"

                            onClick={completeSale}

                        >

                            Complete Sale

                        </PrimaryButton>

                    </div>

                </div>

            </div>

        </div>

    );

}