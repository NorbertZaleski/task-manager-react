export type Note = {
  id: string;
  content?: string;
  category: string;
  columnId: string;
  labelIds: string[];
};

export type Column = {
  id: string;
  title: string;
  color: string;
};

export type Board = {
  id: string;
  title: string;
  columns: Column[];
  notes: Note[];
  labels: Label[];
};

export type Label = {
  id: string;
  title: string;
  color: string;
};