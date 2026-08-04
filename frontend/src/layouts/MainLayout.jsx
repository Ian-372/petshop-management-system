import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";

export default function MainLayout({ children }) {

    return (

        <div className="flex min-h-screen bg-slate-100">

            {/* Sidebar */}

            <Sidebar />

            {/* Main Section */}

            <div className="flex-1 flex flex-col">

                {/* Navbar */}

                <Navbar />

                {/* Page Content */}

                <main className="flex-1 p-8 overflow-auto">

                    {children}

                </main>

            </div>

        </div>

    );

}