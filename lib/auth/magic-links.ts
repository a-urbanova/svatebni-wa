import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";

import type { ServerEnv } from "../config/env.schema.ts";
import { magicLinkRequestSchema } from "../rsvp/schemas.ts";

const SUCCESS_MESSAGE = "Pokud jsou zadané údaje v pořádku, odkaz pro přihlášení jsme připravili.";

export type MagicLinkDelivery = {
  deliver(input: { magicLink: string }): Promise<void>;
};

type MagicLinkTokenStore = {
  create(
    input: { token: string; email: string; expiresAt: Date },
    now: Date,
  ): Promise<unknown>;
};

export type MagicLinkRequestOutcome =
  | {
      kind: "success";
      message: string;
      developmentMagicLink?: string;
    }
  | {
      kind: "invalid_input";
      message: string;
      fieldErrors: Partial<Record<"email" | "weddingCode", string>>;
    };

type MagicLinkRequestDependencies = {
  env: ServerEnv;
  loginTokens: MagicLinkTokenStore;
  delivery: MagicLinkDelivery;
  isDevelopment: boolean;
  now?: Date;
  generateToken?: () => string;
};

function compareWeddingCode(providedCode: string, configuredCode: string): boolean {
  const providedHash = createHash("sha256").update(providedCode).digest();
  const configuredHash = createHash("sha256").update(configuredCode).digest();
  return timingSafeEqual(providedHash, configuredHash);
}

export function generateMagicLinkToken(): string {
  return randomBytes(32).toString("base64url");
}

export function buildMagicLink(appUrl: string, token: string): string {
  const url = new URL("/auth/verify", appUrl);
  url.searchParams.set("token", token);
  return url.toString();
}

/**
 * Vývojový doručovací adaptér. Produkční větev je záměrně prázdné místo pro
 * budoucí SMTP implementaci: nikdy nevrací ani neloguje magic link.
 */
export function createMagicLinkDelivery(
  isDevelopment: boolean,
  logger: Pick<Console, "info"> = console,
): MagicLinkDelivery {
  return {
    async deliver({ magicLink }) {
      if (isDevelopment) {
        logger.info(`[magic-link] Vývojový odkaz: ${magicLink}`);
      }
    },
  };
}

/** Vytvoří a uloží jednorázový token až po serverovém ověření vstupu a kódu. */
export async function requestMagicLink(
  payload: unknown,
  {
    env,
    loginTokens,
    delivery,
    isDevelopment,
    now = new Date(),
    generateToken = generateMagicLinkToken,
  }: MagicLinkRequestDependencies,
): Promise<MagicLinkRequestOutcome> {
  const parsedPayload = magicLinkRequestSchema.safeParse(payload);

  if (!parsedPayload.success) {
    const fieldErrors: Partial<Record<"email" | "weddingCode", string>> = {};

    for (const issue of parsedPayload.error.issues) {
      const field = issue.path[0];
      if ((field === "email" || field === "weddingCode") && !fieldErrors[field]) {
        fieldErrors[field] = issue.message;
      }
    }

    return {
      kind: "invalid_input",
      message: "Zkontrolujte prosím označená pole.",
      fieldErrors,
    };
  }

  if (!compareWeddingCode(parsedPayload.data.weddingCode, env.WEDDING_CODE)) {
    return {
      kind: "success",
      message: SUCCESS_MESSAGE,
    };
  }

  const token = generateToken();
  const expiresAt = new Date(now.getTime() + env.MAGIC_LINK_TTL_MINUTES * 60_000);
  const magicLink = buildMagicLink(env.APP_URL, token);

  await loginTokens.create({
    token,
    email: parsedPayload.data.email,
    expiresAt,
  }, now);
  await delivery.deliver({ magicLink });

  return {
    kind: "success",
    message: SUCCESS_MESSAGE,
    ...(isDevelopment && env.ENABLE_DEV_MAGIC_LINK ? { developmentMagicLink: magicLink } : {}),
  };
}
