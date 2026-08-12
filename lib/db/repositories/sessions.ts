import type { Collection, Db } from "mongodb";

import { normalizeEmail } from "../../auth/emails.ts";
import { hashSecret } from "../../auth/secrets.ts";
import type { SessionDocument } from "../documents.ts";
import { getCollections } from "../collections.ts";

export type Session = Omit<SessionDocument, "sessionHash">;

export type CreateSessionInput = {
  sessionToken: string;
  email: string;
  expiresAt: Date;
};

function withoutHash(document: SessionDocument): Session {
  return {
    email: document.email,
    createdAt: document.createdAt,
    expiresAt: document.expiresAt,
  };
}

/** Perzistence session; cookie token je pouze hashovaný a lze jej zneplatnit. */
export class SessionRepository {
  private readonly collection: Collection<SessionDocument>;

  constructor(collection: Collection<SessionDocument>) {
    this.collection = collection;
  }

  async create(input: CreateSessionInput, now = new Date()): Promise<Session> {
    const document: SessionDocument = {
      sessionHash: hashSecret(input.sessionToken),
      email: normalizeEmail(input.email),
      createdAt: now,
      expiresAt: input.expiresAt,
    };
    await this.collection.insertOne(document);
    return withoutHash(document);
  }

  async findValidByToken(sessionToken: string, now = new Date()): Promise<Session | null> {
    const document = await this.collection.findOne({
      sessionHash: hashSecret(sessionToken),
      expiresAt: { $gt: now },
    });
    return document ? withoutHash(document) : null;
  }

  async invalidate(sessionToken: string): Promise<boolean> {
    const result = await this.collection.deleteOne({ sessionHash: hashSecret(sessionToken) });
    return result.deletedCount === 1;
  }
}

export function createSessionRepository(database: Db): SessionRepository {
  return new SessionRepository(getCollections(database).sessions);
}
