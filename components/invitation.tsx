import { RingsMotif, SectionDivider } from "./ui";

export function InvitationSection({ showLoginInformation = true }: { showLoginInformation?: boolean }) {
  return (
    <section className="invitation" aria-labelledby="invitation-title">
      <p className="eyebrow">Svatební pozvánka</p>
      <h1 id="invitation-title" className="invitation-names">
        Anna <span>&amp;</span> Petr
      </h1>
      <RingsMotif />

      <div className="invitation-details">
        <p className="invitation-copy">
          Srdečně Vás zveme na náš svatební obřad,
          <br />
          {" "}který se bude konat
        </p>
        <p className="invitation-date">21. září 2026</p>
        <p className="invitation-time">ve 12:00</p>
        <p className="invitation-place">
          u kostela sv. Antonína Velikého
          <br />
          {" "}v Liberci
        </p>
      </div>

      {showLoginInformation ? (
        <p className="invitation-intro">
          Po přihlášení budete moci zaregistrovat svou účast, doplnit počet osob
          včetně dětí, přespání, případný odvoz i dietární omezení. Pro přihlášení
          použijte svůj e-mail a společný svatební kód.
        </p>
      ) : null}
      <SectionDivider />
    </section>
  );
}
