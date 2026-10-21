import type { Column, Note } from "../types/types";
import Card from "./Card";
import {Ellipsis} from 'lucide-react'
import CreateNoteButton from "./CreateNoteButton";
import EditableText from "./EditableText";

type CardColumnProps = {
    column: Column;
    notes: Note[];
    onMoveNote: (noteId: string, columnId: string) => void;
    onCreateNote: (columnId: string, content: string) => Promise<void>;
    onDeleteColumn: (columnId: string) => void;
    onOpenNote: (noteId: string) => void;
    onRenameColumn: (columnId: string, title: string) => void;
};

function CardColumn({column, notes, onMoveNote, onCreateNote, onDeleteColumn, onOpenNote, onRenameColumn}: CardColumnProps) {

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
                    onCommit={(title) => onRenameColumn(column.id, title)}
                    className="px-2 py-1 rounded-sm text-sm font-medium"
                    viewClassName="hover:bg-(--hover-white)"
                    editClassName="outline-0 field-sizing-content"
                />

                    <div className="flex shrink-0 items-center gap-2 py-1 rounded-sm text-center">
                        <div className="text-sm select-none">{notes.length}</div>
                        <button 
                        type="button" 
                        onClick={() => onDeleteColumn(column.id)}
                        className=""
                        >
                            <Ellipsis size={18}/> {/* tymczasowo działa jako deleteboard */}
                        </button>
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