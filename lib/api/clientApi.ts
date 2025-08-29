// lib/api/clientApi.ts
"use client"

import type { CheckSessionRequest, LoginRequest, RegisterRequest, UpdateUserRequest, User } from "@/types/user"
import { nextServer } from "./api"
import type { Note, NewNote, NoteTag, FetchNotesResponse } from "./api"
import {
  fetchNotes as apiFetchNotes,
  getSingleNote as apiGetSingleNote,
  createNote as apiCreateNote,
  deleteNote as apiDeleteNote,
  getCategories as apiGetCategories,
} from "./api"

// ===== Notes API =====
export type { Note, NewNote, NoteTag }

export const fetchNotes = apiFetchNotes
export const fetchNoteById = apiGetSingleNote
export const createNote = apiCreateNote
export const deleteNote = apiDeleteNote
export const getCategories = apiGetCategories

// ===== Auth API =====
export const registerUser = async (data: RegisterRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/register", data)
  return res.data
}

export const loginUser = async (data: LoginRequest): Promise<User> => {
  const res = await nextServer.post<User>("/auth/login", data)
  return res.data
}

export const logoutUser = async (): Promise<void> => {
  await nextServer.post("/auth/logout")
}

export const checkSession = async (): Promise<boolean> => {
  const res = await nextServer.get<CheckSessionRequest>("/auth/session")
  return res.data.success
}

export const getMe = async (): Promise<User> => {
  const { data } = await nextServer.get<User>("/users/me")
  return data
}

export const updateMe = async (payload: UpdateUserRequest): Promise<User> => {
  const res = await nextServer.patch<User>("/users/me", payload)
  return res.data
}
