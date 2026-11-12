import api, { TOKEN_KEY } from "./api";
import type { User } from "../types/types";

export const authService = {
    getToken: () => localStorage.getItem(TOKEN_KEY),

    login: async (email: string, password: string): Promise<string> => {
        const res = await api.post<{ token: string }>("/auth/login", { email, password });
        localStorage.setItem(TOKEN_KEY, res.data.token);
        return res.data.token;
    },

    register: async (email: string, password: string, name?: string): Promise<string> => {
        const res = await api.post<{ token: string }>("/auth/register", { email, password, name });
        localStorage.setItem(TOKEN_KEY, res.data.token);
        return res.data.token;
    },

    getMe: async (): Promise<User> => {
        const res = await api.get<User>("/auth/me");
        return res.data;
    },

    logout: () => {
        localStorage.removeItem(TOKEN_KEY);
    },
};