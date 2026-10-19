import type { Note } from "../types/types";

type CardProps = {
    note: Note;
    onOpen: () => void;
}

function Card({note, onOpen}: CardProps) {
    return (
        <div
        className="px-4 py-2 bg-(--card) flex flex-col text-start w-full wrap-break-word whitespace-pre-wrap rounded-xl gap-1
        cursor-grab active:cursor-grabbing"
        draggable 
        onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", note.id);
        e.dataTransfer.effectAllowed = "move";
      }}
        onClick={onOpen}
        >
            <p className="text-sm rounded w-10 h-4 bg-(--red)">{/*fix note.label i custom color*/}</p>
            <p className="text-md pb-2">{note.content}</p>
        </div>
    )
}

export default Card;