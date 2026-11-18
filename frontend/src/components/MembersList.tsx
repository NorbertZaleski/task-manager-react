import { useRef, useState } from "react";
import { ChevronDown, Check } from "lucide-react";
import type { AssignableRole, BoardMember } from "../types/types";
import Avatar from "./Avatar";
import Button from "./Button";
import OptionsModal from "./OptionsModal";
import { ROLE_LABEL, ROLE_OPTIONS } from "../utils/roles";

type MembersListProps = {
    members: BoardMember[];
    currentUserId?: string;
    onChangeRole: (userId: string, role: AssignableRole) => Promise<void> | void;
    onRemove: (userId: string) => Promise<void> | void;
};

function MembersList({ members, currentUserId, onChangeRole, onRemove }: MembersListProps) {
    const [openFor, setOpenFor] = useState<string | null>(null);
    const anchorRef = useRef<HTMLButtonElement | null>(null);

    const currentRole = members.find((m) => m.id === currentUserId)?.role;
    const canManage = currentRole === "owner" || currentRole === "admin";

    const sortedMembers = [...members].sort((a, b) => {
        if (a.id === currentUserId) return -1;
        if (b.id === currentUserId) return 1;
        return 0;
    });

    return (
        <div className="flex flex-col text-left">
            <div className="flex gap-2 items-center pb-2 border-b border-(--border-mute)">
                <h3 className="text-center text-sm">Board members</h3>
                <span className="bg-(--border-btn-simple) px-1 rounded-sm text-sm">{members.length}</span>
            </div>

            <div className="pt-4">
                {sortedMembers.map((member) => {
                    const editable = canManage && member.role !== "owner";

                    return (
                        <div key={member.id} className="flex items-center gap-4 text-left">
                            <Avatar user={member} />
                            <div className="flex flex-col">
                                <span className="font-medium h-fit">
                                    {member.name}
                                    {member.id === currentUserId && (
                                        <span className="ml-1 text-sm text-(--text-mute)">(you)</span>
                                    )}
                                </span>
                                <span className="text-sm">@nickname</span>
                            </div>

                            <div className="ml-auto">
                                {editable ? (
                                    <Button
                                        variant="list"
                                        iconr={<ChevronDown size={16} className="-mr-1" />}
                                        onClick={(e) => {
                                            anchorRef.current = e.currentTarget as HTMLButtonElement;
                                            setOpenFor(member.id);
                                        }}
                                    >
                                        {ROLE_LABEL[member.role]}
                                    </Button>
                                ) : (
                                    <Button
                                        variant="list"
                                        iconr={<ChevronDown size={16} className="-mr-1" />}
                                        className="cursor-not-allowed!"
                                    >
                                        {ROLE_LABEL[member.role]}
                                    </Button>
                                )}
                            </div>
                        </div>
                    );
                })}
            </div>

            {openFor && (
                <OptionsModal
                    title="Role"
                    onClose={() => setOpenFor(null)}
                    anchorRef={anchorRef as React.RefObject<HTMLButtonElement>}
                    options={[]}
                    width={220}
                    compOptions={
                        <ul className="flex w-full flex-col gap-1 py-1">
                            {ROLE_OPTIONS.map((r) => {
                                const selected = members.find((m) => m.id === openFor)?.role === r.value;
                                return (
                                    <li key={r.value}>
                                        <button
                                            type="button"
                                            onClick={async () => {
                                                await onChangeRole(openFor, r.value);
                                                setOpenFor(null);
                                            }}
                                            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-white/5"
                                        >
                                            {r.label}
                                            {selected && <Check size={16} />}
                                        </button>
                                    </li>
                                );
                            })}

                            <li className="mt-1 border-t border-(--border-mute) pt-1">
                                <button
                                    type="button"
                                    onClick={async () => {
                                        await onRemove(openFor);
                                        setOpenFor(null);
                                    }}
                                    className="w-full rounded px-2 py-1.5 text-left text-sm text-red-400 cursor-pointer hover:bg-white/5"
                                >
                                    Remove from board
                                </button>
                            </li>
                        </ul>
                    }
                />
            )}
        </div>
    );
}

export default MembersList;