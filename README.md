# BALANTA

**English** · [Română](README.ro.md) · [Français](README.fr.md) · [Italiano](README.it.md) · [Español](README.es.md) · [Português](README.pt.md) · [Deutsch](README.de.md) · [Magyar](README.hu.md)

Version: 0.1.0 · Last updated: 2026-11-14

🌐 https://balanta.chiuta.ro

> Blind, side-by-side evaluation of AI models in Romanian — prompts and votes kept in the open.

Trade-free: no tracking, no ads, no accounts, works offline.

## Status

Alpha: the repository holds the structure, the data schema or the first examples and the contribution guides. The scope below is the plan, not what works today.

## Planned scope

- Romanian prompt sets: 30 grammar prompts (diacritics, `s-au/sau`, `i-a/ia`, hyphenation), 20 on culture and history with reference notes and sources, 20 reasoning prompts and 10 RO↔EN translation prompts with idioms.
- A Hungarian-language prompt set (lang hu) for Transylvanian users.
- A vote-export format (`votes.jsonl`) and scoring with Bradley–Terry / Elo in `scripts/rank.py`.
- Anonymisation: model names stripped from the answers shown, and a prompt-quality checklist (no personal data, no copyrighted text).
- A generator for a static results page.

None of this is implemented yet: each item is a ready-made task in `ISSUES_GOOD_FIRST.md`.

## Contribute in 5 minutes

1. Fork this repository.
2. Copy `data/prompts/example.json` into `data/prompts/` and edit it.
3. Run `python scripts/validate.py`.
4. Open a pull request — data contributions need no coding.

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
