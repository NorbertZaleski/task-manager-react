import { Clock, Ellipsis, LucideTag, Plus, SquareCheck, TextAlignStart, UserRoundPlus, X } from "lucide-react";
import type { Note } from "../types/types";
import { useState } from "react";
import ButtonSimple from "./ButtonSimple";

type NoteModalProps = {
    note: Note;
    columnTitle?: string;
    onClose: () => void;
    onSaveContent: (noteId: string, content: string) => void;
} 

function NoteModal({note, columnTitle, onClose, onSaveContent}: NoteModalProps){

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

    return (
        <div className="fixed inset-0 z-98 bg-black/80">
            <div className="fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99 w-fit min-w-265 min-h-140.25 max-h-[calc(100dvh-128px)] 
            bg-(--panel) px-6 py-2 rounded-2xl
            ">
                <div className="flex justify-between w-full h-full min-w-md border-b border-(--border-mute) py-2">
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
                    
                    <div className="flex w-full h-175 justify-between px-6 py-2">
                        <div className="flex flex-col w-full text-left min-w-150 border-r border-(--border-mute) pr-8 ">
                            <p className="text-3xl font-bold py-4">{note.title}</p>
                        
                            <div className="flex flex-col gap-8">

                                <div className="flex gap-2 py-2">
                                    <ButtonSimple icon={<Plus size={16} className="-mx-0.5" />} text={"Add"} />
                                    <ButtonSimple icon={<LucideTag size={16} className="-mr-0.5"/>} text={"Labels"} />
                                    <ButtonSimple icon={<Clock size={16} className="-mr-0.5" />} text={"Date"} />
                                    <ButtonSimple icon={<SquareCheck size={16} className="-mr-0.5" />} text={"To do list"} />
                                    <ButtonSimple icon={<UserRoundPlus size={16} className="-mr-0.5" />} text={"Members"} />
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
                                                className="resize-none outline-1 outline-(--mute) rounded-xs px-2 py-1 min-w-0 w-full text-sm text-left font-medium h-60
                                                wrap-break-word"
                                            />

                                            <div className="flex gap-2">
                                                <button className="bg-(--button) hover:bg-(--button-hover) px-2 py-1 text-md text-(--text-dark) font-medium
                                                rounded w-fit h-fit
                                                ">
                                                    Save
                                                </button>
                                                <button className="hover:bg-(--mute)/20 px-2 py-1 text-md text-(--text) font-medium
                                                rounded w-fit h-fit
                                                ">
                                                    Cancel
                                                </button>
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
                        <div className="flex justify-items-start h-175 text-left w-full py-4 pl-8 bg-(--bg-notemodal-right)">
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