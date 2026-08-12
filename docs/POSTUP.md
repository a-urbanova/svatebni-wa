# POSTUP – skutečný průběh implementace

Tento soubor je pracovní deník. Agent jej aktualizuje po každé dokončené fázi. Nemá obsahovat domněnky vydávané za hotovou práci.

## Stav projektu

- Aktuální fáze: 09 dokončena
- Poslední dokončená fáze: 09 – Uložení a načtení RSVP
- Poslední aktualizace: 2026-08-12
- Stav hlavní větve: lokální Git repozitář je inicializovaný na větvi `main`; výchozí commit zatím neexistuje
- Správce balíčků: pnpm 11.9.0
- Přesné verze Node.js a hlavních knihoven: Node.js 24.14.0, Next.js 16.2.12, React 19.2.4, React DOM 19.2.4, TypeScript 5.9.3
- Databáze používaná při lokálním vývoji: lokální MongoDB z necommitovaného `.env.local` na `127.0.0.1:27017`; izolované testy používají samostatnou databázi `svatebni_wa_test`

## Přehled fází

| Fáze | Název | Stav | Datum dokončení |
|---|---|---|---|
| 01 | Inicializace projektu | Dokončeno | 2026-07-29 |
| 02 | Konfigurace a datové kontrakty | Dokončeno | 2026-07-31 |
| 03 | MongoDB a repozitáře | Dokončeno | 2026-07-31 |
| 04 | Design systém a sdílená pozvánka | Dokončeno | 2026-07-31 |
| 05 | Veřejná úvodní stránka | Dokončeno | 2026-08-02 |
| 06 | Žádost o magic link | Dokončeno | 2026-08-02 |
| 07 | Ověření, session, role a odhlášení | Dokončeno | 2026-08-07 |
| 08 | Formulář hosta – UI | Dokončeno | 2026-08-12 |
| 09 | Uložení a načtení RSVP | Dokončeno | 2026-08-12 |
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
- 2026-07-31 – Databázové integrační testy vyžadují výhradně `MONGODB_TEST_URI` a `MONGODB_TEST_DB_NAME` v necommitovaném `.env.test`; název musí končit `_test`. Důvod: test před spuštěním i po skončení maže celou databázi a nesmí se nikdy dotknout běžné vývojové ani produkční databáze. Dopad: `pnpm test` databázový test přeskočí, zatímco `pnpm test:db` se bez explicitní izolované konfigurace bezpečně zastaví.
- 2026-07-31 – Design systém používá lokálně dostupné systémové fontové stacky `Georgia`/`Times New Roman` pro patkovou sazbu a `Inter`/systémové sans-serif pro ovládací prvky. Důvod: fonty mají bezpečné fallbacky s českou diakritikou a nezavádějí síťovou závislost ani riziko selhání lokálního buildu. Dopad: případné budoucí webové písmo musí zachovat tyto fallbacky.

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

### Fáze 03 – MongoDB a repozitáře

- Datum dokončení: 2026-07-31
- Stav: Dokončeno

#### Stručný popis provedených změn

Vznikl serverový MongoDB klient sdílený mezi hot-reload cykly, typované kolekce a opakovatelná inicializace indexů. Repozitáře bezpečně ukládají pouze SHA-256 otisky magic-link a session tokenů, token spotřebovávají atomicky a odmítají expirované hodnoty. RSVP repozitář normalizuje vlastníka, nastavuje timestampy na serveru, upsertuje jen validační kontrakt a poskytuje read-only přehled osob pro budoucí správu. Přibyl integrační test proti oddělené databázi, který před i po testu maže jen databázi se jménem končícím `_test`.

#### Důležité vytvořené nebo změněné soubory

- `lib/db/mongodb.ts` – znovupoužitelný serverový klient a přístup k aplikační databázi
- `lib/db/collections.ts`, `lib/db/documents.ts`, `lib/db/indexes.ts` – typy dokumentů, kolekce a bezpečné indexy
- `lib/db/repositories/login-tokens.ts`, `lib/db/repositories/sessions.ts`, `lib/db/repositories/rsvps.ts` – datové operace bez ukládání čitelných tajných hodnot
- `lib/db/repositories/index.ts` a `lib/auth/secrets.ts` – serverový vstup repozitářů a hashování tajných hodnot
- `scripts/init-mongodb-indexes.ts`, `package.json` – příkaz `pnpm db:indexes` a explicitní `pnpm test:db`
- `tests/db-repositories.test.ts`, `.env.test.example` – izolovaný integrační test a bezpečná šablona jeho konfigurace
- `README.md`, `.gitignore` – postup spuštění indexů a testů bez verzování `.env.test`

#### Zásadní technická rozhodnutí

- Rozhodnutí: Do MongoDB se ukládá SHA-256 otisk tokenu/session v Base64URL, ne čitelná hodnota.
- Důvod: Únik databáze nesmí přímo umožnit převzetí magic linku ani session.
- Dopad na další fáze: Fáze 06 a 07 předají repozitářům čitelný náhodný token jen pro zahashování a do cookie jej uloží až jejich HTTP vrstva.
- Rozhodnutí: Integrační databáze má vlastní proměnné a povinnou příponu `_test`.
- Důvod: Test ji maže a nesmí omylem použít vývojovou databázi.
- Dopad na další fáze: Před databázovým testem je nutné spustit MongoDB a vytvořit `.env.test` podle šablony.

#### Známá omezení nebo nedodělky

- HTTP route handlery, cookies, generování tokenů a uživatelské rozhraní záměrně patří do následujících fází.

