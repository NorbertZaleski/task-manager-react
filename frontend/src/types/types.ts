export type Note = {
  id: number;
  content: string;
  category: string;
  isUrgent: boolean;
  columnId: string;
};

export type Column = {
  id: string;
  title: string;
  color: string;
};

export type Board = {
  id: number;
  title: string;
  columns: Column[];
};

export type ColumnId = "todo" | "doing" | "done";