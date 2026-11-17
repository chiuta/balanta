// BALANTA · motorul de evaluare (logică pură, fără DOM). Sintaxă ES2017; formatul voturilor este descris în docs/votes.md.
// parseVotes · elo · bradleyTerry · bootstrap · summarize · pendingTasks · anonymise · checkPrompt · resultsPage

export const FORMAT_VERSION = 1;
export const WINNERS = ['a', 'b', 'tie', 'bad'];
export const CATEGORIES = ['grammar', 'culture', 'reasoning', 'law', 'science', 'translation', 'creative', 'code'];
export const LANGS = ['ro', 'en', 'hu', 'fr', 'de', 'it', 'es', 'pt'];
export const LIMITS = { name: 40, answer: 20000, prompt: 4000, models: 8, votes: 200000, idLen: 80 };
export const KNOWN_NAMES = ['ChatGPT', 'GPT', 'OpenAI', 'Claude', 'Anthropic', 'Gemini', 'Bard', 'Google', 'Llama', 'Meta AI', 'Mistral', 'Le Chat', 'Copilot', 'Microsoft', 'Qwen', 'Alibaba', 'DeepSeek', 'Grok', 'xAI', 'Perplexity', 'Cohere', 'Command R', 'Phi', 'Gemma', 'Yi', 'Kimi', 'Moonshot'];

