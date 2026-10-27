import axios from "axios";
import type { User } from "../types/types";

const getToken = () => localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://localhost:5001/api/users',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor do dodawania tokenu
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const searchUsers = async (q: string, signal?: AbortSignal): Promise<User[]> => {
    const response = await api.get("/search", { params: { q }, signal});
    return response.data;
}