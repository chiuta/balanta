#!/usr/bin/env python3
"""Rank models from a votes.jsonl file (format: docs/votes.md). No dependencies.

Same algorithms as src/engine.mjs (tests compare the two):
  * Elo, sequential in file order, K=32, start 1000, tie = 0.5, "bad" votes are not counted;
  * Bradley-Terry by the MM algorithm with a virtual opponent of strength 1 (1000 on the Elo scale);
  * 95% bootstrap interval (resampling the votes with replacement, mulberry32 generator, fixed seed).

Usage: python scripts/rank.py votes.jsonl [--k 32] [--rounds 200] [--seed 1] [--no-ci] [--json]
"""
import json, math, re, sys

M = 0xFFFFFFFF
WINNERS = ["a", "b", "tie", "bad"]
CTRL = re.compile(r"[\u0000-\u001f\u007f]")


def imul(a, b):
    return (a * b) & M


def mulberry32(seed):
    a = seed & M

    def rnd():
        nonlocal a
        a = (a + 0x6D2B79F5) & M
        t = a
        t = imul(t ^ (t >> 15), t | 1)
        t = (t ^ ((t + imul(t ^ (t >> 7), t | 61)) & M)) & M
        return ((t ^ (t >> 14)) & M) / 4294967296

    return rnd


def check_model(n):
    return isinstance(n, str) and n.strip() == n and 1 <= len(n) <= 40 and not CTRL.search(n)


def check_vote(o):
    """Error code or ''. Same codes as the JavaScript engine."""
    if not isinstance(o, dict):
        return "object"
    if "v" in o and not (isinstance(o["v"], (int, float)) and not isinstance(o["v"], bool) and o["v"] == 1):
        return "version"
    if not isinstance(o.get("prompt"), str) or not re.fullmatch(r"[A-Za-z0-9._:-]{1,80}", o["prompt"], re.ASCII):
        return "prompt"
    if not check_model(o.get("a")) or not check_model(o.get("b")):
        return "model"
    if o["a"] == o["b"]:
        return "same"
    if o.get("winner") not in WINNERS:
        return "winner"
    if "t" in o and not (isinstance(o["t"], str) and re.fullmatch(r"[0-9]{4}-[0-9]{2}-[0-9]{2}(T[0-9:.]{4,}(Z|[+-][0-9]{2}:[0-9]{2})?)?", o["t"])):
        return "time"
    return ""


def parse_votes(text):
    votes, errors = [], []
    for i, line in enumerate(text.splitlines(), 1):
        s = line.strip()
        if not s or s.startswith("#"):
            continue
        if len(votes) >= 200000:
            errors.append((i, "many"))
            break
        try:
            o = json.loads(s)
        except ValueError:
            errors.append((i, "json"))
            continue
        bad = check_vote(o)
        if bad:
            errors.append((i, bad))
            continue
        votes.append({"prompt": o["prompt"], "a": o["a"], "b": o["b"], "winner": o["winner"]})
    return votes, errors


def score(v):
    return 1.0 if v["winner"] == "a" else 0.0 if v["winner"] == "b" else 0.5


def elo(votes, k=32):
    r, n = {}, {}
    for v in votes:
        if v["winner"] == "bad":
            continue
        for m in (v["a"], v["b"]):
            if m not in r:
                r[m], n[m] = 1000.0, 0
        ea = 1 / (1 + 10 ** ((r[v["b"]] - r[v["a"]]) / 400))
        sa = score(v)
        r[v["a"]] += k * (sa - ea)
        r[v["b"]] += k * ((1 - sa) - (1 - ea))
        n[v["a"]] += 1
        n[v["b"]] += 1
    return r, n


def bradley_terry(votes):
    idx, names, rows = {}, [], []
    for v in votes:
        if v["winner"] == "bad":
            continue
        for m in (v["a"], v["b"]):
            if m not in idx:
                idx[m] = len(names)
                names.append(m)
        rows.append((idx[v["a"]], idx[v["b"]], score(v)))
    N = len(names)
    w = [0.0] * N
    n = [[0] * N for _ in range(N)]
    for i, j, s in rows:
        w[i] += s
        w[j] += 1 - s
        n[i][j] += 1
        n[j][i] += 1
    p = [1.0] * N
    converged = False
    for _ in range(20000):
        q = [0.0] * N
        delta = 0.0
        for i in range(N):
            den = 1 / (p[i] + 1)
            for j in range(N):
                if n[i][j]:
                    den += n[i][j] / (p[i] + p[j])
            q[i] = (w[i] + 0.5) / den
            delta = max(delta, abs(math.log(q[i]) - math.log(p[i])))
        p = q
        if delta < 1e-12:
            converged = True
            break
    return {nm: 1000 + 400 * math.log10(p[i]) for i, nm in enumerate(names)}, converged


def percentile(a, q):
    return a[min(len(a) - 1, max(0, int(q * (len(a) - 1) + 0.5)))]


