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

    const updateBoardTitle = useCallback((boardId: string, title: string) => {
        setBoards(prev => prev.map(b => (b.id === boardId ? { ...b, title } : b)));
    }, []);

    const removeBoard = useCallback((boardId: string) => {
        setBoards(prev => prev.filter(b => b.id !== boardId));
    }, []);

    useEffect(()=> {
        load();
    }, [load]);

    return {boards, loading, error, reload: load, updateBoardTitle, removeBoard};
}

export default useBoards;