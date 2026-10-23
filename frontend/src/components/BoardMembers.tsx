import type { BoardMember } from "../types/types";

type BoardMembersProps = {
    members: BoardMember[];
    max?: number;
};

const getInitials = (name: string) =>
    name
        .trim()
        .split(/\s+/)
        .slice(0, 2)
        .map((part) => part[0]?.toUpperCase() ?? "")
        .join("");

function BoardMembers({ members = [], max = 4 }: BoardMembersProps) {
    const visible = members.slice(0, max);
    const hidden = members.length - visible.length;

    return (
        <div className="flex items-center -space-x-2">
            {visible.map((member) => (
                <div
                    key={member.id}
                    title={member.name}
                    className="size-7 rounded-full ring-2 ring-(--border-avatar) bg-amber-600 overflow-hidden flex items-center justify-center text-xs font-medium text-(--text)"
                >
                    {member.avatar ? (
                        <img
                            src={member.avatar}
                            alt={member.name}
                            className="size-full object-cover"
                        />
                    ) : (
                        getInitials(member.name)
                    )}
                </div>
            ))}

            {hidden > 0 && (
                <div
                    title={members
                        .slice(max)
                        .map((m) => m.name)
                        .join(", ")}
                    className="size-7 rounded-full ring-2 ring-(--border-avatar) flex items-center justify-center bg-(--card) text-xs font-medium text-(--text-mute)"
                >
                    +{hidden}
                </div>
            )}
        </div>
    );
}

export default BoardMembers;