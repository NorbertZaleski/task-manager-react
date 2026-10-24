import { useEffect, useState, type ReactNode } from "react";
import { authService } from "../services/auth.service";
import { AuthContext } from "./AuthContext";
import type { User } from "../types/types";

function AuthProvider({ children }: { children: ReactNode }) {
    const [user, setUser] = useState<User | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        if (!authService.getToken()) {
            setLoading(false);
            return;
        }
        authService
            .getMe()
            .then(setUser)
            .catch(() => {
                authService.logout();
                setUser(null);
            })
            .finally(() => setLoading(false));
    }, []);

    const login = async (email: string, password: string) => {
        await authService.login(email, password);
        setUser(await authService.getMe());
    };

    const register = async (email: string, password: string, name?: string) => {
        await authService.register(email, password, name);
        setUser(await authService.getMe());
    };

    const logout = () => {
        authService.logout();
        setUser(null);
    };

    return (
        <AuthContext.Provider value={{ user, loading, login, register, logout }}>
            {children}
        </AuthContext.Provider>
    );
}

export default AuthProvider;