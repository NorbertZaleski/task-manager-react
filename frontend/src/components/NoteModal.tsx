import { Clock, Ellipsis, LucideTag, Paperclip, Plus, SquareCheck, TextAlignStart, UserRoundPlus, X } from "lucide-react";
import type { Note } from "../types/types";
import { useEffect, useState } from "react";
import EditableText from "./EditableText";
import Button from "./Button";

type NoteModalProps = {
    note: Note;
    columnTitle?: string;
    onClose: () => void;
    onSaveContent: (noteId: string, content: string) => void;
    onRenameNote: (noteId: string, title: string) => void;
} 

function NoteModal({note, columnTitle, onClose, onSaveContent, onRenameNote}: NoteModalProps){

    const [isEditingNoteContent, setIsEditingNoteContent] = useState(false);
    const [draftContent, setDraftContent] = useState(note.content ?? "");

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
                        //onClick={}
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
                                    <Button icon={<Plus size={16} className="-mx-0.5" />}> Add </Button>
                                    <Button icon={<LucideTag size={16} className="-mr-0.5"/>}> Labels </Button>
                                    <Button icon={<Clock size={16} className="-mr-0.5" />}> Date </Button>
                                    <Button icon={<SquareCheck size={16} className="-mr-0.5" />}> To do list </Button>
                                    <Button icon={<UserRoundPlus size={16} className="-mr-0.5" />}> Members </Button>
                                    <Button icon={<Paperclip size={16} className="-mr-0.5" />}> Files </Button>
                                </div>

                                <div className="flex flex-col">
                                    <div className="flex flex-row gap-2">                                
                                        <TextAlignStart />
                                        <p className="text-[14px] font-semibold pb-4">
                                        Description
                                        </p>
                                    </div>

                                    {isEditingNoteContent ? (
                                        <div>
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