import { useCallback, useEffect, useState } from "react";
import type { Board } from "../types/types";
import { boardsService } from "../services/boards.service";

function useBoard() {
    const [board, setBoard] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null)

    const load = useCallback(async () => {
        try {
            setLoading(true);
            const response = await boardsService.getBoard();
            setBoard(response);
            setError(null);
        } catch (error) {
            console.error('Błąd pobierania tablicy:', error);
            const message = error instanceof Error ? error.message : 'Nie udało się pobrać tablicy';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(()=> {
        load();
    }, [load]);

    return {board, loading, error, reload: load};
}

export default useBoard;