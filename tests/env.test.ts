import assert from "node:assert/strict";
import test from "node:test";

import { parseServerEnv } from "../lib/config/env.schema.ts";

const validEnv = {
  MONGODB_URI: "mongodb://127.0.0.1:27017",
  MONGODB_DB_NAME: "svatebni-wa",
  APP_URL: "http://localhost:3000",
  WEDDING_CODE: "muj-tajny-kod",
  MAGIC_LINK_TTL_MINUTES: "15",
  SESSION_TTL_DAYS: "7",
  ENABLE_DEV_MAGIC_LINK: "false",
};

test("serverová konfigurace načte a převede platné hodnoty", () => {
  const config = parseServerEnv(validEnv);
  assert.equal(config.MAGIC_LINK_TTL_MINUTES, 15);
  assert.equal(config.SESSION_TTL_DAYS, 7);
  assert.equal(config.ENABLE_DEV_MAGIC_LINK, false);
});

test("chyba konfigurace je srozumitelná a neobsahuje tajnou hodnotu", () => {
  const secret = "nesmi-se-ukazat";
  assert.throws(
    () => parseServerEnv({ ...validEnv, WEDDING_CODE: secret, MONGODB_URI: "" }),
    (error: unknown) => {
      assert.ok(error instanceof Error);
      assert.match(error.message, /MONGODB_URI/);
      assert.doesNotMatch(error.message, new RegExp(secret));
      return true;
    },
  );
});
