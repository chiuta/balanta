# Cum contribui — BALANTA

[English](CONTRIBUTING.md) · **Română** · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versiune: 0.2.1 · Ultima actualizare: 2026-11-20

1. Fă fork acestui depozit.
2. Copiază `data/prompts/example.json` în `data/prompts/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.

## Reguli

- O intrare = un fișier.
- Citează întotdeauna o sursă.
- Contribuie doar cu material pe care ai voie să-l partajezi (fără texte copiate protejate de drepturi de autor).
- Fii amabil: vezi Codul de conduită.

## Adăugarea de prompturi și voturi

1. Copiază `data/prompts/example.json` în `data/prompts/<lang>-<category>-<NNNN>.json`: numele fișierului este `id`, cu următorul număr liber din grupul lui (`ro-grammar-0031`).
2. Scrie `prompt` în limba dată de `lang`, ca o întrebare completă la care se poate răspunde fără să deschizi un link. În `reference_notes` spune ce trebuie să conțină un răspuns corect, în una-două propoziții. Pentru `culture` notele și cel puțin o sursă `https` sunt obligatorii.
3. Lista de verificare a calității: fără date personale (persoane private, e-mail, telefon, CNP, IBAN); fără text copiat protejat de drepturi de autor (parafrazează; aplicația blochează un pasaj citat de 300 de caractere sau mai mult); română cu diacritice cu virgulă (ș, ț), niciodată cu sedilă; un singur răspuns corect clar sau criterii clare; fiecare fapt verificat într-o sursă, iar faptele care se pot schimba în timp marcate ca atare; o `difficulty` sinceră.
4. Rulează `python scripts/validate.py` și `npm test`: testele verifică schema, id-ul și numerotarea, notele și sursele, regulile din lista de verificare și duplicatele.
5. Pentru a contribui cu voturi, exportă `votes.jsonl` din aplicație (formatul în `docs/votes.ro.md`), verifică-l cu `python scripts/rank.py votes.jsonl` și atașează-l la un issue sau la un pull request împreună cu `answers.jsonl` și cu numele exacte, versiunile și setările modelelor; nu include niciodată date personale.
6. Revizuirea de către vorbitori nativi a prompturilor în maghiară și de traducere este foarte binevenită: deschide un issue cu id-ul și corectura propusă.
