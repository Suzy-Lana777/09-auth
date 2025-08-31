// lib/api.ts

import axios from "axios";

export const nextServer = axios.create({
  baseURL: "https://notehub-api.goit.study", 
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});
