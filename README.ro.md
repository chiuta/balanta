# BALANTA

[English](README.md) · **Română** · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versiune: 0.2.0 · Ultima actualizare: 2026-11-17

🌐 https://balanta.chiuta.ro

> Evaluare oarbă, față în față, a modelelor AI în limba română — prompturi și voturi deschise.

Fără comerț (trade-free): fără urmărire, fără reclame, fără conturi, funcționează offline.

## Stare

Alfa, utilizabil: singurul `index.html` compară modele de IA la orb, offline și fără server. Lipești răspunsurile a două până la opt modele la cele 92 de prompturi incluse (română, engleză, maghiară) sau la ale tale, votezi A sau B fără să vezi numele modelelor și primești un clasament Bradley–Terry și Elo cu intervale de încredere, o pagină statică de rezultate și un fișier `votes.jsonl` pe care oricine îl poate recalcula cu `scripts/rank.py`. Nu se trimite nimic undeva și nu se apelează niciun model.

## Ce face

- Include 92 de prompturi ca fișiere de date: gramatică românească (30), cultură și istorie cu surse (20), raționament (20), traducere RO→EN și EN→RO (10) și un set în maghiară (12). Fiecare prompt are note de referință.
- Vot orb: lipești răspunsul fiecărui model, aplicația ascunde numele modelelor din răspunsuri («[model]»), fixează ordinea și laturile A/B dintr-o sămânță și înregistrează A, B, egal sau ambele slabe (tastele 1–4, anulare, dezvăluire opțională după fiecare vot).
- Clasament: Bradley–Terry (scorul principal) și Elo, intervale bootstrap de 95%, rata de victorii, rata «ambele slabe», influența poziției, față în față, ordinea pe categorii și pe limbi, filtre.
- Formate deschise: `votes.jsonl` și `answers.jsonl` (JSON Lines, descrise în `docs/votes.md`), import care ignoră duplicatele și numește rândurile greșite, `scripts/rank.py` care recalculează același tabel fără biblioteci, o pagină statică de rezultate și un tabel Markdown.
- Prompturi proprii, verificate automat (e-mail, telefon, CNP, IBAN, citări lungi, diacritice românești) și exportate ca fișier JSON gata pentru un pull request; interfață în opt limbi, teme întunecată și luminoasă, tastatură, funcționează de la 360 px lățime; datele rămân în browser, fără rețea, fără urmărire.
- Se poate instala ca aplicație și funcționează offline după prima vizită, când e servită prin HTTPS (un service worker păstrează pagina; nu se stochează și nu se trimite nimic altceva). Deschisă dintr-un fișier descărcat, merge la fel, fără instalare.

## Cum funcționează

- Un fișier JSON pe prompt în `data/prompts/`, verificat de `schema.json`; `docs/votes.ro.md` (și `docs/votes.md`) descrie formatul voturilor, algoritmii și lista de verificare a calității prompturilor.
- `src/engine.mjs` este motorul (fără ecran, fără rețea): formatul voturilor, Elo, Bradley–Terry (cu un adversar virtual de ancorare, ca modelele neînvinse sau fără nicio victorie să primească scoruri finite), bootstrap, perechi din hash-ul sămânței, anonimizare, verificarea prompturilor și exporturi. `scripts/rank.py` refă aceleași calcule în Python, fără biblioteci; testele le compară pe amândouă la 1e-6.
- `src/ui.js`, `src/i18n.mjs` și `src/app.css` sunt interfața; `node scripts/build.mjs` construiește singurul `index.html` (`--check` verifică dacă se potrivește).
- `npm test` rulează testele motorului, ale fișierelor de date și ale textelor interfeței; `python scripts/validate.py` verifică fișierele JSON; testele de browser sunt în hub. Dezvoltarea cere Node.js 24 sau mai nou; pagina în sine cere doar un browser care cunoaște ES2017.
- `manifest.webmanifest`, `sw.js` și pictogramele sunt produse de `node scripts/build.mjs` prin kitul comun (secțiunea `pwa` din `src/app.json`); `--check` le verifică și el, iar `npm test` verifică dacă manifestul, versiunea service worker-ului și CSP-ul corespund paginii.

## Limite și ce nu face

- Nu apelează niciun model: răspunsurile le lipești tu. Nu există chei API, cont sau server.
- Votul orb e atât de bun cât e anonimizarea: aplicația ascunde numele de modele cunoscute, dar stilul unui răspuns poate trăda totuși autorul.
- Clasamentul arată preferințele celor care votează, pe prompturile alese; cu puține voturi sau puține prompturi nu spune nimic general despre modele.
- Prompturile incluse au fost redactate cu un asistent IA; cele în maghiară și cele de traducere așteaptă în mod special verificarea unor vorbitori nativi. Faptele din «cultură» au surse, dar se pot învechi.
- Elo depinde de ordinea voturilor; Bradley–Terry nu. Intervalele sunt aproximative (bootstrap peste voturi, nu peste prompturi).
- Datele stau în localStorage (aproximativ 5 MB pe site): pentru sesiuni mari exportă regulat votes.jsonl și answers.jsonl.

## Contribuie în 5 minute

1. Fă fork acestui depozit.
2. Copiază `data/prompts/example.json` în `data/prompts/` și editează-l.
3. Rulează `python scripts/validate.py`.
4. Deschide un pull request — pentru date nu e nevoie de programare.
5. Pentru a schimba motorul sau interfața, editează `src/`, apoi rulează `npm test` și `node scripts/build.mjs` (vezi `CONTRIBUTING.md`).

## Sarcini bune pentru început

Vezi `ISSUES_GOOD_FIRST.md` pentru sarcini gata pregătite.

## Licență

Cod: MIT. Datele contribuite: indică sursa; sunt publicate sub aceeași licență, dacă fișierul nu spune altfel.

## Sprijin

Dacă proiectul îți este util, poți [să-mi oferi o cafea](https://buymeacoffee.com/echo.of.the.strings).