#### Chyby, které se objevily

- Chyba: První instalace driveru použila jiný pnpm store.
- Příčina: Prostředí Codexu předávalo pnpm jinou výchozí cestu store než existující `node_modules`.
- Způsob opravy: Driver byl nainstalován přes existující lokální pnpm store; krátce vytvořený pracovní store byl odstraněn.
- Zůstává nějaké riziko: Ne.
- Chyba: Inicializace indexů v sandboxu nejdříve skončila `EPERM`, po povolení lokálního síťového spojení pak `ECONNREFUSED 127.0.0.1:27017`.
- Příčina: Lokální MongoDB server neběžel.
- Způsob opravy: Po instalaci a spuštění MongoDB byly indexy úspěšně vytvořeny a izolovaný test proběhl nad databází `svatebni_wa_test`.
- Zůstává nějaké riziko: Ne.

#### Provedené automatické kontroly

- `pnpm typecheck` – úspěch.
- `pnpm lint` – úspěch.
- `pnpm test` – úspěch: 10 testů prošlo, 1 databázový test byl očekávaně přeskočen bez `.env.test`.
- `pnpm db:indexes` – úspěch; indexy byly vytvořeny v lokální vývojové databázi.
- `pnpm test:db` – úspěch; 1 integrační test prošel nad izolovanou databází `svatebni_wa_test`, která byla po testu smazána.

#### Návrh ručního testování dokončené fáze

1. Spusťte lokální MongoDB podle hodnot v `.env.local`.
2. Spusťte `pnpm db:indexes`.
3. Zkopírujte `.env.test.example` do `.env.test`, nastavte samostatnou databázi se jménem končícím `_test` a spusťte `pnpm test:db`.
4. V MongoDB nástroji zkontrolujte indexy `login_tokens_token_hash_unique`, `login_tokens_expires_at_ttl`, `sessions_session_hash_unique`, `sessions_expires_at_ttl` a `rsvps_owner_email_unique`.
5. Po skončení testu ověřte, že testovací databáze byla smazána a vývojová databáze zůstala nedotčená.

#### Očekávaný výsledek ručního testu

Inicializace indexů i integrační test úspěšně skončí. V testovací databázi se před jejím smazáním nevyskytuje čitelné pole tokenu ani session tokenu a duplicitní `ownerEmail` nelze vložit. Běžná vývojová databáze se při `pnpm test:db` nepoužije ani nezmění.

#### Poznámky pro následující fázi

Fáze 06/07 mohou používat `getRepositories()`; přímé konstrukční funkce repozitářů jsou určeny také pro izolované testy.

### Fáze 04 – Design systém a sdílená pozvánka

- Datum dokončení: 2026-07-31
- Stav: Dokončeno

#### Stručný popis provedených změn

Byl vytvořen znovupoužitelný vizuální základ: tokeny barev, typografie, rozestupů, rádiusů, stínů a šířek obsahu, globální focus styl a responzivní rozložení. Sdílená pozvánka s přesnými údaji o svatbě se nyní zobrazí na `/` i `/host`; obsahuje vlastní přístupnostně skrytý SVG motiv propojených prstenů a linkový oddělovač. Zbývající části obou stránek jsou záměrně jasné placeholdery bez funkčního přihlášení nebo RSVP formuláře.

#### Důležité vytvořené nebo změněné soubory

- `components/invitation.tsx` – sdílená sekce pozvánky pro veřejnou i hostovskou stránku
- `components/ui.tsx` – znovupoužitelné karty, varianty tlačítek, popisek pole, stavová zpráva, prsteny a oddělovač
- `app/globals.css` – tokeny a responzivní styl společných UI prvků, úzkého pozvánkového i širokého admin kontejneru
- `app/page.tsx` a `app/host/page.tsx` – nahrazení placeholderu sdílenou pozvánkou a nefunkčními informačními kartami
- `app/admin/page.tsx` – ponechaný jasný placeholder převedený na připravený široký admin kontejner
- `docs/POSTUP.md` – pravdivý záznam fáze 04

#### Zásadní technická rozhodnutí

- Rozhodnutí: Pozvánka je serverová React komponenta a dekorace jsou jednoduché inline SVG/CSS.
- Důvod: Obě stránky sdílejí shodný obsah bez klientského JavaScriptu a reference zůstávají jen v dokumentaci.
- Dopad na další fáze: Fáze 05 až 08 mohou do hotového layoutu vložit funkční přihlášení a RSVP bez kopírování pozvánky.
- Rozhodnutí: Použity jsou systémové fontové fallbacky místo stahovaného externího písma.
- Důvod: Bezpečný lokální build i po zablokování externích fontů a zachování české diakritiky.
- Dopad na další fáze: Vizuální styl lze později rozšířit o lokálně hostované písmo, aniž by se odstranily fallbacky.

#### Známá omezení nebo nedodělky

- Přihlašovací karta, magic link, session a RSVP formulář nejsou záměrně funkční; patří do fází 05 až 09.
- Neproběhlo pixelově přesné ladění kompletních budoucích stavů formuláře ani administrace; tyto obrazovky zatím nejsou v rozsahu fáze 04.

#### Chyby, které se objevily

- Chyba: Lokální vývojový server při prvním spuštění v sandboxu nemohl otevřít port `127.0.0.1:3001` (`EPERM`).
- Příčina: Sandbox omezuje síťové naslouchání.
- Způsob opravy: Server a lokální HTTP ověření byly spuštěny s povoleným lokálním síťovým přístupem.
- Zůstává nějaké riziko: Ne; `/` i `/host` následně odpověděly HTTP 200 a vykreslily požadovaný obsah.

