import { randomBytes } from "node:crypto";

import { isAdminEmail, normalizeEmail } from "./emails.ts";
import type { ServerEnv } from "../config/env.schema.ts";
import type { LoginToken } from "../db/repositories/login-tokens.ts";
import type { Session } from "../db/repositories/sessions.ts";

export type SessionRole = "guest" | "admin";

export type CurrentSession = Session & {
  role: SessionRole;
};

type LoginTokenStore = {
  consumeValidToken(token: string, now: Date): Promise<LoginToken | null>;
};

type SessionStore = {
  create(
    input: { sessionToken: string; email: string; expiresAt: Date },
    now: Date,
  ): Promise<unknown>;
  findValidByToken(sessionToken: string, now: Date): Promise<Session | null>;
  invalidate(sessionToken: string): Promise<boolean>;
};

export type VerifyMagicLinkOutcome =
  | { kind: "invalid_token" }
  | {
      kind: "success";
      sessionToken: string;
      session: CurrentSession;
      destination: "/host" | "/admin";
    };

type VerifyMagicLinkDependencies = {
  env: ServerEnv;
  loginTokens: LoginTokenStore;
  sessions: SessionStore;
  now?: Date;
  generateToken?: () => string;
};

export function roleForEmail(email: string): SessionRole {
  return isAdminEmail(email) ? "admin" : "guest";
}

export function destinationForRole(role: SessionRole): "/host" | "/admin" {
  return role === "admin" ? "/admin" : "/host";
}

export function generateSessionToken(): string {
  return randomBytes(32).toString("base64url");
}

/** Atomicky spotřebuje magic link a vytvoří serverově určenou session. */
export async function verifyMagicLink(
  token: string | null,
  {
    env,
    loginTokens,
    sessions,
    now = new Date(),
    generateToken = generateSessionToken,
  }: VerifyMagicLinkDependencies,
): Promise<VerifyMagicLinkOutcome> {
  if (!token) {
    return { kind: "invalid_token" };
  }

  const loginToken = await loginTokens.consumeValidToken(token, now);

  if (!loginToken) {
    return { kind: "invalid_token" };
  }

  const email = normalizeEmail(loginToken.email);
  const role = roleForEmail(email);
  const expiresAt = new Date(now.getTime() + env.SESSION_TTL_DAYS * 86_400_000);
  const sessionToken = generateToken();
  const session: CurrentSession = { email, role, createdAt: now, expiresAt };

  await sessions.create({ sessionToken, email, expiresAt }, now);

  return {
    kind: "success",
    sessionToken,
    session,
    destination: destinationForRole(role),
  };
}

export async function getCurrentSessionByToken(
  sessionToken: string,
  sessions: Pick<SessionStore, "findValidByToken">,
  now = new Date(),
): Promise<CurrentSession | null> {
  const storedSession = await sessions.findValidByToken(sessionToken, now);

  if (!storedSession) {
    return null;
  }

  return {
    ...storedSession,
    email: normalizeEmail(storedSession.email),
    role: roleForEmail(storedSession.email),
  };
}

/** Vrací bezpečný cíl přesměrování chráněné stránky, nebo null pro povolený vstup. */
export function protectedPageRedirect(
  session: CurrentSession | null,
  page: "host" | "admin",
): "/" | "/host" | "/admin" | null {
  if (!session) {
    return "/";
  }

  const destination = destinationForRole(session.role);
  return destination === `/${page}` ? null : destination;
}

/** Odhlášení je bezpečné i bez cookie nebo už expirované session. */
export async function invalidateSession(
  sessionToken: string | undefined,
  sessions: Pick<SessionStore, "invalidate">,
): Promise<void> {
  if (sessionToken) {
    await sessions.invalidate(sessionToken);
  }
}
