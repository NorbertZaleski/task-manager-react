import { X } from "lucide-react";
import { useLayoutEffect, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";

export type ModalOption = {
    id: string;
    label: string;
    category?: string;
    onClick: () => void;
}

type OptionsModalProps = {
    title: string;
    onClose: () => void;
    options?: ModalOption[];
    anchorRef: RefObject<HTMLElement | null>;
    compOptions?: ReactNode;
};

const WIDTH = 240;
const GAP = 8;

function OptionsModal({title, onClose, options=[], anchorRef, compOptions}: OptionsModalProps) {
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
            className="fixed z-100 w-60 rounded-lg bg-(--bg-modal) p-3 shadow-2xl flex flex-col gap-1">
                <div className="flex items-center justify-between text-center">
                    <div></div>
                    <h3 className="text-sm font-semibold text-(--text-mute)">{title}</h3>
                    <button
                    type="button"
                    onClick={onClose}
                    className="hover:text-(--text-mute)"
                    >
                        <X size={18} />
                    </button>
                </div>

                {options.map((option)=> (
                    
                    <div key={option.id} className="flex flex-col">

                        <p className="font-semibold px-2 py-1 text-sm text-left">{option.category}</p>

                        <button
                        type="button"
                        key={option.id}
                        onClick={() => {
                            option.onClick();
                            onClose();
                        }}
                        className="flex items-center px-2 py-1 text-left rounded-sm hover:bg-(--hover-white)"
                        >
                            <span>{option.label}</span>
                        </button>
                    </div>
                ))}

                {compOptions && (
                    <div className={options.length > 0 ? "pt-2 mt-1 border-t border-white/10" : ""}>
                        {compOptions}
                    </div>
                )}

            </div>
        </>,
        document.body
    );
}

export default OptionsModal;