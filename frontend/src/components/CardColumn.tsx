import type { Column, Note } from "../types/types";
import Card from "./Card";
import {EllipsisVertical} from 'lucide-react'
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
                className="border-t-(--red) border-t-8 bg-(--panel) 
                p-2 flex flex-col gap-2 w-55 max-h-full min-h-0 shrink-0"
                onDragOver={(e)=> e.preventDefault()}
                onDrop={(e)=>{
                    e.preventDefault();
                    const noteId = e.dataTransfer.getData("text/plain");
                    onMoveNote(noteId, column.id);
                }}
                >
                <div className="flex shrink-0 text-center justify-between p-1">
                    <div className="bg-(--red) w-6 h-6 border-2"></div>
                    
                    {isEditingColumnTitle ? (
                        <input
                            autoFocus
                            maxLength={40}
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
                            className="text-lg text-center border-b"
                        />
                    ) : (
                        <button type="button" onClick={() => setIsEditingColumnTitle(true)}>
                            <p className="text-lg shrink-0">{column.title}</p>
                        </button>
                    )}

                    <div className="flex items-center justify-between text-center gap-2">
                        <div className="text-md">{notes.length}</div>
                        <button type="button" onClick={() => onDeleteColumn(column.id)}>
                            <EllipsisVertical size={20}/>
                        </button>
                    </div>
                </div>

                <div className="flex flex-col flex-1 gap-1 overflow-y-auto min-h-0">
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