import { useEffect, useRef, useState } from "react";
import type { Board, Column, Note, DragState, DropTarget, AssignableRole } from "../types/types";
import CardColumn from "./CardColumn";
import { columnsService } from "../services/columns.service";
import notesService from "../services/notes.service";
import { Archive, Copy, Ellipsis, Eye, FoldHorizontal, History, Image, Info, Lock, LogOut, Plus, Settings, Star, Tag, Trash2, UserPlus2 } from "lucide-react";
import FloatingBottomBar from "./FloatingBottomBar.js";
import { boardsService } from "../services/boards.service.js";
import { useNavigate, useParams, useSearchParams } from "react-router";
import EditableText from "./EditableText.js";
import BoardMembers from "./BoardMembers.js";
import OptionsModal from "./OptionsModal.js";
import ShareBoardModal from "./ShareBoardModal.js";
import NoteModal from "./NoteModal.js";
import { useDragScroll } from "../hooks/useDragScroll.js";
import Button from "./Button.js";

type BoardListProps = {
    board: Board;
    setBoard: React.Dispatch<React.SetStateAction<Board | null>>;
    onBoardRenamed: (boardId: string, title: string) => void;
    onBoardDeleted: (boardId: string) => void;
};

function BoardList({board, setBoard, onBoardDeleted, onBoardRenamed}: BoardListProps) {

    const { boardId } = useParams<{ boardId: string }>();
    const [notes, setNotes] = useState<Note[]>(board.notes ?? []);
    const [columns, setColumns] = useState<Column[]>(board.columns ?? []);
    const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);

    const selectedNote = notes.find((note)=> note.id === selectedNoteId) ?? null;
    const selectedColumn = columns.find((column)=> column.id === selectedNote?.columnId);
    
    const [newColumnId , setNewColumnId ] = useState<string | null>(null);

    const navigate = useNavigate();

    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    const [isMemberInviteModalOpen, setIsMemberInviteModalOpen] = useState(false);

    const [drag, setDrag] = useState<DragState>(null);
    const [dropTarget, setDropTarget] = useState<DropTarget>(null);

    const boardScrollRef = useRef<HTMLDivElement>(null);
    useDragScroll(boardScrollRef, !!drag, { axis: "x" });

    const sortedColumns = [...columns].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const [searchParams, setSearchParams] = useSearchParams();

    function getNewPosition(items: { position: number }[], index: number): number {
        const prev = items[index - 1];
        const next = items[index];
        if (!prev && !next) return 0;
        if (!prev) return next.position - 1;
        if (!next) return prev.position + 1;
        return (prev.position + next.position) / 2;
    };

    function handleDropOnNote(draggedId: string, targetId: string, after: boolean) {
        const target = notes.find((n) => n.id === targetId);
        if (!target) return;

        const columnNotes = notes
            .filter((n) => n.columnId === target.columnId && n.id !== draggedId)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        const targetIndex = columnNotes.findIndex((n) => n.id === targetId);
        const index = after ? targetIndex + 1 : targetIndex;

        handleMoveNote(draggedId, target.columnId, index);
    };

    async function handleMoveNote(noteId: string, columnId: string, index?: number) {
        const prevNotes = notes;

        const columnNotes = notes
            .filter((note) => note.columnId === columnId && note.id !== noteId)
            .sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

        const position = getNewPosition(
            columnNotes.map((n) => ({ position: n.position ?? 0 })),
            index ?? columnNotes.length // brak indexu = na koniec
        );

        setNotes((prev) =>
            prev.map((note) =>
                note.id === noteId ? { ...note, columnId, position } : note
            )
        );

        try {
            await notesService.updateNote(noteId, { columnId, position });
        } catch (error) {
            console.log("Error in moveNote function: ", error);
            setNotes(prevNotes);
        }
    };

    async function handleMoveColumn(columnId: string, newIndex: number) {
        const sorted = [...columns].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));
        const currentIndex = sorted.findIndex(c => c.id === columnId);
        if (currentIndex === -1 || currentIndex === newIndex) return;

        const without = sorted.filter(c => c.id !== columnId);
        const newPosition = getNewPosition(
            without.map(c => ({ position: c.position ?? 0 })),
            Math.max(0, Math.min(without.length, newIndex))
        );

        const prevColumns = columns;
        setColumns(prev =>
            prev.map(c => (c.id === columnId ? { ...c, position: newPosition } : c))
        );

        try {
            await columnsService.updateColumn(board.id, columnId, { position: newPosition });
        } catch (err) {
            console.log("Error moving column: ", err);
            setColumns(prevColumns);
        }
    };

    async function handleAddColumn() {
        try {
            const newColumn = await columnsService.createColumn(board.id, {title: "New list"});
            setColumns((prev)=>[...prev, newColumn]);
            setNewColumnId(newColumn.id);
        } catch (error) {
            console.log("Error in addColumn function: ", error);
        }
    };

    async function handleCreateNote(columnId: string, title: string) {
        try {
            const note = await notesService.createNote(columnId, { title });
            setNotes((prev) => [ note, ...prev]);
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
    };

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

    async function handleAddMember(userId: string, role: AssignableRole) {
        try {
            const member = await boardsService.addMember(board.id, userId, role);
            setBoard((prev) => prev ? { ...prev, members: [...(prev.members ?? []), member] } : prev);
        } catch (error) {
            console.log("Error in addMember function: ", error)
        }
    }; 

    const handleUpdateMember = async (userId: string, role: AssignableRole) => {
        const updated = await boardsService.updateMemberRole(board.id, userId, role);
        setBoard((b) => b && {
            ...b,
            members: b.members.map((m) => (m.id === userId ? { ...m, role: updated.role } : m)),
        });
    };

    const handleRemoveMember = async (userId: string) => {
        await boardsService.removeMember(board.id, userId);
        setBoard((b) => b && {
            ...b,
            members: b.members.filter((m) => m.id !== userId),
        });
    };

    function handleNoteUpdated(updated: Note) {
        setNotes((prev) => prev.map((n) => (n.id === updated.id ? updated : n)));
    }

    useEffect(() => {
        const noteId = searchParams.get("note");
        if (!noteId || boardId !== board.id) return;

        if (notes.some((n) => n.id === noteId)) setSelectedNoteId(noteId);

        const next = new URLSearchParams(searchParams);
        next.delete("note");
        setSearchParams(next, { replace: true });
    }, [searchParams, notes, board.id, boardId]);

    useEffect(() => {
        const reset = () => {
            setDrag(null);
            setDropTarget(null);
        };
        window.addEventListener("dragend", reset);
        window.addEventListener("drop", reset);
        return () => {
            window.removeEventListener("dragend", reset);
            window.removeEventListener("drop", reset);
        };
    }, []);

    return (
        <div className="flex flex-col h-full w-full overflow-hidden">
            <div className="flex text-center items-center justify-between shrink-0 
            h-14 px-3 py-1 bg-(--bg-board-header) backdrop-blur-[6px]">
                
                <EditableText
                    value={board.title}
                    maxLength={40}
                    onCommit={(title) => handleRenameBoard(board.id, title)}
                    className="px-2 py-1 text-lg font-semibold rounded-sm"
                    viewClassName="hover:bg-(--hover-white) cursor-pointer"
                    editClassName="outline-1 outline-white field-sizing-content"
                />
                
                <div className="flex gap-2">
                    <BoardMembers members={board.members}/>
                    <Button
                    variant="primary"
                    className="border-0 bg-(--text) hover:bg-white"
                    iconl={<UserPlus2 size={16}/>}
                    onClick={() => setIsMemberInviteModalOpen(true)}
                    >
                        <span>Share board</span>
                    </Button>
                    <Button
                    variant="ghost_small"
                    ref={ellipsisRef}
                    className="size-8 p-1! rounded-md hover:bg-(--hover-white)"
                    onClick={()=> setIsOptionsOpen(true)}
                    >
                        <Ellipsis size={24} className=""/>
                    </Button>

                    {isOptionsOpen && (
                    <OptionsModal
                        title="Menu"
                        anchorRef={ellipsisRef}
                        onClose={() => setIsOptionsOpen(false)}
                        width={354}
                        options={[
                        { id: 'addMember', label: 'Share', icon: <UserPlus2 size={18} />, onClick: () => setIsMemberInviteModalOpen(true) },

                        { id: 'about', label: 'About this board', icon: <Info size={18} />, dividerBefore: true, onClick: () => {/* TODO */} },
                        { id: 'visibility', label: 'Visibility: Private', icon: <Lock size={18} />, onClick: () => {/* TODO */} },
                        { id: 'star', label: 'Star board', icon: <Star size={18} />, onClick: () => {/* TODO */} },

                        { id: 'settings', label: 'Settings', icon: <Settings size={18} />, dividerBefore: true, onClick: () => {/* TODO */} },
                        { id: 'background', label: 'Change background', icon: <Image size={18} />, onClick: () => {/* TODO */} },
                        { id: 'labels', label: 'Labels', icon: <Tag size={18} />, onClick: () => {/* TODO */} },

                        { id: 'activity', label: 'Activity', icon: <History size={18} />, dividerBefore: true, onClick: () => {/* TODO */} },
                        { id: 'archived', label: 'Archived items', icon: <Archive size={18} />, onClick: () => {/* TODO */} },

                        { id: 'watch', label: 'Watch', icon: <Eye size={18} />, dividerBefore: true, onClick: () => {/* TODO */} },
                        { id: 'collapse', label: 'Collapse all lists', icon: <FoldHorizontal size={18} />, onClick: () => {/* TODO */} },
                        { id: 'copy', label: 'Copy board', icon: <Copy size={18} />, onClick: () => {/* TODO */} },

                        { id: 'leave', label: 'Leave board', icon: <LogOut size={18} />, dividerBefore: true, onClick: () => {/* TODO */} },
                        { id: 'delete', label: 'Delete board', icon: <Trash2 size={18} />, onClick: () => handleDeleteBoard(board.id) },
                        ]}
                    />
                    )}

                </div>
            </div>

            <div 
            ref={boardScrollRef}
            className="flex flex-1 min-h-0 max-h-[calc(100dvh-128px)] items-stretch justify-start gap-4 mt-4 px-4 pb-4 overflow-x-auto overflow-y-hidden">
                {sortedColumns.map((column, index) => (
                        <div key={column.id} className="shrink-0">
                            <CardColumn
                                board={board}
                                column={column}
                                isEditingTitle={newColumnId === column.id}
                                onTitleEditingEnd={() => setNewColumnId(null)}
                                columnIndex={index}
                                columnsCount={sortedColumns.length}
                                onMoveColumn={handleMoveColumn}
                                notes={notes
                                    .filter(note => note.columnId === column.id)
                                    .sort((a, b) => a.position - b.position)}
                                onMoveNote={handleMoveNote}
                                onCreateNote={handleCreateNote}
                                onDeleteColumn={handleDeleteColumn}
                                onOpenNote={setSelectedNoteId}
                                onRenameColumn={renameColumn}
                                onDropNote={handleDropOnNote}
                                drag={drag}
                                onDragChange={setDrag}
                                dropTarget={dropTarget}
                                onDropTargetChange={setDropTarget}
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
                members={board.members}
                />
            )}
    
            {isMemberInviteModalOpen && (
                <ShareBoardModal
                board={board}
                onClose={() => setIsMemberInviteModalOpen(false)}
                addMember={handleAddMember}
                removeMember={handleRemoveMember}
                updateMemberRole={handleUpdateMember}
                />
            )}

            <FloatingBottomBar />

        </div>
    );
}

export default BoardList;