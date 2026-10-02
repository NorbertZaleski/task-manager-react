import BoardCard from "../components/BoardCard";
import type { Board } from "../types/types";

type BoardsProps = {
    boards: Board[];
}

function BoardsPage({boards}: BoardsProps){


    return (
        <>
            {boards.map((board)=>{
                <BoardCard key={board.id} board={board}></BoardCard>
            })}
        </>
    )
}

export default BoardsPage;