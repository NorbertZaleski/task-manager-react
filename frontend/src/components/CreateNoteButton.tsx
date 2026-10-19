import { Plus, X } from "lucide-react";
import { useState } from "react";

type CreateNoteButtonprops = {
  onCreate: (content: string) => Promise<void>;
};

function CreateNoteButton({onCreate}: CreateNoteButtonprops){
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");

    async function handleCreateNote(e: React.FormEvent) {
        e.preventDefault();
        if (!title.trim()) return;

        try {
            await onCreate(title.trim());
            setTitle("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error in handleCreateNote:", error);
        }
    }

    if (!isAdding) {
        return (
            <button 
            type="button" 
            onClick={() => setIsAdding(true)} 
            className="flex w-full items-center text-center gap-1 p-1 text-sm font-semibold">
                <Plus size={16} /> Dodaj kartę
            </button>
        );
    }

    return (
       <form onSubmit={handleCreateNote} className="flex flex-col gap-3">
            <textarea
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tytuł notatki"
                className="bg-(--card) px-4 py-2 outline-0 rounded-lg w-full h-20 resize-none text-md"
            />
            <div className="flex gap-2 justify-start w-full">
                <button 
                type="submit"
                className="px-2 py-1 rounded-lg text-sm text-semibold text-(--card) bg-(--button)"
                >
                    Dodaj kartę
                </button>
                <button type="button" onClick={() => setIsAdding(false)}><X size={18}/></button>
            </div>
        </form>
    );
};

export default CreateNoteButton;