import { z } from "zod";

const positiveInteger = (name: string, maximum: number) =>
  z.coerce
    .number({ error: `${name} musí být celé číslo.` })
    .int(`${name} musí být celé číslo.`)
    .min(1, `${name} musí být alespoň 1.`)
    .max(maximum, `${name} je příliš vysoké.`);

const requiredText = (name: string) =>
  z
    .string({ error: `Chybí povinná proměnná ${name}.` })
    .trim()
    .min(1, `Chybí povinná proměnná ${name}.`);

/** Čistá část serverové konfigurace, oddělená kvůli jednotkovým testům. */
export const serverEnvSchema = z.object({
  MONGODB_URI: requiredText("MONGODB_URI"),
  MONGODB_DB_NAME: requiredText("MONGODB_DB_NAME"),
  APP_URL: z
    .string({ error: "Chybí povinná proměnná APP_URL." })
    .trim()
    .url("APP_URL musí být platná absolutní URL."),
  WEDDING_CODE: requiredText("WEDDING_CODE"),
  MAGIC_LINK_TTL_MINUTES: positiveInteger("MAGIC_LINK_TTL_MINUTES", 1_440),
  SESSION_TTL_DAYS: positiveInteger("SESSION_TTL_DAYS", 365),
  ENABLE_DEV_MAGIC_LINK: z
    .enum(["true", "false"], {
      error: "ENABLE_DEV_MAGIC_LINK musí být true nebo false.",
    })
    .default("false")
    .transform((value) => value === "true"),
});

export type ServerEnv = z.infer<typeof serverEnvSchema>;

/** Chyba vypisuje pouze názvy vadných proměnných, nikdy jejich hodnoty. */
export function parseServerEnv(env: Record<string, string | undefined>): ServerEnv {
  const result = serverEnvSchema.safeParse(env);

  if (result.success) {
    return result.data;
  }

  const fields = [
    ...new Set(
      result.error.issues
        .map((issue) => issue.path.join("."))
        .filter((field) => field.length > 0),
    ),
  ];

  throw new Error(
    `Neplatná serverová konfigurace. Zkontrolujte proměnné: ${fields.join(", ")}.`,
  );
}
