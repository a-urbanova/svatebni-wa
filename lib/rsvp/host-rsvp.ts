import type { ZodError } from "zod";

import type { CurrentSession } from "../auth/session-flow.ts";
import type { RsvpRepository } from "../db/repositories/rsvps.ts";
import { rsvpSubmissionSchema } from "./schemas.ts";
import type { Rsvp } from "./types.ts";

type HostRsvpStore = Pick<RsvpRepository, "getByOwnerEmail" | "upsertByOwnerEmail">;

export type StoredHostRsvp = Omit<Rsvp, "ownerEmail" | "createdAt" | "updatedAt"> & {
  createdAt: string;
  updatedAt: string;
};

export type HostRsvpOutcome =
  | { kind: "unauthenticated" }
  | { kind: "forbidden" }
  | { kind: "invalid_input"; fieldErrors: Record<string, string> }
  | { kind: "success"; rsvp: StoredHostRsvp | null };

function fieldErrorsFrom(error: ZodError): Record<string, string> {
  return error.issues.reduce<Record<string, string>>((errors, issue) => {
    const path = issue.path.join(".");

    if (path && !errors[path]) {
      errors[path] = issue.message;
    }

    return errors;
  }, {});
}

function isGuestSession(session: CurrentSession | null): session is CurrentSession {
  return session?.role === "guest";
}

function accessFailure(session: CurrentSession | null): Exclude<HostRsvpOutcome, { kind: "success" }> {
  return session ? { kind: "forbidden" } : { kind: "unauthenticated" };
}

function serializeRsvp(rsvp: Rsvp): StoredHostRsvp {
  return {
    persons: rsvp.persons,
    ...(rsvp.sharedMessage ? { sharedMessage: rsvp.sharedMessage } : {}),
    createdAt: rsvp.createdAt.toISOString(),
    updatedAt: rsvp.updatedAt.toISOString(),
  };
}

/** Načte pouze RSVP odpověď vlastněnou aktuálně přihlášeným hostem. */
export async function loadHostRsvp(
  session: CurrentSession | null,
  rsvps: HostRsvpStore,
): Promise<HostRsvpOutcome> {
  if (!isGuestSession(session)) return accessFailure(session);

  const rsvp = await rsvps.getByOwnerEmail(session.email);
  return { kind: "success", rsvp: rsvp ? serializeRsvp(rsvp) : null };
}

/** Validuje payload a ukládá jej výhradně pod e-mailem aktuální session. */
export async function saveHostRsvp(
  session: CurrentSession | null,
  payload: unknown,
  rsvps: HostRsvpStore,
): Promise<HostRsvpOutcome> {
  if (!isGuestSession(session)) return accessFailure(session);

  const parsed = rsvpSubmissionSchema.safeParse(payload);
  if (!parsed.success) {
    return { kind: "invalid_input", fieldErrors: fieldErrorsFrom(parsed.error) };
  }

  const rsvp = await rsvps.upsertByOwnerEmail(session.email, parsed.data);
  return { kind: "success", rsvp: serializeRsvp(rsvp) };
}
