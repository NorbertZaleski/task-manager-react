import type { Board } from "../types/types";

export const initialBoard: Board = {
  id: 1,
  title: 'Tablica initial',
  columns: [
    { id: 'todo', title: 'Do zrobienia', color: ''},
    { id: 'doing', title: 'W trakcie', color: ''},
    { id: 'done', title: 'Zrobione', color: ''},
  ],
};
