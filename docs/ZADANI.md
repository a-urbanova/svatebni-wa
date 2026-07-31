# ZADÁNÍ – svatební webová aplikace Anna & Petr

## 1. Účel dokumentu

Tento soubor je hlavní a dlouhodobý zdroj pravdy pro implementačního agenta. Agent jej musí přečíst před každou fází a respektovat jej i v případě, že jednotlivý prompt fáze některé informace neopakuje.

Cílem je vytvořit funkční lokálně spustitelný prototyp třístránkové svatební webové aplikace. Vývoj probíhá po malých, samostatně ověřitelných fázích. Po každé fázi musí aplikace zůstat spustitelná, agent navrhne ruční test a aktualizuje `docs/POSTUP.md`.

## 2. Stručný popis aplikace

Aplikace slouží jako digitální svatební pozvánka a RSVP formulář pro svatbu Anny a Petra. Veřejný návštěvník uvidí pozvánku a přihlašovací formulář. Po přihlášení magic linkem se běžný host dostane k formuláři pro sebe a další osoby. Dva předem určené administrátorské e-maily se dostanou do přehledu všech odpovědí.

Text pozvánky:

> Anna & Petr – Srdečně vás zveme na náš svatební obřad, který se bude konat 21. září 2026 ve 12:00 u kostela sv. Antonína Velikého v Liberci.

## 3. Cíloví uživatelé a role

### Veřejný návštěvník

- Vidí úvodní stránku a svatební pozvánku.
- Může zadat e-mail a společný svatební kód.
- Nemá přístup k údajům hostů ani k administraci.

### Host

- Je přihlášený e-mailem, který není na seznamu administrátorů.
- Vidí pozvánku, svůj e-mail a možnost odhlášení.
- Může vytvořit a později upravovat vlastní RSVP odpověď.
- Smí číst a měnit pouze údaje uložené pod svým e-mailem.

### Správce

Správcovskou roli mají pouze tyto dvě normalizované e-mailové adresy:

- `svatebniwa+anna@gmail.com`
- `svatebniwa+petr@gmail.com`

Správce:

- vidí svůj e-mail a možnost odhlášení,
- vidí souhrn a jednotlivé osoby z odpovědí hostů,
- může vyhledávat a filtrovat,
- má pouze čtecí oprávnění k odpovědím,
- nemůže odpovědi hostů upravovat ani mazat.

Role se vždy určuje na serveru podle normalizovaného e-mailu. Klientská aplikace nesmí být autoritou pro rozhodnutí o roli.

## 4. Hlavní uživatelské cesty

### Přihlášení hosta

1. Uživatel otevře `/`.
2. Zadá e-mail a společný svatební kód.
3. Server ověří kód a vytvoří jednorázový dočasný magic link.
4. V lokálním vývojovém režimu je odkaz dostupný bezpečným vývojovým způsobem, aby šel bez reálného e-mailového serveru otestovat.
5. Uživatel otevře odkaz.
6. Server ověří a jednorázově spotřebuje token, vytvoří session a přesměruje uživatele na `/host` nebo `/admin`.

### Vyplnění odpovědi

1. Host otevře chráněnou stránku `/host`.
2. Uvidí dříve uloženou odpověď, pokud existuje.
3. Přidá nebo odebere osoby a vyplní jejich údaje.
4. Uloží formulář.
5. Po obnovení stránky nebo novém přihlášení se data znovu načtou.

### Kontrola odpovědí správcem

1. Správce se přihlásí jedním ze dvou administrátorských e-mailů.
2. Otevře `/admin`.
3. Vidí souhrnné počty a tabulku jednotlivých osob.
4. Může použít vyhledávání a filtry.
5. Nemůže data měnit.

## 5. Rozsah aplikace

### Součást prototypu

- Tři hlavní stránky: `/`, `/host`, `/admin`.
- Magic link přihlášení se společným svatebním kódem.
- Session v bezpečné HTTP cookie.
- Rozlišení role podle e-mailu.
- MongoDB perzistence.
- Opakovatelný formulář osob.
- Opětovné načtení a úprava vlastní odpovědi.
- Správcovský read-only přehled.
- Vyhledávání a základní filtrování.
- Responzivní vzhled podle referencí.
- Lokální spuštění a testování bez povinného externího e-mailového poskytovatele.
- Základní automatizované testy kritických toků a podrobný ruční akceptační test.

### Mimo rozsah prototypu

