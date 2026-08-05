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
// Handle expired/invalid JWT
// ===========================
api.interceptors.response.use(

    (response) => response,

    (error) => {

        if (
            error.response &&
            (error.response.status === 401 ||
             error.response.status === 403)
        ) {

            console.log("Session expired. Redirecting to login...");

            localStorage.removeItem("token");

            window.location.href = "http://localhost:5173/login";
        }

        return Promise.reject(error);
    }
);

export default api;