"use client";

import { nextServer } from "./api";

import type {
  User,
  RegisterRequest,
  LoginRequest,
  UpdateUserRequest,
} from "@/types/user";
import type { Note, NewNoteData } from "@/types/note";

if (process.env.NODE_ENV === "development") {
  
  console.log("CLIENT API baseURL =", nextServer.defaults.baseURL);
}

/* =========================
 *          NOTES
 * ======================= */

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      ...(search.trim() && { search: search.trim() }),
      ...(tag && tag.toLowerCase() !== "all" && { tag }),
    },
  });
  return data;
};

export const createNote = async (newNote: NewNoteData): Promise<Note> => {
  const { data } = await nextServer.post<Note>("/notes", newNote);
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

/* =========================
 *       CATEGORIES
 * ======================= */

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const getCategories = async (): Promise<CategoryType[]> => {
  const { data } = await nextServer.get<CategoryType[]>("/categories");
  return data;
};

/* =========================
 *        AUTH / USER
 * ======================= */

export const registerUser = async (payload: RegisterRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/register", payload);
  return res.data;
};

export const loginUser = async (payload: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", payload);
  return res.data;
};

export const logoutUser = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

/** 
 * /auth/session у цьому бекенді повертає:
 *  - 200 з тілом користувача (авторизований)
 *  - 200 без тіла (не авторизований)
 * Тому приводимо до boolean без використання any.
 */
export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<unknown>("/auth/session");
  // Авторизованим вважаємо випадок, коли бекенд повернув об'єкт (user)
  return typeof res.data === "object" && res.data !== null;
};

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};

export type { Note, NewNoteData };
