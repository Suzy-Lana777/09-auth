// types/note.ts

export type NoteTag =
  | "Todo"| "Work"| "Personal"| "Meeting" | "Shopping"| "Ideas"| "Finance"| "Health"| "Important";
     
     
export interface Note {
  id: string;
  title: string;
  content: string;
  tag: NoteTag;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface FetchNotesParams {
  tag?: string;
  page?: number;
  perPage?: number;
  search?: string;
}

export interface NotesResponse {
  data: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

/** сирий відгук бекенду /notes (notes + totalPages) */
export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

/** тип для /categories */
export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}
