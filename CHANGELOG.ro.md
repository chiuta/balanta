# Jurnal de modificări

[English](CHANGELOG.md) · **Română** · [Français](CHANGELOG.fr.md) · [Italiano](CHANGELOG.it.md) · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Format: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Nelansat]

## [0.2.0] - 2026-11-17

### Adăugat
- Motorul din `src/engine.mjs`: voturi în JSON Lines (`votes.jsonl`, cu versiune și un cod de eroare numit pentru fiecare rând greșit), Elo, Bradley–Terry cu intervale bootstrap, față în față, influența poziției, perechi dintr-o sămânță, anonimizare, verificarea prompturilor, exporturi Markdown și HTML static.
- `scripts/rank.py`: același clasament în Python, fără biblioteci; testele verifică dacă e de acord cu motorul JavaScript la 1e-6.
- 92 de prompturi în `data/prompts/`: gramatică românească (30), cultură și istorie cu surse (20), raționament (20), traducere RO→EN și EN→RO (10) și un set în maghiară (12), toate cu note de referință; `schema.json` respinge acum câmpurile necunoscute și acceptă `sources`.
- Interfață în `src/ui.js`, `src/i18n.mjs` și `src/app.css`: pregătire, răspunsuri, vot orb, rezultate și prompturi proprii; opt limbi, teme întunecată și luminoasă, tastatură, funcționează de la 360 px lățime; datele rămân în browser.
- `docs/votes.md` și `docs/votes.ro.md`: formatul voturilor, algoritmii și lista de verificare a calității prompturilor (și în `CONTRIBUTING.md`).
- Teste: `npm test` (motorul, fișierele de date și textele interfeței) și teste de browser în hub (opt limbi, accesibilitate, stare stocată ostilă, import și export, ecrane mici).
- `src/` și `scripts/build.mjs`: singurul `index.html` este acum construit din surse, iar `--check` îl verifică.
- ISSUES_GOOD_FIRST și CODE_OF_CONDUCT traduse în toate cele opt limbi.
- README în engleză, română, franceză, italiană, spaniolă, portugheză, germană și maghiară: secțiuni de stare și de domeniu planificat (derivate din `ISSUES_GOOD_FIRST.md`).
- Instalabilă (PWA): `manifest.webmanifest`, `sw.js` și pictogramele sunt generate de kitul comun (`fff-kit/pwa`); pagina funcționează offline după prima vizită prin HTTPS.

### Modificat
- Fluxul de lucru rulează pe Ubuntu 26.04 cu Node.js 26 și rulează și testele, verificarea construcției și validarea datelor.
- `data/prompts/example.json` este acum un șablon cu id-ul rezervat `ro-culture-0000`; nu face parte din setul inclus.

## [0.1.0] - 2026-11-13

### Adăugat
- Schelet inițial: structură, schema de date sau primele exemple, ghiduri de contribuție în opt limbi.