#### Provedené automatické kontroly

- `pnpm lint` – úspěch.
- `pnpm typecheck` – úspěch.
- `pnpm test` – úspěch: 10 testů prošlo, 1 databázový test byl očekávaně přeskočen bez explicitního `.env.test`.
- `pnpm build` – úspěch; produkční build vytvořil `/`, `/host` i `/admin`.
- `pnpm dev --hostname 127.0.0.1 --port 3001` a HTTP požadavky na `/` a `/host` – úspěch, obě adresy odpověděly HTTP 200.

#### Návrh ručního testování dokončené fáze

1. V kořeni projektu spusťte `pnpm dev` a otevřete `/` a `/host`.
2. Při šířkách přibližně 360, 768 a 1440 px zkontrolujte teplé pozadí, úzký středový sloupec, velká jména, starorůžový ampersand, motiv prstenů a tenký oddělovač.
3. Ověřte text „21. září 2026“, „ve 12:00“ a „u kostela sv. Antonína Velikého v Liberci“, včetně správné české diakritiky.
4. Klávesou Tab přejděte na případné ovládací prvky na budoucích stránkách a ověřte viditelný focus; pozvánka samotná nevkládá žádný funkční formulář.
5. V nástrojích prohlížeče dočasně blokujte síťová načítání fontů a obnovte stránku.

#### Očekávaný výsledek ručního testu

Obě stránky zobrazí stejnou čitelnou pozvánku bez ořezu či horizontálního posunu, s vlastními dekoracemi a skutečným českým textem. Na malém displeji se řádky přirozeně zalomí. I při blokování externích fontů zůstane sazba funkční díky systémovým fallbackům. Pod pozvánkou se zobrazí pouze jasně označený nefunkční placeholder příslušné následující fáze.

### Poznámky pro následující fázi

Fáze 05 má vložit skutečný přihlašovací formulář do existující karty na `/` a využít `Card`, `FieldLabel`, `PrimaryButton` a `StatusMessage`; nemá měnit text ani strukturu `InvitationSection`.

#### Dodatečná oprava po vizuálním testu

- 2026-07-31 – Na zúženém viewportu se po skrytí responsivního `<br>` spojila slova „obřad, který“ a „Velikého v“. Příčina: zalomení samo nenese znak mezery. Oprava: do `components/invitation.tsx` byla vložena explicitní mezera za obě zalomení; text je správný při zobrazeném i skrytém zalomení.

### Fáze 05 – Veřejná úvodní stránka

- Datum dokončení: 2026-08-02
- Stav: Dokončeno

#### Stručný popis provedených změn

Veřejná stránka `/` nyní obsahuje dokončenou přihlašovací kartu podle reference se skutečnými popisky, e-mailem, svatebním kódem a širokým primárním tlačítkem. Pozvánka zůstala jedinou sdílenou komponentou; její vysvětlení doplňuje registraci účasti, počet osob a dětí, přespání, odvoz i dietární omezení. Formulář provádí klientskou validaci pomocí existujícího sdíleného schématu, nabízí konkrétní chyby polí, stav odesílání, obecnou chybu i úspěch. V developmentu dočasný handler pouze zobrazí informaci, že funkce bude aktivována v další fázi; neposílá data, nevytváří token ani netvrdí, že magic link odešel. Přibylo také jemné zápatí.

#### Důležité vytvořené nebo změněné soubory

- `components/login-form.tsx` – klientský přihlašovací formulář, přístupné chybové stavy a výslovně dočasný handler bez síťového požadavku
- `app/page.tsx` – hotový veřejný layout, přihlašovací karta a zápatí
- `components/invitation.tsx` – rozšířené vysvětlení procesu RSVP při zachování sdílené pozvánky
- `app/globals.css` – vzhled podtržených polí, chyb, odesílání, přihlašovací karty a zápatí podle reference
- `docs/POSTUP.md` – tento pravdivý záznam fáze 05

#### Zásadní technická rozhodnutí

- Rozhodnutí: Klientská validace používá přímo `magicLinkRequestSchema` ze sdílené doménové vrstvy.
- Důvod: E-mail se normalizuje a obě pole se kontrolují stejnými limity a českými zprávami jako budoucí serverová žádost.
- Dopad na další fáze: Fáze 06 může nahradit jen dočasný handler skutečným Route Handlerem bez změny formulářového kontraktu.
- Rozhodnutí: Dočasný handler nevolá žádné API a v developmentu explicitně říká, že magic link nebyl vytvořen ani odeslán.
- Důvod: Fáze 05 nesmí napodobovat ani předbíhat autentifikaci.
- Dopad na další fáze: Serverové ověření svatebního kódu, tvorba tokenu a doručení zůstávají výhradně ve fázi 06.

#### Známá omezení nebo nedodělky

- Svatební kód se v této fázi neověřuje na serveru a formulář nevytváří, neodesílá ani nezobrazuje magic link.
- Session, přesměrování a autorizace nejsou součástí této fáze.

#### Chyby, které se objevily

- Chyba: První pokus o spuštění lokálního vývojového serveru skončil chybou `EPERM` při otevření portu `127.0.0.1:3000`.
- Příčina: Sandbox omezuje síťové naslouchání.
- Způsob opravy: Vývojový server a následné lokální HTTP ověření byly spuštěny s povoleným lokálním síťovým přístupem.
- Zůstává nějaké riziko: Ne; `/` odpovědělo HTTP 200 a obsahovalo očekávané prvky formuláře.

