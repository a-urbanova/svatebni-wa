import assert from "node:assert/strict";
import test from "node:test";

import {
  adminFiltersSchema,
  emailSchema,
  magicLinkRequestSchema,
  personSchema,
  rsvpSubmissionSchema,
} from "../lib/rsvp/schemas.ts";

const validPerson = {
  id: "person-1",
  firstName: "  Anna ",
  lastName: " Nováková ",
  type: "adult" as const,
  overnightStay: true,
  needsTransport: false,
  dietaryChoice: "none" as const,
};

test("schéma e-mailu normalizuje mezery a velká písmena", () => {
  assert.equal(emailSchema.parse("  HOST@EXAMPLE.CZ "), "host@example.cz");
  assert.equal(emailSchema.safeParse("   ").success, false);
});

test("žádost o magic link odmítne prázdný kód a neplatný e-mail", () => {
  assert.equal(
    magicLinkRequestSchema.safeParse({ email: "neplatny-email", weddingCode: "kód" }).success,
    false,
  );
  assert.equal(
    magicLinkRequestSchema.safeParse({ email: "host@example.cz", weddingCode: "  " }).success,
    false,
  );
});

test("osoba ořezává text a povinně vyžaduje cíl odvozu", () => {
  const parsed = personSchema.parse(validPerson);
  assert.equal(parsed.firstName, "Anna");
  assert.equal(parsed.lastName, "Nováková");
  assert.equal(parsed.transportDestination, undefined);

  const result = personSchema.safeParse({ ...validPerson, needsTransport: true });
  assert.equal(result.success, false);
  if (!result.success) {
    assert.equal(result.error.issues[0]?.path.join("."), "transportDestination");
  }
});

test("jiná dieta vyžaduje upřesnění, běžná dieta nikoliv", () => {
  assert.equal(
    personSchema.safeParse({ ...validPerson, dietaryChoice: "other" }).success,
    false,
  );
  assert.equal(
    personSchema.safeParse({ ...validPerson, dietaryChoice: "other", dietaryDetails: " Bez ořechů " })
      .success,
    true,
  );
});

test("odpověď vyžaduje osobu, omezuje jejich počet a odmítá cizí pole", () => {
  assert.equal(rsvpSubmissionSchema.safeParse({ persons: [] }).success, false);
  assert.equal(
    rsvpSubmissionSchema.safeParse({
      persons: Array.from({ length: 21 }, (_, index) => ({ ...validPerson, id: `person-${index}` })),
    }).success,
    false,
  );
  assert.equal(
    rsvpSubmissionSchema.safeParse({ persons: [validPerson], ownerEmail: "cizi@example.cz" }).success,
    false,
  );
});

test("filtry přijímají jen očekávaná pole a prázdné hledání převádějí na undefined", () => {
  assert.deepEqual(adminFiltersSchema.parse({ search: "  " }), { search: undefined });
  assert.equal(adminFiltersSchema.safeParse({ unexpected: "value" }).success, false);
});
