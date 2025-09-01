import axios from "axios";
import { cookies } from "next/headers";
import { nextServer } from "@/lib/api/api";
import type { User } from "@/types/user";
import type { FetchNotesParams, Note, NotesResponse } from "@/types/note";

async function buildCookieHeader(): Promise<string> {
  const store = await cookies();
  return store
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

export const checkServerSession = async () => {
  const Cookie = await buildCookieHeader();
  return nextServer.get("/auth/session", { headers: { Cookie } });
};


export const getServerMe = async (): Promise<User> => {
  const Cookie = await buildCookieHeader();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie },
  });
  return data;
};


const TAG_MAP: Record<string, string> = {
  todo: "Todo",
  work: "Work",
  personal: "Personal",
  meeting: "Meeting",
  shopping: "Shopping",
  ideas: "Ideas",
  finance: "Finance",
  health: "Health",
  important: "Important",
  travel: "Travel",
};
function normalizeTagForApi(tag?: string): string | undefined {
  if (!tag) return undefined;
  const lower = tag.toLowerCase();
  if (lower === "all") return undefined; // all => не шлемо tag
  return TAG_MAP[lower] ?? tag;
}

interface NotesListAPI {
  data?: Note[];       
  notes?: Note[];      
  items?: Note[];      
  totalPages: number;
}


export const fetchNotesServer = async ({
  tag,
  search,
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<NotesResponse> => {
  const Cookie = await buildCookieHeader();
  const normalized = normalizeTagForApi(tag);

  const { data } = await nextServer.get<NotesListAPI>("/notes", {
    params: {
      page,
      perPage,
      ...(search?.trim() ? { search: search.trim() } : {}),
      ...(normalized ? { tag: normalized } : {}),
    },
    headers: { Cookie },
  });

  const list = data.notes ?? data.data ?? data.items ?? [];
  return {
    page,
    perPage,
    data: list,
    totalPages: data.totalPages,
  };
};

export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const Cookie = await buildCookieHeader();
  const { data } = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie },
  });
  return data;
};

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

export const getCategoriesServer = async (): Promise<CategoryType[]> => {
  const Cookie = await buildCookieHeader();
  try {
    const { data } = await nextServer.get<CategoryType[]>("/categories", {
      headers: { Cookie },
    });
    return data;
  } catch (err) {
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return [];
    }
    throw err;
  }
};
