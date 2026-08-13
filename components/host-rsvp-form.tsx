"use client";

import { useCallback, useEffect, useRef, useState, type ChangeEvent, type FormEvent } from "react";
import Link from "next/link";

import { RSVP_LIMITS } from "@/lib/rsvp/schemas";
import type { DietaryChoice, Person } from "@/lib/rsvp/types";

import { PrimaryButton, StatusMessage } from "./ui";
import {
  addPerson,
  createInitialRsvpDraft,
  createRsvpDraftFromStoredRsvp,
  getHostRsvpPhase,
  removePerson,
  shouldShowDietaryDetails,
  shouldShowTransportDestination,
  validateRsvpDraft,
  type FieldErrors,
  type PersonDraft,
  type RsvpDraft,
} from "./host-rsvp-form-state";

type RsvpApiResponse = {
  fieldErrors?: FieldErrors;
  message?: string;
  rsvp?: { persons: Person[]; sharedMessage?: string; updatedAt: string } | null;
};

const dietaryLabels: Record<DietaryChoice, string> = {
  none: "Žádná",
  vegetarian: "Vegetariánská",
  vegan: "Veganská",
  "gluten-free": "Bezlepková",
  "lactose-free": "Bezlaktózová",
  other: "Jiná",
};

function createPersonId() {
  return crypto.randomUUID();
}

function errorId(personId: string, field: string) {
  return `person-${personId}-${field}-error`;
}

