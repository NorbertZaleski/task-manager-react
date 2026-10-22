import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "outline" | "primary" | "ghost";

type ButtonProps = ComponentProps<"button"> & {
    variant?: ButtonVariant;
    icon?: ReactNode;
};

const base =
    "flex items-center justify-center gap-2 w-fit h-fit rounded-md font-medium leading-none";

const variants: Record<ButtonVariant, string> = {
    outline:
        "border border-(color:--border-btn-simple) px-2 py-2 text-[14px] text-(--text-mute) hover:bg-white/5",
    primary:
        "bg-(--button) hover:bg-(--button-hover) px-3 py-2 text-base text-(--text-dark)",
    ghost:
        "hover:bg-(--mute)/20 px-3 py-2 text-base text-(--text)",
};

function Button({
    variant = "outline",
    icon,
    type = "button",
    className = "",
    children,
    ...rest
}: ButtonProps) {
    return (
        <button
            type={type}
            className={`${base} ${variants[variant]} ${className}`}
            {...rest}
        >
            {icon}
            {children}
        </button>
    );
}

export default Button;