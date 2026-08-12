# Svatební web Anna & Petr

Projekt obsahuje fázi 07: magic link se na serveru atomicky spotřebuje, vytvoří se session v HTTP-only cookie a uživatel je podle serverově určené role přesměrován na `/host` nebo `/admin`. Chráněné stránky ověřují session na serveru a obsahují odhlášení.

## Požadavky

- Node.js 24.14.0 nebo novější kompatibilní LTS verze
- pnpm 11.9.0
- Lokálně spuštěná MongoDB (pro databázové příkazy a integrační testy)

## Instalace a spuštění

1. Zkopírujte `.env.example` do necommitovaného souboru `.env.local` a vyplňte všechny povinné hodnoty včetně `MONGODB_URI` a `MONGODB_DB_NAME`. Konfigurace se ověří při prvním serverovém použití; hodnoty z `.env.local` se nesmí commitovat.
2. Nainstalujte závislosti příkazem `pnpm install`.
3. Spusťte vývojový server příkazem `pnpm dev`.
4. Otevřete [http://localhost:3000](http://localhost:3000). Adresy `/host` a `/admin` bez platné session přesměrují zpět na úvodní stránku.

### Lokální magic link

Pro lokální klikací odkaz nastavte v `.env.local` `ENABLE_DEV_MAGIC_LINK=true` a spusťte aplikaci přes `pnpm dev`. Jen v režimu development se po správném kódu zobrazí klikací odkaz a současně se vypíše do serverového výstupu. Otevření platného odkazu ho právě jednou spotřebuje, vytvoří sedmidenní session (podle `SESSION_TTL_DAYS`) a přesměruje běžný e-mail na `/host`; dvě adresy definované v zadání přesměruje na `/admin`. Odkaz použitý podruhé nebo po expiraci se bezpečně vrátí na úvodní stránku s obecnou zprávou. V produkčním režimu se magic link nikdy nevrací klientovi ani nezapisuje do logu; současný produkční doručovací adaptér je připravené místo pro budoucí SMTP implementaci.

Session cookie má atributy `HttpOnly`, `SameSite=Lax` a cestu `/`; atribut `Secure` se zapne pouze v produkci. Na `/host` i `/admin` je k dispozici odhlášení, které odstraní session z databáze i cookie. Role je při každém serverovém načtení znovu určena z normalizovaného e-mailu.

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
