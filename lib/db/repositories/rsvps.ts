import type { Collection, Db, Filter } from "mongodb";

import { normalizeEmail } from "../../auth/emails.ts";
import type { AdminFiltersInput, RsvpSubmission } from "../../rsvp/schemas.ts";
import type { Rsvp } from "../../rsvp/types.ts";
import type { AdminRsvpRow, RsvpDocument } from "../documents.ts";
import { getCollections } from "../collections.ts";

function escapeRegex(value: string): string {
  return value.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
}

/** Úložiště odpovědí; vlastník se vždy určuje serverovým e-mailem. */
export class RsvpRepository {
  private readonly collection: Collection<RsvpDocument>;

  constructor(collection: Collection<RsvpDocument>) {
    this.collection = collection;
  }

  async getByOwnerEmail(ownerEmail: string): Promise<Rsvp | null> {
    return this.collection.findOne({ ownerEmail: normalizeEmail(ownerEmail) });
  }

  async upsertByOwnerEmail(
    ownerEmail: string,
    submission: RsvpSubmission,
    now = new Date(),
  ): Promise<Rsvp> {
    const normalizedOwnerEmail = normalizeEmail(ownerEmail);
    const document = await this.collection.findOneAndUpdate(
      { ownerEmail: normalizedOwnerEmail },
      {
        $set: {
          persons: submission.persons,
          ...(submission.sharedMessage ? { sharedMessage: submission.sharedMessage } : {}),
          updatedAt: now,
        },
        $setOnInsert: {
          ownerEmail: normalizedOwnerEmail,
          createdAt: now,
        },
        ...(submission.sharedMessage ? {} : { $unset: { sharedMessage: "" } }),
      },
      { upsert: true, returnDocument: "after", includeResultMetadata: false },
    );

    if (!document) {
      throw new Error("RSVP se po uložení nepodařilo načíst.");
    }
    return document;
  }

  /** Vrátí plochý přehled osob pro čtecí administraci, bez mutačních operací. */
  async getAdminOverview(
    filters: AdminFiltersInput = { search: undefined },
  ): Promise<ReadonlyArray<Readonly<AdminRsvpRow>>> {
    const personFilter: Filter<RsvpDocument> = {};

    if (filters.personType) personFilter["persons.type"] = filters.personType;
    if (filters.overnightStay !== undefined) {
      personFilter["persons.overnightStay"] = filters.overnightStay;
    }
    if (filters.dietaryChoice) {
      personFilter["persons.dietaryChoice"] = filters.dietaryChoice;
    }
    if (filters.search) {
      const search = new RegExp(escapeRegex(filters.search), "i");
      personFilter.$or = [
        { ownerEmail: search },
        { "persons.firstName": search },
        { "persons.lastName": search },
      ];
    }

    const rows = await this.collection
      .aggregate<AdminRsvpRow>([
        { $unwind: "$persons" },
        { $match: personFilter },
        {
          $project: {
            _id: 0,
            ownerEmail: 1,
            sharedMessage: 1,
            updatedAt: 1,
            id: "$persons.id",
            firstName: "$persons.firstName",
            lastName: "$persons.lastName",
            type: "$persons.type",
            overnightStay: "$persons.overnightStay",
            needsTransport: "$persons.needsTransport",
            transportDestination: "$persons.transportDestination",
            dietaryChoice: "$persons.dietaryChoice",
            dietaryDetails: "$persons.dietaryDetails",
            note: "$persons.note",
          },
        },
        { $sort: { updatedAt: -1, ownerEmail: 1, lastName: 1, firstName: 1 } },
      ])
      .toArray();

    return rows.map((row) => Object.freeze({ ...row }));
  }
}

export function createRsvpRepository(database: Db): RsvpRepository {
  return new RsvpRepository(getCollections(database).rsvps);
}
