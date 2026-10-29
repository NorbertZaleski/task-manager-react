import { useRef, useState } from "react";
import type { Board, Column, Note } from "../types/types";
import CardColumn from "./CardColumn";
import { columnsService } from "../services/columns.service";
import notesService from "../services/notes.service";
import { Ellipsis, Plus } from "lucide-react";
import FloatingBottomBar from "./FloatingBottomBar.js";
import { boardsService } from "../services/boards.service.js";
import { useNavigate } from "react-router";
import EditableText from "./EditableText.js";
import BoardMembers from "./BoardMembers.js";
import OptionsModal from "./OptionsModal.js";
import ShareBoardModal from "./ShareBoardModal.js";
import NoteModal from "./NoteModal.js";

type BoardListProps = {
    board: Board;
    setBoard: React.Dispatch<React.SetStateAction<Board | null>>;
    onBoardRenamed: (boardId: string, title: string) => void;
    onBoardDeleted: (boardId: string) => void;
};

function BoardList({board, setBoard, onBoardDeleted, onBoardRenamed}: BoardListProps) {

    const [notes, setNotes] = useState<Note[]>(board.notes ?? []);
    const [columns, setColumns] = useState<Column[]>(board.columns ?? []);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const selectedNote = notes.find((note)=> note.id === selectedNoteId) ?? null;
    const selectedColumn = columns.find((column)=> column.id === selectedNote?.columnId);
    
    const navigate = useNavigate();

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    const [isMemberInviteModalOpen, setIsMemberInviteModalOpen] = useState(false);

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
    };

    async function handleAddColumn() {
        try {
            const newColumn = await columnsService.createColumn(board.id, {title: "Nowa lista"});
            setColumns((prev)=>[...prev, newColumn]);
        } catch (error) {
            console.log("Error in addColumn function: ", error);
        }
    };

    async function handleCreateNote(columnId: string, title: string) {
        try {
            const note = await notesService.createNote(columnId, { title });
            setNotes((prev) => [...prev, note]);
        } catch (error) {
            console.log("Error in createNote function: ", error);
        }
    };

    async function handleDeleteNote(noteId: string) {
        try {
            await notesService.deleteNote(noteId);
            setNotes((prev) => prev.filter((note)=> note.id !== noteId));
        } catch (error) {
            console.log("Error in deleteNote function: ", error);
        }
    }

    async function renameColumn(boardId: string, columnId: string, title: string){
        try {
            const columnUpdated = await columnsService.updateColumn(boardId, columnId, {title});
            setColumns((prev) =>
                prev.map((column) =>
                    column.id === columnId ? { ...column, title: columnUpdated.title } : column
                )
            );
        } catch (error) {
            console.log("Error in renameColumn function: ", error);
        }
    };

    async function renameNote(noteId: string, title: string){
        try {
            const noteUpdated = await notesService.updateNote(noteId, {title});
            setNotes((prev) =>
                prev.map((note) =>
                    note.id === noteId ? { ...note, title: noteUpdated.title } : note
                )
            );
        } catch (error) {
            console.log("Error in renameNote function: ", error);
        }
    };

    async function handleDeleteColumn(boardId: string, columnId: string){
        try {
            await columnsService.deleteColumn(boardId, columnId);
            setColumns((prev)=> prev.filter((column)=> column.id !==columnId));
            setNotes((prev) => prev.filter((note) => note.columnId !== columnId));
        } catch (error) {
            console.log("Error in deleteColumn function: ", error);
        }
    };

    async function handleRenameBoard(boardId: string, title: string) {
        try {
            await boardsService.updateBoard(boardId, { title });
            setBoard(prev => prev ? {...prev, title: title} : prev);
            onBoardRenamed(boardId, title);
        } catch (error) {
            console.log("Error in renameBoard function: ", error);
        }
    };

    async function handleDeleteBoard(boardId: string) {
        try {
            await boardsService.deleteBoard(boardId);
            onBoardDeleted(boardId);
            navigate("/boards", { replace: true });
        } catch (error) {
            console.log("Error in deleteBoard: ", error);
        }
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
    };

    async function handleAddMember(userId: string) {
        try {
            setIsMemberInviteModalOpen(true);
            const member = await boardsService.addMember(board.id, userId);
            setBoard((prev) => prev ? { ...prev, members: [...(prev.members ?? []), member] } : prev);
        } catch (error) {
            console.log("Error in addMember function: ", error)
        }
    };

    function handleNoteUpdated(updated: Note) {
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    }

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="flex text-center items-center justify-between shrink-0 
            h-14 px-3 py-1 bg-black/30">
                
                <EditableText
                    value={board.title}
                    maxLength={40}
                    onCommit={(title) => handleRenameBoard(board.id, title)}
                    className="px-2 py-1 text-lg font-semibold rounded-sm"
                    viewClassName="hover:bg-(--hover-white)"
                    editClassName="outline-1 outline-white field-sizing-content"
                />
                
                <div className="flex gap-4">
                    <BoardMembers members={board.members}/>

                    <button
                    type="button"
                    ref={ellipsisRef}
                    className="rounded-md size-8 hover:bg-(--hover-white) flex justify-center items-center"
                    onClick={()=> setIsOptionsOpen(true)}
                    >
                        <Ellipsis size={24} className=""/>
                    </button>

                    {isOptionsOpen && (
                        <OptionsModal 
                        title="Menu"
                        anchorRef={ellipsisRef}
                        onClose={()=> setIsOptionsOpen(false)}
                        options={[
                            {id: "addMember", label: "Add members", onClick: () => setIsMemberInviteModalOpen(true)},
                            {id: "delete", label: "Delete board", onClick: () => handleDeleteBoard(board.id)}
                        ]}
                        />
                    )}

                    {isMemberInviteModalOpen && (
                        <ShareBoardModal
                        board={board}
                        onClose={() => setIsMemberInviteModalOpen(false)}
                        addMember={handleAddMember}
                        />
                    )}

                </div>
            </div>

            <div className="flex flex-1 min-h-0 max-h-[calc(100dvh-128px)] items-stretch justify-start gap-4 mt-4 px-4 pb-4 overflow-x-auto overflow-y-hidden">
                {columns.map((column) => (
                    <div key={column.id} className="shrink-0">
                        <CardColumn
                            board={board}
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
                        <Plus /> <p className="font-semibold">Add new list</p>
                    </button>
                </div>
            </div>
            
            {selectedNote && (
                <NoteModal
                note={selectedNote}
                columnTitle={selectedColumn?.title}
                onClose={()=> setSelectedNoteId(null)}
                onSaveContent={handleSaveContent}
                onRenameNote={renameNote}
                onDelete={handleDeleteNote}
                onNoteUpdated={handleNoteUpdated}
                />
            )}
            
            <FloatingBottomBar />

        </div>
    );
}

export default BoardList;