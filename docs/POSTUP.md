# POSTUP – skutečný průběh implementace

Tento soubor je pracovní deník. Agent jej aktualizuje po každé dokončené fázi. Nemá obsahovat domněnky vydávané za hotovou práci.

## Stav projektu

- Aktuální fáze: 01 dokončena
- Poslední dokončená fáze: 01 – Inicializace projektu
- Poslední aktualizace: 2026-07-31
- Stav hlavní větve: lokální Git repozitář je inicializovaný na větvi `main`; výchozí commit zatím neexistuje
- Správce balíčků: pnpm 11.9.0
- Přesné verze Node.js a hlavních knihoven: Node.js 24.14.0, Next.js 16.2.12, React 19.2.4, React DOM 19.2.4, TypeScript 5.9.3
- Databáze používaná při lokálním vývoji: zatím neurčena

## Přehled fází

| Fáze | Název | Stav | Datum dokončení |
|---|---|---|---|
| 01 | Inicializace projektu | Dokončeno | 2026-07-29 |
| 02 | Konfigurace a datové kontrakty | Nezahájeno | — |
| 03 | MongoDB a repozitáře | Nezahájeno | — |
| 04 | Design systém a sdílená pozvánka | Nezahájeno | — |
| 05 | Veřejná úvodní stránka | Nezahájeno | — |
| 06 | Žádost o magic link | Nezahájeno | — |
| 07 | Ověření, session, role a odhlášení | Nezahájeno | — |
| 08 | Formulář hosta – UI | Nezahájeno | — |
| 09 | Uložení a načtení RSVP | Nezahájeno | — |
| 10 | Admin data a souhrny | Nezahájeno | — |
| 11 | Admin dashboard | Nezahájeno | — |
| 12 | Responzivita, přístupnost a stavy | Nezahájeno | — |
| 13 | Bezpečnost a odolnost | Nezahájeno | — |
| 14 | Testy a finální akceptace | Nezahájeno | — |

Povolené stavy: `Nezahájeno`, `Probíhá`, `Dokončeno`, `Blokováno`.

## Zásadní průřezová rozhodnutí

Sem zapisujte rozhodnutí, která ovlivňují více fází. U každého uveďte datum, rozhodnutí, důvod a dopad.

- 2026-07-29 – Použit pnpm 11.9.0 místo výchozího npm. Důvod: v dostupném prostředí nebyl příkaz `npm`, zatímco lokální LTS Node.js runtime obsahoval pnpm. Dopad: projekt má pouze `pnpm-lock.yaml` a README používá pnpm.
- 2026-07-31 – Lokální Git repozitář byl inicializován na větvi `main`. Důvod: sledování změn projektu. Dopad: `.env.example` je verzovatelný, zatímco `.env.local` zůstává ignorovaný; pro první commit je třeba nastavit Git jméno a e-mail.

## Známá omezení a otevřené otázky

Sem zapisujte jen skutečně známé nedodělky, kompromisy nebo otázky.

- Lokální systémová cesta neobsahuje příkazy `node` ani `npm`; ověřený runtime je dostupný v prostředí Codex. Pro běžné lokální spuštění je nutné mít Node.js a pnpm nainstalované v cestě.

---

## Šablona záznamu dokončené fáze

Níže uvedenou šablonu po každé fázi zkopírujte na konec souboru a vyplňte. Současně změňte stav fáze v tabulce výše.

### Fáze XX – Název

- Datum dokončení:
- Stav: Dokončeno / Blokováno

#### Stručný popis provedených změn

Popište, co nyní aplikace skutečně umí nebo jaká infrastruktura byla připravena.

#### Důležité vytvořené nebo změněné soubory

- `cesta/k/souboru` – účel změny

#### Zásadní technická rozhodnutí

- Rozhodnutí:
- Důvod:
- Dopad na další fáze:

#### Známá omezení nebo nedodělky

- Žádné / konkrétní seznam

#### Chyby, které se objevily

- Chyba:
- Příčina:
- Způsob opravy:
- Zůstává nějaké riziko:

#### Provedené automatické kontroly

- Příkaz nebo kontrola:
- Výsledek:

#### Návrh ručního testování dokončené fáze

Uveďte konkrétní kroky, které může provést člověk bez hlubší znalosti programování.

#### Očekávaný výsledek ručního testu

Popište přesně, co má uživatel vidět a co nesmí nastat.

