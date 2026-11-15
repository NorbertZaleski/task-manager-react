import { useEffect, useState } from "react";
import { FileText, Paperclip } from "lucide-react";
import type { Attachment } from "../types/types";
import notesService from "../services/notes.service";
import Button from "./Button";
import { formatSize } from "../utils/formatSize";

type AttachmentsBlockProps = {
    noteId: string;
    attachments: Attachment[];
    uploading: boolean;
    error: string | null;
    onOpen: (a: Attachment) => void;
    onDelete: (attachmentId: string) => void;
    onAdd: () => void;
};

const formatAdded = (iso?: string) =>
    iso
        ? new Date(iso).toLocaleString(undefined, { dateStyle: "medium", timeStyle: "short" })
        : "";

function Thumb({ noteId, attachment }: { noteId: string; attachment: Attachment }) {
    const [src, setSrc] = useState<string | null>(null);
    const isImage = (attachment.mimeType ?? "").startsWith("image/");

    useEffect(() => {
        if (!isImage) return;
        let url: string | null = null;
        let cancelled = false;

        notesService
            .getAttachmentBlobUrl(noteId, attachment.id)
            .then((u) => {
                if (cancelled) URL.revokeObjectURL(u);
                else { url = u; setSrc(u); }
            })
            .catch(() => {});

        return () => {
            cancelled = true;
            if (url) URL.revokeObjectURL(url);
        };
    }, [noteId, attachment.id, isImage]);

    return (
        <div className="flex h-20 w-28 shrink-0 items-center justify-center overflow-hidden rounded bg-(--hover-white)">
            {src ? (
                <img src={src} alt={attachment.originalName} className="h-full w-full object-cover" />
            ) : (
                <FileText size={28} className="text-(--text-mute)" />
            )}
        </div>
    );
}

function AttachmentsBlock({ noteId, attachments, uploading, error, onOpen, onDelete, onAdd }: AttachmentsBlockProps) {
    return (
        <div className="flex flex-col">
            <div className="mb-2 flex items-center gap-2">
                <Paperclip size={18} />
                <p className="text-[14px] font-semibold">Attachments</p>
            </div>

            <div className="ml-8 flex flex-col gap-3">
                {attachments.map((a) => (
                    <div key={a.id} className="flex min-w-0 gap-3">
                        <button type="button" onClick={() => onOpen(a)} className="cursor-pointer">
                            <Thumb noteId={noteId} attachment={a} />
                        </button>

                        <div className="flex min-w-0 flex-1 flex-col gap-1">
                            <button
                                type="button"
                                onClick={() => onOpen(a)}
                                title={a.originalName}
                                className="truncate text-left text-sm font-semibold hover:underline cursor-pointer"
                            >
                                {a.originalName}
                            </button>
                            <p className="text-xs text-(--text-mute)">
                                {a.createdAt && <>Added {formatAdded(a.createdAt)} · </>}
                                {formatSize(a.size)}
                            </p>
                            <button
                                type="button"
                                onClick={() => onDelete(a.id)}
                                className="self-start text-xs text-(--text-mute) underline hover:text-white cursor-pointer"
                            >
                                Delete
                            </button>
                        </div>
                    </div>
                ))}

                {uploading && <p className="text-xs text-(--text-mute)">Uploading...</p>}
                {error && <p className="text-xs text-red-400">{error}</p>}

                <Button variant="outline" onClick={onAdd} className="self-start">
                    Add an attachment
                </Button>
            </div>
        </div>
    );
}

export default AttachmentsBlock;