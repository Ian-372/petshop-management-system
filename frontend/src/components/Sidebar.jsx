import {
    FaChartPie,
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaFileAlt,
    FaCog,
    FaWarehouse
} from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menuItems = [
    { name: "Dashboard", path: "/", icon: <FaChartPie /> },
    { name: "Products", path: "/products", icon: <FaBoxOpen /> },
    { name: "Stock", path: "/stock", icon: <FaWarehouse /> },
    { name: "Sales", path: "/sales", icon: <FaShoppingCart /> },
    { name: "Customers", path: "/customers", icon: <FaUsers /> },
    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },
    { name: "Settings", path: "/settings", icon: <FaCog /> }
];

export default function Sidebar() {

    return (

        <aside className="w-64 bg-gradient-to-b from-slate-900 via-slate-900 to-slate-950 text-slate-100 min-h-screen flex flex-col transition-smooth">

            {/* Logo Section */}
            <div className="p-6 border-b border-slate-700/50">
                <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-lg flex items-center justify-center font-bold text-white shadow-lg">
                        P
                    </div>
                    <div>
                        <h1 className="text-xl font-bold text-white">PetShop</h1>
                        <p className="text-xs text-slate-400">Management System</p>
                    </div>
                </div>
            </div>

            {/* Navigation */}
            <nav className="mt-6 flex-1 px-3">
                {
                    menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                `flex items-center gap-4 px-4 py-3 rounded-xl mb-1 transition-all duration-300 relative group ${
                                    isActive
                                        ? "bg-blue-600 text-white shadow-lg shadow-blue-600/20"
                                        : "text-slate-400 hover:text-slate-200 hover:bg-slate-800/50"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    {isActive && (
                                        <div className="absolute left-0 top-1/2 -translate-y-1/2 w-1 h-6 bg-white rounded-r-full"></div>
                                    )}
                                    <span className={`text-lg transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                        {item.icon}
                                    </span>
                                    <span className="font-medium text-sm">
                                        {item.name}
                                    </span>
                                </>
                            )}
                        </NavLink>
                    ))
                }
            </nav>

            {/* Footer */}
            <div className="p-4 border-t border-slate-700/50">
                <p className="text-xs text-slate-500 text-center">
                    © 2026 PetShop Management
                </p>
            </div>

        </aside>

    );

}
