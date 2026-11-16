import { useRef, useState } from "react";
import { Clock, Square, SquareCheck, UserRoundPlus, X } from "lucide-react";
import type { Checklist, ChecklistItem, User } from "../types/types";
import EditableText from "./EditableText";
import Button from "./Button";
import Avatar from "./Avatar";
import OptionsModal from "./OptionsModal";
import DueDateForm from "./DueDateForm";
import { dueClassBase, dueStatusClass, formatDueDate, getDueStatus, type DueStatus } from "../utils/dueDate";
import SearchBoxMembersSmall from "./SearchBoxMembersSmall";

type Props = {
    checklist: Checklist;
    members: User[];
    onChange: (next: Checklist) => void;
    onDelete: () => void;
};

type Draft = { text: string; assignees: string[]; dueDate: string | null };
type Picker = { target: string; kind: "assign" | "due" } | null;

const emptyDraft: Draft = { text: "", assignees: [], dueDate: null };

function ChecklistBlock({ checklist, members=[], onChange }: Props) {
    const [adding, setAdding] = useState(false);
    const [draft, setDraft] = useState<Draft>(emptyDraft);
    const [picker, setPicker] = useState<Picker>(null);
    const anchorRef = useRef<HTMLButtonElement | null>(null);

    const items = checklist.items ?? [];
    const doneCount = items.filter((i) => i.done).length;
    const percent = items.length ? Math.round((doneCount / items.length) * 100) : 0;

    const updateItem = (id: string, patch: Partial<ChecklistItem>) =>
        onChange({ ...checklist, items: items.map((i) => (i.id === id ? { ...i, ...patch } : i)) });

    const removeItem = (id: string) =>
        onChange({ ...checklist, items: items.filter((i) => i.id !== id) });

    const addItem = () => {
        const text = draft.text.trim();
        if (!text) return;
        onChange({
            ...checklist,
            items: [
                ...items,
                { id: crypto.randomUUID(), text, done: false, assignees: draft.assignees, dueDate: draft.dueDate },
            ],
        });
        setDraft(emptyDraft);
    };

    const cancelAdd = () => {
        setDraft(emptyDraft);
        setAdding(false);
    };

    const openPicker = (e: React.MouseEvent<HTMLButtonElement>, target: string, kind: "assign" | "due") => {
        anchorRef.current = e.currentTarget;
        setPicker({ target, kind });
    };

    const currentAssignees = (target: string) =>
        target === "new" ? draft.assignees : items.find((i) => i.id === target)?.assignees ?? [];

    const toggleAssignee = (target: string, userId: string) => {
        const cur = currentAssignees(target);
        const next = cur.includes(userId) ? cur.filter((id) => id !== userId) : [...cur, userId];
        if (target === "new") setDraft((d) => ({ ...d, assignees: next }));
        else updateItem(target, { assignees: next });
    };

    const setDue = (target: string, dueDate: string | null) => {
        if (target === "new") setDraft((d) => ({ ...d, dueDate }));
        else updateItem(target, { dueDate });
        setPicker(null);
    };

    const nameOf = (id: string) => members.find((m) => m.id === id)?.name ?? "Unknown";

    const AssigneeStack = ({ ids }: { ids: string[] }) => (
        <span className="flex -space-x-1">
            {ids.map((id) => {
                const m = members.find((u) => u.id === id);
                return m ? <Avatar key={id} user={m} className="size-6! text-xs" /> : null;
            })}
        </span>
    );

    const MAX_VISIBLE = 3;

    return (
        <div className="flex flex-col gap-2">

            <div className="flex items-center gap-3">
                <span className="w-8 text-[11px] text-(--text-mute)">{percent}%</span>
                <div className="h-1.5 flex-1 rounded-full bg-white/10 overflow-hidden">
                    <div
                        className={`h-full rounded-full transition-all ${percent === 100 ? "bg-green-400" : "bg-(--button)"}`}
                        style={{ width: `${percent}%` }}
                    />
                </div>
            </div>

            <ul className="flex flex-col">
                {items.map((item) => {
                    const status: DueStatus = item.dueDate ? getDueStatus(item.dueDate, item.done) : "normal";
                    const hasMeta = !!item.dueDate || item.assignees.length > 0;
                    const reveal = hasMeta
                        ? "opacity-100"
                        : "opacity-0 group-hover:opacity-100 focus-visible:opacity-100";
                    return (
                        <li key={item.id} className="group flex items-start gap-2 py-1">
                            <button
                                type="button"
                                onClick={() => updateItem(item.id, { done: !item.done })}
                                aria-pressed={item.done}
                                aria-label={item.done ? "Mark as incomplete" : "Mark as complete"}
                                className="mt-1.5 shrink-0 cursor-pointer text-(--text-mute) hover:text-white"
                            >
                                {item.done ? <SquareCheck size={18} className="text-green-400" /> : <Square size={18} />}
                            </button>

                            <div className="flex-1 min-w-0">
                                <EditableText
                                    value={item.text}
                                    maxLength={500}
                                    multiline
                                    onCommit={(text) => updateItem(item.id, { text })}
                                    className="w-full px-2 py-1 text-sm rounded-xs"
                                    viewClassName={`outline-1 outline-transparent cursor-text ${
                                        item.done ? "line-through text-(--text-mute)" : ""
                                    }`}
                                    editClassName="outline-1 outline-(--border-active-textarea)"
                                />
                            </div>

                            <div className="flex items-center gap-1 shrink-0 pt-0.5">
                                {item.dueDate && (
                                    <button
                                        type="button"
                                        onClick={(e) => openPicker(e, item.id, "due")}
                                        className="flex items-center gap-1.5 rounded px-1.5 py-1 text-xs cursor-pointer bg-white/10 hover:bg-white/15 text-(--text-mute)"
                                    >
                                        <Clock size={12} className="-mr-0.5"/> {formatDueDate(item.dueDate)}
                                        {status === "completed" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Completed</span>}
                                        {status === "soon" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Due soon</span>}
                                        {status === "overdue" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Overdue</span>}
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={(e) => openPicker(e, item.id, "assign")}
                                    aria-label="Assign"
                                    className={`flex h-6 items-center cursor-pointer rounded px-1 text-(--text-mute) ${reveal}`}
                                >
                                    {item.assignees.length ? (
                                        <div className="flex items-center">
                                            <AssigneeStack ids={item.assignees.slice(0, MAX_VISIBLE)} />
                                            {item.assignees.length > MAX_VISIBLE && (
                                                <span
                                                    title={item.assignees.slice(MAX_VISIBLE).map(nameOf).join(", ")}
                                                    className="relative z-10 -ml-1 flex size-6 items-center justify-center rounded-full
                                                     hover:bg-white/10 ease-in duration-100 text-[10px] font-semibold"
                                                >
                                                    +{item.assignees.length - MAX_VISIBLE}
                                                </span>
                                            )}
                                        </div>
                                    ) : (
                                        <UserRoundPlus size={16} />
                                    )}
                                </button>

                                {!item.dueDate && (
                                    <button
                                        type="button"
                                        onClick={(e) => openPicker(e, item.id, "due")}
                                        aria-label="Due date"
                                        className={`cursor-pointer rounded p-1 text-(--text-mute) hover:text-white ${reveal}`}
                                    >
                                        <Clock size={16} />
                                    </button>
                                )}

                                <button
                                    type="button"
                                    onClick={() => removeItem(item.id)}
                                    aria-label="Delete element"
                                    className={`cursor-pointer rounded p-1 text-(--text-mute) hover:bg-white/10 hover:text-white ${reveal}`}
                                >
                                    <X size={16} />
                                </button>
                            </div>
                        </li>
                    );
                })}
            </ul>

            {adding ? (
                <div className="flex flex-col gap-2">
                    <textarea
                        autoFocus
                        rows={2}
                        maxLength={500}
                        value={draft.text}
                        placeholder="Add element..."
                        onChange={(e) => setDraft((d) => ({ ...d, text: e.target.value }))}
                        onKeyDown={(e) => {
                            e.stopPropagation();
                            if (e.key === "Enter" && !e.shiftKey) {
                                e.preventDefault();
                                addItem();
                            }
                            if (e.key === "Escape") cancelAdd();
                        }}
                        className="w-full resize-none rounded-md px-3 py-2 text-sm bg-input outline-1 outline-(--border-active-textarea)"
                    />

                    <div className="flex items-center justify-between gap-2">
                        <div className="flex gap-1">
                            <Button variant="primary" onClick={addItem}>Add</Button>
                            <Button variant="ghost" onClick={cancelAdd}>Cancel</Button>
                        </div>
                        <div className="flex gap-1">
                            <Button
                                variant="ghost"
                                iconl={<UserRoundPlus size={16} />}
                                onClick={(e) => openPicker(e as React.MouseEvent<HTMLButtonElement>, "new", "assign")}
                            >
                                {draft.assignees.length ? `Assign (${draft.assignees.length})` : "Assign"}
                            </Button>
                            <Button
                                variant="ghost"
                                iconl={<Clock size={16} />}
                                onClick={(e) => openPicker(e as React.MouseEvent<HTMLButtonElement>, "new", "due")}
                            >
                                {draft.dueDate ? formatDueDate(draft.dueDate) : "Due date"}
                            </Button>
                        </div>
                    </div>
                </div>
            ) : (
                <div>
                    <Button variant="outline" onClick={() => setAdding(true)}>Add element...</Button>
                </div>
            )}

            {picker?.kind === "assign" && (
                <OptionsModal
                    title="Assign"
                    onClose={() => setPicker(null)}
                    anchorRef={anchorRef as React.RefObject<HTMLButtonElement>}
                    options={[]}
                    width={304}
                    compOptions={
                        <SearchBoxMembersSmall
                            members={members}
                            selectedIds={currentAssignees(picker.target)}
                            onToggle={(id) => toggleAssignee(picker.target, id)}
                        />
                    }
                />
            )}

            {picker?.kind === "due" && (
                <OptionsModal
                    title="Due date"
                    onClose={() => setPicker(null)}
                    anchorRef={anchorRef as React.RefObject<HTMLButtonElement>}
                    options={[]}
                    width={304}
                    compOptions={
                        <DueDateForm
                            value={
                                picker.target === "new"
                                    ? draft.dueDate
                                    : items.find((i) => i.id === picker.target)?.dueDate ?? null
                            }
                            onSave={(d) => setDue(picker.target, d)}
                        />
                    }
                />
            )}
        </div>
    );
}

export default ChecklistBlock;