import { useCallback, useEffect, useState } from "react";
import type { Label } from "../types/types";
import { LabelsService } from "../services/labels.service";

function useBoardLabels(boardId: string | undefined) {
    const [labels, setLabels] = useState<Label[] | []>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);

    const load = useCallback(async () => {
        if (!boardId) {
            setError("No board id");
            setLoading(false);
            return;
        } 
        try {
            setLoading(true);
            const response = await LabelsService.getLabels(boardId);
            setLabels(response);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            const message = error instanceof Error ? error.message : 'Error in fetching labels';
            setError(message);
        } finally {
            setLoading(false);
        }

    }, [boardId])

    useEffect(()=> {
        load();
    }, [load]);

    return {labels, loading, error, reload: load}
}

export default useBoardLabels;