export function HostRsvpForm() {
  const [draft, setDraft] = useState<RsvpDraft>(() => createInitialRsvpDraft(createPersonId()));
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [sessionExpired, setSessionExpired] = useState(false);
  const isSubmittingRef = useRef(false);
  const personNameInputs = useRef<Record<string, HTMLInputElement | null>>({});
  const pendingFocusPersonId = useRef<string | null>(null);

  function clearMessages() {
    setFormError("");
    setSuccessMessage("");
  }

  const loadRsvp = useCallback(async () => {
    setIsLoading(true);
    setLoadError("");
    setFieldErrors({});

    try {
      const response = await fetch("/api/rsvp", { cache: "no-store" });
      const data = (await response.json().catch(() => ({}))) as RsvpApiResponse;

      if (response.status === 401) {
        setSessionExpired(true);
        setLoadError("Přihlášení vypršelo. Přihlaste se prosím znovu.");
        return;
      }
      if (!response.ok) {
        setLoadError(data.message ?? "Odpověď se teď nepodařilo načíst. Zkuste to prosím později.");
        return;
      }

      setSessionExpired(false);
      setDraft(data.rsvp ? createRsvpDraftFromStoredRsvp(data.rsvp) : createInitialRsvpDraft(createPersonId()));
    } catch {
      setLoadError("Odpověď se teď nepodařilo načíst. Zkuste to prosím později.");
    } finally {
      setIsLoading(false);
    }
  }, []);

  useEffect(() => {
    void Promise.resolve().then(loadRsvp);
  }, [loadRsvp]);

  useEffect(() => {
    const personId = pendingFocusPersonId.current;
    if (!personId) return;

    personNameInputs.current[personId]?.focus();
    pendingFocusPersonId.current = null;
  }, [draft.persons]);

  function updatePerson(personId: string, field: keyof PersonDraft, value: string | boolean) {
    setDraft((currentDraft) => ({
      ...currentDraft,
      persons: currentDraft.persons.map((person) =>
        person.id === personId ? { ...person, [field]: value } : person,
      ),
    }));
    setFieldErrors({});
    clearMessages();
  }

  function updateTextPersonField(event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) {
    const { name, value } = event.target;
    const [personId, field] = name.split(":") as [string, keyof PersonDraft];
    updatePerson(personId, field, value);
  }

  function updateCheckboxPersonField(event: ChangeEvent<HTMLInputElement>) {
    const { name, checked } = event.target;
    const [personId, field] = name.split(":") as [string, keyof PersonDraft];
    updatePerson(personId, field, checked);
  }

  function updateSelectPersonField(event: ChangeEvent<HTMLSelectElement>) {
    const [personId, field] = event.target.name.split(":") as [string, keyof PersonDraft];
    updatePerson(personId, field, event.target.value);
  }

  function fieldError(personIndex: number, field: keyof PersonDraft) {
    return fieldErrors[`persons.${personIndex}.${field}`];
  }

  function addAnotherPerson() {
    const personId = createPersonId();
    setDraft((currentDraft) => addPerson(currentDraft, personId));
    pendingFocusPersonId.current = personId;
    clearMessages();
  }

  function removeExistingPerson(personId: string) {
    const personIndex = draft.persons.findIndex((person) => person.id === personId);
    const nextPerson = draft.persons[personIndex + 1] ?? draft.persons[personIndex - 1];
    setDraft((currentDraft) => removePerson(currentDraft, personId));
    pendingFocusPersonId.current = nextPerson?.id ?? null;
    setFieldErrors({});
    clearMessages();
  }

  function updateSharedMessage(event: ChangeEvent<HTMLTextAreaElement>) {
    setDraft((currentDraft) => ({ ...currentDraft, sharedMessage: event.target.value }));
    setFieldErrors({});
    clearMessages();
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();

    if (isSubmittingRef.current) {
      return;
    }

    const errors = validateRsvpDraft(draft);
    setFieldErrors(errors);
    setSuccessMessage("");

    if (Object.keys(errors).length > 0) {
      setFormError("Zkontrolujte prosím označená pole.");
      return;
    }

    setFormError("");
    isSubmittingRef.current = true;
    setIsSubmitting(true);

    try {
      const response = await fetch("/api/rsvp", {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(draft),
      });
      const data = (await response.json().catch(() => ({}))) as RsvpApiResponse;

      if (response.status === 401) {
        setSessionExpired(true);
        setFormError("Přihlášení vypršelo. Rozpracované údaje zůstávají v tomto okně.");
        return;
      }
      if (!response.ok || !data.rsvp) {
        setFieldErrors(data.fieldErrors ?? {});
        setFormError(data.message ?? "Odpověď se teď nepodařilo uložit. Zkuste to prosím později.");
        return;
      }

      setDraft(createRsvpDraftFromStoredRsvp(data.rsvp));
      setFieldErrors({});
      setSessionExpired(false);
      setSuccessMessage(`Odpověď byla uložena. Naposledy uloženo ${formatSavedAt(data.rsvp.updatedAt)}.`);
    } catch {
      setFormError("Odpověď se teď nepodařilo uložit. Zkuste to prosím později.");
    } finally {
      setIsSubmitting(false);
      isSubmittingRef.current = false;
    }
  }

  return (
    <section className="host-form-section" id="host-rsvp" aria-labelledby="host-form-title">
      <div className="host-form-heading">
        <h2 id="host-form-title">Vaše odpověď</h2>
        <p>
          Doplňte prosím počet osob, jejich případná dietární omezení a zda budete
          chtít využít možnost přespání v blízkém hotelu. Formulář lze libovolně
          upravovat do 1. 8. 2026.
        </p>
      </div>

      {getHostRsvpPhase(isLoading, loadError) === "loading" ? (
        <div className="host-form-loading" role="status">
          Načítáme vaši uloženou odpověď…
        </div>
      ) : getHostRsvpPhase(isLoading, loadError) === "error" ? (
        <div className="host-form-loading">
          <StatusMessage tone="error">{loadError}</StatusMessage>
          {sessionExpired ? (
            <p className="session-expired-help"><Link href="/">Přejít na přihlášení</Link></p>
          ) : (
            <button className="retry-load-button" onClick={() => void loadRsvp()} type="button">
              Zkusit odpověď načíst znovu
            </button>
          )}
        </div>
      ) : (
        <form aria-busy={isSubmitting} className="host-rsvp-form" noValidate onSubmit={handleSubmit}>
        {draft.persons.map((person, personIndex) => (
          <PersonCard
            canRemove={draft.persons.length > 1}
            errors={{
              dietaryDetails: fieldError(personIndex, "dietaryDetails"),
              firstName: fieldError(personIndex, "firstName"),
              lastName: fieldError(personIndex, "lastName"),
              note: fieldError(personIndex, "note"),
              transportDestination: fieldError(personIndex, "transportDestination"),
            }}
            index={personIndex}
            key={person.id}
            onFirstNameInput={(element) => {
              personNameInputs.current[person.id] = element;
            }}
            onCheckboxChange={updateCheckboxPersonField}
            onRemove={removeExistingPerson}
            onSelectChange={updateSelectPersonField}
            onTextChange={updateTextPersonField}
            onTransportChange={(personId, needsTransport) =>
              updatePerson(personId, "needsTransport", needsTransport)
            }
            person={person}
          />
        ))}

        <button className="add-person-button" onClick={addAnotherPerson} type="button">
          <span aria-hidden="true">＋</span> Přidat další osobu
        </button>

        <div className="form-field host-shared-message-field">
          <label className="field-label" htmlFor="shared-message">
            Doplňující zpráva <span className="field-label-optional">(volitelné)</span>
          </label>
          <textarea
            aria-describedby={fieldErrors.sharedMessage ? "shared-message-error" : undefined}
            aria-invalid={Boolean(fieldErrors.sharedMessage)}
            id="shared-message"
            maxLength={RSVP_LIMITS.sharedMessage}
            name="sharedMessage"
            onChange={updateSharedMessage}
            placeholder="Máte pro nás vzkaz, dotaz nebo přání?"
            rows={5}
            value={draft.sharedMessage}
          />
          {fieldErrors.sharedMessage ? (
            <p className="field-error" id="shared-message-error">
              {fieldErrors.sharedMessage}
            </p>
          ) : null}
        </div>

        {formError ? <StatusMessage tone="error">{formError}</StatusMessage> : null}
        {successMessage ? <StatusMessage tone="success">{successMessage}</StatusMessage> : null}
        {sessionExpired ? <p className="session-expired-help"><Link href="/">Přejít na přihlášení</Link></p> : null}

        <PrimaryButton className="host-form-submit" disabled={isSubmitting} type="submit">
          {isSubmitting ? "Ukládáme formulář…" : "Uložit formulář"}
        </PrimaryButton>
        </form>
      )}
    </section>
  );
}

