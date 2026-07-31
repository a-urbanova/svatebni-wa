# Fáze 04 – Design systém a sdílená pozvánka

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Vytvořit vizuální základ aplikace a znovupoužitelnou pozvánkovou sekci podle referenčních obrázků, bez implementace funkčních formulářů.

## Předpoklady před začátkem

- Fáze 01 až 03 jsou dokončeny.
- Projekt je spustitelný.
- Referenční obrázky jsou dostupné v `docs/reference/`.
- Agent si před úpravou otevře všechny tři reference a přečte `docs/reference/README.md`.

## Konkrétní úkoly

1. Definuj design tokeny pro barvy, typografii, rozestupy, rádiusy, stíny a šířky obsahu.
2. Zvol elegantní patkové písmo s českou diakritikou a čisté bezpatkové písmo. Přidej bezpečné fallbacky a ověř lokální build.
3. Nastav globální pozadí, základní barvy, focus styl a typografickou hierarchii.
4. Vytvoř sdílenou komponentu pozvánky použitelnou na veřejné i hostovské stránce.
5. Pozvánka musí obsahovat přesný text, datum, čas a místo ze `ZADANI.md`.
6. Vytvoř vlastní dekorativní motiv propojených prstenů pomocí jednoduchého SVG nebo CSS. Nesmí se použít screenshot.
7. Vytvoř sdílený oddělovač s tenkými linkami a středovým symbolem.
8. Vytvoř základní prezentační komponenty, které budou později opakovaně použity: karta, primární tlačítko, obrysové tlačítko, popisek pole a stavová zpráva.
9. Připrav responzivní kontejnery pro úzkou pozvánkovou stránku a široký admin layout.
10. Nahraď na `/` a `/host` placeholder pozvánkovou sekcí. Zbytek může zůstat jasně označeným placeholderem.
11. Nedoplňuj ještě login formulář ani RSVP formulář.

## Rozsah této fáze

### Patří do této fáze

- Design tokeny.
- Globální styl.
- Sdílená pozvánková sekce.
- Prstenový motiv a oddělovač.
- Základní UI primitives.
- Responzivní kontejnery.

### Nepatří do této fáze

- Funkční přihlášení.
- Formulář hosta.
- Admin dashboard.
- Databázová interakce.
- Pixel-perfect ladění všech stavů.

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

1. Spusť aplikaci a otevři `/` a `/host`.
2. Porovnej horní pozvánkovou část s referencemi při šířkách přibližně 360, 768 a 1440 px.
3. Zkontroluj českou diakritiku ve všech patkových a kurzivních textech.
4. Ovládej stránku klávesnicí a ověř viditelný focus na již existujících interaktivních prvcích.
5. Dočasně zakaž načtení externího fontu, pokud je použit, a ověř přijatelný fallback.

## Očekávaný výsledek

Pozvánková část působí vizuálně věrně: teplé pozadí, velká jména, starorůžový ampersand, kurzivní text, datum, prsteny a velkorysé rozestupy. Na mobilu se nic neořezává a české znaky jsou správné.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
