import type { Board } from "../types/types";

type BoardCardProps = {
    board: Board;
}

function BoardCard({board}: BoardCardProps){
    return(
        <>
            <div className="p-4 w-4 h-4 border rounded">
                {board.title}
            </div>
        </>
    )
}

export default BoardCard;