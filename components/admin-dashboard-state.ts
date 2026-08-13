import type { DietaryChoice, PersonType } from "../lib/rsvp/types.ts";

export type AdminDashboardFilters = {
  search: string;
  personType: "" | PersonType;
  overnightStay: "" | "true" | "false";
  dietaryChoice: "" | DietaryChoice;
};

export type AdminDashboardPhase = "loading" | "error" | "empty" | "ready";

export const initialAdminDashboardFilters: AdminDashboardFilters = {
  search: "",
  personType: "",
  overnightStay: "",
  dietaryChoice: "",
};

const personTypes = new Set<PersonType>(["adult", "child"]);
const dietaryChoices = new Set<DietaryChoice>([
  "none",
  "vegetarian",
  "vegan",
  "gluten-free",
  "lactose-free",
  "other",
]);

/** Převádí URL na bezpečný stav ovládacích prvků; API data vždy ověřuje server. */
export function filtersFromSearchParams(searchParams: URLSearchParams): AdminDashboardFilters {
  const search = searchParams.get("search")?.trim() ?? "";
  const personType = searchParams.get("personType");
  const overnightStay = searchParams.get("overnightStay");
  const dietaryChoice = searchParams.get("dietaryChoice");

  return {
    search: search.slice(0, 120),
    personType: personType && personTypes.has(personType as PersonType)
      ? (personType as PersonType)
      : "",
    overnightStay: overnightStay === "true" || overnightStay === "false" ? overnightStay : "",
    dietaryChoice: dietaryChoice && dietaryChoices.has(dietaryChoice as DietaryChoice)
      ? (dietaryChoice as DietaryChoice)
      : "",
  };
}

export function filtersToSearchParams(filters: AdminDashboardFilters): URLSearchParams {
  const searchParams = new URLSearchParams();
  const search = filters.search.trim();

  if (search) searchParams.set("search", search);
  if (filters.personType) searchParams.set("personType", filters.personType);
  if (filters.overnightStay) searchParams.set("overnightStay", filters.overnightStay);
  if (filters.dietaryChoice) searchParams.set("dietaryChoice", filters.dietaryChoice);

  return searchParams;
}

export function hasActiveAdminFilters(filters: AdminDashboardFilters): boolean {
  return filtersToSearchParams(filters).size > 0;
}

export function getAdminDashboardPhase(
  isLoading: boolean,
  error: string,
  rowCount: number | null,
): AdminDashboardPhase {
  if (isLoading) return "loading";
  if (error) return "error";
  return rowCount === 0 ? "empty" : "ready";
}
