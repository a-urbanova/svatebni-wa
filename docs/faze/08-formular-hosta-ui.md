
# Fáze 08 – Formulář hosta – UI

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Vytvořit kompletní dynamický a přístupný formulář hosta podle reference, zatím s lokálním stavem a bez ukládání do MongoDB.

## Předpoklady před začátkem

- Fáze 04 a 07 jsou dokončeny.
- `/host` je chráněná stránka a zná e-mail uživatele.
- Sdílená pozvánka, design tokeny a validační schémata existují.

## Konkrétní úkoly

1. Dokonči layout `/host` podle `stranka_hosta.png`.
2. Použij sdílenou pozvánkovou část, nikoli kopii.
3. Doplň uživatelskou lištu s přihlášeným e-mailem a odhlášením ve stylu reference.
4. Vytvoř nadpis „Vaše odpověď“, vysvětlení a zobrazení termínu `1. 8. 2026`.
5. Vytvoř opakovatelnou kartu osoby. Ve výchozím stavu je jedna osoba.
6. Každá karta obsahuje:
   - jméno a příjmení,
   - dospělý nebo dítě,
   - přespání,
   - odvoz ano/ne,
   - podmíněný cíl odvozu,
   - dietární omezení,
   - podmíněné upřesnění jiné diety,
   - volitelnou poznámku osoby.
7. Přidej možnost přidat další osobu.
8. Přidej možnost odebrat osobu, pokud zůstane alespoň jedna.
9. Použij stabilní identifikátory položek, aby přidání a odebrání nepřehazovalo hodnoty.
10. Doplň volitelnou společnou zprávu odesílatele podle reference.
11. Zapoj klientskou validaci a zobraz chyby přímo u polí.
12. Tlačítko pro uložení v této fázi nesmí tvrdit, že data byla uložena do databáze. Může provést validaci a zobrazit vývojové potvrzení „Formulář je připraven k uložení v další fázi“.
13. Ošetři disabled stav při simulovaném odeslání a dvojité kliknutí.
14. Přidej komponentové testy přidání/odebrání, podmíněných polí a validace.

## Rozsah této fáze

### Patří do této fáze

- Kompletní hostovský formulář a vizuální layout.
- Dynamické osoby.
- Klientská validace.
- Lokální stav.
- Komponentové testy.

### Nepatří do této fáze

- Načtení dat z MongoDB.
- Skutečné uložení.
- Konflikty a serverové chyby.
- Admin přehled.

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

1. Přihlas se jako běžný host.
2. Zkontroluj pozvánku, e-mail a odhlášení.
3. Přidej tři osoby, odeber prostřední a ověř, že ostatní hodnoty zůstaly správně.
4. Zvol odvoz a ověř zobrazení cíle.
5. Zruš odvoz a ověř, že neplatný skrytý cíl nezpůsobuje chybu.
6. Zvol dietu „Jiná“ a ověř povinné upřesnění.
7. Zkus odstranit poslední zbývající osobu.
8. Odešli neplatný a potom platný formulář.
9. Ověř layout na 360, 768 a 1440 px.
10. Spusť komponentové testy.

## Očekávaný výsledek

Formulář je vizuálně konzistentní s referencí, všechny požadované prvky jsou dostupné a podmíněná pole fungují. Hodnoty se při změnách seznamu osob nezamění. Poslední osobu nelze odstranit a validace je srozumitelná.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
