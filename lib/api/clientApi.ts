// lib/api/clientApi.ts

"use client";

import { nextServer } from "./api";

import type { User, UpdateUserRequest } from "@/types/user";
import type {
  Note,
  NewNote,
  NotesResponse,
  FetchNotesParams,
} from "@/types/note";

if (process.env.NODE_ENV === "development") {
    console.log("CLIENT API baseURL =", nextServer.defaults?.baseURL);
}

export interface RegisterRequest {
  email: string;
  password: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export const register = async (payload: RegisterRequest): Promise<User> => {
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

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<unknown>("/auth/session");
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

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export const fetchNotes = async ({
  tag,
  search,
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<NotesResponse> => {
  const res = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      tag,
      page,
      perPage,
      ...(search?.trim() ? { search: search.trim() } : {}),
    },
  });

  return {
    page,
    perPage,
    data: res.data.notes,
    totalPages: res.data.totalPages,
  };
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

export const fetchNoteById = async (id: string): Promise<Note> => {
  const { data } = await nextServer.get<Note>(`/notes/${id}`);
  return data;
};

export type {
  NotesResponse,
  FetchNotesParams,
  Note,
  NewNote,
} from "@/types/note";
