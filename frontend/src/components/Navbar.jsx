import { FaUserCircle, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <header className="h-20 bg-white border-b border-slate-100 px-8 transition-smooth">
            <div className="h-full flex items-center justify-end">
                <div className="flex items-center gap-4 rounded-2xl border border-slate-200 bg-slate-50/80 px-3 py-2 shadow-sm">
                    <div className="flex items-center gap-3 cursor-pointer hover:opacity-80 transition-smooth">
                        <div className="w-10 h-10 bg-gradient-to-br from-blue-500 to-blue-600 rounded-full flex items-center justify-center text-white shadow-md">
                            <FaUserCircle className="text-lg" />
                        </div>
                        <div className="text-left">
                            <p className="font-semibold text-slate-900 text-sm leading-tight">
                                Administrator
                            </p>
                            <p className="text-xs text-slate-500 leading-tight">
                                System Admin
                            </p>
                        </div>
                    </div>

                    <div className="h-8 w-px bg-slate-200" />

                    <button
                        type="button"
                        onClick={() => navigate("/settings")}
                        className="flex items-center justify-center h-10 w-10 rounded-xl text-slate-600 hover:text-blue-600 transition-smooth hover:bg-slate-100 border border-transparent hover:border-slate-200"
                        aria-label="Go to settings"
                        title="Settings"
                    >
                        <FaCog className="text-lg" />
                    </button>
                </div>
            </div>
        </header>
    );
}