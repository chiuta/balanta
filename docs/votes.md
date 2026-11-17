# BALANTA — vote format and algorithms

**English** · [Română](votes.ro.md)

Version: 0.2.0 · Last updated: 2026-11-17

This page describes the two files the app reads and writes, the arithmetic behind the ranking, how blind pairs are drawn, and the checklist for new prompts. The ranking is implemented twice, in `src/engine.mjs` and in `scripts/rank.py`, and the tests check that the two agree to 1e-6, so anyone can recompute a published table from its `votes.jsonl`.

## 1. `votes.jsonl`

[JSON Lines](https://jsonlines.org/): UTF-8 text, one JSON object per line, no commas between lines. Blank lines and lines that start with `#` are ignored, so you can leave notes in the file.

```jsonl votes
{"v":1,"prompt":"ro-grammar-0001","a":"model-1","b":"model-2","winner":"a","t":"2026-11-17T09:30:12Z"}
{"v":1,"prompt":"ro-grammar-0001","a":"model-3","b":"model-1","winner":"tie"}
{"v":1,"prompt":"ro-culture-0002","a":"model-2","b":"model-3","winner":"bad","t":"2026-11-17"}
```

| Field | Required | Meaning |
|---|---|---|
| `v` | no | Format version. If present it must be `1`; the app always writes it. |
| `prompt` | yes | Prompt id: 1–80 characters from `A–Z a–z 0–9 . _ : -`. For the bundled prompts it is the file name without `.json` (`ro-grammar-0001`); your own prompts are `custom-1`, `custom-2`, … |
| `a`, `b` | yes | Names of the two models: 1–40 characters, no space at the start or the end, no control characters, and `a` ≠ `b`. `a` is the model that was shown as A (left), `b` the one shown as B (right). |
| `winner` | yes | `a`, `b`, `tie`, or `bad` (both answers were bad: the vote is kept and counted per model, but it does not move the ranking). |
| `t` | no | A date (`2026-11-17`) or a date and time (`2026-11-17T09:30:12Z`). |

The app writes the keys in the order shown. Reading rules:

- Only Elo depends on the order of the lines (it is sequential). Bradley–Terry, the intervals and every other number do not.
- When votes are imported, a line identical to one already present (same `prompt`, `a`, `b`, `winner` and `t`) is skipped as a duplicate. Lines that differ in any field, including `t`, are different votes, so the same pair judged by two people counts twice.
- A file holds at most 200,000 votes; reading stops at the first line over the limit.
- The model names are free text. Use the exact name and version you tested (`model-x 2026-10`), and the same spelling on every line: `Model-X` and `model-x` are two models.

Error codes, as shown on import (`rank.py` prints the first 20 to the standard error stream):

| Code | The line… |
|---|---|
| `json` | is not valid JSON |
| `object` | is JSON but not an object |
| `version` | has a `v` other than `1` |
| `prompt` | has no `prompt`, or one that is not a valid id |
| `model` | has no `a` or `b`, or a name that is not valid |
| `same` | has the same model on both sides |
| `winner` | has a `winner` other than `a`, `b`, `tie`, `bad` |
| `time` | has a `t` that is not a date or a date and time |
| `many` | is past the 200,000-vote limit (reading stops) |

## 2. `answers.jsonl`

One line per answer. The file is only a convenience for moving the pasted answers between browsers or people; the ranking does not need it.

```jsonl answers
{"prompt":"ro-grammar-0001","model":"model-1","answer":"The text of the answer, exactly as the model wrote it."}
```

- `prompt` and `model` follow the same rules as above; `answer` is non-empty text of at most 20,000 characters. Error codes: `json`, `object`, `prompt`, `model`, `answer` (missing or empty), `long` (over 20,000 characters).
- Importing fills the answers of the models and prompts that are already in the session; lines about other models or prompts are skipped and counted. An imported answer replaces the one typed for the same prompt and model.
- The export contains the original text of the answers, not the anonymised text shown while voting.

## 3. How a blind session works

1. **Pairs.** For every prompt, every pair of models that both have an answer is one comparison, drawn once. The order of the comparisons and which model is shown as A depend only on the seed: the key of a comparison is the 32-bit FNV-1a hash of `seed|prompt id|first name|second name`, with the two names in alphabetical order (code-unit order, so the usual order for plain ASCII names). Comparisons are sorted by this key (then by prompt id); if the key is odd, the first name in that order is shown as A, otherwise as B. The same seed always gives the same sequence, and pasting a new answer does not reshuffle the comparisons that already exist.
2. **Anonymisation.** While you vote, the model names you typed in the setup, plus a built-in list of well-known names (ChatGPT, GPT, OpenAI, Claude, Anthropic, Gemini, Llama, Mistral, Qwen, DeepSeek, Grok, …), are replaced by `[model]` in the answers (whole words, any case). It is best effort: style, formatting and favourite phrases can still reveal a model, and a name you did not list can slip through, so read the answer text before you paste it if the source matters.
3. **Vote.** `A`, `B`, tie, or both bad (keys 1–4). `S` skips: the comparison goes to the end of the queue and nothing is recorded. Undo removes the last vote only. The app can show the model names after each vote (an option, off by default).

## 4. The arithmetic

Only votes with `winner` ≠ `bad` are counted. A tie is half a win for each side.

**Bradley–Terry (the main score).** Every model `i` has a strength `p_i`, and the chance that `i` beats `j` is `p_i / (p_i + p_j)`. The strengths are found with the minorisation–maximisation algorithm (Hunter, 2004):

```
p_i  ←  (W_i + 0.5) / ( 1/(p_i + 1)  +  Σ_j  n_ij / (p_i + p_j) )
rating_i = 1000 + 400 · log10(p_i)
```

`W_i` is the number of wins of `i` (ties count 0.5) and `n_ij` the number of counted votes between `i` and `j`. The extra terms are a **virtual opponent** of strength 1 (rating 1000) that each model plays once and draws; without it a model that has never lost (or never won) would get an infinite (or zero) strength. The iteration starts at `p = 1` and stops when no `ln p_i` changes by more than 1e-12 (at most 20,000 rounds). The virtual opponent fixes the scale, so compare the rows of one table with each other; do not compare numbers taken from different tables.

**Elo.** The votes are processed in file order, starting from 1000, with K = 32. For `A` against `B`: `expected_A = 1 / (1 + 10^((R_B − R_A) / 400))` and `R_A ← R_A + 32 · (score_A − expected_A)`, with the same change in the opposite direction for `B`. Elo is shown because it is familiar; it depends on the order of the votes, so Bradley–Terry is the number to use.

**95% interval (bootstrap).** The counted votes are drawn with replacement, as many as there are, and Bradley–Terry is computed again; this is repeated 200 times (60 in the app when there are more than 3,000 votes) with the generator `mulberry32` and the seed 1, so the result is reproducible. The interval is the 2.5th to the 97.5th percentile of the 200 ratings (the value at position `floor(q · (n − 1) + 0.5)` of the sorted list). A model that appears in fewer than 20 of the samples gets no interval. If two intervals overlap, the votes do not separate the two models.

**Other columns.** Win rate = (wins + ½ ties) / counted votes of that model. *Both bad* = votes marked `bad` that involve the model. *Position bias* = share of the decided votes (not ties, not bad) won by the model shown as A; with a random A/B assignment about 50% is expected, and a large departure means the voter prefers a side.

## 5. Reading the numbers

- With fewer than about 30 counted votes the app warns that the ranking is unstable: the intervals are very wide.
- The result holds for the prompts you used, in their language, with the model versions and settings you pasted. Write them down; they are part of the result.
- One voter is one opinion. For a shared benchmark merge the files of several voters (import skips exact duplicates) and run `rank.py` on the merged file; measuring how often voters agree is an open task.
- Bradley–Terry assumes one strength per model. The per-category and per-language tables show where this fails: a model can win grammar and lose culture.
- The bundled prompts were drafted with an AI assistant. The Hungarian prompts and the translation prompts are machine-written and need native review; the facts of the culture prompts were checked against the cited pages when they were written, and pages can change.

## 6. Prompt-quality checklist

The app runs the automatic part of this list on your own prompts before you can export them, and the tests run it on every bundled prompt.

| Check | Code | In the app |
|---|---|---|
| No e-mail address | `email` | blocks |
| No Romanian phone number (national or international) | `phone` | blocks |
| No personal numeric code (CNP) | `cnp` | blocks |
| No IBAN | `iban` | blocks |
| No control characters (new lines and tabs are allowed) | `ctrl` | blocks |
| At most 4,000 characters | `long` | blocks |
| At least 12 characters | `short` | blocks |
| No quoted passage of 300 characters or more (copied text) | `quote` | blocks |
| Romanian written with comma-below `ș ț`, not the cedilla `ş ţ` | `cedilla` | warns |
| Romanian text of 80 characters or more is written with diacritics (`ă â î ș ț`) | `diacritics` | warns |
| `culture`: reference notes and at least one `https` source | `notes`, `sources` | blocks |

These checks do not replace judgement. Also check by hand that: there is one clear correct answer or clear criteria; the question can be answered without opening a link; every fact was checked against a source and the facts that can change over time say so; the `difficulty` is honest; and the text does not describe a private person.

## 7. Checking a file

```
python scripts/rank.py votes.jsonl [--k 32] [--rounds 200] [--seed 1] [--no-ci] [--json]
```

It needs only Python 3, prints the same table as the app (rank, model, Bradley–Terry, interval, Elo, win rate, games, bad votes, position bias) or the whole summary as JSON, lists the first faulty lines on the standard error stream, and exits with status 2 when there is no valid vote. Because both programs use the same generator and the same rounding, the numbers match the app's.
