# POSTUP – skutečný průběh implementace

Tento soubor je pracovní deník. Agent jej aktualizuje po každé dokončené fázi. Nemá obsahovat domněnky vydávané za hotovou práci.

## Stav projektu

- Aktuální fáze: 02 dokončena
- Poslední dokončená fáze: 02 – Konfigurace a datové kontrakty
- Poslední aktualizace: 2026-07-31
- Stav hlavní větve: lokální Git repozitář je inicializovaný na větvi `main`; výchozí commit zatím neexistuje
- Správce balíčků: pnpm 11.9.0
- Přesné verze Node.js a hlavních knihoven: Node.js 24.14.0, Next.js 16.2.12, React 19.2.4, React DOM 19.2.4, TypeScript 5.9.3
- Databáze používaná při lokálním vývoji: zatím neurčena

## Přehled fází

| Fáze | Název | Stav | Datum dokončení |
|---|---|---|---|
| 01 | Inicializace projektu | Dokončeno | 2026-07-29 |
| 02 | Konfigurace a datové kontrakty | Dokončeno | 2026-07-31 |
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
- 2026-07-31 – Sdílená validace používá Zod 4.4.3 jako přímou závislost. Důvod: serverové i budoucí klientské formuláře musí sdílet stejné, typově odvozené kontrakty. Dopad: datové vstupy se ověřují schématy v `lib/rsvp/schemas.ts`; databázová ani UI vrstva se ve fázi 02 nezavádí.
- 2026-07-31 – Všechny hodnoty prostředí jsou ve fázi 02 pouze serverové; veřejná konfigurace je záměrně prázdná. Důvod: žádná současná klientská funkce hodnotu prostředí nepotřebuje a `APP_URL` i tajný kód budou sloužit pouze serverovému toku magic linku. Dopad: budoucí veřejná proměnná musí být vědomě přidána do `lib/config/public.ts`, nikoli odvozena ze serverové konfigurace.

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

### Fáze 02 – Konfigurace a datové kontrakty

- Datum dokončení: 2026-07-31
- Stav: Dokončeno

#### Stručný popis provedených změn

Byla připravena validovaná serverová konfigurace pro MongoDB, URL aplikace, svatební kód a platnosti tokenu/session. Konfigurace se načítá až při serverovém použití a její chyba vypisuje pouze názvy vadných proměnných. Doména RSVP nyní obsahuje typy osoby, dopravy, dietních omezení, vlastníka a časových údajů. Zod schémata ověřují žádost o magic link, osobu, celou odpověď i administrátorské filtry včetně závislostí odvoz/dieta. Přibyly testy normalizace a čisté validační logiky.

#### Důležité vytvořené nebo změněné soubory

- `lib/config/env.server.ts` a `lib/config/env.schema.ts` – chráněný serverový vstup konfigurace a čisté schéma pro jednotkové testy
- `lib/config/public.ts` – výslovně prázdná veřejná konfigurace pro budoucí vědomé přidávání bezpečných hodnot
- `lib/auth/emails.ts` – normalizace e-mailu a pevně zadané administrátorské adresy
- `lib/rsvp/types.ts` – doménové TypeScript typy RSVP
- `lib/rsvp/schemas.ts` – Zod schémata, limity a odvozené vstupní typy
- `tests/emails.test.ts`, `tests/env.test.ts`, `tests/rsvp-validation.test.ts` – 10 jednotkových testů normalizace, konfigurace a validace
- `.env.example` – úplná bezpečná šablona povinné konfigurace bez tajných hodnot
- `package.json`, `pnpm-lock.yaml`, `tsconfig.json` – přímé závislosti Zod 4.4.3 a `server-only` plus podpora TypeScript testovacích importů v Node.js 24
- `README.md` – aktuální stav fáze a instrukce ke konfiguraci

#### Zásadní technická rozhodnutí

