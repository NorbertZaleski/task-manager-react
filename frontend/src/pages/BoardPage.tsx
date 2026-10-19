import { useParams } from "react-router";
import BoardList from "../components/BoardList";
import useBoard from "../hooks/useBoard";
import { getBoardStyle } from "../utils/getBackgroundStyle";

function BoardPage(){
    const {boardId} = useParams<{boardId: string}>();
    const {board, setBoard, loading, error} = useBoard(boardId);

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (!board) return <div>Nie masz jeszcze żadnych tablic</div>;

    return (
        <div className="h-full w-full" style={getBoardStyle(board.background)}>
            <BoardList board={board} setBoard={setBoard} />
        </div>
    )
}

export default BoardPage;