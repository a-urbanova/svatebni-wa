# Fáze 06 – Žádost o magic link

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Implementovat serverové ověření společného svatebního kódu, vytvoření jednorázového tokenu a lokálně testovatelné doručení magic linku.

## Předpoklady před začátkem

- Fáze 02, 03 a 05 jsou dokončeny.
- MongoDB připojení a tokenový repozitář fungují.
- `.env.local` obsahuje vývojový svatební kód a základní URL.
- Veřejný login formulář má připravené validační stavy.

## Konkrétní úkoly

1. Vytvoř serverový endpoint nebo odpovídající serverovou akci pro žádost o magic link.
2. Na serveru znovu validuj e-mail a kód.
3. Ověř svatební kód proti serverové konfiguraci bezpečným způsobem. Kód se nesmí logovat.
4. Vygeneruj kryptograficky náhodný token s krátkou platností, doporučeně 15 minut.
5. Do databáze ulož pouze bezpečný otisk tokenu, normalizovaný e-mail a časové údaje.
6. Sestav absolutní magic link vedoucí na budoucí ověřovací route. Token smí být v URL jen jako krátkodobý jednorázový parametr.
7. Vytvoř rozhraní pro doručení odkazu:
   - vývojový režim vypíše odkaz do serverového logu,
   - při explicitním development přepínači může odpověď obsahovat klikací vývojový odkaz,
   - produkční režim nikdy nesmí vrátit token klientovi,
   - připrav místo pro budoucí SMTP implementaci, ale není nutné ji dokončit.
8. Pro všechny běžné žádosti vrať obecnou úspěšnou zprávu, která neprozrazuje existenci účtu.
9. Chybně zadaný společný kód může být odmítnut jasnou, ale nebezpečně podrobnou zprávou. Zvaž stejné časování a nerozlišuj detaily databáze.
10. Zapoj endpoint do veřejného formuláře.
11. Přidej testy pro správný kód, špatný kód, neplatný e-mail, vývojové doručení a zákaz vrácení tokenu mimo development.
12. Zajisti, že opakovaná žádost vytvoří nový token a staré tokeny zůstanou omezené expirací; není nutné je všechny ručně rušit.

## Rozsah této fáze

### Patří do této fáze

- Request magic link flow.
- Uložení tokenu.
- Vývojové doručení.
- Zapojení formuláře.
- Testy serverové logiky.

### Nepatří do této fáze

- Spotřebování odkazu.
- Vytvoření session.
- Přesměrování podle role.
- Odhlášení.
- SMTP produkční konfigurace jako povinná funkce.

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

1. Spusť aplikaci v development režimu s povoleným vývojovým odkazem.
2. Odešli platný e-mail a špatný kód.
3. Odešli platný e-mail a správný kód.
4. Ověř obecnou úspěšnou zprávu a najdi vývojový odkaz.
5. Zkontroluj databázi: token nesmí být uložen čitelně.
6. Vypni přepínač zobrazování vývojového odkazu a ověř, že odpověď token neobsahuje.
7. Spusť automatické testy této fáze.

## Očekávaný výsledek

Se správným kódem vznikne krátkodobý token a lokálně dostupný magic link. Se špatným kódem se token nevytvoří. Databáze ani logy neobsahují svatební kód nebo čitelný token; vývojový link se klientovi vrací jen při explicitním development nastavení.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
