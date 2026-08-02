import { InvitationSection } from "@/components/invitation";
import { Card, FieldLabel, StatusMessage } from "@/components/ui";

export default function Home() {
  return (
    <main className="page-shell page-shell-invitation">
      <div className="content-container content-container-narrow">
        <InvitationSection />
        <Card className="next-step-card" aria-labelledby="login-placeholder-title">
          <h2 id="login-placeholder-title">Přihlášení</h2>
          <p>
            Přihlašovací formulář a žádost o magic link budou doplněny v další
            fázi.
          </p>
          <FieldLabel>E-mail a svatební kód</FieldLabel>
          <StatusMessage>
            Tato ukázka zatím neodesílá žádné údaje.
          </StatusMessage>
        </Card>
      </div>
    </main>
  );
}
