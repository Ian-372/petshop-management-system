
import axios from "axios";

const api = axios.create({
    // Defaults to the local backend. Set VITE_API_URL to the deployed API URL,
    // for example: VITE_API_URL=https://api.example.com/api
    baseURL: import.meta.env.VITE_API_URL || "http://localhost:8080/api",
    headers: {
        "Content-Type": "application/json",
    },
});

// ===========================
// Attach JWT to every request
// ===========================
api.interceptors.request.use((config) => {

    const token = localStorage.getItem("token");

    if (token) {
        config.headers.Authorization = `Bearer ${token}`;
    }

    return config;
});

// ===========================
// Handle authentication errors
// ===========================
api.interceptors.response.use(

    (response) => response,

    (error) => {

        
       //  Only redirect to login when the authentication token is actually invalid or expired
    
        if (error.response && error.response.status === 401) {

            console.log(
                "Session expired or authentication failed. Redirecting to login..."
            );

            localStorage.removeItem("token");
            window.dispatchEvent(new Event("petshop-auth-changed"));

            // The login page itself deliberately receives 401 for an invalid
            // username/password. Redirecting from /login to /login caused a
            // document reload loop that made the form unusable.
            if (window.location.pathname !== "/login") {
                window.location.replace("/login");
            }
        }

        //display page/content specific error message
        return Promise.reject(error);
    }

);

export default api;

