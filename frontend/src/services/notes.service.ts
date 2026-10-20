import axios, { AxiosError } from 'axios';
import type { Note } from '../types/types';

const getToken = () => localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://localhost:5001/api/notes',
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

export const notesService = {
    createNote: async (
        columnId: string, 
        data: {title?: string, labels?: string[]}): 
        Promise<Note> => {
        try {
            const reponse = await api.post<Note>(`/columns/${columnId}/notes`, data);
            return reponse.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    updateNote: async (
        noteId: string,
        data: { columnId?: string; position?: number; title?: string, content?: string }
    ) => {
        const response = await api.patch(`/${noteId}`, data);
        return response.data;
    },

};



export default notesService;