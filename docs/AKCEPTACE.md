# Mapa akceptačních kritérií

Tato mapa pokrývá požadavky ze `docs/ZADANI.md`. Automatické testy používají jen fiktivní adresy `example.test` a izolované databáze; ruční kontroly se provádějí podle README.

| Oblast a kritérium | Způsob ověření |
| --- | --- |
| Veřejná pozvánka: text, datum, čas, místo, prsteny a přihlášení | Ruční prohlížeč: veřejná stránka na 360, 768 a 1440 px; automatická kontrola DOM při finální akceptaci. |
| Chybné hodnoty přihlášení a srozumitelné chyby | Ruční prohlížeč; `tests/rsvp-validation.test.ts`, `tests/magic-links.test.ts`. |
| Development magic link a obecná odpověď | `tests/e2e-acceptance.test.ts`, `tests/magic-links.test.ts`; ručně podle README. |
| Jednorázový a expirovaný magic link, session cookie, role a odhlášení | `tests/e2e-acceptance.test.ts`, `tests/sessions.test.ts`. |
| Host: více osob, podmíněný odvoz/dieta, validace, uložení a opětovné načtení | `tests/e2e-acceptance.test.ts`, `tests/host-rsvp-api.test.ts`, `tests/host-rsvp-form.test.ts`, `tests/rsvp-validation.test.ts`; ručně podle README. |
| Vlastnictví odpovědi a zákaz zásahu do cizích dat | `tests/host-rsvp-api.test.ts`, `tests/db-repositories.test.ts`, `tests/e2e-acceptance.test.ts`. |
| Správce: souhrny, řádky, hledání a filtry pouze pro čtení | `tests/admin-overview.test.ts`, `tests/admin-dashboard-state.test.ts`, `tests/db-repositories.test.ts`, `tests/e2e-acceptance.test.ts`. |
| Zákaz hosta v administraci a zákaz admina v hostovském RSVP | `tests/e2e-acceptance.test.ts`, `tests/admin-overview.test.ts`, `tests/host-rsvp-api.test.ts`, `tests/sessions.test.ts`. |
| Bezpečnost: normalizace, tajné otisky, origin, rate limit, necachování | `tests/emails.test.ts`, `tests/db-repositories.test.ts`, `tests/request-security.test.ts`, `tests/magic-links.test.ts`, `tests/sessions.test.ts`; ruční síťová kontrola podle README. |
| MongoDB indexy, izolace a úklid dat | `pnpm test:db`, `pnpm test:e2e`; oba testy mažou pouze databáze s příponou `_test`. |
| Responzivita, viditelný focus a klávesnice | Ručně na 360, 768 a 1440 px podle README; finální prohlížečová kontrola ověřila nepřítomnost horizontálního posunu na 360 a 1440 px a dostupné popisky/validaci. |
| Loading, error, empty a success stavy | `tests/host-rsvp-form.test.ts`, `tests/admin-dashboard-state.test.ts`; ručně podle README včetně dočasně nedostupné MongoDB. |
| Lokální převzetí, bezpečná ukázková data a build | `README.md`, `pnpm db:seed-demo`, `pnpm db:reset-local`, čistá instalace s `pnpm install --frozen-lockfile`, `pnpm build`. |
| Produkční SMTP doručení | `tests/magic-links.test.ts`; před nasazením je nutný ruční test s reálným, uživatelem spravovaným SMTP účtem podle README. |