function formatSavedAt(value: string) {
  return new Intl.DateTimeFormat("cs-CZ", {
    dateStyle: "long",
    timeStyle: "short",
    timeZone: "Europe/Prague",
  }).format(new Date(value));
}

type PersonCardProps = {
  canRemove: boolean;
  errors: Partial<Record<"firstName" | "lastName" | "transportDestination" | "dietaryDetails" | "note", string>>;
  index: number;
  onCheckboxChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onFirstNameInput: (element: HTMLInputElement | null) => void;
  onRemove: (personId: string) => void;
  onSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void;
  onTextChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  onTransportChange: (personId: string, needsTransport: boolean) => void;
  person: PersonDraft;
};

function PersonCard({
  canRemove,
  errors,
  index,
  onCheckboxChange,
  onFirstNameInput,
  onRemove,
  onSelectChange,
  onTextChange,
  onTransportChange,
  person,
}: PersonCardProps) {
  const nameError = errors.firstName || errors.lastName;
  const transportVisible = shouldShowTransportDestination(person);
  const dietaryDetailsVisible = shouldShowDietaryDetails(person);

  return (
    <fieldset className="person-card">
      <legend>Osoba {index + 1}</legend>
      {canRemove ? (
        <button
          aria-label={`Odebrat osobu ${index + 1}`}
          className="remove-person-button"
          onClick={() => onRemove(person.id)}
          type="button"
        >
          Odebrat
        </button>
      ) : null}

      <div className="form-field person-name-field">
        <span className="field-label">Jméno</span>
        <div className="person-name-inputs">
          <input
            aria-describedby={nameError ? errorId(person.id, "name") : undefined}
            aria-invalid={Boolean(nameError)}
            autoComplete="given-name"
            id={`person-${person.id}-first-name`}
            maxLength={RSVP_LIMITS.name}
            name={`${person.id}:firstName`}
            onChange={onTextChange}
            ref={onFirstNameInput}
            placeholder="Jméno"
            type="text"
            value={person.firstName}
          />
          <input
            aria-describedby={nameError ? errorId(person.id, "name") : undefined}
            aria-invalid={Boolean(nameError)}
            autoComplete="family-name"
            id={`person-${person.id}-last-name`}
            maxLength={RSVP_LIMITS.name}
            name={`${person.id}:lastName`}
            onChange={onTextChange}
            placeholder="Příjmení"
            type="text"
            value={person.lastName}
          />
        </div>
        {nameError ? (
          <p className="field-error" id={errorId(person.id, "name")}>
            {nameError}
          </p>
        ) : null}
      </div>

      <div className="person-options-row">
        <div className="form-field">
          <span className="field-label">Typ osoby</span>
          <div className="choice-group" role="radiogroup" aria-label={`Typ osoby ${index + 1}`}>
            <label className="choice-control" htmlFor={`person-${person.id}-adult`}>
              <input
                checked={person.type === "adult"}
                id={`person-${person.id}-adult`}
                name={`${person.id}:type`}
                onChange={(event) => updatePersonFromRadio(event, onSelectChange)}
                type="radio"
                value="adult"
              />
              Dospělý
            </label>
            <label className="choice-control" htmlFor={`person-${person.id}-child`}>
              <input
                checked={person.type === "child"}
                id={`person-${person.id}-child`}
                name={`${person.id}:type`}
                onChange={(event) => updatePersonFromRadio(event, onSelectChange)}
                type="radio"
                value="child"
              />
              Dítě
            </label>
          </div>
        </div>

        <div className="form-field">
          <span className="field-label">Přespání</span>
          <label className="choice-control" htmlFor={`person-${person.id}-overnight`}>
            <input
              checked={person.overnightStay}
              id={`person-${person.id}-overnight`}
              name={`${person.id}:overnightStay`}
              onChange={onCheckboxChange}
              type="checkbox"
            />
            Využiji ubytování v blízkém hotelu
          </label>
        </div>
      </div>

      <div className="form-field">
        <span className="field-label">Odvoz</span>
        <div className="choice-group" role="radiogroup" aria-label={`Odvoz osoby ${index + 1}`}>
          <label className="choice-control" htmlFor={`person-${person.id}-transport-no`}>
            <input
              checked={!person.needsTransport}
              id={`person-${person.id}-transport-no`}
              name={`${person.id}:needsTransport`}
              onChange={() => onTransportChange(person.id, false)}
              type="radio"
            />
            Ne, odvoz nepotřebuji
          </label>
          <label className="choice-control" htmlFor={`person-${person.id}-transport-yes`}>
            <input
              checked={person.needsTransport}
              id={`person-${person.id}-transport-yes`}
              name={`${person.id}:needsTransport`}
              onChange={() => onTransportChange(person.id, true)}
              type="radio"
            />
            Ano, potřebuji odvoz
          </label>
        </div>
      </div>

      {transportVisible ? (
        <TextField
          error={errors.transportDestination}
          errorId={errorId(person.id, "transport-destination")}
          id={`person-${person.id}-transport-destination`}
          label="Cíl odvozu"
          maxLength={RSVP_LIMITS.transportDestination}
          name={`${person.id}:transportDestination`}
          onChange={onTextChange}
          placeholder="Kam vás máme odvézt?"
          value={person.transportDestination}
        />
      ) : null}

      <div className="form-field">
        <label className="field-label" htmlFor={`person-${person.id}-dietary-choice`}>
          Dietární omezení
        </label>
        <select
          id={`person-${person.id}-dietary-choice`}
          name={`${person.id}:dietaryChoice`}
          onChange={onSelectChange}
          value={person.dietaryChoice}
        >
          {Object.entries(dietaryLabels).map(([value, label]) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {dietaryDetailsVisible ? (
        <TextField
          error={errors.dietaryDetails}
          errorId={errorId(person.id, "dietary-details")}
          id={`person-${person.id}-dietary-details`}
          label="Upřesnění jiné diety"
          maxLength={RSVP_LIMITS.dietaryDetails}
          name={`${person.id}:dietaryDetails`}
          onChange={onTextChange}
          placeholder="Například alergie nebo konkrétní omezení"
          value={person.dietaryDetails}
        />
      ) : null}

      <div className="form-field">
        <label className="field-label" htmlFor={`person-${person.id}-note`}>
          Poznámka osoby <span className="field-label-optional">(volitelné)</span>
        </label>
        <textarea
          aria-describedby={errors.note ? errorId(person.id, "note") : undefined}
          aria-invalid={Boolean(errors.note)}
          id={`person-${person.id}-note`}
          maxLength={RSVP_LIMITS.personNote}
          name={`${person.id}:note`}
          onChange={onTextChange}
          placeholder="Ještě něco, co bychom měli vědět?"
          rows={3}
          value={person.note}
        />
        {errors.note ? <p className="field-error" id={errorId(person.id, "note")}>{errors.note}</p> : null}
      </div>
    </fieldset>
  );
}

type TextFieldProps = {
  error?: string;
  errorId: string;
  id: string;
  label: string;
  maxLength: number;
  name: string;
  onChange: (event: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => void;
  placeholder: string;
  value: string;
};

function TextField({ error, errorId, id, label, maxLength, name, onChange, placeholder, value }: TextFieldProps) {
  return (
    <div className="form-field">
      <label className="field-label" htmlFor={id}>{label}</label>
      <input
        aria-describedby={error ? errorId : undefined}
        aria-invalid={Boolean(error)}
        id={id}
        maxLength={maxLength}
        name={name}
        onChange={onChange}
        placeholder={placeholder}
        type="text"
        value={value}
      />
      {error ? <p className="field-error" id={errorId}>{error}</p> : null}
    </div>
  );
}

function updatePersonFromRadio(
  event: ChangeEvent<HTMLInputElement>,
  onSelectChange: (event: ChangeEvent<HTMLSelectElement>) => void,
) {
  const syntheticEvent = {
    target: { name: event.target.name, value: event.target.value },
  } as ChangeEvent<HTMLSelectElement>;
  onSelectChange(syntheticEvent);
}
