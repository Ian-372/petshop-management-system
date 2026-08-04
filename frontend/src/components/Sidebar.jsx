import {
    FaChartPie,
    FaBoxOpen,
    FaShoppingCart,
    FaUsers,
    FaTruck,
    FaFileAlt,
    FaCog
} from "react-icons/fa";

const menuItems = [
    { name: "Dashboard", icon: <FaChartPie /> },
    { name: "Products", icon: <FaBoxOpen /> },
    { name: "Sales", icon: <FaShoppingCart /> },
    { name: "Customers", icon: <FaUsers /> },
    { name: "Suppliers", icon: <FaTruck /> },
    { name: "Reports", icon: <FaFileAlt /> },
    { name: "Settings", icon: <FaCog /> }
];

export default function Sidebar() {

    return (

        <aside className="w-64 bg-slate-900 text-white h-screen">

            <div className="text-2xl font-bold p-6 border-b border-slate-700">

                PetShop POS

            </div>

            <nav className="mt-6">

                {menuItems.map((item) => (

                    <button
                        key={item.name}
                        className="w-full flex items-center gap-4 px-6 py-4 hover:bg-slate-800 transition"
                    >

                        <span className="text-lg">

                            {item.icon}

                        </span>

                        <span>

                            {item.name}

                        </span>

                    </button>

                ))}

            </nav>

        </aside>

    );

}