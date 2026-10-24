import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import axios from "axios";

function LoginPage() {
    const navigate = useNavigate();
    const {login} = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await login(email.trim(), password);
            navigate("/boards", { replace: true });
        } catch (error) {
            const message =
                axios.isAxiosError(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "Error in login account";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80 mx-auto mt-20">
            <label className="flex flex-col gap-1">
                E-mail
                <input
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    autoComplete="email"
                    required
                    className="rounded outline-1 outline-(--border-mute) px-2 py-1"
                />
            </label>
            <label className="flex flex-col gap-1">
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    autoComplete="new-password"
                    minLength={6}
                    required
                    className="rounded outline-1 outline-(--border-mute) px-2 py-1"
                />
            </label>
            <button 
            type="submit"
            disabled={submitting}
            className="rounded-sm bg-(--button) text-(--text-dark) font-semibold py-1 px-2 disabled:opacity-60"
            >
                {submitting ? "Logging in..." : "Login"}
            </button>
            {error && <p className="text-sm">{error}</p>}

            <p className="text-sm">
                Don't have an account yet? <Link to="/register" className="underline">Register</Link>
            </p>
        </form>
    );
}

export default LoginPage;