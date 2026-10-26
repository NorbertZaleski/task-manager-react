import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "outline" | "primary" | "ghost" | "list";

type ButtonProps = ComponentProps<"button"> & {
    variant?: ButtonVariant;
    iconl?: ReactNode;
    iconr?: ReactNode;
};

const base =
    "flex items-center justify-center gap-2 w-fit h-8 rounded-md font-medium leading-none border";

const variants: Record<ButtonVariant, string> = {
    outline:
        "border border-(color:--border-btn-simple) px-2 text-[14px] text-(--text-mute) hover:bg-white/5",
    primary:
        "bg-(--button) hover:bg-(--button-hover) px-3 text-base text-(--text-dark)",
    ghost:
        "hover:bg-(--mute)/20 px-3 text-base text-(--text)",
    list:
        "border-(--border-mute) px-3 text-base",
};

function Button({
    variant = "outline",
    iconl,
    iconr,
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
            {iconl}
            {children}
            {iconr}
        </button>
    );
}

export default Button;