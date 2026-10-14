import { useState, type CSSProperties } from "react";
import type { Board, BoardBackground } from "../types/types";
import { Dot } from "lucide-react";

type BoardCardProps = {
    board: Board;
}

function BoardCard({board}: BoardCardProps){

    const [isActive, setIsActive] = useState(false);

    const getBackgroundStyle = (bg?: BoardBackground): CSSProperties => {
        if (!bg) return {backgroundColor: "#9ca3af"};

        if (bg.type === "image") {
            return {
                backgroundImage: `url(${bg.value})`,
                backgroundSize: "cover",
                backgroundPosition: "center",
            };
        }
        return {backgroundColor: bg.value};
    };

    return (
        <>
            <div className="w-fit h-fit min-w-50 border rounded flex flex-col">
                <div className="w-full h-20" style={getBackgroundStyle(board.background)}></div>
                <div className="py-3 px-2">{board.title}</div>
                {isActive ? (
                    <div className="size-fit border rounded-4xl"><Dot size={48}/></div> //tutaj zrobić wybrany board kind absolute po lewej na górze karty
                ) : (
                    <div></div>
                )}
            </div>
        </>
    )
}

export default BoardCard;