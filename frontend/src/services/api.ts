import axios from "axios";

export const TOKEN_KEY = "token";

export const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:5001/api";

const api = axios.create({
    baseURL: API_URL,
    headers: { "Content-Type": "application/json" },
});

// Interceptor do dodawania tokenu
api.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;

    if (config.data instanceof FormData) {
        delete config.headers["Content-Type"];
    }
    return config;
});

export default api;