#### Provedené automatické kontroly

- `pnpm lint` – úspěch.
- `pnpm typecheck` – úspěch.
- `pnpm test` – úspěch: 10 testů prošlo, 1 databázový test byl očekávaně přeskočen bez explicitního `.env.test`.
- `pnpm dev --hostname 127.0.0.1 --port 3000` a lokální HTTP požadavek na `/` – úspěch; server nastartoval a stránka odpověděla HTTP 200 s nadpisem, formulářem a svatebním kódem.

#### Návrh ručního testování dokončené fáze

1. V kořeni projektu spusťte `pnpm dev` a otevřete `/` v šířkách přibližně 360, 768 a 1440 px.
2. Porovnejte úzký středový sloupec, kartu s podtrženými poli, široké starorůžové tlačítko a nenápadné zápatí s `docs/reference/uvodni_stranka.png`.
3. Odešlete prázdný formulář, pak zadejte neplatný e-mail a nakonec prázdný nebo více než 128 znaků dlouhý svatební kód.
4. Zadejte platný e-mail a neprázdný kód, odešlete formulář a ověřte stav tlačítka během zpracování i následné informační sdělení.
5. Pomocí klávesy Tab, Shift+Tab, Enter a pouze klávesnice projděte celý formulář; zkontrolujte viditelný focus a vazbu chyb na příslušná pole.
6. V prohlížeči ověřte, že e-mail nabízí vhodný autofill, kód se po napsání maskuje a po odeslání se v adrese neobjeví ani e-mail, ani svatební kód.

#### Očekávaný výsledek ručního testu

Stránka je čitelná bez vodorovného posunu, odpovídá atmosférou referenci a používá skutečné formulářové prvky. Neplatná data zobrazí české chyby přímo u polí; platná data krátce zobrazí odesílání a v developmentu následně přesně sdělení, že funkce bude aktivována v další fázi a magic link nebyl vytvořen ani odeslán. Formulář je ovladatelný z klávesnice a tajný kód se nepřenáší do URL.

#### Poznámky pro následující fázi

Fáze 06 má nahradit pouze `handleTemporaryLoginRequest` v `components/login-form.tsx` skutečným bezpečným HTTP tokem. Musí zachovat obecnou odpověď vůči existenci e-mailu a nesmí vracet či zobrazit magic link v produkčním režimu.

### Fáze 06 – Žádost o magic link

- Datum dokončení: 2026-08-02
- Stav: Dokončeno

#### Stručný popis provedených změn

Veřejný formulář nyní volá `POST /api/auth/magic-link`. Server znovu ověřuje oba vstupy, porovnává společný kód v konstantním čase, generuje 32bajtový kryptografický token s konfigurací řízenou krátkou platností a přes repozitář uloží jen jeho SHA-256 otisk. Úspěšná odpověď je obecná. V developmentu se odkaz vypíše do serverového výstupu a pouze při `ENABLE_DEV_MAGIC_LINK=true` se vrátí jako klikací odkaz; produkční adaptér zatím nic nedoručuje ani neodhaluje token.

#### Důležité vytvořené nebo změněné soubory

- `lib/auth/magic-links.ts` – serverová validace, bezpečné porovnání kódu, náhodný token, absolutní odkaz a vyměnitelný doručovací adaptér
- `app/api/auth/magic-link/route.ts` – necachovaný HTTP endpoint s obecnými chybovými odpověďmi
- `components/login-form.tsx` – skutečné odeslání formuláře, serverové chybové stavy a podmíněný vývojový odkaz
- `app/globals.css` – nenápadný vzhled vývojového odkazu
- `tests/magic-links.test.ts` – testy správného a špatného kódu, validace e-mailu, opakované žádosti, development doručení a zákazu úniku tokenu mimo development
- `README.md` – aktuální stav projektu a postup pro lokální testování magic linku
- `docs/POSTUP.md` – tento pravdivý záznam fáze 06

#### Zásadní technická rozhodnutí

- Rozhodnutí: Porovnání společného kódu probíhá nad SHA-256 otisky pomocí `timingSafeEqual`.
- Důvod: Přímé porovnání řetězců by mohlo odhalovat rozdíly v čase zpracování; svatební kód se přitom nikam neloguje ani neukládá.
- Dopad na další fáze: Ověřovací route může důvěřovat tomu, že tokenový repozitář již obsahuje jen bezpečný otisk a normalizovaný e-mail.
- Rozhodnutí: Vývojový odkaz je do odpovědi vložen pouze při současném splnění `NODE_ENV=development` a `ENABLE_DEV_MAGIC_LINK=true`.
- Důvod: Přepínač prostředí sám nesmí umožnit únik tokenu z produkce.
- Dopad na další fáze: Budoucí SMTP adaptér nahradí produkční no-op větev, aniž by se měnil HTTP kontrakt.
- Rozhodnutí: Vývojový odkaz se v developmentu vypisuje do serverového logu, protože to výslovně vyžaduje fáze 06; produkce jej neloguje.
- Důvod: Zadání zároveň zmiňuje výpis odkazu a nepřítomnost čitelného tokenu v logu. Zvolený nejmenší bezpečný výklad omezuje výpis na explicitně lokální vývoj.
- Dopad na další fáze: Produkční logovací pravidla zůstávají bez čitelných tokenů; lokální výpis má být považován za citlivý vývojový údaj.

#### Známá omezení nebo nedodělky

