import { Plus, X } from "lucide-react";
import { useRef, useState } from "react";
import Button from "./Button";

type CreateNoteButtonprops = {
    onCreate: (content: string) => Promise<void>;
};

function CreateNoteButton({onCreate}: CreateNoteButtonprops){
    const [isAdding, setIsAdding] = useState(false);
    const [title, setTitle] = useState("");
    const [submitting, setSubmitting] = useState(false);
    const submittingRef = useRef(false);

    async function handleCreateNote(e: React.FormEvent) {
        e.preventDefault();
        submitNote();
    }

    if (!isAdding) {
        return (
            <Button 
            type="submit" 
            variant="ghost"
            onClick={() => setIsAdding(true)} 
            className="flex w-full items-center text-left justify-start gap-1 p-1 text-sm font-semibold cursor-pointer">
                <Plus size={16} /> Add card
            </Button>
        );
    }

    async function submitNote() {
        const trimmed = title.trim();
        if (!trimmed || submittingRef.current) return;

        submittingRef.current = true;
        setSubmitting(true);
        try {
            await onCreate(trimmed);
            setTitle("");
            setIsAdding(false);
        } catch (error) {
            console.error("Error in submitNote:", error);
        } finally {
            submittingRef.current = false;
            setSubmitting(false);
        }
    }

    function cancelAdding() {
        setTitle("");
        setIsAdding(false);
    }

    return (
       <form 
       onSubmit={handleCreateNote}
       onBlur={(e) => {
            if (!e.currentTarget.contains(e.relatedTarget as Node | null)) {
                cancelAdding();
            }
       }}
       className="flex flex-col gap-3
       ">
            <div className="rounded-md overflow-hidden bg-(--card)">
                <textarea
                    autoFocus
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    placeholder="Note title"
                    maxLength={400}
                    onKeyDown={(e) => {
                                if (e.key === "Enter" && !e.shiftKey) {
                                    e.preventDefault();
                                    submitNote();
                                }
                                if (e.key === "Escape") {
                                    cancelAdding();
                                }
                            }}
                    className="px-4 py-3 outline-0 w-full h-20 resize-none text-md 
                    scrollbar-gutter-stable scrollbar-thin scroll-smooth scrollbar-thumb-gray-700 scrollbar-track-transparent"
                />
            </div>
            <div className="flex gap-2 justify-start w-full">
                <Button
                variant="primary"
                type="submit"
                disabled={submitting || !title.trim()}
                className="disabled:opacity-60"
                >
                    <span className="font-semibold text-sm">Add card</span>
                </Button>
                <Button
                type="button" 
                onClick={() => cancelAdding()}
                className="px-2 border-none"
                >
                    <X size={18}/>
                </Button>
            </div>
        </form>
    );
};

export default CreateNoteButton;