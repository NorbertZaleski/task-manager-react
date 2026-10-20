import { Ellipsis, X } from "lucide-react";
import type { Note } from "../types/types";
import { useState } from "react";

type NoteModalProps = {
    note: Note;
    columnTitle?: string;
    onClose: () => void;
} 

function NoteModal({note, columnTitle, onClose}: NoteModalProps){

    const [isEditingNoteContent, setIsEditingNoteContent] = useState(false);
    const [draftContent, setDraftContent] = useState(note.content);

    function startEditingContent() {

        setIsEditingNoteContent(true);
    }

    function cancelEditingContent() {
        
        setIsEditingNoteContent(false);
    }

    function commitContent(){
        
    setIsEditingNoteContent(false);
    }

    return (
        <div className="
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99 w-fit min-w-265 min-h-140.25 max-h-[calc(100dvh-128px)] 
        bg-(--panel) px-6 py-2 rounded-2xl
        ">
            <div className="flex justify-between w-full h-full min-w-md border-b py-2 ">
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
                
                <div className="flex w-full h-175 max-w-150 justify-between min-w-auto border-r">
                    <div className="flex">
                        <p className="text-2xl font-bold">{note.title}</p>
                    
                    {isEditingNoteContent ? (
                        <textarea
                            autoFocus
                            maxLength={30}
                            value={note.content}
                            onChange={(e) => setDraftContent(e.target.value)}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") {}
                                if (e.key === "Escape") {
                                    setDraftContent(note.content);
                                    setIsEditingNoteContent(false);
                                }
                            }}
                            className="field-sizing-content outline-0 px-2 py-1 min-w-0 text-sm text-left font-medium"
                        />
                    ) : (
                        <button 
                        type="button" 
                        onClick={() => setIsEditingNoteContent(true)}
                        className="min-w-0 text-left"
                        >
                            <p className="field-sizing-content px-2 py-1 rounded-sm text-sm font-medium text-left wrap-break-word hover:bg-(--hover-white)">
                                {note.content}
                            </p>
                        </button>
                    )}
                    </div>
                </div>
                
                <div className="flex w-auto h-175 min-w-auto">
                    <div className="flex">
                        aktywność
                        {/*Komentarze i aktywność (pole do wpisania komentarza, lista komentarzy + aktywność jako ta sama lista)*/}
                    </div>
                </div>
                
            </div>
        </div>
    );
}

export default NoteModal;