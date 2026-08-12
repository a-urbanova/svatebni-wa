import "server-only";

import { cookies } from "next/headers";

import { SESSION_COOKIE_NAME } from "./session-cookie.ts";
import { getCurrentSessionByToken } from "./session-flow.ts";
import { getRepositories } from "../db/repositories/index.ts";

export * from "./session-flow.ts";

/** Načte session z cookie a vždy znovu autoritativně určí její roli z e-mailu. */
export async function getCurrentSession() {
  const sessionToken = (await cookies()).get(SESSION_COOKIE_NAME)?.value;

  if (!sessionToken) {
    return null;
  }

  const { sessions } = await getRepositories();
  return getCurrentSessionByToken(sessionToken, sessions);
}
