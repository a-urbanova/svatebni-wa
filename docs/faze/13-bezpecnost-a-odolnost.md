# Fáze 13 – Bezpečnost a odolnost

## Pokyn pro agenta

Pracuj pouze na této fázi. Respektuj celý soubor `docs/ZADANI.md`. Nezačínej implementaci následující fáze, ani když se zdá jednoduchá.

Na začátku:

1. Přečti `docs/ZADANI.md`.
2. Přečti `docs/POSTUP.md`.
3. Přečti tento soubor.
4. Projdi relevantní existující soubory aplikace, kterých se fáze týká.
5. Stručně shrň aktuální stav a upozorni na případný blokující rozpor. Pokud rozpor není blokující, zvol nejmenší bezpečné řešení a rozhodnutí později zapiš do `docs/POSTUP.md`.

## Cíl fáze

Provést cílené zpevnění autentifikace, autorizace a práce s osobními údaji bez rozšiřování produktového rozsahu.

## Předpoklady před začátkem

- Hlavní uživatelské toky fungují.
- Existují automatické testy pro tokeny, session, RSVP vlastnictví a admin přístup.
- Aplikace je stále určena primárně pro lokální prototyp, ale nemá obsahovat zjevné bezpečnostní chyby.

## Konkrétní úkoly

1. Zkontroluj všechny route handlery a serverové akce z hlediska autentifikace, role a serverové validace.
2. Ověř, že žádný klientský parametr neurčuje vlastníka RSVP nebo roli.
3. Přidej rozumné omezení počtu žádostí o magic link podle IP a normalizovaného e-mailu. Pro lokální prototyp může být jednoduché; omezení a nevhodnost pro distribuovanou produkci popiš.
4. Zajisti obecné odpovědi proti enumeraci e-mailů.
5. Ověř jednorázovost a expiraci login tokenů i session.
6. Zkontroluj cookie atributy pro development a production.
7. Zajisti, že citlivé route odpovědi mají vhodné `no-store` nebo rovnocenné chování.
8. Zkontroluj logy a odstraň tokeny, svatební kód, session a zbytečná osobní data.
9. Zkontroluj zacházení s URL tokenem:
   - po úspěšném ověření přesměruj na čistou URL,
   - token nesmí zůstat v UI,
   - chybová stránka jej nesmí opakovat.
10. Zvaž základní bezpečnostní hlavičky, které jsou kompatibilní s lokálním prototypem.
11. Ověř ochranu proti nežádoucím cross-site požadavkům s ohledem na SameSite cookie a zvolený způsob mutace.
12. Přidej regresní testy pro:
   - host versus admin,
   - podvržení vlastníka,
   - opakovaný token,
   - expirovaný token,
   - zneplatněnou session,
   - rate limit,
   - produkční zákaz vrácení vývojového odkazu.
13. Proveď kontrolu závislostí dostupným nástrojem a kritické nálezy vyřeš nebo zdokumentuj.
14. Nezaváděj komplikovanou enterprise infrastrukturu, která neodpovídá lokálnímu prototypu.

## Rozsah této fáze

### Patří do této fáze

- Bezpečnostní review a opravy.
- Jednoduchý rate limit.
- Cookie, cache, logy a token URL.
- Regresní bezpečnostní testy.
- Dokumentace známých produkčních omezení.

### Nepatří do této fáze

- Produkční WAF.
- Distribuovaný rate limiter.
- Správa tajemství konkrétního cloudu.
- Penetrační test třetí stranou.
- Produkční SMTP a hosting.

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

1. Několikrát rychle požádej o magic link a ověř omezení.
2. Ověř, že běžná odpověď neprozrazuje, zda e-mail už má RSVP.
3. Otevři použitý a expirovaný link.
4. Zkus hostem admin stránku i admin endpoint.
5. Uprav požadavek RSVP a přidej cizí e-mail.
6. Odhlas se a zopakuj starý chráněný požadavek.
7. Prohlédni logy, URL a síťové odpovědi: nesmí obsahovat tajné hodnoty mimo explicitní development režim.
8. Spusť bezpečnostní regresní testy a kontrolu závislostí.

## Očekávaný výsledek

Zjevné pokusy o obejití role, vlastnictví a expirace jsou odmítnuty. Rate limit omezuje zneužití loginu. Token po ověření zmizí z adresního řádku. Logy a běžné odpovědi neobsahují citlivé hodnoty.

## Aktualizace souboru Postup

Před ukončením fáze:

- změň stav této fáze v tabulce `docs/POSTUP.md`,
- přidej nový záznam podle šablony na konci souboru,
- zapiš skutečné změny, soubory, rozhodnutí, chyby a opravy,
- zapiš výše uvedený ruční test a očekávaný výsledek,
- neoznačuj jako dokončené nic, co nebylo provedeno nebo ověřeno.
