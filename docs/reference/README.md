# Referenční designové podklady

Tyto obrázky jsou určeny pouze jako vizuální reference při implementaci. Nemají se použít jako hotové celostránkové obrázky v aplikaci.

## Soubory

### `uvodni_stranka.png`

Referenční veřejná pozvánka a přihlašovací karta.

Důležité znaky:

- úzký středový sloupec s velkorysým prázdným prostorem,
- malý verzálkový nadpis s výrazným prostrkáním,
- velmi velké patkové „Anna & Petr“, přičemž ampersand je starorůžový,
- drobný motiv propojených prstenů,
- kurzivní pozvánkový text,
- výrazné datum a menší čas,
- jemný oddělovač s malým středovým symbolem,
- bílá až krémová přihlašovací karta s tenkým okrajem,
- podtržená pole bez těžkých rámečků,
- široké pilulkové starorůžové tlačítko,
- nenápadné zápatí.

### `stranka_hosta.png`

Referenční stránka hosta.

Důležité znaky:

- opakuje stejnou pozvánkovou část,
- po oddělovači je nízký zaoblený informační pruh s e-mailem a odhlášením,
- formulář má středový nadpis a vysvětlení,
- osoby jsou v samostatných kartách s jemným okrajem,
- popisky polí jsou malé verzálky s prostrkáním,
- hlavní textové pole působí jako podtržený řádek,
- rádio, checkbox a select používají jemný akcent,
- tlačítko „Přidat další osobu“ je světlé a přerušovaně orámované,
- doplňující zpráva je větší textarea,
- odeslání je velké starorůžové pilulkové tlačítko.

Funkční zadání navíc požaduje:

- odvoz ano/ne,
- podmíněné pole „kam“,
- volitelnou poznámku u každé osoby,
- možnost odebrání osoby,
- validační a stavové zprávy.

Tyto prvky doplňte ve stejném stylu.

### `stranka_spravce.png`

Referenční administrátorský přehled.

Důležité znaky:

- široký desktopový layout,
- velký patkový nadpis vlevo,
- odhlášení v pilulkovém obrysovém tlačítku vpravo,
- tenký oddělovač,
- čtyři souhrnné karty ve dvou sloupcích,
- ovládací řádek s vyhledáváním a zaoblenými filtry,
- tabulka s jemnými horizontálními linkami,
- malé verzálkové hlavičky,
- typ osoby jako světlý štítek,
- starorůžové zvýraznění kladné hodnoty přespání.

Funkční zadání navíc požaduje odvoz, úplnou poznámku a čas poslední úpravy. Tabulku podle toho rozšiřte. Na užších obrazovkách použijte řízený horizontální posun nebo kartové zobrazení.

## Doporučené design tokeny

Hodnoty jsou výchozí orientace, nikoli povinná pixelová specifikace:

- teplé pozadí: `#FBF7F3`,
- tmavý text: `#342D2A`,
- tlumený text: `#766A65`,
- starorůžový akcent: `#C78376`,
- světlý akcent: `#E9C3BA`,
- jemný okraj: `#E8DCD5`,
- karta: `#FFFDFC`.

## Typografie

Použijte dvě jasně odlišné rodiny:

- elegantní patkové písmo s kvalitní českou diakritikou pro jména, nadpisy, datum a kurzivní pozvánku,
- čisté bezpatkové písmo pro formuláře, tlačítka, popisky a tabulku.

Agent má ověřit, že vybrané fonty skutečně obsahují české znaky. Pokud by externí font komplikoval lokální spuštění, použijte bezpečný systémový fallback.

## Rozložení

- Veřejná a hostovská stránka mají užší hlavní obsah, přibližně 680 až 760 px.
- Admin má širší obsah, přibližně 1180 až 1280 px.
- Na mobilu se vnější okraje zmenší, ale vertikální rytmus a čitelnost zůstanou.
- Dotykové prvky mají mít pohodlnou velikost.
- Dlouhé e-maily a poznámky nesmí rozbít layout.

## Motiv prstenů

Vytvořte vlastní jednoduchý motiv jako malé inline SVG nebo čisté CSS:

- dva překrývající se tenké kruhy,
- jemná starorůžová linka,
- případně dva drobné diamantové nebo trojúhelníkové tvary nad kruhy.

Motiv je dekorativní a má být pro čtečky obrazovky skrytý.

## Co nedělat

- Nevkládat screenshot jako pozadí a nepřekrývat jej neviditelnými poli.
- Nekopírovat celé rozhraní do canvasu.
- Neobětovat čitelnost kvůli příliš světlému kontrastu.
- Nezablokovat mobilní uživatele desktopovou tabulkou bez řešení přetečení.
- Neimportovat reference do produkčního bundle, pokud je aplikace nepotřebuje.
