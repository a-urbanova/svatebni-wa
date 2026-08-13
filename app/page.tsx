import { InvitationSection } from "@/components/invitation";
import { LoginForm } from "@/components/login-form";
import { Card, SkipLink, StatusMessage } from "@/components/ui";

type HomePageProps = {
  searchParams: Promise<{ auth?: string }>;
};

export default async function Home({ searchParams }: HomePageProps) {
  const { auth } = await searchParams;
  const authMessage =
    auth === "invalid-link"
      ? "Tento přihlašovací odkaz je neplatný, již použitý nebo jeho platnost vypršela. Vyžádejte si prosím nový."
      : auth === "verification-failed"
        ? "Přihlášení se teď nepodařilo dokončit. Vyžádejte si prosím nový odkaz později."
        : null;

  return (
    <>
      <SkipLink href="#prihlaseni" />
      <main className="page-shell page-shell-invitation">
        <div className="content-container content-container-narrow">
          <InvitationSection />
          <Card className="login-card" id="prihlaseni" aria-labelledby="login-title">
            <h2 id="login-title">Přihlášení</h2>
            <p className="login-instructions">
              Zadejte e-mail a společný svatební kód, který jste obdrželi v
              pozvánce.
            </p>
            {authMessage ? <StatusMessage tone="error">{authMessage}</StatusMessage> : null}
            <LoginForm />
          </Card>
        </div>
      </main>
      <footer className="site-footer">Anna &amp; Petr · 21. září 2026</footer>
    </>
  );
}
