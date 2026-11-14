import { Check, ChevronDown, Link2, X } from "lucide-react";
import Button from "./Button";
import MembersList from "./MembersList";
import type { AssignableRole, Board, User } from "../types/types";
import SearchBoxMembers from "./SearchBoxMembers";
import { useRef, useState } from "react";
import { useAuth } from "../context/AuthContext";
import OptionsModal from "./OptionsModal";

type ShareBoardModalProps = {
    board: Board;
    onClose: () => void;
    addMember: (userId: string, role: AssignableRole) => Promise<void>;
    updateMemberRole: (userId: string, role: AssignableRole) => Promise<void>;
    removeMember: (userId: string) => Promise<void>;
}

const ROLE_OPTIONS: { value: AssignableRole; label: string }[] = [
    { value: "admin", label: "Admin" },
    { value: "member", label: "Member" },
];

function ShareBoardModal({board, onClose, addMember, removeMember, updateMemberRole}: ShareBoardModalProps) {
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);
    const [selectedUsers, setSelectedUsers] = useState<User[]>([]);
    const {user} = useAuth();
    const [inviteRole, setInviteRole] = useState<AssignableRole>("member");
    const [isRoleOpen, setIsRoleOpen] = useState(false);
    const roleBtnRef = useRef<HTMLButtonElement | null>(null);


    const handleInvite = async () => {
        if (!selectedUsers.length) return;
        setSubmitting(true);
        setError(null);

        const failed: User[] = [];
        for (const selected of selectedUsers) {
            try {
                await addMember(selected.id, inviteRole);
            } catch {
                failed.push(selected);
            }
        }

        setSelectedUsers(failed);
        if (failed.length) {
            setError(`Could not add: ${failed.map((u) => u.name).join(", ")}`);
        }
        setSubmitting(false);
    };

    const handleChangeRole = async (userId: string, role: AssignableRole) => {
        try {
            setError(null);
            await updateMemberRole(userId, role);
        } catch (err: any) {
            setError(err?.message ?? "Could not change role");
        }
    };

    const handleRemove = async (userId: string) => {
        try {
            setError(null);
            await removeMember(userId);
        } catch (err: any) {
            setError(err?.message ?? "Could not remove member");
        }
    };

    const excludeIds = board.members.map((m) => m.id);
    const currentUserId = user?.id;

    return (
        <div className="fixed inset-0 z-98 bg-black/80"
                onMouseDown={(e) => {
            if (e.target === e.currentTarget) onClose();
        }}
        >
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99 w-146 max-w-[calc(100vw-32px)] min-h-0 max-h-[calc(100dvh-128px)] 
            bg-(--bg-modal) rounded-2xl overflow-y-auto py-4 px-6 flex flex-col gap-6">
                <div className="flex justify-between">
                    <h2 className="text-xl">Share board</h2>
                    <button
                    type="button"
                    onClick={()=> onClose()}
                    className="hover:text-(--text-mute)"
                    >
                        <X size={18}/>
                    </button>
                </div>

                <div className="flex w-full justify-between gap-2">

                <SearchBoxMembers
                    selected={selectedUsers}
                    excludeIds={excludeIds}
                    onSelect={(user) =>
                        setSelectedUsers((prev) => (prev.some((u) => u.id === user.id) ? prev : [...prev, user]))
                    }
                    onRemove={(id) => setSelectedUsers((prev) => prev.filter((u) => u.id !== id))}
                />

                    <div className="flex gap-2">

                        <Button
                            variant="list"
                            iconr={<ChevronDown size={16} className="-mr-1" />}
                            onClick={(e) => {
                                roleBtnRef.current = e.currentTarget as HTMLButtonElement;
                                setIsRoleOpen(true);
                            }}
                        >
                            {inviteRole === "admin" ? "Admin" : "Member"}
                        </Button>
                        
                        <Button
                            variant="primary"
                            onClick={handleInvite}
                            disabled={!selectedUsers.length || submitting}
                        >
                            Invite
                        </Button>

                    </div>
                </div>

                <div className="flex text-left gap-2 items-center">
                    <div className="bg-(--bg-icon) p-2 rounded-sm"><Link2 size={20} className="-rotate-45"/></div>
                    <div className="flex flex-col">
                        <p className="font-semibold">Invite to board via a link</p>
                        <p className="text-sm underline">Create link</p>
                    </div>
                </div>

                <div>
                    <MembersList
                        members={board.members}
                        currentUserId={currentUserId}
                        onChangeRole={handleChangeRole}
                        onRemove={handleRemove}
                    />
                </div>

                {isRoleOpen && (
                    <OptionsModal
                        title="Role"
                        onClose={() => setIsRoleOpen(false)}
                        anchorRef={roleBtnRef as React.RefObject<HTMLButtonElement>}
                        options={[]}
                        width={220}
                        compOptions={
                            <ul className="flex w-full flex-col gap-1 py-1">
                                {ROLE_OPTIONS.map((r) => (
                                    <li key={r.value}>
                                        <button
                                            type="button"
                                            onClick={() => {
                                                setInviteRole(r.value);
                                                setIsRoleOpen(false);
                                            }}
                                            className="flex w-full items-center justify-between rounded px-2 py-1.5 text-sm cursor-pointer hover:bg-white/5"
                                        >
                                            {r.label}
                                            {inviteRole === r.value && <Check size={16} />}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        }
                    />
                )}
            </div>
        </ div>
    )
}

export default ShareBoardModal;