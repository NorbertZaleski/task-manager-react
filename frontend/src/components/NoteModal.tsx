import type { Note } from "../types/types";

type NoteModalProps = {
    note: Note;
} 

function NoteModal({note}: NoteModalProps){
    return (
        <div className="flex justify-center text-center">
            {note.content}
        </div>
    );
}

export default NoteModal;