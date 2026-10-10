import axios from "axios";

const authApi = axios.create({
    baseURL: "http://localhost:5001/api/auth",
    headers: { "Content-Type": "application/json" },
});

export const authService = {
    login: async (email: string, password: string): Promise<string> => {
        const res = await authApi.post<{ token: string }>("/login", { email, password });
        return res.data.token;
    },
};