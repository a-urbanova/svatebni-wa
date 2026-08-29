# Svatební web Anna & Petr

Lokálně spustitelný RSVP prototyp pro svatbu Anny a Petra. Host se přihlásí jednorázovým magic linkem a uloží svou odpověď; správce má výhradně čtecí přehled všech odpovědí.

## Požadavky

- Node.js 24.14.0 nebo novější kompatibilní LTS verze
- pnpm 11.9.0
- lokálně spuštěná MongoDB dostupná na adrese nastavené v `MONGODB_URI`

Ověřte si instalaci:

```bash
node --version
pnpm --version
```

## První spuštění

1. Naklonujte repozitář a přejděte do jeho adresáře.
2. Nainstalujte přesně uzamčené závislosti:

   ```bash
   pnpm install --frozen-lockfile
   ```

3. Zkopírujte `.env.example` do necommitovaného souboru `.env.local`.
4. Vyplňte nejméně tyto hodnoty; pro bezpečný lokální provoz doporučujeme databázi se jménem končícím `_local`:

   ```dotenv
   MONGODB_URI=mongodb://127.0.0.1:27017
   MONGODB_DB_NAME=svatebni_wa_local
   WEDDING_CODE=lokalni-testovaci-kod
   APP_URL=http://localhost:3000
   MAGIC_LINK_TTL_MINUTES=15
   SESSION_TTL_DAYS=7
   ENABLE_DEV_MAGIC_LINK=true
   ```

   Nikdy necommitujte `.env.local`, skutečný svatební kód ani SMTP heslo. Lokální development magic link není určený pro produkci.

5. Vytvořte indexy (příkaz lze opakovat):

   ```bash
   pnpm db:indexes
   ```

6. Spusťte aplikaci:

   ```bash
   pnpm dev
   ```

   Otevřete [http://localhost:3000](http://localhost:3000).

## Lokální přihlášení magic linkem

V režimu `pnpm dev` s `ENABLE_DEV_MAGIC_LINK=true` vyplňte na úvodní stránce e-mail a `WEDDING_CODE`. Po úspěchu se pod formulářem zobrazí odkaz **Otevřít vývojový magic link** a stejný odkaz je v terminálu vývojového serveru. Odkaz otevřete právě jednou:

- běžný e-mail přesměruje na `/host`,
- `svatebniwa+anna@gmail.com` nebo `svatebniwa+petr@gmail.com` přesměruje na `/admin`.

Vývojový odkaz se po druhém použití nebo po expiraci bezpečně odmítne. Produkční režim vývojový odkaz nikdy nevrací.

## Ukázková data a bezpečný reset

Pro ukázková data používejte oddělenou databázi, například v `.env.local` nastavte `MONGODB_DB_NAME=svatebni_wa_demo`. Pak spusťte:

```bash
pnpm db:seed-demo
```

Vzniknou pouze fiktivní adresy `example.test` a osoby Ada, Filip a Berta Ukázkoví. Skript z bezpečnostních důvodů odmítne název databáze, který nekončí `_demo`.

Chcete-li bezpečně vymazat lokální či ukázkovou databázi, nastavte její název na hodnotu končící `_local` nebo `_demo` a spusťte:

```bash
pnpm db:reset-local
```

Skript smaže celou takto pojmenovanou databázi a znovu vytvoří indexy. Nikdy jej nespouštějte nad databází s reálnými odpověďmi.

## Kontroly kvality

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm test:db
pnpm test:e2e
pnpm build
```

`pnpm test` obsahuje rychlé jednotkové a integrační testy; databázový a e2e test bezpečně přeskočí. Pro `pnpm test:db` a `pnpm test:e2e` vytvořte `.env.test` z `.env.test.example`. Oba příkazy používají výhradně `MONGODB_TEST_URI`; e2e test navíc vytvoří, po testu odstraní a nikdy nesdílí databázi `svatebni_wa_e2e_test`. K běhu musí být lokální MongoDB spuštěná.

`pnpm test:e2e` ověřuje skutečný lokální tok přes vývojový server: development magic link, hosta, uložení a opětné načtení tří osob, oddělení druhého hosta, přístup správce, zákaz adminu pro hosta, použitý i expirovaný odkaz a odhlášení.

## Produkční SMTP

V produkci nastavte `APP_URL` na veřejnou HTTPS adresu, `ENABLE_DEV_MAGIC_LINK=false` a tyto serverové proměnné výhradně v hostingu:

```dotenv
SMTP_HOST=smtp.vas-poskytovatel.cz
SMTP_PORT=587
SMTP_USERNAME=...
SMTP_PASSWORD=...
SMTP_FROM="Anna & Petr <noreply@vasadomena.cz>"
SMTP_SECURE=false
```

Port 587 obvykle používá `SMTP_SECURE=false` (STARTTLS); port 465 používá `SMTP_SECURE=true`. `SMTP_FROM` musí být u poskytovatele ověřený. Produkční odpověď ani log nesmí obsahovat čitelný magic link.

## Časté potíže

- **MongoDB není dostupná:** spusťte službu MongoDB a zkontrolujte `MONGODB_URI`. Chyba připojení není důvod měnit ani mazat existující data.
- **`pnpm test:db` nebo `pnpm test:e2e` odmítne konfiguraci:** vytvořte `.env.test` z `.env.test.example`; používejte samostatnou databázi s názvem končícím `_test`.
- **Vývojový odkaz se nezobrazuje:** ověřte `ENABLE_DEV_MAGIC_LINK=true`, běh přes `pnpm dev` a správný svatební kód. V produkci se odkaz nezobrazuje záměrně.
- **Žádost o link vrací 403:** `APP_URL` musí přesně odpovídat adrese v prohlížeči, včetně protokolu a portu.
- **Šestá rychlá žádost vrací 429:** jde o záměrný limit pěti žádostí za 15 minut na e-mail i IP adresu. Počkejte, změňte testovací e-mail nebo restartujte lokální vývojový server.
- **Chráněná stránka se vrací na úvod:** session chybí, vypršela nebo patří opačné roli; požádejte o nový magic link.

Podrobné rozhodnutí, kontroly a ruční akceptace jsou v [docs/POSTUP.md](docs/POSTUP.md).
