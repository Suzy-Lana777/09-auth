// /lib/api/serverApi.ts

// import { cookies } from "next/headers";
// import type { AxiosResponse } from "axios";
// import type { User } from "@/types/user";
// import type { Note } from "@/types/note";
// import { nextServer } from "./api";


// export interface FetchNotesResponse {
//   notes: Note[];
//   totalPages: number;
// }


// export const checkServerSession = async (): Promise<AxiosResponse<unknown>> => {
//   const store = await cookies();
//   return nextServer.get("/auth/session", {
//     headers: { Cookie: store.toString() },
//   });
// };


// export const getServeMe = async (): Promise<User> => {
//   const cookieStore = await cookies();
//   const { data } = await nextServer.get<User>("/users/me", {
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return data;
// };

// export const updateServerMe = async (payload: Partial<User>): Promise<User> => {
//   const cookieStore = await cookies();
//   const { data } = await nextServer.patch<User>("/users/me", payload, {
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return data;
// };


// export const fetchNotesServer = async (params: {
//   page?: number;
//   perPage?: number;
//   search?: string;
//   tag?: string;
// }): Promise<FetchNotesResponse> => {
//   const { page = 1, perPage = 12, search = "", tag } = params;
//   const cookieStore = await cookies();

//   const query = {
//     page,
//     perPage,
//     ...(search.trim() ? { search } : {}),
//     ...(tag && tag.toLowerCase() !== "all" ? { tag } : {}),
//   };

//   const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
//     params: query,
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return data;
// };

// export const fetchNoteById = async (id: string): Promise<Note> => {
//   const cookieStore = await cookies();
//   const { data } = await nextServer.get<Note>(`/notes/${id}`, {
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return data;
// };



// export const getCategoriesServer = async (): Promise<string[]> => {
//   const cookieStore = await cookies();


//   const { data } = await nextServer.get<any>("/categories", {
//     headers: { Cookie: cookieStore.toString() },
//   });

//   // Підтримуємо різні форми відповіді бекенда/проксі
//   const list: unknown =
//     Array.isArray(data) ? data : data?.categories ?? data?.tags ?? [];

//   return (list as string[]) || [];
// };

// /lib/api/serverApi.tsimport { cookies } from "next/headers";import { nextServer } from "@/lib/api/api";import type { User } from "@/types/user";import type { FetchNotesParams, Note, NotesResponse } from "@/types/note";/* ========================= *  AUTH / SESSION * ======================= */// Перевірка активної сесії на серверіexport const checkServerSession = async () => {  const cookieStore = cookies();  const res = await nextServer.get("/auth/session", {    headers: {      Cookie: cookieStore.toString(),    },  });  return res;};// Отримати профіль користувача на серверіexport const getServerMe = async (): Promise<User> => {  const cookieStore = cookies();  const { data } = await nextServer.get<User>("/users/me", {    headers: {      Cookie: cookieStore.toString(),    },  });  return data;};/* ========================= *  NOTES * ======================= */// Отримати список нотаток на серверіexport const fetchNotesServer = async ({  tag,  search,  page = 1,  perPage = 12,}: FetchNotesParams): Promise<NotesResponse> => {  try {    const cookieStore = cookies();    const res = await nextServer.get<NotesResponse>("/notes", {      params: {        tag,        page,        perPage,        ...(search?.trim() ? { search } : {}),      },      headers: {        Cookie: cookieStore.toString(),      },    });    return {      page,      perPage,      data: res.data.data,      // ✅ беремо масив нотаток з поля data      totalPages: res.data.totalPages,    };  } catch (error) {    throw error;  }};// Отримати одну нотатку за id на серверіexport const fetchNoteByIdServer = async (id: string): Promise<Note> => {  try {    const cookieStore = cookies();    const res = await nextServer.get<Note>(`/notes/${id}`, {      headers: {        Cookie: cookieStore.toString(),      },    });    return res.data;  } catch (error) {    throw error;  }};/* ========================= *  CATEGORIES * ======================= */export interface CategoryType {  id: string;  name: string;  description: string;  createdAt: string;  updatedAt: string;}export const getCategoriesServer = async (): Promise<CategoryType[]> => {  const cookieStore = cookies();  try {    const { data } = await nextServer.get<CategoryType[]>("/categories", {      headers: {        Cookie: cookieStore.toString(),      },    });    return data;  } catch (error: unknown) {    if (      typeof error === "object" &&      error !== null &&      "response" in error &&      (error as { response?: { status?: number } }).response?.status === 404    ) {      return [];    }


// lib/api/serverApi.ts
import { cookies } from "next/headers";
import { nextServer } from "@/lib/api/api"; // 
import type { User } from "@/types/user";
import type { FetchNotesParams, Note, NotesResponse } from "@/types/note";


export const checkServerSession = async () => {
  const cookieStore = cookies();
  
  const res = await nextServer.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
  });
  return res;
};


export const getServerMe = async (): Promise<User> => {
  const cookieStore = cookies();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};


export const updateServerMe = async (payload: Partial<User>): Promise<User> => {
  const cookieStore = cookies();
  const { data } = await nextServer.patch<User>("/users/me", payload, {
    headers: { Cookie: cookieStore.toString() },
  });
  return data;
};

export const fetchNotesServer = async ({
  tag,
  search,
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<NotesResponse> => {
  const cookieStore = cookies();

  const res = await nextServer.get("/notes", {
    params: {
      tag,
      page,
      perPage,
      ...(search?.trim() ? { search } : {}),
    },
    headers: { Cookie: cookieStore.toString() },
  });

  const payload = res.data ?? {};

   const list: Note[] =
    Array.isArray(payload.data)
      ? payload.data
      : Array.isArray(payload.notes)
      ? payload.notes
      : [];

  const totalPages: number =
    typeof payload.totalPages === "number" ? payload.totalPages : 1;

  return {
    page,
    perPage,
    data: list,
    totalPages,
  };
};


export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
  const cookieStore = cookies();
  const res = await nextServer.get<Note>(`/notes/${id}`, {
    headers: { Cookie: cookieStore.toString() },
  });
  return res.data;
};

export interface CategoryType {
  id?: string;
  name: string;
  description?: string;
  createdAt?: string;
  updatedAt?: string;
}

export const getCategoriesServer = async (): Promise<CategoryType[]> => {
  const cookieStore = cookies();

  try {
    const res = await nextServer.get<any>("/categories", {
      headers: { Cookie: cookieStore.toString() },
    });

    const raw = Array.isArray(res.data)
      ? res.data
      : res.data?.categories ?? res.data?.tags ?? [];

    
    const categories: CategoryType[] = (Array.isArray(raw) ? raw : []).map((item: any) => {
      if (typeof item === "string") {
        return { name: item };
      }
      
      const id =
        (item?.id ?? item?.value ?? item?.slug ?? item?._id)?.toString();
      const name =
        item?.name ?? item?.title ?? item?.label ?? String(item ?? "");
      const description = item?.description;
      const createdAt = item?.createdAt;
      const updatedAt = item?.updatedAt;

      return { id, name, description, createdAt, updatedAt };
    });

    return categories;
  } catch (error: any) {
    
    if (error?.response?.status === 404) {
      return [];
    }
    throw error;
  }
};
