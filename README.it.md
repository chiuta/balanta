# BALANTA

[English](README.md) · [Română](README.ro.md) · [Français](README.fr.md) · **Italiano** · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Versione: 0.1.0 · Ultimo aggiornamento: 2026-11-14

🌐 https://balanta.chiuta.ro

> Valutazione cieca e affiancata di modelli IA in rumeno — prompt e voti pubblici.

Trade-free: nessun tracciamento, nessuna pubblicità, nessun account, funziona offline.

## Stato

Alpha: il repository contiene la struttura, lo schema dati o i primi esempi e le guide al contributo. L’ambito qui sotto è il piano, non ciò che funziona oggi.

## Ambito previsto

- Insiemi di prompt in romeno: 30 di grammatica (segni diacritici, `s-au/sau`, `i-a/ia`, sillabazione), 20 di cultura e storia con note di riferimento e fonti, 20 di ragionamento e 10 di traduzione RO↔EN con espressioni idiomatiche.
- Un insieme di prompt in ungherese (lang hu) per gli utenti della Transilvania.
- Un formato di esportazione dei voti (`votes.jsonl`) e classifica Bradley–Terry / Elo in `scripts/rank.py`.
- Anonimizzazione: nomi dei modelli rimossi dalle risposte mostrate, e una checklist di qualità dei prompt (niente dati personali, niente testi protetti).
- Un generatore di pagina statica dei risultati.

Nulla di tutto ciò è ancora implementato: ogni voce è un compito pronto in `ISSUES_GOOD_FIRST.md`.

## Contribuisci in 5 minuti

1. Fai il fork di questo repository.
2. Copia `data/prompts/example.json` in `data/prompts/` e modificalo.
3. Esegui `python scripts/validate.py`.
4. Apri una pull request: per i dati non serve programmare.

## Buone prime attività

Vedi `ISSUES_GOOD_FIRST.md` per attività già pronte.

## Licenza

Codice: MIT. Dati contribuiti: indica la fonte; sono pubblicati con la stessa licenza salvo diversa indicazione.

## Supporto

Se il progetto ti è utile, puoi [offrirmi un caffè](https://buymeacoffee.com/echo.of.the.strings).
