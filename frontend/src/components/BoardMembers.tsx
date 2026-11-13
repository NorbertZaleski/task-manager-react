import type { BoardMember } from "../types/types";
import Avatar from "./Avatar";

type BoardMembersProps = {
    members: BoardMember[];
    max?: number;
};

function BoardMembers({ members = [], max = 4 }: BoardMembersProps) {
    const visible = members.slice(0, max);
    const hidden = members.length - visible.length;

    return (
        <div className="flex items-center -space-x-1">
            {visible.map((member) => (
                <span key={member.id} title={member.name} className="flex">
                    <Avatar user={member} className="border border-(--border-avatar)" />
                </span>
            ))}

            {hidden > 0 && (
                <div
                    title={members
                        .slice(max)
                        .map((m) => m.name)
                        .join(", ")}
                    className="-ml-0.5 size-7 rounded-full flex items-center justify-center text-xs font-medium 
                    text-(--text-mute) hover:text-white bg-white/10 hover:bg-white/15 ease-in"
                >
                    +{hidden}
                </div>
            )}
        </div>
    );
}

export default BoardMembers;