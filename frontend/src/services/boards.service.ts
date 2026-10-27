import axios, { AxiosError } from 'axios';
import type { Board, BoardBackground, BoardMember, BoardRole, Column } from '../types/types';

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

type CreateBoardInput = {
    title: string;
    background?: BoardBackground;
};


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

    createBoard: async(data: CreateBoardInput): Promise<Board> => {
        try {
            const response = await api.post<Board>(`/`, data);
            return response.data;
        } catch (error) {
        if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    updateBoard: async(boardId: string, data: {title: string}): Promise<Board> => {
        try {
            const reponse = await api.patch<Board>(`/${boardId}`, data);
            return reponse.data;
        } catch (error) {
        if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    deleteBoard: async(boardId: string): Promise<void> => {
        try {
            await api.delete<Board>(`/${boardId}`);
        } catch (error) {
        if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

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

    addMember: async (boardId: string, userId: string, role: BoardRole = "member"): Promise<BoardMember> => {
        try {
            const response = await api.post<BoardMember>(`/${boardId}/members`, {userId, role});
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    updateMemberRole: async (boardId: string, userId: string, role: BoardRole): Promise<BoardMember> => {
        try {
            const res = await api.patch<BoardMember>(`/${boardId}/members/${userId}`, { role });
            return res.data;
        } catch (error) {
        if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    removeMember: async (boardId: string, userId: string): Promise<void> => {
        try {
            await api.delete(`/${boardId}/members/${userId}`);
        } catch (error) {
        if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },
    
}