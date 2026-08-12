import type { CurrentSession } from "../auth/session-flow.ts";
import type { RsvpRepository } from "../db/repositories/rsvps.ts";
import { adminFiltersSchema, type AdminFiltersInput } from "./schemas.ts";
import type { AdminRsvpRow } from "../db/documents.ts";

type AdminRsvpStore = Pick<RsvpRepository, "getAdminOverview">;

export type StoredAdminRsvpRow = Omit<
  AdminRsvpRow,
  "updatedAt" | "transportDestination" | "dietaryDetails" | "note" | "sharedMessage"
> & {
  transportDestination: string | null;
  dietaryDetails: string | null;
  note: string | null;
  sharedMessage: string | null;
  updatedAt: string;
};

export type AdminSummary = {
  totalPersons: number;
  adults: number;
  children: number;
  overnightStays: number;
};

export type AdminOverview = {
  rows: StoredAdminRsvpRow[];
  summary: AdminSummary;
};

export type AdminOverviewOutcome =
  | { kind: "unauthenticated" }
  | { kind: "forbidden" }
  | { kind: "success"; overview: AdminOverview };

export type AdminFiltersParseResult =
  | { success: true; filters: AdminFiltersInput }
  | { success: false };

const ADMIN_FILTER_KEYS = new Set([
  "search",
  "personType",
  "overnightStay",
  "dietaryChoice",
]);

function serializeRow(row: AdminRsvpRow): StoredAdminRsvpRow {
  return {
    ...row,
    transportDestination: row.transportDestination ?? null,
    dietaryDetails: row.dietaryDetails ?? null,
    note: row.note ?? null,
    sharedMessage: row.sharedMessage ?? null,
    updatedAt: row.updatedAt.toISOString(),
  };
}

export function summarizeAdminRows(rows: ReadonlyArray<AdminRsvpRow>): AdminSummary {
  return rows.reduce<AdminSummary>(
    (summary, row) => ({
      totalPersons: summary.totalPersons + 1,
      adults: summary.adults + (row.type === "adult" ? 1 : 0),
      children: summary.children + (row.type === "child" ? 1 : 0),
      overnightStays: summary.overnightStays + (row.overnightStay ? 1 : 0),
    }),
    { totalPersons: 0, adults: 0, children: 0, overnightStays: 0 },
  );
}

/** Přijímá pouze přesně definované, jednovýskytové query parametry. */
export function parseAdminFilters(searchParams: URLSearchParams): AdminFiltersParseResult {
  const raw: Record<string, string | boolean | undefined> = {};

  for (const key of new Set(searchParams.keys())) {
    if (!ADMIN_FILTER_KEYS.has(key) || searchParams.getAll(key).length !== 1) {
      return { success: false };
    }
  }

  for (const key of ADMIN_FILTER_KEYS) {
    const value = searchParams.get(key);
    if (value === null) continue;

    raw[key] = key === "overnightStay"
      ? value === "true"
        ? true
        : value === "false"
          ? false
          : value
      : value;
  }

  const parsed = adminFiltersSchema.safeParse(raw);
  return parsed.success ? { success: true, filters: parsed.data } : { success: false };
}

/** Načte čtecí administrativní model jen pro autoritativně rozpoznaného správce. */
export async function loadAdminOverview(
  session: CurrentSession | null,
  filters: AdminFiltersInput,
  rsvps: AdminRsvpStore,
): Promise<AdminOverviewOutcome> {
  if (!session) return { kind: "unauthenticated" };
  if (session.role !== "admin") return { kind: "forbidden" };

  const rows = await rsvps.getAdminOverview(filters);
  return {
    kind: "success",
    overview: {
      rows: rows.map(serializeRow),
      summary: summarizeAdminRows(rows),
    },
  };
}
