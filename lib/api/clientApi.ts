// lib/api/clientApi.ts
"use client";

import { nextServer } from "./api";
import type { Note, NewNote } from "@/types/note";
import type { User, UpdateUserRequest } from "@/types/user";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
}
export interface LoginRequest {
  email: string;
  password: string;
}
interface CheckSessionResponse {
  success: boolean;
}

export const register = async (payload: RegisterRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/register", payload);
  return res.data;
};
export const registerUser = register;

export const loginUser = async (payload: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", payload);
  return res.data;
};

export const logoutUser = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<unknown>("/auth/session");
  const data = res.data as unknown;

  if (typeof data === "object" && data !== null) {
    
    if ("success" in (data as Record<string, unknown>)) {
      const success = (data as Record<string, unknown>).success;
      return typeof success === "boolean" ? success : true;
    }
    
    return true;
  }
  return false;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};


export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      ...(search.trim() ? { search: search.trim() } : {}),
      ...(tag && tag.toLowerCase() !== "all" ? { tag } : {}),
    },
  });
  return data;
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const { data } = await nextServer.post<Note>("/notes", newNote, {
    headers: { "Content-Type": "application/json" },
  });
  return data;
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const { data } = await nextServer.delete<Note>(`/notes/${noteId}`);
  return data;
};

export const getSingleNote = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
};

export const fetchNoteById = getSingleNote;


export const getCategories = async (): Promise<CategoryType[]> => {
  const { data } = await nextServer.get<CategoryType[]>("/categories");
  return data;
};

export type {
  NotesResponse,
  FetchNotesParams,
  Note as NoteType,
  NewNote as NewNoteType,
} from "@/types/note";