- Route `/auth/verify`, jednorázové spotřebování tokenu, session, přesměrování a odhlášení záměrně patří do fáze 07; nyní vytvořený odkaz proto ještě nevede na hotovou stránku.
- Produkční SMTP doručení není součástí této fáze. Produkční adaptér token nevrací ani neloguje, ale e-mail zatím fyzicky neodesílá.

#### Chyby, které se objevily

- Chyba: První typová kontrola odmítla testovací náhradu tokenového repozitáře, protože vracela `void` místo konkrétního dokumentu.
- Příčina: Serverová služba byla zbytečně vázaná na přesný návratový typ repozitáře, přestože výsledek zápisu nepotřebuje.
- Způsob opravy: Závislost nyní vyžaduje pouze metodu zápisu s výsledkem typu `unknown`, což zachovává kompatibilitu s produkčním repozitářem i jednotkovým testem.
- Zůstává nějaké riziko: Ne.
- Chyba: Sandbox při prvním startu vývojového serveru odmítl otevření portu `127.0.0.1:3001` (`EPERM`).
- Příčina: Omezení sandboxu pro lokální naslouchání.
- Způsob opravy: Start byl ověřen s povoleným lokálním síťovým přístupem.
- Zůstává nějaké riziko: Ne; server ohlásil stav `Ready` bez nové kritické chyby.

#### Provedené automatické kontroly

- `pnpm typecheck` – úspěch.
- `pnpm lint` – úspěch.
- `pnpm test` – úspěch: 15 testů prošlo, 1 izolovaný databázový test byl očekávaně přeskočen bez `.env.test`.
- `pnpm build` – úspěch; sestavení obsahuje dynamickou route `/api/auth/magic-link`.
- `pnpm dev --hostname 127.0.0.1 --port 3001` – úspěch po povolení lokálního síťového přístupu; server ohlásil `Ready`.

#### Návrh ručního testování dokončené fáze

1. Do necommitovaného `.env.local` nastavte běžící lokální MongoDB, platný `WEDDING_CODE`, `APP_URL=http://localhost:3000` a `ENABLE_DEV_MAGIC_LINK=true`; jednorázově spusťte `pnpm db:indexes`.
2. Spusťte `pnpm dev` a na `/` odešlete platný e-mail se špatným kódem.
3. Ověřte, že se zobrazí chyba u kódu a v kolekci `loginTokens` nepřibude dokument.
4. Odešlete stejný e-mail se správným kódem. Ověřte obecnou úspěšnou zprávu, klikací vývojový odkaz a stejný odkaz v serverovém výstupu.
5. V databázi zkontrolujte, že dokument obsahuje `tokenHash`, normalizovaný e-mail, `createdAt` a `expiresAt`, ale ne čitelné pole `token`.
6. Nastavte `ENABLE_DEV_MAGIC_LINK=false`, restartujte development server, odešlete správný kód a ověřte, že úspěšná odpověď klikací odkaz neobsahuje.
7. Spusťte `pnpm test`.

#### Očekávaný výsledek ručního testu

Špatný kód token nevytvoří. Správný kód vždy vytvoří nový token s patnáctiminutovou platností a obecnou úspěšnou zprávou, aniž by prozradil existenci účtu. Databáze obsahuje pouze otisk tokenu. Klikací odkaz je dostupný jen při explicitním development přepínači; bez něj ani v produkci se token klientovi nevrátí. Dokud nebude dokončena fáze 07, otevření odkazu ještě neprovede přihlášení.

#### Poznámky pro následující fázi

Fáze 07 má implementovat `/auth/verify`, předat token z query parametru repozitáři `consumeValidToken`, vytvořit session a bezpečně přesměrovat podle serverově určené role. Nesmí oslabit podmínky, za kterých endpoint fáze 06 vrací vývojový odkaz.

### Fáze 07 – Ověření, session, role a odhlášení

- Datum dokončení: 2026-08-07
- Stav: Dokončeno

#### Stručný popis provedených změn

Route `GET /auth/verify` nyní načte token z magic linku, jedním atomickým dotazem ho spotřebuje a při úspěchu vytvoří náhodnou session. Databáze dál obsahuje pouze otisk session; čitelná hodnota se ukládá pouze do HTTP-only cookie. Chybějící, neplatný, použitý i expirovaný token se stejným bezpečným způsobem vrací na úvodní stránku bez session. Role se při vytvoření i každém načtení session odvozuje z normalizovaného e-mailu na serveru. Serverové stránky `/host` a `/admin` přesměrují nepřihlášené na `/` a uživatele s opačnou rolí na správnou chráněnou adresu. Obě dočasné stránky zobrazují přihlášený e-mail a funkční odhlášení.

#### Důležité vytvořené nebo změněné soubory

- `app/auth/verify/route.ts` – necachovaný callback magic linku, vytvoření cookie a bezpečná přesměrování
- `app/api/auth/logout/route.ts` – zneplatnění session v databázi, odstranění cookie a návrat na `/`
- `lib/auth/session-flow.ts` – čistá testovatelná logika spotřeby tokenu, role, přesměrování a zneplatnění session
- `lib/auth/sessions.ts` – serverový helper pro načtení aktuální session z cookie a databáze
- `lib/auth/session-cookie.ts` – jednotné bezpečné atributy session cookie pro vytvoření i smazání
- `app/host/page.tsx`, `app/admin/page.tsx` – serverové route guards a dočasné přihlášené rozhraní
- `components/user-bar.tsx`, `app/globals.css` – uživatelská lišta s e-mailem a odhlášením ve stávajícím vizuálním stylu
- `app/page.tsx` – bezpečné sdělení o neplatném nebo nepodařeném ověření odkazu
- `tests/sessions.test.ts` – testy role, přesměrování, jednorázového a expirovaného tokenu, odhlášení a cookie
- `README.md` – aktuální lokální postup pro ověření odkazu, chráněné stránky a odhlášení
- `docs/POSTUP.md` – tento pravdivý záznam fáze 07

