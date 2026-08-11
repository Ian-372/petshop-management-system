
import axios from "axios";

const api = axios.create({
    baseURL: "http://localhost:8080/api",
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
    
        if (
            error.response &&
            error.response.status === 401
        ) {

            console.log(
                "Session expired or authentication failed. Redirecting to login..."
            );

            localStorage.removeItem("token");

            window.location.href =
                "http://localhost:5173/login";
        }

        //display page/content specific error message
        return Promise.reject(error);
    }

);

export default api;

