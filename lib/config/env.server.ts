import "server-only";

/**
 * Schéma hodnot, které smějí existovat pouze na serveru. Do klienta se nikdy
 * neexportuje ani neimportuje; žádná z nich nemá předponu NEXT_PUBLIC_.
 */
export { parseServerEnv, serverEnvSchema } from "./env.schema.ts";
export type { ServerEnv } from "./env.schema.ts";

import { parseServerEnv } from "./env.schema.ts";
import type { ServerEnv } from "./env.schema.ts";

export function getServerEnv(): ServerEnv {
  return parseServerEnv(process.env);
}