#### Zásadní technická rozhodnutí

- Rozhodnutí: Magic link se spotřebuje před vytvořením session.
- Důvod: `consumeValidToken` je atomický; dva souběžné požadavky proto nemohou vytvořit dvě session z téhož odkazu.
- Dopad na další fáze: Když po spotřebování selže zápis session, odkaz se z bezpečnostních důvodů neobnoví a uživatel si vyžádá nový.
- Rozhodnutí: Autoritativní role se při každém načtení session počítá z normalizovaného e-mailu, ne z klienta ani jen z uloženého pole `role`.
- Důvod: Pevný seznam správců zůstává jediným zdrojem oprávnění a databázové pole nemůže rozšířit klientské oprávnění.
- Dopad na další fáze: Každý nový chráněný Route Handler musí před čtením či zápisem použít `getCurrentSession()` a serverovou kontrolu očekávané role.
- Rozhodnutí: Cookie používá `HttpOnly`, `SameSite=Lax`, cestu `/` a v produkci `Secure`; její smazání používá stejnou politiku pro dané prostředí.
- Důvod: Cookie není dostupná běžnému JavaScriptu, omezuje CSRF při běžné navigaci a funguje i přes lokální HTTP development.
- Dopad na další fáze: API pro RSVP musí identitu vlastníka vždy převzít z této session, nikdy z těla požadavku.

#### Známá omezení nebo nedodělky

- Formulář RSVP, jeho API a administrátorská data záměrně nejsou součástí této fáze.
- Produkční SMTP doručení magic linku zůstává záměrně neimplementované; produkční větev token nevrací ani neloguje.

#### Chyby, které se objevily

- Chyba: Jednotkový test při prvním pokusu nemohl importovat `next/headers` v samostatném Node test runneru.
- Příčina: Testovatelná doménová logika byla smíchaná se serverovým Next.js čtením cookie.
- Způsob opravy: Čistá logika je v `lib/auth/session-flow.ts`; `lib/auth/sessions.ts` nyní obsahuje pouze Next.js adaptér pro cookie a repozitář.
- Zůstává nějaké riziko: Ne; TypeScript, lint, testy i produkční build prošly.

#### Provedené automatické kontroly

- `pnpm typecheck` – úspěch.
- `pnpm lint` – úspěch.
- `pnpm test` – úspěch: 20 testů prošlo, 1 databázový test byl očekávaně přeskočen bez integračního přepínače.
- `pnpm test:db` – úspěch nad izolovanou databází z `.env.test`; testovací databáze byla po testu smazána.
- `pnpm build` – úspěch; sestavení obsahuje dynamické routes `/auth/verify`, `/api/auth/logout`, `/host` a `/admin`.
- `pnpm dev --hostname 127.0.0.1 --port 3002` a lokální HTTP požadavky – úspěch; `/` odpověděla HTTP 200 a nepřihlášený vstup na `/host` HTTP 307 s `location: /`.

#### Návrh ručního testování dokončené fáze

1. Do necommitovaného `.env.local` nastavte běžící MongoDB, platný `WEDDING_CODE`, `APP_URL=http://localhost:3000` a `ENABLE_DEV_MAGIC_LINK=true`; jednorázově spusťte `pnpm db:indexes`.
2. Spusťte `pnpm dev`, na `/` vyžádejte link pro běžný e-mail a otevřete vývojový odkaz.
3. Ověřte přesměrování na `/host`, zobrazení stejného normalizovaného e-mailu a v DevTools v úložišti cookies ověřte, že `svatebni_session` má `HttpOnly`, `SameSite=Lax` a není dostupná z běžného JavaScriptu.
4. Otevřete stejný odkaz podruhé a ověřte návrat na `/` s obecnou zprávou o neplatném, použitém nebo expirovaném odkazu.
5. Vyžádejte odkaz postupně pro `svatebniwa+anna@gmail.com` a `svatebniwa+petr@gmail.com`; každý musí vést na `/admin`.
6. Jako host ručně otevřete `/admin` a jako správce `/host`; vždy ověřte přesměrování na příslušnou správnou chráněnou stránku.
7. Klikněte na `Odhlásit se`, pak ručně otevřete `/host` nebo `/admin` a ověřte návrat na `/`.
8. Spusťte `pnpm test` a volitelně při připravené izolované `.env.test` také `pnpm test:db`.

#### Očekávaný výsledek ručního testu

Platný magic link vytvoří právě jednu session a přesměruje uživatele podle role. Starý, neplatný nebo expirovaný link nikdy nevytvoří session ani neprozradí důvod odmítnutí. Chráněné stránky nelze obejít zadáním URL, e-mail a odhlášení jsou viditelné pouze po přihlášení a odhlášení smaže databázovou session i cookie. Automatické testy skončí úspěšně.

#### Poznámky pro následující fázi

Fáze 08 může nahradit placeholder `/host` RSVP formulářem, ale musí zachovat serverový guard a odvozovat vlastníka budoucích dat výhradně z `getCurrentSession()`. Do `/admin` zatím nepřidávat data ani formulář; patří do pozdějších fází.

