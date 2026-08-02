import { InvitationSection } from "@/components/invitation";
import { Card, StatusMessage } from "@/components/ui";

export default function HostPage() {
  return (
    <main className="page-shell page-shell-invitation">
      <div className="content-container content-container-narrow">
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
