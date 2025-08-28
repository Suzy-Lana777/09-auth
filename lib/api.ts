
// lib/api.ts
// lib/api.ts
import axios from 'axios';
import type { Note, NoteTag } from '../types/note';

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeader = () => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  return { Authorization: `Bearer ${myKey}` };
};

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  try {
    const res = await axios.get<FetchNotesResponse>('/notes', {
      params: {
        page,
        ...(search.trim() && { search: search.trim() }),
        ...(tag && tag.toLowerCase() !== 'all' && { tag }),
      },
      headers: { Authorization: `Bearer ${myKey}` },
    });

    return res.data;
  } catch (error: unknown) {
    console.error('fetchNotes error:', error);
    throw error;
  }
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  try {
    const res = await axios.post<Note>('/notes', newNote, {
      headers: { Authorization: `Bearer ${myKey}` },
    });
    return res.data;
  } catch (error: unknown) {
    console.error('createNote error:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  try {
    const res = await axios.delete<Note>(`/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${myKey}` },
    });
    return res.data;
  } catch (error: unknown) {
    console.error('deleteNote error:', error);
    throw error;
  }
};

// Отримати одну нотатку за id
export const getSingleNote = async (id: string): Promise<Note> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  try {
    const res = await axios.get<Note>(`/notes/${id}`, {
      headers: { Authorization: `Bearer ${myKey}` },
    });
    return res.data;
  } catch (error: unknown) {
    console.error('getSingleNote error:', error);
    throw error;
  }
};

// Отримати категорії
export const getCategories = async (): Promise<CategoryType[]> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  try {
    const res = await axios.get<CategoryType[]>('/categories', {
      headers: { Authorization: `Bearer ${myKey}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) return []; // повертаємо пустий масив для 404
      throw error; // інші помилки кидаємо далі
    } else {
      throw new Error('Unknown error occurred while fetching categories');
    }
  }
};

export type { Note, NoteTag };

