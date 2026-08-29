import { ensureDatabaseIndexes } from "../lib/db/indexes.ts";
import { getDatabase, getMongoClient } from "../lib/db/mongodb.ts";

try {
  const database = await getDatabase();
  const name = database.databaseName;

  if (!name.endsWith("_local") && !name.endsWith("_demo")) {
    throw new Error("Z bezpečnostních důvodů lze resetovat jen databázi s názvem končícím _local nebo _demo.");
  }

  await database.dropDatabase();
  await ensureDatabaseIndexes(database);
  console.info(`Databáze ${name} byla vymazána a indexy byly znovu vytvořeny.`);
} catch (error) {
  console.error("Bezpečný reset databáze selhal.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  const client = await getMongoClient().catch(() => null);
  await client?.close();
}
