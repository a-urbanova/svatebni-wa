import { createMagicLinkDelivery, requestMagicLink } from "@/lib/auth/magic-links";
import { getServerEnv } from "@/lib/config/env.server";
import { getRepositories } from "@/lib/db/repositories";

export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, {
    status,
    headers: { "Cache-Control": "no-store" },
  });
}

export async function POST(request: Request): Promise<Response> {
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

  try {
    const env = getServerEnv();
    const { loginTokens } = await getRepositories();
    const outcome = await requestMagicLink(payload, {
      env,
      loginTokens,
      delivery: createMagicLinkDelivery(process.env.NODE_ENV === "development"),
      isDevelopment: process.env.NODE_ENV === "development",
    });

    return json(outcome, outcome.kind === "success" ? 200 : outcome.kind === "invalid_input" ? 400 : 403);
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
