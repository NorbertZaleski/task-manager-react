import api from "./api";
import type { User } from "../types/types";

export const searchUsers = async (q: string, signal?: AbortSignal): Promise<User[]> => {
    const response = await api.get("/users/search", { params: { q }, signal});
    return response.data;
}