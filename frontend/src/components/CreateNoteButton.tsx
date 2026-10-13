import { Plus } from "lucide-react";
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
            className="flex w-full items-center gap-1 border-2 border-dashed p-1 text-sm font-semibold">
                <Plus size={18}/> Dodaj kartę
            </button>
        );
    }

    return (
       <form onSubmit={handleCreateNote} className="border-2 border-dashed p-2 flex flex-col gap-2">
            <input
                autoFocus
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Tytuł notatki"
            />
            <div className="flex gap-2 justify-center w-full">
                <button type="submit"><Plus /></button>
                <button type="button" onClick={() => setIsAdding(false)}>Anuluj</button>
            </div>
        </form>
    );
};

export default CreateNoteButton;