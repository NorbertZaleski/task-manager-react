import { useState } from "react";
import { Link, useNavigate } from "react-router";
import { useAuth } from "../context/AuthContext";
import axios from "axios";

type Field = "name" | "username" | "email" | "password";
type Errors = Partial<Record<Field, string>>;

const NAME_RE = /^\p{L}[\p{L}'’-]*(?: \p{L}[\p{L}'’-]*)+$/u;
const USERNAME_RE = /^[a-z0-9_.]+$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

function validate(values: Record<Field, string>): Errors {
    const errors: Errors = {};
    const name = values.name.replace(/\s+/g, " ").trim();
    const username = values.username.trim();
    const email = values.email.trim();
    const { password } = values;

    if (!name) errors.name = "Name is required";
    else if (name.length < 3) errors.name = "Name must be at least 3 characters";
    else if (name.length > 60) errors.name = "Name can be at most 60 characters";
    else if (!NAME_RE.test(name)) errors.name = "Enter your first and last name (letters only)";

    if (!username) errors.username = "Username is required";
    else if (username.length < 3) errors.username = "Username must be at least 3 characters";
    else if (username.length > 30) errors.username = "Username can be at most 30 characters";
    else if (!USERNAME_RE.test(username)) errors.username = "Only letters, numbers, _ and . are allowed";

    if (!email) errors.email = "Email is required";
    else if (!EMAIL_RE.test(email)) errors.email = "Enter a valid email address";

    if (!password) errors.password = "Password is required";
    else if (password.length < 6) errors.password = "Password must be at least 6 characters";

    return errors;
}

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

    const errors = validate(values);
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
                values.email.trim(),
                values.password,
                values.name.replace(/\s+/g, " ").trim(),
                values.username.trim()
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
                    maxLength={60}
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
                    maxLength={30}
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