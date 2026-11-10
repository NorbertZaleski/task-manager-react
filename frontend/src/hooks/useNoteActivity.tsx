import { useCallback, useEffect, useState } from "react";
import { noteActivityService } from "../services/noteActivity.service";
import type { NoteActivityItem } from "../types/types";

export function useNoteActivity(boardId: string, noteId: string) {
  const [items, setItems] = useState<NoteActivityItem[]>([]);
  const [hasMore, setHasMore] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [reloadKey, setReloadKey] = useState(0);

  useEffect(() => {
    if (!boardId || !noteId) {
      setLoading(false);
      return;
    }
    let cancelled = false;
    setLoading(true);
    noteActivityService
      .list(boardId, noteId)
      .then((res) => {
        if (cancelled) return;
        setItems(res.items);
        setHasMore(res.hasMore);
        setError(null);
      })
      .catch(() => !cancelled && setError("Failed to load activity"))
      .finally(() => !cancelled && setLoading(false));
    return () => {
      cancelled = true;
    };
  }, [boardId, noteId, reloadKey]);

  const reload = useCallback(() => setReloadKey((k) => k + 1), []);

  const loadMore = async () => {
    const last = items[items.length - 1];
    if (!last) return;
    const res = await noteActivityService.list(boardId, noteId, last.createdAt);
    setItems((prev) => [...prev, ...res.items]);
    setHasMore(res.hasMore);
  };

  const addComment = async (text: string) => {
    const created = await noteActivityService.createComment(boardId, noteId, text);
    setItems((prev) => [created, ...prev]);
  };

  const editComment = async (commentId: string, text: string) => {
    const updated = await noteActivityService.updateComment(boardId, noteId, commentId, text);
    setItems((prev) => prev.map((i) => (i.id === commentId ? updated : i)));
  };

  const removeComment = async (commentId: string) => {
    await noteActivityService.deleteComment(boardId, noteId, commentId);
    setItems((prev) => prev.filter((i) => i.id !== commentId));
  };

  return { items, hasMore, loading, error, reload, loadMore, addComment, editComment, removeComment };
}