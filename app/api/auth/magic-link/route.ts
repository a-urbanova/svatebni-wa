import { createMagicLinkDelivery, requestMagicLink } from "@/lib/auth/magic-links";
import {
  clientAddress,
  getMagicLinkRateLimiter,
  isSameOriginMutation,
} from "@/lib/auth/request-security";
import { getServerEnv } from "@/lib/config/env.server";
import { getRepositories } from "@/lib/db/repositories";
import { emailSchema } from "@/lib/rsvp/schemas";

export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request): Promise<Response> {
  let env: ReturnType<typeof getServerEnv>;
  try {
    env = getServerEnv();
  } catch {
    return json(
      { kind: "server_error", message: "Odkaz se teď nepodařilo připravit. Zkuste to prosím později." },
      500,
    );
  }

  if (!isSameOriginMutation(request, env.APP_URL)) {
    return json({ kind: "forbidden", message: "Požadavek nelze ověřit. Obnovte stránku a zkuste to znovu." }, 403);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return json(
      {
        kind: "invalid_input",
        message: "Odeslaná data nejsou platná.",
        fieldErrors: {},
      },
      400,
    );
  }

  const email = typeof payload === "object" && payload !== null && "email" in payload
    ? emailSchema.safeParse(payload.email)
    : null;
  const rateLimit = getMagicLinkRateLimiter().consume([
    `ip:${clientAddress(request)}`,
    ...(email?.success ? [`email:${email.data}`] : []),
  ]);
  if (!rateLimit.allowed) {
    return Response.json(
      {
        kind: "rate_limited",
        message: "Příliš mnoho žádostí. Počkejte prosím chvíli a zkuste to znovu.",
      },
      {
        status: 429,
        headers: {
          "Cache-Control": "no-store",
          "Retry-After": String(rateLimit.retryAfterSeconds),
        },
      },
    );
  }

  try {
    const { loginTokens } = await getRepositories();
    const outcome = await requestMagicLink(payload, {
      env,
      loginTokens,
      delivery: createMagicLinkDelivery(process.env.NODE_ENV === "development"),
      isDevelopment: process.env.NODE_ENV === "development",
    });

    return json(outcome, outcome.kind === "success" ? 200 : 400);
  } catch {
    return json(
      {
        kind: "server_error",
        message: "Odkaz se teď nepodařilo připravit. Zkuste to prosím později.",
      },
      500,
    );
  }
}
