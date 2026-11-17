import { useState } from "react";
import { Check } from "lucide-react";
import Input from "./Input";
import Avatar from "./Avatar";
import type { User } from "../types/types";

type SearchBoxMembersSmallProps = {
    members: User[];
    selectedIds?: string[];
    onToggle?: (memberId: string) => void;
};

function SearchBoxMembersSmall({ members, selectedIds = [], onToggle }: SearchBoxMembersSmallProps) {
    const [memberQuery, setMemberQuery] = useState("");
    const selectable = !!onToggle;

    const q = memberQuery.trim().toLowerCase();
    const filteredMembers = q
        ? members.filter(
              (m) =>
                  m.name.toLowerCase().includes(q) ||
                  (m.email ?? "").toLowerCase().includes(q)
          )
        : members;

    const rowClass = "flex w-full items-center gap-2 rounded-sm px-2 py-1.5 text-sm";

    return (
        <div className="flex w-full flex-col gap-2">
            <Input
                autoFocus
                placeholder="Search members"
                value={memberQuery}
                onChange={(e) => setMemberQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") e.stopPropagation();
                }}
                className="bg-input rounded-sm my-2"
            />

            <ul className="flex w-full max-h-60 flex-col gap-1 overflow-y-auto
            scrollbar-gutter-stable scrollbar-thin scroll-smooth scrollbar-thumb-gray-700 scrollbar-track-transparent">
                {filteredMembers.map((m) => {
                    const selected = selectedIds.includes(m.id);
                    const content = (
                        <>
                            <Avatar user={m} />
                            <span className="min-w-0 flex-1 truncate text-left">{m.name}</span>
                            {selectable && selected && <Check size={16} className="shrink-0" />}
                        </>
                    );

                    return (
                        <li key={m.id} className="w-full">
                            {selectable ? (
                                <button
                                    type="button"
                                    onClick={() => onToggle(m.id)}
                                    className={`${rowClass} cursor-pointer hover:bg-white/5 ${selected ? "bg-white/5" : ""}`}
                                >
                                    {content}
                                </button>
                            ) : (
                                <div className={rowClass}>{content}</div>
                            )}
                        </li>
                    );
                })}

                {filteredMembers.length === 0 && (
                    <li className="px-2 py-1.5 text-sm text-(--text-mute)">No members found</li>
                )}
            </ul>
        </div>
    );
}

export default SearchBoxMembersSmall;