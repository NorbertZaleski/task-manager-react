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
                <Avatar key={member.id} user={member}/>
            ))}

            {hidden > 0 && (
                <div
                    title={members
                        .slice(max)
                        .map((m) => m.name)
                        .join(", ")}
                    className="size-7 rounded-full flex items-center justify-center text-xs font-medium text-(--text-mute) hover:bg-white/15"
                >
                    +{hidden}
                </div>
            )}
        </div>
    );
}

export default BoardMembers;