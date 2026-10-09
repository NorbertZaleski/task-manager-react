import BoardList from "../components/BoardList";
import useBoards from "../hooks/useBoards";

function BoardPage(){
    const [boards, loading, error] = useBoards();

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (boards.length === 0) return <div>Nie masz jeszcze żadnych tablic</div>;

    const board = useBoards();

    if (!board) return <p>Ładowanie tablicy...</p>;

    return <BoardList />
}

export default BoardPage;