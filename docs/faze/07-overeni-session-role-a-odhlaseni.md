# Fáze 07 – Ověření, session, role a odhlášení

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Dokončit přihlašovací tok: jednorázově ověřit magic link, vytvořit session, chránit stránky, přesměrovat podle role a umožnit odhlášení.

## Předpoklady před začátkem

- Fáze 06 je dokončena a lze získat vývojový magic link.
- Session repozitář z fáze 03 funguje.
- Administrátorské e-maily jsou definované a normalizované.
- Route `/host` a `/admin` zatím obsahují pouze nebo převážně placeholdery.

## Konkrétní úkoly

1. Vytvoř ověřovací route pro token z magic linku.
2. Token na serveru bezpečně otiskni a atomicky nebo jinak spolehlivě jednorázově spotřebuj.
3. Odmítnutí musí pokrýt chybějící, neplatný, použitý a expirovaný token.
4. Po úspěšném ověření vytvoř náhodnou session, ulož pouze její otisk a nastav bezpečnou cookie.
5. Role se určí serverově podle normalizovaného e-mailu.
6. Přesměruj správce na `/admin` a ostatní na `/host`.
7. Implementuj serverový helper pro načtení aktuální session a autoritativní kontrolu role.
8. Chraň `/host` a `/admin` v serverové vrstvě:
   - nepřihlášený uživatel jde na `/`,
   - host, který otevře `/admin`, jde na `/host` nebo dostane bezpečný 403,
   - správce, který otevře `/host`, jde na `/admin`.
9. Chraň všechny existující a budoucí související route handlery stejným serverovým principem.
10. Vytvoř odhlášení, které zneplatní session v databázi, smaže cookie a přesměruje na `/`.
11. Doplň na `/host` a `/admin` dočasnou uživatelskou lištu s e-mailem a odhlášením.
12. Nastav bezpečné chování cookie pro development a production.
13. Přidej testy role, přesměrování, opakovaného použití tokenu, expirace a odhlášení.
14. Neimplementuj ještě RSVP ani admin data.

## Rozsah této fáze

### Patří do této fáze

- Magic link callback.
- Session cookie a repozitář.
- Serverové route guards.
- Role a přesměrování.
- Odhlášení.
- Základní zobrazení přihlášeného e-mailu.

### Nepatří do této fáze

- Finální host formulář.
- Ukládání RSVP.
- Admin tabulka.
- Pokročilé omezení počtu žádostí.
- Produkční e-mailový provider.

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

1. Vyžádej link pro běžný e-mail a otevři jej.
2. Ověř přesměrování na `/host` a zobrazení stejného e-mailu.
3. Otevři tentýž link podruhé.
4. Vyžádej link pro oba administrátorské e-maily a ověř přesměrování na `/admin`.
5. Jako host ručně otevři `/admin`.
6. Jako správce ručně otevři `/host`.
7. Klikni na odhlášení a poté zkus otevřít chráněnou stránku.
8. Ověř cookie v prohlížeči: nesmí být dostupná běžnému JavaScriptu.
9. Spusť automatické testy.

## Očekávaný výsledek

Platný odkaz přihlásí uživatele právě jednou. Role vede na správnou stránku. Chráněné stránky nelze obejít zadáním URL. Odhlášení ukončí session a stará cookie již neumožní přístup.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
