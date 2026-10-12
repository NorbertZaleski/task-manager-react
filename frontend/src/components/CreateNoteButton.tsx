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
            <div className="border-2 border-dashed py-4">
                <button type="button" onClick={() => setIsAdding(true)} className="text-2xl">
                    +
                </button>
            </div>
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
            <div className="flex gap-2 justify-center">
                <button type="submit">Dodaj</button>
                <button type="button" onClick={() => setIsAdding(false)}>Anuluj</button>
            </div>
        </form>
    );
};

export default CreateNoteButton;