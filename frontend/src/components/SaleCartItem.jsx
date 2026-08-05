export default function SaleCartItem({

    item,

    increase,

    decrease,

    remove

}) {

    return (

        <div className="flex items-center justify-between border-b py-3">

            <div>

                <h3 className="font-semibold">

                    {item.name}

                </h3>

                <p className="text-sm text-gray-500">

                    KSh {item.sellingPrice}

                </p>

            </div>

            <div className="flex items-center gap-3">

                <button

                    onClick={() => decrease(item.id)}

                    className="bg-gray-300 px-3 py-1 rounded"

                >

                    -

                </button>

                <span className="font-bold">

                    {item.quantity}

                </span>

                <button

                    onClick={() => increase(item.id)}

                    className="bg-blue-600 text-white px-3 py-1 rounded"

                >

                    +

                </button>

            </div>

            <div className="font-bold">

                KSh {item.quantity * item.sellingPrice}

            </div>

            <button

                onClick={() => remove(item.id)}

                className="text-red-600"

            >

                Remove

            </button>

        </div>

    );

}