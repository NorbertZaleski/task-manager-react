import { Link } from "react-router";
import useBoards from "../hooks/useBoards";
import { useState } from "react";
import { X } from "lucide-react";

function FloatingBottomBar(){

    const {boards} = useBoards();
    const [showSidebar, setShowSidebar] = useState(false);

    return (
        <>
            <div className={`
            fixed bottom-3 left-1/2 -translate-x-1/2 h-fit w-fit flex bg-(--panel) border-(--card) border-2 rounded-md p-2 py-2 font-semibold
            `}>
                {showSidebar ? (
                    <div>
                        <div className="flex flex-col justify-between text-center w-50 h-20">
                            <button 
                            type="button" 
                            onClick={() => setShowSidebar(false)} 
                            aria-label="Close"
                            className="self-end"
                            >
                                <X size={16}/>
                            </button>
                            <div className="flex gap-2">
                                {boards.map((board)=>(
                                    <Link key={board.id} to={`/boards/${board.id}`}>{board.title}</Link>
                                ))}
                            </div>

                        </div>
                    </div>
                ) : (
                    <div className="flex gap-2">
                        <button>
                            Calendar
                        </button>
                        <button>
                            Board
                        </button>
                        <button
                        type="button"
                        onClick={() => setShowSidebar(true)}
                        >
                            Swap board
                        </button>
                    </div>
                )}

            </div>
        </>
    )
}

export default FloatingBottomBar;