import type { ComponentProps, ReactNode } from "react";

type ButtonVariant = "outline" | "outline_small" | "primary" | "ghost" | "ghost_small" | "list";

type ButtonProps = ComponentProps<"button"> & {
    variant?: ButtonVariant;
    iconl?: ReactNode;
    iconr?: ReactNode;
};

const base =
    "flex items-center justify-center text-center gap-2 w-fit h-8 font-medium leading-none border cursor-pointer";

const variants: Record<ButtonVariant, string> = {
    outline:
        "border border-(color:--border-btn) px-2 text-[14px] text-(--text-mute) hover:bg-white/5 rounded-md",
    outline_small:
        "size-8 p-2 border border-(color:--border-btn) text-[14px] text-(--text-mute) hover:bg-white/5 rounded-md",
    primary:
        "bg-(--button) hover:bg-(--button-hover) px-3 text-base text-(--text-dark) rounded-md",
    ghost:
        "hover:bg-(--mute)/20 px-3 text-base text-(--text) border-none rounded-md",
    ghost_small:
        "size-8 p-2 text-base text-(--text) border-none rounded-full hover:bg-white/5 hover:text-(--text-mute)",
    list:
        "border-(--border-mute) px-3 text-base text-(--text-mute) hover:bg-(--border-mute)/40 rounded-md",
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