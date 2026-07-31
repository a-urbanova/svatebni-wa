# Fáze 05 – Veřejná úvodní stránka

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Dokončit veřejnou stránku podle reference včetně přihlašovacího formuláře a jeho klientských stavů, zatím bez skutečného vytvoření magic linku.

## Předpoklady před začátkem

- Fáze 04 je dokončena.
- Sdílená pozvánka a základní UI komponenty existují.
- Validační schéma žádosti o magic link existuje z fáze 02.

## Konkrétní úkoly

1. Dokonči layout veřejné stránky `/` podle `uvodni_stranka.png`.
2. Doplň vysvětlující text o registraci účasti, počtu osob, dětech, přespání, odvozu a dietárních omezeních.
3. Vytvoř přihlašovací kartu s nadpisem, instrukcí, polem e-mailu, polem svatebního kódu a primárním tlačítkem.
4. Použij skutečné HTML popisky a ovládací prvky, ne pouze vizuální text.
5. Zapoj klientskou validaci do sdíleného schématu nebo jeho bezpečného odvození.
6. Připrav stavy: výchozí, neplatná data, odesílání, obecná chyba a obecný úspěch.
7. V této fázi formulář nesmí předstírat vytvoření odkazu. Připoj jej k jasně označenému dočasnému handleru, který v development režimu vrátí neškodnou informaci „Funkce bude aktivována v další fázi“, nebo ponech odeslání deaktivované s vysvětlením. Zvol variantu, která nezamění placeholder za funkční autentifikaci.
8. Přidej jemné zápatí podle reference.
9. Ověř autofill a vhodné atributy polí. Kód nemá být ukládán do URL.
10. Zajisti, že pozvánková část zůstává sdílená a není zkopírovaná do druhé komponenty.

## Rozsah této fáze

### Patří do této fáze

- Kompletní vizuální veřejná stránka.
- Přístupný login formulář.
- Klientská validace a UI stavy.
- Žádný skutečný token.

### Nepatří do této fáze

- Ověření svatebního kódu na serveru.
- Vytvoření tokenu.
- E-mailové nebo vývojové doručení.
- Session a přesměrování.

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

1. Otevři `/` na desktopu a mobilu.
2. Odešli prázdný formulář.
3. Zadej neplatný e-mail.
4. Zadej dlouhý nebo prázdný kód.
5. Ovládej formulář pouze klávesnicí.
6. Zkontroluj, že dočasný stav není prezentován jako skutečně odeslaný magic link.
7. Porovnej přihlašovací kartu s referencí.

## Očekávaný výsledek

Stránka vizuálně odpovídá referenci a formulář je čitelný a ovladatelný. Neplatná data zobrazí konkrétní chyby. Uživatel není klamán tvrzením, že magic link již funguje.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
