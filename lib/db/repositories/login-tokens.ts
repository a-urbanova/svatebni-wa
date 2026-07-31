import type { Collection, Db } from "mongodb";

import { hashSecret } from "../../auth/secrets.ts";
import { normalizeEmail } from "../../auth/emails.ts";
import type { LoginTokenDocument } from "../documents.ts";
import { getCollections } from "../collections.ts";

export type LoginToken = Omit<LoginTokenDocument, "tokenHash">;

export type CreateLoginTokenInput = {
  token: string;
  email: string;
  expiresAt: Date;
};

function withoutHash(document: LoginTokenDocument): LoginToken {
  return {
    email: document.email,
    createdAt: document.createdAt,
    expiresAt: document.expiresAt,
    ...(document.usedAt ? { usedAt: document.usedAt } : {}),
  };
}

/** Perzistence jednorázových magic-link tokenů; čitelný token se nikdy neukládá. */
export class LoginTokenRepository {
  private readonly collection: Collection<LoginTokenDocument>;

  constructor(collection: Collection<LoginTokenDocument>) {
    this.collection = collection;
  }

  async create(input: CreateLoginTokenInput, now = new Date()): Promise<LoginToken> {
    const document: LoginTokenDocument = {
      tokenHash: hashSecret(input.token),
      email: normalizeEmail(input.email),
      createdAt: now,
      expiresAt: input.expiresAt,
    };
    await this.collection.insertOne(document);
    return withoutHash(document);
  }

  async findValidByToken(token: string, now = new Date()): Promise<LoginToken | null> {
    const document = await this.collection.findOne({
      tokenHash: hashSecret(token),
      usedAt: { $exists: false },
      expiresAt: { $gt: now },
    });
    return document ? withoutHash(document) : null;
  }

  /** Atomicky označí dosud platný token jako použitý a vrátí jeho vlastníka. */
  async consumeValidToken(token: string, now = new Date()): Promise<LoginToken | null> {
    const document = await this.collection.findOneAndUpdate(
      {
        tokenHash: hashSecret(token),
        usedAt: { $exists: false },
        expiresAt: { $gt: now },
      },
      { $set: { usedAt: now } },
      { returnDocument: "after", includeResultMetadata: false },
    );
    return document ? withoutHash(document) : null;
  }
}

export function createLoginTokenRepository(database: Db): LoginTokenRepository {
  return new LoginTokenRepository(getCollections(database).loginTokens);
}
