import assert from "node:assert/strict";
import test from "node:test";

import { MongoClient } from "mongodb";

import { ensureDatabaseIndexes } from "../lib/db/indexes.ts";
import { getCollections } from "../lib/db/collections.ts";
import { createLoginTokenRepository } from "../lib/db/repositories/login-tokens.ts";
import { createRsvpRepository } from "../lib/db/repositories/rsvps.ts";
import { createSessionRepository } from "../lib/db/repositories/sessions.ts";
import { rsvpSubmissionSchema } from "../lib/rsvp/schemas.ts";

const integrationEnabled = process.env.RUN_MONGODB_INTEGRATION_TESTS === "true";
const testUri = process.env.MONGODB_TEST_URI;
const testDatabaseName = process.env.MONGODB_TEST_DB_NAME;

if (integrationEnabled) {
  if (!testUri || !testDatabaseName) {
    throw new Error(
      "Pro databázové testy nastavte MONGODB_TEST_URI a MONGODB_TEST_DB_NAME v .env.test.",
    );
  }
  if (!testDatabaseName.endsWith("_test")) {
    throw new Error("MONGODB_TEST_DB_NAME musí kvůli bezpečnosti končit _test.");
  }
  if (process.env.MONGODB_URI && testUri === process.env.MONGODB_URI) {
    throw new Error("MONGODB_TEST_URI nesmí být shodná s MONGODB_URI.");
  }
}

const skip = integrationEnabled
  ? false
  : "Databázové testy spouští výhradně příkaz pnpm test:db s izolovaným .env.test.";

