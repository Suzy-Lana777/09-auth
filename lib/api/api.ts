// lib/api.ts

// import axios from "axios";

// export const nextServer = axios.create({
//   baseURL: "https://notehub-api.goit.study", 
//   headers: { "Content-Type": "application/json" },
//   withCredentials: true,
// });

import axios from "axios";

export const nextServer = axios.create({
  baseURL: process.env.NEXT_PUBLIC_API_URL + "/api",
  withCredentials: true,
});