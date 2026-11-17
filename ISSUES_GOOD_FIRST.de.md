# Gute erste Aufgaben

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · **Deutsch** · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Muttersprachler die 12 ungarischen Prompts und die 10 Übersetzungs-Prompts (RO→EN, EN→RO) prüfen lassen: Formulierungen, Referenznotizen und Auswahl der Redewendungen
- [ ] Die Fakten der 22 Kultur-Prompts an ihren Quellen erneut prüfen, jedem eine zweite Quelle hinzufügen und Fakten markieren, die sich mit der Zeit ändern können
- [ ] 20 rumänische Prompts für die Kategorie `law` ergänzen (Verfassungsgrundlagen, Verbraucherrechte, Verträge), mit Referenznotizen und amtlichen Quellen
- [ ] 20 rumänische Prompts für die Kategorie `science` ergänzen (Physik, Chemie, Biologie, Mathematik), mit geprüften Referenzantworten
- [ ] `creative`-Prompts ergänzen (kurzer Text, Reim, Stilebene), deren Referenznotizen klare Bewertungskriterien nennen und die nicht verlangen, geschützte Werke wiederzugeben
- [ ] `code`-Prompts ergänzen (kurze Python- und JavaScript-Aufgaben mit rumänischen Kommentaren), deren Referenznotizen einen Test enthalten, der die Antwort prüft
- [ ] Prompt-Sätze auf Französisch, Deutsch, Italienisch, Spanisch oder Portugiesisch für passende Kategorien ergänzen (Oberfläche und Schema akzeptieren diese Sprachen bereits)
- [ ] `scripts/agreement.py` schreiben: Wenn zwei Personen über dieselben Paare abstimmen, ihre Übereinstimmung (Cohens Kappa) und die abweichenden Paare ausgeben, mit Tests an einem kleinen Beispiel
- [ ] Ein Hilfsskript schreiben, das die Ausgabe eines lokalen Modell-Runners in `answers.jsonl` umwandelt (keine API-Schlüssel im Repository, keine Netzwerkaufrufe aus der Seite)
- [ ] In `src/engine.mjs` und `scripts/rank.py` einen Bootstrap über Prompts (nicht nur über Stimmen) ergänzen, beide Intervalle in den Ergebnissen zeigen und testen, dass beide Programme übereinstimmen

Lege sie alle auf GitHub mit `scripts/create_issues.sh` an (benötigt die `gh`-CLI).
