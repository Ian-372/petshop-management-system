import { FaUserCircle, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <header className="h-16 border-b border-slate-100 bg-white/90 backdrop-blur-sm px-4 transition-smooth sm:h-20 sm:px-6 lg:px-8">
            <div className="flex h-full items-center justify-end">
                <div className="flex items-center gap-2 rounded-2xl border border-slate-200 bg-slate-50/80 px-2.5 py-2 shadow-sm sm:gap-4 sm:px-3">
                    <div className="flex cursor-pointer items-center gap-2 transition-smooth hover:opacity-80 sm:gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-gradient-to-br from-blue-500 to-blue-600 text-white shadow-md sm:h-10 sm:w-10">
                            <FaUserCircle className="text-base sm:text-lg" />
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold leading-tight text-slate-900">
                                Administrator
                            </p>
                            <p className="text-xs leading-tight text-slate-500">
                                System Admin
                            </p>
                        </div>
                    </div>

                    <div className="hidden h-8 w-px bg-slate-200 sm:block" />

                    <button
                        type="button"
                        onClick={() => navigate("/settings")}
                        className="flex h-9 w-9 items-center justify-center rounded-xl border border-transparent text-slate-600 transition-smooth hover:border-slate-200 hover:bg-slate-100 hover:text-blue-600 sm:h-10 sm:w-10"
                        aria-label="Go to settings"
                        title="Settings"
                    >
                        <FaCog className="text-base sm:text-lg" />
                    </button>
                </div>
            </div>
        </header>
    );
}