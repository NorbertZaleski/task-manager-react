import { useEffect, useLayoutEffect, useRef, useState } from "react";
import Button from "./Button";

type EditableTextProps = {
    value: string;
    onCommit: (value: string) => void;
    onEditingChange?: (editing: boolean) => void;
    maxLength?: number;
    placeholder?: string;
    multiline?: boolean;
    allowEmpty?: boolean;
    showActions?: boolean;
    className?: string;
    viewClassName?: string;
    editClassName?: string;
};

function EditableText({ value, onCommit, onEditingChange, multiline = false, allowEmpty = false, showActions = false, maxLength, placeholder = "Add title...", className = "", viewClassName = "", editClassName = "", }: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [draft, setDraft] = useState(value);
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        onEditingChange?.(isEditing);
    }, [isEditing]);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!isEditing || !el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [draft, isEditing]);

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
        if (trimmed !== value && (allowEmpty || trimmed)) onCommit(trimmed);
        else setDraft(value);
        setIsEditing(false);
    };

    const base = "block min-w-0 text-left bg-transparent border-0 m-0 appearance-none";

    if (isEditing) {
        const textarea = (
            <textarea
                ref={ref}
                autoFocus
                rows={1}
                maxLength={maxLength}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={commit}
                onFocus={(e) => {
                    const len = e.target.value.length;
                    e.target.setSelectionRange(len, len);
                }}
                onKeyDown={(e) => {
                    e.stopPropagation();
                    if (e.key === "Enter" && !(multiline && e.shiftKey)) {
                        e.preventDefault();
                        commit();
                    }
                    if (e.key === "Escape") cancel();
                }}
                className={`${base} ${className} ${editClassName} resize-none overflow-hidden`}
            />
        );

        if (!showActions) return textarea;

        return (
            <div className="flex flex-col gap-2">
                {textarea}
                <div className="flex gap-1">
                    <Button
                        variant="primary"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={commit}
                    >
                        Save
                    </Button>
                    <Button
                        variant="ghost"
                        onMouseDown={(e) => e.preventDefault()}
                        onClick={cancel}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        );
    }

    return (
       <button
            type="button"
            onClick={start}
            className={`${base} wrap-break-word ${className} ${viewClassName}`}
        >
            {value || placeholder}
        </button>
    );
}

export default EditableText;