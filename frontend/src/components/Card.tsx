import type { Note } from "../types/types";

type CardProps = {
    note: Note;
};

function Card({note}: CardProps) {
    return (
        <div
        className="border-2 p-2 bg-(--card) flex flex-col text-start w-full"
        draggable onDragStart={(e)=> e.dataTransfer.setData("text/plain", String(note.id))}
        >
            <p className="text-md pb-2">{note.content}</p>
            <p className="text-sm border-2 w-fit px-2 py-1 bg-(--red)">{note.category}</p>
        </div>
    )
}

export default Card;