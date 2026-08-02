# Fáze 02 – Konfigurace a datové kontrakty

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Definovat validovanou konfiguraci prostředí, doménové typy a validační schémata dříve, než se začne pracovat s databází a formuláři.

## Předpoklady před začátkem

- Fáze 01 je dokončena.
- Projekt lze spustit a prochází základními kontrolami.
- `docs/ZADANI.md` a `docs/POSTUP.md` odpovídají skutečnému stavu.

## Konkrétní úkoly

1. Navrhni jeden serverový modul pro načtení a validaci proměnných prostředí. Chybějící povinná proměnná má při serverovém použití selhat s jasnou zprávou, ale klientský bundle nesmí dostat tajné hodnoty.
2. Rozděl konfiguraci na bezpečně veřejnou a čistě serverovou. Veřejné hodnoty používej jen tehdy, když jsou skutečně potřebné.
3. Připrav `.env.example` pro MongoDB URI, název databáze, základní URL, svatební kód, platnost login tokenu, platnost session a vývojové doručení odkazu.
4. Definuj doménový model RSVP: typ osoby, osoba, dietární volba, odvoz, společná zpráva, vlastník a časové údaje.
5. Definuj validační schémata pro:
   - e-mail a žádost o magic link,
   - celou odpověď hosta,
   - jednotlivou osobu,
   - admin filtry.
6. Implementuj podmíněná validační pravidla pro cíl odvozu a jinou dietu.
7. Nastav rozumné délkové limity a maximální počet osob podle `ZADANI.md`.
8. Připrav sdílené konstanty pro administrátorské e-maily a bezpečnou funkci normalizace e-mailu.
9. Přidej jednotkové testy čisté validační logiky a normalizace. Zahrň české znaky, prázdné hodnoty, přebytečné mezery a podmíněná pole.
10. Nezaváděj zatím databázové dotazy ani UI formuláře.

## Rozsah této fáze

### Patří do této fáze

- Serverová konfigurace.
- Doménové TypeScript typy.
- Zod nebo rovnocenná validační schémata.
- Jednotkové testy validace.
- Aktualizace `.env.example` a dokumentace.

### Nepatří do této fáze

- Připojení k MongoDB.
- Ukládání dat.
- Route handlery.
- Vizuální formuláře.
- Session a cookie.

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

1. Spusť jednotkové testy validace.
2. Dočasně vyzkoušej neplatnou konfiguraci podle instrukce agenta a ověř, že chyba je srozumitelná a neobsahuje tajné hodnoty.
3. Ověř případy:
   - jméno je prázdné,
   - odvoz je zvolen, ale chybí cíl,
   - dieta je „Jiná“, ale chybí upřesnění,
   - formulář obsahuje více než povolený počet osob,
   - e-mail obsahuje velká písmena a mezery.

## Očekávaný výsledek

Testy projdou. Neplatná data jsou odmítnuta s českými a konkrétními chybami. E-mail se normalizuje konzistentně. Tajné serverové hodnoty nejsou importovatelné do klientské části.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.


