import { FaUserCircle, FaCog } from "react-icons/fa";
import { useNavigate } from "react-router-dom";

export default function Navbar() {
    const navigate = useNavigate();

    return (
        <header className="h-16 border-b border-[#1b3d5c] bg-[#102a43]/95 backdrop-blur-sm px-4 transition-smooth sm:h-20 sm:px-6 lg:px-8">
            <div className="flex h-full items-center justify-end">
                <div className="flex items-center gap-2 rounded-lg border border-[#315575] bg-[#163552] px-2.5 py-2 shadow-sm shadow-blue-950/25 sm:gap-4 sm:px-3">
                    <div className="flex cursor-pointer items-center gap-2 transition-smooth hover:opacity-80 sm:gap-3">
                        <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-400 text-[#102a43] shadow-md shadow-teal-950/30 sm:h-10 sm:w-10">
                            <FaUserCircle className="text-base sm:text-lg" />
                        </div>
                        <div className="hidden text-left sm:block">
                            <p className="text-sm font-semibold leading-tight text-slate-100">
                                Administrator
                            </p>
                            <p className="text-xs leading-tight text-slate-500">
                                System Admin
                            </p>
                        </div>
                    </div>

                    <div className="hidden h-8 w-px bg-[#315575] sm:block" />

                    <button
                        type="button"
                        onClick={() => navigate("/settings")}
                        className="flex h-9 w-9 items-center justify-center rounded-lg border border-transparent text-slate-300 transition-smooth hover:border-[#467190] hover:bg-[#1b3d5c] hover:text-amber-300 sm:h-10 sm:w-10"
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