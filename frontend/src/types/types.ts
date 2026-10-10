export type Note = {
  id: string;
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
  _id: string;
  title: string;
  columns: Column[];
  notes: Note[];
};