import assert from "node:assert/strict";
import test from "node:test";

import {
  createMagicLinkDelivery,
  requestMagicLink,
  type MagicLinkDelivery,
} from "../lib/auth/magic-links.ts";
import type { ServerEnv } from "../lib/config/env.schema.ts";

const env: ServerEnv = {
  MONGODB_URI: "mongodb://127.0.0.1:27017",
  MONGODB_DB_NAME: "svatebni-wa",
  APP_URL: "http://localhost:3000/base-path",
  WEDDING_CODE: "spravny-kod",
  MAGIC_LINK_TTL_MINUTES: 15,
  SESSION_TTL_DAYS: 7,
  ENABLE_DEV_MAGIC_LINK: false,
  SMTP_HOST: "smtp.example.cz",
  SMTP_PORT: 587,
  SMTP_USERNAME: "smtp-user",
  SMTP_PASSWORD: "smtp-password",
  SMTP_FROM: "Anna & Petr <noreply@example.cz>",
  SMTP_SECURE: false,
};

type CreatedToken = { token: string; email: string; expiresAt: Date; now: Date };

function createTokenStore(tokens: CreatedToken[]) {
  return {
    async create(
      input: { token: string; email: string; expiresAt: Date },
      now: Date,
    ): Promise<void> {
      tokens.push({ ...input, now });
    },
  };
}

const silentDelivery: MagicLinkDelivery = { async deliver() {} };
const fixedNow = new Date("2026-08-02T10:00:00.000Z");

test("správný kód vytvoří nový token pro normalizovaný e-mail a obecnou odpověď", async () => {
  const tokens: CreatedToken[] = [];
  let tokenSequence = 0;

  const first = await requestMagicLink(
    { email: " HOST@EXAMPLE.CZ ", weddingCode: "spravny-kod" },
    {
      env,
      loginTokens: createTokenStore(tokens),
      delivery: silentDelivery,
      isDevelopment: false,
      now: fixedNow,
      generateToken: () => `token-${++tokenSequence}`,
    },
  );
  const second = await requestMagicLink(
    { email: "host@example.cz", weddingCode: "spravny-kod" },
    {
      env,
      loginTokens: createTokenStore(tokens),
      delivery: silentDelivery,
      isDevelopment: false,
      now: fixedNow,
      generateToken: () => `token-${++tokenSequence}`,
    },
  );

  assert.equal(first.kind, "success");
  assert.equal(second.kind, "success");
  assert.equal("developmentMagicLink" in first, false);
  assert.equal(tokens.length, 2);
  assert.deepEqual(tokens.map(({ token, email }) => ({ token, email })), [
    { token: "token-1", email: "host@example.cz" },
    { token: "token-2", email: "host@example.cz" },
  ]);
  assert.deepEqual(tokens[0]?.expiresAt, new Date("2026-08-02T10:15:00.000Z"));
});

test("špatný společný kód nevytvoří ani nedoručí token, ale vrátí obecnou odpověď", async () => {
  const tokens: CreatedToken[] = [];
  let deliveryCalls = 0;

  const result = await requestMagicLink(
    { email: "host@example.cz", weddingCode: "spatny-kod" },
    {
      env,
      loginTokens: createTokenStore(tokens),
      delivery: { async deliver() { deliveryCalls += 1; } },
      isDevelopment: false,
      now: fixedNow,
    },
  );

  assert.deepEqual(result, {
    kind: "success",
    message: "Pokud jsou zadané údaje v pořádku, odkaz pro přihlášení jsme připravili.",
  });
  assert.equal(tokens.length, 0);
  assert.equal(deliveryCalls, 0);
});

