import { FaBell, FaSearch, FaUserCircle, FaCog } from "react-icons/fa";

export default function Navbar() {

    return (

        <header className="h-20 bg-white border-b border-slate-100 flex items-center justify-between px-8 transition-smooth">

            <div className="flex-1 max-w-xl">
                <div className="relative group">
                    <FaSearch className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-blue-600 transition-smooth" />
                    <input
                        type="text"
                        placeholder="Search products, customers..."
                        className="w-full pl-12 pr-4 py-2.5 bg-slate-50 border border-slate-200 rounded-xl focus:bg-white focus:outline-none focus:ring-2 focus:ring-blue-400 focus:ring-offset-1 transition-smooth placeholder-slate-500"
                    />
                </div>
            </div>

            <div className="flex items-center gap-8 ml-8">

                <button className="relative text-slate-600 hover:text-blue-600 transition-smooth group">
                    <div className="absolute inset-0 bg-slate-100 rounded-lg opacity-0 group-hover:opacity-100 -z-10 transition-smooth"></div>
                    <FaBell className="text-xl p-2" />
                    <span className="absolute -top-1 -right-1 bg-red-500 text-white text-xs font-bold rounded-full w-5 h-5 flex items-center justify-center shadow-sm">
                        3
                    </span>
                </button>

                <div className="w-px h-8 bg-slate-100"></div>

                <div className="flex items-center gap-4 cursor-pointer hover:opacity-80 transition-smooth">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                        <FaUserCircle className="text-lg" />
                    </div>
                    <div>
                        <p className="font-semibold text-slate-900 text-sm">
                            Administrator
                        </p>
                        <p className="text-xs text-slate-500">
                            System Admin
                        </p>
                    </div>
                </div>

                <button className="text-slate-600 hover:text-blue-600 transition-smooth p-2 hover:bg-slate-100 rounded-lg">
                    <FaCog className="text-lg" />
                </button>

            </div>

        </header>

    );

}