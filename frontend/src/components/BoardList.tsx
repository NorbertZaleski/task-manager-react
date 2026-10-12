import { useState } from "react";
import type { Board, Column, Note } from "../types/types";
import CardColumn from "./CardColumn";
import { columnsService } from "../services/columns.service";
import notesService from "../services/notes.service";

type BoardListProps = {
    board: Board;
};

function BoardList({board}: BoardListProps) {

    const [notes, setNotes] = useState<Note[]>(board.notes ?? []);
    const [columns, setColumns] = useState<Column[]>(board.columns ?? []);

    function handleMoveNote(noteId: string, columnId: string) {
        setNotes((prev)=>
            prev.map((note)=> (note.id === noteId ? {...note, columnId} : note))
        );
    }

    async function handleAddColumn() {
        try {
            const newColumn = await columnsService.createColumn(board.id, {title: "Nowa lista"});
            setColumns((prev)=>[...prev, newColumn]);
        } catch (error) {
            console.log("Error in addColumn function: ", error);
        }
    }

    async function handleCreateNote(columnId: string, content: string) {
        try {
            const note = await notesService.createNote(columnId, { content });
            setNotes((prev) => [...prev, note]);
        } catch (error) {
            console.log("Error in createNote function: ", error);
        }
    }

    function renameColumn(){
        //
    }

    //TO DO ZROBIC COLUMNSSERVICE I ZASTAPIĆ GO W ADDCOLUMN!
    async function handleDeleteColumn(columnId: string){
        try {
            await columnsService.deleteColumn(columnId);
            setColumns((prev)=> prev.filter((column)=> column.id !==columnId));
            setNotes((prev) => prev.filter((note) => note.columnId !== columnId));
        } catch (error) {
            console.log("Error in deleteColumn function: ", error)
        }
    }

    return (
        <div className="m-2">
            <div className="flex text-center justify-between items-center border-2">
            <h1>{board.title}</h1>
            <div>Liczba notatek: {notes.length}</div>
            </div>

            <div className="flex text-center justify-start gap-4 mt-4">
                {columns.map((column) => (
                    <CardColumn 
                    key={column.id} 
                    column={column} 
                    notes={notes.filter((note) => note.columnId === column.id)}
                    onMoveNote={handleMoveNote}
                    onCreateNote={handleCreateNote}
                    onDeleteColumn={handleDeleteColumn}
                    />
                ))}

                <div className="flex border-2 border-dashed w-full max-w-55 h-fit p-2 text-md text-center justify-center">
                    <button onClick={()=>handleAddColumn()}>Dodaj listę</button>
                </div>
            </div>

        </div>
    );
}

export default BoardList;