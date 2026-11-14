# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · **Magyar**

Verzió: 0.1.0 · Utolsó frissítés: 2026-11-14

🌐 https://balanta.chiuta.ro

> KI-modellek vak, párhuzamos értékelése románul – nyílt promptok és szavazatok.

Trade-free: nincs követés, nincs reklám, nincs fiók, offline is működik.

## Állapot

Alfa: a tároló a szerkezetet, az adatsémát vagy az első példákat és a közreműködési útmutatókat tartalmazza. Az alábbi terjedelem a terv, nem a ma működő állapot.

## Tervezett terjedelem

- Román nyelvű promptkészletek: 30 nyelvtani (ékezetek, `s-au/sau`, `i-a/ia`, elválasztás), 20 kultúráról és történelemről hivatkozási jegyzetekkel és forrásokkal, 20 gondolkodtató és 10 RO↔EN fordítási közmondásokkal.
- Magyar nyelvű promptkészlet (lang hu) erdélyi felhasználóknak.
- Szavazat-exportformátum (`votes.jsonl`) és Bradley–Terry / Elo pontozás a `scripts/rank.py` fájlban.
- Anonimizálás: a modellnevek eltávolítása a megjelenített válaszokból, és promptminőségi ellenőrzőlista (személyes adat és jogvédett szöveg nélkül).
- Generátor statikus eredményoldalhoz.

Ezek közül még semmi sincs megvalósítva: minden pont kész feladat az `ISSUES_GOOD_FIRST.md` fájlban.

## Járulj hozzá 5 perc alatt

1. Forkold ezt a tárolót.
2. Másold a `data/prompts/example.json` fájlt a `data/prompts/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.

## Jó első feladatok

Kész feladatok: `ISSUES_GOOD_FIRST.md`.

## Licenc

Kód: MIT. A beküldött adatoknál add meg a forrást; azonos licenc alatt jelennek meg, ha a fájl mást nem mond.

## Támogatás

Ha hasznos a projekt, [meghívhatsz egy kávéra](https://buymeacoffee.com/echo.of.the.strings).
