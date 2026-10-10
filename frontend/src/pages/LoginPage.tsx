import { useState } from "react";
import { useNavigate } from "react-router";
import { authService } from "../services/auth.service";

function LoginPage() {
    const navigate = useNavigate();
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [error, setError] = useState<string | null>(null);

    async function handleSubmit(e: React.FormEvent) {
        e.preventDefault();
        try {
            const token = await authService.login(email, password);
            localStorage.setItem("token", token);
            navigate("/boards", { replace: true });
        } catch {
            setError("Nieprawidłowy email lub hasło");
        }
    }

    return (
        <form onSubmit={handleSubmit}>
            <div>email<input value={email} onChange={(e) => setEmail(e.target.value)} /></div>
            <div>password<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} /></div>
            <button type="submit">Zaloguj</button>
            {error && <p>{error}</p>}
        </form>
    );
}

export default LoginPage;