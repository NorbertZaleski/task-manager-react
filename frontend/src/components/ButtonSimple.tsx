import type { ReactNode } from "react";

type ButtonSimpleProps = {
    text: string;
    icon: ReactNode;
    onClick?: () => void;
};

function ButtonSimple({text, icon, onClick}: ButtonSimpleProps){
    return (
        <button
        type="button"
        onClick={onClick}
        className="border border-(--border-btn-simple) w-fit px-2 py-2 rounded-md text-[14px] flex gap-2 font-medium text-(--text-mute) items-center justify-center leading-none hover:bg-white/5"
        >
            {icon}
            {text}
        </button>
    )
}

export default ButtonSimple;