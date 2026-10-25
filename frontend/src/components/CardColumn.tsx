import type { Board, Column, Note } from "../types/types";
import Card from "./Card";
import {Ellipsis} from 'lucide-react'
import CreateNoteButton from "./CreateNoteButton";
import EditableText from "./EditableText";
import { useRef, useState } from "react";
import OptionsModal from "./OptionsModal";

type CardColumnProps = {
    column: Column;
    board: Board;
    notes: Note[];
    onMoveNote: (noteId: string, columnId: string) => void;
    onCreateNote: (columnId: string, content: string) => Promise<void>;
    onDeleteColumn: (boardId: string, columnId: string) => void;
    onOpenNote: (noteId: string) => void;
    onRenameColumn: (boardId: string, columnId: string, title: string) => void;
};

function CardColumn({column, board, notes, onMoveNote, onCreateNote, onDeleteColumn, onOpenNote, onRenameColumn}: CardColumnProps) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const ellipsisRef = useRef<HTMLButtonElement>(null);

    return(
            <div 
                className="bg-(--panel) rounded-2xl px-4 py-2 flex flex-col gap-2 
                w-60 max-h-full min-h-0 shrink-0"
                onDragOver={(e)=> e.preventDefault()}
                onDrop={(e)=>{
                    e.preventDefault();
                    const noteId = e.dataTransfer.getData("text/plain");
                    onMoveNote(noteId, column.id);
                }}
                >
                <div className="flex shrink-0 text-left items-start justify-between max-w-full gap-2">
                    
                <EditableText
                    value={column.title}
                    maxLength={30}
                    onCommit={(title) => onRenameColumn(board.id, column.id, title)}
                    className="px-2 py-1 rounded-sm text-sm font-medium"
                    viewClassName="hover:bg-(--hover-white)"
                    editClassName="outline-0 field-sizing-content"
                />

                    <div className="flex shrink-0 items-center gap-2 py-1 rounded-sm text-center">
                        <div className="text-sm select-none">{notes.length}</div>
                        <button 
                        ref={ellipsisRef}
                        type="button" 
                        onClick={() => setIsOptionsOpen(true)}
                        className=""
                        >
                            <Ellipsis size={18}/>
                        </button>

                        {isOptionsOpen && (
                            <OptionsModal 
                            title="Note options"
                            anchorRef={ellipsisRef}
                            options={[
                                { id: "delete", label: "Delete column", onClick: () => onDeleteColumn(board.id, column.id)},
                            ]}
                            onClose={() => setIsOptionsOpen(false)} />
                        )}
                    </div>
                </div>

                <div className="flex flex-col gap-1 overflow-y-auto min-h-0">
                    {notes.map((note) => (
                        <Card key={note.id} note={note} onOpen={()=> onOpenNote(note.id)}/>
                    ))}
                </div>

                <div className="shrink-0">
                    <CreateNoteButton onCreate={(content) => onCreateNote(column.id, content)}></CreateNoteButton>
                </div>
            </div>

    )
}

export default CardColumn;