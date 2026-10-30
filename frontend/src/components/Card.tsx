import { useLabels } from "../context/LabelsContext";
import type { Note } from "../types/types";
import { getTextColor } from "../utils/getTextColor";

type CardProps = {
    note: Note;
    onOpen: () => void;
}

function Card({note, onOpen}: CardProps) {
    const { labels } = useLabels();
    const noteLabels = labels.filter((l)=> note.labelIds?.includes(l.id));

    return (
        <div
        className="px-4 py-2 bg-(--card) flex flex-col text-start w-full wrap-break-word whitespace-pre-wrap rounded-xl gap-1
        cursor-grab active:cursor-grabbing"
        draggable 
        onDragStart={(e) => {
        e.dataTransfer.setData("text/plain", note.id);
        e.dataTransfer.effectAllowed = "move";
      }}
        onClick={onOpen}
        >
            {noteLabels.length > 0 && (
                <div className="flex flex-wrap gap-1">
                {noteLabels.map((label) => (
                    <span
                    key={label.id}
                    className="text-xs font-medium p-2 h-4 min-w-fit rounded flex items-center max-w-full truncate"
                    style={{ backgroundColor: label.color, color: getTextColor(label.color) }}
                    >
                        {label.title}
                    </span>
                ))}
                </div>
            )}
            <p className="text-md pb-2">{note.title}</p>
        </div>
    )
}

export default Card;