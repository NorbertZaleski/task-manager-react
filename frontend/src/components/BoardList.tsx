import { useState } from "react";
import type { Board, Column, Note } from "../types/types";
import CardColumn from "./CardColumn";
import { boardsService } from "../services/boards.service";

type BoardListprops = {
    board: Board;
};

function BoardList({board}: BoardListprops) {

    const [notes, setNotes] = useState<Note[]>(board.notes ?? []);
    const [columns, setColumns] = useState<Column[]>(board.columns ?? []);

    function handleMoveNote(noteId: string, columnId: string) {
        setNotes((prev)=>
            prev.map((note)=> (note.id === noteId ? {...note, columnId} : note))
        );
    }

    async function addColumn() {
        try {
            const newColumn = await boardsService.createColumn(board.id, {title: "Nowa lista"});
            setColumns((prev)=>[...prev, newColumn]);
        } catch (error) {
            console.log("Error in addColumn function: ", error);
        }
    }

    function renameColumn(){
        //
    }

    //TO DO ZROBIC COLUMNSSERVICE I ZASTAPIĆ GO W ADDCOLUMN!
/*  function deleteColumn(){
        try {
            await columnsService.deleteColumn(columnId);
            setColumns((prev)=> prev.filter((column)=> column.id !==columnId));
            setNotes((prev) => prev.filter((note) => note.columnId !== columnId));
        } catch (error) {
            console.log("Error in deleteColumn function: ", error)
        }
    }
*/
    return (
        <div className="m-2">
            <div className="flex text-center justify-between items-center border-2">
            <h1>{board.title}</h1>
            <div>Liczba notatek: {notes.length}</div>
            </div>
            <div className="flex border border-dotted w-fit p-2 text-md">
                <button onClick={()=>addColumn()}>Dodaj listę</button>
            </div>
            <div className="flex text-center justify-start gap-5">
                {columns.map((column) => (
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