- Rozhodnutí: E-mail se pouze ořízne a převede na malá písmena, bez poskytovatelsky specifických úprav.
- Důvod: Odstranění například teček u Gmailu by mohlo nežádoucím způsobem změnit význam jiné platné adresy.
- Dopad na další fáze: Role i vlastnictví dat musí používat `normalizeEmail` ze `lib/auth/emails.ts`.
- Rozhodnutí: Schémata odmítají neznámá pole místo jejich ukládání.
- Důvod: Klient nesmí ovlivnit databázová data poli mimo výslovně definovaný kontrakt.
- Dopad na další fáze: Route handlery musí pracovat pouze s výstupem `safeParse`/`parse` těchto schémat.

#### Známá omezení nebo nedodělky

- Záměrně nejsou vytvořeny MongoDB dotazy, route handlery, session, magic-link tok ani UI formuláře; patří do následujících fází.
- Serverová konfigurace zatím není volána placeholder stránkami. Fáze 03 a 06 musí před svým serverovým použitím volat `getServerEnv()`.

#### Chyby, které se objevily

- Chyba: Přidání závislosti pnpm nejdříve nemohlo otevřít existující úložiště mimo pracovní adresář.
- Příčina: Sandbox nepovoloval zápis do indexu již existujícího lokálního pnpm store.
- Způsob opravy: Stejný příkaz byl spuštěn s povoleným přístupem k existujícímu lokálnímu store; žádný balíček se nestahoval.
- Zůstává nějaké riziko: Ne.
- Chyba: První běh kontrol odhalil nekompatibilní textové parametry `.strict()` v Zodu 4 a neřešitelný alias `@/` pro samostatný Node test runner.
- Příčina: Rozdíl API Zodu 4 a absence Next resolveru v `node --test`.
- Způsob opravy: Schémata používají API Zodu 4 a testovatelné relativní TypeScript importy.
- Zůstává nějaké riziko: Ne; lint, typová kontrola i testy následně prošly.

#### Provedené automatické kontroly

- `pnpm lint` – úspěch.
- `pnpm typecheck` – úspěch.
- `pnpm test` – úspěch, 10 testů.
- `pnpm build` – úspěch; optimalizované sestavení vytvořilo `/`, `/host` a `/admin`.
- `pnpm dev --hostname 127.0.0.1 --port 3001` a HTTP požadavek na `/` – server úspěšně nastartoval, stránka odpověděla HTTP 200.

#### Návrh ručního testování dokončené fáze

1. Zkopírujte `.env.example` do `.env.local`, vyplňte `MONGODB_URI` bezpečnou lokální ukázkou `mongodb://127.0.0.1:27017` a ponechte hodnotu `WEDDING_CODE` prázdnou.
2. V kořeni projektu spusťte `node --conditions react-server --env-file=.env.local --input-type=module -e 'import { getServerEnv } from "./lib/config/env.server.ts"; getServerEnv()'`.
3. Doplňte do `.env.local` lokální testovací hodnotu svatebního kódu a spusťte `pnpm test`.
4. V testovacím výstupu ověřte případy prázdného jména, chybějícího cíle odvozu, chybějícího upřesnění jiné diety, více než 20 osob a e-mailu s mezerami a velkými písmeny.

#### Očekávaný výsledek ručního testu

Příkaz s prázdnou konfigurací skončí s českou chybou obsahující název `WEDDING_CODE`, nikdy však jeho hodnotu. `pnpm test` úspěšně dokončí všech 10 testů. Neplatné vstupy jsou odmítnuty, zatímco e-mail s mezerami a velkými písmeny se normalizuje na malá písmena bez okrajových mezer.

#### Poznámky pro následující fázi

Fáze 03 může použít `getServerEnv()` pro MongoDB URI a název databáze. Kontrakty `Rsvp`, `Person` a validační výstupy jsou připravené pro repozitář, ale `ownerEmail`, `createdAt` a `updatedAt` nesmí přijímat z formuláře; doplní je důvěryhodná serverová vrstva.
