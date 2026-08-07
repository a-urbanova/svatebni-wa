# POSTUP – skutečný průběh implementace

Tento soubor je pracovní deník. Agent jej aktualizuje po každé dokončené fázi. Nemá obsahovat domněnky vydávané za hotovou práci.

## Stav projektu

- Aktuální fáze: 06 dokončena
- Poslední dokončená fáze: 06 – Žádost o magic link
- Poslední aktualizace: 2026-08-02
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




