# Fáze 11 – Admin dashboard

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Vytvořit kompletní správcovskou stránku podle reference a napojit ji na read-only admin data.

## Předpoklady před začátkem

- Fáze 04, 07 a 10 jsou dokončeny.
- Admin endpoint nebo serverová funkce poskytuje souhrny a filtrované záznamy.
- V databázi jsou bezpečná testovací data.

## Konkrétní úkoly

1. Dokonči `/admin` podle `stranka_spravce.png`.
2. V horní části zobraz motiv prstenů, nadpis, podtitul se svatbou, e-mail správce a odhlášení.
3. Vytvoř souhrnné karty pro celkem osob, dospělé, děti a přespání.
4. Vytvoř vyhledávací pole a filtry typu osoby, přespání a diety.
5. Rozhodni, zda filtry synchronizovat do URL. Preferuj řešení, které umožní obnovení stránky bez ztráty filtru a nezkomplikuje prototyp.
6. Vytvoř tabulku se sloupci:
   - jméno,
   - typ,
   - přespání,
   - odvoz a cíl,
   - dieta,
   - poznámka nebo zpráva,
   - e-mail odesílatele,
   - naposledy upraveno.
7. Použij štítky a akcenty ve stylu reference, ale zachovej čitelnost.
8. Dlouhé hodnoty zobraz tak, aby nerozbily tabulku. Celý obsah musí být dostupný, například přes zalomení, detail nebo přístupný tooltip.
9. Přidej loading, error a empty stav.
10. Zajisti, že stránka neobsahuje žádné tlačítko pro editaci nebo smazání.
11. Na mobilu zvol řízený horizontální scroll s jasnou použitelností nebo kartové zobrazení.
12. Přidej komponentové testy filtrů a prázdného stavu.
13. Zajisti, že změna filtru nevyzradí data hostovi a server stále autorizuje každý dotaz.

## Rozsah této fáze

### Patří do této fáze

- Kompletní admin UI.
- Souhrnné karty.
- Vyhledávání a filtry.
- Read-only tabulka.
- Responzivní základ.
- Loading, error a empty stav.

### Nepatří do této fáze

- CSV export.
- Editace a mazání.
- Komplexní stránkování.
- Finální cross-browser a bezpečnostní polish, které patří do dalších fází.

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

1. Přihlas se jako správce.
2. Porovnej desktopový vzhled s referencí.
3. Ručně ověř, že souhrnné karty odpovídají tabulce.
4. Vyhledej část jména a e-mailu.
5. Použij jednotlivé filtry i jejich kombinaci.
6. Vymaž testovací data nebo použij prázdnou testovací databázi a ověř empty stav.
7. Dočasně vyvolej chybu serveru a ověř error stav bez úniku interních detailů.
8. Otevři stránku na šířce 360 px a ověř dostupnost všech údajů.
9. Zkontroluj, že nikde není editace nebo mazání.

## Očekávaný výsledek

Dashboard vizuálně odpovídá referenční atmosféře, souhrny a řádky jsou správné, filtry fungují a všechny informace zůstávají dostupné na mobilu. Správce má pouze čtecí rozhraní.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