- Veřejné produkční nasazení a konfigurace konkrétního hostingu.
- Správa více svateb nebo více společných kódů.
- Hesla, sociální přihlášení nebo registrace účtů.
- Správcovská editace a mazání odpovědí.
- Platby, dary, zasedací pořádek, galerie, nahrávání souborů.
- Hromadné rozesílání pozvánek.
- Pokročilé reporty, exporty a auditní systém.
- Povinná integrace konkrétního SMTP poskytovatele.

## 6. Funkční požadavky

### 6.1 Veřejná úvodní stránka

Stránka musí obsahovat:

- nadpis „Svatební pozvánka“,
- jména „Anna & Petr“,
- jednoduchý motiv propojených prstenů,
- text pozvánky,
- datum `21. září 2026`,
- čas `12:00`,
- místo `u kostela sv. Antonína Velikého v Liberci`,
- stručné vysvětlení, že přihlášení umožní vyplnit účast, osoby, přespání, odvoz a dietární omezení,
- přihlašovací kartu,
- pole pro e-mail,
- pole pro společný svatební kód,
- tlačítko pro vyžádání magic linku,
- srozumitelný stav odesílání, úspěchu a chyby.

Po odeslání se uživateli nesmí prozradit, zda daný e-mail už v databázi existuje. Pro přihlášení není potřeba předchozí registrace.

### 6.2 Stránka hosta

Stránka `/host` musí obsahovat:

- stejnou pozvánkovou část jako veřejná stránka,
- viditelný e-mail přihlášeného uživatele,
- možnost odhlášení,
- nadpis a vysvětlení formuláře,
- informativní termín pro úpravu odpovědi `1. 8. 2026` podle reference; prototyp jej pouze zobrazuje, pokud nebude výslovně rozhodnuto jinak,
- nejméně jednu sekci osoby ve výchozím stavu,
- možnost přidat další osobu,
- možnost odebrat osobu, pokud zbývá alespoň jedna,
- uložení celé odpovědi,
- načtení existující odpovědi,
- rozlišení stavů načítání, ukládání, úspěchu a chyby,
- ochranu před ztrátou rozpracovaných dat při běžné validační chybě.

Každá osoba má:

- stabilní interní identifikátor,
- jméno a příjmení,
- typ `dospělý` nebo `dítě`,
- volbu přespání,
- volbu, zda potřebuje odvoz,
- cíl odvozu, povinný jen při zvoleném odvozu,
- dietární omezení,
- volitelnou poznámku osoby.

Dietární omezení mohou používat praktické volby `Žádná`, `Vegetariánská`, `Veganská`, `Bezlepková`, `Bezlaktózová` a `Jiná`. Při volbě `Jiná` se zobrazí textové upřesnění.

Podle referenčního návrhu může formulář obsahovat také jednu volitelnou společnou zprávu odesílatele. Tato zpráva je samostatná od poznámky konkrétní osoby.

### 6.3 Stránka správce

Stránka `/admin` musí obsahovat:

- e-mail přihlášeného správce,
- možnost odhlášení,
- nadpis „Přehled odpovědí hostů“,
- souhrnné karty minimálně pro celkový počet osob, počet dospělých, počet dětí a počet osob s přespáním,
- vyhledávání podle jména nebo e-mailu odesílatele,
- filtr typu osoby,
- filtr přespání,
- filtr dietárního omezení,
- přehled jednotlivých osob.

U každé osoby se zobrazí:

- jméno a příjmení,
- typ osoby,
- přespání,
- potřeba odvozu a cíl odvozu,
- dietární omezení,
- poznámka osoby a případně související společná zpráva,
- e-mail uživatele, který odpověď zadal,
- datum a čas poslední úpravy.

Na široké obrazovce se použije tabulka. Na malé obrazovce musí zůstat obsah čitelný; lze použít horizontální posun nebo přepnutí na karty. Správce nesmí mít žádnou akci pro změnu dat.

## 7. Autentifikace a autorizace

### 7.1 Základní princip

Implementace má být jednoduchá, lokálně testovatelná a nezávislá na povinné externí službě. Preferovaná architektura je vlastní tokenový tok:

- uživatel zadá e-mail a svatební kód,
- server ověří kód uložený pouze v proměnné prostředí,
- server vygeneruje kryptograficky náhodný token,
- do databáze uloží pouze bezpečný otisk tokenu,
- token je jednorázový a krátkodobý, doporučeně 15 minut,
- po ověření se token označí jako použitý nebo odstraní,
- server vytvoří náhodnou session a klientovi nastaví HTTP-only cookie,
- session má konečnou platnost, doporučeně 7 dní,
- odhlášení zneplatní session a smaže cookie.

