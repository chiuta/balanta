# Come contribuire — BALANTA

[English](CONTRIBUTING.md) · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · **Italiano** · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Versione: 0.2.1 · Ultimo aggiornamento: 2026-11-20

1. Fai il fork di questo repository.
2. Copia `data/prompts/example.json` in `data/prompts/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Regole

- Una voce = un file.
- Cita sempre una fonte.
- Contribuisci solo con materiale che puoi condividere legalmente (niente testi protetti copiati).
- Sii gentile: vedi il Codice di condotta.

## Aggiungere prompt e voti

1. Copia `data/prompts/example.json` in `data/prompts/<lang>-<category>-<NNNN>.json`: il nome del file è l’`id`, con il prossimo numero libero del suo gruppo (`ro-grammar-0031`).
2. Scrivi il `prompt` nella lingua indicata da `lang`, come una domanda completa a cui si può rispondere senza aprire un link. In `reference_notes` indica cosa deve contenere una risposta corretta, in una o due frasi. Per `culture` le note e almeno una fonte `https` sono obbligatorie.
3. Lista di controllo della qualità: nessun dato personale (persone private, e-mail, telefono, CNP, IBAN); nessun testo protetto copiato (parafrasa; l’app blocca un passo citato di 300 caratteri o più); rumeno con i segni diacritici con virgola (ș, ț), mai con la cediglia; una sola risposta corretta chiara o criteri chiari; ogni fatto verificato su una fonte, e i fatti che possono cambiare nel tempo indicati come tali; una `difficulty` onesta.
4. Esegui `python scripts/validate.py` e `npm test`: i test controllano lo schema, l’id e la numerazione, le note e le fonti, le regole della lista di controllo e i duplicati.
5. Per contribuire con dei voti, esporta `votes.jsonl` dall’app (formato in `docs/votes.md`), controllalo con `python scripts/rank.py votes.jsonl` e allegalo a una issue o a una pull request insieme a `answers.jsonl` e ai nomi esatti, alle versioni e alle impostazioni dei modelli; non includere mai dati personali.
6. La revisione da parte di madrelingua dei prompt in ungherese e di traduzione è molto gradita: apri una issue con l’id e la correzione proposta.
