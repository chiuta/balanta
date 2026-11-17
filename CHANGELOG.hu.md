# Változásnapló

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · **Magyar**

Formátum: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Kiadatlan]

## [0.2.0] - 2026-11-17

### Hozzáadva
- A motor a `src/engine.mjs` fájlban: szavazatok JSON Lines formátumban (`votes.jsonl`, verziózva, minden hibás sorhoz névvel ellátott hibakóddal), Elo, Bradley–Terry bootstrap-intervallumokkal, egymás elleni mérleg, a pozíció hatása, párosítás egy magból, anonimizálás, promptellenőrzés, Markdown- és statikus HTML-exportok.
- `scripts/rank.py`: ugyanaz a rangsor Pythonban, könyvtárak nélkül; a tesztek ellenőrzik, hogy 1e-6 pontossággal egyezik a JavaScript-motorral.
- 92 prompt a `data/prompts/` mappában: román nyelvtan (30), kultúra és történelem forrásokkal (20), gondolkodás (20), RO→EN és EN→RO fordítás (10) és egy magyar készlet (12), mind referenciajegyzettel; a `schema.json` mostantól elutasítja az ismeretlen mezőket, és elfogadja a `sources` mezőt.
- Felület a `src/ui.js`, `src/i18n.mjs` és `src/app.css` fájlokban: előkészítés, válaszok, vak szavazás, eredmények és saját promptok; nyolc nyelv, sötét és világos téma, billentyűzet, 360 px szélességtől működik; az adatok a böngészőben maradnak.
- `docs/votes.md` és `docs/votes.ro.md`: a szavazatok formátuma, az algoritmusok és a promptok minőségi ellenőrzőlistája (a `CONTRIBUTING.md` fájlban is).
- Tesztek: `npm test` (a motor, az adatfájlok és a felületi szövegek) és böngészőtesztek a hubban (nyolc nyelv, akadálymentesség, ellenséges tárolt állapot, import és export, kis képernyők).
- A `src/` és a `scripts/build.mjs`: az egyetlen `index.html` mostantól forrásokból épül, és a `--check` ellenőrzi.
- Az ISSUES_GOOD_FIRST és a CODE_OF_CONDUCT lefordítva mind a nyolc nyelvre.
- README angolul, románul, franciául, olaszul, spanyolul, portugálul, németül és magyarul: állapot- és tervezett terjedelem-szakaszok (az `ISSUES_GOOD_FIRST.md` alapján).
- Telepíthető (PWA): a `manifest.webmanifest`, az `sw.js` és az ikonok a közös kitből (`fff-kit/pwa`) készülnek; az oldal az első HTTPS-látogatás után offline is működik.

### Módosítva
- A munkafolyamat Ubuntu 26.04 és Node.js 26 alatt fut, és a teszteket, a build-ellenőrzést meg az adatok ellenőrzését is futtatja.
- A `data/prompts/example.json` mostantól sablon a fenntartott `ro-culture-0000` azonosítóval; nem része a mellékelt készletnek.

## [0.1.0] - 2026-11-13

### Hozzáadva
- Kezdeti váz: szerkezet, adatséma vagy első példák, hozzájárulási útmutatók nyolc nyelven.
