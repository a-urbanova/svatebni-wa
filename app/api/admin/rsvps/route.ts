import { getCurrentSession } from "@/lib/auth/sessions";
import { getRepositories } from "@/lib/db/repositories";
import { loadAdminOverview, parseAdminFilters } from "@/lib/rsvp/admin-overview";

export const dynamic = "force-dynamic";

function json(body: unknown, status: number): Response {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function GET(request: Request): Promise<Response> {
  const parsedFilters = parseAdminFilters(new URL(request.url).searchParams);
  if (!parsedFilters.success) {
    return json({ kind: "invalid_filters", message: "Zadané filtry nejsou platné." }, 400);
  }

  try {
    const session = await getCurrentSession();
    if (!session) {
      return json({ kind: "unauthenticated", message: "Přihlaste se prosím znovu." }, 401);
    }
    if (session.role !== "admin") {
      return json({ kind: "forbidden", message: "Tato data jsou dostupná jen správcům." }, 403);
    }

    const { rsvps } = await getRepositories();
    const outcome = await loadAdminOverview(session, parsedFilters.filters, rsvps);
    if (outcome.kind === "success") return json(outcome, 200);

    // Kontrola výše odpovídá tomuto výsledku; ponechává bezpečné chování při budoucí změně toku.
    return json(outcome, outcome.kind === "unauthenticated" ? 401 : 403);
  } catch {
    return json(
      { kind: "server_error", message: "Přehled se teď nepodařilo načíst. Zkuste to prosím později." },
      500,
    );
  }
}
