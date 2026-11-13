import { AxiosError } from 'axios';
import api from "./api";
import type { Checklist, Note } from '../types/types';

const PREVIEWABLE_TYPES = new Set([
    "image/png", "image/jpeg", "image/gif", "image/webp",
    "application/pdf", "text/plain",
]);

async function parseBlobError(error: AxiosError): Promise<unknown> {
    const data = error.response?.data;
    if (data instanceof Blob) {
        try {
            return JSON.parse(await data.text());
        } catch {
            return error;
        }
    }
    return data ?? error;
};

export const notesService = {
    createNote: async (
        columnId: string, 
        data: {title?: string, labels?: string[]}): 
        Promise<Note> => {
        try {
            const reponse = await api.post<Note>(`/notes/columns/${columnId}/notes`, data);
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
        data: { columnId?: string; position?: number; title?: string, content?: string, labels?: string[] }
    ) => {
        const response = await api.patch(`/notes/${noteId}`, data);
        return response.data;
    },

    deleteNote: async ( noteId: string ): Promise<void> => {
        try {
            await api.delete<Note>(`/notes/${noteId}`);
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    } ,

    setLabels: async (noteId: string, labelIds: string[]): Promise<Note> => {
        try {
            const response = await api.put(`/notes/${noteId}/labels`, {labels: labelIds}); 
            return response.data;
        } catch (error) {
        if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    async setDueDate(noteId: string, dueDate: string | null): Promise<Note> {
        try {
            const response = await api.patch(`/notes/${noteId}/due-date`, {dueDate});
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    async setCompleted(noteId: string, completed: boolean): Promise<Note> {
        try {
            const response = await api.patch(`/notes/${noteId}/completed`, {completed});
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    async uploadAttachments(noteId: string, files: File[]): Promise<Note> {
        try {
            const form = new FormData();
            files.forEach((f) => form.append("files", f));
            const response = await api.post(`/notes/${noteId}/attachments`, form);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },
    async deleteAttachment(noteId: string, attachmentId: string): Promise<Note> {
        try {
            const response = await api.delete(`/notes/${noteId}/attachments/${attachmentId}`);
            return response.data;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw error.response?.data ?? error;
            }
            throw error;
        }
    },

    async downloadAttachment(noteId: string, att: { id: string; originalName: string }): Promise<void> {
        try {
            const response = await api.get(`/notes/${noteId}/attachments/${att.id}`, {
                responseType: "blob",
            });
            const url = URL.createObjectURL(response.data);
            const a = document.createElement("a");
            a.href = url;
            a.download = att.originalName;
            document.body.appendChild(a);
            a.click();
            a.remove();
            setTimeout(() => URL.revokeObjectURL(url), 1000);
        } catch (error) {
            if (error instanceof AxiosError) {
                throw await parseBlobError(error);
            }
            throw error;
        }
    },

    async openAttachment(noteId: string, att: { id: string; originalName: string }): Promise<void> {
        const win = window.open("", "_blank");
        try {
            const response = await api.get(`/notes/${noteId}/attachments/${att.id}`, {
                params: { inline: "1" },
                responseType: "blob",
            });

            const type = (response.data.type || "").split(";")[0].toLowerCase();
            if (!PREVIEWABLE_TYPES.has(type)) {
                win?.close();
                return this.downloadAttachment(noteId, att);
            }

            const url = URL.createObjectURL(response.data);
            if (win) win.location.href = url;
            else window.open(url, "_blank");
            setTimeout(() => URL.revokeObjectURL(url), 60_000);
        } catch (error) {
            win?.close();
            if (error instanceof AxiosError) {
                throw await parseBlobError(error);
            }
            throw error;
        }
    },

    setChecklists: async (noteId: string, checklists: Checklist[]) => {
        try {
            const response = await api.put(`/notes/${noteId}/checklists`, { checklists });
            return response.data as Note;
        } catch (error) {
            if (error instanceof AxiosError) {
                throw await parseBlobError(error);
            }
            throw error;
        }
    },
};



export default notesService;