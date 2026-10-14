import { Link } from "react-router";
import useBoards from "../hooks/useBoards";
import { useState } from "react";
import { X } from "lucide-react";

function FloatingBottomBar(){

    const {boards} = useBoards();
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            <aside className={`
            fixed bottom-3 left-1/2 border border-dashed h-fit w-fit
            `}>
                {showSidebar ? (
                    <div>
                        <div className="flex flex-col p-4">
                            <X onClick={()=> setShowSidebar(false)}/>
                            <div className="flex gap-2">
                                {boards.map((board)=>(
                                    <Link key={board.id} to={`/boards/${board.id}`}>{board.title}</Link>
                                ))}
                            </div>

                        </div>
                    </div>
                ) : (
                    <button
                    type="button"
                    onClick={() => setShowSidebar(true)}>
                        Swap board
                    </button>
                )}

            </aside>
        </>
    )
}

export default FloatingBottomBar;