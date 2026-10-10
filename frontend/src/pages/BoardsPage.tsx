import { Link } from "react-router";
import BoardCard from "../components/BoardCard";
import useBoards from "../hooks/useBoards";

function BoardsPage(){
    const {boards, loading, error} = useBoards();

    if (loading) return <div>Ładowanie...</div>;
    if (error) return <div>Błąd: {error}</div>;
    if (boards.length === 0) return <div>Nie masz jeszcze żadnych tablic</div>;

    return (
        <>
            <div className="flex gap-2 border border-black">
                {boards.map((board)=>(
                <Link key={board._id} to={`/boards/${board._id}`} className="flex w-fit">
                    <BoardCard key={board._id} board={board}></BoardCard>
                </Link>
            ))}
            </div>
        </>
    )
}

export default BoardsPage;