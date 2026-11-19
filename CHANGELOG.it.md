# Registro delle modifiche

[English](CHANGELOG.md) · [Română](CHANGELOG.ro.md) · [Français](CHANGELOG.fr.md) · **Italiano** · [Español](CHANGELOG.es.md) · [Português](CHANGELOG.pt.md) · [Deutsch](CHANGELOG.de.md) · [Magyar](CHANGELOG.hu.md)

Formato: [Keep a Changelog](https://keepachangelog.com/en/1.1.0/) · [SemVer](https://semver.org/).

## [Non rilasciato]

## [0.2.1] - 2026-11-20

### Modificato
- fff-kit 1.8.1: quando il browser blocca l’archiviazione o ne è privo (`localStorage`/`sessionStorage` generano un errore o mancano), la pagina si avvia con un’archiviazione temporanea in memoria invece di fermarsi; i dati non vengono conservati dopo la chiusura della pagina.
- fff-kit 1.8.1: la guida che ingrandisce i controlli piccoli a 44 px misura ora anche la larghezza del corpo della pagina e dell’elemento genitore, quindi una riga di pulsanti non può più uscire dallo schermo (il gruppo resta intatto quando l’ingrandimento lo renderebbe troppo largo).

## [0.2.0] - 2026-11-17

### Aggiunto
- Il motore in `src/engine.mjs`: voti in JSON Lines (`votes.jsonl`, con versione e un codice di errore nominato per ogni riga errata), Elo, Bradley–Terry con intervalli bootstrap, testa a testa, influenza della posizione, accoppiamenti da un seme, anonimizzazione, controllo dei prompt, esportazioni Markdown e HTML statico.
- `scripts/rank.py`: la stessa classifica in Python senza librerie; i test verificano che concordi con il motore JavaScript a 1e-6.
- 92 prompt in `data/prompts/`: grammatica rumena (30), cultura e storia con fonti (20), ragionamento (20), traduzione RO→EN ed EN→RO (10) e un set in ungherese (12), tutti con note di riferimento; `schema.json` ora rifiuta i campi sconosciuti e accetta `sources`.
- Interfaccia in `src/ui.js`, `src/i18n.mjs` e `src/app.css`: preparazione, risposte, voto alla cieca, risultati e prompt personali; otto lingue, temi scuro e chiaro, tastiera, funziona da 360 px di larghezza; i dati restano nel browser.
- `docs/votes.md` e `docs/votes.ro.md`: il formato dei voti, gli algoritmi e la lista di controllo della qualità dei prompt (anche in `CONTRIBUTING.md`).
- Test: `npm test` (il motore, i file di dati e i testi dell’interfaccia) e test del browser nell’hub (otto lingue, accessibilità, stato memorizzato ostile, importazione ed esportazione, schermi piccoli).
- `src/` e `scripts/build.mjs`: l’unico `index.html` è ora costruito dai sorgenti e `--check` lo verifica.
- ISSUES_GOOD_FIRST e CODE_OF_CONDUCT tradotti in tutte e otto le lingue.
- README in inglese, rumeno, francese, italiano, spagnolo, portoghese, tedesco e ungherese: sezioni di stato e di ambito previsto (derivate da `ISSUES_GOOD_FIRST.md`).
- Installabile (PWA): `manifest.webmanifest`, `sw.js` e le icone sono generati dal kit comune (`fff-kit/pwa`); la pagina funziona offline dopo la prima visita via HTTPS.

### Modificato
- Il workflow gira su Ubuntu 26.04 con Node.js 26 ed esegue anche i test, il controllo della build e la convalida dei dati.
- `data/prompts/example.json` è ora un modello con l’id riservato `ro-culture-0000`; non fa parte del set incluso.

## [0.1.0] - 2026-11-13

### Aggiunto
- Scheletro iniziale: struttura, schema dei dati o primi esempi, guide al contributo in otto lingue.
