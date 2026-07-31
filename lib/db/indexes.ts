import type { Db } from "mongodb";

import { getCollections } from "./collections.ts";

/** Vytvoří opakovatelně všechny indexy nutné pro bezpečnost a integritu dat. */
export async function ensureDatabaseIndexes(database: Db): Promise<void> {
  const { loginTokens, sessions, rsvps } = getCollections(database);

  await Promise.all([
    loginTokens.createIndexes([
      {
        key: { tokenHash: 1 },
        name: "login_tokens_token_hash_unique",
        unique: true,
      },
      {
        key: { expiresAt: 1 },
        name: "login_tokens_expires_at_ttl",
        expireAfterSeconds: 0,
      },
    ]),
    sessions.createIndexes([
      {
        key: { sessionHash: 1 },
        name: "sessions_session_hash_unique",
        unique: true,
      },
      {
        key: { expiresAt: 1 },
        name: "sessions_expires_at_ttl",
        expireAfterSeconds: 0,
      },
    ]),
    rsvps.createIndexes([
      {
        key: { ownerEmail: 1 },
        name: "rsvps_owner_email_unique",
        unique: true,
      },
    ]),
  ]);
}
