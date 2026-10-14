import type { Note } from "../types/types";

type CardProps = {
    note: Note;
    onOpen: () => void;
}

function Card({note, onOpen}: CardProps) {
    return (
        <div
        className="border-2 p-2 bg-(--card) flex flex-col text-start w-full wrap-break-word whitespace-pre-wrap
        cursor-grab active:cursor-grabbing"
        draggable 
        onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", note.id);
        e.dataTransfer.effectAllowed = "move";
      }}
        onClick={onOpen}
        >
            <p className="text-md pb-2">{note.content}</p>
            <p className="text-sm border-2 w-fit px-2 py-1 bg-(--red)">{note.category}</p>
        </div>
    )
}

export default Card;