import type { DietaryChoice, PersonType, Rsvp } from "../lib/rsvp/types.ts";
import { rsvpSubmissionSchema } from "../lib/rsvp/schemas.ts";

export type PersonDraft = {
  id: string;
  firstName: string;
  lastName: string;
  type: PersonType;
  overnightStay: boolean;
  needsTransport: boolean;
  transportDestination: string;
  dietaryChoice: DietaryChoice;
  dietaryDetails: string;
  note: string;
};

export type RsvpDraft = {
  persons: PersonDraft[];
  sharedMessage: string;
};

export type FieldErrors = Record<string, string>;

export function createPersonDraft(id: string): PersonDraft {
  return {
    id,
    firstName: "",
    lastName: "",
    type: "adult",
    overnightStay: false,
    needsTransport: false,
    transportDestination: "",
    dietaryChoice: "none",
    dietaryDetails: "",
    note: "",
  };
}

export function createInitialRsvpDraft(id: string): RsvpDraft {
  return { persons: [createPersonDraft(id)], sharedMessage: "" };
}

export function createRsvpDraftFromStoredRsvp(
  rsvp: Pick<Rsvp, "persons" | "sharedMessage">,
): RsvpDraft {
  return {
    persons: rsvp.persons.map((person) => ({
      ...person,
      dietaryDetails: person.dietaryDetails ?? "",
      note: person.note ?? "",
      transportDestination: person.transportDestination ?? "",
    })),
    sharedMessage: rsvp.sharedMessage ?? "",
  };
}

export function addPerson(draft: RsvpDraft, id: string): RsvpDraft {
  return { ...draft, persons: [...draft.persons, createPersonDraft(id)] };
}

export function removePerson(draft: RsvpDraft, id: string): RsvpDraft {
  if (draft.persons.length <= 1) {
    return draft;
  }

  return { ...draft, persons: draft.persons.filter((person) => person.id !== id) };
}

export function shouldShowTransportDestination(person: PersonDraft) {
  return person.needsTransport;
}

export function shouldShowDietaryDetails(person: PersonDraft) {
  return person.dietaryChoice === "other";
}

export function validateRsvpDraft(draft: RsvpDraft): FieldErrors {
  const parsed = rsvpSubmissionSchema.safeParse(draft);

  if (parsed.success) {
    return {};
  }

  return parsed.error.issues.reduce<FieldErrors>((errors, issue) => {
    const path = issue.path.join(".");

    if (path && !errors[path]) {
      errors[path] = issue.message;
    }

    return errors;
  }, {});
}
