import axios, { AxiosError } from "axios";
import type { Label } from "../types/types";

const getToken = () => localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://localhost:5001/api',
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

    createLabel: async (boardId: string): Promise<Label> => {
        try {
            const response = await api.post(`/boards/${boardId}/labels`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },



}