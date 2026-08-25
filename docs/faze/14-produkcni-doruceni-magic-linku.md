# Fáze 14 – Produkční doručení magic linku

## Cíl fáze

Nahradit produkční prázdný doručovací adaptér SMTP odesláním e-mailu, aniž by se magic link dostal do klientské odpovědi nebo produkčních logů.

## Rozsah

- SMTP konfigurace výhradně v serverových proměnných prostředí.
- Textová i HTML podoba jednorázového e-mailu.
- Zachování vývojového odkazu v `NODE_ENV=development`.
- Testy odeslání, normalizovaného příjemce a odmítnutí neúplné SMTP konfigurace.
- Návod pro nastavení poskytovatele a veřejné `APP_URL`.

## Mimo rozsah

- Konkrétní hosting nebo SMTP poskytovatel.
- DNS konfigurace domény a ověřování odesílací domény.
- Hromadné e-mailové kampaně.

## Kontroly

- `pnpm lint`
- `pnpm typecheck`
- `pnpm test`
- `pnpm build`

## Ruční test

1. Do produkčního prostředí nastavte veřejnou HTTPS `APP_URL`, `ENABLE_DEV_MAGIC_LINK=false` a všechny `SMTP_*` proměnné.
2. Vyžádejte magic link běžným e-mailem a ověřte přijetí zprávy, odesílatele, předmět a platnost odkazu.
3. Otevřete odkaz jednou, ověřte přesměrování na `/host`, a otevřete jej podruhé.
4. Ověřte, že produkční HTTP odpověď ani log neobsahují odkaz nebo token.
5. V lokálním developmentu nastavte `ENABLE_DEV_MAGIC_LINK=true` a ověřte, že se místo SMTP použije dosavadní vývojový odkaz.

## Očekávaný výsledek

Příjemce dostane funkční jednorázový magic link e-mailem. Produkční klient a logy token neodhalí, použitý odkaz již nefunguje a vývojový tok zůstává lokálně testovatelný bez SMTP.
