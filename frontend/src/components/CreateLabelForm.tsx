import { useState } from "react";
import Button from "./Button";
import ColorPicker from "./ColorPicker";

type CreateLabelFormProps = {
    onSubmit: (data: { title: string; color: string }) => Promise<void>;
    onCancel: () => void;
};

function CreateLabelForm({ onSubmit, onCancel }: CreateLabelFormProps) {
    const [title, setTitle] = useState("");
    const [color, setColor] = useState("#3B82F6");
    const [submitting, setSubmitting] = useState(false);
    const [error, setError] = useState<string | null>(null);

    const handleSubmit = async () => {
        try {
            setSubmitting(true);
            setError(null);
            await onSubmit({ title: title.trim(), color });
        } catch (err) {
            console.error("Error:", err);
            setError(err instanceof Error ? err.message : "Failed to create label");
        } finally {
            setSubmitting(false);
        }
    };

    return (
        <div className="flex flex-col gap-3">
            <div className="flex items-center justify-center py-2">
                <span
                    className="text-xs font-medium px-2 h-4 min-w-10 rounded flex items-center max-w-full truncate"
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
                className="px-2 py-1 rounded bg-(--card)"
            />

            <ColorPicker value={color} onChange={setColor} />

            {error && <p className="text-sm text-red-400">{error}</p>}

            <div className="flex gap-2">
                <Button variant="primary" onClick={handleSubmit} disabled={submitting}>
                    {submitting ? "Creating..." : "Create"}
                </Button>
                <Button onClick={onCancel} disabled={submitting}>
                    Cancel
                </Button>
            </div>
        </div>
    );
}

export default CreateLabelForm;