import axios from 'axios';
import type { CommentItem, NoteActivityItem } from "../types/types";

const getToken = () => localStorage.getItem('token');

const api = axios.create({
    baseURL: 'http://localhost:5001/api/',
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

const base = (boardId: string, noteId: string) => `/boards/${boardId}/notes/${noteId}`;

export const noteActivityService = {
  
  list: (boardId: string, noteId: string, before?: string) =>
    api
      .get<{ items: NoteActivityItem[]; hasMore: boolean }>(`${base(boardId, noteId)}/activity`, {
        params: before ? { before } : undefined,
      })
      .then((r) => r.data),

  createComment: (boardId: string, noteId: string, text: string) =>
    api.post<CommentItem>(`${base(boardId, noteId)}/comments`, { text }).then((r) => r.data),

  updateComment: (boardId: string, noteId: string, commentId: string, text: string) =>
    api
      .patch<CommentItem>(`${base(boardId, noteId)}/comments/${commentId}`, { text })
      .then((r) => r.data),

  deleteComment: (boardId: string, noteId: string, commentId: string) =>
    api.delete(`${base(boardId, noteId)}/comments/${commentId}`),
};