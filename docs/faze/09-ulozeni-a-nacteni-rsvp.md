# Fáze 09 – Uložení a načtení RSVP

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Napojit hostovský formulář na zabezpečenou serverovou datovou vrstvu tak, aby se odpověď ukládala pod e-mailem session a při návratu znovu načetla.

## Předpoklady před začátkem

- Fáze 03, 07 a 08 jsou dokončeny.
- RSVP repozitář je otestovaný.
- Hostovská stránka má kompletní formulář.
- Session helper bezpečně vrací normalizovaný e-mail hosta.

## Konkrétní úkoly

1. Vytvoř serverový read endpoint nebo serverovou akci pro načtení RSVP aktuálního hosta.
2. Vytvoř serverový write endpoint nebo serverovou akci pro upsert celé RSVP odpovědi.
3. Vlastník dat se vždy bere ze session. Ignoruj nebo odmítni klientské `ownerEmail`.
4. Na serveru znovu validuj celý payload a odstraň neznámá pole.
5. Ukládej stabilní identifikátory osob, serverové timestampy a normalizovaná data.
6. Při prvním otevření `/host` načti existující RSVP:
   - zobraz skeleton nebo čitelný loading stav,
   - při neexistující odpovědi zobraz jednu prázdnou osobu,
   - při existující odpovědi předvyplň formulář.
7. Po uložení zobraz jasné české potvrzení a čas posledního uložení.
8. Při chybě zachovej hodnoty ve formuláři a umožni opakování.
9. Zabraň dvojitému souběžnému odeslání z UI.
10. Rozumně řeš zastaralou session během práce: nabídni návrat na přihlášení a nesmaž lokální obsah bez upozornění.
11. Přidej integrační testy:
   - první uložení,
   - aktualizace stejného vlastníka,
   - oddělení dvou uživatelů,
   - pokus podvrhnout e-mail vlastníka,
   - neplatný payload,
   - nepřihlášený požadavek.
12. Zkontroluj, že admin role formulář přes tuto route nemění, pokud je `/host` pro admina zakázán.

## Rozsah této fáze

### Patří do této fáze

- Zabezpečené načtení a upsert RSVP.
- Napojení formuláře.
- Stavy načítání, uložení a chyby.
- Testy vlastnictví dat.

### Nepatří do této fáze

- Admin read model.
- Admin tabulka.
- Pokročilá historie změn.
- Současná editace z více oken s verzováním.

## Kontroly před označením fáze za dokončenou

- Spusť lint.
- Spusť TypeScript kontrolu bez generování výstupu.
- Spusť testy relevantní pro tuto fázi, pokud již v projektu existují.
- Ověř, že vývojový server po změnách nastartuje bez nové kritické chyby.

## Povinný výstup agenta na konci fáze

Ve své závěrečné odpovědi uveď:

1. Stručné vysvětlení provedených změn.
2. Seznam všech důležitých vytvořených nebo změněných souborů a jejich účel.
3. Přehled spuštěných kontrol a jejich výsledek.
4. Známá omezení nebo nedodělky, které jsou záměrně ponechány do další fáze.
5. Přesný návrh ručního testování.
6. Očekávaný výsledek ručního testu.
7. Potvrzení, že byl pravdivě aktualizován `docs/POSTUP.md`.

## Návrh ručního testování

1. Přihlas se jako nový host, vyplň dvě osoby a ulož.
2. Obnov stránku.
3. Odhlas se a přihlas stejným e-mailem.
4. Uprav jednu osobu, přidej odvoz a znovu ulož.
5. Přihlas se jiným e-mailem a ověř prázdný samostatný formulář.
6. Pokus se pomocí vývojářských nástrojů přidat do požadavku cizí `ownerEmail`.
7. Dočasně zastav MongoDB během ukládání a ověř zachování dat a srozumitelnou chybu.
8. Spusť integrační testy.

## Očekávaný výsledek

Uložená odpověď se po obnovení a novém přihlášení vrátí. Dva e-maily mají oddělená data. Podvržený vlastník se nepoužije. Při databázové chybě formulář neztratí obsah a uživatel může akci zopakovat.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
