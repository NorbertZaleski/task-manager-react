import {
    CircleUser,
    History,
    Settings,
    SquareKanban,
    Users,
    type LucideIcon,
} from "lucide-react";
import { NavLink } from "react-router";

type NavItem = { to: string; label: string; icon: LucideIcon };

const PERSONAL_NAV: NavItem[] = [
    { to: "/profile", label: "Profile and visibility", icon: CircleUser },
    { to: "/activity", label: "Activity", icon: History },
    { to: "/account-settings", label: "Settings", icon: Settings },
];

const WORKSPACE_NAV: NavItem[] = [
    { to: "/workspace/boards", label: "Boards", icon: SquareKanban },
    { to: "/workspace/members", label: "Members", icon: Users },
    { to: "/workspace/settings", label: "Settings", icon: Settings },
];

function SidebarLink({ to, label, icon: Icon }: NavItem) {
    return (
        <NavLink
            to={to}
            className={({ isActive }) =>
                `flex w-full items-center gap-3 rounded-md border px-2.5 py-2 text-sm font-semibold transition ${
                    isActive
                        ? "border-blue-500 bg-blue-500/10"
                        : "border-transparent hover:bg-(--hover-white)"
                }`
            }
        >
            <Icon size={16} />
            {label}
        </NavLink>
    );
}

function SettingsSidebar() {
    return (
        <aside className="flex w-72 shrink-0 flex-col justify-between overflow-y-auto border-r border-(--border-mute) px-6 py-8">
            <div>
                <h2 className="mb-3 text-sm font-semibold">Personal settings</h2>
                <nav className="flex flex-col gap-1">
                    {PERSONAL_NAV.map((item) => (
                        <SidebarLink key={item.to} {...item} />
                    ))}
                </nav>

                <div className="my-6 h-px w-full bg-white/10" />

                <h2 className="mb-3 text-sm font-semibold">Workspace</h2>
                <div className="mb-3 flex items-center gap-2 px-1 text-sm text-(--text-mute)">
                    <span className="flex size-6 items-center justify-center rounded-md bg-green-600 text-xs font-bold text-white">
                        W
                    </span>
                    My workspace
                </div>
                <nav className="flex flex-col gap-1">
                    {WORKSPACE_NAV.map((item) => (
                        <SidebarLink key={item.to} {...item} />
                    ))}
                </nav>
            </div>
        </aside>
    );
}

export default SettingsSidebar;