import { ensureDatabaseIndexes } from "../lib/db/indexes.ts";
import { getDatabase, getMongoClient } from "../lib/db/mongodb.ts";
import { createRsvpRepository } from "../lib/db/repositories/rsvps.ts";
import { rsvpSubmissionSchema } from "../lib/rsvp/schemas.ts";

try {
  const database = await getDatabase();
  const name = database.databaseName;

  if (!name.endsWith("_demo")) {
    throw new Error("Ukázková data lze zapsat jen do databáze s názvem končícím _demo.");
  }

  await ensureDatabaseIndexes(database);
  const rsvps = createRsvpRepository(database);
  const now = new Date();

  await rsvps.upsertByOwnerEmail(
    "host-ukazka-1@example.test",
    rsvpSubmissionSchema.parse({
      persons: [
        {
          id: "demo-ada",
          firstName: "Ada",
          lastName: "Ukázková",
          type: "adult",
          overnightStay: true,
          needsTransport: false,
          dietaryChoice: "vegetarian",
        },
        {
          id: "demo-filip",
          firstName: "Filip",
          lastName: "Ukázkový",
          type: "child",
          overnightStay: false,
          needsTransport: false,
          dietaryChoice: "none",
        },
      ],
      sharedMessage: "Bezpečná ukázková zpráva.",
    }),
    now,
  );
  await rsvps.upsertByOwnerEmail(
    "host-ukazka-2@example.test",
    rsvpSubmissionSchema.parse({
      persons: [
        {
          id: "demo-berta",
          firstName: "Berta",
          lastName: "Ukázková",
          type: "adult",
          overnightStay: false,
          needsTransport: true,
          transportDestination: "Ukázkové nádraží",
          dietaryChoice: "other",
          dietaryDetails: "Ukázkové upřesnění",
          note: "Ukázková poznámka.",
        },
      ],
    }),
    now,
  );
  console.info(`Ukázková data byla zapsána do databáze ${name}.`);
} catch (error) {
  console.error("Vytvoření ukázkových dat selhalo.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  const client = await getMongoClient().catch(() => null);
  await client?.close();
}
