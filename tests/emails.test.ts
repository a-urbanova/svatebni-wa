import assert from "node:assert/strict";
import test from "node:test";

import { ADMIN_EMAILS, isAdminEmail, normalizeEmail } from "../lib/auth/emails.ts";

test("normalizeEmail odstraní mezery a sjednotí velká písmena", () => {
  assert.equal(normalizeEmail("  SVATEBNIWA+ANNA@GMAIL.COM  "), "svatebniwa+anna@gmail.com");
  assert.equal(normalizeEmail("  ŽLUŤOUČKÝ@example.cz "), "žluťoučký@example.cz");
  assert.equal(normalizeEmail("   "), "");
});

test("správcovské adresy se porovnávají po normalizaci", () => {
  assert.deepEqual(ADMIN_EMAILS, ["svatebniwa+anna@gmail.com", "svatebniwa+petr@gmail.com"]);
  assert.equal(isAdminEmail(" SVATEBNIWA+PETR@GMAIL.COM "), true);
  assert.equal(isAdminEmail("host@example.cz"), false);
});
