import { X } from "lucide-react";
import { useLayoutEffect, useRef, useState, type ReactNode, type RefObject } from "react";
import { createPortal } from "react-dom";
import Button from "./Button";

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
    className?: string;
    width?: number;
};

const DEFAULT_WIDTH = 240;
const GAP = 8;

function OptionsModal({title, onClose, options=[], anchorRef, compOptions, className, width = DEFAULT_WIDTH}: OptionsModalProps) {
    const popRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

    useLayoutEffect(() => {
        const update = () => {
            const anchor = anchorRef.current?.getBoundingClientRect();
            const pop = popRef.current;
            if (!anchor || !pop) return;

            const height = pop.offsetHeight;
            const vh = window.innerHeight;

            let top = anchor.bottom + GAP;
            if (top + height > vh - GAP) {
                const above = anchor.top - height - GAP;
                top = above >= GAP ? above : Math.max(GAP, vh - height - GAP);
            }

            const left = Math.max(GAP, Math.min(anchor.left, window.innerWidth - width - GAP));
            setPos({ top, left });
        };

        update();

        const ro = new ResizeObserver(update);
        if (popRef.current) ro.observe(popRef.current);

        window.addEventListener("resize", update);
        window.addEventListener("scroll", update, true);
        return () => {
            ro.disconnect();
            window.removeEventListener("resize", update);
            window.removeEventListener("scroll", update, true);
        };
    }, [anchorRef, width]);

    return createPortal(
        <>
            <div className="fixed inset-0 z-99" onClick={onClose} />

            <div
                ref={popRef}
                style={{
                    top: pos?.top ?? 0,
                    left: pos?.left ?? 0,
                    width,
                    maxHeight: `calc(100dvh - ${GAP * 2}px)`,
                    visibility: pos ? "visible" : "hidden",
                }}
                className={`fixed z-100 overflow-y-auto rounded-lg bg-(--bg-modal) py-2 px-3 shadow-2xl flex flex-col gap-1 ${className}`}
            >
                <div className="flex items-center justify-between text-center">
                    <div className="p-2"></div>
                    <h3 className="text-sm font-semibold text-(--text-mute)">{title}</h3>
                    <Button
                    variant="ghost_small"
                    onClick={onClose}
                    >
                        <X size={16} />
                    </Button>
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
                    <div className="flex flex-col gap-2 items-center w-full">
                        {compOptions}
                    </div>
                )}

            </div>
        </>,
        document.body
    );
}

export default OptionsModal;