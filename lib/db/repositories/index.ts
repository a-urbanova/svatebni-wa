import "server-only";

import { getDatabase } from "../mongodb.ts";
import { createLoginTokenRepository, type LoginTokenRepository } from "./login-tokens.ts";
import { createRsvpRepository, type RsvpRepository } from "./rsvps.ts";
import { createSessionRepository, type SessionRepository } from "./sessions.ts";

export type Repositories = {
  loginTokens: LoginTokenRepository;
  sessions: SessionRepository;
  rsvps: RsvpRepository;
};

/** Vstupní bod pro serverové handlery; testy předávají vlastní izolovanou Db. */
export async function getRepositories(): Promise<Repositories> {
  const database = await getDatabase();
  return {
    loginTokens: createLoginTokenRepository(database),
    sessions: createSessionRepository(database),
    rsvps: createRsvpRepository(database),
  };
}
