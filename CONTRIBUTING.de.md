# Mitmachen — BALANTA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · **Deutsch** · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.0 · Letzte Aktualisierung: 2026-11-17

1. Forke dieses Repository.
2. Kopiere `data/prompts/example.json` nach `data/prompts/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Regeln

- Ein Eintrag = eine Datei.
- Gib immer eine Quelle an.
- Steuere nur Material bei, das du rechtmäßig teilen darfst (keine kopierten geschützten Texte).
- Sei freundlich: siehe Verhaltenskodex.

## Prompts und Stimmen beitragen

1. Kopiere `data/prompts/example.json` nach `data/prompts/<lang>-<category>-<NNNN>.json`: Der Dateiname ist die `id`, mit der nächsten freien Nummer ihrer Gruppe (`ro-grammar-0031`).
2. Schreibe den `prompt` in der Sprache aus `lang`, als vollständige Frage, die sich ohne Öffnen eines Links beantworten lässt. In `reference_notes` steht in ein bis zwei Sätzen, was eine richtige Antwort enthalten muss. Für `culture` sind die Notizen und mindestens eine `https`-Quelle Pflicht.
3. Qualitäts-Checkliste: keine personenbezogenen Daten (Privatpersonen, E-Mail, Telefon, CNP, IBAN); kein kopierter urheberrechtlich geschützter Text (paraphrasieren; die App blockiert eine zitierte Passage ab 300 Zeichen); Rumänisch mit Komma-Diakritika (ș, ț), nie mit Cedille; eine klare richtige Antwort oder klare Kriterien; jeder Fakt an einer Quelle geprüft, zeitabhängige Fakten als solche markiert; eine ehrliche `difficulty`.
4. Führe `python scripts/validate.py` und `npm test` aus: Die Tests prüfen Schema, id und Nummerierung, Notizen und Quellen, die Regeln der Checkliste und Duplikate.
5. Um Stimmen beizusteuern, exportiere `votes.jsonl` aus der App (Format in `docs/votes.md`), prüfe sie mit `python scripts/rank.py votes.jsonl` und hänge sie an ein Issue oder einen Pull Request, zusammen mit `answers.jsonl` und den genauen Modellnamen, Versionen und Einstellungen; füge nie personenbezogene Daten hinzu.
6. Die Durchsicht der ungarischen und der Übersetzungs-Prompts durch Muttersprachler ist sehr willkommen: Eröffne ein Issue mit der id und dem Korrekturvorschlag.
