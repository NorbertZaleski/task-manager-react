import api from "./api";
import type { User } from "../types/types";
import { AxiosError } from "axios";

export const usersService = {
    searchUsers: async (q: string, signal?: AbortSignal): Promise<User[]> => {
        const response = await api.get("/users/search", { params: { q }, signal});
        return response.data;
    },

    updateUser: async (userId: string, data: {username?: string; name?: string}): Promise<User> => {
        try {
            const response = await api.patch(`/users/${userId}`, data);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },


}

