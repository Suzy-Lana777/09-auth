export const dynamic = "force-dynamic";

import { NextResponse } from "next/server";
import { cookies } from "next/headers";
import { isAxiosError } from "axios";

// якщо цей утил лежить у app/api/_utils/utils.ts — такий шлях коректний.
// Якщо ні — заміни на відносний: import { logErrorResponse } from "../_utils/utils";
import { logErrorResponse } from "@/app/api/_utils/utils";

// ✅ правильний інстанс для серверних route'ів
import { nextServer } from "@/lib/api/api";

export async function GET() {
  try {
    const cookieStore = cookies();

    const res = await nextServer.get("/users/me", {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}

export async function PATCH(request: Request) {
  try {
    const cookieStore = cookies();
    const body = await request.json();

    const res = await nextServer.patch("/users/me", body, {
      headers: { Cookie: cookieStore.toString() },
    });

    return NextResponse.json(res.data, { status: res.status });
  } catch (error) {
    if (isAxiosError(error)) {
      logErrorResponse(error.response?.data);
      return NextResponse.json(
        { error: error.message, response: error.response?.data },
        { status: error.response?.status ?? 500 }
      );
    }
    logErrorResponse({ message: (error as Error).message });
    return NextResponse.json({ error: "Internal Server Error" }, { status: 500 });
  }
}
