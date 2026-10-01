import BoardList from "../components/BoardList";
import useBoards from "../hooks/useBoards";

function BoardPage(){
    const {boardId} = useParams();
    const board = useBoards(boardId);

    if (!board) return <p>Ładowanie tablicy...</p>;

    return <BoardList/>
}

export default BoardPage;