// app/api/auth/register/route.ts

import { NextResponse } from "next/server";
import axios from "axios";

const api = axios.create({
  baseURL: "https://notehub-api.goit.study",
  withCredentials: true,
  headers: { "Content-Type": "application/json" },
});

export async function POST(request: Request) {
  const body = await request.json(); // { email, password }

  const res = await api.post("/auth/register", body, {
    validateStatus: () => true,
  });

  // Проксіюємо Set-Cookie назад клієнту, якщо бекенд видав токени
  const setCookie = res.headers["set-cookie"];
  const headers = new Headers();
  if (setCookie) {
    const list = Array.isArray(setCookie) ? setCookie : [setCookie];
    list.forEach((c) => headers.append("Set-Cookie", c));
  }

  return new NextResponse(JSON.stringify(res.data ?? {}), {
    status: res.status,
    headers,
  });
}
