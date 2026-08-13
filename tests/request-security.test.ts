import assert from "node:assert/strict";
import test from "node:test";

import {
  FixedWindowRateLimiter,
  isSameOriginMutation,
} from "../lib/auth/request-security.ts";

test("magic link rate limit platí současně pro IP i normalizovaný e-mail", () => {
  const limiter = new FixedWindowRateLimiter(2, 60_000);
  const now = new Date("2026-08-13T12:00:00.000Z").getTime();

  assert.deepEqual(limiter.consume(["ip:127.0.0.1", "email:host@example.cz"], now), {
    allowed: true,
    retryAfterSeconds: 0,
  });
  assert.equal(limiter.consume(["ip:127.0.0.1", "email:host@example.cz"], now + 1).allowed, true);

  const byEmail = limiter.consume(["ip:127.0.0.2", "email:host@example.cz"], now + 2);
  assert.equal(byEmail.allowed, false);
  assert.equal(byEmail.retryAfterSeconds, 60);

  const byIp = limiter.consume(["ip:127.0.0.1", "email:other@example.cz"], now + 2);
  assert.equal(byIp.allowed, false);
  assert.equal(limiter.consume(["ip:127.0.0.1", "email:host@example.cz"], now + 60_001).allowed, true);
});

test("mutující endpointy přijímají jen přesný origin aplikace", () => {
  const appUrl = "https://svatba.example.cz";

  assert.equal(isSameOriginMutation(new Request("https://svatba.example.cz/api/rsvp", {
    method: "PUT",
    headers: { origin: "https://svatba.example.cz" },
  }), appUrl), true);
  assert.equal(isSameOriginMutation(new Request("https://svatba.example.cz/api/rsvp", {
    method: "PUT",
    headers: { origin: "https://utocnik.example" },
  }), appUrl), false);
  assert.equal(isSameOriginMutation(new Request("https://svatba.example.cz/api/rsvp", {
    method: "PUT",
  }), appUrl), false);
});
