import axios from "axios";

const api = axios.create({
    // Prefer the deployed backend by default so the app does not silently fall
    // back to a dead localhost service when the env is missing or stale.
    baseURL:
        import.meta.env.VITE_API_URL ||
        "https://petshop-management-system.ianmutuli36.workers.dev/api",

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
        const status = error.response?.status;
        const isAuthenticationRequest =
            error.config?.url?.includes("/auth/");
        const hasToken = Boolean(localStorage.getItem("token"));

        if ((status === 401 || status === 403) && hasToken && !isAuthenticationRequest) {

            localStorage.removeItem("token");

            window.dispatchEvent(
                new Event("petshop-auth-changed")
            );

            window.location.replace("/login?reason=session-expired");
        }

        // Let the individual page/login form handle the error message.
        return Promise.reject(error);
    }
);

export default api;