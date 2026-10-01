import { useEffect, useState } from "react";
import { initialBoard } from "../constants/boardData";
import type { Board, Note } from "../types/types";
import CardColumn from "./CardColumn";
import { notesData } from "../constants/notesData";


function BoardList() {

    const [board] = useState<Board>(initialBoard);
    const [notes, setNotes] = useState<Note[]>([]);

    const urgentCount = notes.filter(note => note.isUrgent).length;

    function handleMoveNote(noteId: number, columnId: string) {
        setNotes((prev)=>
            prev.map((note)=> (note.id === noteId ? {...note, columnId} : note))
        );
    }

    useEffect(()=>{
        setNotes(notesData)
    }, []);

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