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
        <>
            <aside className="hidden min-h-screen w-64 flex-col border-r border-[#1b3d5c] bg-[#102a43] text-slate-100 transition-smooth lg:flex">

                {/* Logo Section */}
                <div className="border-b border-[#1b3d5c] p-6">
                    <div className="flex items-center gap-3">
                        <div className="flex h-10 w-10 items-center justify-center rounded-lg bg-amber-400 font-bold text-[#102a43] shadow-lg shadow-amber-950/30">
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
                                    `group relative mb-1 flex items-center gap-4 rounded-xl px-4 py-3 transition-all duration-300 ${
                                        isActive
                                            ? "bg-amber-400 text-[#102a43] shadow-lg shadow-amber-950/30"
                                            : "text-slate-300 hover:bg-[#1b3d5c] hover:text-white"
                                    }`
                                }
                            >
                                {({ isActive }) => (
                                    <>
                                        {isActive && (
                                            <div className="absolute left-0 top-1/2 h-6 w-1 -translate-y-1/2 rounded-r-full bg-[#102a43]"></div>
                                        )}
                                        <span className={`text-lg transition-transform ${isActive ? "scale-110" : "group-hover:scale-110"}`}>
                                            {item.icon}
                                        </span>
                                        <span className="text-sm font-medium">
                                            {item.name}
                                        </span>
                                    </>
                                )}
                            </NavLink>
                        ))
                    }
                </nav>

                {/* Footer */}
                <div className="border-t border-[#1b3d5c] p-4">
                    <p className="text-center text-xs text-slate-500">
                        © 2026 PetShop Management
                    </p>
                </div>

            </aside>

            <nav className="fixed inset-x-0 bottom-0 z-50 border-t border-[#1b3d5c] bg-[#102a43]/95 px-1 pb-[max(env(safe-area-inset-bottom),0.5rem)] pt-1 shadow-[0_-10px_30px_rgba(16,42,67,0.35)] backdrop-blur-xl lg:hidden">
                <div className="mx-auto grid w-full max-w-xl grid-cols-7 gap-1">
                    {menuItems.map((item) => (
                        <NavLink
                            key={item.name}
                            to={item.path}
                            className={({ isActive }) =>
                                    `flex min-w-0 flex-col items-center justify-center rounded-lg px-1 py-1.5 text-[9px] font-medium leading-tight transition-all duration-200 sm:px-2 sm:text-[10px] ${
                                    isActive
                                        ? "bg-amber-400 text-[#102a43] shadow-lg shadow-amber-950/30"
                                        : "text-slate-300 hover:bg-[#1b3d5c] hover:text-white"
                                }`
                            }
                        >
                            {({ isActive }) => (
                                <>
                                    <span className={`mb-0.5 text-sm sm:text-base ${isActive ? "scale-110" : ""}`}>
                                        {item.icon}
                                    </span>
                                    <span>{item.name}</span>
                                </>
                            )}
                        </NavLink>
                    ))}
                </div>
            </nav>
        </>
    );

}
