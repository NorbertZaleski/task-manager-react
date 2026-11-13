import { useState, type InputHTMLAttributes, type Ref } from "react";

type InputProps = InputHTMLAttributes<HTMLInputElement> & {
    ref?: Ref<HTMLInputElement>;
};

function Input({ className = "", ref, onFocus, onBlur, ...props }: InputProps) {
    const [focused, setFocused] = useState(false);

    const base = "border-0 outline outline-2 rounded-md px-2 py-1 flex-1 text-normal";

    return (
        <input
            ref={ref}
            onFocus={(e) => {
                setFocused(true);
                onFocus?.(e);
            }}
            onBlur={(e) => {
                setFocused(false);
                onBlur?.(e);
            }}
            className={`${base} ${
                focused
                    ? "outline-(--border-active-textarea)"
                    : "outline-(--border-mute)"
            } ${className}`}
            {...props}
        />
    );
}

export default Input;