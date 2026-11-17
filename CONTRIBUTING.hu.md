# Közreműködés — BALANTA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · **Magyar**

Verzió: 0.2.0 · Utolsó frissítés: 2026-11-17

1. Forkold ezt a tárolót.
2. Másold a `data/prompts/example.json` fájlt a `data/prompts/` mappába, és szerkeszd.
3. Futtasd: `python scripts/validate.py`.
4. Nyiss egy pull requestet – adatokhoz nem kell programozni.

## Szabályok

- Egy bejegyzés = egy fájl.
- Mindig add meg a forrást.
- Csak olyan anyagot küldj, amelyet jogszerűen megoszthatsz (nincs másolt, védett szöveg).
- Légy kedves: lásd az Etikai kódexet.

## Promptok és szavazatok hozzáadása

1. Másold a `data/prompts/example.json` fájlt a `data/prompts/<lang>-<category>-<NNNN>.json` helyre: a fájlnév az `id`, a csoportja következő szabad számával (`ro-grammar-0031`).
2. Írd meg a `prompt` mezőt a `lang` által megadott nyelven, olyan teljes kérdésként, amelyre hivatkozás megnyitása nélkül is lehet válaszolni. A `reference_notes` mezőben egy-két mondatban írd le, mit kell tartalmaznia a helyes válasznak. A `culture` kategóriánál a jegyzet és legalább egy `https` forrás kötelező.
3. Minőségi ellenőrzőlista: nincs személyes adat (magánszemélyek, e-mail, telefon, CNP, IBAN); nincs másolt, jogvédett szöveg (fogalmazd át; az alkalmazás blokkolja a 300 vagy több karakteres idézett részletet); román szöveg vesszős ékezetekkel (ș, ț), soha nem cedillával; egyetlen egyértelmű helyes válasz vagy egyértelmű szempontok; minden tény forrással ellenőrizve, az idővel változó tények megjelölve; őszinte `difficulty`.
4. Futtasd a `python scripts/validate.py` és az `npm test` parancsot: a tesztek ellenőrzik a sémát, az id-t és a számozást, a jegyzeteket és a forrásokat, az ellenőrzőlista szabályait és az ismétlődéseket.
5. Szavazatok beküldéséhez exportáld a `votes.jsonl` fájlt az alkalmazásból (formátum: `docs/votes.md`), ellenőrizd a `python scripts/rank.py votes.jsonl` paranccsal, és csatold egy issue-hoz vagy pull requesthez az `answers.jsonl` fájllal, valamint a modellek pontos nevével, verziójával és beállításaival; soha ne tegyél bele személyes adatot.
6. A magyar és a fordítási promptok anyanyelvi átnézését nagyon szívesen fogadjuk: nyiss egy issue-t az id-vel és a javasolt javítással.