test("neplatný e-mail je znovu odmítnut na serveru", async () => {
  const tokens: CreatedToken[] = [];

  const result = await requestMagicLink(
    { email: "neplatny-email", weddingCode: "spravny-kod" },
    {
      env,
      loginTokens: createTokenStore(tokens),
      delivery: silentDelivery,
      isDevelopment: false,
      now: fixedNow,
    },
  );

  assert.equal(result.kind, "invalid_input");
  assert.equal(result.fieldErrors.email, "Zadejte platnou e-mailovou adresu.");
  assert.equal(tokens.length, 0);
});

test("vývojové doručení zaloguje odkaz a vrátí jej jen s explicitním přepínačem", async () => {
  const logs: string[] = [];
  const delivery = createMagicLinkDelivery({
    env,
    isDevelopment: true,
    logger: { info(message: string) { logs.push(message); } },
  });
  const tokens: CreatedToken[] = [];

  const result = await requestMagicLink(
    { email: "host@example.cz", weddingCode: "spravny-kod" },
    {
      env: { ...env, ENABLE_DEV_MAGIC_LINK: true },
      loginTokens: createTokenStore(tokens),
      delivery,
      isDevelopment: true,
      now: fixedNow,
      generateToken: () => "development-token",
    },
  );

  assert.equal(result.kind, "success");
  assert.equal(
    result.developmentMagicLink,
    "http://localhost:3000/auth/verify?token=development-token",
  );
  assert.deepEqual(logs, [
    "[magic-link] Vývojový odkaz: http://localhost:3000/auth/verify?token=development-token",
  ]);
});

test("produkční režim token klientovi ani do logu nevrátí", async () => {
  const logs: string[] = [];
  const delivery = createMagicLinkDelivery({
    env,
    isDevelopment: false,
    logger: { info(message: string) { logs.push(message); } },
    createTransport() {
      return { async sendMail() {} };
    },
  });
  const tokens: CreatedToken[] = [];

  const result = await requestMagicLink(
    { email: "host@example.cz", weddingCode: "spravny-kod" },
    {
      env: { ...env, ENABLE_DEV_MAGIC_LINK: true },
      loginTokens: createTokenStore(tokens),
      delivery,
      isDevelopment: false,
      now: fixedNow,
      generateToken: () => "production-token",
    },
  );

  assert.equal(result.kind, "success");
  assert.equal("developmentMagicLink" in result, false);
  assert.deepEqual(logs, []);
});

test("produkční doručení odešle odkaz na normalizovaný e-mail přes SMTP", async () => {
  const messages: Array<Record<string, string>> = [];
  const delivery = createMagicLinkDelivery({
    env,
    isDevelopment: false,
    createTransport(options) {
      assert.deepEqual(options, {
        host: "smtp.example.cz",
        port: 587,
        secure: false,
        auth: { user: "smtp-user", pass: "smtp-password" },
      });
      return {
        async sendMail(message) {
          messages.push(message);
        },
      };
    },
  });

  await requestMagicLink(
    { email: " HOST@EXAMPLE.CZ ", weddingCode: "spravny-kod" },
    {
      env,
      loginTokens: createTokenStore([]),
      delivery,
      isDevelopment: false,
      now: fixedNow,
      generateToken: () => "smtp-token",
    },
  );

  assert.equal(messages.length, 1);
  assert.equal(messages[0]?.to, "host@example.cz");
  assert.equal(messages[0]?.from, "Anna & Petr <noreply@example.cz>");
  assert.match(messages[0]?.text ?? "", /http:\/\/localhost:3000\/auth\/verify\?token=smtp-token/);
  assert.match(messages[0]?.html ?? "", /Přihlásit se ke svatebnímu RSVP/);
});

test("produkční SMTP bez úplné konfigurace magic link neodešle", async () => {
  const delivery = createMagicLinkDelivery({
    env: { ...env, SMTP_PASSWORD: "" },
    isDevelopment: false,
  });

  await assert.rejects(
    () => delivery.deliver({ email: "host@example.cz", magicLink: "https://example.cz/auth/verify?token=secret" }),
    /SMTP_PASSWORD/,
  );
});
