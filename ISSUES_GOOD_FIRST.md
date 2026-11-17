# Good first issues

**English** · [Română](ISSUES_GOOD_FIRST.ro.md) · [Français](ISSUES_GOOD_FIRST.fr.md) · [Italiano](ISSUES_GOOD_FIRST.it.md) · [Español](ISSUES_GOOD_FIRST.es.md) · [Português](ISSUES_GOOD_FIRST.pt.md) · [Deutsch](ISSUES_GOOD_FIRST.de.md) · [Magyar](ISSUES_GOOD_FIRST.hu.md)

- [ ] Have native speakers review the 12 Hungarian prompts and the 10 translation prompts (RO→EN, EN→RO): wording, reference notes and the choice of idioms
- [ ] Re-check the facts of the 22 culture prompts against their sources, add a second source to each, and mark the facts that can change over time
- [ ] Add 20 Romanian prompts for the `law` category (constitutional basics, consumer rights, contracts) with reference notes and official sources
- [ ] Add 20 Romanian prompts for the `science` category (physics, chemistry, biology, mathematics) with verified reference answers
- [ ] Add `creative` prompts (short text, rhyme, register) whose reference notes state clear judging criteria and that do not ask to reproduce protected works
- [ ] Add `code` prompts (short Python and JavaScript tasks with Romanian comments) whose reference notes include a test that checks the answer
- [ ] Add prompt sets in French, German, Italian, Spanish or Portuguese for the categories that fit (the interface and the schema already accept these languages)
- [ ] Write `scripts/agreement.py`: when two people vote the same pairs, report their agreement (Cohen’s kappa) and the pairs where they differ, with tests on a small example
- [ ] Write a helper script that turns the output of a local model runner into `answers.jsonl` (no API keys in the repository, no network calls from the page)
- [ ] Add a bootstrap over prompts (not only over votes) to `src/engine.mjs` and `scripts/rank.py`, show both intervals in the results and test that the two programs agree

Create them all on GitHub with `scripts/create_issues.sh` (needs the `gh` CLI).
