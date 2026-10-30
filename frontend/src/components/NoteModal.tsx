import { Clock, Ellipsis, LucideTag, Paperclip, Plus, SquareCheck, TextAlignStart, UserRoundPlus, X } from "lucide-react";
import type { Note } from "../types/types";
import { useEffect, useRef, useState } from "react";
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
    const [draftContent, setDraftContent] = useState(note.content ?? "");
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    const [labelsModal, setLabelsModal] = useState<"closed" | "list" | "create" | "edit">("closed");

    const labelsRef = useRef<HTMLButtonElement>(null);

    const { boardId } = useParams<{ boardId: string }>();
    const { labels, reloadLabels } = useLabels();
    const noteLabels = labels.filter((l) => note.labelIds?.includes(l.id));
    const [selectedLabelIds, setSelectedLabelIds] = useState<string[]>(
        () => note.labelIds ?? []
    );

    function startEditingContent() {
        setDraftContent(note.content ?? "");
        setIsEditingNoteContent(true);
    }

    function cancelEditingContent() {
        setDraftContent(note.content ?? "");
        setIsEditingNoteContent(false);
    }

    function commitContent(){
        const trimmed = draftContent.trim();
        if (trimmed !== (note.content ?? "")) {
            onSaveContent(note.id, trimmed);
        }
        setIsEditingNoteContent(false);
    }

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

    useEffect(() => {
        const onKey = (e: KeyboardEvent) => {
            if (e.key === "Escape" && !isEditingNoteContent) onClose();
        };
        window.addEventListener("keydown", onKey);
        return () => window.removeEventListener("keydown", onKey);
    }, [onClose, isEditingNoteContent]);

    return (
        <div className="fixed inset-0 z-98 bg-black/80" 
            onMouseDown={(e) => {
                if (e.target === e.currentTarget) onClose();
            }}
        >
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99 w-fit min-w-265 min-h-140.25 max-h-[calc(100dvh-128px)] 
            bg-(--panel) rounded-2xl overflow-hidden"
            >
                <div className="flex items-center justify-between w-full h-full min-w-md border-b border-(--border-mute) px-6 py-2">
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
                <div className="flex flex-col justify-evenly">
                    
                    <div className="flex w-full h-175 justify-between">
                        <div className="flex flex-col w-full text-left min-w-150 max-w-150 border-r border-(--border-mute) px-6 py-2">
                        
                        <EditableText
                            value={note.title ?? ""}
                            maxLength={30}
                            onCommit={(title) => onRenameNote(note.id, title)}
                            className="w-full px-2 h-16 text-3xl font-bold rounded-xs leading-none"
                            viewClassName="hover:bg-(--hover-white)/10 outline-1 outline-transparent"
                            editClassName="outline-1 outline-(--mute)"
                        />
                        
                            <div className="flex flex-col gap-8">

                                <div className="flex gap-2 py-2">
                                    <Button iconl={<Plus size={16} className="-mx-0.5" />}> Add </Button>
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
                                            />,
                                            
                                            <Button key="add_label_button" onClick={() => setLabelsModal("create")}>
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
                                            <LabelEditModal />
                                        }
                                    />
                                )}

                                {noteLabels.length > 0 && (
                                    <div className="flex flex-wrap gap-1">
                                        {noteLabels.map((label) => (
                                            <span
                                                key={label.id}
                                                className={`text-xs font-medium p-3 h-4 min-w-fit rounded flex items-center max-w-full truncate ${
                                                !label.title ? 'min-w-10' : 'min-w-fit'
                                                }`} //fix !label.title min-w & inside card the same
                                                style={{ backgroundColor: label.color, color: getTextColor(label.color) }}
                                            >
                                                {label.title}
                                            </span>
                                        ))}
                                    </div>
                                )}

                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-2">                                
                                        <TextAlignStart />
                                        <p className="text-[14px] font-semibold pb-4">
                                        Description
                                        </p>
                                    </div>

                                    {isEditingNoteContent ? (
                                        <div className="flex flex-col gap-2">
                                            <textarea
                                                autoFocus
                                                maxLength={200}
                                                value={draftContent}
                                                onChange={(e) => setDraftContent(e.target.value)}
                                                onBlur={commitContent}
                                                onFocus={(e)=> {
                                                    const len = e.target.value.length;
                                                    e.target.setSelectionRange(len, len);
                                                }}
                                                onKeyDown={(e) => {
                                                    if (e.key === "Enter" && !e.shiftKey) {
                                                        e.preventDefault();
                                                        commitContent();
                                                    }
                                                    if (e.key === "Escape") {
                                                        cancelEditingContent();
                                                    }
                                                }}
                                                className="resize-none outline-1 outline-(--mute) rounded-xs px-3 py-2 min-w-0 w-full text-sm text-left font-medium h-60
                                                wrap-break-word"
                                            />

                                            <div className="flex gap-1">
                                                <Button
                                                    variant="primary"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={commitContent}
                                                >
                                                    Save
                                                </Button>

                                                <Button
                                                    variant="ghost"
                                                    onMouseDown={(e) => e.preventDefault()}
                                                    onClick={cancelEditingContent}
                                                >
                                                    Cancel
                                                </Button>
                                            </div>

                                        </div>
                                    ) : (
                                        <button 
                                        type="button" 
                                        onClick={startEditingContent}
                                        className="w-full min-w-0 text-left"
                                        >
                                            <p className="px-3 py-2 rounded-xs outline-1 outline-(--mute) text-sm font-medium text-left text-(--text-mute) h-20
                                            wrap-break-word whitespace-pre-wrap hover:bg-(--hover-white)/10">
                                                {note.content || "Add content..."}
                                            </p>
                                        </button>
                                    )}
                                </div>
                            </div>
                        </div>
                        <div className="flex justify-items-start h-175 text-left w-full py-4 px-8 bg-(--bg-notemodal-right)">
                            <div className="flex">
                                aktywność
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