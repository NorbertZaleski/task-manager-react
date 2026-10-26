import { Outlet } from "react-router";
import TopBar from "../../components/TopBar";
import useBoards from "../../hooks/useBoards";

function MainLayout(){

    const boardsState = useBoards();
    const {boards, loading, error, reload} = boardsState;

    if (loading && boards.length === 0) return <div className="flex items-center justify-center">Loading...</div>;
    if (error) return <div className="flex items-center justify-center">Error: {error}</div>;

    return(
        <div className="flex flex-col h-dvh overflow-hidden">
            <TopBar onBoardCreated = {reload}/>
            <main className="min-h-0 flex-1 overflow-hidden">
                <Outlet context={boardsState}/>
            </main>
        </div>
    )
}

export default MainLayout;