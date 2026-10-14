export type Note = {
  id: string;
  content?: string;
  category: string;
  columnId: string;
  labelIds: string[];
  position: number;
};

export type Column = {
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
  background: BoardBackground;
};

export type Label = {
  id: string;
  title: string;
  color: string;
};