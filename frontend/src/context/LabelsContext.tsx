import { createContext, useContext, useState, type ReactNode } from "react";
import useBoardLabels from "../hooks/useBoardLabels";
import type { Label } from "../types/types";

type LabelsContextValue = {
    labels: Label[];
    loading: boolean;
    error: string | null;
    reloadLabels: () => Promise<void>;
    compactLabels: boolean;
    toggleCompactLabels: () => void;
};

const LabelsContext = createContext<LabelsContextValue | null>(null);

export function LabelsProvider({ boardId, children }: { boardId: string | undefined; children: ReactNode }) {
    const boardLabels = useBoardLabels(boardId);

    const [compactLabels, setCompactLabels] = useState<boolean>(() => {
        try {
            return localStorage.getItem("compactLabels") === "1";
        } catch {
            return false;
        }
    });

    const toggleCompactLabels = () =>
        setCompactLabels((prev) => {
            const next = !prev;
            try {
                localStorage.setItem("compactLabels", next ? "1" : "0");
            } catch {}
            return next;
        });

    return (
        <LabelsContext.Provider value={{ ...boardLabels, compactLabels, toggleCompactLabels }}>
            {children}
        </LabelsContext.Provider>
    );
}

export function useLabels() {
    const ctx = useContext(LabelsContext);
    if (!ctx) throw new Error("useLabels must be used within LabelsProvider");
    return ctx;
}