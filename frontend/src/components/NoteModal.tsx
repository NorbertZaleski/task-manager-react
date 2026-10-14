import { X } from "lucide-react";
import type { Note } from "../types/types";

type NoteModalProps = {
    note: Note;
    columnTitle?: string;
    onClose: () => void;
} 

function NoteModal({note, columnTitle, onClose}: NoteModalProps){
    return (
        <div className="
        fixed top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 z-99 bg-panel w-fit min-w-270 min-h-140.25 max-h-[calc(100dvh-128px)]
        ">
            <div className="flex justify-between">
                <div>{columnTitle}</div>
                <div className="flex gap-2">
                    <div>options</div>
                    <X type="button" onClick={onClose}/>
                </div>
            </div>
            <div className="flex w-full h-full justify-between">
                <div className="flex flex-col">
                    <div>Note title</div>
                    <div>jakieś opcje</div>
                    <div>{note.content}</div>
                </div>
                <div className="flex">
                    aktywność
                    {/*Komentarze i aktywność (pole do wpisania komentarza, lista komentarzy + aktywność jako ta sama lista)*/}
                </div>
            </div>
        </div>
    );
}

export default NoteModal;