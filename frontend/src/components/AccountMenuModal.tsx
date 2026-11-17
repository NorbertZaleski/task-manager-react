import { ChevronRight, Contrast, ExternalLink, Users } from "lucide-react";
import { useLayoutEffect, useRef, useState, type RefObject } from "react";
import { createPortal } from "react-dom";
import { useAuth } from "../context/AuthContext";
import Avatar from "./Avatar";
import { MenuDivider, MenuItem, MenuSectionLabel } from "./MenuItem";
import { useNavigate } from "react-router";

export type AccountMenuActions = {
    switchAccount?: () => void;
    manageAccount?: () => void;
    profile?: () => void;
    activity?: () => void;
    cards?: () => void;
    settings?: () => void;
    aiSettings?: () => void;
    labs?: () => void;
    theme?: () => void;
    createWorkspace?: () => void;
    help?: () => void;
    shortcuts?: () => void;
    logout?: () => void;
};

type AccountMenuModalProps = {
    anchorRef: RefObject<HTMLElement | null>;
    onClose: () => void;
    actions: AccountMenuActions;
    width?: number;
};

const GAP = 8;

function AccountMenuModal({ anchorRef, onClose, width = 304 }: AccountMenuModalProps) {
    const { user, logout } = useAuth();
    const popRef = useRef<HTMLDivElement>(null);
    const [pos, setPos] = useState<{ top: number; left: number } | null>(null);

    const navigate = useNavigate();

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

    const act = (fn: () => void) => () => {
        fn();
        onClose();
    };
    const todo = act(() => logout()); //chwilowo

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
                className="fixed z-100 overflow-y-auto rounded-lg bg-(--bg-modal-light) py-2 px-3 shadow-2xl flex flex-col"
            >
                <MenuSectionLabel>Account</MenuSectionLabel>
                {user && (
                    <div className="flex items-center gap-3 px-2 pb-2">
                        <Avatar user={user} className="size-10"/>
                        <div className="flex min-w-0 flex-col">
                            <span className="truncate text-sm font-semibold">{user.name}</span>
                            <span className="truncate text-xs text-(--text-mute)">{user.email}</span>
                        </div>
                    </div>
                )}
                <MenuItem
                    label="Manage account"
                    onClick={todo}
                    trailing={<ExternalLink size={14} className="text-(--text-mute)" />}
                />

                <MenuDivider />

                <MenuSectionLabel>App</MenuSectionLabel>
                <MenuItem label="Profile" onClick={act(()=> navigate(`/profile`))} />
                <MenuItem label="Activity" onClick={act(()=> navigate(`/activity`))} />
                <MenuItem label="Settings" onClick={act(()=> navigate(`/settings`))} />
                <MenuItem
                    label="Theme"
                    icon={<Contrast size={16} />}
                    trailing={<ChevronRight size={16} className="text-(--text-mute)" />}
                    onClick={todo}
                />

                <MenuDivider />

                <MenuItem label="Create a workspace" icon={<Users size={16} />} onClick={todo} />

                <MenuDivider />

                <MenuItem label="Shortcuts" onClick={todo} />

                <MenuDivider />

                <MenuItem label="Log out" onClick={act(() => logout())} />
            </div>
        </>,
        document.body
    );
}

export default AccountMenuModal;