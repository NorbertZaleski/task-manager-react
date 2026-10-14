import { Link } from "react-router";
import useBoards from "../hooks/useBoards";
import { ArrowLeft, ArrowRight } from "lucide-react";
import { useState } from "react";

function NavSidebar(){

    const {boards} = useBoards();
    const [showSidebar, setShowSidebar] = useState(true);

    return (
        <>
            <aside className={`
            fixed top-0 left-0 border border-dashed h-dvh w-1/8
            ${showSidebar ? 'w-1/8' : 'w-fit h-fit'}
            `}>
                <div className="">
                    { showSidebar ? (
                        <ArrowLeft onClick={()=>setShowSidebar(false)}/>
                        
                    ) : (
                        <ArrowRight onClick={()=>setShowSidebar(true)}/>
                    )}
                </div>
                {showSidebar && (
                    <div>
                        <Link to={`/boards`}>
                            <div className="text-xl">Boards</div>
                        </Link>
                        {boards.map((board)=>(
                            <Link key={board.id} to={`/boards/${board.id}`}>{board.title}</Link>
                        ))}
                    </div>
                )}

            </aside>
        </>
    )
}

export default NavSidebar;