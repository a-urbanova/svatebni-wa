import type { Collection, Db } from "mongodb";

import type {
  LoginTokenDocument,
  RsvpDocument,
  SessionDocument,
} from "./documents.ts";

export const COLLECTION_NAMES = {
  loginTokens: "loginTokens",
  sessions: "sessions",
  rsvps: "rsvps",
} as const;

export type AppCollections = {
  loginTokens: Collection<LoginTokenDocument>;
  sessions: Collection<SessionDocument>;
  rsvps: Collection<RsvpDocument>;
};

/** Typované vstupy k jediným kolekcím této aplikace. */
export function getCollections(database: Db): AppCollections {
  return {
    loginTokens: database.collection<LoginTokenDocument>(COLLECTION_NAMES.loginTokens),
    sessions: database.collection<SessionDocument>(COLLECTION_NAMES.sessions),
    rsvps: database.collection<RsvpDocument>(COLLECTION_NAMES.rsvps),
  };
}
