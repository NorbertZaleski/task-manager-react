import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [name, setName] = useState("");
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);
        setSubmitting(true);
        try {
            await register(email.trim(), password, name.trim());
            navigate("/boards", { replace: true });
        } catch (error) {
            const message =
                axios.isAxiosError(error) && error.response?.data?.message
                    ? error.response.data.message
                    : "Error in registering account";
            setError(message);
        } finally {
            setSubmitting(false);
        }
    }

    return (
        <form onSubmit={handleSubmit} className="flex flex-col gap-3 w-80 mx-auto mt-20">
            <label className="flex flex-col gap-1">
                Name
                <input
                    value={name}
                    onChange={(e) => setName(e.target.value)}
                    autoComplete="name"
                    required
                    className="rounded outline-1 outline-(--border-mute) px-2 py-1"
                />
            </label>
            <label className="flex flex-col gap-1">
                Email
                <input
                    type="email"
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
                {submitting ? "Creating..." : "Register"}
            </button>

            {error && <p className="text-sm">{error}</p>}

            <p className="text-sm">
                Have an account already? <Link to="/login" className="underline">Login</Link>
            </p>
        </form>
    );
}

export default RegisterPage;