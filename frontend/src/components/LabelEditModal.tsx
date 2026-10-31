import { useState } from "react";
import ColorPicker from "./ColorPicker";
import Button from "./Button";
import type { Label } from "../types/types";

type LabelEditModalProps = {
    onSubmit: (data: { title: string; color: string }) => Promise<void>;
    onCancel: () => void;
    label: Label;
}

function LabelEditModal({onSubmit, onCancel, label}: LabelEditModalProps) {
    const [title, setTitle] = useState(label.title ?? "");
    const [color, setColor] = useState(label.color ?? "#000000");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError(null);
            await onSubmit({title: title.trim(), color});
        } catch (error) {
            console.error("Error:", error);
            setError(error instanceof Error ? error.message : "Failed to edit label");
        } finally {
            setSubmitting(false)
        }
    };

    return (
        <>
            <div className="flex flex-col gap-3">

                <div className="flex items-center justify-center py-2">
                    <span
                        className="text-xs font-medium px-2 py-1 min-w-20 rounded text-center whitespace-normal wrap-break-word"
                        style={{ backgroundColor: color}}
                    >
                        {title.trim()}
                    </span>
                </div>

                <input
                    value={title}
                    onChange={(e) => setTitle(e.target.value)}
                    onKeyDown={(e) => {
                        if (e.key === "Enter" && !submitting) handleSubmit();
                    }}
                    placeholder="Label title (optional)"
                    maxLength={30}
                    autoFocus
                    className="px-2 py-1 rounded bg-(--bg-input) w-full min-w-0 truncate overflow-hidden"
                />

                <ColorPicker value={color} onChange={setColor}/>
            
                {error && <p className="text-sm text-red-400">{error}</p>}

                <div className="flex justify-center gap-2">
                    <Button
                    variant="primary"
                    onClick={handleSubmit}
                    disabled={submitting}
                    >
                        Save
                    </Button>
                    <Button
                    onClick={onCancel}
                    >
                        Cancel
                    </Button>
                </div>
            </div>
        </>
    )
}

export default LabelEditModal;