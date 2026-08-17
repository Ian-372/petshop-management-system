import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";
import { FaLock } from "react-icons/fa";

export default function Login() {

    const navigate = useNavigate();

    const [username, setUsername] = useState("");
    const [password, setPassword] = useState("");

    const [loading, setLoading] = useState(false);

    const [error, setError] = useState("");

    async function handleLogin(e) {

        e.preventDefault();

        setLoading(true);

        setError("");

        try {

            const response = await api.post("/auth/login", {

                username,
                password

            });

            localStorage.removeItem("token");
            localStorage.setItem("token", response.data.token);
            window.dispatchEvent(new Event("petshop-auth-changed"));

            navigate("/");

        } catch (err) {

            if (!err.response) {
                setError("Cannot reach the local backend. Start it on port 8080 and try again.");
            } else if (err.response.status === 401) {
                setError("Invalid username or password.");
            } else {
                setError(err.response.data?.message || "Sign-in failed. Please try again.");
            }

        }

        setLoading(false);

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-slate-800 to-slate-900 relative overflow-hidden">

            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden">
                <div className="absolute top-0 right-0 w-96 h-96 bg-blue-500/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-96 h-96 bg-purple-500/10 rounded-full blur-3xl"></div>
            </div>

            <form
                onSubmit={handleLogin}
                className="relative w-full max-w-md px-6 sm:px-0"
            >

                <div className="bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-8 border border-white/20">

                    {/* Logo Section */}
                    <div className="text-center mb-8">
                        <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-blue-600 rounded-2xl flex items-center justify-center mx-auto mb-4 shadow-lg">
                            <FaLock className="text-2xl text-white" />
                        </div>
                        <h1 className="text-3xl font-bold text-white mb-2">
                            PetShop POS
                        </h1>
                        <p className="text-slate-300 text-sm">
                            Management System
                        </p>
                    </div>

                    {/* Form Fields */}
                    <div className="space-y-4">
                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                                Username
                            </label>
                            <input
                                type="text"
                                placeholder="Enter your username"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                                value={username}
                                onChange={(e) => setUsername(e.target.value)}
                            />
                        </div>

                        <div>
                            <label className="block text-sm font-medium text-slate-200 mb-2">
                                Password
                            </label>
                            <input
                                type="password"
                                placeholder="Enter your password"
                                className="w-full px-4 py-3 bg-white/10 border border-white/20 rounded-lg text-white placeholder-slate-400 focus:bg-white/20 focus:border-blue-400 focus:outline-none focus:ring-2 focus:ring-blue-400/50 transition-all duration-200"
                                value={password}
                                onChange={(e) => setPassword(e.target.value)}
                            />
                        </div>
                    </div>

                    {/* Error Message */}
                    {
                        error &&
                        <div className="mt-4 p-3 bg-red-500/20 border border-red-500/30 rounded-lg">
                            <p className="text-red-200 text-sm font-medium">
                                {error}
                            </p>
                        </div>
                    }

                    {/* Submit Button */}
                    <button
                        type="submit"
                        className="w-full mt-6 bg-gradient-to-r from-blue-600 to-blue-700 hover:from-blue-700 hover:to-blue-800 text-white font-semibold py-3 rounded-lg transition-all duration-200 shadow-lg hover:shadow-xl hover:shadow-blue-500/25 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed"
                        disabled={loading}
                    >

                        {

                            loading ?

                                <span className="inline-flex items-center gap-2">
                                    <span className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
                                    Signing in...
                                </span>
                                :
                                "Sign In"

                        }

                    </button>

                    {/* Footer */}
                    <p className="text-center text-slate-400 text-xs mt-6">
                        © 2026 PetShop Management. All rights reserved.
                    </p>

                </div>

            </form>

        </div>

    );

}
