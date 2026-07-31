# Fáze 14 – Testy a finální akceptace

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Dokončit automatizované pokrytí kritických toků, provozní dokumentaci a plný ruční akceptační průchod tak, aby prototyp mohl převzít člověk bez hlubší znalosti programování.

## Předpoklady před začátkem

- Fáze 01 až 13 jsou dokončeny nebo mají v `POSTUP.md` jasně popsané nekritické omezení.
- Hlavní cesty fungují na lokálním prostředí.
- Existuje bezpečná testovací databáze a development režim magic linku.

## Konkrétní úkoly

1. Zmapuj akceptační kritéria z `ZADANI.md` na automatické nebo ruční testy. Žádné kritérium nesmí zůstat bez způsobu ověření.
2. Doplň chybějící jednotkové a integrační testy kritické logiky.
3. Přidej end-to-end test minimálně pro:
   - žádost o magic link v development režimu,
   - přihlášení běžného hosta,
   - uložení a opětovné načtení více osob,
   - přihlášení správce a zobrazení uložených osob,
   - zákaz přístupu hosta do adminu,
   - odhlášení.
4. Zajisti izolaci a úklid testovacích dat.
5. Doplň hlavní README:
   - požadavky na Node.js a MongoDB,
   - instalace,
   - vytvoření `.env.local`,
   - inicializace indexů,
   - spuštění vývoje,
   - získání development magic linku,
   - spuštění lint, typové kontroly, testů a buildu,
   - reset bezpečné lokální databáze,
   - řešení běžných problémů.
6. Připrav bezpečný způsob vytvoření ukázkových dat nebo popiš ruční vytvoření. Nikdy nepoužívej skutečné osobní údaje.
7. Ověř čistou instalaci v novém adresáři nebo co nejvěrnější simulaci bez lokálních zbytků.
8. Proveď plný build.
9. Proveď ruční akceptační průchod podle níže uvedeného seznamu.
10. Oprav všechny kritické a vysoké chyby. Nekritické zapiš do `POSTUP.md` s dopadem a doporučením.
11. Aktualizuj stav všech fází a závěrečný stav projektu v `POSTUP.md`.
12. Nevytvářej novou produktovou funkci jen kvůli „vylepšení“ na konci.

## Rozsah této fáze

### Patří do této fáze

- Automatické testy kritických toků.
- End-to-end průchod.
- README pro lokální převzetí.
- Čistá instalace a build.
- Finální ruční akceptace.
- Pravdivé uzavření `POSTUP.md`.

### Nepatří do této fáze

- Produkční deployment.
- Nové funkce mimo zadání.
- Změna designu bez vazby na nalezenou chybu.
- Skrývání známých problémů jen proto, aby byla fáze označena za hotovou.

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

Proveď celý scénář v čistém prohlížeči:

1. Otevři veřejnou stránku na mobilní i desktopové šířce.
2. Zkus chybný e-mail a chybný svatební kód.
3. Vyžádej development magic link pro běžného hosta.
4. Otevři link, vyplň nejméně tři osoby:
   - dospělý s přespáním,
   - dítě bez přespání,
   - osoba s odvozem, cílem, dietou „Jiná“ a poznámkou.
5. Ulož, obnov stránku, odhlas se, znovu se přihlas a data uprav.
6. Přihlas se druhým běžným e-mailem a ověř oddělená data.
7. Přihlas se jako správce.
8. Ověř souhrny, všechny sloupce, hledání a filtry.
9. Zkus jako host otevřít admin URL.
10. Ověř použitý a expirovaný link.
11. Ověř odhlášení.
12. Zastav MongoDB a ověř bezpečný error stav, poté databázi vrať.
13. Ovládej klíčové formuláře klávesnicí.
14. Spusť lint, typovou kontrolu, všechny testy a produkční build podle README.
15. Proveď čistou instalaci podle README.

## Očekávaný výsledek

Nový člověk dokáže aplikaci spustit podle README a projít celý tok bez skrytých kroků. Všechny kritické automatické kontroly a build projdou. Role, vlastnictví dat, perzistence, filtry, responzivita a odhlášení fungují. V `POSTUP.md` jsou pravdivě uvedena případná zbývající nekritická omezení.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
