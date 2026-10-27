import { type InputHTMLAttributes, type Ref } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement>;
};

function Input({ className = "", ref, ...props }: InputProps) {

    const base = "border border-(--mute) rounded-md px-3 flex-1 text-sm";

    return (
        <input ref={ref} className={`${base} ${className}`} {...props} />
    )
}

export default Input;