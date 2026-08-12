import assert from "node:assert/strict";
import test from "node:test";

import {
  addPerson,
  createInitialRsvpDraft,
  removePerson,
  shouldShowDietaryDetails,
  shouldShowTransportDestination,
  validateRsvpDraft,
} from "../components/host-rsvp-form-state.ts";

test("formulář přidává a odebírá osoby bez záměny hodnot podle stabilního ID", () => {
  const initial = createInitialRsvpDraft("anna");
  const withName = {
    ...initial,
    persons: [{ ...initial.persons[0]!, firstName: "Anna", lastName: "Nováková" }],
  };
  const withSecondPerson = addPerson(withName, "petr");
  const filled = {
    ...withSecondPerson,
    persons: [
      withSecondPerson.persons[0]!,
      { ...withSecondPerson.persons[1]!, firstName: "Petr", lastName: "Novák" },
    ],
  };

  const afterRemoval = removePerson(filled, "anna");

  assert.equal(afterRemoval.persons.length, 1);
  assert.deepEqual(afterRemoval.persons[0], { ...filled.persons[1], id: "petr" });
  assert.equal(removePerson(afterRemoval, "petr"), afterRemoval);
});

test("formulář zobrazuje podmíněná pole jen pro zvolený odvoz a jinou dietu", () => {
  const person = createInitialRsvpDraft("host").persons[0]!;

  assert.equal(shouldShowTransportDestination(person), false);
  assert.equal(shouldShowDietaryDetails(person), false);
  assert.equal(shouldShowTransportDestination({ ...person, needsTransport: true }), true);
  assert.equal(shouldShowDietaryDetails({ ...person, dietaryChoice: "other" }), true);
});

test("formulář převádí chyby sdíleného schématu na chyby u polí", () => {
  const draft = createInitialRsvpDraft("host");
  const errors = validateRsvpDraft({
    ...draft,
    persons: [
      {
        ...draft.persons[0]!,
        needsTransport: true,
        dietaryChoice: "other",
      },
    ],
  });

  assert.equal(errors["persons.0.firstName"], "Zadejte jméno.");
  assert.equal(errors["persons.0.lastName"], "Zadejte příjmení.");
  assert.equal(errors["persons.0.transportDestination"], "Při zvoleném odvozu vyplňte cíl odvozu.");
  assert.equal(errors["persons.0.dietaryDetails"], "Při volbě jiné diety ji upřesněte.");
});
