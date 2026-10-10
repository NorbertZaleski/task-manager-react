import axios, { AxiosError } from 'axios';
import type { Board } from '../types/types';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://localhost:5001/api/boards',
    headers: {
        'Content-Type': 'application/json'
    }
});

// Interceptor do dodawania tokenu
api.interceptors.request.use(
    (config) => {
        const token = getToken();
        if (token) {
            config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
    },
    (error) => Promise.reject(error)
);

export const boardsService = {

    getBoards: async (): Promise<Board[]> => {
        try {
            const response = await api.get<Board[]>(`/`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },
    getBoard: async (boardId: string): Promise<Board> => {
        try {
            const response = await api.get<Board>(`/${boardId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },
}