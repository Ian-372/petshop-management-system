import { useEffect, useState } from "react";

import api from "../services/api";
import { useNavigate } from "react-router-dom";
import PageHeader from "../components/PageHeader";
import SearchBar from "../components/SearchBar";
import SaleCartItem from "../components/SaleCartItem";
import PrimaryButton from "../components/PrimaryButton";

export default function Sales() {

    const [products, setProducts] = useState([]);

    const [cart, setCart] = useState([]);

    const [search, setSearch] = useState("");
    const [customerType, setCustomerType] = useState("REGISTERED");

    const [customerName, setCustomerName] = useState("");

    const [phoneNumber, setPhoneNumber] = useState("");

    const [paymentMethod, setPaymentMethod] = useState("CASH");
    const navigate = useNavigate();
    const [amountGiven, setAmountGiven] = useState("");




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

                customerType,

                customerName,

                phoneNumber,

                paymentMethod,

                amountGiven:
                    paymentMethod === "CASH"
                        ? Number(amountGiven)
                        : 0,

                balance:
                    paymentMethod === "CASH"
                        ? Number(balance)
                        : 0,

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

                alert("STK Push sent.\nWaiting for customer payment...");

                const start = Date.now();

                const interval = setInterval(async () => {

                    try {

                        const response = await api.get(`/sales/${sale.id}`);

                        const updatedSale = response.data;

                        if (updatedSale.paymentStatus === "PAID") {

                            clearInterval(interval);

                            navigate(`/receipt/${sale.id}`);

                            return;

                        }

                        if (updatedSale.paymentStatus === "FAILED") {

                            clearInterval(interval);

                            await api.post(`/payments/cancel/${sale.id}`);

                            alert("Customer cancelled or payment failed.");

                            return;

                        }

                        if (Date.now() - start > 90000) {

                            clearInterval(interval);

                            await api.post(`/payments/cancel/${sale.id}`);

                            alert("Payment timed out.");

                            return;

                        }

                    } catch (err) {

                        clearInterval(interval);

                        alert("Error checking payment status.");

                    }

                }, 2000);

            }
            else if (paymentMethod === "CASH") {

                await api.post(`/payments/cash/${sale.id}`);

                navigate(`/receipt/${sale.id}`);

            }
            else if (paymentMethod === "DEBIT") {

                navigate(`/receipt/${sale.id}`);

            }


            setCart([]);

            setCustomerName("");

            setPhoneNumber("");

            setCustomerType("REGISTERED");

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
    const balance =
        Number(amountGiven || 0) - subtotal;


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

                            <div>

                                <label className="font-semibold">

                                    Customer Type

                                </label>

                                <select

                                    className="w-full border rounded-lg p-3 mt-2"

                                    value={customerType}

                                    onChange={(e) => setCustomerType(e.target.value)}

                                >

                                    <option value="REGISTERED">

                                        Registered Customer

                                    </option>

                                    <option value="WALK_IN">

                                        Walk-In Customer

                                    </option>

                                </select>

                            </div>

                            <div>

                                <label className="font-semibold">

                                    Customer Name

                                </label>

                                <input

                                    value={customerName}

                                    onChange={(e) => setCustomerName(e.target.value)}

                                    placeholder={

                                        customerType === "REGISTERED"

                                            ? "Customer Name"

                                            : "Optional"

                                    }

                                    className="w-full border rounded-lg p-3 mt-2"

                                />

                            </div>

                            <div>

                                <label className="font-semibold">

                                    Phone Number

                                </label>

                                <input

                                    value={phoneNumber}

                                    onChange={(e) => setPhoneNumber(e.target.value)}

                                    placeholder="2547XXXXXXXX"

                                    className="w-full border rounded-lg p-3 mt-2"

                                />

                            </div>

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

                                <option value="DEBIT">
                                    Credit / Debt
                                </option>
                            </select>

                        </div>

                        {
                            paymentMethod === "MPESA" ? (

                                <div>

                                    <label className="font-semibold">
                                        M-Pesa Phone Number
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

                            ) : paymentMethod === "CASH" ? (

                                <div className="space-y-3">

                                    <div>

                                        <label className="font-semibold">
                                            Amount Given
                                        </label>

                                        <input
                                            type="number"
                                            value={amountGiven}
                                            onChange={(e) =>
                                                setAmountGiven(e.target.value)
                                            }
                                            placeholder="Enter cash received"
                                            className="w-full border rounded-lg p-3 mt-2"
                                        />

                                    </div>

                                    <div>

                                        <label className="font-semibold">
                                            Balance
                                        </label>

                                        <div className="mt-2 border rounded-lg p-3 bg-slate-100 font-bold">

                                            KSh {
                                                balance > 0
                                                    ? balance.toFixed(2)
                                                    : "0.00"
                                            }

                                        </div>

                                    </div>

                                    {
                                        amountGiven &&
                                        balance < 0 && (

                                            <p className="text-red-600 text-sm">
                                                Amount given is less than the total.
                                            </p>

                                        )
                                    }

                                </div>

                            ) : (

                                <div className="border rounded-lg p-4 bg-yellow-50">

                                    <p className="font-semibold text-yellow-800">
                                        Credit / Debt Sale
                                    </p>

                                    <p className="text-sm text-yellow-700 mt-1">
                                        No payment is required now.
                                        The full sale amount will be added to this
                                        customer's outstanding debt.
                                    </p>

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
                            disabled={
                                paymentMethod === "CASH" &&
                                Number(amountGiven || 0) < subtotal
                            }
                        >

                            Complete Sale

                        </PrimaryButton>

                    </div>

                </div>

            </div>

        </div>

    );

}