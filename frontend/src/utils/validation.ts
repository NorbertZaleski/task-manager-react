export type Field = "name" | "username" | "email" | "password";
export type Errors = Partial<Record<Field, string>>;

export const LIMITS = {
    name: { min: 3, max: 60 },
    username: { min: 3, max: 30 },
    email: {max: 254},
    password: { min: 6, max: 72 },
} as const;

const NAME_RE = /^\p{L}[\p{L}'’-]*(?: \p{L}[\p{L}'’-]*)+$/u;
const USERNAME_RE = /^[a-z0-9_]+$/i;
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

export const normalizeName = (v: string) => v.replace(/\s+/g, " ").trim();
export const normalizeUsername = (v: string) => v.trim();
export const normalizeEmail = (v: string) => v.trim();

export function validateName(raw: string): string | undefined {
    const name = normalizeName(raw);
    if (!name) return "Name is required";
    if (name.length < LIMITS.name.min) return `Name must be at least ${LIMITS.name.min} characters`;
    if (name.length > LIMITS.name.max) return `Name can be at most ${LIMITS.name.max} characters`;
    if (!NAME_RE.test(name)) return "Enter your first and last name (letters only)";
}

export function validateUsername(raw: string): string | undefined {
    const username = normalizeUsername(raw);
    if (!username) return "Username is required";
    if (username.length < LIMITS.username.min) return `Username must be at least ${LIMITS.username.min} characters`;
    if (username.length > LIMITS.username.max) return `Username can be at most ${LIMITS.username.max} characters`;
    if (!USERNAME_RE.test(username)) return "Only letters, numbers and _ are allowed";
}

export function validateEmail(raw: string): string | undefined {
    const email = normalizeEmail(raw);
    if (!email) return "Email is required";
    if (email.length > LIMITS.email.max) return `Email can be at most ${LIMITS.email.max} characters`;
    if (!EMAIL_RE.test(email)) return "Enter a valid email address";
}

export function validateNewPassword(password: string): string | undefined {
    if (!password) return "Password is required";
    if (password.length < LIMITS.password.min) return `Password must be at least ${LIMITS.password.min} characters`;
    if (password.length > LIMITS.password.max) return `Password can be at most ${LIMITS.password.max} characters`;
}

//formularze

const clean = (errors: Errors): Errors =>
    Object.fromEntries(Object.entries(errors).filter(([, msg]) => msg)) as Errors;

export function validateRegister(values: Record<Field, string>): Errors {
    return clean({
        name: validateName(values.name),
        username: validateUsername(values.username),
        email: validateEmail(values.email),
        password: validateNewPassword(values.password),
    });
}

export function validateLogin(values: Pick<Record<Field, string>, "email" | "password">): Errors {
    return clean({
        email: validateEmail(values.email),
        password: values.password ? undefined : "Password is required",
    });
}