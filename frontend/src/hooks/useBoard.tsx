import { useCallback, useEffect, useState } from "react";
import type { Board } from "../types/types";
import { boardsService } from "../services/boards.service";

function useBoard(boardId: string | undefined) {
    const [board, setBoard] = useState<Board | null >(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null)

    const load = useCallback(async () => {
        if (!boardId) {
            setError("Brak identyfikatora tablicy");
            setLoading(false);
            return;
        }
        try {
            setLoading(true);
            const response = await boardsService.getBoard(boardId);
            setBoard(response);
            setError(null);
        } catch (error) {
            console.error('Błąd pobierania tablicy:', error);
            const message = error instanceof Error ? error.message : 'Nie udało się pobrać tablicy';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, [boardId]);

    useEffect(()=> {
        load();
    }, [load]);

    return {board, loading, error, reload: load};
}

export default useBoard;