# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

🌐 https://balanta.chiuta.ro

> Blinder Vergleich von KI-Modellen auf Rumänisch – Prompts und Stimmen offen einsehbar.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha, nutzbar: Die eine `index.html` vergleicht KI-Modelle blind, offline und ohne Server. Du fügst die Antworten von zwei bis acht Modellen auf die 92 mitgelieferten Prompts (Rumänisch, Englisch, Ungarisch) oder auf eigene ein, stimmst für A oder B ab, ohne die Modellnamen zu sehen, und erhältst eine Bradley–Terry- und Elo-Rangliste mit Konfidenzintervallen, eine statische Ergebnisseite und eine Datei `votes.jsonl`, die jeder mit `scripts/rank.py` nachrechnen kann. Nichts wird gesendet, und kein Modell wird aufgerufen.

## Was es kann

- Liefert 92 Prompts als Datendateien: rumänische Grammatik (30), Kultur und Geschichte mit Quellen (20), logisches Denken (20), Übersetzung RO→EN und EN→RO (10) und einen ungarischen Satz (12). Jeder Prompt hat Referenznotizen.
- Blindes Abstimmen: Du fügst die Antwort jedes Modells ein, die App verbirgt die Modellnamen in den Antworten („[model]“), legt Reihenfolge und A/B-Seiten aus einem Seed fest und speichert A, B, Unentschieden oder beide schlecht (Tasten 1–4, Rückgängig, optionale Anzeige nach jeder Stimme).
- Rangliste: Bradley–Terry (die Hauptwertung) und Elo, 95-%-Bootstrap-Intervalle, Siegquote, Quote „beide schlecht“, Positionseinfluss, Direktvergleich, Reihenfolge nach Kategorie und nach Sprache, Filter.
- Offene Formate: `votes.jsonl` und `answers.jsonl` (JSON Lines, beschrieben in `docs/votes.md`), Import, der Duplikate ignoriert und fehlerhafte Zeilen benennt, `scripts/rank.py`, das dieselbe Tabelle ohne Bibliotheken nachrechnet, eine statische Ergebnisseite und eine Markdown-Tabelle.
- Eigene Prompts, automatisch geprüft (E-Mail, Telefon, CNP, IBAN, lange Zitate, rumänische Diakritika) und als JSON-Datei für einen Pull Request exportiert; Oberfläche in acht Sprachen, dunkles und helles Design, Tastatur, nutzbar ab 360 px Breite; die Daten bleiben im Browser, ohne Netzwerk, ohne Tracking.
- Als App installierbar und nach dem ersten Besuch offline verfügbar, wenn sie über HTTPS ausgeliefert wird (ein Service Worker behält die Seite; sonst wird nichts gespeichert oder gesendet). Aus einer heruntergeladenen Datei geöffnet, funktioniert sie genauso, ohne Installation.

## Wie es funktioniert

- Eine JSON-Datei pro Prompt in `data/prompts/`, geprüft durch `schema.json`; `docs/votes.md` (und `docs/votes.ro.md`) beschreibt das Stimmenformat, die Algorithmen und die Qualitäts-Checkliste für Prompts.
- `src/engine.mjs` ist der Motor (ohne Bildschirm, ohne Netzwerk): Stimmenformat, Elo, Bradley–Terry (mit einem virtuellen Ankergegner, damit ungeschlagene und sieglose Modelle endliche Wertungen erhalten), Bootstrap, Paarbildung aus einem Hash des Seeds, Anonymisierung, Prompt-Prüfung und Exporte. `scripts/rank.py` rechnet dasselbe in Python ohne Bibliotheken nach; die Tests vergleichen beide auf 1e-6.
- `src/ui.js`, `src/i18n.mjs` und `src/app.css` bilden die Oberfläche; `node scripts/build.mjs` baut die eine `index.html` (`--check` prüft, ob sie übereinstimmt).
- `npm test` führt die Tests des Motors, der Datendateien und der Oberflächentexte aus; `python scripts/validate.py` prüft die JSON-Dateien; die Browsertests liegen im Hub. Für die Entwicklung braucht man Node.js 24 oder neuer; die Seite selbst braucht nur einen Browser, der ES2017 kennt.
- `manifest.webmanifest`, `sw.js` und die Symbole erzeugt `node scripts/build.mjs` über das gemeinsame Kit (Abschnitt `pwa` in `src/app.json`); `--check` prüft sie ebenfalls, und `npm test` stellt sicher, dass Manifest, Service-Worker-Version und CSP zur Seite passen.

## Grenzen und was die App nicht tut

- Sie ruft kein Modell auf: Die Antworten fügen Sie selbst ein. Es gibt keine API-Schlüssel, Konten oder Server.
- Blindes Abstimmen ist nur so gut wie die Anonymisierung: Die App verbirgt bekannte Modellnamen, aber der Stil einer Antwort kann den Urheber trotzdem verraten.
- Die Rangliste spiegelt die Vorlieben der Abstimmenden bei den gewählten Prompts wider; mit wenigen Stimmen oder Prompts sagt sie nichts Allgemeines über die Modelle aus.
- Die mitgelieferten Prompts wurden mit einem KI-Assistenten verfasst; besonders die ungarischen und die Übersetzungs-Prompts warten auf die Durchsicht durch Muttersprachler. Fakten in „Kultur“ haben Quellen, können aber veralten.
- Elo hängt von der Reihenfolge der Stimmen ab; Bradley–Terry nicht. Die Intervalle sind Näherungen (Bootstrap über Stimmen, nicht über Prompts).
- Die Daten liegen in localStorage (etwa 5 MB pro Website): Exportieren Sie bei großen Sitzungen regelmäßig votes.jsonl und answers.jsonl.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/prompts/example.json` nach `data/prompts/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.
5. Um den Motor oder die Oberfläche zu ändern, bearbeite `src/` und führe dann `npm test` und `node scripts/build.mjs` aus (siehe `CONTRIBUTING.md`).

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
