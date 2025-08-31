// app/api/auth/session/route.ts

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import axios from "axios";

const api = axios.create({
  baseURL: "https://notehub-api.goit.study",
  withCredentials: true,
});

export async function GET() {
  const cookieStore = cookies();

  const res = await api.get("/auth/session", {
    headers: { Cookie: cookieStore.toString() },
    validateStatus: () => true,
  });

  // Проксіюємо Set-Cookie назад клієнту, якщо бекенд оновив токени
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
