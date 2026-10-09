import { useCallback, useEffect, useState } from "react";
import { boardsService } from "../services/boards.service";
import type { Board } from "../types/types";

function useBoards(){
    const [boards, setBoards] = useState<Board[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<string | null>(null);

    const load = useCallback(async ()=> {
        try {
            setLoading(true);
            const response = await boardsService.getBoards();
            setBoards(response);
            setError(null);
        } catch (error) {
            console.error('Błąd pobierania tablic:', error);
            const message = error instanceof Error ? error.message : 'Nie udało się pobrać tablic';
            setError(message);
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(()=> {
        load();
    }, [load]);

    return {boards, loading, error, reload: load};
}

export default useBoards;