Jiná osvědčená autentifikační knihovna je přípustná pouze tehdy, pokud zachová všechny požadavky, lokální testovatelnost a jednoduchost. Odchylku musí agent zdůvodnit v `POSTUP.md`.

### 7.2 Lokální doručení magic linku

Vývojové prostředí musí umožnit otestovat celý tok bez skutečného odeslání e-mailu. Doporučený režim:

- odkaz se bezpečně vypíše do vývojového logu,
- volitelně se při explicitně zapnutém vývojovém přepínači vrátí v odpovědi a zobrazí jako klikací vývojový odkaz,
- tato možnost je povolena pouze v development režimu,
- v produkčním režimu se magic link nikdy nevrací klientovi,
- architektura doručení má mít jednoduché rozhraní, aby šlo později přidat SMTP.

### 7.3 Bezpečnostní pravidla

- E-mail se před použitím ořízne a převede na malá písmena.
- Společný svatební kód ani tajné hodnoty nesmí být v repozitáři.
- Odpověď na žádost o odkaz má být obecná a nesmí usnadnit zjišťování účtů.
- Token ani session se nesmí ukládat do databáze v čitelné podobě.
- Cookie má být `HttpOnly`, `SameSite=Lax`, v produkci `Secure` a s omezenou cestou.
- Chráněné stránky i API musí autorizovat uživatele na serveru.
- Klientská kontrola role je pouze pomocná pro UI, nikoli bezpečnostní bariéra.
- Host nikdy nesmí zadat e-mail vlastníka dat v požadavku tak, aby jím mohl změnit cizí odpověď; vlastník se vždy bere ze session.
- Správcovská API jsou read-only.
- Citlivé odpovědi mají zakázat nežádoucí cachování.

## 8. Databáze

Použije se MongoDB a oficiální Node.js MongoDB driver. Připojení musí být vhodné pro vývoj s hot reloadem a nesmí při každém požadavku bezdůvodně vytvářet nové spojení.

Doporučené kolekce:

### `loginTokens`

- bezpečný otisk tokenu,
- normalizovaný e-mail,
- čas vytvoření,
- čas expirace,
- čas použití nebo příznak použití.

Požadované indexy:

- unikátní index na otisk tokenu,
- TTL index na expiraci.

### `sessions`

- bezpečný otisk session tokenu,
- normalizovaný e-mail,
- role,
- čas vytvoření,
- čas expirace.

Požadované indexy:

- unikátní index na otisk session tokenu,
- TTL index na expiraci.

### `rsvps`

Jeden dokument představuje odpověď jednoho přihlášeného e-mailu:

- `ownerEmail` – normalizovaný e-mail vlastníka,
- `persons` – pole osob,
- volitelná společná zpráva,
- `createdAt`,
- `updatedAt`.

Požadovaný index:

- unikátní index na `ownerEmail`.

U každé osoby:

- stabilní identifikátor,
- celé jméno,
- typ osoby,
- přespání,
- potřeba odvozu,
- cíl odvozu,
- dietární volba,
- případné upřesnění diety,
- poznámka.

Čas se ukládá v UTC. V uživatelském rozhraní se zobrazuje česky a v časové zóně `Europe/Prague`.

## 9. Validace a datová pravidla

- E-mail musí mít platný formát a po normalizaci nesmí být prázdný.
- Formulář musí obsahovat alespoň jednu osobu.
- Jméno a příjmení osoby je povinné a má rozumný limit délky.
- Cíl odvozu je povinný pouze tehdy, když osoba odvoz potřebuje.
- Upřesnění jiné diety je povinné pouze při volbě `Jiná`.
- Poznámky a zprávy mají délkový limit.
- Serverová validace je povinná i tehdy, když existuje validace na klientu.
- Neznámá pole z klienta se nemají slepě ukládat.
- Chybové zprávy mají být česky a mají uživateli říct, co může opravit.

Doporučené výchozí limity:

- jméno: 1 až 120 znaků,
- cíl odvozu: nejvýše 200 znaků,
- dietní upřesnění: nejvýše 200 znaků,
- poznámka osoby: nejvýše 500 znaků,
- společná zpráva: nejvýše 1000 znaků,
- rozumný maximální počet osob v jedné odpovědi, například 20.

## 10. Technologie a architektonické zásady

