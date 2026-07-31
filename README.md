# Svatební web Anna & Petr

Projekt obsahuje fázi 03: vedle validované konfigurace a RSVP kontraktů má MongoDB datovou vrstvu pro magic-link tokeny, session a RSVP odpovědi. HTTP přihlášení a formulářové uživatelské rozhraní budou doplněny v navazujících fázích.

## Požadavky

- Node.js 24.14.0 nebo novější kompatibilní LTS verze
- pnpm 11.9.0
- Lokálně spuštěná MongoDB (pro databázové příkazy a integrační testy)

## Instalace a spuštění

1. Zkopírujte `.env.example` do necommitovaného souboru `.env.local` a vyplňte všechny povinné hodnoty včetně `MONGODB_URI` a `MONGODB_DB_NAME`. Konfigurace se ověří při prvním serverovém použití; hodnoty z `.env.local` se nesmí commitovat.
2. Nainstalujte závislosti příkazem `pnpm install`.
3. Spusťte vývojový server příkazem `pnpm dev`.
4. Otevřete [http://localhost:3000](http://localhost:3000), [http://localhost:3000/host](http://localhost:3000/host) a [http://localhost:3000/admin](http://localhost:3000/admin).

## Kontroly kvality

```bash
pnpm lint
pnpm typecheck
pnpm test
pnpm build
```

Dokumentace implementace je v adresáři `docs/`.

## MongoDB

Po spuštění lokální MongoDB vytvořte požadované indexy jednorázově (příkaz lze bezpečně opakovat):

```bash
pnpm db:indexes
```

Vzniknou unikátní indexy otisků magic-link tokenů a session, TTL indexy jejich expirace a unikátní index `rsvps.ownerEmail`. Databáze obsahuje pouze SHA-256 otisky tokenů a session, nikdy jejich čitelnou hodnotu.

### Izolované databázové testy

Databázové testy nikdy nepoužívají `MONGODB_URI` ani `MONGODB_DB_NAME` z `.env.local`. Zkopírujte `.env.test.example` do necommitovaného `.env.test`, nastavte samostatný název databáze končící `_test` a spusťte:

```bash
pnpm test:db
```

Test před spuštěním odmítne chybějící konfiguraci i název, který nekončí `_test`. Testovací databázi před testem a po testu smaže; nepoužívejte proto název databáze s důležitými daty. Běžný `pnpm test` databázový test pouze bezpečně přeskočí.
