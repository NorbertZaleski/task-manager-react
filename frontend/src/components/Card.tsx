import type { Note } from "../constants/types";

type CardProps = {
    note: Note[];
};

function Card({note}: CardProps) {
    return (
        <div>
            <div>{note.content}</div>
            <div>{note.category}</div>
        </div>
    )
}

export default Card;