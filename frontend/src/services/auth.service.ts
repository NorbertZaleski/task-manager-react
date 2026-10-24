import axios from "axios";
import type { User } from "../types/types";

const TOKEN_KEY = "token";

const authApi = axios.create({
    baseURL: "http://localhost:5001/api/auth",
    headers: { "Content-Type": "application/json" },
});

authApi.interceptors.request.use((config) => {
    const token = localStorage.getItem(TOKEN_KEY);
    if (token) config.headers.Authorization = `Bearer ${token}`;
    return config;
});

export const authService = {
    getToken: () => localStorage.getItem(TOKEN_KEY),

    login: async (email: string, password: string): Promise<string> => {
        const res = await authApi.post<{ token: string }>("/login", { email, password });
        localStorage.setItem(TOKEN_KEY, res.data.token);
        return res.data.token;
    },

    register: async (email: string, password: string, name?: string): Promise<string> => {
        const res = await authApi.post<{ token: string }>("/register", { email, password, name });
        localStorage.setItem(TOKEN_KEY, res.data.token);
        return res.data.token;
    },

    getMe: async (): Promise<User> => {
        const res = await authApi.get<User>("/me");
        return res.data;
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
    },
};