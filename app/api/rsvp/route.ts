import { getCurrentSession } from "@/lib/auth/sessions";
import { isSameOriginMutation } from "@/lib/auth/request-security";
import { getServerEnv } from "@/lib/config/env.server";
import { getRepositories } from "@/lib/db/repositories";
import { loadHostRsvp, saveHostRsvp, type HostRsvpOutcome } from "@/lib/rsvp/host-rsvp";

export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

function responseFor(outcome: HostRsvpOutcome): Response {
  switch (outcome.kind) {
    case "success":
      return json({ rsvp: outcome.rsvp }, 200);
    case "invalid_input":
      return json(
        { kind: outcome.kind, message: "Zkontrolujte prosím označená pole.", fieldErrors: outcome.fieldErrors },
        400,
      );
    case "unauthenticated":
      return json({ kind: outcome.kind, message: "Přihlášení vypršelo. Přihlaste se prosím znovu." }, 401);
    case "forbidden":
      return json({ kind: outcome.kind, message: "Tato akce je dostupná jen pro hosty." }, 403);
  }
}

export async function GET(): Promise<Response> {
  try {
    const session = await getCurrentSession();
    if (!session) return responseFor({ kind: "unauthenticated" });
    if (session.role !== "guest") return responseFor({ kind: "forbidden" });
    const { rsvps } = await getRepositories();
    return responseFor(await loadHostRsvp(session, rsvps));
  } catch {
    return json({ kind: "server_error", message: "Odpověď se teď nepodařilo načíst. Zkuste to prosím později." }, 500);
  }
}

export async function PUT(request: Request): Promise<Response> {
  try {
    if (!isSameOriginMutation(request, getServerEnv().APP_URL)) {
      return json({ kind: "forbidden", message: "Požadavek nelze ověřit. Obnovte stránku a zkuste to znovu." }, 403);
    }
  } catch {
    return json({ kind: "server_error", message: "Odpověď se teď nepodařilo uložit. Zkuste to prosím později." }, 500);
  }

  let payload: unknown;

  try {
    payload = await request.json();
  } catch {
    return json({ kind: "invalid_input", message: "Odeslaná data nejsou platná.", fieldErrors: {} }, 400);
  }

  try {
    const session = await getCurrentSession();
    if (!session) return responseFor({ kind: "unauthenticated" });
    if (session.role !== "guest") return responseFor({ kind: "forbidden" });
    const { rsvps } = await getRepositories();
    return responseFor(await saveHostRsvp(session, payload, rsvps));
  } catch {
    return json({ kind: "server_error", message: "Odpověď se teď nepodařilo uložit. Zkuste to prosím později." }, 500);
  }
}
