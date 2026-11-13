const pad = (n: number) => String(n).padStart(2, "0");

export function toDateInputs(iso?: string | null) {
    if (!iso) return { date: "", time: "" };
    const d = new Date(iso);
    return {
        date: `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`,
        time: `${pad(d.getHours())}:${pad(d.getMinutes())}`,
    };
}

export function fromDateInputs(date: string, time: string) {
    return new Date(`${date}T${time || "23:59"}`).toISOString();
}

export function formatDue(iso: string) {
    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        hour: "2-digit",
        minute: "2-digit",
    }).format(new Date(iso));
}

export function formatDueDate(iso: string) {
    const d = new Date(iso);
    const sameYear = d.getFullYear() === new Date().getFullYear();

    return new Intl.DateTimeFormat("en-GB", {
        day: "numeric",
        month: "short",
        ...(sameYear ? {} : { year: "numeric" }),
    }).format(d);
}

export type DueStatus = "completed" | "overdue" | "soon" | "normal";

export function getDueStatus(iso: string, completed = false): DueStatus {
    if (completed) return "completed";
    const diff = new Date(iso).getTime() - Date.now();
    if (diff < 0) return "overdue";
    if (diff < 24 * 60 * 60 * 1000) return "soon";
    return "normal";
}

export const dueClassBase = "font-semibold text-[10px] text-(--text) rounded-xs px-1 py-0.5";

export const dueStatusClass: Record<DueStatus, string> = {
    completed: "text-(--text-dark) bg-[#6CC551]",
    overdue: "bg-[#E71D36]",
    soon: "text-(--text-dark) bg-[#F4E285]",
    normal: "",
};