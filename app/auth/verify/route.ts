import { NextResponse } from "next/server";

import { SESSION_COOKIE_NAME, sessionCookieOptions } from "@/lib/auth/session-cookie";
import { verifyMagicLink } from "@/lib/auth/sessions";
import { getServerEnv } from "@/lib/config/env.server";
import { getRepositories } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

function homeRedirect(request: Request, state: "invalid-link" | "verification-failed"): NextResponse {
  const url = new URL("/", request.url);
  url.searchParams.set("auth", state);
  return NextResponse.redirect(url);
}

export async function GET(request: Request): Promise<NextResponse> {
  try {
    const env = getServerEnv();
    const { loginTokens, sessions } = await getRepositories();
    const outcome = await verifyMagicLink(
      new URL(request.url).searchParams.get("token"),
      { env, loginTokens, sessions },
    );

    if (outcome.kind === "invalid_token") {
      return homeRedirect(request, "invalid-link");
    }

    const response = NextResponse.redirect(new URL(outcome.destination, request.url));
    response.cookies.set({
      name: SESSION_COOKIE_NAME,
      value: outcome.sessionToken,
      ...sessionCookieOptions(outcome.session.expiresAt, process.env.NODE_ENV === "production"),
    });
    return response;
  } catch {
    return homeRedirect(request, "verification-failed");
  }
}