#### Dodatečná úprava datového modelu

- 2026-08-12 – Pole `sessions.role` bylo odstraněno z TypeScript dokumentu, session repozitáře, vytváření session a integračních testů. Následně bylo `$unset` odstraněno také ze čtyř tehdy existujících dokumentů lokální databáze; následná kontrola potvrdila nula dokumentů s tímto polem.
- Důvod: Role je jediným zdrojem pravdy serverové funkce `roleForEmail()` nad normalizovaným e-mailem a pevným seznamem správců. Ukládání druhého, neautoritativního snapshotu nepřinášelo žádnou potřebnou funkci v navazujících fázích 08–14.
- Dopad: Session obsahují pouze hash tokenu, normalizovaný e-mail a časy. `getCurrentSession()` vrací odvozenou roli pro autorizaci, ale databáze ji neperzistuje. Stávající snapshot `backups/mongodb-snapshot-2026-08-12T120000` byl vytvořen před změnou a umožňuje návrat ke starším dokumentům se snapshotem role.

### Fáze 08 – Formulář hosta – UI

- Datum dokončení: 2026-08-12
- Stav: Dokončeno

#### Stručný popis provedených změn

Chráněná stránka `/host` nyní zachovává serverový guard, sdílenou pozvánku i odhlášení a doplňuje je o kompletní lokální RSVP formulář. Formulář začíná jednou osobou, bezpečně pracuje se stabilními identifikátory při přidání a odebrání a vždy ponechá alespoň jednu osobu. Každá osoba obsahuje jméno, příjmení, typ, přespání, odvoz, podmíněný cíl odvozu, dietu, podmíněné upřesnění jiné diety a volitelnou poznámku; samostatně je dostupná volitelná společná zpráva. Klientská validace používá sdílené Zod schéma a chyby zobrazí přímo u příslušných polí. Odeslání je pouze simulované, blokuje dvojí kliknutí a po úspěšné validaci pravdivě hlásí, že formulář je připraven k uložení v další fázi.

#### Důležité vytvořené nebo změněné soubory

- `app/host/page.tsx` – nahradil placeholder za formulář při zachování serverové ochrany a sdílených částí stránky
- `components/host-rsvp-form.tsx` – přístupný dynamický hostovský formulář s lokálním stavem, podmíněnými poli a simulačním stavem odeslání
- `components/host-rsvp-form-state.ts` – čistá řídicí logika návrhu, stabilních identifikátorů, seznamu osob a převodu chyb validace
- `app/globals.css` – vzhled hostovského layoutu, informační lišty, karet osob, voleb a responzivní rozložení formuláře
- `tests/host-rsvp-form.test.ts` – testy přidání/odebrání, podmíněných polí a chyb klientské validace formuláře
- `docs/POSTUP.md` – tento pravdivý záznam fáze 08

#### Zásadní technická rozhodnutí

- Rozhodnutí: Formulář ve fázi 08 používá čistě lokální stav a nevolá RSVP API.
- Důvod: Uložení i načtení MongoDB výslovně patří až do fáze 09.
- Dopad na další fáze: Fáze 09 nahradí simulované potvrzení načtením a uložením přes autorizovaný serverový endpoint, aniž by měnila strukturu hodnot nebo sdílené schéma.
- Rozhodnutí: Osoby dostávají při vytvoření `crypto.randomUUID()` a formulář je v Reactu klíčován tímto ID.
- Důvod: Odebrání prostřední osoby nesmí přehodit rozepsané hodnoty ostatních osob.
- Dopad na další fáze: Uložené osoby mají nadále používat totéž stabilní ID.
- Rozhodnutí: Testy pokrývají řídicí logiku formulářové komponenty bez nové DOM testovací závislosti.
- Důvod: Stávající Node test runner nemá DOM prostředí; čistá logika je současně přímo použitá komponentou a rychle ověřitelná.
- Dopad na další fáze: Pokud bude později zavedeno E2E prostředí, má doplnit interakci přes skutečný prohlížeč, nikoli nahradit tyto rychlé testy.

#### Známá omezení nebo nedodělky

- Formulář zatím nenačítá ani neukládá odpověď do MongoDB a neobsahuje serverové chyby, konflikty ani stav načítání; patří do fáze 09.
- Simulované odeslání pouze ověří vstup a zobrazí vývojové potvrzení. Nevytváří žádná data ani nenaznačuje jejich uložení.

#### Chyby, které se objevily

- Chyba: První běh nového testu nemohl v samostatném Node runneru vyřešit alias `@/lib`.
- Příčina: Alias Next.js není nakonfigurovaný pro přímé spuštění Node testů.
- Způsob opravy: Čistá řídicí logika formuláře používá pro sdílené schéma a typy relativní importy s příponou `.ts`, stejně jako existující testovatelná doménová vrstva.
- Zůstává nějaké riziko: Ne; typová kontrola, lint, testy i produkční build po opravě prošly.

#### Provedené automatické kontroly

- `pnpm typecheck` – úspěch.
- `pnpm lint` – úspěch.
- `pnpm test` – úspěch: 23 testů prošlo, 1 databázový test byl očekávaně přeskočen bez integračního přepínače.
- `pnpm build` – úspěch; produkční sestavení obsahuje dynamickou chráněnou route `/host`.
- `pnpm dev --hostname 127.0.0.1 --port 3003` – úspěch; vývojový server nastartoval a ohlásil stav `Ready` bez nové kritické chyby.

#### Návrh ručního testování dokončené fáze

