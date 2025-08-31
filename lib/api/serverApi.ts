// /lib/api/serverApi.ts
import { cookies } from "next/headers";
import { nextServer } from "@/lib/api/api";
import type { User } from "@/types/user";
import type { FetchNotesParams, Note, NotesResponse } from "@/types/note";

/* =========================
 *  AUTH / SESSION
 * ======================= */

// Перевірка активної сесії на сервері
export const checkServerSession = async () => {
  const cookieStore = cookies();
  const res = await nextServer.get("/auth/session", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return res;
};

// Отримати профіль користувача на сервері
export const getServerMe = async (): Promise<User> => {
  const cookieStore = cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: {
      Cookie: cookieStore.toString(),
    },
  });
  return data;
};

/* =========================
 *  NOTES
 * ======================= */

// Отримати список нотаток на сервері
export const fetchNotesServer = async ({
  tag,
  search,
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<NotesResponse> => {
  try {
    const cookieStore = cookies();
    const res = await nextServer.get<NotesResponse>("/notes", {
      params: {
        tag,
        page,
        perPage,
        ...(search?.trim() ? { search } : {}),
      },
      headers: {
        Cookie: cookieStore.toString(),
      },
    });

    return {
      page,
      perPage,
      data: res.data.data,      // ✅ беремо масив нотаток з поля data
      totalPages: res.data.totalPages,
    };
  } catch (error) {
    throw error;
  }
};

// Отримати одну нотатку за id на сервері
export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  try {
    const cookieStore = cookies();
    const res = await nextServer.get<Note>(`/notes/${id}`, {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return res.data;
  } catch (error) {
    throw error;
  }
};

/* =========================
 *  CATEGORIES
 * ======================= */

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const getCategoriesServer = async (): Promise<CategoryType[]> => {
  const cookieStore = cookies();
  try {
    const { data } = await nextServer.get<CategoryType[]>("/categories", {
      headers: {
        Cookie: cookieStore.toString(),
      },
    });
    return data;
  } catch (error: unknown) {
    if (
      typeof error === "object" &&
      error !== null &&
      "response" in error &&
      (error as { response?: { status?: number } }).response?.status === 404
    ) {
      return [];
    }
    throw error;
  }
};
