import { ChevronLeft, Ellipsis, X } from "lucide-react";
import { useState } from "react";

type ButtonCreateBoardProps = {
    onCreate: (title: string) => Promise<void>;
}

function ButtonCreateBoard({onCreate}: ButtonCreateBoardProps) {

    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");

    async function handleCreateBoard(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await onCreate(title.trim());
            setTitle("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error in handleCreateBoard:", error);
        }
    }

    if (!isAdding) {
        return (
            <button 
            type="button" 
            onClick={() => setIsAdding(true)} 
            className="flex w-full items-center text-sm">
                Create board
            </button>
        );
    }

    return (
        <div className="relative">

            <button type="button" onClick={() => setIsAdding(true)}>Create</button>
            {isAdding && (
                <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsAdding(false)} />
                    <form 
                    onSubmit={handleCreateBoard} 
                    className="absolute border shadow-lg p-2 flex flex-col gap-2">
            
                    <div>
                        <div className="flex justify-between text-center">
                            <ChevronLeft />
                            <h3>Create board</h3>
                            <X type="button" onClick={() => setIsAdding(false)}/>
                        </div>
                        <div className="border h-max-fit">
                            preview board
                        </div>

                        <div>
                            <h4>Background</h4>

                            <div>
                                mapa backgroundów - 4 zdj unsplash i 5 kolorów, ostatni button poniżej
                                <div>
                                    4 zdj unsplash
                                </div>
                                <div>
                                    kolory + button
                                    <button type="button" 
                                    className="
                                    ">
                                        <Ellipsis />
                                    </button>
                                </div>
                            </div>

                            <input
                                autoFocus
                                value={title}
                                onChange={(e) => setTitle(e.target.value)}
                                placeholder="Board title"
                            />
                            {(!title) && (
                                <p>Board title is required</p>
                            )}

                            <div>
                                Visibility options
                            </div>

                            <div className="flex gap-2 justify-center w-full">
                                <button type="submit">Create</button>
                            </div>
                        </div>
                    </div>

                </form>
                </>
            )}
            
        </div>
    )
}

export default ButtonCreateBoard;