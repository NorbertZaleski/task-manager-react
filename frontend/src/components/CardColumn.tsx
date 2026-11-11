import type { Board, Column, Note, DragState, DropTarget } from "../types/types";
import Card from "./Card";
import { ChevronDown, ChevronUp, Ellipsis } from 'lucide-react'
import CreateNoteButton from "./CreateNoteButton";
import EditableText from "./EditableText";
import { Fragment, useRef, useState } from "react";
import OptionsModal from "./OptionsModal";
import { useDragScroll } from "../hooks/useDragScroll";

type CardColumnProps = {
    column: Column;
    board: Board;
    notes: Note[];
    drag: DragState;
    onDragChange: (drag: DragState) => void;
    dropTarget: DropTarget;
    onDropTargetChange: (t: DropTarget) => void;
    columnIndex: number;
    columnsCount: number;
    onMoveColumn: (columnId: string, newIndex: number) => void;
    onMoveNote: (noteId: string, columnId: string, index?: number) => void;
    onCreateNote: (columnId: string, content: string) => Promise<void>;
    onDeleteColumn: (boardId: string, columnId: string) => void;
    onOpenNote: (noteId: string) => void;
    onRenameColumn: (boardId: string, columnId: string, title: string) => void;
    onDropNote: (draggedId: string, targetNoteId: string, after: boolean) => void;
};

function Placeholder({
    height,
    onDrop,
}: {
    height: number;
    onDrop: (e: React.DragEvent) => void;
}) {
    return (
        <div
            style={{ height }}
            onDragOver={(e) => {
                if (!e.dataTransfer.types.includes("note-id")) return;
                e.preventDefault();
                e.stopPropagation();
            }}
            onDrop={(e) => {
                if (!e.dataTransfer.types.includes("note-id")) return;
                onDrop(e);
            }}
            className="w-full shrink-0 rounded-lg border border-dashed border-(--border-active-textarea) bg-white/5"
        />
    );
};

