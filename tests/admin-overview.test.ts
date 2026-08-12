import assert from "node:assert/strict";
import test from "node:test";

import {
  loadAdminOverview,
  parseAdminFilters,
  summarizeAdminRows,
} from "../lib/rsvp/admin-overview.ts";
import type { AdminRsvpRow } from "../lib/db/documents.ts";

const now = new Date("2026-08-13T10:00:00.000Z");
const admin = {
  email: "svatebniwa+anna@gmail.com",
  role: "admin" as const,
  createdAt: now,
  expiresAt: new Date("2026-08-20T10:00:00.000Z"),
};
const guest = { ...admin, email: "host@example.test", role: "guest" as const };

const rows: AdminRsvpRow[] = [
  {
    id: "ada",
    ownerEmail: "first@example.test",
    firstName: "Ada",
    lastName: "Ukázková",
    type: "adult",
    overnightStay: true,
    needsTransport: false,
    dietaryChoice: "vegetarian",
    note: "Testovací poznámka.",
    sharedMessage: "Testovací zpráva.",
    updatedAt: now,
  },
  {
    id: "filip",
    ownerEmail: "second@example.test",
    firstName: "Filip",
    lastName: "Vzor",
    type: "child",
    overnightStay: false,
    needsTransport: true,
    transportDestination: "Testovací adresa",
    dietaryChoice: "other",
    dietaryDetails: "Testovací dieta",
    updatedAt: new Date("2026-08-13T09:00:00.000Z"),
  },
];

test("admin přehled zploští osoby, serializuje čas a spočítá souhrny", async () => {
  const outcome = await loadAdminOverview(admin, {}, {
    async getAdminOverview() {
      return rows;
    },
  });

  assert.equal(outcome.kind, "success");
  if (outcome.kind === "success") {
    assert.equal(outcome.overview.rows.length, 2);
    assert.equal(outcome.overview.rows[0]?.ownerEmail, "first@example.test");
    assert.equal(outcome.overview.rows[0]?.updatedAt, "2026-08-13T10:00:00.000Z");
    assert.equal(outcome.overview.rows[0]?.transportDestination, null);
    assert.equal(outcome.overview.rows[1]?.sharedMessage, null);
    assert.deepEqual(outcome.overview.summary, {
      totalPersons: 2,
      adults: 1,
      children: 1,
      overnightStays: 1,
    });
  }
});

test("prázdný přehled má nulové souhrny", async () => {
  assert.deepEqual(summarizeAdminRows([]), {
    totalPersons: 0,
    adults: 0,
    children: 0,
    overnightStays: 0,
  });
  const outcome = await loadAdminOverview(admin, {}, {
    async getAdminOverview() {
      return [];
    },
  });
  assert.deepEqual(outcome, {
    kind: "success",
    overview: {
      rows: [],
      summary: { totalPersons: 0, adults: 0, children: 0, overnightStays: 0 },
    },
  });
});

test("admin filtr přijímá jen omezené a validní hodnoty", () => {
  const parsed = parseAdminFilters(new URLSearchParams({
    search: " Ada ",
    personType: "adult",
    overnightStay: "true",
    dietaryChoice: "vegetarian",
  }));
  assert.deepEqual(parsed, {
    success: true,
    filters: {
      search: "Ada",
      personType: "adult",
      overnightStay: true,
      dietaryChoice: "vegetarian",
    },
  });

  for (const query of [
    "personType=unknown",
    "overnightStay=yes",
    "search=one&search=two",
    "ownerEmail=other%40example.test",
    `search=${"x".repeat(121)}`,
  ]) {
    assert.deepEqual(parseAdminFilters(new URLSearchParams(query)), { success: false });
  }
});

test("host ani nepřihlášený uživatel nemohou načíst administrativní data", async () => {
  let calls = 0;
  const store = {
    async getAdminOverview() {
      calls += 1;
      return rows;
    },
  };

  assert.deepEqual(await loadAdminOverview(null, {}, store), { kind: "unauthenticated" });
  assert.deepEqual(await loadAdminOverview(guest, {}, store), { kind: "forbidden" });
  assert.equal(calls, 0);
});
