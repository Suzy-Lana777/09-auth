// // lib/api.clientApi.ts

// lib/api.clientApi.ts

import axios from 'axios';
import type { Note, NoteTag } from '../../types/note';

axios.defaults.baseURL = "https://notehub-public.goit.study/api";

export interface FetchNotesResponse {
  notes: Note[];
  totalPages: number;
}

export interface NewNote {
  title: string;
  content: string;
  tag: NoteTag;
}

export interface CategoryType {
  id: string;
  name: string;
  description: string;
  createdAt: string;
  updatedAt: string;
}

const getAuthHeader = () => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  return { Authorization: `Bearer ${myKey}` };
};

export const fetchNotes = async (
  page: number,
  search: string,
  tag?: string
): Promise<FetchNotesResponse> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  try {
    const res = await axios.get<FetchNotesResponse>('/notes', {
      params: {
        page,
        ...(search.trim() && { search: search.trim() }),
        ...(tag && tag.toLowerCase() !== 'all' && { tag }),
      },
      headers: { Authorization: `Bearer ${myKey}` },
    });

    return res.data;
  } catch (error: unknown) {
    console.error('fetchNotes error:', error);
    throw error;
  }
};

export const createNote = async (newNote: NewNote): Promise<Note> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  try {
    const res = await axios.post<Note>('/notes', newNote, {
      headers: { Authorization: `Bearer ${myKey}` },
    });
    return res.data;
  } catch (error: unknown) {
    console.error('createNote error:', error);
    throw error;
  }
};

export const deleteNote = async (noteId: string): Promise<Note> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  try {
    const res = await axios.delete<Note>(`/notes/${noteId}`, {
      headers: { Authorization: `Bearer ${myKey}` },
    });
    return res.data;
  } catch (error: unknown) {
    console.error('deleteNote error:', error);
    throw error;
  }
};

// Отримати одну нотатку за id
export const getSingleNote = async (id: string): Promise<Note> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

  try {
    const res = await axios.get<Note>(`/notes/${id}`, {
      headers: { Authorization: `Bearer ${myKey}` },
    });
    return res.data;
  } catch (error: unknown) {
    console.error('getSingleNote error:', error);
    throw error;
  }
};

// Отримати категорії
export const getCategories = async (): Promise<CategoryType[]> => {
  const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
  try {
    const res = await axios.get<CategoryType[]>('/categories', {
      headers: { Authorization: `Bearer ${myKey}` },
    });
    return res.data;
  } catch (error: unknown) {
    if (axios.isAxiosError(error)) {
      if (error.response?.status === 404) return []; // повертаємо пустий масив для 404
      throw error; // інші помилки кидаємо далі
    } else {
      throw new Error('Unknown error occurred while fetching categories');
    }
  }
};

//
// === ДОДАНО: auth/user для твого бекенду через nextServer ===
//

import { nextServer } from "./api";
import type {
  User,
  RegisterRequest,
  LoginRequest,
  UpdateUserRequest,
  CheckSessionRequest,
} from "@/types/user";

// Реєстрація користувача
export const registerUser = async (data: RegisterRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/register", data);
  return res.data;
};

// Логін користувача
export const loginUser = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", data);
  return res.data;
};

// Логаут користувача
export const logoutUser = async (): Promise<void> => {
  await nextServer.post("/auth/logout");
};

// Перевірка сесії
export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session");
  return res.data.success;
};

// Поточний користувач
export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me");
  return data;
};

// Оновлення профілю
export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload);
  return res.data;
};

export type { Note, NoteTag };



// import axios from 'axios';
// import type { Note, NoteTag } from '../../types/note';

// axios.defaults.baseURL = "https://notehub-public.goit.study/api";

// export interface FetchNotesResponse {
//   notes: Note[];
//   totalPages: number;
// }

// export interface NewNote {
//   title: string;
//   content: string;
//   tag: NoteTag;
// }

// export interface CategoryType {
//   id: string;
//   name: string;
//   description: string;
//   createdAt: string;
//   updatedAt: string;
// }

// const getAuthHeader = () => {
//   const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
//   return { Authorization: `Bearer ${myKey}` };
// };

// export const fetchNotes = async (
//   page: number,
//   search: string,
//   tag?: string
// ): Promise<FetchNotesResponse> => {
//   const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

//   try {
//     const res = await axios.get<FetchNotesResponse>('/notes', {
//       params: {
//         page,
//         ...(search.trim() && { search: search.trim() }),
//         ...(tag && tag.toLowerCase() !== 'all' && { tag }),
//       },
//       headers: { Authorization: `Bearer ${myKey}` },
//     });

//     return res.data;
//   } catch (error: unknown) {
//     console.error('fetchNotes error:', error);
//     throw error;
//   }
// };

// export const createNote = async (newNote: NewNote): Promise<Note> => {
//   const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

//   try {
//     const res = await axios.post<Note>('/notes', newNote, {
//       headers: { Authorization: `Bearer ${myKey}` },
//     });
//     return res.data;
//   } catch (error: unknown) {
//     console.error('createNote error:', error);
//     throw error;
//   }
// };

// export const deleteNote = async (noteId: string): Promise<Note> => {
//   const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

//   try {
//     const res = await axios.delete<Note>(`/notes/${noteId}`, {
//       headers: { Authorization: `Bearer ${myKey}` },
//     });
//     return res.data;
//   } catch (error: unknown) {
//     console.error('deleteNote error:', error);
//     throw error;
//   }
// };

// // Отримати одну нотатку за id
// export const getSingleNote = async (id: string): Promise<Note> => {
//   const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;

//   try {
//     const res = await axios.get<Note>(`/notes/${id}`, {
//       headers: { Authorization: `Bearer ${myKey}` },
//     });
//     return res.data;
//   } catch (error: unknown) {
//     console.error('getSingleNote error:', error);
//     throw error;
//   }
// };

// // Отримати категорії
// export const getCategories = async (): Promise<CategoryType[]> => {
//   const myKey = process.env.NEXT_PUBLIC_NOTEHUB_TOKEN;
//   try {
//     const res = await axios.get<CategoryType[]>('/categories', {
//       headers: { Authorization: `Bearer ${myKey}` },
//     });
//     return res.data;
//   } catch (error: unknown) {
//     if (axios.isAxiosError(error)) {
//       if (error.response?.status === 404) return []; // повертаємо пустий масив для 404
//       throw error; // інші помилки кидаємо далі
//     } else {
//       throw new Error('Unknown error occurred while fetching categories');
//     }
//   }
// };

// //
// // === ДОДАНО: auth/user для твого бекенду через nextServer ===
// //

// import { nextServer } from "./api";
// import type {
//   User,
//   RegisterRequest,
//   LoginRequest,
//   UpdateUserRequest,
//   CheckSessionRequest,
// } from "@/types/user";

// // Реєстрація користувача
// export const registerUser = async (data: RegisterRequest): Promise<User> => {
//   const res = await nextServer.post<User>("/auth/register", data);
//   return res.data;
// };

// // Логін користувача
// export const loginUser = async (data: LoginRequest): Promise<User> => {
//   const res = await nextServer.post<User>("/auth/login", data);
//   return res.data;
// };

// // Логаут користувача
// export const logoutUser = async (): Promise<void> => {
//   await nextServer.post("/auth/logout");
// };

// export type { Note, NoteTag };

