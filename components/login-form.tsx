"use client";

import { useState, type ChangeEvent, type FormEvent } from "react";

import { magicLinkRequestSchema } from "@/lib/rsvp/schemas";
import { PrimaryButton, StatusMessage } from "./ui";

type FieldName = "email" | "weddingCode";
type FieldErrors = Partial<Record<FieldName, string>>;

const initialValues = {
  email: "",
  weddingCode: "",
};

/**
 * Jasně dočasný handler pro fázi 05. Neodesílá hodnoty mimo prohlížeč a
 * neprovádí autentifikaci; skutečný tok bude přidán až ve fázi 06.
 */
async function handleTemporaryLoginRequest(): Promise<void> {
  await new Promise<void>((resolve) => window.setTimeout(resolve, 350));

  if (process.env.NODE_ENV !== "development") {
    throw new Error("Magic link zatím není k dispozici.");
  }
}

export function LoginForm() {
  const [values, setValues] = useState(initialValues);
  const [fieldErrors, setFieldErrors] = useState<FieldErrors>({});
  const [formError, setFormError] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);

  function updateValue(event: ChangeEvent<HTMLInputElement>) {
    const fieldName = event.target.name as FieldName;

    setValues((currentValues) => ({
      ...currentValues,
      [fieldName]: event.target.value,
    }));
    setFieldErrors((currentErrors) => ({ ...currentErrors, [fieldName]: undefined }));
    setFormError("");
    setSuccessMessage("");
  }

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setFieldErrors({});
    setFormError("");
    setSuccessMessage("");

    const parsedValues = magicLinkRequestSchema.safeParse(values);

    if (!parsedValues.success) {
      const nextFieldErrors: FieldErrors = {};

      for (const issue of parsedValues.error.issues) {
        const fieldName = issue.path[0];

        if (
          (fieldName === "email" || fieldName === "weddingCode") &&
          !nextFieldErrors[fieldName]
        ) {
          nextFieldErrors[fieldName] = issue.message;
        }
      }

      setFieldErrors(nextFieldErrors);
      setFormError("Zkontrolujte prosím označená pole.");
      return;
    }

    setIsSubmitting(true);

    try {
      await handleTemporaryLoginRequest();
      setSuccessMessage("Funkce bude aktivována v další fázi. Magic link zatím nebyl vytvořen ani odeslán.");
    } catch {
      setFormError("Přihlášení se zatím nepodařilo připravit. Zkuste to prosím později.");
    } finally {
      setIsSubmitting(false);
    }
  }

  return (
    <form className="login-form" noValidate onSubmit={handleSubmit}>
      <div className="form-field">
        <label className="field-label" htmlFor="login-email">
          E-mail
        </label>
        <input
          aria-describedby={fieldErrors.email ? "login-email-error" : undefined}
          aria-invalid={Boolean(fieldErrors.email)}
          autoCapitalize="none"
          autoComplete="email"
          id="login-email"
          inputMode="email"
          name="email"
          onChange={updateValue}
          placeholder="vas@email.cz"
          spellCheck={false}
          type="email"
          value={values.email}
        />
        {fieldErrors.email ? (
          <p className="field-error" id="login-email-error">
            {fieldErrors.email}
          </p>
        ) : null}
      </div>

      <div className="form-field">
        <label className="field-label" htmlFor="wedding-code">
          Svatební kód
        </label>
        <input
          aria-describedby={fieldErrors.weddingCode ? "wedding-code-error" : undefined}
          aria-invalid={Boolean(fieldErrors.weddingCode)}
          autoComplete="off"
          id="wedding-code"
          maxLength={128}
          name="weddingCode"
          onChange={updateValue}
          spellCheck={false}
          type="password"
          value={values.weddingCode}
        />
        {fieldErrors.weddingCode ? (
          <p className="field-error" id="wedding-code-error">
            {fieldErrors.weddingCode}
          </p>
        ) : null}
      </div>

      {formError ? <StatusMessage tone="error">{formError}</StatusMessage> : null}
      {successMessage ? <StatusMessage tone="success">{successMessage}</StatusMessage> : null}

      <PrimaryButton className="login-submit" disabled={isSubmitting} type="submit">
        {isSubmitting ? "Ověřujeme údaje…" : "Přihlásit se"}
      </PrimaryButton>
    </form>
  );
}
