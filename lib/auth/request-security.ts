import "server-only";

import { hashSecret } from "./secrets.ts";

export const MAGIC_LINK_RATE_LIMIT = {
  limit: 5,
  windowMs: 15 * 60_000,
} as const;

type RateLimitEntry = {
  timestamps: number[];
};

export type RateLimitResult = {
  allowed: boolean;
  retryAfterSeconds: number;
};

/**
 * Jednoduché lokální omezení četnosti. Klíče se v paměti drží jen jako otisky,
 * aby proces neuchovával čitelné e-maily ani IP adresy déle, než je nutné.
 */
export class FixedWindowRateLimiter {
  private readonly entries = new Map<string, RateLimitEntry>();
  private readonly limit: number;
  private readonly windowMs: number;

  constructor(
    limit: number = MAGIC_LINK_RATE_LIMIT.limit,
    windowMs: number = MAGIC_LINK_RATE_LIMIT.windowMs,
  ) {
    this.limit = limit;
    this.windowMs = windowMs;
  }

  consume(values: ReadonlyArray<string>, now = Date.now()): RateLimitResult {
    const cutoff = now - this.windowMs;
    const keys = [...new Set(values.map((value) => hashSecret(value)))];
    let retryAfterMs = 0;

    for (const [key, entry] of this.entries) {
      entry.timestamps = entry.timestamps.filter((timestamp) => timestamp > cutoff);
      if (entry.timestamps.length === 0) this.entries.delete(key);
    }

    for (const key of keys) {
      const entry = this.entries.get(key);
      if (entry && entry.timestamps.length >= this.limit) {
        retryAfterMs = Math.max(retryAfterMs, entry.timestamps[0]! + this.windowMs - now);
      }
    }

    if (retryAfterMs > 0) {
      return { allowed: false, retryAfterSeconds: Math.ceil(retryAfterMs / 1_000) };
    }

    for (const key of keys) {
      const entry = this.entries.get(key) ?? { timestamps: [] };
      entry.timestamps.push(now);
      this.entries.set(key, entry);
    }

    return { allowed: true, retryAfterSeconds: 0 };
  }
}

type GlobalRateLimiter = typeof globalThis & {
  __svatebniMagicLinkRateLimiter?: FixedWindowRateLimiter;
};

/** Přetrvá i běžný hot reload ve vývoji; mezi procesy záměrně nesdílí stav. */
export function getMagicLinkRateLimiter(): FixedWindowRateLimiter {
  const globalScope = globalThis as GlobalRateLimiter;
  globalScope.__svatebniMagicLinkRateLimiter ??= new FixedWindowRateLimiter();
  return globalScope.__svatebniMagicLinkRateLimiter;
}

export function clientAddress(request: Request): string {
  const forwarded = request.headers.get("x-forwarded-for")?.split(",")[0]?.trim();
  return forwarded || request.headers.get("x-real-ip")?.trim() || "unknown";
}

/** Odmítne mutace, které nepocházejí z přesného originu aplikace. */
export function isSameOriginMutation(request: Request, appUrl: string): boolean {
  const origin = request.headers.get("origin");
  if (!origin) return false;

  try {
    return new URL(origin).origin === new URL(appUrl).origin;
  } catch {
    return false;
  }
}
