import { ChevronDown, ChevronUp, Circle, CircleCheck, Clock, Ellipsis, LucideTag, Paperclip, Plus, SquareCheck, TextAlignStart, UserRoundPlus, X } from "lucide-react";
import type { Label, Note } from "../types/types";
import { useEffect, useLayoutEffect, useRef, useState } from "react";
import EditableText from "./EditableText";
import Button from "./Button";
import OptionsModal from "./OptionsModal";
import notesService from "../services/notes.service";
import CreateLabelForm from "./CreateLabelForm";
import LabelsPicker from "./LabelsPicker";
import { LabelsService } from "../services/labels.service";
import { useLabels } from "../context/LabelsContext";
import { useParams } from "react-router";
import { getTextColor } from "../utils/getTextColor";
import LabelEditModal from "./LabelEditModal";
import DueDateForm from "./DueDateForm";
import { dueClassBase, dueStatusClass, formatDue, getDueStatus } from "../utils/dueDate";
import CommentsPanel from "./CommentsPanel";
import { useAuth } from "../context/AuthContext";
import { useNoteActivity } from "../hooks/useNoteActivity";
import RichTextEditor from "./RichTextEditor";

type NoteModalProps = {
    note: Note;
    columnTitle?: string;
    onClose: () => void;
    onSaveContent: (noteId: string, content: string) => void;
    onRenameNote: (noteId: string, title: string) => void;
    onDelete: (noteId: string) => void;
    onNoteUpdated?: (note: Note) => void;
} 

const NOTE_CONTENT_COLLAPSED_MAX = 440;