function CardColumn({column, board, notes, drag, onDragChange, onDropNote, dropTarget, onDropTargetChange, onMoveColumn, onMoveNote, onCreateNote, 
    onDeleteColumn, onOpenNote, onRenameColumn, columnIndex, columnsCount}: CardColumnProps) {
    const [isOptionsOpen, setIsOptionsOpen] = useState(false);
    const ellipsisRef = useRef<HTMLButtonElement>(null);
    const [isMoveColumnOpen, setIsMoveColumnOpen] = useState(false);
    const [isPositionListOpen, setIsPositionListOpen] = useState(false);

    const sorted = [...notes].sort((a, b) => (a.position ?? 0) - (b.position ?? 0));

    const target = dropTarget?.columnId === column.id ? dropTarget : null;

    const scrollRef = useRef<HTMLDivElement>(null);
    useDragScroll(scrollRef, !!drag);  

    function setTarget(noteId: string | null, after: boolean) {
        const same = dropTarget?.columnId === column.id
            && dropTarget.noteId === noteId && dropTarget.after === after;
        if (!same) onDropTargetChange({ columnId: column.id, noteId, after });
    }

    function resetDrag() {
        onDragChange(null);
        onDropTargetChange(null);
    };

    function handleDrop(e: React.DragEvent) {
        if (!e.dataTransfer.types.includes("note-id")) return;
            e.preventDefault();
            e.stopPropagation();
        const draggedId = e.dataTransfer.getData("note-id");
        const t = target;
        resetDrag();
        if (!draggedId) return;

        if (t?.noteId) { onDropNote(draggedId, t.noteId, t.after); return; }
        if (t) { onMoveNote(draggedId, column.id); return; }

        if (sorted.some((n) => n.id === draggedId)) return;
        onMoveNote(draggedId, column.id);
    };

    return(
            <div 
                className="bg-(--panel) rounded-xl pl-1 pr-2 py-2 flex flex-col
                w-70 max-h-[calc(100dvh-12rem)] min-h-0 shrink-0"
                onDragOver={(e) => {
                    if (!e.dataTransfer.types.includes("note-id")) return;
                    if (e.target !== e.currentTarget) return;
                    e.preventDefault();
                    e.stopPropagation();

                    const kids = Array.from(e.currentTarget.children) as HTMLElement[];
                    const lastVisible = [...kids].reverse().find(
                        (el) => el.getBoundingClientRect().height > 0
                    );
                    if (lastVisible && e.clientY <= lastVisible.getBoundingClientRect().bottom) return;

                    setTarget(null, false);
                }}
                onDrop={handleDrop}
                >
                <div className="flex shrink-0 text-left items-start justify-between max-w-full gap-2 px-2 py-1">

                    <EditableText
                        value={column.title}
                        maxLength={100}
                        onCommit={(title) => onRenameColumn(board.id, column.id, title)}
                        className="py-1 px-2 rounded-sm text-normal font-medium"
                        viewClassName="cursor-pointer"
                        editClassName="outline-0 field-sizing-content outline-2 outline-(--border-active-textarea) bg-(--bg-input)"
                    />

                    <div className="flex shrink-0 items-center gap-2 py-1 rounded-sm text-center">
                        <div className="text-sm select-none">{notes.length}</div>
                        <button 
                        ref={ellipsisRef}
                        type="button" 
                        onClick={() => setIsOptionsOpen(true)}
                        className="p-1 hover:bg-(--hover-white) flex items-center justify-center rounded-md text-(--text-mute)"
                        >
                            <Ellipsis size={18}/>
                        </button>

                        {isOptionsOpen && (
                            <OptionsModal
                                title="List actions"
                                anchorRef={ellipsisRef}
                                onClose={() => setIsOptionsOpen(false)}
                                options={[
                                    {
                                        id: "move",
                                        label: "Move column",
                                        onClick: () => {
                                            setIsOptionsOpen(false);
                                            setIsMoveColumnOpen(true);
                                            setIsPositionListOpen(false);
                                        },
                                    },
                                    {
                                        id: "delete",
                                        label: "Delete column",
                                        onClick: () => onDeleteColumn(board.id, column.id),
                                    },
                                ]}
                            />
                        )}

                        {isMoveColumnOpen && (
                            <OptionsModal
                                title="Move list"
                                anchorRef={ellipsisRef}
                                onClose={() => {
                                    setIsMoveColumnOpen(false);
                                    setIsPositionListOpen(false);
                                }}
                                compOptions={
                                    <div className="w-full flex flex-col gap-1">
                                        <button
                                            type="button"
                                            onClick={() => setIsPositionListOpen(v => !v)}
                                            className="w-full flex items-center justify-between px-2 py-1 text-left rounded-sm
                                            hover:bg-(--hover-white) text-sm"
                                        >
                                            <span>{columnIndex + 1}</span>
                                            <span className="text-(--text-mute) text-xs">
                                                {isPositionListOpen ? <ChevronUp size={16} /> : <ChevronDown size={16} />}
                                            </span>
                                        </button>

                                        {isPositionListOpen && (
                                            <div className="flex flex-col gap-0.5 max-h-60 overflow-y-auto">
                                                {Array.from({ length: columnsCount }, (_, i) => {
                                                    const isCurrent = i === columnIndex;
                                                    return (
                                                        <button
                                                            key={i}
                                                            type="button"
                                                            disabled={isCurrent}
                                                            onClick={() => {
                                                                if (!isCurrent) onMoveColumn(column.id, i);
                                                                setIsMoveColumnOpen(false);
                                                                setIsPositionListOpen(false);
                                                            }}
                                                            className={`text-left px-3 py-1 text-sm rounded-sm ${
                                                                isCurrent
                                                                    ? "text-(--text-mute) cursor-default"
                                                                    : "hover:bg-(--hover-white)"
                                                            }`}
                                                        >
                                                            {i + 1}
                                                            {isCurrent && " (current)"}
                                                        </button>
                                                    );
                                                })}
                                            </div>
                                        )}
                                    </div>
                                }
                            />
                        )}
                    </div>
                </div>

                <div 
                ref={scrollRef}
                className="flex flex-col gap-2 px-2 my-1 overflow-y-auto min-h-0 
                scrollbar-thin scroll-smooth scrollbar-thumb-gray-700 scrollbar-track-transparent overflow-auto"
                onDragOver={(e) => {
                    if (!e.dataTransfer.types.includes("note-id")) return;
                    if (e.target !== e.currentTarget) return;
                    e.preventDefault();
                    e.stopPropagation();

                    const container = e.currentTarget;
                    const cards = (Array.from(
                        container.querySelectorAll("[data-note-id]")
                    ) as HTMLElement[])
                        .map((el) => ({
                            id: el.dataset.noteId as string,
                            rect: el.getBoundingClientRect(),
                        }))
                        .filter((c) => c.rect.height > 0)
                        .sort((a, b) => a.rect.top - b.rect.top);

                    if (cards.length === 0) {
                        setTarget(null, false);
                        return;
                    }

                    // nad pierwszą kartą - wstaw na początek
                    if (e.clientY < cards[0].rect.top) {
                        setTarget(cards[0].id, false);
                        return;
                    }

                    // pod ostatnią kartą - wstaw na koniec
                    if (e.clientY > cards[cards.length - 1].rect.bottom) {
                        setTarget(null, false);
                        return;
                    }

                    // w gapie między dwiema kartami - wstaw po karcie wyżej
                    for (let i = 0; i < cards.length - 1; i++) {
                        const above = cards[i];
                        const below = cards[i + 1];
                        if (e.clientY >= above.rect.bottom && e.clientY <= below.rect.top) {
                            setTarget(above.id, true);
                            return;
                        }
                    }

                }}
                >
                    {sorted.map((note) => {
                        const isSource = drag?.id === note.id;
                        const isTarget = target?.noteId === note.id && !isSource;
                        const showInPlace = isSource && !dropTarget;

                        return (
                            <Fragment key={note.id}>
                                {drag && ((isTarget && !target!.after) || showInPlace) && (
                                    <Placeholder height={drag.height} onDrop={handleDrop} />
                                )}

                                <Card
                                    note={note}
                                    onOpen={() => onOpenNote(note.id)}
                                    onDropNote={onDropNote}
                                    isDragging={isSource}
                                    onDragStartNote={(id, height) => onDragChange({ id, height })}
                                    onDragHover={(id, after) => setTarget(id, after)}
                                    onDragEnd={resetDrag}
                                />

                                {drag && isTarget && target!.after && (
                                    <Placeholder height={drag.height} onDrop={handleDrop} />
                                )}
                            </Fragment>
                        );
                    })}

                    {drag && target && target.noteId === null && (
                        <Placeholder height={drag.height} onDrop={handleDrop} />
                    )}

                </div>

                <div className="shrink-0 px-2 pt-1">
                    <CreateNoteButton onCreate={(content) => onCreateNote(column.id, content)}></CreateNoteButton>
                </div>
            </div>

    )
}

export default CardColumn;