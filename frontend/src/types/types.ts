export type User = {
  id: string;
  name: string;
  email?: string;
  avatar?: string | null;
};

export type BoardRole = "owner" | "admin" | "member";

export type BoardMember = User & {
  role: BoardRole;
};

export type Attachment = {
  id: string;
  originalName: string;
  mimeType?: string;
  size: number;
  uploadedBy?: string;
  createdAt?: string;
};

export type Note = {
  id: string;
  title?: string;
  content?: string;
  columnId: string;
  labelIds: string[];
  assigneeIds: string[];
  dueDate?: string | null;
  completed?: boolean;
  position: number;
  attachments?: Attachment[];
};

export type Column = {
  id: string;
  title: string;
  color: string;
  position: number;
};

export type Label = {
  id: string;
  title: string;
  color: string;
};

export type BoardBackground = {
  type: "color" | "image";
  value: string;
};

export type Board = {
  id: string;
  title: string;
  columns: Column[];
  notes: Note[];
  labels: Label[];
  members: BoardMember[];
  role: BoardRole;
  background: BoardBackground;
};

//activity
export type ActivityAuthor = { id: string; name: string; avatar?: string };

type Base = {
  id: string;
  noteId: string;
  createdAt: string;
  author: ActivityAuthor | null;
};

export type CommentItem = Base & {
  type: "comment";
  text: string;
  editedAt: string | null;
};

export type ActivityLogItem = Base & {
  type: "activity";
  action: string;
  meta?: Record<string, string>;
};

export type NoteActivityItem = CommentItem | ActivityLogItem;

export type DragState = { id: string; height: number } | null;

export type DropTarget =
  | { columnId: string; noteId: string | null; after: boolean }
  | null;