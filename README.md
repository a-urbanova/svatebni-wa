# Svatební web Anna & Petr

Projekt je nyní ve fázi 02: vedle spustitelné kostry obsahuje validovanou serverovou konfiguraci, RSVP datové kontrakty a jejich jednotkové testy. Přihlašování, databáze i RSVP formulář budou doplněny v navazujících fázích.

## Požadavky

- Node.js 24.14.0 nebo novější kompatibilní LTS verze
- pnpm 11.9.0

## Instalace a spuštění

1. Zkopírujte `.env.example` do necommitovaného souboru `.env.local` a vyplňte všechny povinné hodnoty. Konfigurace se ověří při prvním serverovém použití; hodnoty z `.env.local` se nesmí commitovat.
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
