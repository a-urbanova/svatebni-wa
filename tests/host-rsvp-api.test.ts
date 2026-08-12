import assert from "node:assert/strict";
import test from "node:test";

import { loadHostRsvp, saveHostRsvp } from "../lib/rsvp/host-rsvp.ts";
import type { RsvpSubmission } from "../lib/rsvp/schemas.ts";
import type { Rsvp } from "../lib/rsvp/types.ts";

const now = new Date("2026-08-12T12:00:00.000Z");
const guest = (email: string) => ({ email, role: "guest" as const, createdAt: now, expiresAt: new Date("2026-08-19T12:00:00.000Z") });
const admin = { ...guest("svatebniwa+anna@gmail.com"), role: "admin" as const };
const validPayload = {
  persons: [{ id: "person-1", firstName: " Anna ", lastName: " Nováková ", type: "adult", overnightStay: true, needsTransport: false, dietaryChoice: "none" }],
  sharedMessage: " Těšíme se. ",
};

function createRsvpStore() {
  const records = new Map<string, Rsvp>();
  return {
    records,
    async getByOwnerEmail(ownerEmail: string) { return records.get(ownerEmail) ?? null; },
    async upsertByOwnerEmail(ownerEmail: string, submission: RsvpSubmission) {
      const existing = records.get(ownerEmail);
      const rsvp: Rsvp = { ownerEmail, persons: submission.persons, ...(submission.sharedMessage ? { sharedMessage: submission.sharedMessage } : {}), createdAt: existing?.createdAt ?? now, updatedAt: now };
      records.set(ownerEmail, rsvp);
      return rsvp;
    },
  };
}

test("první uložení vytvoří normalizovanou RSVP odpověď aktuálního hosta", async () => {
  const store = createRsvpStore();
  const outcome = await saveHostRsvp(guest("host@example.cz"), validPayload, store);
  assert.equal(outcome.kind, "success");
  if (outcome.kind === "success") {
    assert.equal(outcome.rsvp?.persons[0]?.firstName, "Anna");
    assert.equal(outcome.rsvp?.sharedMessage, "Těšíme se.");
  }
  assert.equal(store.records.get("host@example.cz")?.ownerEmail, "host@example.cz");
});

test("další uložení stejného hosta aktualizuje jeho existující odpověď", async () => {
  const store = createRsvpStore();
  await saveHostRsvp(guest("host@example.cz"), validPayload, store);
  await saveHostRsvp(guest("host@example.cz"), { ...validPayload, persons: [{ ...validPayload.persons[0], id: "person-2", firstName: "Petr" }] }, store);
  assert.equal(store.records.size, 1);
  assert.equal(store.records.get("host@example.cz")?.persons[0]?.firstName, "Petr");
});

test("odpovědi dvou hostů zůstávají oddělené", async () => {
  const store = createRsvpStore();
  await saveHostRsvp(guest("anna@example.cz"), validPayload, store);
  await saveHostRsvp(guest("petr@example.cz"), { ...validPayload, persons: [{ ...validPayload.persons[0], firstName: "Petr" }] }, store);
  const loaded = await loadHostRsvp(guest("anna@example.cz"), store);
  assert.equal(loaded.kind === "success" ? loaded.rsvp?.persons[0]?.firstName : undefined, "Anna");
  assert.equal(store.records.get("petr@example.cz")?.persons[0]?.firstName, "Petr");
});

test("podvržený ownerEmail se odmítne a nemůže změnit cizí data", async () => {
  const store = createRsvpStore();
  const outcome = await saveHostRsvp(guest("host@example.cz"), { ...validPayload, ownerEmail: "cizi@example.cz" }, store);
  assert.equal(outcome.kind, "invalid_input");
  assert.equal(store.records.size, 0);
});

test("neplatný payload ani nepřihlášený požadavek data neuloží", async () => {
  const store = createRsvpStore();
  assert.equal((await saveHostRsvp(guest("host@example.cz"), { persons: [] }, store)).kind, "invalid_input");
  assert.equal((await saveHostRsvp(null, validPayload, store)).kind, "unauthenticated");
  assert.equal(store.records.size, 0);
});

test("admin nemůže přes hostovskou route RSVP načíst ani změnit", async () => {
  const store = createRsvpStore();
  assert.equal((await loadHostRsvp(admin, store)).kind, "forbidden");
  assert.equal((await saveHostRsvp(admin, validPayload, store)).kind, "forbidden");
  assert.equal(store.records.size, 0);
});
