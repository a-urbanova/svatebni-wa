/** E-mailové adresy správců určené zadáním. Nejde o tajné hodnoty. */
export const ADMIN_EMAILS = [
  "svatebniwa+anna@gmail.com",
  "svatebniwa+petr@gmail.com",
] as const;

/**
 * Normalizuje e-mail pro porovnávání a ukládání: odstraní okrajové mezery a
 * převede písmena na malá. Neprovádí žádné poskytovatelské úpravy (např. teček
 * u Gmailu), protože by měnily význam adresy.
 */
export function normalizeEmail(email: string): string {
  return email.trim().toLowerCase();
}

export function isAdminEmail(email: string): boolean {
  return ADMIN_EMAILS.includes(
    normalizeEmail(email) as (typeof ADMIN_EMAILS)[number],
  );
}
