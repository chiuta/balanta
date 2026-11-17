# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

🌐 https://balanta.chiuta.ro

> KI-modellek vak, párhuzamos értékelése románul – nyílt promptok és szavazatok.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa, használható: az egyetlen `index.html` vakon, offline és szerver nélkül hasonlít össze MI-modelleket. Beillesztheted két–nyolc modell válaszait a 92 mellékelt promptra (román, angol, magyar) vagy a sajátjaidra, A-ra vagy B-re szavazol a modellnevek ismerete nélkül, és kapsz egy Bradley–Terry- és Elo-rangsort megbízhatósági intervallumokkal, egy statikus eredményoldalt és egy `votes.jsonl` fájlt, amelyet bárki újraszámolhat a `scripts/rank.py` segítségével. Semmi sem kerül elküldésre, és egyetlen modellt sem hív meg.

## Mit tud

- 92 promptot tartalmaz adatfájlként: román nyelvtan (30), kultúra és történelem forrásokkal (20), gondolkodás (20), RO→EN és EN→RO fordítás (10) és egy magyar készlet (12). Minden prompthoz tartozik referenciajegyzet.
- Vak szavazás: beilleszted az egyes modellek válaszát, az alkalmazás elrejti a modellneveket a válaszokban („[model]”), egy magból rögzíti a sorrendet és az A/B oldalakat, és rögzíti az A-t, a B-t, a döntetlent vagy a mindkettő gyenge értékelést (1–4 billentyűk, visszavonás, opcionális felfedés minden szavazat után).
- Rangsor: Bradley–Terry (a fő pontszám) és Elo, 95%-os bootstrap-intervallumok, győzelmi arány, „mindkettő gyenge” arány, a pozíció hatása, egymás elleni mérleg, sorrend kategóriánként és nyelvenként, szűrők.
- Nyílt formátumok: `votes.jsonl` és `answers.jsonl` (JSON Lines, a `docs/votes.md` írja le), import, amely figyelmen kívül hagyja az ismétlődéseket és megnevezi a hibás sorokat, a `scripts/rank.py`, amely könyvtárak nélkül újraszámolja ugyanazt a táblázatot, statikus eredményoldal és Markdown-táblázat.
- Saját promptok automatikus ellenőrzéssel (e-mail, telefon, CNP, IBAN, hosszú idézetek, román ékezetek), pull requestre kész JSON-fájlként exportálva; nyolc nyelvű felület, sötét és világos téma, billentyűzet, 360 px szélességtől működik; az adatok a böngészőben maradnak, hálózat és követés nélkül.
- Alkalmazásként telepíthető, és az első látogatás után offline is elérhető, ha HTTPS-en keresztül szolgálják ki (egy service worker megőrzi az oldalt; semmi mást nem tárol és nem küld). Letöltött fájlból megnyitva ugyanígy működik, telepítés nélkül.

## Hogyan működik

- Promptonként egy JSON-fájl a `data/prompts/` mappában, a `schema.json` ellenőrzi; a `docs/votes.md` (és a `docs/votes.ro.md`) leírja a szavazatok formátumát, az algoritmusokat és a promptok minőségi ellenőrzőlistáját.
- A `src/engine.mjs` a motor (képernyő és hálózat nélkül): szavazatformátum, Elo, Bradley–Terry (virtuális horgonyellenféllel, hogy a veretlen és a győzelem nélküli modellek véges pontszámot kapjanak), bootstrap, párosítás a mag hash-éből, anonimizálás, promptellenőrzés és exportok. A `scripts/rank.py` könyvtárak nélkül, Pythonban újraszámolja ugyanazt; a tesztek 1e-6 pontossággal összevetik a kettőt.
- A `src/ui.js`, `src/i18n.mjs` és `src/app.css` a felület; a `node scripts/build.mjs` építi az egyetlen `index.html` fájlt (a `--check` ellenőrzi, hogy egyezik-e).
- Az `npm test` futtatja a motor, az adatfájlok és a felületi szövegek tesztjeit; a `python scripts/validate.py` a JSON-fájlokat ellenőrzi; a böngészőtesztek a hubban vannak. A fejlesztéshez Node.js 24 vagy újabb kell; maga az oldal csak ES2017-et ismerő böngészőt igényel.
- A `manifest.webmanifest`, az `sw.js` és az ikonok a `node scripts/build.mjs` futtatásakor készülnek a közös kit révén (az `src/app.json` `pwa` szakasza); a `--check` is ellenőrzi őket, az `npm test` pedig azt, hogy a manifeszt, a service worker verziója és a CSP megegyezik az oldalval.

## Korlátok és amit nem tesz

- Egyetlen modellt sem hív meg: a válaszokat te illeszted be. Nincs API-kulcs, fiók vagy szerver.
- A vak szavazás annyit ér, amennyit az anonimizálás: az alkalmazás elrejti az ismert modellneveket, de egy válasz stílusa így is elárulhatja a szerzőjét.
- A rangsor a szavazók preferenciáit tükrözi a kiválasztott promptokon; kevés szavazattal vagy prompttal semmi általánosat nem mond a modellekről.
- A mellékelt promptokat MI-asszisztenssel fogalmaztuk; különösen a magyar és a fordítási promptok várják anyanyelvi beszélők átnézését. A „kultúra” kategória tényeihez tartoznak források, de elavulhatnak.
- Az Elo a szavazatok sorrendjétől függ, a Bradley–Terry nem. Az intervallumok közelítések (bootstrap a szavazatokon, nem a prompton).
- Az adatok a localStorage-ban vannak (oldalanként kb. 5 MB): nagy munkamenetnél exportáld rendszeresen a votes.jsonl és az answers.jsonl fájlt.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/prompts/example.json` fájlt a `data/prompts/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.
5. A motor vagy a felület módosításához szerkeszd a `src/` mappát, majd futtasd az `npm test` és a `node scripts/build.mjs` parancsot (lásd `CONTRIBUTING.md`).

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
