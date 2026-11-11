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
    editing?: boolean;
    clickToEdit?: boolean;
};

function EditableText({ value, onCommit, onEditingChange, multiline = false, allowEmpty = false, showActions = false, editing, maxLength, 
    placeholder = "Add title...", className = "", viewClassName = "", editClassName = "", clickToEdit = true}: EditableTextProps) {
    const [isEditing, setIsEditing] = useState(false);
    const [focused, setFocused] = useState(true);
    const [draft, setDraft] = useState(value);
    const ref = useRef<HTMLTextAreaElement>(null);

    useEffect(() => {
        onEditingChange?.(isEditing);
    }, [isEditing]);

    useEffect(() => {
        if (editing === undefined) return;
        if (editing) {
            setDraft(value);
            setIsEditing(true);
        } else {
            setIsEditing(false);
        }
    }, [editing]);

    useLayoutEffect(() => {
        const el = ref.current;
        if (!isEditing || !el) return;
        el.style.height = "auto";
        el.style.height = `${el.scrollHeight}px`;
    }, [draft, isEditing]);

    const start = () => {
        setDraft(value);
        setIsEditing(true);
        setFocused(true);
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

    const base = "block min-w-0 text-left border-0 m-0 appearance-none whitespace-pre-wrap wrap-break-word";

    if (isEditing) {
        const textarea = (
            <textarea
                ref={ref}
                autoFocus
                rows={1}
                maxLength={maxLength}
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onBlur={()=> {
                    if (showActions) setFocused(false);
                    else commit();   
                }}
                onFocus={(e) => {
                    setFocused(true);
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
                className={`${base} ${className} ${editClassName || "bg-transparent"} ${
                focused
                        ? "outline-(--border-active-textarea)"
                        : "outline-(--border-mute)"
                } resize-none overflow-hidden`}
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
            onClick={clickToEdit ? start : undefined}
            className={`${base} ${className} ${viewClassName || "bg-transparent"} ${
                clickToEdit ? "" : "cursor-default"
            }`}
    >
            {value || placeholder}
    </button>
    );
}

export default EditableText;