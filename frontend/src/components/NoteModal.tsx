import { ChevronDown, Circle, CircleCheck, Clock, Ellipsis, LucideTag, MessageSquareText, Paperclip, SquareCheck, TextAlignStart, UserRoundPlus, X } from "lucide-react";
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

type NoteModalProps = {
    note: Note;
    columnTitle?: string;
    onClose: () => void;
    onSaveContent: (noteId: string, content: string) => void;
    onRenameNote: (noteId: string, title: string) => void;
    onDelete: (noteId: string) => void;
    onNoteUpdated?: (note: Note) => void;
} 

function NoteModal({note, columnTitle, onClose, onSaveContent, onRenameNote, onDelete, onNoteUpdated}: NoteModalProps){

    const [isEditingNoteContent, setIsEditingNoteContent] = useState(false);
    const [isNoteContentVisible, setIsNoteContentVisible] = useState(true);
    const [isNoteContentOverflowing, setIsNoteContentOverflowing] = useState(false);
    
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const [isDueOpen, setIsDueOpen] = useState(false);

    const [editingLabel, setEditingLabel] = useState<Label | null>(null);
    const [labelsModal, setLabelsModal] = useState<"closed" | "list" | "create" | "edit">("closed");
    
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    const labelsRef = useRef<HTMLButtonElement>(null);
    const descRef = useRef<HTMLDivElement>(null);
    const dueRef = useRef<HTMLButtonElement>(null);
    const dueRefActive = useRef<HTMLButtonElement>(null);
    const [dueAnchor, setDueAnchor] = useState<"toolbar" | "badge">("toolbar");
    const dueAnchorRef = dueAnchor === "badge" ? dueRefActive : dueRef;

    const { boardId } = useParams<{ boardId: string }>();
    const { labels, reloadLabels } = useLabels();
    const noteLabels = labels.filter((l) => note.labelIds?.includes(l.id));
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
        () => note.labelIds ?? []
    );
    const status = note.dueDate ? getDueStatus(note.dueDate, note.completed) : null;

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

    useLayoutEffect(() => {
        const el = descRef.current;
        if (!el || isEditingNoteContent) return;

        const check = () =>
            setIsNoteContentOverflowing(el.scrollHeight > el.clientHeight + 1);
        check();

        const ro = new ResizeObserver(check);
        ro.observe(el);
        return () => ro.disconnect();
    }, [note.content, isNoteContentVisible, isEditingNoteContent]);

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
                                        viewClassName="outline-1 outline-transparent cursor-text"
                                        editClassName="outline-1 outline-(--mute)"
                                    />
                                </div>
                            </div>
                        
                            {labelsModal === "list" && (
                                <OptionsModal
                                    title="Labels"
                                    onClose={() => setLabelsModal("closed")}
                                    anchorRef={labelsRef}
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
                                    className="w-76"
                                />
                            )}

                            {labelsModal === "create" && (
                                <OptionsModal
                                    title="New label"
                                    onClose={() => setLabelsModal("closed")}
                                    anchorRef={labelsRef}
                                    options={[]}
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
                                    anchorRef={labelsRef}
                                    options={[]}
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
                                    compOptions={
                                        <DueDateForm
                                            value={note.dueDate}
                                            onSave={handleSaveDueDate}
                                        />
                                    }
                                />
                            )}

                            <div className={`relative flex flex-col ${
                                isEditingNoteContent ? "" : "flex-1 min-h-0"
                            }`}>
                                <div
                                    className="flex flex-col gap-4"
                                >

                                    <div className="flex gap-2 py-2 ml-8">
                                        <Button 
                                            iconl={ <LucideTag size={16} className="-mr-0.5" />} 
                                            onClick={()=>setLabelsModal("list")}
                                            ref={labelsRef}
                                        > 
                                            Labels 
                                        </Button>
                                        <Button 
                                            iconl={<Clock size={16} className="-mr-0.5" />}
                                            onClick={() => { setDueAnchor("toolbar"); setIsDueOpen(true); }}
                                            ref={dueRef}
                                        > 
                                            Date 
                                        </Button>
                                        <Button iconl={<SquareCheck size={16} className="-mr-0.5" />}> To do list </Button>
                                        <Button iconl={<UserRoundPlus size={16} className="-mr-0.5" />}> Members </Button>
                                        <Button iconl={<Paperclip size={16} className="-mr-0.5" />}> Files </Button>
                                    </div>

                                    {noteLabels.length > 0 && (
                                        <div className="flex flex-wrap gap-1 ml-8">
                                            {noteLabels.map((label) => (
                                                <span
                                                    key={label.id}
                                                    className={`text-xs font-medium justify-center p-2 h-4 rounded flex items-center max-w-full overflow-hidden select-none ${
                                                    !label.title ? 'min-w-10' : ''
                                                    }`}
                                                    style={{ backgroundColor: label.color, color: getTextColor(label.color) }}
                                                >
                                                    <span className="truncate min-w-0">{label.title}</span>
                                                </span>
                                            ))}
                                        </div>
                                    )}

                                    {note.dueDate && status && (
                                        <div className="ml-8 flex flex-col gap-1 text-(--text-mute)">
                                            <label className="text-xs">Due date</label>
                                            <Button
                                                variant="ghost"
                                                ref={dueRefActive}
                                                onClick={() => { setDueAnchor("badge"); setIsDueOpen(true); }}
                                                className={`flex items-center gap-1 rounded h-fit pl-2 pr-1.5 py-1 text-xs font-medium cursor-pointer select-none bg-(--mute)/10`}
                                            >
                                                {formatDue(note.dueDate)}
                                                {status === "completed" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Completed</span>}
                                                {status === "soon" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Due soon</span>}
                                                {status === "overdue" && <span className={`${dueClassBase} ${dueStatusClass[status]}`}>Overdue</span>}
                                                <ChevronDown size={16}/>
                                            </Button>
                                        </div>
                                    )}

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
                                                    className={isEditingNoteContent ? "" : "max-h-60 overflow-hidden"}
                                                >
                                                    <EditableText
                                                        value={note.content ?? ""}
                                                        maxLength={1000}
                                                        allowEmpty
                                                        multiline={true}
                                                        showActions
                                                        placeholder="Add content..."
                                                        onCommit={(content) => onSaveContent(note.id, content)}
                                                        onEditingChange={setIsEditingNoteContent}
                                                        className="w-full px-3 py-2 rounded-xs text-sm font-normal"
                                                        viewClassName="text-(--text-mute) cursor-pointer"
                                                        editClassName="outline-1 -outline-offset-1 outline-(--border-mute) min-h-40"
                                                    />
                                                </div>

                                                {!isEditingNoteContent && isNoteContentOverflowing && (
                                                    <div className="pointer-events-none absolute inset-x-0 bottom-0 h-16 bg-linear-to-t from-(--bg-modal) to-transparent" />
                                                )}
                                            </div>
                                        </div>
                                    )}
                                    </div>

                                </div>
                                    {isNoteContentOverflowing && !isEditingNoteContent && (
                                        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-20 bg-linear-to-t from-(--bg-modal) to-transparent" />
                                    )}
                            </div>

                        </div>
                        <div className="flex flex-1 min-w-0 justify-items-start text-left p-6 bg-(--bg-notemodal-right)">
                            <div className="flex flex-col">
                                <div className="flex gap-4">
                                    <MessageSquareText size={18} />
                                    <span className="text-sm font-semibold">Comments and activity</span>
                                </div>
                                <Button
                                className="w-full mt-6 mb-4"
                                >
                                    <p>Write a comment...</p>
                                </Button>
                                {/*Komentarze i aktywność (pole do wpisania komentarza, lista komentarzy + aktywność jako ta sama lista)*/}
                            </div>
                        </div>
                    </div>
                    

                </div>
            </div>
        </div>
    );
}

export default NoteModal;