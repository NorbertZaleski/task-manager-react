import type { Column, Note } from "../types/types";
import Card from "./Card";
import {EllipsisVertical} from 'lucide-react'
import CreateCardButton from "./CreateCardButton";

type CardColumnProps = {
    column: Column;
    notes: Note[];
    onMoveNote: (noteId: string, columnId: string) => void;
};

function CardColumn({column, notes, onMoveNote}: CardColumnProps) {
    return(
        <>
            <div 
                className="border-t-(--red) border-t-8 bg-(--panel) p-2 flex flex-col gap-2 w-55"
                onDragOver={(e)=> e.preventDefault()}
                onDrop={(e)=>{
                    e.preventDefault();
                    const noteId = e.dataTransfer.getData("text/plain");
                    onMoveNote(noteId, column.id);
                }}
                >
                <div className="flex text-center justify-between p-1">
                    <div className="bg-(--red) w-6 h-6 border-2"></div>
                    <p className="text-lg">{column.title}</p>
                    <div className="flex items-center justify-between text-center gap-2">
                        <div className="text-md">{notes.length}</div>
                        <button type="button"><EllipsisVertical size={20}/></button>
                    </div>
                </div>

                <div className="flex flex-col gap-1">
                    {notes.map((note) => (
                        <Card key={note.id} note={note} />
                    ))}
                </div>

                <CreateCardButton></CreateCardButton>
            </div>
        </>
)
}

export default CardColumn;