import { AxiosError } from 'axios';
import api from "./api";
import type { Column } from '../types/types';

export type ColumnUpdate = Partial<Pick<Column, 'title' | 'position'>>;

export const columnsService = {
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
       
        updateColumn: async (boardId: string, columnId: string, data: ColumnUpdate): Promise<Column> => {
            try {
                const response = await api.patch<{ message: string; column: Column }>(
                    `/boards/${boardId}/columns/${columnId}`,
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

        deleteColumn: async (boardId: string, columnId: string): Promise<void> => {
            try {
                await api.delete<Column>(`/boards/${boardId}/columns/${columnId}`);
            } catch (error) {
                if (error instanceof AxiosError) {
                    throw error.response?.data ?? error;
                }
                throw error;
            }
        }
}