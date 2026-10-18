import axios, { AxiosError } from 'axios';
import type { Column } from '../types/types';

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

export const columnsService = {
        createColumn: async (boardId: string, data: {title: string}): Promise<Column> => {
            try {
                const response = await api.post<Column>(`/${boardId}/columns`, data);
                return response.data;
            } catch (error) {
                if (error instanceof AxiosError) {
                    throw error.response?.data ?? error;
                }
                throw error;
            }
        },
       
        updateColumn: async (columnId: string, data: {title: string}): Promise<Column> => {
            try {
                const response = await api.patch<{ message: string; column: Column }>(
                    `/columns/${columnId}`,
                    data
                );
                return response.data.column;
            } catch (error) {
                if (error instanceof AxiosError) {
                    throw error.response?.data ?? error;
                }
                throw error;
            }
        },

        deleteColumn: async (columnId: string): Promise<void> => {
            try {
                await api.delete<Column>(`/columns/${columnId}`);
            } catch (error) {
                if (error instanceof AxiosError) {
                    throw error.response?.data ?? error;
                }
                throw error;
            }
        }
}