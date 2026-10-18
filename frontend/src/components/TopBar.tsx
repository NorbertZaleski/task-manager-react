import { Bell, Circle } from "lucide-react";
import ButtonCreateBoard from "./ButtonCreateBoard";
import { boardsService } from "../services/boards.service";
import { Link, useNavigate } from "react-router";
import type { BoardBackground } from "../types/types";

type TopBarPops = { 
    onBoardCreated: () => void 
};

function TopBar({onBoardCreated}: TopBarPops) {
    const navigate = useNavigate();

    async function handleCreateBoard(title: string, background: BoardBackground){
        try {
            const newBoard = await boardsService.createBoard({title, background});
            navigate(`/boards/${newBoard.id}`);
            onBoardCreated();
        } catch (error) {
            console.log("Error in createBoard function: ", error);
        }
    };

    return (
        <div className="sticky top-0 left-0 w-full flex shrink-0 justify-between text-(--text)"> 
            <Link to={`/boards`}>Logo</Link>
            <div className="flex gap-2">
                <input className="border" placeholder="Search"></input>
                <ButtonCreateBoard 
                onCreate={handleCreateBoard} />
            </div>
            <div className="flex gap-2">
                <div><Bell/></div>
                <div><Circle/></div>
            </div>
        </div>
    )
};

export default TopBar;