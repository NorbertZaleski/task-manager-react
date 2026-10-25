import { X } from "lucide-react";
import { useLayoutEffect, useState, type RefObject } from "react";
import { createPortal } from "react-dom";

export type ModalOption = {
    id: string;
    label: string;
    onClick: () => void;
}

type OptionsModalProps = {
    title: string;
    onClose: () => void;
    options: ModalOption[];
    anchorRef: RefObject<HTMLElement | null>;
};

const WIDTH = 240;
const GAP = 8;

function OptionsModal({title, onClose, options, anchorRef}: OptionsModalProps) {
    const [pos, setPos] = useState({ top: 0, left: 0 });

    useLayoutEffect(() => {
        const rect = anchorRef.current?.getBoundingClientRect();
        if (!rect) return;

        const left = Math.min(rect.left, window.innerWidth - WIDTH - GAP);
        setPos({ top: rect.bottom + GAP, left: Math.max(GAP, left) });
    }, [anchorRef]);

    return createPortal(
        <>
            <div className="fixed inset-0 z-99" onClick={onClose} />

            <div 
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-100 w-60 rounded-lg bg-(--panel) p-3 shadow-lg flex flex-col gap-1">
                <div className="flex items-center justify-between">
                    <h3 className="text-sm font-semibold">{title}</h3>
                    <button
                    type="button"
                    onClick={onClose}
                    >
                        <X size={18} />
                    </button>
                </div>

                {options.map((option)=> (
                    <button
                    type="button"
                    key={option.id}
                    onClick={() => {
                        option.onClick();
                        onClose();
                    }}
                    className="flex items-center px-2 py-1 text-sm text-left rounded-sm hover:bg-(--hover-white)"
                    >
                        {option.label}
                    </button>
                ))}

            </div>
        </>,
        document.body
    );
}

export default OptionsModal;