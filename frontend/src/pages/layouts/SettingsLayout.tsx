import { X } from "lucide-react";
import { Link, Outlet } from "react-router";
import SettingsSidebar from "../../components/SettingsSidebar";

function SettingsLayout() {
    return (
        <div className="flex h-dvh overflow-hidden">
            <SettingsSidebar />

            <main className="relative min-h-0 flex-1 overflow-y-auto">
                <Link
                    to="/boards"
                    aria-label="Close"
                    className="absolute right-6 top-4 flex size-10 items-center justify-center rounded-full border border-(--border-mute) hover:bg-(--hover-white)"
                >
                    <X size={18} />
                </Link>

                <div className="mx-auto w-full max-w-132.5 px-4 py-16">
                    <Outlet />
                </div>
            </main>
        </div>
    );
}

export default SettingsLayout;