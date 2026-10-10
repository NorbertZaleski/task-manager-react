import { useParams } from "react-router";
import BoardList from "../components/BoardList";
import useBoard from "../hooks/useBoard";

function BoardPage(){
    const {boardId} = useParams<{boardId: string}>();
    const {board, loading, error} = useBoard(boardId);

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (!board) return <div>Nie masz jeszcze żadnych tablic</div>;

    if (!board) return <p>Ładowanie tablicy...</p>;

    return <BoardList board={board} />
}

export default BoardPage;