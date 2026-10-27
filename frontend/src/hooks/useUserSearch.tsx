import { useEffect, useState } from "react";
import type { User } from "../types/types";
import { searchUsers } from "../services/users.service";

function useUserSearch(query: string) {
    const [results, setResults] = useState<User[]>([]);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState<String | null>(null);
    
    useEffect(() => {
        const q = query.trim();
        if (q.length < 2) {
            setResults([]);
            return;
        }

        const controller = new AbortController();
        const timer = setTimeout(async () => {
            try {
                setLoading(true);
                setResults(await searchUsers(q, controller.signal));
            } catch (error) {
                if (!controller.signal.aborted) {
                    console.error("Error in useUserSearch", error);
                    const message = error instanceof Error ? error.message : 'Error in fetching users';
                    setError(message);
                }
            } finally {
                if (!controller.signal.aborted) setLoading(false);
            }
        }, 300);

        return () => {
            clearTimeout(timer);
            controller.abort();
        };
    }, [query]);

    return {results, loading, error};
}

export default useUserSearch;