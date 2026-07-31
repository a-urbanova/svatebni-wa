import "server-only";

import { MongoClient, type Db } from "mongodb";

import { getServerEnv } from "../config/env.server.ts";

declare global {
  // Promise se sdílí i mezi hot-reload cykly Next.js v režimu vývoje.
  var mongoClientPromise: Promise<MongoClient> | undefined;
}

function createMongoClient(): Promise<MongoClient> {
  const { MONGODB_URI } = getServerEnv();
  const client = new MongoClient(MONGODB_URI);
  return client.connect();
}

/** Vrátí jeden znovupoužitelný MongoDB klient pro běh procesu Next.js. */
export function getMongoClient(): Promise<MongoClient> {
  globalThis.mongoClientPromise ??= createMongoClient();
  return globalThis.mongoClientPromise;
}

/** Vrátí aplikační databázi z validované serverové konfigurace. */
export async function getDatabase(): Promise<Db> {
  const [client, { MONGODB_DB_NAME }] = await Promise.all([
    getMongoClient(),
    Promise.resolve(getServerEnv()),
  ]);

  return client.db(MONGODB_DB_NAME);
}
