import {
    FaChartPie,
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaFileAlt,
    FaCog,
    FaClipboardList
} from "react-icons/fa";
import { FaWarehouse } from "react-icons/fa";
import { NavLink } from "react-router-dom";

const menuItems = [

    { name: "Dashboard", path: "/", icon: <FaChartPie /> },

    { name: "Products", path: "/products", icon: <FaBoxOpen /> },
    {
    name: "Stock",
    path: "/stock",
    icon: <FaWarehouse />
},

    { name: "Purchases", path: "/purchases", icon: <FaClipboardList /> },

    { name: "Sales", path: "/sales", icon: <FaShoppingCart /> },

    { name: "Customers", path: "/customers", icon: <FaUsers /> },

    { name: "Reports", path: "/reports", icon: <FaFileAlt /> },

    { name: "Settings", path: "/settings", icon: <FaCog /> }

];

export default function Sidebar() {

    return (

        <aside className="w-64 bg-slate-900 text-white min-h-screen">

            <div className="text-2xl font-bold p-6 border-b border-slate-700">

                PetShop POS

            </div>
            <nav className="mt-6">

                {
                    menuItems.map((item) => (

                        <NavLink

                            key={item.name}

                            to={item.path}

                            className={({ isActive }) =>

                                `flex items-center gap-4 px-6 py-4 transition ${
                                    isActive
                                        ? "bg-blue-600"
                                        : "hover:bg-slate-800"
                                }`

                            }

                        >

                            <span className="text-lg">

                                {item.icon}

                            </span>

                            <span>

                                {item.name}

                            </span>

                        </NavLink>

                    ))

                }

            </nav>

        </aside>

    );

}