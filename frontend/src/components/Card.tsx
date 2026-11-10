import { Clock } from "lucide-react";
import { getDueStatus } from "../utils/dueDate";
import { getTextColor } from "../utils/getTextColor";
import { useLabels } from "../context/LabelsContext";
import type { Note } from "../types/types";

type CardProps = {
    note: Note;
    onOpen: () => void;
}

function Card({ note, onOpen }: CardProps) {
    const { labels } = useLabels();
    const noteLabels = labels.filter((l) => note.labelIds?.includes(l.id));
    const dueStatus = note.dueDate ? getDueStatus(note.dueDate, note.completed) : null;

    return (
        <div
            className="px-4 py-3 bg-(--card) flex flex-col text-start w-full wrap-break-word rounded-lg gap-1 cursor-grab active:cursor-grabbing
            outline-2 -outline-offset-2 outline-transparent hover:outline-(--border-active-textarea) transition-colors duration-30"
            draggable
            onDragStart={(e) => {
                e.dataTransfer.setData("text/plain", note.id);
                e.dataTransfer.effectAllowed = "move";
            }}
            onClick={onOpen}
        >
            {noteLabels.length > 0 && (
                <div className="flex flex-wrap gap-1 items-center w-full">
                    {noteLabels.map((label) => (
                        <span
                            key={label.id}
                            className={`text-xs font-medium px-2 min-h-6 rounded flex items-center justify-start max-w-full overflow-hidden select-none ${
                                label.title ? "min-w-10 " : "min-w-4"
                            }`}
                            style={{ backgroundColor: label.color, color: getTextColor(label.color) }}
                        >
                            <span className="truncate min-w-0">{label.title}</span>
                        </span>
                    ))}
                </div>
            )}

            <p className={`text-md pt-1 ${note.completed ? "line-through text-(--text-mute)" : ""}`}>
                {note.title}
            </p>

            <div className="pt-1">
                {note.dueDate && dueStatus && dueStatus !== "completed" && (
                    <Clock size={16} />
                )}
            </div>

        </div>
    );
}

export default Card;