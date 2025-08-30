// middleware.ts
import { NextRequest, NextResponse } from "next/server";

const PRIVATE_ROUTES = ["/profile"];
const PUBLIC_ROUTES = ["/sign-in", "/sign-up"];

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // Читаємо токени з кукі запиту
  const accessToken = request.cookies.get("accessToken")?.value ?? null;
  // const refreshToken = request.cookies.get("refreshToken")?.value ?? null; // якщо колись знадобиться

  const isPublicRoute = PUBLIC_ROUTES.some((route) => pathname.startsWith(route));
  const isPrivateRoute = PRIVATE_ROUTES.some((route) => pathname.startsWith(route));

  // 1) Неавторизований → приватна сторінка → редірект на /sign-in
  if (!accessToken && isPrivateRoute) {
    return NextResponse.redirect(new URL("/sign-in", request.url));
  }

  // 2) Авторизований → публічна сторінка → редірект на /profile
  if (accessToken && isPublicRoute) {
    return NextResponse.redirect(new URL("/profile", request.url));
  }

  // 3) Інакше — пропускаємо
  return NextResponse.next();
}

// Підключаємо лише потрібні маршрути
export const config = {
  matcher: ["/profile/:path*", "/sign-in", "/sign-up"],
};
