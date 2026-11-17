import { Building2, History, Lock, Users } from "lucide-react";
import { Link } from "react-router";
import Avatar from "../../components/Avatar";
import { useAuth } from "../../context/AuthContext";
import Button from "../../components/Button";

type ActivityEntry = {
    id: string;
    actor: string;
    date: string;
    boardId: string;
    boardTitle: string;
    boardPrivate?: boolean;
    action:
        | { type: "move"; card: string; from: string; to: string }
        | { type: "comment"; card: string; text: string }
        | { type: "delete"; card: string; list: string }
        | { type: "reopen"; item: string };
};

// TODO: dane z API
const WORKSPACES = [{ id: "ws-1", name: "My workspace", isCompany: true, isPrivate: true }];

const ACTIVITY: ActivityEntry[] = [
    {
        id: "1",
        actor: "John Doe",
        date: "Nov 16, 2026, 13:24",
        boardId: "b1",
        boardTitle: "Payments",
        action: { type: "move", card: "Payment 962.34 zł", from: "Cash", to: "Card" },
    },
    {
        id: "2",
        actor: "John Doe",
        date: "Nov 16, 2026, 13:24",
        boardId: "b1",
        boardTitle: "Payments",
        action: { type: "comment", card: "Payment 962.34 zł", text: "Paid by card" },
    },
];

const linkClass = "text-blue-400 underline hover:text-blue-300";

function SectionTitle({ icon, children }: { icon: React.ReactNode; children: string }) {
    return (
        <h2 className="flex items-center gap-3 text-base font-semibold">
            {icon}
            {children}
        </h2>
    );
}

function ActivityText({ entry }: { entry: ActivityEntry }) {
    const { action } = entry;
    const card = (name: string) => (
        <Link to={`/boards/${entry.boardId}`} className={linkClass}>
            {name}
        </Link>
    );

    switch (action.type) {
        case "move":
            return (
                <>
                    moved {card(action.card)} from {action.from} to {action.to}
                </>
            );
        case "comment":
            return <>commented on {card(action.card)}</>;
        case "delete":
            return (
                <>
                    deleted card {action.card} from {action.list}
                </>
            );
        case "reopen":
            return <>marked {card(action.item)} as incomplete</>;
    }
}

function ActivityItem({ entry, user }: { entry: ActivityEntry; user: ReturnType<typeof useAuth>["user"] }) {
    return (
        <li className="flex gap-3">
            <Avatar user={user} className="mt-0.5 shrink-0" />
            <div className="min-w-0 flex-1 text-sm">
                <p className="leading-relaxed">
                    <strong>{entry.actor}</strong> <ActivityText entry={entry} />
                </p>

                {entry.action.type === "comment" && (
                    <p className="mt-1 rounded-md bg-white/5 px-3 py-2">{entry.action.text}</p>
                )}

                <p className="mt-0.5 flex flex-wrap items-center gap-1 text-xs text-(--text-mute)">
                    <span className="underline">{entry.date}</span>
                    <span>• on board</span>
                    <Link to={`/boards/${entry.boardId}`} className={`${linkClass} font-semibold`}>
                        {entry.boardTitle}
                    </Link>
                    {entry.boardPrivate && <Lock size={12} className="text-red-400" />}
                </p>
            </div>
        </li>
    );
}

function ActivityPage() {
    const { user } = useAuth();

    return (
        <div className="mx-auto w-full max-w-215">
            <h1 className="text-2xl font-semibold">Activity</h1>

            <section className="mt-6">
                <SectionTitle icon={<Users size={18} />}>Workspaces</SectionTitle>
                <ul className="mt-4 ml-9 border-b border-white/10 pb-3">
                    {WORKSPACES.map((ws) => (
                        <li key={ws.id} className="flex items-center gap-2 text-sm">
                            {ws.name}
                            {ws.isCompany && <Building2 size={14} className="text-(--text-mute)" />}
                            {ws.isPrivate && <Lock size={14} className="text-red-400" />}
                        </li>
                    ))}
                </ul>
            </section>

            <section className="mt-8">
                <SectionTitle icon={<History size={18} />}>Activity</SectionTitle>
                <ul className="mt-4 ml-9 flex flex-col gap-5">
                    {ACTIVITY.map((entry) => (
                        <ActivityItem key={entry.id} entry={entry} user={user} />
                    ))}
                </ul>

                <div className="mt-5 ml-9">
                    <Button
                    variant="outline"
                    onClick={() => console.log("load more")}>
                        Load more activity
                    </Button>
                </div>
            </section>
        </div>
    );
}

export default ActivityPage;