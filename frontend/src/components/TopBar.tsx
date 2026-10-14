import { Bell, Circle } from "lucide-react";
import ButtonCreateBoard from "./ButtonCreateBoard";
import { boardsService } from "../services/boards.service";
import { useNavigate } from "react-router";



function TopBar() {
    const navigate = useNavigate();

    async function handleCreateBoard(title: string){
        try {
            const newBoard = await boardsService.createBoard({title});
            navigate(`/boards/${newBoard.id}`);
        } catch (error) {
            console.log("Error in createBoard function: ", error);
        }
    };
//fix width
    return (
        <div className="sticky top-0 left-0 w-full bg-blue flex flex-1 justify-between text-(--text)"> 
            <div>Logo</div>
            <div className="flex gap-2">
                <div>Search</div> 
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