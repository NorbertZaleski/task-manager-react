import { useRef, useState } from "react";
import { X } from "lucide-react";
import type { User } from "../types/types";
import useUserSearch from "../hooks/useUserSearch";
import MembersModal from "./MembersModal";

type SearchBoxMembersProps = {
    selected: User[];
    excludeIds?: string[];
    onSelect: (user: User) => void;
    onRemove: (userId: string) => void;
};

function SearchBoxMembers({ selected, excludeIds = [], onSelect, onRemove }: SearchBoxMembersProps) {
    const [inputValue, setInputValue] = useState("");
    const { results } = useUserSearch(inputValue);
    const [isModalOpen, setIsModalOpen] = useState(false);
    const inputRef = useRef<HTMLInputElement>(null);

    const filteredResults = results.filter(
        (u) => !excludeIds.includes(u.id) && !selected.some((s) => s.id === u.id)
    );

    const handleSelect = (user: User) => {
        onSelect(user);
        setInputValue("");
        setIsModalOpen(false);
        inputRef.current?.focus();
    };

    return (
        <div className="flex w-full flex-col">
            <div
                onClick={() => inputRef.current?.focus()}
                className="flex min-h-8 w-full cursor-text flex-wrap items-center gap-1 rounded-sm bg-input px-2 py-1 outline-1 outline-(--border-mute) focus-within:outline-(--border-active-textarea)"
            >
                {selected.map((user) => (
                    <div
                        key={user.id}
                        className="flex max-w-full items-center gap-1 rounded-xs bg-white/10 py-0.5 pl-2 pr-1 text-sm"
                    >
                        <span className="truncate">{user.name}</span>
                        <button
                            type="button"
                            onClick={(e) => {
                                e.stopPropagation();
                                onRemove(user.id);
                            }}
                            aria-label={`Remove ${user.name}`}
                            className="flex shrink-0 cursor-pointer items-center rounded-xs p-0.5 text-(--text-mute) hover:bg-white/10 hover:text-white"
                        >
                            <X size={14} />
                        </button>
                    </div>
                ))}

                <input
                    ref={inputRef}
                    value={inputValue}
                    placeholder={selected.length ? "" : "E-mail or username"}
                    onChange={(e) => {
                        setInputValue(e.target.value);
                        setIsModalOpen(true);
                    }}
                    onKeyDown={(e) => {
                        if (e.key === "Backspace" && !inputValue && selected.length) {
                            onRemove(selected[selected.length - 1].id);
                        }
                    }}
                    className="min-w-24 flex-1 bg-transparent text-sm outline-none"
                />
            </div>

            {isModalOpen && (
                <MembersModal
                    onSelect={handleSelect}
                    onClose={() => setIsModalOpen(false)}
                    results={filteredResults}
                    anchorRef={inputRef}
                />
            )}
        </div>
    );
}

export default SearchBoxMembers;