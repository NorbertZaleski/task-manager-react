import { useLayoutEffect, useState, type RefObject } from "react";
import type { User } from "../types/types";
import { createPortal } from "react-dom";
import Avatar from "./Avatar";

type MembersModalProps = {
    onSelect: (user: User) => void;
    onClose: () => void;
    results: User[];
    anchorRef: RefObject<HTMLElement | null>;
}

const WIDTH = 240;
const GAP = 8;

function MembersModal({onSelect, onClose, results, anchorRef}: MembersModalProps) {
    const [pos, setPos] = useState({ top: 0, left: 0 });

    useLayoutEffect(() => {
        const rect = anchorRef.current?.getBoundingClientRect();
        if (!rect) return;

        const left = Math.min(rect.left, window.innerWidth - WIDTH - GAP);
        setPos({ top: rect.bottom + GAP, left: Math.max(GAP, left) });
    }, [anchorRef]);
    

    return createPortal (
        <>
            <div className="fixed inset-0 z-99" onClick={onClose} />

            <div
            style={{ top: pos.top, left: pos.left }}
            className="fixed z-100 w-[320px] max-h-75 h-fit rounded-lg shadow-2xl flex flex-col items-start bg-(--bg-modal-light)"
            >
                <ul className="flex flex-col text-left p-2 w-full bg-input">
                    {results.map((user)=> (
                        <li key={user.id}>
                            <button
                            type="button"
                            onClick={()=>onSelect(user)}
                            className="flex gap-3 max-h-15 w-full rounded-xs px-2 py-1 hover:bg-white/30 "
                            >
                                <div className="flex py-2 gap-2 items-center">
                                    <Avatar user={user} className="ring-(--border-avatar-shareboard)"/>
                                    <div className="flex flex-col text-left">
                                        <span className="text-sm font-medium">{user.name}</span>
                                        <span className="text-sm">{user.email}</span>
                                    </div>
                                </div>
                            </button>
                        </li>
                    ))}
                </ul>
            </div>
        </>,
        document.body
    );
}

export default MembersModal;