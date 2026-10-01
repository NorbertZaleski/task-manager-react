import { useCallback, useEffect, useState } from "react";
import { boardsService } from "../services/boards.service";

function useBoards(){
    const [boards, setBoards] = useState([]);
    const [user, setUser] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);

    const load = useCallback(async ()=> {
        try {
            setLoading(true);
            const response = await boardsService.getBoards();
            setBoards(response);
            setUser(response.user || null);
            setError(null);
        } catch (error) {
            console.error('Błąd pobierania tablic:', error);
            setError(error.message || 'Nie udało się pobrać tablic');
        } finally {
            setLoading(false);
        }
    }, []);

    useEffect(()=> {
        load();
    }, [load]);
}

export default useBoards;