import BoardList from "../components/BoardList";
import useBoard from "../hooks/useBoard";

function BoardPage(){
    const [board, loading, error] = useBoard();

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (board.length === 0) return <div>Nie masz jeszcze żadnych tablic</div>;

    if (!board) return <p>Ładowanie tablicy...</p>;

    return <BoardList />
}

export default BoardPage;