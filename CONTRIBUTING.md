# Contributing — BALANTA

**English** · [Română](CONTRIBUTING.ro.md) · [Français](CONTRIBUTING.fr.md) · [Italiano](CONTRIBUTING.it.md) · [Español](CONTRIBUTING.es.md) · [Português](CONTRIBUTING.pt.md) · [Deutsch](CONTRIBUTING.de.md) · [Magyar](CONTRIBUTING.hu.md)

Version: 0.2.1 · Last updated: 2026-11-20

1. Fork this repository.
2. Copy `data/prompts/example.json` into `data/prompts/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

## Rules

- One entry = one file.
- Always cite a source.
- Contribute only material you may legally share (no copied copyrighted text).
- Be kind: see the Code of Conduct.

## Adding prompts and votes

1. Copy `data/prompts/example.json` to `data/prompts/<lang>-<category>-<NNNN>.json`: the file name is the `id`, with the next free number of its group (`ro-grammar-0031`).
2. Write the `prompt` in the language given by `lang`, as a complete question that can be answered without opening a link. In `reference_notes` say what a correct answer must contain, in one or two sentences. For `culture` the notes and at least one `https` source are mandatory.
3. Quality checklist: no personal data (private people, e-mail, phone, CNP, IBAN); no copied copyrighted text (paraphrase; the app blocks a quoted passage of 300 characters or more); Romanian with comma-below diacritics (ș, ț), never the cedilla; one clear correct answer or clear criteria; every fact checked against a source, and time-sensitive facts marked as such; an honest `difficulty`.
4. Run `python scripts/validate.py` and `npm test`: the tests check the schema, the id and the numbering, the notes and sources, the checklist rules and duplicates.
5. To contribute votes, export `votes.jsonl` from the app (format in `docs/votes.md`), check it with `python scripts/rank.py votes.jsonl`, and attach it to an issue or pull request together with `answers.jsonl` and the exact model names, versions and settings; never include personal data.
6. Native-speaker review of the Hungarian and translation prompts is very welcome: open an issue with the id and the proposed fix.
