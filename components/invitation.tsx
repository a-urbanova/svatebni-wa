import { RingsMotif, SectionDivider } from "./ui";

export function InvitationSection() {
  return (
    <section className="invitation" aria-labelledby="invitation-title">
      <p className="eyebrow">Svatební pozvánka</p>
      <h1 id="invitation-title" className="invitation-names">
        Anna <span>&amp;</span> Petr
      </h1>
      <RingsMotif />

      <div className="invitation-details">
        <p className="invitation-copy">
          Srdečně vás zveme na náš svatební obřad,
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

      <p className="invitation-intro">
        Po přihlášení budete moci vyplnit účast, osoby, přespání, odvoz a
        dietární omezení.
      </p>
      <SectionDivider />
    </section>
  );
}
