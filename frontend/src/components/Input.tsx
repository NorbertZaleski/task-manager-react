import { type InputHTMLAttributes } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement>;

function Input({ className = "", ...props }: InputProps) {

    const base = "border border-(--mute) rounded-md px-3 flex-1 text-sm";

    return (
        <input className={`${base} ${className}`} {...props} />
    )
}

export default Input;