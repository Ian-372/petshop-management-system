import { FaBell, FaSearch, FaUserCircle } from "react-icons/fa";

export default function Navbar() {

    return (

        <header className="h-20 bg-white border-b border-gray-200 flex items-center justify-between px-8 shadow-sm">

            <div className="relative">

                <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400" />

                <input
                    type="text"
                    placeholder="Search products, customers..."
                    className="pl-11 pr-4 py-2 w-96 border rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                />

            </div>

            <div className="flex items-center gap-6">

                <button className="relative">

                    <FaBell className="text-2xl text-gray-600" />

                    <span className="absolute -top-2 -right-2 bg-red-500 text-white text-xs rounded-full w-5 h-5 flex items-center justify-center">

                        3

                    </span>

                </button>

                <div className="flex items-center gap-3">

                    <FaUserCircle className="text-4xl text-slate-700" />

                    <div>

                        <p className="font-semibold">

                            Administrator

                        </p>

                        <p className="text-sm text-gray-500">

                            Cashier / Admin

                        </p>

                    </div>

                </div>

            </div>

        </header>

    );

}