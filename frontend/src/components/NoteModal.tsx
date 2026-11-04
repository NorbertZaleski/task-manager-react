import { Clock, Ellipsis, LucideTag, MessageSquareText, Paperclip, SquareCheck, TextAlignStart, UserRoundPlus, X } from "lucide-react";
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
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    const [editingLabel, setEditingLabel] = useState<Label | null>(null);
    const [labelsModal, setLabelsModal] = useState<"closed" | "list" | "create" | "edit">("closed");

    const labelsRef = useRef<HTMLButtonElement>(null);
    const descRef = useRef<HTMLDivElement>(null);

    const { boardId } = useParams<{ boardId: string }>();
    const { labels, reloadLabels } = useLabels();
    const noteLabels = labels.filter((l) => note.labelIds?.includes(l.id));
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
        () => note.labelIds ?? []
    );

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

                        <button 
                        type="button" 
                        onClick={() => setIsOptionsOpen(true)}
                        ref={ellipsisRef}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-white/5"
                        >
                            <Ellipsis size={16} />
                        </button>

                        <button 
                        type="button" 
                        onClick={onClose}
                        className="flex size-8 items-center justify-center rounded-full hover:bg-white/5"
                        >
                            <X size={16}/>
                        </button>

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
                        
                            <div className="shrink-0">
                                <EditableText
                                    value={note.title ?? ""}
                                    maxLength={400}
                                    onCommit={(title) => onRenameNote(note.id, title)}
                                    className="w-full px-2 py-1 my-3 min-h-16 h-fit text-3xl font-bold rounded-xs leading-tight wrap-break-word"
                                    viewClassName="outline-1 outline-transparent cursor-text"
                                    editClassName="outline-1 outline-(--mute)"

                                />
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

                            <div className={`relative flex flex-col ${
                                isEditingNoteContent ? "" : "flex-1 min-h-0"
                            }`}>
                                <div
                                    className="flex flex-col gap-4"
                                >

                                    <div className="flex gap-2 py-2 ml-8">
                                        <Button iconl={
                                            <LucideTag size={16} className="-mr-0.5" />} 
                                            onClick={()=>setLabelsModal("list")}
                                            ref={labelsRef}
                                        > 
                                            Labels 
                                        </Button>
                                        <Button iconl={<Clock size={16} className="-mr-0.5" />}> Date </Button>
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