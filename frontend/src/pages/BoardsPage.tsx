import { Link, useOutletContext } from "react-router";
import BoardCard from "../components/BoardCard";
import useBoards from "../hooks/useBoards";

type BoardsContext = ReturnType<typeof useBoards>;

function BoardsPage(){
    const {boards}= useOutletContext<BoardsContext>();

    if (boards.length === 0) return <div>Nie masz jeszcze żadnych tablic</div>;

    return (
        <>
            <div className="flex gap-2 border border-black">
                {boards.map((board)=>(
                <Link key={board.id} to={`/boards/${board.id}`}>
                    <BoardCard board={board}></BoardCard>
                </Link>
            ))}
            </div>
        </>
    )
}

export default BoardsPage;