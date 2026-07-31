# Fáze 10 – Admin data a souhrny

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Připravit autorizovaný read-only serverový model pro administraci, který z RSVP dokumentů vytvoří jednotlivé řádky, souhrny a bezpečné filtry.

## Předpoklady před začátkem

- Fáze 09 je dokončena a v databázi lze vytvořit několik RSVP odpovědí.
- Session a role fungují.
- Správce je bezpečně rozpoznán na serveru.

## Konkrétní úkoly

1. Navrhni admin read model, kde jeden výstupní záznam představuje jednu osobu z pole RSVP.
2. Každý záznam musí obsahovat owner e-mail, jméno, typ, přespání, odvoz, cíl, dietu, poznámku, společnou zprávu a poslední úpravu.
3. Vytvoř souhrnné počty minimálně: celkem osob, dospělí, děti, přespání.
4. Vytvoř serverové filtry:
   - textové hledání v jménu a e-mailu,
   - typ osoby,
   - přespání,
   - dietární omezení.
5. Filtry validuj a omez. Nepropouštěj uživatelský vstup přímo do nebezpečné databázové konstrukce.
6. Zvol stabilní výchozí řazení, například nejnovější odpověď a poté jméno. Rozhodnutí zapiš.
7. Vytvoř read-only admin endpoint nebo serverovou funkci. Musí odmítnout hosta i nepřihlášeného uživatele.
8. Nesmí existovat admin write endpoint.
9. Zajisti, že odpověď není cachována způsobem, který by ukázal data jinému uživateli.
10. Přidej testy pro souhrny, flattening více osob, všechny filtry, prázdná data, hosta a nepřihlášený přístup.
11. Připrav bezpečná testovací data bez skutečných osobních údajů.

## Rozsah této fáze

### Patří do této fáze

- Admin read model.
- Souhrnné metriky.
- Vyhledávání a filtry na serveru.
- Autorizovaný read-only endpoint.
- Testy.

### Nepatří do této fáze

- Finální admin UI.
- Export.
- Editace nebo mazání.
- Pokročilé stránkování, pokud není potřeba pro prototyp.

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

1. Připrav v testovací databázi nejméně tři RSVP odpovědi a více osob.
2. Jako správce vyvolej admin endpoint a zkontroluj všechny sloupce.
3. Ověř souhrnné počty ručním přepočítáním.
4. Vyzkoušej hledání podle části jména i e-mailu.
5. Vyzkoušej každý filtr a kombinaci dvou filtrů.
6. Jako běžný host zkus stejný endpoint.
7. Ověř, že neexistuje metoda pro změnu admin dat.
8. Spusť automatické testy.

## Očekávaný výsledek

Správce dostane správně zploštěné osoby a souhrny. Filtry vrací očekávané podmnožiny. Host ani nepřihlášený uživatel data nezíská. Admin rozhraní je čistě čtecí.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