- Node.js v aktuální LTS verzi.
- Next.js s App Routerem.
- React.
- TypeScript se zapnutým striktním režimem.
- Serverová část v Next.js pomocí Route Handlers, serverových komponent a dalších aktuálně doporučených mechanismů.
- MongoDB s oficiálním driverem.
- Sdílená validace pomocí Zod nebo stejně vhodné knihovny.
- Pro dynamický formulář je doporučen React Hook Form s podporou opakovaných polí, pokud je kompatibilní s aktuální verzí Reactu a Next.js.
- Stylování může používat CSS Modules, globální CSS s design tokeny nebo jiný lehký přístup. Není potřeba plný komponentový framework.
- Testy: rychlé jednotkové/integrace pro doménovou logiku a kritické route handlery, plus alespoň jeden end-to-end průchod hlavní cestou.
- Výchozí správce balíčků je npm, pokud existující projekt jednoznačně nepoužívá jiný.

Agent má používat aktuální stabilní a kompatibilní verze. Přesné verze zapíše do `POSTUP.md`.

Autoritativní kontrola session a role má probíhat v Node.js serverové vrstvě. Middleware je volitelný a nesmí vyžadovat databázový přístup v nekompatibilním runtime.

## 11. Design a práce s referenčními podklady

Referenční obrázky jsou uloženy v `docs/reference/`:

- `uvodni_stranka.png`,
- `stranka_hosta.png`,
- `stranka_spravce.png`.

Podrobnější vizuální poznámky jsou v `docs/reference/README.md`.

### Vizuální charakter

- velmi světlé teplé slonovinové pozadí,
- tmavě hnědý až antracitový text,
- tlumená starorůžová jako akcent,
- jemné béžovorůžové okraje,
- velká elegantní patková typografie pro jména a nadpisy,
- kurzivní patkové písmo pro pozvánku,
- čisté bezpatkové písmo pro formuláře a tabulky,
- velkorysé vertikální rozestupy,
- zaoblené karty a pilulková tlačítka,
- tenké oddělovače s malým středovým motivem,
- jednoduchý motiv dvou propojených prstenů.

Doporučené výchozí barevné hodnoty, které lze při vizuálním ladění mírně upravit:

- pozadí: přibližně `#FBF7F3`,
- hlavní text: přibližně `#342D2A`,
- sekundární text: přibližně `#766A65`,
- akcent: přibližně `#C78376`,
- světlý akcent: přibližně `#E9C3BA`,
- okraje: přibližně `#E8DCD5`,
- karty: téměř bílá s teplým tónem.

### Pravidla použití referencí

- Obrázky jsou designová reference, nikoli hotové pozadí stránky.
- Rozhraní se má reprodukovat pomocí HTML, CSS a jednoduchého SVG nebo CSS motivu.
- Celé screenshoty se nesmí použít jako obrázek místo skutečného rozhraní.
- Text musí zůstat skutečným textem a formuláře skutečnými ovládacími prvky.
- Pokud funkční zadání vyžaduje prvek, který na obrázku není, agent jej doplní ve stejném stylu. To platí zejména pro odvoz, poznámku osoby, validační stavy a některé administrátorské sloupce.
- Není vyžadována absolutní shoda po pixelech. Důležitá je kompozice, typografie, barevnost, atmosféra, hierarchie a čitelnost.
- Rozhraní musí fungovat na mobilu, tabletu i desktopu.
- Reference mají zůstat v dokumentaci. Runtime aplikace na nich nemá být závislý.
- Grafický motiv prstenů má agent vytvořit vlastní, jednoduchý a bez cizích chráněných assetů.

## 12. Nefunkční požadavky

### Použitelnost

- Všechny uživatelské texty jsou česky.
- Formulář je srozumitelný i pro uživatele bez technických znalostí.
- Primární akce je vždy jasná.
- Chyby se zobrazují poblíž příslušných polí a také souhrnně, pokud je to užitečné.
- Ukládání musí mít zřetelnou zpětnou vazbu.
- Prázdný administrátorský přehled musí mít srozumitelný prázdný stav.

### Přístupnost

- Každé pole má viditelný popisek.
- Stránky lze ovládat klávesnicí.
- Focus stav je viditelný.
- Chyby jsou propojeny s poli.
- Dekorativní motivy nejsou čteny jako důležitý obsah.
- Barva není jediný nositel informace.
- Kontrast má být prakticky čitelný, i když design používá jemné tóny.
- Nadpisy mají logickou hierarchii.

### Responzivita

Minimálně ručně ověřit:

- úzký mobil přibližně 360 px,
- tablet přibližně 768 px,
- běžný desktop přibližně 1440 px.

Nesmí vznikat nechtěný horizontální posun celé stránky. Administrátorská data mohou mít vlastní řízený posun nebo mobilní kartový režim.

### Kvalita a údržba

