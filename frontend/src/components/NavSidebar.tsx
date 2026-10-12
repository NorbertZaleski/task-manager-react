import { Link } from "react-router";
import useBoards from "../hooks/useBoards";

function NavSidebar(){

    const {boards} = useBoards();

    return (
        <>
            <aside>
                {boards.map((board)=>(
                    <Link key={board.id} to={`/boards/${board.id}`}>{board.title}</Link>
                ))}
            </aside>
        </>
    )
}

export default NavSidebar;