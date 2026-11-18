import { useState } from "react";
import { useAuth } from "../context/AuthContext";
import { Link, useNavigate } from "react-router";
import axios from "axios";
import { normalizeEmail, validateLogin, type Field } from "../utils/validation";

type LoginField = Extract<Field, "email" | "password">;

const inputClass = (hasError: boolean) =>
    `rounded outline-1 px-2 py-1 ${
        hasError ? "outline-red-400" : "outline-(--border-mute)"
    }`;

function LoginPage() {
    const navigate = useNavigate();
    const { login } = useAuth();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [touched, setTouched] = useState<Partial<Record<LoginField, boolean>>>({});
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const errors = validateLogin({ email, password });
    const showError = (f: LoginField) => (touched[f] ? errors[f] : undefined);

    function touch(field: LoginField) {
        setTouched((t) => ({ ...t, [field]: true }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (Object.keys(errors).length > 0) {
            setTouched({ email: true, password: true });
            return;
        }

        setSubmitting(true);
        try {
            await login(normalizeEmail(email), password);
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
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 w-80 mx-auto mt-20">
            <label className="flex flex-col gap-1">
                E-mail
                <input
                    type="email"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    onBlur={() => touch("email")}
                    autoComplete="email"
                    aria-invalid={!!showError("email")}
                    className={inputClass(!!showError("email"))}
                />
                {showError("email") && <span className="text-xs text-red-400">{showError("email")}</span>}
            </label>

            <label className="flex flex-col gap-1">
                Password
                <input
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    onBlur={() => touch("password")}
                    autoComplete="current-password"
                    aria-invalid={!!showError("password")}
                    className={inputClass(!!showError("password"))}
                />
                {showError("password") && <span className="text-xs text-red-400">{showError("password")}</span>}
            </label>

            <button
                type="submit"
                disabled={submitting}
                className="rounded-sm bg-(--button) text-(--text-dark) font-semibold py-1 px-2 disabled:opacity-60"
            >
                {submitting ? "Logging in..." : "Login"}
            </button>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <p className="text-sm">
                Don't have an account yet? <Link to="/register" className="underline">Register</Link>
            </p>
        </form>
    );
}

export default LoginPage;