function NoteModal({note, columnTitle, onClose, onSaveContent, onRenameNote, onDelete, onNoteUpdated}: NoteModalProps){

    const { boardId } = useParams<{ boardId: string }>();
    const { user } = useAuth();
    const { labels, reloadLabels } = useLabels();
    const noteLabels = labels.filter((l) => note.labelIds?.includes(l.id));
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
        () => note.labelIds ?? []
    );
    const status = note.dueDate ? getDueStatus(note.dueDate, note.completed) : null;

    const [isEditingNoteContent, setIsEditingNoteContent] = useState(false);
    const [isNoteContentVisible, setIsNoteContentVisible] = useState(true);
    const [isNoteContentOverflowing, setIsNoteContentOverflowing] = useState(false);
    const [isNoteContentExpanded, setIsNoteContentExpanded] = useState(false);

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isDueOpen, setIsDueOpen] = useState(false);

    const [editingLabel, setEditingLabel] = useState<Label | null>(null);
    const [labelsModal, setLabelsModal] = useState<"closed" | "list" | "create" | "edit">("closed");
    
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    const labelsRef = useRef<HTMLButtonElement>(null);
    const labelsRefActive = useRef<HTMLElement>(null);
    const [labelsAnchor, setLabelsAnchor] = useState<"toolbar" | "badge">("toolbar");
    const labelsAnchorRef = labelsAnchor === "badge" && noteLabels.length > 0 ? labelsRefActive : labelsRef;

    const descRef = useRef<HTMLDivElement>(null);
    const dueRef = useRef<HTMLButtonElement>(null);
    const dueRefActive = useRef<HTMLButtonElement>(null);
    const [dueAnchor, setDueAnchor] = useState<"toolbar" | "badge">("toolbar");
    const dueAnchorRef = dueAnchor === "badge" ? dueRefActive : dueRef;

    const activity = useNoteActivity(boardId ?? "", note.id);
    const firstRun = useRef(true);
    async function handleToggleLabel(labelId: string) {
        if (!labelId) {
            console.error("Label without id", labelId);
            return;
        }
        const prev = selectedLabelIds;
        const next = prev.includes(labelId)
            ? prev.filter((id) => id !== labelId)
            : [...prev, labelId];

        setSelectedLabelIds(next);

        try {
            const updatedNote = await notesService.setLabels(note.id, next);
            onNoteUpdated?.(updatedNote);
        } catch (err) {
            console.error("Error:", err);
            setSelectedLabelIds(prev);
        }
    };

    async function handleCreateLabel (data: { title: string; color: string }) {
        if (!boardId) return;
        await LabelsService.createLabel(boardId, data);
        await reloadLabels();
        setLabelsModal("list");
    };

    async function handleEditLabel (data: {title: string; color: string}) {
        if (!boardId || !editingLabel) return;
        await LabelsService.updateLabel(boardId, editingLabel.id, data);
        await reloadLabels();
        setEditingLabel(null);
        setLabelsModal("list");
    };

    async function handleSaveDueDate(dueDate: string | null) {
        try {
            const updatedNote = await notesService.setDueDate(note.id, dueDate);
            onNoteUpdated?.(updatedNote);
            setIsDueOpen(false);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    async function handleToggleCompleted(next: boolean) {
        try {
            const updatedNote = await notesService.setCompleted(note.id, next);
            onNoteUpdated?.(updatedNote);
        } catch (err) {
            console.error("Error:", err);
        }
    };

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isEditingNoteContent) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, isEditingNoteContent]);

    useEffect(() => {
        if (firstRun.current) {
            firstRun.current = false;
            return;
        }
        activity.reload();
    }, [
        note.title,
        note.completed,
        note.dueDate,
        note.labelIds?.join(","),
    ]);

    useLayoutEffect(() => {
        const el = descRef.current;
        if (!el || isEditingNoteContent) return;

        const check = () =>
            setIsNoteContentOverflowing(el.scrollHeight > NOTE_CONTENT_COLLAPSED_MAX + 1);
        check();

        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, [note.content, isNoteContentVisible, isEditingNoteContent, isNoteContentExpanded]);

    return (
        <div className="fixed inset-0 z-98 bg-black/80 overflow-y-auto" 
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="relative mx-auto mt-13 mb-16 z-99 w-270 flex flex-col max-w-[calc(100vw-32px)] max-h-[calc(100dvh-128px)]
            bg-(--bg-modal) rounded-2xl overflow-hidden shadow-2xl"
            >
                <div className="flex items-center justify-between w-full shrink-0 h-14 min-w-md border-b border-(--border-mute) px-6 py-2">
                    <h3 className="text-sm font-semibold">{columnTitle}</h3>
                    <div className="flex gap-2">

                        <Button 
                        variant="ghost_small"
                        onClick={() => setIsOptionsOpen(true)}
                        ref={ellipsisRef}
                        >
                            <Ellipsis size={16} />
                        </Button>

                        <Button
                        variant="ghost_small"
                        onClick={onClose}
                        >
                            <X size={16}/>
                        </Button>

                        {isOptionsOpen && (
                            <OptionsModal 
                            title="Note actions"
                            onClose={() => setIsOptionsOpen(false)}
                            options={[
                                {id: "delete", label: "Delete note", onClick: () => onDelete(note.id)}
                            ]}
                            anchorRef={ellipsisRef}
                            />
                        )}
                    </div>
                </div>
                <div className="flex flex-col min-h-0 flex-1">
                    <div className="flex w-full min-h-0 flex-1">
                        <div className="flex flex-col text-left w-155 min-h-0 shrink-0 border-r border-(--border-mute) pl-5 pr-6 pb-4 
                        overflow-y-auto scrollbar-gutter-stable scrollbar-thin scroll-smooth scrollbar-thumb-gray-700 scrollbar-track-transparent">
                        
                            <div className="shrink-0 flex items-start gap-3">
                                <button
                                    type="button"
                                    onClick={()=>handleToggleCompleted(!note.completed)}
                                    aria-pressed={!!note.completed}
                                    aria-label={note.completed ? "Mark as not completed" : "Mark as completed"}
                                    className={`mt-6 flex shrink-0 h-10 cursor-pointer rounded-full transition-colors ${
                                        note.completed ? "text-green-400" : "text-(--text-mute) hover:text-white"
                                    }`}
                                >
                                    {note.completed ? <CircleCheck size={24} /> : <Circle size={24} />}
                                </button>

                                <div className="flex-1 min-w-0 mt-3">
                                    <EditableText
                                        value={note.title ?? ""}
                                        maxLength={400}
                                        onCommit={(title) => onRenameNote(note.id, title)}
                                        className="block w-full px-2 py-1 min-h-10 h-fit text-3xl font-bold rounded-xs leading-tight wrap-break-word"
                                        viewClassName={`outline-1 outline-transparent cursor-text
                                            ${note.completed ? "line-through text-(--text-mute)" : ""}
                                        `}
                                        editClassName="outline-1 outline-(--mute)"
                                    />
                                </div>
                            </div>
                        
                            {labelsModal === "list" && (
                                <OptionsModal
                                    title="Labels"
                                    onClose={() => setLabelsModal("closed")}
                                    anchorRef={labelsAnchorRef}
                                    width={304}
                                    compOptions={[
                                        <LabelsPicker 
                                        key="labels_picker" 
                                        labels={labels}
                                        selectedIds={selectedLabelIds}
                                        onToggle={handleToggleLabel}
                                        onEdit={(label)=> {
                                            setEditingLabel(label);
                                            setLabelsModal("edit");
                                        }}
                                        />,
                                        
                                        <Button 
                                        key="add_label_button" 
                                        onClick={() => setLabelsModal("create")}
                                        className="w-full"
                                        >
                                            Create new label
                                        </Button>
                                        ]
                                    }
                                />
                            )}

                            {labelsModal === "create" && (
                                <OptionsModal
                                    title="New label"
                                    onClose={() => setLabelsModal("closed")}
                                    anchorRef={labelsAnchorRef}
                                    options={[]}
                                    width={304}
                                    compOptions={
                                        <CreateLabelForm
                                            onSubmit={handleCreateLabel}
                                            onCancel={() => setLabelsModal("list")}
                                        />
                                    }
                                />
                            )}

                            {labelsModal === "edit" && (
                                <OptionsModal 
                                    title="Edit label"
                                    onClose={() => setLabelsModal("closed")}
                                    anchorRef={labelsAnchorRef}
                                    options={[]}
                                    width={304}
                                    compOptions={
                                        editingLabel && (
                                            <LabelEditModal
                                            label={editingLabel}
                                            onSubmit={handleEditLabel} 
                                            onCancel={()=> setLabelsModal("list")}
                                            />
                                        )
                                    }
                                />
                            )}

                            {isDueOpen && (
                                <OptionsModal
                                    title="Date"
                                    onClose={() => setIsDueOpen(false)}
                                    anchorRef={dueAnchorRef}
                                    options={[]}
                                    width={304}
                                    compOptions={
                                        <DueDateForm
                                            value={note.dueDate}
                                            onSave={handleSaveDueDate}
                                        />
                                    }
                                />
                            )}

                            <div className="relative flex flex-col">
                                <div
                                    className="flex flex-col gap-4"
                                >

                                    <div className="flex gap-2 py-2 ml-8">
                                        {!noteLabels?.length && (
                                            <Button 
                                                iconl={ <LucideTag size={16} className="-mr-0.5" />} 
                                                onClick={()=> { setDueAnchor("toolbar"); setLabelsModal("list"); }}
                                                ref={labelsRef}
                                            > 
                                                Labels 
                                            </Button>
                                        )}
                                        {!note.dueDate && (
                                            <Button 
                                                iconl={<Clock size={16} className="-mr-0.5" />}
                                                onClick={() => { setDueAnchor("toolbar"); setIsDueOpen(true); }}
                                                ref={dueRef}
                                            > 
                                                Date 
                                            </Button>
                                        )}
                                        <Button iconl={<SquareCheck size={16} className="-mr-0.5" />}> To do list </Button>
                                        <Button iconl={<UserRoundPlus size={16} className="-mr-0.5" />}> Members </Button>
                                        <Button iconl={<Paperclip size={16} className="-mr-0.5" />}> Files </Button>
                                    </div>
                                    <div className="flex h-14 gap-4">
                                        {noteLabels.length > 0 && (
                                            <div className="ml-8 flex flex-col gap-1 text-(--text-mute)">
                                                <label className="text-xs">Labels</label>
                                                <div className="flex flex-wrap gap-1 h-4">
                                                    {noteLabels.map((label, index) => (
                                                        <span
                                                            key={label.id}
                                                            ref={index === 0 ? labelsRefActive : undefined}
                                                            className={`text-s font-medium justify-start px-2 py-1 rounded flex items-center max-w-full 
                                                                cursor-pointer overflow-hidden select-none ${
                                                            label.title ? 'min-w-10' : 'min-w-6'
                                                            }`}
                                                            style={{ backgroundColor: label.color, color: getTextColor(label.color) }}
                                                            onClick={()=> { setLabelsAnchor("badge"); setLabelsModal("list"); }}

                                                        >
                                                            <span className="truncate min-w-0">{label.title}</span>
                                                        </span>
                                                    ))}
                                                    <Button
                                                        variant="outline_small"
                                                        onClick={() => { setLabelsAnchor("badge"); setLabelsModal("create"); }}
                                                        className="p-0 w-7 h-7 shrink-0 flex items-center justify-center rounded-md"
                                                    >
                                                        <Plus size={18} />
                                                    </Button>
                                                </div>
                                            </div>
                                        )}

                                        {note.dueDate && status && (
                                            <div className="flex flex-col gap-1 text-(--text-mute)">
                                                <label className="text-xs">Due date</label>
                                                <Button
                                                    variant="outline"
                                                    ref={dueRefActive}
                                                    onClick={() => { setDueAnchor("badge"); setIsDueOpen(true); }}
                                                    className={`flex items-center gap-1 rounded h-4 pl-2 pr-1.5 py-1 text-xs font-medium cursor-pointer select-none`}
                                                >
                                                    {formatDue(note.dueDate)}
                                                    {status === "completed" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Completed</span>}
                                                    {status === "soon" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Due soon</span>}
                                                    {status === "overdue" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Overdue</span>}
                                                    <ChevronDown size={16}/>
                                                </Button>
                                            </div>
                                        )}
                                    </div>
                                    
                                    <div className="flex flex-col">
                                        <div className="flex justify-between">                                
                                            <div className="flex gap-2 justify-center items-center mb-2">
                                                <button
                                                className="cursor-pointer"
                                                onClick={()=> {
                                                    if (isNoteContentVisible===true) setIsNoteContentVisible(false);
                                                    if (isNoteContentVisible===false) setIsNoteContentVisible(true);
                                                }}
                                                >
                                                    <TextAlignStart />
                                                </button>
                                                <p className="text-[14px] font-semibold">
                                                Description
                                                </p>
                                            </div>
                                        </div>

                                    {isNoteContentVisible && (
                                        <div className="ml-8">
                                            <div className="relative">
                                                <div
                                                    ref={descRef}
                                                    className={
                                                        isEditingNoteContent
                                                            ? ""
                                                            : isNoteContentExpanded
                                                                ? "max-h-[calc(100dvh-128px)] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-700 scrollbar-track-transparent"
                                                                : "max-h-110 overflow-hidden"
                                                    }
                                                >
                                                    <RichTextEditor
                                                        value={note.content ?? ""}
                                                        placeholder="Add content..."
                                                        onCommit={(content) => onSaveContent(note.id, content)}
                                                        onEditingChange={setIsEditingNoteContent}
                                                        className="w-full"
                                                        viewClassName="text-(--text-mute) px-3 py-2"
                                                    />
                                                </div>

                                                {!isEditingNoteContent && isNoteContentOverflowing && !isNoteContentExpanded && (
                                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-(--bg-modal) to-transparent" />
                                                )}
                                            </div>

                                        {!isEditingNoteContent && isNoteContentOverflowing && (
                                            <Button
                                                variant="outline"
                                                iconl={isNoteContentExpanded ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                                onClick={() => setIsNoteContentExpanded((v) => !v)}
                                                className="w-full"
                                            >
                                                {isNoteContentExpanded ? "Show less" : "Show more"}
                                            </Button>
                                        )}
                                        </div>
                                    )}
                                    </div>
                                </div>
                            </div>
                        </div>
                        <div className="flex flex-1 min-w-0 justify-items-start text-left p-6 bg-(--bg-notemodal-right) overflow-y-auto scrollbar-gutter-stable scrollbar-thin scroll-smooth scrollbar-thumb-gray-700 scrollbar-track-transparent">
                            {user && <CommentsPanel activity={activity} currentUserId={user.id} />}
                        </div>
                    </div>
                    

                </div>
            </div>
        </div>
    );
}

export default NoteModal;