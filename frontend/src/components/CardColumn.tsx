import type { Note } from "../types/types";
import Card from "./Card";

type CardProps = {
    notes: Note[];
};

function CardColumn({notes}: CardProps) {
    return(
        <>
            <div className="border-t-red-600 border-t-8 bg-mauve-400 p-2">
                <div className="flex flex-row gap-2">
                    <div className="bg-red-600 w-6 h-6 border-2"></div>
                    <p>column title</p>
                    <div>{notes.length}</div>
                    <div>trashbin</div>
                </div>

                {notes.map((note) => (
                    <Card key={note.id} note={note} />
                ))}

                <div className="border-2 border-dashed py-4 text-2xl">+</div>
            </div>
        </>
)
}

export default CardColumn;