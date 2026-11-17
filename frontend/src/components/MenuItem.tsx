import type { ReactNode } from "react";

type MenuItemProps = {
    label: string;
    onClick: () => void;
    icon?: ReactNode;
    trailing?: ReactNode;
};

export function MenuItem({ label, onClick, icon, trailing }: MenuItemProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="flex w-full items-center justify-between rounded-sm px-2 py-2 text-left text-sm hover:bg-(--hover-white)"
        >
            <span className="flex items-center gap-3">
                {icon}
                {label}
            </span>
            {trailing}
        </button>
    );
}

export const MenuDivider = () => <div className="my-2 h-px w-full bg-white/10" />;

export const MenuSectionLabel = ({ children }: { children: string }) => (
    <p className="px-2 pt-1 pb-2 text-[11px] font-semibold uppercase text-(--text-mute)">{children}</p>
);