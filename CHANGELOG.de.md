# Änderungsprotokoll

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · **Deutsch** · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Unveröffentlicht]

## [0.2.0] - 2026-11-17

### Hinzugefügt
- Der Motor in `src/engine.mjs`: Stimmen als JSON Lines (`votes.jsonl`, versioniert, mit benanntem Fehlercode für jede fehlerhafte Zeile), Elo, Bradley–Terry mit Bootstrap-Intervallen, Direktvergleich, Positionseinfluss, Paarbildung aus einem Seed, Anonymisierung, Prompt-Prüfung, Markdown- und statische HTML-Exporte.
- `scripts/rank.py`: dieselbe Rangliste in Python ohne Bibliotheken; die Tests prüfen, dass sie mit dem JavaScript-Motor auf 1e-6 übereinstimmt.
- 92 Prompts in `data/prompts/`: rumänische Grammatik (30), Kultur und Geschichte mit Quellen (20), logisches Denken (20), Übersetzung RO→EN und EN→RO (10) und ein ungarischer Satz (12), alle mit Referenznotizen; `schema.json` lehnt jetzt unbekannte Felder ab und akzeptiert `sources`.
- Oberfläche in `src/ui.js`, `src/i18n.mjs` und `src/app.css`: Vorbereitung, Antworten, blindes Abstimmen, Ergebnisse und eigene Prompts; acht Sprachen, dunkles und helles Design, Tastatur, nutzbar ab 360 px Breite; die Daten bleiben im Browser.
- `docs/votes.md` und `docs/votes.ro.md`: das Stimmenformat, die Algorithmen und die Qualitäts-Checkliste für Prompts (auch in `CONTRIBUTING.md`).
- Tests: `npm test` (der Motor, die Datendateien und die Oberflächentexte) und Browsertests im Hub (acht Sprachen, Barrierefreiheit, feindlicher gespeicherter Zustand, Import und Export, kleine Bildschirme).
- `src/` und `scripts/build.mjs`: Die eine `index.html` wird jetzt aus Quellen gebaut, `--check` prüft sie.
- ISSUES_GOOD_FIRST und CODE_OF_CONDUCT in alle acht Sprachen übersetzt.
- README auf Englisch, Rumänisch, Französisch, Italienisch, Spanisch, Portugiesisch, Deutsch und Ungarisch: Abschnitte zu Status und geplantem Umfang (abgeleitet aus `ISSUES_GOOD_FIRST.md`).
- Installierbar (PWA): `manifest.webmanifest`, `sw.js` und die Symbole werden vom gemeinsamen Kit (`fff-kit/pwa`) erzeugt; die Seite funktioniert nach dem ersten Besuch über HTTPS offline.

### Geändert
- Der Workflow läuft auf Ubuntu 26.04 mit Node.js 26 und führt auch die Tests, die Build-Prüfung und die Datenvalidierung aus.
- `data/prompts/example.json` ist jetzt eine Vorlage mit der reservierten id `ro-culture-0000`; sie gehört nicht zum mitgelieferten Satz.

## [0.1.0] - 2026-11-13

### Hinzugefügt
- Erstes Gerüst: Struktur, Datenschema oder erste Beispiele, Beitragsanleitungen in acht Sprachen.
