import { useRef, useState } from "react";
import type { BoardMember } from "../types/types";
import Avatar from "./Avatar";
import OptionsModal from "./OptionsModal";
import Input from "./Input";

type BoardMembersProps = {
    members: BoardMember[];
    max?: number;
};

const SECTIONS: { title: string; match: (m: BoardMember) => boolean }[] = [
    { title: "Members", match: (m) => m.role !== "guest" },
    { title: "Guests", match: (m) => m.role === "guest" },
];

function MembersPanel({ members }: { members: BoardMember[] }) {
    const [query, setQuery] = useState("");
    const q = query.trim().toLowerCase();

    const filtered = q
        ? members.filter(
              (m) =>
                  m.name.toLowerCase().includes(q) ||
                  (m.email ?? "").toLowerCase().includes(q)
          )
        : members;

    return (
        <div className="flex w-full flex-col gap-3">
            <Input
                autoFocus
                placeholder="Search members"
                value={query}
                onChange={(e) => setQuery(e.target.value)}
                onKeyDown={(e) => {
                    if (e.key === "Escape") e.stopPropagation();
                }}
                className="bg-input rounded-sm mt-2"
            />

            {SECTIONS.map(({ title, match }) => {
                const group = filtered.filter(match);
                if (!group.length) return null;
                return (
                    <section key={title} className="flex flex-col gap-2">
                        <h4 className="text-xs font-semibold text-(--text-mute)">{title}</h4>
                        <div className="flex flex-wrap gap-1.5 max-w-10/12">
                            {group.map((m) => (
                                <span key={m.id} title={m.name} className="flex">
                                    <Avatar user={m} />
                                </span>
                            ))}
                        </div>
                    </section>
                );
            })}

            {filtered.length === 0 && (
                <p className="text-sm text-(--text-mute)">No members found</p>
            )}
        </div>
    );
}

function BoardMembers({ members = [], max = 4 }: BoardMembersProps) {
    const visible = members.slice(0, max);
    const hidden = members.length - visible.length;
    const [isMembersPanelOpen, setIsMembersPanelOpen] = useState(false);
    const boardMembersRef = useRef<HTMLDivElement>(null);

    return (
        <div ref={boardMembersRef} className="flex items-center -space-x-1">
            {visible.map((member) => (
                <span key={member.id} title={member.name} className="flex" onClick={() => setIsMembersPanelOpen(true)}>
                    <Avatar
                        user={member}
                        className="border border-(--border-avatar) cursor-pointer bg-black/5"
                    />
                </span>
            ))}

            {hidden > 0 && (
                <div
                    title={members.slice(max).map((m) => m.name).join(", ")}
                    onClick={() => setIsMembersPanelOpen(true)}
                    className="size-7 rounded-full flex items-center justify-center text-xs font-medium cursor-pointer
                    hover:bg-white/10 ease-in duration-100"
                >
                    +{hidden}
                </div>
            )}

            {isMembersPanelOpen && (
                <OptionsModal
                    title="Board members"
                    onClose={() => setIsMembersPanelOpen(false)}
                    anchorRef={boardMembersRef}
                    width={304}
                    compOptions={<MembersPanel members={members} />}
                />
            )}
        </div>
    );
}

export default BoardMembers;