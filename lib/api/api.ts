// lib/api/api.ts

import axios from "axios";

export const nextServer = axios.create({
  baseURL: "/api", 
  headers: { "Content-Type": "application/json" },
  withCredentials: true,
});