def bootstrap(votes, rounds=200, seed=1):
    pool = [v for v in votes if v["winner"] != "bad"]
    rnd = mulberry32(seed)
    acc = {}
    if pool:
        for _ in range(rounds):
            sample = [pool[int(rnd() * len(pool))] for _ in pool]
            for nm, r in bradley_terry(sample)[0].items():
                acc.setdefault(nm, []).append(r)
    lo, hi = {}, {}
    for nm, a in acc.items():
        a.sort()
        if len(a) < min(20, rounds):
            lo[nm] = hi[nm] = None
        else:
            lo[nm], hi[nm] = percentile(a, 0.025), percentile(a, 0.975)
    return lo, hi


def summarize(votes, k=32, rounds=200, seed=1, ci=True):
    names = sorted({m for v in votes for m in (v["a"], v["b"])})
    e, _ = elo(votes, k)
    bt, converged = bradley_terry(votes)
    lo, hi = bootstrap(votes, rounds, seed) if ci else ({}, {})
    st = {m: {"name": m, "games": 0, "wins": 0, "losses": 0, "ties": 0, "bad": 0} for m in names}
    pos = {"a": 0, "b": 0, "tie": 0, "bad": 0}
    for v in votes:
        pos[v["winner"]] += 1
        A, B = st[v["a"]], st[v["b"]]
        if v["winner"] == "bad":
            A["bad"] += 1
            B["bad"] += 1
            continue
        A["games"] += 1
        B["games"] += 1
        if v["winner"] == "a":
            A["wins"] += 1
            B["losses"] += 1
        elif v["winner"] == "b":
            B["wins"] += 1
            A["losses"] += 1
        else:
            A["ties"] += 1
            B["ties"] += 1
    rows = []
    for m in names:
        s = st[m]
        g = s["wins"] + s["losses"] + s["ties"]
        s["winRate"] = (s["wins"] + 0.5 * s["ties"]) / g if g else None
        s["elo"] = e.get(m)
        s["bt"] = bt.get(m)
        s["lo"] = lo.get(m)
        s["hi"] = hi.get(m)
        rows.append(s)
    rows.sort(key=lambda r: (-(r["bt"] if r["bt"] is not None else -1e9), r["name"]))
    for i, r in enumerate(rows, 1):
        r["rank"] = i
    decided = pos["a"] + pos["b"]
    return {
        "votes": len(votes),
        "counted": sum(1 for v in votes if v["winner"] != "bad"),
        "converged": converged,
        "position": {**pos, "n": len(votes), "aShare": pos["a"] / decided if decided else None},
        "rows": rows,
    }


def fmt(x):
    return "-" if x is None else str(int(math.floor(x + 0.5)))


def main(argv):
    path, opts, i = None, {"k": 32, "rounds": 200, "seed": 1, "ci": True, "json": False}, 0
    while i < len(argv):
        a = argv[i]
        if a in ("--k", "--rounds", "--seed"):
            opts[a[2:]] = int(argv[i + 1])
            i += 2
        elif a == "--no-ci":
            opts["ci"] = False
            i += 1
        elif a == "--json":
            opts["json"] = True
            i += 1
        elif a in ("-h", "--help"):
            print(__doc__)
            return 0
        else:
            path = a
            i += 1
    if not path:
        print(__doc__, file=sys.stderr)
        return 2
    with open(path, encoding="utf-8") as f:
        votes, errors = parse_votes(f.read())
    for line, err in errors[:20]:
        print("line %d: %s" % (line, err), file=sys.stderr)
    if len(errors) > 20:
        print("... and %d more lines with errors" % (len(errors) - 20), file=sys.stderr)
    if not votes:
        print("no valid votes", file=sys.stderr)
        return 2
    s = summarize(votes, opts["k"], opts["rounds"], opts["seed"], opts["ci"])
    if opts["json"]:
        print(json.dumps(s, ensure_ascii=False, indent=1))
        return 0
    print("%d votes, %d counted (ties count half; 'bad' votes are listed but not ranked)" % (s["votes"], s["counted"]))
    print("%3s  %-28s %6s %-11s %6s %5s %6s %4s" % ("#", "model", "BT", "95% CI", "Elo", "win%", "games", "bad"))
    for r in s["rows"]:
        ci = "-" if r["lo"] is None else "%s-%s" % (fmt(r["lo"]), fmt(r["hi"]))
        wr = "-" if r["winRate"] is None else "%d" % int(round(r["winRate"] * 100))
        print("%3d  %-28s %6s %-11s %6s %5s %6d %4d" % (r["rank"], r["name"][:28], fmt(r["bt"]), ci, fmt(r["elo"]), wr, r["games"], r["bad"]))
    if s["position"]["aShare"] is not None:
        print("position A won %d%% of the decided votes (50%% = no position bias)" % round(s["position"]["aShare"] * 100))
    return 0


if __name__ == "__main__":
    sys.exit(main(sys.argv[1:]))
