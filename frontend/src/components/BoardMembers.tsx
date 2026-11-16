import { useRef, useState } from "react";
import type { BoardMember } from "../types/types";
import Avatar from "./Avatar";
import OptionsModal from "./OptionsModal";

type BoardMembersProps = {
    members: BoardMember[];
    max?: number;
};

function BoardMembers({ members = [], max = 4 }: BoardMembersProps) {
    const visible = members.slice(0, max);
    const hidden = members.length - visible.length;
    const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(false);
    const boardMembersRef = useRef<HTMLDivElement>(null);

    return (
        <div 
        ref={boardMembersRef}
        className="flex items-center -space-x-1"
        >
            {visible.map((member) => (
                <span key={member.id} title={member.name} className="flex" onClick={()=>setIsMembersPanelOpen(true)}>
                    <Avatar 
                    user={member}
                    className="border border-(--border-avatar) cursor-pointer bg-black/5" 
                    />
                </span>
            ))}

            {hidden > 0 && (
                <div
                    title={members
                        .slice(max)
                        .map((m) => m.name)
                        .join(", ")}
                    className="size-7 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer
                    hover:bg-white/10 ease-in duration-100"
                >
                    +{hidden}
                </div>
            )}

            {isMembersPanelOpen && (
                <OptionsModal 
                title="Board members"
                onClose={()=>setIsMembersPanelOpen(false)}
                anchorRef={boardMembersRef}
                compOptions={
                    <div className="flex gap-1 flex-wrap">
                        {members.map((m) => (
                            <div
                                key={m.id}
                                className="flex items-center gap-1"
                            >
                                <Avatar user={m} className="" />
                            </div>
                        ))}
                    </div>
                }
                />
            )}

        </div>
    );
}

export default BoardMembers;