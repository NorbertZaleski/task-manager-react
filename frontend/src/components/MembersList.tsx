import { ChevronDown } from "lucide-react";
import type { BoardMember } from "../types/types";
import Avatar from "./Avatar";
import Button from "./Button";

type MembersListProps = {
    members: BoardMember[];
}

function MembersList({members}: MembersListProps) {
    return (
        <>
            <div className="flex flex-col text-left">
                <div className="flex gap-2 items-center pb-2 border-b border-(--border-mute)">
                    <h3 className="text-center text-sm">Board members</h3> 
                    <span className="bg-(--border-btn-simple) px-1 rounded-sm text-sm">{members.length}</span>
                </div>
                <div className="pt-4">
                    {members.map((member)=> (
                        <div key={member.id} className="flex items-center gap-4 text-left">
                            <Avatar user={member} />
                            <div className="flex flex-col">
                                <span className="font-medium h-fit">{member.name}</span>
                                <div className="flex gap-1">
                                    <span className="text-sm">@nickname</span>
                                    <span className="text-sm">{member.role}</span>
                                </div>
                            </div>
                            <div>
                                <Button 
                                variant="list"
                                iconr={<ChevronDown size={16} className="-mr-1" />}
                                >
                                    {member.role}
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            </div>
        </>
    )
}

export default MembersList;