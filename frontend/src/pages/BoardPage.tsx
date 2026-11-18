import { Navigate, useOutletContext, useParams } from "react-router";
import BoardList from "../components/BoardList";
import useBoard from "../hooks/useBoard";
import { getBoardStyle } from "../utils/getBackgroundStyle";
import type useBoards from "../hooks/useBoards";
import { LabelsProvider } from "../context/LabelsContext";
import { BoardPermissionsProvider } from "../context/BoardPermissionsContext";

type BoardsContext = ReturnType<typeof useBoards>;

function BoardPage(){
    const { boardId } = useParams<{boardId: string}>();
    const { board, setBoard, loading, error } = useBoard(boardId);
    const { updateBoardTitle, removeBoard } = useOutletContext<BoardsContext>();

    if (loading) return <div>Loading...</div>;
    if (error || !board) return <Navigate to="/boards" replace />;

    return (
        <BoardPermissionsProvider myRole={board.role} permissions={board.permissions}>
            <LabelsProvider boardId={boardId}>
                <div className="h-full w-full" style={getBoardStyle(board.background)}>
                    <BoardList key={board.id} board={board} setBoard={setBoard} onBoardRenamed={updateBoardTitle} onBoardDeleted={removeBoard}/>
                </div>
            </LabelsProvider>
        </BoardPermissionsProvider>
    )
}

export default BoardPage;