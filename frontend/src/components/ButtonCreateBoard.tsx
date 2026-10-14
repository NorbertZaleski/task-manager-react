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
       <form onSubmit={handleCreateBoard} className="border-2 border-dashed p-2 flex flex-col gap-2">
            <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Board title"
            />
            <div className="flex gap-2 justify-center w-full">
                <button type="submit">Create</button>
                <button type="button" onClick={() => setIsAdding(false)}>Anuluj</button>
            </div>
        </form>
    )
}

export default ButtonCreateBoard;