- TypeScript bez zbytečného `any`.
- Jasné oddělení doménových typů, databázové vrstvy, autentifikace a UI.
- Sdílené komponenty pro opakující se části pozvánky a ovládací prvky.
- Žádné tajné hodnoty v commitu.
- `.env.example` obsahuje pouze názvy a bezpečné příklady.
- Aplikace má rozumné logování chyb bez úniku tokenů, kódu nebo osobních dat.
- Každá fáze musí skončit úspěšným lintem a typovou kontrolou; relevantní testy mají také projít.
- Změna databázového kontraktu musí být popsána v `POSTUP.md`.
- Není dovoleno „opravit“ problém vymazáním uživatelských dat bez výslovného souhlasu.

## 13. Konfigurace prostředí

Projekt má mít `.env.example` s vysvětlením potřebných proměnných. Očekávané skupiny:

- MongoDB připojení a název databáze,
- společný svatební kód nebo jeho bezpečný otisk,
- základní URL aplikace pro tvorbu magic linku,
- délka platnosti magic linku,
- délka platnosti session,
- vývojový režim doručení odkazu,
- volitelné SMTP hodnoty,
- seznam administrátorských e-mailů, pokud nebude bezpečně definován v serverové konfiguraci.

Skutečné hodnoty patří do `.env.local`, který nesmí být verzován.

## 14. Doporučená struktura aplikace

Přesné názvy může agent přizpůsobit aktuálním konvencím Next.js, ale odpovědnosti mají zůstat oddělené:

- `app/` – stránky, layouty a serverové route handlery,
- `components/` – sdílené prezentační a formulářové komponenty,
- `lib/auth/` – tokeny, session, role, cookie a doručení odkazu,
- `lib/db/` – připojení, kolekce a indexy,
- `lib/rsvp/` – schémata, typy a repozitář odpovědí,
- `lib/config/` – validovaná konfigurace prostředí,
- `styles/` nebo odpovídající místo – design tokeny a globální styly,
- `tests/` – testy,
- `docs/` – zadání, postup, fáze a reference.

## 15. Pravidla práce pro implementačního agenta

Agent musí:

1. Na začátku každé fáze přečíst `docs/ZADANI.md`, `docs/POSTUP.md`, aktuální soubor fáze a relevantní existující soubory aplikace.
2. Pracovat pouze v rozsahu aktuální fáze. Nezačínat další fázi „pro jistotu“.
3. Nejdříve stručně zkontrolovat stav projektu a upozornit na blokující rozpor.
4. Zachovat aplikaci po každé fázi spustitelnou.
5. Provádět malé, srozumitelné změny.
6. Nezavádět tajné hodnoty ani osobní testovací údaje do repozitáře.
7. Neobcházet serverovou autorizaci klientskou podmínkou.
8. Nepřidávat zbytečné knihovny, když lze úkol bezpečně vyřešit existujícími prostředky.
9. Nepřepisovat velké části funkčního kódu bez potřeby.
10. Neměnit produktové požadavky bez jasného upozornění.
11. Při nejasnosti zvolit nejmenší bezpečné řešení a rozhodnutí zapsat do `POSTUP.md`.
12. Spustit relevantní kontrolní příkazy, zejména lint, typovou kontrolu a testy.
13. Na konci fáze stručně vysvětlit provedené změny.
14. Uvést seznam vytvořených a změněných souborů.
15. Navrhnout ruční test proveditelný člověkem bez hlubší znalosti programování.
16. Uvést očekávaný výsledek testu.
17. Aktualizovat `docs/POSTUP.md` podle připravené šablony.
18. Neoznačit fázi za dokončenou, pokud známý kritický test neprochází.

## 16. Definice dokončení celého prototypu

Prototyp je dokončen, když:

- veřejná pozvánka odpovídá referenčnímu stylu,
- lze požádat o lokálně testovatelný magic link,
- platný odkaz vytvoří session a správně přesměruje podle role,
- neplatný, použitý a expirovaný odkaz je bezpečně odmítnut,
- host může uložit více osob a později je znovu načíst a upravit,
- host nemůže číst ani měnit cizí odpověď,
- správce vidí všechny osoby, souhrny, vyhledávání a filtry,
- běžný host se nedostane do administrace,
- správce nemůže přes UI ani API upravit RSVP,
- odhlášení ukončí session,
- hlavní stránky jsou použitelné na mobilu i desktopu,
- aplikace má srozumitelné loading, error, empty a success stavy,
- lint, typová kontrola a domluvené testy procházejí,
- nový člověk dokáže aplikaci lokálně spustit podle README,
- `docs/POSTUP.md` obsahuje pravdivý záznam všech dokončených fází a známých omezení.
