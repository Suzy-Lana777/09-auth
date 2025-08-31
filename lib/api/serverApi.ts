// lib/api/serverApi.ts

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

// Поточний користувач
export const getServerMe = async (): Promise<User> => {
  const Cookie = await buildCookieHeader();
  const { data } = await nextServer.get<User>("/users/me", {
    headers: { Cookie },
  });
  return data;
};


interface NotesListAPI {
  data: Note[];        
  totalPages: number;  
}

// Отримати список нотаток на сервері
export const fetchNotesServer = async ({
  tag,
  search,
  page = 1,
  perPage = 12,
}: FetchNotesParams): Promise<NotesResponse> => {
  const Cookie = await buildCookieHeader();

  const { data } = await nextServer.get<NotesListAPI>("/notes", {
    params: {
      tag,
      page,
      perPage,
      ...(search?.trim() ? { search } : {}),
    },
    headers: { Cookie },
  });

  return {
    page,
    perPage,
    data: data.data,          
    totalPages: data.totalPages,
  };
};

// Отримати одну нотатку за id на сервері
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
    // без any:
    if (axios.isAxiosError(err) && err.response?.status === 404) {
      return [];
    }
    throw err;
  }
};


// // lib/api/serverApi.ts
// import { cookies } from "next/headers";
// import { nextServer } from "@/lib/api/api"; // 
// import type { User } from "@/types/user";
// import type { FetchNotesParams, Note, NotesResponse } from "@/types/note";


// export const checkServerSession = async () => {
//   const cookieStore = cookies();
  
//   const res = await nextServer.get("/auth/session", {
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return res;
// };


// export const getServerMe = async (): Promise<User> => {
//   const cookieStore = cookies();
//   const { data } = await nextServer.get<User>("/users/me", {
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return data;
// };


// export const updateServerMe = async (payload: Partial<User>): Promise<User> => {
//   const cookieStore = cookies();
//   const { data } = await nextServer.patch<User>("/users/me", payload, {
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return data;
// };

// export const fetchNotesServer = async ({
//   tag,
//   search,
//   page = 1,
//   perPage = 12,
// }: FetchNotesParams): Promise<NotesResponse> => {
//   const cookieStore = cookies();

//   const res = await nextServer.get("/notes", {
//     params: {
//       tag,
//       page,
//       perPage,
//       ...(search?.trim() ? { search } : {}),
//     },
//     headers: { Cookie: cookieStore.toString() },
//   });

//   const payload = res.data ?? {};

//    const list: Note[] =
//     Array.isArray(payload.data)
//       ? payload.data
//       : Array.isArray(payload.notes)
//       ? payload.notes
//       : [];

//   const totalPages: number =
//     typeof payload.totalPages === "number" ? payload.totalPages : 1;

//   return {
//     page,
//     perPage,
//     data: list,
//     totalPages,
//   };
// };


// export const fetchNoteByIdServer = async (id: string): Promise<Note> => {
//   const cookieStore = cookies();
//   const res = await nextServer.get<Note>(`/notes/${id}`, {
//     headers: { Cookie: cookieStore.toString() },
//   });
//   return res.data;
// };

// export interface CategoryType {
//   id?: string;
//   name: string;
//   description?: string;
//   createdAt?: string;
//   updatedAt?: string;
// }

// export const getCategoriesServer = async (): Promise<CategoryType[]> => {
//   const cookieStore = cookies();

//   try {
//     const res = await nextServer.get<any>("/categories", {
//       headers: { Cookie: cookieStore.toString() },
//     });

//     const raw = Array.isArray(res.data)
//       ? res.data
//       : res.data?.categories ?? res.data?.tags ?? [];

    
//     const categories: CategoryType[] = (Array.isArray(raw) ? raw : []).map((item: any) => {
//       if (typeof item === "string") {
//         return { name: item };
//       }
      
//       const id =
//         (item?.id ?? item?.value ?? item?.slug ?? item?._id)?.toString();
//       const name =
//         item?.name ?? item?.title ?? item?.label ?? String(item ?? "");
//       const description = item?.description;
//       const createdAt = item?.createdAt;
//       const updatedAt = item?.updatedAt;

//       return { id, name, description, createdAt, updatedAt };
//     });

//     return categories;
//   } catch (error: any) {
    
//     if (error?.response?.status === 404) {
//       return [];
//     }
//     throw error;
//   }
// };
