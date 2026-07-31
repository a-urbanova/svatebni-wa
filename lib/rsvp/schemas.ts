import { z } from "zod";

import { normalizeEmail } from "../auth/emails.ts";
import { DIETARY_CHOICES, PERSON_TYPES } from "./types.ts";

export const RSVP_LIMITS = {
  maxPersons: 20,
  name: 120,
  transportDestination: 200,
  dietaryDetails: 200,
  personNote: 500,
  sharedMessage: 1_000,
  weddingCode: 128,
} as const;

const optionalText = (maximum: number, tooLongMessage: string) =>
  z
    .string()
    .trim()
    .max(maximum, tooLongMessage)
    .optional()
    .transform((value) => value || undefined);

export const emailSchema = z
  .string({ error: "Zadejte e-mailovou adresu." })
  .transform(normalizeEmail)
  .pipe(z.email("Zadejte platnou e-mailovou adresu."));

export const magicLinkRequestSchema = z
  .object({
    email: emailSchema,
    weddingCode: z
      .string({ error: "Zadejte společný svatební kód." })
      .trim()
      .min(1, "Zadejte společný svatební kód.")
      .max(RSVP_LIMITS.weddingCode, "Svatební kód je příliš dlouhý."),
  })
  .strict();

export const personSchema = z
  .object({
    id: z
      .string({ error: "Osoba musí mít interní identifikátor." })
      .trim()
      .min(1, "Osoba musí mít interní identifikátor.")
      .max(128, "Interní identifikátor osoby je příliš dlouhý."),
    firstName: z
      .string({ error: "Zadejte jméno." })
      .trim()
      .min(1, "Zadejte jméno.")
      .max(RSVP_LIMITS.name, "Jméno je příliš dlouhé."),
    lastName: z
      .string({ error: "Zadejte příjmení." })
      .trim()
      .min(1, "Zadejte příjmení.")
      .max(RSVP_LIMITS.name, "Příjmení je příliš dlouhé."),
    type: z.enum(PERSON_TYPES, { error: "Zvolte typ osoby." }),
    overnightStay: z.boolean({ error: "Zvolte, zda osoba přespí." }),
    needsTransport: z.boolean({ error: "Zvolte, zda osoba potřebuje odvoz." }),
    transportDestination: optionalText(
      RSVP_LIMITS.transportDestination,
      "Cíl odvozu je příliš dlouhý.",
    ),
    dietaryChoice: z.enum(DIETARY_CHOICES, {
      error: "Zvolte dietární omezení.",
    }),
    dietaryDetails: optionalText(
      RSVP_LIMITS.dietaryDetails,
      "Upřesnění diety je příliš dlouhé.",
    ),
    note: optionalText(RSVP_LIMITS.personNote, "Poznámka osoby je příliš dlouhá."),
  })
  .strict()
  .superRefine((person, context) => {
    if (person.needsTransport && !person.transportDestination) {
      context.addIssue({
        code: "custom",
        path: ["transportDestination"],
        message: "Při zvoleném odvozu vyplňte cíl odvozu.",
      });
    }

    if (person.dietaryChoice === "other" && !person.dietaryDetails) {
      context.addIssue({
        code: "custom",
        path: ["dietaryDetails"],
        message: "Při volbě jiné diety ji upřesněte.",
      });
    }
  });

export const rsvpSubmissionSchema = z
  .object({
    persons: z
      .array(personSchema)
      .min(1, "Přidejte alespoň jednu osobu.")
      .max(
        RSVP_LIMITS.maxPersons,
        `V jedné odpovědi může být nejvýše ${RSVP_LIMITS.maxPersons} osob.`,
      ),
    sharedMessage: optionalText(
      RSVP_LIMITS.sharedMessage,
      "Společná zpráva je příliš dlouhá.",
    ),
  })
  .strict();

export const adminFiltersSchema = z
  .object({
    search: optionalText(120, "Vyhledávací text je příliš dlouhý."),
    personType: z.enum(PERSON_TYPES, { error: "Neplatný filtr typu osoby." }).optional(),
    overnightStay: z.boolean({ error: "Neplatný filtr přespání." }).optional(),
    dietaryChoice: z
      .enum(DIETARY_CHOICES, { error: "Neplatný filtr dietního omezení." })
      .optional(),
  })
  .strict();

export type MagicLinkRequest = z.infer<typeof magicLinkRequestSchema>;
export type PersonInput = z.infer<typeof personSchema>;
export type RsvpSubmission = z.infer<typeof rsvpSubmissionSchema>;
export type AdminFiltersInput = z.infer<typeof adminFiltersSchema>;
