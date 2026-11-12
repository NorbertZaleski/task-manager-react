import { AxiosError } from 'axios';
import api from "./api";
import type { Board, BoardBackground, BoardMember, BoardRole, Column } from '../types/types';

type CreateBoardInput = {
    title: string;
    background?: BoardBackground;
};

export const boardsService = {

    getBoards: async (): Promise<Board[]> => {
        try {
            const response = await api.get<Board[]>(`/boards`);
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
            const response = await api.get<Board>(`/boards/${boardId}`);
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
            const response = await api.post<Board>(`/boards`, data);
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
            const reponse = await api.patch<Board>(`/boards/${boardId}`, data);
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
            await api.delete<Board>(`/boards/${boardId}`);
        } catch (error) {
        if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    createColumn: async (boardId: string, data: {title: string}): Promise<Column> => {
        try {
            const response = await api.post<Column>(`/boards/${boardId}/columns`, data);
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
            const response = await api.post<BoardMember>(`/boards/${boardId}/members`, {userId, role});
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
            const res = await api.patch<BoardMember>(`/boards/${boardId}/members/${userId}`, { role });
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
            await api.delete(`/boards/${boardId}/members/${userId}`);
        } catch (error) {
        if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },
    
}