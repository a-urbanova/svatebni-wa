# Fáze 12 – Responzivita, přístupnost a stavové scénáře

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Systematicky projít všechny tři stránky a doladit mobilní chování, přístupnost, dlouhé texty a všechny běžné loading, success, empty a error stavy.

## Předpoklady před začátkem

- Všechny tři stránky a hlavní funkce jsou implementované.
- Fáze 05, 09 a 11 jsou dokončeny.
- Existují testovací účty a data pro různé okrajové případy.

## Konkrétní úkoly

1. Projdi `/`, `/host` a `/admin` při šířkách přibližně 360, 768, 1024 a 1440 px.
2. Odstraň nechtěný horizontální posun celé stránky.
3. Ověř dlouhé e-maily, dlouhá jména, dlouhé cíle odvozu, dietní text a poznámky.
4. Dolaď velikosti dotykových prvků, mezery, zalamování a sticky nebo scroll chování, pokud je použito.
5. Zkontroluj sémantickou strukturu nadpisů, landmarky a pořadí focusu.
6. Všechna pole musí mít viditelné popisky a propojené chybové zprávy.
7. Přidej nebo oprav `aria-live` pro důležité dynamické výsledky, zejména odeslání loginu a uložení RSVP.
8. Ověř, že dekorativní prsteny a oddělovače nejsou rušivě čteny čtečkou.
9. Dolaď focus stavy tak, aby byly viditelné na světlém pozadí.
10. Ověř kontrast textů, tlačítek, okrajů a chyb. Pokud reference používá příliš jemný tón, upřednostni čitelnost.
11. Zpracuj všechny stavy:
    - načítání session,
    - načítání RSVP,
    - ukládání RSVP,
    - úspěch,
    - neplatný nebo expirovaný link,
    - odhlášená session,
    - prázdný admin,
    - chyba databáze,
    - žádný výsledek filtrů.
12. Zajisti, že stisk Enter nevyvolá nečekanou akci a že dialog nebo potvrzení, pokud existuje, lze opustit klávesnicí.
13. Přidej přístupnostní a komponentové testy nejdůležitějších stavů.
14. Neprováděj zásadní změnu architektury, pokud není nutná pro opravu konkrétního problému.

## Rozsah této fáze

### Patří do této fáze

- Responzivní polish.
- Přístupnost.
- Okrajové hodnoty.
- Loading, error, empty a success stavy.
- Drobné vizuální sjednocení.

### Nepatří do této fáze

- Nové produktové funkce.
- Přestavba autentifikace.
- Exporty.
- Produkční deployment.
- Rozsáhlé redesignování mimo referenční styl.

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

1. Projdi celou aplikaci pouze klávesnicí.
2. Použij vestavěný accessibility audit prohlížeče a oprav závažné nálezy.
3. Zvětši text prohlížeče na 200 % a ověř použitelnost.
4. Testuj na 360, 768 a 1440 px.
5. Vlož velmi dlouhé, ale povolené hodnoty.
6. Vyvolej každý uvedený loading, empty a error stav.
7. Ověř, že chybová hlášení neobsahují stack trace, token nebo MongoDB URI.
8. Ověř focus po přidání a odebrání osoby.

## Očekávaný výsledek

Aplikace zůstává čitelná a ovladatelná klávesnicí i při zvětšení textu. Všechny stavy jsou srozumitelné, focus je viditelný a dlouhé hodnoty nerozbíjejí layout. Neunikají interní chybové detaily.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
