import Sidebar from "../components/Sidebar";
import Navbar from "../components/Navbar";
import { Outlet } from "react-router-dom";

export default function MainLayout() {

    return (

        <div className="app-shell min-h-screen">

            <div className="flex min-h-screen flex-col lg:flex-row">

                {/* Sidebar */}

                <Sidebar />

                {/* Main Content */}

                <div className="flex flex-1 min-w-0 flex-col">

                    {/* Navbar */}

                    <Navbar />

                    {/* Page */}

                    <main className="app-main flex-1 overflow-auto p-4 pb-28 sm:p-6 lg:p-8 lg:pb-8">

                        <Outlet />

                    </main>

                </div>

            </div>

        </div>

    );

}