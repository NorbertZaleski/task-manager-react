import { useEffect, useRef, useState } from "react";
import { ChevronDown, ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import Button from "./Button";
import { fromDateInputs, toDateInputs } from "../utils/dueDate";

type DueDateFormProps = {
    value?: string | null;
    onSave: (dueDate: string | null) => void | Promise<void>;
};

const pad = (n: number) => String(n).padStart(2, "0");

const WEEKDAYS = ["Mo", "Tu", "We", "Th", "Fr", "Sa", "Su"];
const TIME_OPTIONS = Array.from({ length: 48 }, (_, i) => {
    const mins = (9 * 60 + i * 30) % (24 * 60);
    return `${pad(Math.floor(mins / 60))}:${pad(mins % 60)}`;
});

const toISO = (y: number, m: number, d: number) => `${y}-${pad(m + 1)}-${pad(d)}`;

function parseISO(s: string): { y: number; m: number } | null {
    const match = /^(\d{4})-(\d{2})-\d{2}$/.exec(s);
    return match ? { y: Number(match[1]), m: Number(match[2]) - 1 } : null;
}

function isoToDisplay(iso: string): string {
    const m = /^(\d{4})-(\d{2})-(\d{2})$/.exec(iso);
    return m ? `${m[3]}.${m[2]}.${m[1]}` : "";
}

function displayToIso(text: string): string | null {
    const m = /^(\d{1,2})\.(\d{1,2})\.(\d{4})$/.exec(text.trim());
    if (!m) return null;
    const d = Number(m[1]);
    const mo = Number(m[2]);
    const y = Number(m[3]);
    const check = new Date(y, mo - 1, d);
    if (check.getFullYear() !== y || check.getMonth() !== mo - 1 || check.getDate() !== d) {
        return null;
    }
    return `${y}-${pad(mo)}-${pad(d)}`;
}

function DueDateForm({ value, onSave }: DueDateFormProps) {
    const initial = toDateInputs(value);
    const [date, setDate] = useState(initial.date);
    const [time, setTime] = useState(initial.time || "12:00");
    const [timeText, setTimeText] = useState(initial.time || "12:00");
    const [saving, setSaving] = useState(false);
    const [dateText, setDateText] = useState(isoToDisplay(initial.date));

    const start = parseISO(initial.date) ?? {
        y: new Date().getFullYear(),
        m: new Date().getMonth(),
    };
    const [viewYear, setViewYear] = useState(start.y);
    const [viewMonth, setViewMonth] = useState(start.m);

    function selectDate(iso: string) {
        setDate(iso);
        setDateText(isoToDisplay(iso));
    }

    function normalizeTime(text: string): string | null {
        const t = text.trim();
        const m = /^(\d{1,2}):?(\d{2})$/.exec(t) ?? /^(\d{1,2}):(\d{1,2})$/.exec(t);
        if (!m) return null;
        const h = Number(m[1]);
        const min = Number(m[2]);
        if (h > 23 || min > 59) return null;
        return `${pad(h)}:${pad(min)}`;
    }

    function shiftMonth(delta: number) {
        const d = new Date(viewYear, viewMonth + delta, 1);
        setViewYear(d.getFullYear());
        setViewMonth(d.getMonth());
    }

    function shiftYear(delta: number) {
        setViewYear((y) => y + delta);
    }

    function handleDateInput(text: string) {
        setDateText(text);
        const iso = displayToIso(text);
        if (iso) {
            setDate(iso);
            const parsed = parseISO(iso);
            if (parsed) {
                setViewYear(parsed.y);
                setViewMonth(parsed.m);
            }
        } else {
            setDate("");
        }
    }

    function handleDateBlur() {
        setDateText(isoToDisplay(date));
    }

    function handleTimeInput(text: string) {
        setTimeText(text);
        const normalized = normalizeTime(text);
        if (normalized) setTime(normalized);
    }

    function handleTimeBlur() {
        const normalized = normalizeTime(timeText);
        const next = normalized ?? time; // błędne -> wróć do ostatniej poprawnej
        setTime(next);
        setTimeText(next);
    }

    const [timeOpen, setTimeOpen] = useState(false);
    const timeWrapRef = useRef<HTMLDivElement>(null);

    useEffect(() => {
        if (!timeOpen) return;
        const onDown = (e: MouseEvent) => {
            if (!timeWrapRef.current?.contains(e.target as Node)) setTimeOpen(false);
        };
        document.addEventListener("mousedown", onDown);
        return () => document.removeEventListener("mousedown", onDown);
    }, [timeOpen]);

    function selectTime(t: string) {
        setTime(t);
        setTimeText(t);
        setTimeOpen(false);
    }

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

    const offset = (new Date(viewYear, viewMonth, 1).getDay() + 6) % 7; // monday = 0
    const daysInMonth = new Date(viewYear, viewMonth + 1, 0).getDate();
    const cells: (number | null)[] = [
        ...Array(offset).fill(null),
        ...Array.from({ length: daysInMonth }, (_, i) => i + 1),
    ];

    const now = new Date();
    const todayISO = toISO(now.getFullYear(), now.getMonth(), now.getDate());

    const monthLabel = new Date(viewYear, viewMonth, 1).toLocaleDateString("en-US", {
        month: "long",
        year: "numeric",
    });

    const navBtn =
        "flex size-7 items-center justify-center rounded-xs hover:bg-white/10 cursor-pointer";
    const inputClass =
        "min-w-0 rounded-xs px-2 py-2 text-sm bg-transparent outline-1 outline-(--border-mute) focus:outline-(--mute) scheme-dark";

    return (
        <div className="flex flex-col gap-3 w-full">
            <div className="flex items-center justify-between">
                <div className="flex">
                    <button type="button" className={navBtn} onClick={() => shiftYear(-1)} aria-label="Previous year">
                        <ChevronsLeft size={16} />
                    </button>
                    <button type="button" className={navBtn} onClick={() => shiftMonth(-1)} aria-label="Previous month">
                        <ChevronLeft size={16} />
                    </button>
                </div>

                <span className="text-sm font-semibold">{monthLabel}</span>

                <div className="flex">
                    <button type="button" className={navBtn} onClick={() => shiftMonth(1)} aria-label="Next month">
                        <ChevronRight size={16} />
                    </button>
                    <button type="button" className={navBtn} onClick={() => shiftYear(1)} aria-label="Next year">
                        <ChevronsRight size={16} />
                    </button>
                </div>
            </div>

            <div className="grid grid-cols-7 gap-y-1 text-center text-xs">
                {WEEKDAYS.map((d) => (
                    <span key={d} className="py-1 font-semibold text-(--text-mute)">
                        {d}
                    </span>
                ))}

                {cells.map((day, i) => {
                    if (day === null) return <span key={`empty-${i}`} />;

                    const iso = toISO(viewYear, viewMonth, day);
                    const selected = iso === date;
                    const isToday = iso === todayISO;

                    return (
                        <button
                            key={iso}
                            type="button"
                            onClick={() => selectDate(iso)}
                            className={`mx-auto flex size-8 items-center justify-center rounded-full cursor-pointer ${
                                selected
                                    ? "bg-blue-600 text-white font-semibold"
                                    : "hover:bg-white/10"
                            } ${isToday && !selected ? "outline-1 outline-(--mute)" : ""}`}
                        >
                            {day}
                        </button>
                    );
                })}
            </div>

            <div className="flex flex-col gap-1">
                <span className="text-xs font-semibold">Due date</span>
                <div className="flex gap-2">
                    <input
                        type="text"
                        inputMode="numeric"
                        placeholder="DD.MM.YYYY"
                        maxLength={10}
                        value={dateText}
                        onChange={(e) => handleDateInput(e.target.value)}
                        onBlur={handleDateBlur}
                        className={`${inputClass} flex-1`}
                    />
                    <div ref={timeWrapRef} className="relative w-28">
                        <input
                            type="text"
                            inputMode="numeric"
                            placeholder="HH:MM"
                            maxLength={5}
                            value={timeText}
                            onChange={(e) => handleTimeInput(e.target.value)}
                            onFocus={() => setTimeOpen(true)}
                            onBlur={handleTimeBlur}
                            onKeyDown={(e) => {
                                if (e.key === "Enter" || e.key === "Escape") {
                                    if (timeOpen) e.stopPropagation();
                                    setTimeOpen(false);
                                }
                            }}
                            className={`${inputClass} w-full pr-7`}
                        />
                        <button
                            type="button"
                            tabIndex={-1}
                            aria-label="Show time suggestions"
                            onMouseDown={(e) => e.preventDefault()}
                            onClick={() => setTimeOpen((o) => !o)}
                            className="absolute inset-y-0 right-1 flex items-center px-1 cursor-pointer text-(--text-mute) hover:text-white"
                        >
                            <ChevronDown size={14} />
                        </button>

                        {timeOpen && (
                            <ul className="absolute left-0 top-full mt-1 z-10 max-h-48 w-full overflow-y-auto rounded-xs bg-(--bg-modal) py-1 shadow-2xl 
                            outline-1 outline-(--border-mute) 
                            scrollbar-gutter-stable scrollbar-thin scroll-smooth scrollbar-thumb-gray-700 scrollbar-track-transparent">
                                {TIME_OPTIONS.map((t) => (
                                    <li key={t}>
                                        <button
                                            type="button"
                                            ref={(el) => {
                                                if (el && t === time) el.scrollIntoView({ block: "nearest" });
                                            }}
                                            onMouseDown={(e) => e.preventDefault()}
                                            onClick={() => selectTime(t)}
                                            className={`w-full px-3 py-1.5 text-left text-sm cursor-pointer hover:bg-white/10 ${
                                                t === time ? "bg-white/10 font-semibold" : ""
                                            }`}
                                        >
                                            {t}
                                        </button>
                                    </li>
                                ))}
                            </ul>
                        )}
                    </div>
                </div>
            </div>

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