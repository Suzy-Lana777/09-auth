// lib/api/api.ts

import axios from "axios";

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL, 
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


if (process.env.NODE_ENV === "development") {
  // @ts-ignore
  // eslint-disable-next-line no-console
  console.log("API baseURL =", nextServer.defaults.baseURL);
}

