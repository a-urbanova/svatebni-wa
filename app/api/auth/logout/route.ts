import { NextResponse } from "next/server";

import {
  expiredSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session-cookie";
import { invalidateSession } from "@/lib/auth/sessions";
import { getRepositories } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  const sessionToken = request.headers
    .get("cookie")
    ?.split(";")
    .map((item) => item.trim())
    .find((item) => item.startsWith(`${SESSION_COOKIE_NAME}=`))
    ?.slice(SESSION_COOKIE_NAME.length + 1);

  try {
    const { sessions } = await getRepositories();
    await invalidateSession(sessionToken, sessions);
  } catch {
    // Cookie se smaže i pokud databáze dočasně není dostupná.
  }

  const response = NextResponse.redirect(new URL("/", request.url), { status: 303 });
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    ...expiredSessionCookieOptions(process.env.NODE_ENV === "production"),
  });
  return response;
}
