import { useOutletContext, useParams } from "react-router";
import BoardList from "../components/BoardList";
import useBoard from "../hooks/useBoard";
import { getBoardStyle } from "../utils/getBackgroundStyle";
import type useBoards from "../hooks/useBoards";

type BoardsContext = ReturnType<typeof useBoards>;

function BoardPage(){
    const { boardId } = useParams<{boardId: string}>();
    const { board, setBoard, loading, error } = useBoard(boardId);
    const { updateBoardTitle, removeBoard } = useOutletContext<BoardsContext>();

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (!board) return <div>Nie masz jeszcze żadnych tablic</div>;

    return (
        <div className="h-full w-full" style={getBoardStyle(board.background)}>
            <BoardList board={board} setBoard={setBoard} onBoardRenamed={updateBoardTitle} onBoardDeleted={removeBoard} />
        </div>
    )
}

export default BoardPage;