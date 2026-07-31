/**
 * Ve fázi 02 aplikace nepotřebuje žádnou hodnotu z prostředí v klientovi.
 * Tento modul je záměrně prázdný, aby budoucí veřejné hodnoty měly jedno
 * výslovné místo a aby se do klientského bundle nedostala serverová konfigurace.
 */
export const publicConfig = {} as const;

export type PublicConfig = typeof publicConfig;
