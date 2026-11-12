import { useEffect, useRef, useState } from "react";
import { useEditor, EditorContent, type Editor } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Image from "@tiptap/extension-image";
import Placeholder from "@tiptap/extension-placeholder";
import DOMPurify from "dompurify";
import { Bold, Italic, Underline as UnderlineIcon, Strikethrough, List, ListOrdered, ImagePlus } from "lucide-react";
import Button from "./Button";

type RichTextEditorProps = {
    value: string;
    onCommit: (html: string) => void;
    onEditingChange?: (editing: boolean) => void;
    placeholder?: string;
    className?: string;
    viewClassName?: string;
};

const CONTENT_STYLES =
    "[&_p]:my-1 [&_ul]:list-disc [&_ul]:pl-6 [&_ol]:list-decimal [&_ol]:pl-6 [&_strong]:font-bold " +
    "[&_em]:italic [&_u]:underline [&_s]:line-through [&_img]:max-w-full [&_img]:rounded [&_img]:my-2";

function toHtml(v: string) {
    if (!v) return "";
    if (/^\s*</.test(v)) return v;
    const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/</g, "&lt;").replace(/>/g, "&gt;");
    return v.split("\n").map((l) => `<p>${esc(l)}</p>`).join("");
}

async function fileToDataUrl(file: File, maxSize = 1280, quality = 0.8): Promise<string> {
    if (file.type === "image/gif" || file.type === "image/svg+xml") {
        return new Promise((res, rej) => {
            const r = new FileReader();
            r.onload = () => res(r.result as string);
            r.onerror = rej;
            r.readAsDataURL(file);
        });
    }
    const bmp = await createImageBitmap(file);
    const scale = Math.min(1, maxSize / Math.max(bmp.width, bmp.height));
    const canvas = document.createElement("canvas");
    canvas.width = Math.round(bmp.width * scale);
    canvas.height = Math.round(bmp.height * scale);
    canvas.getContext("2d")!.drawImage(bmp, 0, 0, canvas.width, canvas.height);
    return canvas.toDataURL("image/webp", quality);
}

async function insertImages(editor: Editor, files: File[]) {
    for (const file of files.filter((f) => f.type.startsWith("image/"))) {
        const src = await fileToDataUrl(file);
        editor.chain().focus().setImage({ src }).run();
    }
}

function ToolbarButton({ active, onClick, label, children }: {
    active?: boolean; onClick: () => void; label: string; children: React.ReactNode;
}) {
    return (
        <button
            type="button"
            aria-label={label}
            title={label}
            onMouseDown={(e) => e.preventDefault()}
            onClick={onClick}
            className={`p-1.5 rounded hover:bg-(--hover-white) ${active ? "bg-(--hover-white) text-white" : "text-(--text-mute)"}`}
        >
            {children}
        </button>
    );
}

