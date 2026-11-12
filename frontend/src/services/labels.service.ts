import { AxiosError } from 'axios';
import api from "./api";
import type { Label } from "../types/types";

export const LabelsService = {

    getLabels: async (boardId: string): Promise<Label[]> => {
        try {
            const response = await api.get(`/boards/${boardId}/labels`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    createLabel: async (boardId: string, data: {title: string; color: string}): Promise<Label> => {
        try {
            const response = await api.post(`/boards/${boardId}/labels`, data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    updateLabel: async (boardId: string, labelId: string, data: {title: string; color: string}): Promise<Label> => {
        try {
            const response = await api.patch(`/boards/${boardId}/labels/${labelId}`, data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    }

}