# Fáze 03 – MongoDB a repozitáře

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Vytvořit bezpečnou a testovatelnou datovou vrstvu pro login tokeny, session a RSVP odpovědi, zatím bez připojení na uživatelské rozhraní.

## Předpoklady před začátkem

- Fáze 01 a 02 jsou dokončeny.
- Je připraven lokální MongoDB server nebo testovací MongoDB instance.
- Vývojář má vlastní `.env.local` vytvořený podle `.env.example`.
- Doménové typy a validace jsou stabilní pro tuto fázi.

## Konkrétní úkoly

1. Vytvoř znovupoužitelný helper pro MongoDB klienta vhodný pro Next.js vývoj s hot reloadem.
2. Připrav typované přístupy ke kolekcím `loginTokens`, `sessions` a `rsvps`.
3. Připrav inicializaci indexů:
   - unikátní a TTL indexy pro login tokeny,
   - unikátní a TTL indexy pro session,
   - unikátní index na `rsvps.ownerEmail`.
4. Vytvoř repozitář login tokenů s operacemi pro vytvoření, bezpečné dohledání, jednorázové spotřebování a odmítnutí expirovaného tokenu.
5. Vytvoř repozitář session s operacemi pro vytvoření, načtení platné session a zneplatnění.
6. Vytvoř RSVP repozitář s operacemi:
   - načíst odpověď podle vlastníka,
   - upsert celé odpovědi podle vlastníka,
   - získat read-only přehled pro správce.
7. Zajisti, že se do databáze ukládá pouze otisk tokenu a session, nikdy jejich čitelná hodnota.
8. Zajisti serverové timestampy a ukládání v UTC.
9. Přidej integrační testy repozitářů proti oddělené testovací databázi nebo jinému spolehlivému izolovanému řešení.
10. Přidej bezpečný příkaz nebo skript pro inicializaci indexů a popiš jeho použití v README.
11. Testy nesmí pracovat s produkční nebo běžnou vývojovou databází bez jasného oddělení.

## Rozsah této fáze

### Patří do této fáze

- MongoDB připojení.
- Kolekce, indexy a repozitáře.
- Databázové integrační testy.
- Dokumentace lokálního nastavení databáze.

### Nepatří do této fáze

- HTTP route handlery.
- Cookies a role.
- Vizuální stránky.
- Admin filtry v UI.
- Skutečné odesílání e-mailu.

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

1. Spusť lokální MongoDB a příkaz pro inicializaci indexů.
2. Spusť databázové testy.
3. V MongoDB nástroji zkontroluj, že kolekce a indexy existují.
4. Ověř, že tokenový dokument neobsahuje čitelný token.
5. Ověř, že druhý RSVP dokument se stejným `ownerEmail` nelze vytvořit jako duplicitní záznam.
6. Ověř, že testy používají vlastní databázi.

## Očekávaný výsledek

Indexy jsou vytvořeny, integrační testy projdou a citlivé tokeny nejsou uloženy v čitelné podobě. RSVP je jednoznačně navázané na normalizovaný e-mail vlastníka.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
