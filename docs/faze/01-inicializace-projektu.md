# Fáze 01 – Inicializace projektu

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Založit čistou, spustitelnou kostru Next.js aplikace a připravit projektové konvence tak, aby další fáze mohly přidávat funkce bez přestavby základu.

## Předpoklady před začátkem

- Může jít o nový prázdný adresář nebo existující téměř prázdný repozitář.
- Dokumentace z tohoto balíčku je již vložena v `docs/`.
- Je dostupná aktuální LTS verze Node.js a lokální MongoDB zatím není nutná.
- Pokud projekt již obsahuje funkční Next.js základ, nezakládej druhý projekt; nejprve zhodnoť a šetrně uprav existující.

## Konkrétní úkoly

1. Inicializuj Next.js s App Routerem, Reactem a TypeScriptem ve striktním režimu.
2. Použij jeden správce balíčků. Pokud projekt nemá lockfile, použij npm. Nevytvářej další konkurenční lockfile.
3. Nastav základní skripty pro vývoj, build, lint, typovou kontrolu a testy. Testovací nástroj může být v této fázi jen základně připraven, ale nesmí rozbíjet projekt.
4. Vytvoř minimální strukturu adresářů odpovídající `ZADANI.md`: místa pro stránky, komponenty, konfiguraci, databázi, autentifikaci, RSVP doménu a testy.
5. Zachovej `docs/` beze ztráty obsahu.
6. Vytvoř základní globální layout s českým jazykem dokumentu, správnými metadata a neutrálním dočasným obsahem.
7. Připrav tři route vstupy `/`, `/host` a `/admin` jako jednoduché placeholdery, aby šlo ověřit routování. Zatím bez autentifikace a finálního designu.
8. Vytvoř `.env.example` s názvy budoucích proměnných a bezpečnými komentáři nebo doprovodným vysvětlením. Nevkládej skutečné tajné hodnoty.
9. Uprav hlavní README projektu tak, aby obsahovalo minimální postup instalace a spuštění. Zřetelně označ, že aplikace je zatím ve fázi kostry.
10. Zaznamenej přesné verze Node.js, Next.js, Reactu, TypeScriptu a správce balíčků do `POSTUP.md`.

## Rozsah této fáze

### Patří do této fáze

- Základ projektu.
- Routing tří stránek s placeholdery.
- Kvalitativní skripty a minimální dokumentace spuštění.
- Adresářová struktura a prostředí.
- Žádná databázová logika ani autentifikace.

### Nepatří do této fáze

- Finální vzhled podle referencí.
- MongoDB připojení.
- Magic link.
- Formulář hosta.
- Admin tabulka.
- Implementace business logiky budoucích fází.

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

1. V terminálu nainstaluj závislosti podle README.
2. Spusť vývojový server.
3. Otevři `/`, `/host` a `/admin`.
4. Spusť lint, typovou kontrolu a build.
5. Zkontroluj, že v repozitáři není skutečný `.env.local` ani tajný svatební kód.

## Očekávaný výsledek

Všechny tři adresy se otevřou bez 404 a zobrazí jasně označené dočasné stránky. Vývojový server, lint, typová kontrola a build projdou. Dokumentace zůstane dostupná a repozitář neobsahuje tajné hodnoty.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.












