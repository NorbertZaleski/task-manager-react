import type { BoardMember } from "../types/types";
import Avatar from "./Avatar";

type MembersListProps = {
    members: BoardMember[];
}

function MembersList({members}: MembersListProps) {
    return (
        <>
            <div className="flex flex-col">
                <div className="flex">
                    <h3>List members</h3> 
                    <span>{members.length}</span>
                </div>
                {members.map((member)=> (
                    <div key={member.id} className="flex flex-col items-center gap-2">
                        <Avatar user={member}/>
                        <span className="font-medium">{member.name}</span>
                        <div className="flex flex-col gap-1">
                            <span className="text-sm">@nickname</span>
                            <span className="text-sm">{member.role}</span>
                        </div>
                    </div>
                ))}
            </div>
        </>
    )
}

export default MembersList;