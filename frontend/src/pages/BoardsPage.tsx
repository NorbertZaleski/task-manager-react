import { Link, useOutletContext } from "react-router";
import BoardCard from "../components/BoardCard";
import useBoards from "../hooks/useBoards";

type BoardsContext = ReturnType<typeof useBoards>;

function BoardsPage(){
    const {boards}= useOutletContext<BoardsContext>();

    if (boards.length === 0) return <div>You have no boards</div>;

    return (
        <>
            <div className="flex m-4">
                <div className="flex gap-4 flex-wrap">
                    {boards.map((board)=>(
                        <Link key={board.id} to={`/boards/${board.id}`}>
                            <BoardCard board={board}></BoardCard>
                        </Link>
                    ))}
                </div>
            </div>
        </>
    )
}

export default BoardsPage;