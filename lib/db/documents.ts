import type { Person, Rsvp } from "../rsvp/types.ts";

export type LoginTokenDocument = {
  tokenHash: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
  usedAt?: Date;
};

export type SessionDocument = {
  sessionHash: string;
  email: string;
  createdAt: Date;
  expiresAt: Date;
};

/** Databázový dokument RSVP obsahuje pouze doménová data a serverové časy. */
export type RsvpDocument = Rsvp;

export type AdminRsvpRow = Person & {
  ownerEmail: string;
  sharedMessage?: string;
  updatedAt: Date;
};