test("repozitáře pracují s izolovanou testovací databází", { skip }, async (context) => {
  const client = new MongoClient(testUri!);
  await client.connect();
  const database = client.db(testDatabaseName!);

  context.after(async () => {
    await database.dropDatabase();
    await client.close();
  });

  await database.dropDatabase();
  await ensureDatabaseIndexes(database);

  const indexes = await Promise.all(
    Object.values(getCollections(database)).map(async (collection) =>
      (await collection.listIndexes().toArray()).map((index) => index.name),
    ),
  );
  assert.deepEqual(indexes[0]?.sort(), ["_id_", "login_tokens_expires_at_ttl", "login_tokens_token_hash_unique"]);
  assert.deepEqual(indexes[1]?.sort(), ["_id_", "sessions_expires_at_ttl", "sessions_session_hash_unique"]);
  assert.deepEqual(indexes[2]?.sort(), ["_id_", "rsvps_owner_email_unique"]);

  const now = new Date("2026-07-31T10:00:00.000Z");
  const tokens = createLoginTokenRepository(database);
  const readableMagicLinkToken = "magic-link-token-that-must-not-be-stored";
  const createdToken = await tokens.create({
    token: readableMagicLinkToken,
    email: " HOST@EXAMPLE.CZ ",
    expiresAt: new Date("2026-07-31T10:15:00.000Z"),
  }, now);
  assert.equal(createdToken.email, "host@example.cz");
  const rawToken = await getCollections(database).loginTokens.findOne({ email: "host@example.cz" });
  assert.ok(rawToken);
  assert.equal("token" in rawToken, false);
  assert.notEqual(rawToken.tokenHash, readableMagicLinkToken);
  assert.ok(await tokens.findValidByToken(readableMagicLinkToken, now));
  assert.ok(await tokens.consumeValidToken(readableMagicLinkToken, now));
  assert.equal(await tokens.consumeValidToken(readableMagicLinkToken, now), null);
  await tokens.create({
    token: "expired-magic-link",
    email: "host@example.cz",
    expiresAt: new Date("2026-07-31T09:59:59.000Z"),
  }, now);
  assert.equal(await tokens.findValidByToken("expired-magic-link", now), null);

  const sessions = createSessionRepository(database);
  const readableSessionToken = "session-token-that-must-not-be-stored";
  await sessions.create({
    sessionToken: readableSessionToken,
    email: "HOST@EXAMPLE.CZ",
    expiresAt: new Date("2026-08-07T10:00:00.000Z"),
  }, now);
  const rawSession = await getCollections(database).sessions.findOne({ email: "host@example.cz" });
  assert.ok(rawSession);
  assert.equal("sessionToken" in rawSession, false);
  assert.notEqual(rawSession.sessionHash, readableSessionToken);
  assert.equal((await sessions.findValidByToken(readableSessionToken, now))?.email, "host@example.cz");
  assert.equal(await sessions.invalidate(readableSessionToken), true);
  assert.equal(await sessions.findValidByToken(readableSessionToken, now), null);

  const rsvps = createRsvpRepository(database);
  const submission = rsvpSubmissionSchema.parse({
    persons: [
      {
        id: "person-1",
        firstName: "Anna",
        lastName: "Nováková",
        type: "adult",
        overnightStay: true,
        needsTransport: false,
        dietaryChoice: "vegetarian",
      },
      {
        id: "person-2",
        firstName: "Filip",
        lastName: "Vzor",
        type: "child",
        overnightStay: false,
        needsTransport: true,
        transportDestination: "Testovací adresa",
        dietaryChoice: "other",
        dietaryDetails: "Testovací dieta",
      },
    ],
    sharedMessage: "Těšíme se.",
  });
  const saved = await rsvps.upsertByOwnerEmail(" HOST@EXAMPLE.CZ ", submission, now);
  assert.equal(saved.ownerEmail, "host@example.cz");
  assert.deepEqual(saved.createdAt, now);
  assert.deepEqual(saved.updatedAt, now);
  const updatedAt = new Date("2026-07-31T10:01:00.000Z");
  const updated = await rsvps.upsertByOwnerEmail(
    "host@example.cz",
    rsvpSubmissionSchema.parse({ persons: submission.persons }),
    updatedAt,
  );
  assert.deepEqual(updated.createdAt, now);
  assert.deepEqual(updated.updatedAt, updatedAt);
  assert.equal(updated.sharedMessage, undefined);
  assert.deepEqual(await rsvps.getByOwnerEmail(" HOST@EXAMPLE.CZ "), updated);
  await assert.rejects(
    getCollections(database).rsvps.insertOne({ ...updated, ownerEmail: "host@example.cz" }),
    { code: 11_000 },
  );

  await rsvps.upsertByOwnerEmail(
    "second@example.test",
    rsvpSubmissionSchema.parse({
      persons: [
        {
          id: "person-3",
          firstName: "Berta",
          lastName: "Druhá",
          type: "adult",
          overnightStay: true,
          needsTransport: false,
          dietaryChoice: "vegan",
        },
      ],
      sharedMessage: "Bezpečná ukázková data.",
    }),
    new Date("2026-07-31T10:02:00.000Z"),
  );

  const overview = await rsvps.getAdminOverview({});
  assert.deepEqual(overview.map((row) => row.id), ["person-3", "person-1", "person-2"]);
  assert.equal(overview[1]?.sharedMessage, undefined);
  assert.equal(Object.isFrozen(overview[0]), true);

  assert.deepEqual(
    (await rsvps.getAdminOverview({ search: "host@example.cz" })).map((row) => row.id),
    ["person-1", "person-2"],
  );
  assert.deepEqual(
    (await rsvps.getAdminOverview({ search: "vzor" })).map((row) => row.id),
    ["person-2"],
  );
  assert.deepEqual(
    (await rsvps.getAdminOverview({ personType: "adult" })).map((row) => row.id),
    ["person-3", "person-1"],
  );
  assert.deepEqual(
    (await rsvps.getAdminOverview({ overnightStay: false })).map((row) => row.id),
    ["person-2"],
  );
  assert.deepEqual(
    (await rsvps.getAdminOverview({ dietaryChoice: "vegan" })).map((row) => row.id),
    ["person-3"],
  );
  assert.deepEqual(
    (await rsvps.getAdminOverview({ personType: "adult", overnightStay: true })).map((row) => row.id),
    ["person-3", "person-1"],
  );
});
