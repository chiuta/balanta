# Buoni primi compiti

[English](ISSUES_GOOD_FIRST.md) · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · **Italiano** · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Far rivedere da madrelingua i 12 prompt in ungherese e i 10 prompt di traduzione (RO→EN, EN→RO): formulazioni, note di riferimento e scelta delle espressioni idiomatiche
- [ ] Ricontrollare i fatti dei 22 prompt di cultura sulle loro fonti, aggiungere una seconda fonte a ciascuno e segnalare i fatti che possono cambiare nel tempo
- [ ] Aggiungere 20 prompt in rumeno per la categoria `law` (nozioni costituzionali, diritti dei consumatori, contratti), con note di riferimento e fonti ufficiali
- [ ] Aggiungere 20 prompt in rumeno per la categoria `science` (fisica, chimica, biologia, matematica), con risposte di riferimento verificate
- [ ] Aggiungere prompt `creative` (testo breve, rima, registro) le cui note di riferimento indichino criteri di valutazione chiari e che non chiedano di riprodurre opere protette
- [ ] Aggiungere prompt `code` (brevi compiti in Python e JavaScript, con commenti in rumeno) le cui note di riferimento includano un test che verifichi la risposta
- [ ] Aggiungere set di prompt in francese, tedesco, italiano, spagnolo o portoghese per le categorie adatte (l’interfaccia e lo schema accettano già queste lingue)
- [ ] Scrivere `scripts/agreement.py`: quando due persone votano le stesse coppie, riportare il loro accordo (kappa di Cohen) e le coppie in cui divergono, con test su un piccolo esempio
- [ ] Scrivere uno script di aiuto che trasformi l’output di un esecutore locale di modelli in `answers.jsonl` (nessuna chiave API nel repository, nessuna chiamata di rete dalla pagina)
- [ ] Aggiungere a `src/engine.mjs` e a `scripts/rank.py` un bootstrap sui prompt (non solo sui voti), mostrare entrambi gli intervalli nei risultati e verificare che i due programmi concordino

Crea tutte le issue su GitHub con `scripts/create_issues.sh` (richiede la CLI `gh`).
