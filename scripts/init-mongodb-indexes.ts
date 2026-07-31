import { ensureDatabaseIndexes } from "../lib/db/indexes.ts";
import { getDatabase, getMongoClient } from "../lib/db/mongodb.ts";

try {
  await ensureDatabaseIndexes(await getDatabase());
  console.info("MongoDB indexy byly úspěšně inicializovány.");
} catch (error) {
  console.error("Inicializace MongoDB indexů selhala.");
  console.error(error instanceof Error ? error.message : error);
  process.exitCode = 1;
} finally {
  const client = await getMongoClient().catch(() => null);
  await client?.close();
}
