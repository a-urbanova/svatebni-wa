import assert from "node:assert/strict";
import test from "node:test";

import {
  getCurrentSessionByToken,
  invalidateSession,
  protectedPageRedirect,
  verifyMagicLink,
} from "../lib/auth/session-flow.ts";
import {
  expiredSessionCookieOptions,
  sessionCookieOptions,
} from "../lib/auth/session-cookie.ts";
import type { ServerEnv } from "../lib/config/env.schema.ts";

const env: ServerEnv = {
  MONGODB_URI: "mongodb://127.0.0.1:27017",
  MONGODB_DB_NAME: "svatebni-wa",
  APP_URL: "http://localhost:3000",
  WEDDING_CODE: "spravny-kod",
  MAGIC_LINK_TTL_MINUTES: 15,
  SESSION_TTL_DAYS: 7,
  ENABLE_DEV_MAGIC_LINK: false,
};
const now = new Date("2026-08-07T10:00:00.000Z");

test("ověřený magic link jednou vytvoří session a správce jde na /admin", async () => {
  let used = false;
  const createdSessions: Array<{
    sessionToken: string;
    email: string;
    expiresAt: Date;
  }> = [];
  const loginTokens = {
    async consumeValidToken(token: string) {
      if (token !== "platny-token" || used) {
        return null;
      }
      used = true;
      return {
        email: " SVATEBNIWA+ANNA@GMAIL.COM ",
        createdAt: now,
        expiresAt: new Date("2026-08-07T10:15:00.000Z"),
      };
    },
  };
  const sessions = {
    async create(input: (typeof createdSessions)[number]) {
      createdSessions.push(input);
    },
    async findValidByToken() {
      return null;
    },
    async invalidate() {
      return false;
    },
  };

  const first = await verifyMagicLink("platny-token", {
    env,
    loginTokens,
    sessions,
    now,
    generateToken: () => "nova-session",
  });
  const repeated = await verifyMagicLink("platny-token", {
    env,
    loginTokens,
    sessions,
    now,
    generateToken: () => "nesmi-vzniknout",
  });

  assert.equal(first.kind, "success");
  assert.equal(first.destination, "/admin");
  assert.equal(first.session.email, "svatebniwa+anna@gmail.com");
  assert.equal(first.session.role, "admin");
  assert.deepEqual(createdSessions, [
    {
      sessionToken: "nova-session",
      email: "svatebniwa+anna@gmail.com",
      expiresAt: new Date("2026-08-14T10:00:00.000Z"),
    },
  ]);
  assert.deepEqual(repeated, { kind: "invalid_token" });
});

test("chybějící a expirovaný token nevytvoří session", async () => {
  let createCalls = 0;
  const sessions = {
    async create() {
      createCalls += 1;
    },
    async findValidByToken() {
      return null;
    },
    async invalidate() {
      return false;
    },
  };
  const expiredAt = new Date("2026-08-07T09:59:59.000Z");
  const expiredTokens = {
    async consumeValidToken(token: string, requestedAt: Date) {
      if (token === "expirovany-token" && expiredAt <= requestedAt) {
        return null;
      }
      throw new Error("test očekává pouze expirovaný token");
    },
  };

  const missing = await verifyMagicLink(null, { env, loginTokens: expiredTokens, sessions, now });
  const expired = await verifyMagicLink("expirovany-token", {
    env,
    loginTokens: expiredTokens,
    sessions,
    now,
  });

  assert.deepEqual(missing, { kind: "invalid_token" });
  assert.deepEqual(expired, { kind: "invalid_token" });
  assert.equal(createCalls, 0);
});

test("ochrana stránek přesměruje nepřihlášené i uživatele s opačnou rolí", () => {
  const guest = {
    email: "host@example.cz",
    role: "guest" as const,
    createdAt: now,
    expiresAt: new Date("2026-08-14T10:00:00.000Z"),
  };
  const admin = { ...guest, email: "svatebniwa+petr@gmail.com", role: "admin" as const };

  assert.equal(protectedPageRedirect(null, "host"), "/");
  assert.equal(protectedPageRedirect(guest, "admin"), "/host");
  assert.equal(protectedPageRedirect(admin, "host"), "/admin");
  assert.equal(protectedPageRedirect(guest, "host"), null);
  assert.equal(protectedPageRedirect(admin, "admin"), null);
});

test("načtení session přepočítá roli podle uloženého e-mailu", async () => {
  const current = await getCurrentSessionByToken("session-token", {
    async findValidByToken() {
      return {
        email: "SVATEBNIWA+PETR@GMAIL.COM",
        createdAt: now,
        expiresAt: new Date("2026-08-14T10:00:00.000Z"),
      };
    },
  }, now);

  assert.equal(current?.email, "svatebniwa+petr@gmail.com");
  assert.equal(current?.role, "admin");
});

test("odhlášení zneplatní session a cookie má bezpečné atributy", async () => {
  const invalidated: string[] = [];
  await invalidateSession("session-token", {
    async invalidate(token) {
      invalidated.push(token);
      return true;
    },
  });
  await invalidateSession(undefined, {
    async invalidate() {
      throw new Error("bez cookie se repozitář nesmí volat");
    },
  });

  assert.deepEqual(invalidated, ["session-token"]);
  assert.deepEqual(sessionCookieOptions(now, false), {
    httpOnly: true,
    sameSite: "lax",
    secure: false,
    path: "/",
    expires: now,
  });
  assert.equal(sessionCookieOptions(now, true).secure, true);
  assert.equal(expiredSessionCookieOptions(false).maxAge, 0);
  assert.equal(expiredSessionCookieOptions(false).secure, false);
});
