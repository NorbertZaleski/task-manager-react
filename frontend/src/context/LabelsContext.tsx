import { createContext, useContext, type ReactNode } from "react";
import useBoardLabels from "../hooks/useBoardLabels";
import type { Label } from "../types/types";

type LabelsContextValue = {
    labels: Label[];
    loading: boolean;
    error: String | null;
    reloadLabels: () => Promise<void>;
};

const LabelsContext = createContext<LabelsContextValue | null>(null);

export function LabelsProvider({ boardId, children }: { boardId: string | undefined; children: ReactNode }) {
    const value = useBoardLabels(boardId);
    return <LabelsContext.Provider value={value}>{children}</LabelsContext.Provider>;
}

export function useLabels() {
    const ctx = useContext(LabelsContext);
    if (!ctx) throw new Error("useLabels must be used within LabelsProvider");
    return ctx;
}