import { createHash } from "node:crypto";

/**
 * Vytvoří jednosměrný otisk hodnoty, která nesmí být perzistentně uložena
 * v čitelné podobě (magic-link token nebo session token).
 */
export function hashSecret(secret: string): string {
  return createHash("sha256").update(secret).digest("base64url");
}
