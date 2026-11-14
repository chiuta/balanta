# BALANTA

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.1.0 · Ultima actualizare: 2026-11-14

🌐 https://balanta.chiuta.ro

> Evaluare oarbă, față în față, a modelelor AI în limba română — prompturi și voturi deschise.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa: depozitul conține structura, schema de date sau primele exemple și ghidurile de contribuție. Domeniul de mai jos este planul, nu ceea ce funcționează azi.

## Domeniu planificat

- Seturi de prompturi în română: 30 de gramatică (diacritice, `s-au/sau`, `i-a/ia`, silabisire), 20 de cultură și istorie cu note de referință și surse, 20 de raționament și 10 de traducere RO↔EN cu expresii idiomatice.
- Un set de prompturi în limba maghiară (lang hu) pentru utilizatorii din Transilvania.
- Un format de export al voturilor (`votes.jsonl`) și clasament Bradley–Terry / Elo în `scripts/rank.py`.
- Anonimizare: numele modelelor sunt scoase din răspunsurile afișate, plus o listă de verificare a calității prompturilor (fără date personale, fără text sub drept de autor).
- Un generator pentru o pagină statică de rezultate.

Nimic din asta nu este implementat încă: fiecare punct este o sarcină gata pregătită în `ISSUES_GOOD_FIRST.md`.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/prompts/example.json` în `data/prompts/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
