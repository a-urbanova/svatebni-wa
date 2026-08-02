import { InvitationSection } from "@/components/invitation";
import { LoginForm } from "@/components/login-form";
import { Card } from "@/components/ui";

export default function Home() {
  return (
    <>
      <main className="page-shell page-shell-invitation">
        <div className="content-container content-container-narrow">
          <InvitationSection />
          <Card className="login-card" aria-labelledby="login-title">
            <h2 id="login-title">Přihlášení</h2>
            <p className="login-instructions">
              Zadejte e-mail a společný svatební kód, který jste obdrželi v
              pozvánce.
            </p>
            <LoginForm />
          </Card>
        </div>
      </main>
      <footer className="site-footer">Anna &amp; Petr · 21. září 2026</footer>
    </>
  );
}
