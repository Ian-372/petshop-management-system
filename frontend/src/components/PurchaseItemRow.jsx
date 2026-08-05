export default function PurchaseItemRow({

    index,

    item,

    products,

    updateItem,

    removeRow

}) {

    const lineTotal =

        Number(item.quantity || 0) *

        Number(item.buyingPrice || 0);

    return (

        <div className="border rounded-xl p-4 mb-4 bg-slate-50">

            {/* Column Headers */}

            <div className="grid grid-cols-12 gap-4 mb-2 text-sm font-semibold text-gray-600">

                <div className="col-span-5">

                    Product

                </div>

                <div className="col-span-2 text-center">

                    Quantity

                </div>

                <div className="col-span-2 text-center">

                    Buying Price (KSh)

                </div>

                <div className="col-span-2 text-right">

                    Total

                </div>

                <div className="col-span-1 text-center">

                    Remove

                </div>

            </div>

            {/* Purchase Row */}

            <div className="grid grid-cols-12 gap-4 items-center">

                {/* Product */}

                <div className="col-span-5">

                    <select

                        className="w-full border rounded-lg p-3"

                        value={item.productId}

                        onChange={(e) =>

                            updateItem(

                                index,

                                "productId",

                                e.target.value

                            )

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

                {/* Quantity */}

                <div className="col-span-2">

                    <input

                        type="number"

                        min="1"

                        placeholder="Qty"

                        className="w-full border rounded-lg p-3 text-center"

                        value={item.quantity}

                        onChange={(e) =>

                            updateItem(

                                index,

                                "quantity",

                                e.target.value

                            )

                        }

                    />

                </div>

                {/* Buying Price */}

                <div className="col-span-2">

                    <input

                        type="number"

                        min="0"

                        step="0.01"

                        placeholder="Price"

                        className="w-full border rounded-lg p-3 text-center"

                        value={item.buyingPrice}

                        onChange={(e) =>

                            updateItem(

                                index,

                                "buyingPrice",

                                e.target.value

                            )

                        }

                    />

                </div>

                {/* Total */}

                <div className="col-span-2 text-right font-bold text-green-700">

                    KSh {lineTotal.toLocaleString()}

                </div>

                {/* Delete */}

                <div className="col-span-1 flex justify-center">

                    <button

                        type="button"

                        className="bg-red-600 text-white rounded px-3 py-2 hover:bg-red-700"

                        onClick={() => removeRow(index)}

                    >

                        ✕

                    </button>

                </div>

            </div>

        </div>

    );
}