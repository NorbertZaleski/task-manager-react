import type { Column, Note } from "../types/types";
import Card from "./Card";
import {Ellipsis} from 'lucide-react'
import CreateNoteButton from "./CreateNoteButton";
import { useState } from "react";

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

    const [isEditingColumnTitle, setIsEditingColumnTitle] = useState(false);
    const [draftColumnTitle, setDraftColumnTitle] = useState(column.title);

    const commitRename = () => {
        const trimmed = draftColumnTitle.trim();
        if (trimmed && trimmed !== column.title) {
            onRenameColumn(column.id, trimmed);
        } else {
            setDraftColumnTitle(column.title);
        }
        setIsEditingColumnTitle(false);
    };

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
                    
                    {isEditingColumnTitle ? (
                        <input
                            autoFocus
                            maxLength={30}
                            value={draftColumnTitle}
                            onChange={(e) => setDraftColumnTitle(e.target.value)}
                            onBlur={commitRename}
                            onKeyDown={(e) => {
                                if (e.key === "Enter") commitRename();
                                if (e.key === "Escape") {
                                    setDraftColumnTitle(column.title);
                                    setIsEditingColumnTitle(false);
                                }
                            }}
                            className="field-sizing-content outline-0 px-2 py-1 min-w-0 text-sm text-left font-medium"
                        />
                    ) : (
                        <button 
                        type="button" 
                        onClick={() => setIsEditingColumnTitle(true)}
                        className="min-w-0 text-left"
                        >
                            <p className="field-sizing-content px-2 py-1 rounded-sm text-sm font-medium text-left wrap-break-word hover:bg-(--hover-white)">
                                {column.title}
                            </p>
                        </button>
                    )}

                    <div className="flex shrink-0 items-center gap-2 py-1 rounded-sm text-center">
                        <div className="text-sm select-none">{notes.length}</div>
                        <button 
                        type="button" 
                        onClick={() => onDeleteColumn(column.id)}
                        className=""
                        >
                            <Ellipsis size={18}/>
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