#### Poznámky pro následující fázi

Uveďte jen informace, které další fáze opravdu potřebuje.

### Fáze 01 – Inicializace projektu

- Datum dokončení: 2026-07-29
- Stav: Dokončeno

#### Stručný popis provedených změn

Byla založena aplikace Next.js s App Routerem, Reactem a TypeScriptem ve striktním režimu. Obsahuje neutrální placeholdery pro `/`, `/host` a `/admin`, český globální layout a metadata, základní skripty kvality a adresářovou strukturu pro budoucí komponenty, konfiguraci, databázi, autentifikaci, RSVP a testy.

#### Důležité vytvořené nebo změněné soubory

- `package.json` – závislosti Next.js/Reactu a skripty `dev`, `build`, `lint`, `typecheck` a `test`
- `pnpm-lock.yaml` a `pnpm-workspace.yaml` – jediný lockfile a konfigurace pnpm včetně schválených nezbytných build skriptů
- `app/layout.tsx`, `app/globals.css`, `app/page.tsx` – český layout, metadata a úvodní placeholder
- `app/host/page.tsx` a `app/admin/page.tsx` – placeholdery chráněných budoucích vstupů bez dosud neexistující autentifikace
- `components/.gitkeep`, `lib/auth/.gitkeep`, `lib/config/.gitkeep`, `lib/db/.gitkeep`, `lib/rsvp/.gitkeep`, `tests/.gitkeep` – připravená struktura další implementace
- `.env.example` – bezpečná šablona budoucí konfigurace bez tajných hodnot
- `README.md` – postup instalace, spuštění a kontrol s upozorněním na stav kostry

#### Zásadní technická rozhodnutí

- Rozhodnutí: Použití pnpm 11.9.0 jako jediného správce balíčků.
- Důvod: V prostředí nebyl dostupný npm; pnpm byl součástí dostupného Node.js runtime.
- Dopad na další fáze: Nové závislosti se přidávají výhradně přes pnpm a aktualizují `pnpm-lock.yaml`.

#### Známá omezení nebo nedodělky

- Záměrně nejsou implementovány MongoDB, autentifikace, magic link, RSVP ani finální design; patří do následujících fází.
- Testovací skript je připravený, ale v této fázi zatím nejsou žádné testovací případy.

#### Chyby, které se objevily

- Chyba: První instalace závislostí skončila na ochraně pnpm před neschválenými build skripty `sharp` a `unrs-resolver`.
- Příčina: pnpm 11 vyžaduje jejich explicitní schválení.
- Způsob opravy: Oba nezbytné skripty byly explicitně povoleny v `pnpm-workspace.yaml` a instalace byla úspěšně dokončena.
- Zůstává nějaké riziko: Ne; build i vývojový server byly úspěšně ověřeny.

#### Provedené automatické kontroly

- `pnpm install --frozen-lockfile` – úspěch.
- `pnpm lint` – úspěch.
- `pnpm typecheck` – úspěch.
- `pnpm test` – úspěch, 0 testů (v této fázi očekávané).
- `pnpm build` – úspěch; Next.js vygeneroval `/`, `/host` a `/admin`.
- `pnpm dev --hostname 127.0.0.1` a HTTP požadavky na `/`, `/host`, `/admin` – server úspěšně nastartoval a všechny tři adresy odpověděly HTTP 200.

#### Návrh ručního testování dokončené fáze

1. Nainstalujte Node.js a pnpm podle požadavků v `README.md`.
2. V kořeni projektu spusťte `pnpm install` a potom `pnpm dev`.
3. V prohlížeči otevřete `/`, `/host` a `/admin`.
4. Zastavte server a spusťte `pnpm lint`, `pnpm typecheck`, `pnpm test` a `pnpm build`.
5. Zkontrolujte, že repozitář neobsahuje `.env.local` ani skutečný svatební kód.

#### Očekávaný výsledek ručního testu

Všechny tři adresy se otevřou bez chyby 404 a zobrazí česky označený dočasný obsah. Všechny čtyři kontroly skončí úspěšně; testovací příkaz v této fázi ohlásí nula testů. `.env.example` obsahuje jen prázdné nebo bezpečné ukázkové hodnoty.

#### Poznámky pro následující fázi

Kostra nepřidává žádnou doménovou ani databázovou logiku; fáze 02 může bez přestavby zaplnit připravené adresáře `lib/config` a `lib/rsvp`.
