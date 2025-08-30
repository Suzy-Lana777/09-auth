// /lib/api/serverApi.ts

// /lib/api/serverApi.ts

import { cookies } from "next/headers";
import { nextServer } from "./api";
import type { AxiosResponse } from "axios";
import type { User } from "@/types/user";
import type { FetchNotesParams, Note, NotesResponse } from "@/types/note";

// Тип реальної відповіді бекенду для /notes
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

// Перевірка активної сесії на сервері
export const checkServerSession = async (): Promise<AxiosResponse<unknown>> => {
  const cookieStore = cookies();
  return nextServer.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
};

// Отримати профіль користувача на сервері
export const getServeMe = async (): Promise<User> => {
  const cookieStore = cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

// Отримати список нотаток на сервері (адаптуємо форму відповіді бекенду до вашого NotesResponse)
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

// Отримати одну нотатку за id на сервері
export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = cookies();
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};