1. Přihlaste se jako běžný host a otevřete `/host`; ověřte pozvánku, e-mail v informační liště a odhlášení.
2. Zkontrolujte nadpis „Vaše odpověď“, vysvětlení a termín `1. 8. 2026`.
3. Vyplňte první osobu, přidejte tři osoby, vyplňte každé jiné jméno, odeberte prostřední a ověřte, že hodnoty zbývajících osob zůstaly správně přiřazené.
4. U osoby zvolte „Ano, potřebuji odvoz“, ověřte zobrazení cíle, potom volbu zrušte a ověřte, že skryté pole nezpůsobuje chybu.
5. Zvolte dietu „Jiná“, ověřte zobrazení upřesnění a při prázdném upřesnění odešlete formulář.
6. Zkuste odstranit poslední zbývající osobu; tlačítko pro odebrání se nesmí zobrazit.
7. Odešlete neplatný formulář a ověřte české chyby u polí. Poté doplňte povinné údaje a odešlete platný formulář; během krátké kontroly znovu klikněte na tlačítko.
8. Ověřte layout přibližně na 360, 768 a 1440 px a spusťte `pnpm test`.

#### Očekávaný výsledek ručního testu

Pozvánka, přihlášený e-mail a odhlášení jsou viditelné. Formulář je čitelný a ovladatelný na mobilu, tabletu i desktopu bez horizontálního posunu stránky. Podmíněná pole se zobrazují jen pro odpovídající volbu, hodnoty osob se při změně seznamu nezamění, poslední osoba nelze odstranit a chyby jsou srozumitelně propojené s poli. Platné odeslání zablokuje dvojí kliknutí a skončí pouze hlášením „Formulář je připraven k uložení v další fázi“; žádná data se zatím neukládají. Testy skončí úspěšně.

#### Poznámky pro následující fázi

Fáze 09 musí zachovat klientskou strukturu a stabilní ID osob, přidat autorizované načtení a uložení vlastní RSVP odpovědi a nahradit simulované potvrzení pravdivými loading, success a error stavy. Vlastník odpovědi se musí vždy odvozovat výhradně ze serverové session.

### Fáze 09 – Uložení a načtení RSVP

- Datum dokončení: 2026-08-12
- Stav: Dokončeno

#### Stručný popis provedených změn

Hostovský formulář nyní přes zabezpečené `GET`/`PUT /api/rsvp` načítá a ukládá pouze odpověď aktuálního běžného hosta. Vlastník se bere výhradně ze serverové session, celý payload znovu validuje striktní sdílené schéma a neznámá pole včetně podvrženého `ownerEmail` jsou odmítnuta. Formulář ukazuje načítání, předvyplnění nebo prázdnou osobu, potvrzení s českým časem uložení, chybu s opakováním a bezpečný návrat na přihlášení při vypršení session bez ztráty rozepsaných hodnot.

#### Důležité vytvořené nebo změněné soubory

- `app/api/rsvp/route.ts` – necachovatelné autorizované načtení a uložení, admina výslovně odmítá
- `lib/rsvp/host-rsvp.ts` – testovatelná kontrola role, validace, vlastnictví a serializace
- `components/host-rsvp-form.tsx` a `components/host-rsvp-form-state.ts` – připojení formuláře, stavy a převod uložených dat na návrh
- `app/globals.css` – vzhled loadingu a obnovy po chybě
- `tests/host-rsvp-api.test.ts` – integrační testy vytvoření, aktualizace, izolace vlastníků, podvržení e-mailu, neplatných dat, nepřihlášení a admina
- `docs/POSTUP.md` – tento pravdivý záznam fáze 09

#### Zásadní technická rozhodnutí

- Rozhodnutí: `ownerEmail` se odmítá jako neznámé pole.
- Důvod: Vlastníka nikdy nesmí určovat klient a striktní validace bezpečně odmítne i další neznámá data.
- Dopad na další fáze: Admin data budou mít samostatné read-only rozhraní; `/api/rsvp` zůstává jen pro hosta.

#### Známá omezení nebo nedodělky

- Admin read model, souhrny a dashboard patří do fází 10 a 11. Historie změn a řešení souběžné editace jsou mimo rozsah této fáze.

#### Chyby, které se objevily

- Chyba: Lint vyžadoval asynchronní zahájení načítání a `Link` pro interní navigaci.
- Způsob opravy: Počáteční fetch se plánuje microtaskem a přihlášení používá `next/link`.

#### Provedené automatické kontroly

- `pnpm typecheck`, `pnpm lint`, `pnpm test`, `pnpm test:db` a `pnpm build` – úspěch při původním provedení fáze; po opětovném aplikování budou spuštěny znovu.

#### Návrh ručního testování dokončené fáze

1. Přihlaste nového hosta, vyplňte dvě osoby a uložte odpověď.
2. Obnovte stránku a po novém přihlášení stejným e-mailem ověřte předvyplnění.
3. Přihlaste jiný e-mail a ověřte samostatný prázdný formulář.
4. Do JSON požadavku přidejte cizí `ownerEmail`; route musí odmítnout změnu.
5. Jako admin zkuste `/host` a `/api/rsvp`; admin nesmí RSVP měnit.

#### Očekávaný výsledek ručního testu

Každý host uvidí jen svou odpověď, podvržený vlastník se nepoužije, admin route nemůže použít a chybové stavy nemažou formulář.

#### Poznámky pro následující fázi

Fáze 10 může stavět read-only administrativní data nad `RsvpRepository.getAdminOverview` bez přidání admin mutací RSVP.
