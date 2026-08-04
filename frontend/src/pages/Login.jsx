import { useState } from "react";
import { useNavigate } from "react-router-dom";
import api from "../services/api";

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

            localStorage.setItem("token", response.data.token);

            navigate("/");

        } catch (err) {

            setError("Invalid username or password.");

        }

        setLoading(false);

    }

    return (

        <div className="min-h-screen flex items-center justify-center bg-gray-100">

            <form
                onSubmit={handleLogin}
                className="bg-white rounded-xl shadow-lg p-8 w-full max-w-md"
            >

                <h1 className="text-3xl font-bold mb-6 text-center">

                    PetShop POS

                </h1>

                <input
                    type="text"
                    placeholder="Username"
                    className="w-full border rounded-lg p-3 mb-4"
                    value={username}
                    onChange={(e) => setUsername(e.target.value)}
                />

                <input
                    type="password"
                    placeholder="Password"
                    className="w-full border rounded-lg p-3 mb-4"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                />

                {

                    error &&

                    <p className="text-red-600 mb-4">

                        {error}

                    </p>

                }

                <button
                    className="w-full bg-blue-600 text-white rounded-lg p-3"
                    disabled={loading}
                >

                    {

                        loading ?

                            "Signing In..."

                            :

                            "Login"

                    }

                </button>

            </form>

        </div>

    );

}