function dict() { return Object.create(null); }
function isObj(v) { return !!v && typeof v === 'object' && !Array.isArray(v); }
function esc(s) { return String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;'); }
export function rng(seed) {                     // mulberry32: același generator ca în scripts/rank.py
  let a = seed >>> 0;
  return function () {
    a = (a + 0x6D2B79F5) >>> 0;
    let t = a;
    t = Math.imul(t ^ (t >>> 15), t | 1);
    t ^= t + Math.imul(t ^ (t >>> 7), t | 61);
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}
export function fnv(s) { let h = 0x811c9dc5; s = String(s); for (let i = 0; i < s.length; i++) { h ^= s.charCodeAt(i); h = Math.imul(h, 0x01000193); } return h >>> 0; }

/* ---------------- voturi ---------------- */
const CTRL = /[\u0000-\u001f\u007f]/;
export function checkModelName(n) { return typeof n === 'string' && n.trim() === n && n.length >= 1 && n.length <= LIMITS.name && !CTRL.test(n); }
// întoarce un cod de eroare sau '' (coduri: object, version, prompt, model, same, winner, time)
export function checkVote(o) {
  if (!isObj(o)) return 'object';
  if (o.v !== undefined && o.v !== FORMAT_VERSION) return 'version';
  if (typeof o.prompt !== 'string' || !/^[A-Za-z0-9._:-]{1,80}$/.test(o.prompt)) return 'prompt';
  if (!checkModelName(o.a) || !checkModelName(o.b)) return 'model';
  if (o.a === o.b) return 'same';
  if (WINNERS.indexOf(o.winner) < 0) return 'winner';
  if (o.t !== undefined && !(typeof o.t === 'string' && /^\d{4}-\d{2}-\d{2}(T[0-9:.]{4,}(Z|[+-]\d{2}:\d{2})?)?$/.test(o.t))) return 'time';
  return '';
}
export function normVote(o) {
  const v = { v: FORMAT_VERSION, prompt: o.prompt, a: o.a, b: o.b, winner: o.winner };
  if (o.t !== undefined) v.t = o.t;
  return v;
}
export function voteToLine(v) { return JSON.stringify(normVote(v)); }
export function votesToText(votes) { return votes.map(voteToLine).join('\n') + (votes.length ? '\n' : ''); }
export function parseVotes(text) {
  const votes = [], errors = [];
  const lines = String(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].trim();
    if (!s || s.charAt(0) === '#') continue;
    if (votes.length >= LIMITS.votes) { errors.push({ line: i + 1, error: 'many' }); break; }
    let o;
    try { o = JSON.parse(s); } catch (e) { errors.push({ line: i + 1, error: 'json' }); continue; }
    const bad = checkVote(o);
    if (bad) { errors.push({ line: i + 1, error: bad }); continue; }
    votes.push(normVote(o));
  }
  return { votes: votes, errors: errors };
}
export function voteKey(v) { return [v.prompt, v.a, v.b, v.winner, v.t || ''].join('\u0001'); }
// adaugă voturi noi la cele existente, fără dubluri exacte; întoarce {votes, added, duplicates}
export function mergeVotes(base, incoming) {
  const seen = dict(), out = base.slice();
  base.forEach(function (v) { seen[voteKey(v)] = 1; });
  let added = 0, duplicates = 0;
  incoming.forEach(function (v) {
    const k = voteKey(v);
    if (k in seen || out.length >= LIMITS.votes) { duplicates++; return; }
    seen[k] = 1; out.push(v); added++;
  });
  return { votes: out, added: added, duplicates: duplicates };
}
export function modelsOf(votes) {
  const seen = dict();
  votes.forEach(function (v) { seen[v.a] = 1; seen[v.b] = 1; });
  return Object.keys(seen).sort();
}
function score(v) { return v.winner === 'a' ? 1 : v.winner === 'b' ? 0 : 0.5; }

/* ---------------- clasamente ---------------- */
// Elo secvențial în ordinea voturilor (K=32, start 1000, remiza = 0,5); «bad» nu se numără
export function elo(votes, opt) {
  const K = opt && opt.k ? opt.k : 32, r = dict(), n = dict();
  votes.forEach(function (v) {
    if (v.winner === 'bad') return;
    if (!(v.a in r)) { r[v.a] = 1000; n[v.a] = 0; }
    if (!(v.b in r)) { r[v.b] = 1000; n[v.b] = 0; }
    const ea = 1 / (1 + Math.pow(10, (r[v.b] - r[v.a]) / 400)), sa = score(v);
    r[v.a] += K * (sa - ea);
    r[v.b] += K * ((1 - sa) - (1 - ea));
    n[v.a]++; n[v.b]++;
  });
  return { rating: r, games: n };
}
// Bradley–Terry prin algoritmul MM (Hunter, 2004), cu un adversar virtual de putere 1 (1000 pe scara Elo) și o jumătate de victorie,
// ca modelele neînvinse să aibă o valoare finită. Remiza = 0,5 victorii pentru fiecare. rating = 1000 + 400·log10(putere)
export function bradleyTerry(votes) {
  const idx = dict(), names = [];
  const id = function (nm) { if (!(nm in idx)) { idx[nm] = names.length; names.push(nm); } return idx[nm]; };
  const rows = [];
  votes.forEach(function (v) { if (v.winner === 'bad') return; rows.push([id(v.a), id(v.b), score(v)]); });
  const N = names.length, w = [], n = [];
  for (let i = 0; i < N; i++) { w.push(0); n.push(new Array(N).fill(0)); }
  rows.forEach(function (x) { w[x[0]] += x[2]; w[x[1]] += 1 - x[2]; n[x[0]][x[1]]++; n[x[1]][x[0]]++; });
  let p = new Array(N).fill(1), it = 0, converged = false;
  for (; it < 20000; it++) {
    const q = new Array(N);
    let delta = 0;
    for (let i = 0; i < N; i++) {
      let den = 1 / (p[i] + 1);
      for (let j = 0; j < N; j++) if (n[i][j]) den += n[i][j] / (p[i] + p[j]);
      q[i] = (w[i] + 0.5) / den;
      delta = Math.max(delta, Math.abs(Math.log(q[i]) - Math.log(p[i])));
    }
    p = q;
    if (delta < 1e-12) { converged = true; it++; break; }
  }
  const rating = dict(), games = dict();
  names.forEach(function (nm, i) { rating[nm] = 1000 + 400 * Math.log(p[i]) / Math.LN10; games[nm] = 0; });
  rows.forEach(function (x) { games[names[x[0]]]++; games[names[x[1]]]++; });
  return { rating: rating, games: games, iterations: it, converged: converged };
}
function percentile(sorted, q) { return sorted[Math.min(sorted.length - 1, Math.max(0, Math.floor(q * (sorted.length - 1) + 0.5)))]; }
// interval de 95% prin bootstrap (rețeaua de voturi se re-eșantionează cu revenire); determinist pentru un seed dat
export function bootstrap(votes, opt) {
  const B = opt && opt.rounds ? opt.rounds : 200, rand = rng(opt && opt.seed ? opt.seed : 1);
  const pool = votes.filter(function (v) { return v.winner !== 'bad'; });
  const acc = dict();
  if (pool.length) for (let b = 0; b < B; b++) {
    const sample = [];
    for (let i = 0; i < pool.length; i++) sample.push(pool[Math.floor(rand() * pool.length)]);
    const r = bradleyTerry(sample).rating;
    Object.keys(r).forEach(function (nm) { (acc[nm] || (acc[nm] = [])).push(r[nm]); });
  }
  const lo = dict(), hi = dict();
  Object.keys(acc).forEach(function (nm) {
    const a = acc[nm].sort(function (x, y) { return x - y; });
    if (a.length < Math.min(20, B)) { lo[nm] = null; hi[nm] = null; return; }
    lo[nm] = percentile(a, 0.025); hi[nm] = percentile(a, 0.975);
  });
  return { lo: lo, hi: hi, rounds: B };
}
export function positionBias(votes) {
  let a = 0, b = 0, tie = 0, bad = 0;
  votes.forEach(function (v) { if (v.winner === 'a') a++; else if (v.winner === 'b') b++; else if (v.winner === 'tie') tie++; else bad++; });
  return { a: a, b: b, tie: tie, bad: bad, n: votes.length, aShare: a + b ? a / (a + b) : null };
}
// tabel complet: rânduri sortate după Bradley–Terry, victorii/remize/înfrângeri, matrice față în față
export function summarize(votes, opt) {
  const o = opt || {};
  const names = modelsOf(votes), e = elo(votes, o), bt = bradleyTerry(votes), ci = o.ci === false ? null : bootstrap(votes, { rounds: o.rounds || 200, seed: o.seed || 1 });
  const st = dict(), h2h = dict();
  names.forEach(function (nm) { st[nm] = { name: nm, games: 0, wins: 0, losses: 0, ties: 0, bad: 0 }; h2h[nm] = dict(); });
  votes.forEach(function (v) {
    const A = st[v.a], B = st[v.b];
    if (v.winner === 'bad') { A.bad++; B.bad++; return; }
    A.games++; B.games++;
    const cell = function (x, y) { return h2h[x][y] || (h2h[x][y] = { w: 0, l: 0, t: 0 }); };
    if (v.winner === 'a') { A.wins++; B.losses++; cell(v.a, v.b).w++; cell(v.b, v.a).l++; }
    else if (v.winner === 'b') { B.wins++; A.losses++; cell(v.b, v.a).w++; cell(v.a, v.b).l++; }
    else { A.ties++; B.ties++; cell(v.a, v.b).t++; cell(v.b, v.a).t++; }
  });
  const rows = names.map(function (nm) {
    const s = st[nm], g = s.wins + s.losses + s.ties;
    s.winRate = g ? (s.wins + 0.5 * s.ties) / g : null;
    s.elo = e.rating[nm] === undefined ? null : e.rating[nm];
    s.bt = bt.rating[nm] === undefined ? null : bt.rating[nm];
    s.lo = ci && ci.lo[nm] !== undefined ? ci.lo[nm] : null;
    s.hi = ci && ci.hi[nm] !== undefined ? ci.hi[nm] : null;
    return s;
  });
  rows.sort(function (x, y) { return (y.bt === null ? -1e9 : y.bt) - (x.bt === null ? -1e9 : x.bt) || (x.name < y.name ? -1 : 1); });
  rows.forEach(function (r, i) { r.rank = i + 1; });
  return { rows: rows, h2h: h2h, position: positionBias(votes), votes: votes.length, counted: votes.filter(function (v) { return v.winner !== 'bad'; }).length, converged: bt.converged };
}
// aceleași clasamente pe grupuri de prompturi (categorie, limbă): meta = {id: {category, lang}}
export function summarizeBy(votes, meta, key, opt) {
  const groups = dict();
  votes.forEach(function (v) {
    const m = meta[v.prompt], g = m && m[key] ? m[key] : '?';
    (groups[g] || (groups[g] = [])).push(v);
  });
  const out = dict();
  Object.keys(groups).sort().forEach(function (g) { out[g] = summarize(groups[g], { ci: false, k: opt && opt.k }); });
  return out;
}

/* ---------------- sesiune: perechi de comparat ---------------- */
function pairKey(seed, prompt, x, y) { const lo = x < y ? x : y, hi = x < y ? y : x; return fnv(seed + '|' + prompt + '|' + lo + '|' + hi); }
// toate comparațiile încă nevotate (prompt, pereche) pentru care ambele răspunsuri există; ordinea și partea A/B depind doar de seed,
// deci nu se schimbă când apar răspunsuri noi. answers: {prompt: {model: text}}
export function pendingTasks(models, promptIds, answers, votes, seed) {
  const voted = dict();
  votes.forEach(function (v) { voted[v.prompt + '\u0001' + (v.a < v.b ? v.a + '\u0001' + v.b : v.b + '\u0001' + v.a)] = 1; });
  const tasks = [];
  promptIds.forEach(function (pid) {
    const ans = answers[pid];
    if (!ans) return;
    for (let i = 0; i < models.length; i++) for (let j = i + 1; j < models.length; j++) {
      const x = models[i], y = models[j];
      if (typeof ans[x] !== 'string' || !ans[x].trim() || typeof ans[y] !== 'string' || !ans[y].trim()) continue;
      const lo = x < y ? x : y, hi = x < y ? y : x;
      if (voted[pid + '\u0001' + lo + '\u0001' + hi]) continue;
      const k = pairKey(seed, pid, x, y);
      tasks.push({ prompt: pid, a: (k & 1) ? lo : hi, b: (k & 1) ? hi : lo, key: k });
    }
  });
  tasks.sort(function (p, q) { return p.key - q.key || (p.prompt < q.prompt ? -1 : p.prompt > q.prompt ? 1 : 0); });
  return tasks;
}

/* ---------------- răspunsuri de importat ---------------- */
// JSON Lines: {"prompt": "...", "model": "...", "answer": "..."}; coduri de eroare: json, object, prompt, model, answer, long
export function parseAnswers(text) {
  const items = [], errors = [];
  const lines = String(text).split(/\r?\n/);
  for (let i = 0; i < lines.length; i++) {
    const s = lines[i].trim();
    if (!s || s.charAt(0) === '#') continue;
    let o;
    try { o = JSON.parse(s); } catch (e) { errors.push({ line: i + 1, error: 'json' }); continue; }
    if (!isObj(o)) { errors.push({ line: i + 1, error: 'object' }); continue; }
    if (typeof o.prompt !== 'string' || !/^[A-Za-z0-9._:-]{1,80}$/.test(o.prompt)) { errors.push({ line: i + 1, error: 'prompt' }); continue; }
    if (!checkModelName(o.model)) { errors.push({ line: i + 1, error: 'model' }); continue; }
    if (typeof o.answer !== 'string' || !o.answer.trim()) { errors.push({ line: i + 1, error: 'answer' }); continue; }
    if (o.answer.length > LIMITS.answer) { errors.push({ line: i + 1, error: 'long' }); continue; }
    items.push({ prompt: o.prompt, model: o.model, answer: o.answer });
  }
  return { items: items, errors: errors };
}
export function answersToText(answers, models, promptIds) {
  const out = [];
  promptIds.forEach(function (pid) { models.forEach(function (m) { const t = answers[pid] && answers[pid][m]; if (typeof t === 'string' && t.trim()) out.push(JSON.stringify({ prompt: pid, model: m, answer: t })); }); });
  return out.join('\n') + (out.length ? '\n' : '');
}

/* ---------------- anonimizare ---------------- */
function nameRe(names) {
  const list = names.filter(function (n) { return n && n.length >= 2; }).sort(function (x, y) { return y.length - x.length; }).map(function (n) { return n.replace(/[.*+?^${}()|[\]\\\/-]/g, '\\$&'); });
  if (!list.length) return null;
  return new RegExp('(^|[^A-Za-z0-9\\u00C0-\\u024F])(' + list.join('|') + ')(?![A-Za-z0-9\\u00C0-\\u024F])', 'gi');
}
// înlocuiește numele modelelor din sesiune și numele cunoscute cu «[model]»; întoarce {text, count}
export function anonymise(text, names) {
  const re = nameRe((names || []).concat(KNOWN_NAMES));
  let count = 0;
  if (!re) return { text: String(text), count: 0 };
  const out = String(text).replace(re, function (m, pre) { count++; return pre + '[model]'; });
  return { text: out, count: count };
}

/* ---------------- verificarea unui prompt (date personale, drepturi de autor, diacritice) ---------------- */
// numere de telefon românești (mobil 07…, fix 02…/03…) cu orice separatori; naționale (10 cifre) sau internaționale (+40 / 0040)
function hasPhone(t) {
  const m = t.match(/(?:\+|\b00)?\d[\d\s.()\/-]{6,20}\d/g) || [];
  for (let k = 0; k < m.length; k++) {
    const c = m[k], intl = c.charAt(0) === '+' || c.slice(0, 2) === '00';
    const groups = c.replace(/^\+/, '').split(/\D+/).filter(Boolean);
    for (let i = 0; i < groups.length; i++) {
      let d = '';
      for (let j = i; j < groups.length && d.length < 13; j++) {
        d += groups[j];
        if (d.length === 10 && /^0[237]\d{8}$/.test(d)) return true;
        if (intl && i === 0) { const r = d.replace(/^(?:00)?40/, ''); if (r !== d && (/^[237]\d{8}$/.test(r) || /^0[237]\d{8}$/.test(r))) return true; }
      }
    }
  }
  return false;
}
const RO_DIAC = /[ăâîșțĂÂÎȘȚ]/, CEDILLA = /[şţŞŢ]/;
// coduri: email, phone, cnp, iban, ctrl, long, short, diacritics, cedilla, quote
export function checkPrompt(text, lang) {
  const t = String(text), out = [];
  if (!t.trim()) return ['short'];
  if (/[A-Za-z0-9._%+-]+@[A-Za-z0-9-]+(\.[A-Za-z0-9-]+)+/.test(t)) out.push('email');
  if (hasPhone(t)) out.push('phone');
  if (/(^|\D)[1-9]\d{2}(0[1-9]|1[0-2])(0[1-9]|[12]\d|3[01])\d{6}(\D|$)/.test(t)) out.push('cnp');
  if (/\b[A-Z]{2}\d{2}(?: ?[A-Z0-9]{4}){3,7}(?: ?[A-Z0-9]{1,3})?\b/.test(t)) out.push('iban');
  if (CTRL_NOT_NL.test(t)) out.push('ctrl');
  if (t.length > LIMITS.prompt) out.push('long');
  if (t.trim().length < 12) out.push('short');
  if (lang === 'ro') {
    if (CEDILLA.test(t)) out.push('cedilla');
    if (t.length >= 80 && !RO_DIAC.test(t) && !CEDILLA.test(t)) out.push('diacritics');
  }
  const q = t.match(/[«„"“]([^»”"“]{300,})[»”"”]/);
  if (q) out.push('quote');
  return out;
}
const CTRL_NOT_NL = /[\u0000-\u0008\u000b\u000c\u000e-\u001f\u007f]/;

/* ---------------- exporturi ---------------- */
export function ratingsMarkdown(rows, L) {
  const f = function (x) { return x === null || x === undefined ? '–' : String(Math.round(x)); };
  const lines = ['| # | ' + L.model + ' | ' + L.bt + ' | ' + L.ci + ' | ' + L.elo + ' | ' + L.win + ' | ' + L.games + ' |', '|---|---|---|---|---|---|---|'];
  rows.forEach(function (r) {
    lines.push('| ' + r.rank + ' | ' + String(r.name).replace(/\|/g, '\\|') + ' | ' + f(r.bt) + ' | ' + (r.lo === null ? '–' : f(r.lo) + '–' + f(r.hi)) + ' | ' + f(r.elo) + ' | ' + (r.winRate === null ? '–' : Math.round(r.winRate * 100) + '%') + ' | ' + r.games + ' |');
  });
  return lines.join('\n') + '\n';
}
// pagină HTML statică (fără scripturi), cu tot textul scăpat; L = etichete traduse
export function resultsPage(sum, L, lang) {
  const f = function (x) { return x === null || x === undefined ? '–' : String(Math.round(x)); };
  let rows = '';
  sum.rows.forEach(function (r) {
    rows += '<tr><td>' + r.rank + '</td><th scope="row">' + esc(r.name) + '</th><td>' + f(r.bt) + '</td><td>' + (r.lo === null ? '–' : f(r.lo) + '–' + f(r.hi)) + '</td><td>' + f(r.elo) + '</td><td>' + (r.winRate === null ? '–' : Math.round(r.winRate * 100) + '%') + '</td><td>' + r.games + '</td><td>' + r.bad + '</td></tr>\n';
  });
  const pos = sum.position.aShare === null ? '' : '<p>' + esc(L.pos.replace('{0}', String(Math.round(sum.position.aShare * 100)))) + '</p>';
  return '<!DOCTYPE html>\n<html lang="' + esc(lang) + '"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">' +
    '<meta http-equiv="Content-Security-Policy" content="default-src \'none\'; style-src \'unsafe-inline\'">' +
    '<title>' + esc(L.page) + '</title><style>body{font:16px/1.5 system-ui,sans-serif;max-width:60rem;margin:2rem auto;padding:0 1rem;color:#1a1a1a;background:#fff}table{border-collapse:collapse;width:100%}th,td{border:1px solid #bbb;padding:.35rem .6rem;text-align:right}th[scope=row]{text-align:left}thead th{background:#eee}</style></head><body>\n<main>\n' +
    '<h1>' + esc(L.page) + '</h1>\n<p>' + esc(L.votes.replace('{0}', String(sum.votes)).replace('{1}', String(sum.counted))) + '</p>\n' +
    '<table><thead><tr><th>#</th><th>' + esc(L.model) + '</th><th>' + esc(L.bt) + '</th><th>' + esc(L.ci) + '</th><th>' + esc(L.elo) + '</th><th>' + esc(L.win) + '</th><th>' + esc(L.games) + '</th><th>' + esc(L.bad) + '</th></tr></thead>\n<tbody>\n' + rows + '</tbody></table>\n' + pos +
    '\n<p>' + esc(L.note) + '</p>\n</main>\n</body></html>\n';
}
