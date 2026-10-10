import { useState } from "react";
import type { Board, Note } from "../types/types";
import CardColumn from "./CardColumn";

type BoardListprops = {
    board: Board;
};

function BoardList({board}: BoardListprops) {

    const [notes, setNotes] = useState<Note[]>(board.notes ?? []);

    const urgentCount = notes.filter(note => note.isUrgent).length;

    function handleMoveNote(noteId: string, columnId: string) {
        setNotes((prev)=>
            prev.map((note)=> (note.id === noteId ? {...note, columnId} : note))
        );
    }

    function addColumn() {
        //
    }

    function renameColumn(){
        //
    }

    function deleteColumn(){
        //
    }

    return (
        <div className="m-2">
            <div className="flex text-center justify-between items-center border-2">
            <h1>{board.title}</h1>
            <div>Liczba notatek: {notes.length}</div>
            <div>Liczba pilnych zadań: {urgentCount}</div>
            </div>
            
            <div className="flex text-center justify-start gap-5">
                {board.columns.map((column) => (
                    <CardColumn 
                    key={column.id} 
                    column={column} 
                    notes={notes.filter((note) => note.columnId === column.id)}
                    onMoveNote={handleMoveNote}
                    />
                ))}
            </div>
        </div>
    );
}

export default BoardList;