# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.2.1 · Ultimo aggiornamento: 2026-11-20

🌐 https://balanta.chiuta.ro

> Valutazione cieca e affiancata di modelli IA in rumeno — prompt e voti pubblici.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alfa, utilizzabile: l’unico `index.html` confronta modelli di IA alla cieca, offline e senza server. Incolli le risposte da due a otto modelli ai 92 prompt inclusi (rumeno, inglese, ungherese) o ai tuoi, voti A o B senza vedere i nomi dei modelli e ottieni una classifica Bradley–Terry ed Elo con intervalli di confidenza, una pagina di risultati statica e un file `votes.jsonl` che chiunque può ricalcolare con `scripts/rank.py`. Non viene inviato nulla e non viene chiamato nessun modello.

## Cosa fa

- Include 92 prompt come file di dati: grammatica rumena (30), cultura e storia con fonti (20), ragionamento (20), traduzione RO→EN ed EN→RO (10) e un set in ungherese (12). Ogni prompt ha note di riferimento.
- Voto alla cieca: incolli la risposta di ogni modello, l’app nasconde i nomi dei modelli nelle risposte («[model]»), fissa l’ordine e i lati A/B a partire da un seme e registra A, B, pari o entrambe scarse (tasti 1–4, annulla, rivelazione facoltativa dopo ogni voto).
- Classifica: Bradley–Terry (il punteggio principale) ed Elo, intervalli bootstrap al 95%, percentuale di vittorie, percentuale di «entrambe scarse», influenza della posizione, testa a testa, ordine per categoria e per lingua, filtri.
- Formati aperti: `votes.jsonl` e `answers.jsonl` (JSON Lines, descritti in `docs/votes.md`), importazione che ignora i duplicati e nomina le righe errate, `scripts/rank.py` che ricalcola la stessa tabella senza librerie, una pagina di risultati statica e una tabella Markdown.
- Prompt personali, controllati automaticamente (e-mail, telefono, CNP, IBAN, citazioni lunghe, segni diacritici rumeni) ed esportati come file JSON pronto per una pull request; interfaccia in otto lingue, temi scuro e chiaro, tastiera, funziona da 360 px di larghezza; i dati restano nel browser, senza rete, senza tracciamento.
- Installabile come app e disponibile offline dopo la prima visita quando è servita via HTTPS (un service worker conserva la pagina; nient’altro viene memorizzato o inviato). Aperta da un file scaricato funziona allo stesso modo, senza installazione.

## Come funziona

- Un file JSON per prompt in `data/prompts/`, controllato da `schema.json`; `docs/votes.md` (e `docs/votes.ro.md`) descrive il formato dei voti, gli algoritmi e la lista di controllo della qualità dei prompt.
- `src/engine.mjs` è il motore (senza schermo, senza rete): formato dei voti, Elo, Bradley–Terry (con un avversario virtuale di ancoraggio, così i modelli imbattuti o senza vittorie ottengono punteggi finiti), bootstrap, accoppiamenti a partire da un hash del seme, anonimizzazione, controllo dei prompt ed esportazioni. `scripts/rank.py` rifà lo stesso calcolo in Python senza librerie; i test confrontano i due a 1e-6.
- `src/ui.js`, `src/i18n.mjs` e `src/app.css` sono l’interfaccia; `node scripts/build.mjs` costruisce l’unico `index.html` (`--check` verifica che corrisponda).
- `npm test` esegue i test del motore, dei file di dati e dei testi dell’interfaccia; `python scripts/validate.py` controlla i file JSON; i test del browser sono nell’hub. Lo sviluppo richiede Node.js 24 o più recente; la pagina stessa richiede solo un browser che conosca ES2017.
- `manifest.webmanifest`, `sw.js` e le icone sono prodotti da `node scripts/build.mjs` tramite il kit comune (sezione `pwa` di `src/app.json`); anche `--check` li verifica, e `npm test` controlla che il manifest, la versione del service worker e la CSP corrispondano alla pagina.

## Limiti e cosa non fa

- Non chiama alcun modello: le risposte le incolli tu. Non ci sono chiavi API, account o server.
- Il voto alla cieca vale quanto l’anonimizzazione: l’app nasconde i nomi dei modelli noti, ma lo stile di una risposta può comunque tradirne l’autore.
- La classifica riflette le preferenze di chi vota sui prompt scelti; con pochi voti o pochi prompt non dice nulla di generale sui modelli.
- I prompt inclusi sono stati redatti con un assistente IA; quelli in ungherese e quelli di traduzione attendono in particolare la revisione di madrelingua. I fatti di «cultura» hanno fonti, ma possono diventare obsoleti.
- Elo dipende dall’ordine dei voti; Bradley–Terry no. Gli intervalli sono approssimativi (bootstrap sui voti, non sui prompt).
- I dati stanno in localStorage (circa 5 MB per sito): per sessioni grandi esporta regolarmente votes.jsonl e answers.jsonl.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/prompts/example.json` in `data/prompts/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.
5. Per modificare il motore o l’interfaccia, modifica `src/`, poi esegui `npm test` e `node scripts/build.mjs` (vedi `CONTRIBUTING.md`).

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
