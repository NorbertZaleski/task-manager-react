import { useState } from "react";

type EditableTextProps = {
    value: string;
    onCommit: (value: string) => void;
    maxLength?: number;
    placeholder?: string;
    className?: string;
    viewClassName?: string;
    editClassName?: string;
};

function EditableText({ value, onCommit, maxLength, placeholder = "Add title...", className = "", viewClassName = "", editClassName = "", }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(value);

    const start = () => {
        setDraft(value);
        setIsEditing(true);
    };

    const cancel = () => {
        setDraft(value);
        setIsEditing(false);
    };

    const commit = () => {
        const trimmed = draft.trim();
        if (trimmed && trimmed !== value) {
            onCommit(trimmed);
        } else {
            setDraft(value);
        }
        setIsEditing(false);
    };

    const base = "block min-w-0 text-left bg-transparent border-0 m-0 appearance-none";

    if (isEditing) {
        return (
            <input
                autoFocus
                maxLength={maxLength}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onKeyDown={(e) => {
                    if (e.key === "Enter") commit();
                    if (e.key === "Escape") cancel();
                }}
                className={`${base} ${className} ${editClassName}`}
            />
        );
    }

    return (
       <button
            type="button"
            onClick={start}
            className={`${base} cursor-pointer wrap-break-word ${className} ${viewClassName}`}
        >
            {value || placeholder}
        </button>
    );
}

export default EditableText;