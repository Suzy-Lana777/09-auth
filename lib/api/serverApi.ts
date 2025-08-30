//lib/api/serverApi.ts

import { nextServer } from "../api/api"; // інстанс axios з lib/api.ts
import { cookies } from "next/headers";
import type { AxiosResponse } from "axios";
import type { User } from "@/types/user";
import type { Note } from "@/types/note";

// Якщо цих типів немає в "@/types/note", оголошуємо локально:
interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}
interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

// ---- допоміжна утиліта для побудови Cookie заголовка ----
async function buildCookieHeader(): Promise<string> {
  const cookieStore = await cookies();
  return cookieStore
    .getAll()
    .map((c) => `${c.name}=${c.value}`)
    .join("; ");
}

// ---- Auth / Session ----
export const serverGetSession = async (): Promise<AxiosResponse<unknown>> => {
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

export const updateServerMe = async (payload: Partial<User>): Promise<User> => {
  const Cookie = await buildCookieHeader();
  const { data } = await nextServer.patch<User>("/users/me", payload, {
    headers: { Cookie },
  });
  return data;
};

// ---- Notes ----
export const fetchNotesServer = async (
  page: number,
  perPage: number = 12,
  search: string = "",
  tag?: string
): Promise<FetchNotesResponse> => {
  const Cookie = await buildCookieHeader();
  const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
    params: {
      page,
      perPage,
      ...(search.trim() ? { search } : {}),
      ...(tag && tag.toLowerCase() !== "all" ? { tag } : {}),
    },
    headers: { Cookie },
  });
  return data;
};

// ---- Categories ----
export const getCategoriesServer = async (): Promise<CategoryType[]> => {
  const Cookie = await buildCookieHeader();
  try {
    const { data } = await nextServer.get<CategoryType[]>("/categories", {
      headers: { Cookie },
    });
    return data;
  } catch (error: any) {
    if (error?.response?.status === 404) return [];
    throw error;
  }
};






// import { nextServer } from "../api/api"; // інстанс axios з lib/api.ts
// import { cookies } from "next/headers";
// import type { AxiosResponse } from "axios";
// import type { User } from "@/types/user";
// import type { Note } from "@/types/note";

// // Якщо цих типів немає в "@/types/note", оголошуємо локально:
// interface FetchNotesResponse {
//   notes: Note[];
//   totalPages: number;
// }
// interface CategoryType {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
// }

// // ---- Auth / Session ----
// export const serverGetSession = async (): Promise<AxiosResponse<unknown>> => {
//   const store = cookies();
//   return nextServer.get("/auth/session", { headers: { Cookie: store.toString() } });
// };

// export const getServerMe = async (): Promise<User> => {
//   const store = cookies();
//   const { data } = await nextServer.get<User>("/users/me", {
//     headers: { Cookie: store.toString() },
//   });
//   return data;
// };

// export const updateServerMe = async (payload: Partial<User>): Promise<User> => {
//   const store = cookies();
//   const { data } = await nextServer.patch<User>("/users/me", payload, {
//     headers: { Cookie: store.toString() },
//   });
//   return data;
// };

// // ---- Notes ----
// export const fetchNotesServer = async (
//   page: number,
//   perPage: number = 12,
//   search: string = "",
//   tag?: string
// ): Promise<FetchNotesResponse> => {
//   const store = cookies();
//   const { data } = await nextServer.get<FetchNotesResponse>("/notes", {
//     params: {
//       page,
//       perPage,
//       ...(search.trim() ? { search } : {}),
//       ...(tag && tag.toLowerCase() !== "all" ? { tag } : {}),
//     },
//     headers: { Cookie: store.toString() },
//   });
//   return data;
// };

// // ---- Categories ----
// export const getCategoriesServer = async (): Promise<CategoryType[]> => {
//   const store = cookies();
//   try {
//     const { data } = await nextServer.get<CategoryType[]>("/categories", {
//       headers: { Cookie: store.toString() },
//     });
//     return data;
//   } catch (error: any) {
//     if (error?.response?.status === 404) return [];
//     throw error;
//   }
// };

     