function Editor_({ initial, placeholder, className, onSave, onCancel }: {
    initial: string; placeholder: string; className: string;
    onSave: (html: string) => void; onCancel: () => void;
}) {
    const fileInput = useRef<HTMLInputElement>(null);
    const editorRef = useRef<Editor | null>(null);
    const saveRef = useRef<() => void>(() => {});
    const cancelRef = useRef(onCancel);
    cancelRef.current = onCancel;

    const editor = useEditor({
        shouldRerenderOnTransaction: true,
        extensions: [
            StarterKit,
            Image.configure({ allowBase64: true }),
            Placeholder.configure({ placeholder }),
        ],
        content: toHtml(initial),
        autofocus: "end",
        editorProps: {
            attributes: {
                class: `outline-none min-h-40 px-3 py-2 text-sm wrap-break-word ${CONTENT_STYLES} ${className}`,
            },
            handleKeyDown: (_v, e) => {
                e.stopPropagation();
                if (e.key === "Escape") { cancelRef.current(); return true; }
                if (e.key === "Enter" && (e.ctrlKey || e.metaKey)) { saveRef.current(); return true; }
                return false;
            },
            handlePaste: (_v, e) => {
                const files = Array.from(e.clipboardData?.files ?? []).filter((f) => f.type.startsWith("image/"));
                if (!files.length || !editorRef.current) return false;
                e.preventDefault();
                insertImages(editorRef.current, files);
                return true;
            },
            handleDrop: (_v, e) => {
                const files = Array.from(e.dataTransfer?.files ?? []).filter((f) => f.type.startsWith("image/"));
                if (!files.length || !editorRef.current) return false;
                e.preventDefault();
                insertImages(editorRef.current, files);
                return true;
            },
            transformPastedHTML: (html) =>
                html.replace(/<img[^>]+src=["']file:[^"']*["'][^>]*>/gi, ""),
        },
    });

    editorRef.current = editor;
    saveRef.current = () => editor && onSave(editor.isEmpty ? "" : editor.getHTML());

    if (!editor) return null;

    return (
        <div className="flex flex-col gap-2">
            <div className="rounded outline-1 outline-(--border-active-textarea) bg-input">
                <div className="flex flex-wrap gap-0.5 border-b border-(--border-mute) p-1">
                    <ToolbarButton label="Bold" active={editor.isActive("bold")} onClick={() => editor.chain().focus().toggleBold().run()}><Bold size={16} /></ToolbarButton>
                    <ToolbarButton label="Italic" active={editor.isActive("italic")} onClick={() => editor.chain().focus().toggleItalic().run()}><Italic size={16} /></ToolbarButton>
                    <ToolbarButton label="Underline" active={editor.isActive("underline")} onClick={() => editor.chain().focus().toggleUnderline().run()}><UnderlineIcon size={16} /></ToolbarButton>
                    <ToolbarButton label="Strikethrough" active={editor.isActive("strike")} onClick={() => editor.chain().focus().toggleStrike().run()}><Strikethrough size={16} /></ToolbarButton>
                    <ToolbarButton label="Bullet list" active={editor.isActive("bulletList")} onClick={() => editor.chain().focus().toggleBulletList().run()}><List size={16} /></ToolbarButton>
                    <ToolbarButton label="Numbered list" active={editor.isActive("orderedList")} onClick={() => editor.chain().focus().toggleOrderedList().run()}><ListOrdered size={16} /></ToolbarButton>
                    <ToolbarButton label="Add image" onClick={() => fileInput.current?.click()}><ImagePlus size={16} /></ToolbarButton>
                </div>
                <EditorContent editor={editor} />
            </div>

            <input
                ref={fileInput}
                type="file"
                accept="image/*"
                multiple
                hidden
                onChange={(e) => {
                    insertImages(editor, Array.from(e.target.files ?? []));
                    e.target.value = "";
                }}
            />

            <div className="flex gap-1">
                <Button variant="primary" onMouseDown={(e) => e.preventDefault()} onClick={() => saveRef.current()}>Save</Button>
                <Button variant="ghost" onMouseDown={(e) => e.preventDefault()} onClick={onCancel}>Cancel</Button>
            </div>
        </div>
    );
}

function RichTextEditor({ value, onCommit, onEditingChange, placeholder = "Add content...", className = "", viewClassName = "" }: RichTextEditorProps) {
    const [isEditing, setIsEditing] = useState(false);

    useEffect(() => { onEditingChange?.(isEditing); }, [isEditing]);

    if (isEditing) {
        return (
            <Editor_
                initial={value}
                placeholder={placeholder}
                className={className}
                onCancel={() => setIsEditing(false)}
                onSave={(html) => {
                    if (html !== value) onCommit(html);
                    setIsEditing(false);
                }}
            />
        );
    }

    return (
        <div
            onClick={() => setIsEditing(true)}
            className={`cursor-pointer text-sm ${CONTENT_STYLES} ${className} ${viewClassName}`}
        >
            {value ? (
                <div dangerouslySetInnerHTML={{ __html: DOMPurify.sanitize(toHtml(value)) }} />
            ) : (
                <span>{placeholder}</span>
            )}
        </div>
    );
}

export default RichTextEditor;