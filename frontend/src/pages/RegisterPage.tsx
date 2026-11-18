import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";
import { LIMITS, normalizeEmail, normalizeName, normalizeUsername, validateRegister, type Field } from "../utils/validation";

const inputClass = (hasError: boolean) =>
    `rounded outline-1 px-2 py-1 ${
        hasError ? "outline-red-400" : "outline-(--border-mute)"
    }`;

function RegisterPage() {
    const navigate = useNavigate();
    const { register } = useAuth();
    const [values, setValues] = useState<Record<Field, string>>({
        name: "",
        username: "",
        email: "",
        password: "",
    });
    const [touched, setTouched] = useState<Partial<Record<Field, boolean>>>({});
    const [error, setError] = useState<string | null>(null);
    const [submitting, setSubmitting] = useState(false);

    const errors = validateRegister(values);
    const showError = (f: Field) => (touched[f] ? errors[f] : undefined);

    function setField(field: Field, value: string) {
        setValues((v) => ({ ...v, [field]: value }));
    }

    function touch(field: Field) {
        setTouched((t) => ({ ...t, [field]: true }));
    }

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        setError(null);

        if (Object.keys(errors).length > 0) {
            setTouched({ name: true, username: true, email: true, password: true });
            return;
        }

        setSubmitting(true);
        try {
            await register(
                normalizeEmail(values.email),
                values.password,
                normalizeName(values.name),
                normalizeUsername(values.username)
            );
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
        <form onSubmit={handleSubmit} noValidate className="flex flex-col gap-3 w-80 mx-auto mt-20">
            <label className="flex flex-col gap-1">
                Name
                <input
                    value={values.name}
                    onChange={(e) => setField("name", e.target.value)}
                    onBlur={() => touch("name")}
                    autoComplete="name"
                    maxLength={LIMITS.name.max}
                    aria-invalid={!!showError("name")}
                    className={inputClass(!!showError("name"))}
                />
                {showError("name") && <span className="text-xs text-red-400">{showError("name")}</span>}
            </label>

            <label className="flex flex-col gap-1">
                Username
                <input
                    value={values.username}
                    onChange={(e) => setField("username", e.target.value)}
                    onBlur={() => touch("username")}
                    autoComplete="username"
                    maxLength={LIMITS.username.max}
                    aria-invalid={!!showError("username")}
                    className={inputClass(!!showError("username"))}
                />
                {showError("username") && <span className="text-xs text-red-400">{showError("username")}</span>}
            </label>

            <label className="flex flex-col gap-1">
                Email
                <input
                    type="email"
                    value={values.email}
                    onChange={(e) => setField("email", e.target.value)}
                    onBlur={() => touch("email")}
                    autoComplete="email"
                    maxLength={LIMITS.email.max}
                    aria-invalid={!!showError("email")}
                    className={inputClass(!!showError("email"))}
                />
                {showError("email") && <span className="text-xs text-red-400">{showError("email")}</span>}
            </label>

            <label className="flex flex-col gap-1">
                Password
                <input
                    type="password"
                    value={values.password}
                    onChange={(e) => setField("password", e.target.value)}
                    onBlur={() => touch("password")}
                    autoComplete="new-password"
                    maxLength={LIMITS.password.max}
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
                {submitting ? "Creating..." : "Register"}
            </button>

            {error && <p className="text-sm text-red-400">{error}</p>}

            <p className="text-sm">
                Have an account already? <Link to="/login" className="underline">Login</Link>
            </p>
        </form>
    );
}

export default RegisterPage;