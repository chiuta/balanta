# BALANTA

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.2.0 · Last updated: 2026-11-17

🌐 https://balanta.chiuta.ro

> Blind, side-by-side evaluation of AI models in Romanian — prompts and votes kept in the open.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha, usable: the single `index.html` compares AI models blind, offline and without a server. You paste the answers of two to eight models to the 92 bundled prompts (Romanian, English, Hungarian) or to your own, vote A or B without seeing model names, and get a Bradley–Terry and Elo ranking with confidence intervals, a static results page and a `votes.jsonl` file that anyone can recompute with `scripts/rank.py`. Nothing is sent anywhere and no model is called.

## What it does

- Ships 92 prompts as data files: Romanian grammar (30), culture and history with sources (20), reasoning (20), translation RO→EN and EN→RO (10) and a Hungarian set (12). Every prompt has reference notes.
- Blind voting: you paste each model’s answer, the app hides model names inside the answers (“[model]”), fixes the order and the A/B sides from a seed, and records A, B, tie or both bad (keys 1–4, undo, optional reveal after each vote).
- Ranking: Bradley–Terry (the main score) and Elo, 95% bootstrap intervals, win rate, both-bad rate, position bias, head to head, order by category and by language, filters.
- Open formats: `votes.jsonl` and `answers.jsonl` (JSON Lines, described in `docs/votes.md`), import that ignores duplicates and names faulty lines, `scripts/rank.py` that recomputes the same table without libraries, a static results page and a Markdown table.
- Your own prompts, checked automatically (e-mail, phone, CNP, IBAN, long quotations, Romanian diacritics) and exported as a JSON file ready for a pull request; interface in eight languages, dark and light themes, keyboard, works from 360 px wide; data stays in the browser, no network, no tracking.
- Installable as an app and available offline after the first visit when served over HTTPS (a service worker keeps the page; nothing else is stored or sent). Opened from a downloaded file it works the same, without installation.

## How it works

- One JSON file per prompt in `data/prompts/`, checked by `schema.json`; `docs/votes.md` (and `docs/votes.ro.md`) describes the vote format, the algorithms and the prompt-quality checklist.
- `src/engine.mjs` is the engine (no screen, no network): vote format, Elo, Bradley–Terry (with a virtual anchor opponent so that unbeaten and winless models get finite ratings), bootstrap, pairing from a hash of the seed, anonymisation, prompt checks and exports. `scripts/rank.py` redoes the same arithmetic in Python without libraries; the tests compare both to 1e-6.
- `src/ui.js`, `src/i18n.mjs` and `src/app.css` are the interface; `node scripts/build.mjs` builds the single `index.html` (`--check` verifies that it matches).
- `npm test` runs the tests of the engine, the data files and the interface texts; `python scripts/validate.py` checks the JSON files; the browser tests are in the hub. Development needs Node.js 24 or newer; the page itself only needs a browser that knows ES2017.
- `manifest.webmanifest`, `sw.js` and the icons are produced by `node scripts/build.mjs` through the shared kit (`pwa` in `src/app.json`); `--check` also verifies them, and `npm test` checks that the manifest, the service worker version and the CSP match the page.

## Limits and what it does not do

- It calls no model: you paste the answers yourself. There are no API keys, accounts or servers.
- Blind voting is only as good as the anonymisation: the app hides known model names, but the style of an answer can still give its author away.
- The ranking reflects the preferences of the voters on the chosen prompts; with few votes or few prompts it says nothing general about the models.
- The bundled prompts were drafted with an AI assistant; the Hungarian and translation ones in particular await review by native speakers. Facts in “culture” have sources but can become outdated.
- Elo depends on the order of the votes; Bradley–Terry does not. The intervals are approximate (bootstrap over votes, not over prompts).
- Data lives in localStorage (about 5 MB per site): for large sessions, export votes.jsonl and answers.jsonl regularly.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/prompts/example.json` into `data/prompts/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.
5. To change the engine or the interface, edit `src/`, then run `npm test` and `node scripts/build.mjs` (see `CONTRIBUTING.md`).

## Good first issues

See `ISSUES_GOOD_FIRST.md` for ready-made tasks.

## License

Code: MIT. Contributed data: state its source; it is released under the same licence unless the file says otherwise.

## Support

If this project is useful, you can [buy me a coffee](https://buymeacoffee.com/echo.of.the.strings).

## Contributors

<!-- ALL-CONTRIBUTORS-LIST:START -->
<!-- ALL-CONTRIBUTORS-LIST:END -->

Add yourself with `@all-contributors please add @you for data` in your pull request.
