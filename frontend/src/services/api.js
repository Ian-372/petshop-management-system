import axios from "axios";

const api = axios.create({
    // Local backend by default.
    // For Railway, set VITE_API_URL in the frontend .env file:
    // VITE_API_URL=https://petshop-management-system-production.up.railway.app/api
    baseURL:
        import.meta.env.VITE_API_URL ||
        "http://localhost:8080/api",

    headers: {
        "Content-Type": "application/json",
    },
});

// ===========================
// Attach JWT to every request
// ===========================
api.interceptors.request.use(
    (config) => {
        const token = localStorage.getItem("token");

        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }

        return config;
    },
    (error) => Promise.reject(error)
);

// ===========================
// Handle authentication errors
// ===========================
api.interceptors.response.use(
    (response) => response,

    (error) => {

        /*
         * A 401 from the login endpoint means the username/password
         * is incorrect. Do NOT redirect the login page to itself.
         *
         * A 401 from any protected page means the stored JWT is
         * invalid/expired, so clear it and send the user to login.
         */
        if (error.response?.status === 401) {

            const isLoginPage =
                window.location.pathname === "/login";

            if (!isLoginPage) {

                console.log(
                    "Session expired or authentication failed. Redirecting to login..."
                );

                localStorage.removeItem("token");

                window.dispatchEvent(
                    new Event("petshop-auth-changed")
                );

                window.location.replace("/login");
            }
        }

        // Let the individual page/login form handle the error message.
        return Promise.reject(error);
    }
);

export default api;