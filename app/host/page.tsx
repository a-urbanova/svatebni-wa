import { InvitationSection } from "@/components/invitation";
import { Card, StatusMessage } from "@/components/ui";
import { UserBar } from "@/components/user-bar";
import { getCurrentSession, protectedPageRedirect } from "@/lib/auth/sessions";
import { redirect } from "next/navigation";

export const dynamic = "force-dynamic";

export default async function HostPage() {
  const session = await getCurrentSession();

  if (!session) {
    redirect("/");
  }

  const destination = protectedPageRedirect(session, "host");

  if (destination) {
    redirect(destination);
  }

  return (
    <main className="page-shell page-shell-invitation">
      <div className="content-container content-container-narrow">
        <UserBar email={session.email} />
        <InvitationSection />
        <Card className="next-step-card" aria-labelledby="host-placeholder-title">
          <h2 id="host-placeholder-title">Vaše odpověď</h2>
          <p>
            Přihlášení a formulář pro potvrzení účasti budou doplněny v
            následujících fázích.
          </p>
          <StatusMessage>
            Zatím zde nejsou dostupné žádné údaje hosta ani formulář.
          </StatusMessage>
        </Card>
      </div>
    </main>
  );
}
