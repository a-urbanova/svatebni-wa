import "server-only";

import { createHash, randomBytes, timingSafeEqual } from "node:crypto";
import nodemailer from "nodemailer";

import type { ServerEnv } from "../config/env.schema.ts";
import { magicLinkRequestSchema } from "../rsvp/schemas.ts";

const SUCCESS_MESSAGE = "Pokud jsou zadané údaje v pořádku, odkaz pro přihlášení jsme připravili.";

export type MagicLinkDelivery = {
  deliver(input: { email: string; magicLink: string }): Promise<void>;
};

type SmtpTransport = {
  sendMail(input: {
    from: string;
    to: string;
    subject: string;
    text: string;
    html: string;
  }): Promise<unknown>;
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

function requiredSmtpConfig(env: ServerEnv) {
  const missing = [
    ["SMTP_HOST", env.SMTP_HOST],
    ["SMTP_USERNAME", env.SMTP_USERNAME],
    ["SMTP_PASSWORD", env.SMTP_PASSWORD],
    ["SMTP_FROM", env.SMTP_FROM],
  ].filter(([, value]) => !value).map(([name]) => name);

  if (missing.length > 0) {
    throw new Error(`Chybí SMTP konfigurace: ${missing.join(", ")}.`);
  }

  return {
    host: env.SMTP_HOST,
    port: env.SMTP_PORT,
    secure: env.SMTP_SECURE,
    auth: {
      user: env.SMTP_USERNAME,
      pass: env.SMTP_PASSWORD,
    },
  };
}

function magicLinkEmail(magicLink: string, ttlMinutes: number) {
  return {
    subject: "Přihlášení ke svatebnímu RSVP – Anna & Petr",
    text: [
      "Dobrý den,",
      "",
      "pro přihlášení ke svatebnímu RSVP otevřete tento jednorázový odkaz:",
      magicLink,
      "",
      `Odkaz platí ${ttlMinutes} minut. Pokud jste o něj nepožádali, tento e-mail ignorujte.`,
    ].join("\n"),
    html: [
      "<p>Dobrý den,</p>",
      "<p>Pro přihlášení ke svatebnímu RSVP otevřete tento jednorázový odkaz:</p>",
      `<p><a href="${magicLink}">Přihlásit se ke svatebnímu RSVP</a></p>`,
      `<p>Odkaz platí ${ttlMinutes} minut. Pokud jste o něj nepožádali, tento e-mail ignorujte.</p>`,
    ].join(""),
  };
}

/** Lokálně vypisuje odkaz jen do development logu; mimo něj jej odešle přes SMTP. */
export function createMagicLinkDelivery(
  {
    env,
    isDevelopment,
    logger = console,
    createTransport = nodemailer.createTransport,
  }: {
    env: ServerEnv;
    isDevelopment: boolean;
    logger?: Pick<Console, "info">;
    createTransport?: (options: ReturnType<typeof requiredSmtpConfig>) => SmtpTransport;
  },
): MagicLinkDelivery {
  return {
    async deliver({ email: recipient, magicLink }) {
      if (isDevelopment) {
        logger.info(`[magic-link] Vývojový odkaz: ${magicLink}`);
        return;
      }

      const transport = createTransport(requiredSmtpConfig(env));
      const email = magicLinkEmail(magicLink, env.MAGIC_LINK_TTL_MINUTES);
      await transport.sendMail({
        from: env.SMTP_FROM,
        to: recipient,
        ...email,
      });
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
  await delivery.deliver({ email: parsedPayload.data.email, magicLink });

  return {
    kind: "success",
    message: SUCCESS_MESSAGE,
    ...(isDevelopment && env.ENABLE_DEV_MAGIC_LINK ? { developmentMagicLink: magicLink } : {}),
  };
}
