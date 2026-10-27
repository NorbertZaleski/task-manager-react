import { useCallback, useEffect, useState } from "react";
import type { Board } from "../types/types";
import { boardsService } from "../services/boards.service";

function useBoard(boardId: string | undefined) {
    const [board, setBoard] = useState<Board | null >(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);

    const load = useCallback(async () => {
        if (!boardId) {
            setError("No board ID");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await boardsService.getBoard(boardId);
            setBoard(response);
            setError(null);
        } catch (error) {
            console.error('Error:', error);
            const message = error instanceof Error ? error.message : 'Error in fetching board';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    useEffect(()=> {
        load();
    }, [load]);

    return {board, setBoard, loading, error, reload: load};
}

export default useBoard;