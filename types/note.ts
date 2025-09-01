
export const NOTE_TAGS = [
  "Todo","Work","Personal","Meeting","Shopping","Ideas","Finance","Health","Important","Travel",
] as const;

export type NoteTag = typeof NOTE_TAGS[number];

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

export interface NewNoteData {
  title: string;
  content: string;
  tag: string; 
}

export interface FetchNotesParams{
  tag?: string;
  page?: number;
  perPage?: number;
  search?: string;
}

export interface NotesResponse{
  data: Note[];
  totalPages: number;
  page: number;
  perPage: number;
}

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export function normalizeTag(tag?: string | null): NoteTag | undefined {
  if (!tag) return undefined;
  const v = String(tag).trim().toLowerCase();
  if (v === "all") return undefined;
  const hit = NOTE_TAGS.find(t => t.toLowerCase() === v);
  return hit as NoteTag | undefined;
}
