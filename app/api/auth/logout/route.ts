import { NextResponse } from "next/server";

import {
  expiredSessionCookieOptions,
  SESSION_COOKIE_NAME,
} from "@/lib/auth/session-cookie";
import { invalidateSession } from "@/lib/auth/sessions";
import { isSameOriginMutation } from "@/lib/auth/request-security";
import { getServerEnv } from "@/lib/config/env.server";
import { getRepositories } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

export async function POST(request: Request): Promise<NextResponse> {
  try {
    if (!isSameOriginMutation(request, getServerEnv().APP_URL)) {
      return NextResponse.json(
        { kind: "forbidden", message: "Požadavek nelze ověřit. Obnovte stránku a zkuste to znovu." },
        { status: 403, headers: { "Cache-Control": "no-store" } },
      );
    }
  } catch {
    return NextResponse.json(
      { kind: "server_error", message: "Odhlášení se teď nepodařilo dokončit. Zkuste to prosím později." },
      { status: 500, headers: { "Cache-Control": "no-store" } },
    );
  }

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
  response.headers.set("Cache-Control", "no-store");
  response.headers.set("Referrer-Policy", "no-referrer");
  response.cookies.set({
    name: SESSION_COOKIE_NAME,
    value: "",
    ...expiredSessionCookieOptions(process.env.NODE_ENV === "production"),
  });
  return response;
}
