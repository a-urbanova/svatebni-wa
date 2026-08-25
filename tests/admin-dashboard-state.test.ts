import assert from "node:assert/strict";
import test from "node:test";

import {
  createInitialAdminDashboardRequest,
  filtersFromSearchParams,
  filtersToSearchParams,
  getAdminDashboardPhase,
  hasActiveAdminFilters,
  initialAdminDashboardFilters,
} from "../components/admin-dashboard-state.ts";

test("filtry administrace se načtou z URL a bezpečně se do ní vrátí", () => {
  const filters = filtersFromSearchParams(new URLSearchParams("search=  Ada+Nováková  &personType=adult&overnightStay=true&dietaryChoice=vegetarian"));
  assert.deepEqual(filters, { search: "Ada Nováková", personType: "adult", overnightStay: "true", dietaryChoice: "vegetarian" });
  assert.equal(filtersToSearchParams(filters).toString(), "search=Ada+Nov%C3%A1kov%C3%A1&personType=adult&overnightStay=true&dietaryChoice=vegetarian");
  assert.equal(hasActiveAdminFilters(filters), true);
  assert.deepEqual(filtersFromSearchParams(new URLSearchParams("personType=owner&overnightStay=yes&dietaryChoice=unknown")), initialAdminDashboardFilters);
});

test("prázdný stav dashboardu se rozliší od načítání a chyby", () => {
  assert.equal(getAdminDashboardPhase(true, "", null), "loading");
  assert.equal(getAdminDashboardPhase(false, "Server není dostupný.", null), "error");
  assert.equal(getAdminDashboardPhase(false, "", 0), "empty");
  assert.equal(getAdminDashboardPhase(false, "", 1), "ready");
});

test("první administrativní dotaz zachová neplatné URL pro serverovou validaci", () => {
  const request = createInitialAdminDashboardRequest(
    "personType=unknown&overnightStay=yes&unexpected=value",
  );

  assert.deepEqual(request.filters, initialAdminDashboardFilters);
  assert.equal(
    request.query,
    "personType=unknown&overnightStay=yes&unexpected=value",
  );
});
