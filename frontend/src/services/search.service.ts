import { AxiosError } from 'axios';
import api from "./api";
import type { SearchResults } from '../types/types';

export const searchService = {

    async search(q: string, signal?: AbortSignal): Promise<SearchResults> {
        try {
            const response = await api.get("/search", { params: { q }, signal });
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

};