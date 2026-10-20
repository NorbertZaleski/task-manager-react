import { useState } from "react";
import type { Board, Column, Note } from "../types/types";
import CardColumn from "./CardColumn";
import { columnsService } from "../services/columns.service";
import notesService from "../services/notes.service";
import NoteModal from "./NoteModal.js";
import { Ellipsis, Plus } from "lucide-react";
import FloatingBottomBar from "./FloatingBottomBar.js";
import { boardsService } from "../services/boards.service.js";

type BoardListProps = {
    board: Board;
    setBoard: React.Dispatch<React.SetStateAction<Board | null>>;
};

function BoardList({board, setBoard}: BoardListProps) {

    const [notes, setNotes] = useState<Note[]>(board.notes ?? []);
    const [columns, setColumns] = useState<Column[]>(board.columns ?? []);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const selectedNote = notes.find((note)=> note.id === selectedNoteId) ?? null;
    const selectedColumn = columns.find((column)=> column.id === selectedNote?.columnId);

    const [isEditingBoardTitle, setIsEditingBoardTitle] = useState(false);
    const [draftBoardTitle, setDraftBoardTitle] = useState(board.title);
    
    async function handleMoveNote(noteId: string, columnId: string) {
        const prevNotes = notes;
        
        const columnNotes = notes.filter(
            (note) => note.columnId === columnId && note.id !== noteId
        );
        const position = columnNotes.length
            ? Math.max(...columnNotes.map((note) => note.position ?? 0)) + 1
            : 0;

        setNotes((prev) =>
            prev.map((note) => 
                note.id === noteId 
                    ? {...note, columnId, position: position ?? note.position} 
                    : note
                )
        );

        try {
            await notesService.updateNote(noteId, {columnId, position});
        } catch (error) {
            console.log("Error in moveNote function: ", error);
            setNotes(prevNotes);
        }
    }

    async function handleAddColumn() {
        try {
            const newColumn = await columnsService.createColumn(board.id, {title: "Nowa lista"});
            setColumns((prev)=>[...prev, newColumn]);
        } catch (error) {
            console.log("Error in addColumn function: ", error);
        }
    }

    async function handleCreateNote(columnId: string, title: string) {
        try {
            const note = await notesService.createNote(columnId, { title });
            setNotes((prev) => [...prev, note]);
        } catch (error) {
            console.log("Error in createNote function: ", error);
        }
    }

    async function renameColumn(columnId: string, title: string){
        try {
            const columnUpdated = await columnsService.updateColumn(columnId, {title});
            setColumns((prev) =>
                prev.map((column) =>
                    column.id === columnId ? { ...column, title: columnUpdated.title } : column
                )
            );
        } catch (error) {
            console.log("Error in renameColumn function: ", error);
        }
    }

    async function handleDeleteColumn(columnId: string){
        try {
            await columnsService.deleteColumn(columnId);
            setColumns((prev)=> prev.filter((column)=> column.id !==columnId));
            setNotes((prev) => prev.filter((note) => note.columnId !== columnId));
        } catch (error) {
            console.log("Error in deleteColumn function: ", error);
        }
    }

    async function handleRenameBoard(boardId: string, title: string) {
        try {
            await boardsService.updateBoard(boardId, { title });
            setBoard(prev => prev ? {...prev, title: title} : prev);
        } catch (error) {
            console.log("Error in renameBoard function: ", error);
        }
    }

    const commitRenameBoard = () => {
        const trimmed = draftBoardTitle.trim();
        if (trimmed && trimmed !== board.title) {
            handleRenameBoard(board.id, trimmed);
        } else {
            setDraftBoardTitle(board.title);
        }
        setIsEditingBoardTitle(false);
    };

    async function handleSaveContent(noteId: string, content: string) {
        try {
            await notesService.updateNote(noteId, { content });
            setNotes((prev) =>
                prev.map((n) => (n.id === noteId ? { ...n, content } : n))
            );
        } catch (error) {
            console.log("Error in saveContent function: ", error);
        }
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="flex text-center items-center justify-between shrink-0 
            h-14 px-3 py-1 bg-black/30">
                
                {isEditingBoardTitle ? (
                    <input
                        autoFocus
                        maxLength={40}
                        value={draftBoardTitle}
                        onChange={(e) => setDraftBoardTitle(e.target.value)}
                        onBlur={commitRenameBoard}
                        onKeyDown={(e) => {
                            if (e.key === "Enter") commitRenameBoard();
                            if (e.key === "Escape") {
                                setDraftBoardTitle(board.title);
                                setIsEditingBoardTitle(false);
                            }
                        }}
                        className="field-sizing-content text-lg font-semibold text-left outline-1 ouline-white rounded-sm px-2 py-1"
                    />
                ) : (
                    <button
                type="button"
                className="py-1 px-2 w-fit h-fit rounded-sm hover:bg-(--hover-white)"
                onClick={()=> setIsEditingBoardTitle(true)}
                >
                    <h1 className="text-lg font-semibold shrink-0">
                        {board.title}
                    </h1>
                </button>
                )}
                
                <div>
                    <Ellipsis />
                </div>
            </div>

            <div className="flex flex-1 min-h-0 max-h-[calc(100dvh-128px)] items-stretch justify-start gap-4 mt-4 px-4 pb-4 overflow-x-auto overflow-y-hidden">
                {columns.map((column) => (
                    <div key={column.id} className="shrink-0">
                        <CardColumn
                            column={column}
                            notes={notes
                                .filter((note) => note.columnId === column.id)
                                .sort((a, b) => a.position - b.position)}
                            onMoveNote={handleMoveNote}
                            onCreateNote={handleCreateNote}
                            onDeleteColumn={handleDeleteColumn}
                            onOpenNote={setSelectedNoteId}
                            onRenameColumn={renameColumn}
                        />
                    </div>
                ))}

                <div className="flex shrink-0 rounded-lg min-w-55 h-fit p-2 text-md font-medium text-left items-start
                bg-(--hover-white) hover:bg-(--hover-white-darker)">
                    <button 
                    className="flex items-center gap-1"
                    onClick={()=>handleAddColumn()}
                    >
                        <Plus /> Add new list
                    </button>
                </div>
            </div>
            
            {selectedNote && (
                <NoteModal
                note={selectedNote}
                columnTitle={selectedColumn?.title}
                onClose={()=> setSelectedNoteId(null)}
                onSaveContent={handleSaveContent}
                />
            )}
            
            <FloatingBottomBar />

        </div>
    );
}

export default BoardList;