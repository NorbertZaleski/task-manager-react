import { useState } from "react";
import Button from "./Button";
import { fromDateInputs, toDateInputs } from "../utils/dueDate";

type DueDateFormProps = {
    value?: string | null;
    onSave: (dueDate: string | null) => void | Promise<void>;
};

function DueDateForm({ value, onSave }: DueDateFormProps) {
    const initial = toDateInputs(value);
    const [date, setDate] = useState(initial.date);
    const [time, setTime] = useState(initial.time || "12:00");
    const [saving, setSaving] = useState(false);

    async function handleSave() {
        if (!date) return;
        setSaving(true);
        try {
            await onSave(fromDateInputs(date, time));
        } finally {
            setSaving(false);
        }
    }

    async function handleRemove() {
        setSaving(true);
        try {
            await onSave(null);
        } finally {
            setSaving(false);
        }
    }

    const inputClass =
        "w-full rounded-xs px-3 py-2 text-sm bg-transparent outline-1 outline-(--border-mute) focus:outline-(--mute) scheme-dark";

    return (
        <div className="flex flex-col gap-3 w-full">
            <label className="flex flex-col gap-1 text-xs font-semibold">
                Date
                <input
                    type="date"
                    value={date}
                    onChange={(e) => setDate(e.target.value)}
                    className={inputClass}
                />
            </label>

            <label className="flex flex-col gap-1 text-xs font-semibold">
                Time
                <input
                    type="time"
                    value={time}
                    onChange={(e) => setTime(e.target.value)}
                    className={inputClass}
                />
            </label>

            <div className="flex gap-1">
                <Button variant="primary" className="w-full" onClick={handleSave}>
                    {saving ? "Saving..." : "Save"}
                </Button>
                {value && (
                    <Button className="w-full" onClick={handleRemove}>
                        Remove
                    </Button>
                )}
            </div>
        </div>
    );
}

export default DueDateForm;