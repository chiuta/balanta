# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · **Deutsch** · [Magyar](README.hu.md)

Version: 0.1.0 · Letzte Aktualisierung: 2026-11-14

🌐 https://balanta.chiuta.ro

> Blinder Vergleich von KI-Modellen auf Rumänisch – Prompts und Stimmen offen einsehbar.

Trade-free: kein Tracking, keine Werbung, keine Konten, funktioniert offline.

## Status

Alpha: Das Repository enthält die Struktur, das Datenschema oder die ersten Beispiele und die Beitragsleitfäden. Der Umfang unten ist der Plan, nicht das, was heute funktioniert.

## Geplanter Umfang

- Prompt-Sätze auf Rumänisch: 30 zur Grammatik (Diakritika, `s-au/sau`, `i-a/ia`, Silbentrennung), 20 zu Kultur und Geschichte mit Referenznotizen und Quellen, 20 zum logischen Denken und 10 zur Übersetzung RO↔EN mit Redewendungen.
- Ein ungarischsprachiger Prompt-Satz (lang hu) für Nutzer in Siebenbürgen.
- Ein Exportformat für Stimmen (`votes.jsonl`) und Wertung nach Bradley–Terry / Elo in `scripts/rank.py`.
- Anonymisierung: Modellnamen werden aus den angezeigten Antworten entfernt, dazu eine Qualitäts-Checkliste für Prompts (keine personenbezogenen Daten, keine urheberrechtlich geschützten Texte).
- Ein Generator für eine statische Ergebnisseite.

Nichts davon ist bisher umgesetzt: Jeder Punkt ist eine fertig vorbereitete Aufgabe in `ISSUES_GOOD_FIRST.md`.

## In 5 Minuten mitmachen

1. Forke dieses Repository.
2. Kopiere `data/prompts/example.json` nach `data/prompts/` und bearbeite die Datei.
3. Führe `python scripts/validate.py` aus.
4. Öffne einen Pull Request – für Daten ist keine Programmierung nötig.

## Gute erste Aufgaben

Siehe `ISSUES_GOOD_FIRST.md` für fertige Aufgaben.

## Lizenz

Code: MIT. Beigesteuerte Daten: Quelle angeben; sie stehen unter derselben Lizenz, sofern die Datei nichts anderes sagt.

## Unterstützung

Wenn dir das Projekt nützt, kannst du [mir einen Kaffee spendieren](https://buymeacoffee.com/echo.of.the.strings).
