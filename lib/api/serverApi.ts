// /lib/api/serverApi.ts

import { cookies } from "next/headers";
import { nextServer } from "@/lib/api/api";
import type { User } from "@/types/user";
import type { FetchNotesParams, Note, NotesResponse } from "@/types/note";

/** Схема відповіді /notes */
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

/** Експортуємо тип категорій */
export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// Перевірка активної сесії на сервері
export const checkServerSession = async () => {
  const cookieStore = cookies();
  const res = await nextServer.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return res;
};

// Профіль користувача
export const getServeMe = async (): Promise<User> => {
  const cookieStore = cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

// Нотатки (список)
export const fetchNotesServer = async ({
  tag,
  search,
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<NotesResponse> => {
  const cookieStore = cookies();
  const res = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      tag,
      page,
      perPage,
      ...(search?.trim() ? { search } : {}),
    },
    headers: { Cookie: cookieStore.toString() },
  });

  return {
    page,
    perPage,
    data: res.data.notes,
    totalPages: res.data.totalPages,
  };
};

// Нотатка (одна)
export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = cookies();
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};

// Категорії (теги) — ЕКСПОРТУЄМО
export const getCategoriesServer = async (): Promise<CategoryType[]> => {
  const cookieStore = cookies();
  try {
    const res = await nextServer.get<CategoryType[]>("/categories", {
      headers: { Cookie: cookieStore.toString() },
    });
    return res.data;
  } catch (error: unknown) {
    // Якщо 404 — повертаємо порожній масив
    if (
      typeof error === "object" &&
      error !== null &&
      
      (error as any).response?.status === 404
    ) {
      return [];
    }
    throw error;
  }
};
