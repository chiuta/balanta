import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import os from 'node:os';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const V = (a, b, winner, prompt, t) => { const v = { v: 1, prompt: prompt || 'ro-grammar-0001', a, b, winner }; if (t) v.t = t; return v; };
const near = (x, y, eps, msg) => assert.ok(Math.abs(x - y) <= (eps || 1e-9), (msg || '') + ' ' + x + ' ≠ ' + y);

test('generatorul de numere: mulberry32 dă valorile de referință (calculate independent, în Python) și e determinist', () => {
  const r1 = E.rng(1), r7 = E.rng(7);
  [0.6270739405881613, 0.002735721180215478, 0.5274470399599522, 0.9810509674716741].forEach((x) => near(r1(), x, 1e-15));
  [0.011704753153026104, 0.06195825757458806, 0.97690763277933].forEach((x) => near(r7(), x, 1e-15));
  const a = E.rng(7), b = E.rng(7);
  for (let i = 0; i < 5; i++) assert.equal(a(), b());
  assert.equal(E.fnv('') , 2166136261);
  assert.equal(E.fnv('a'), 3826002220);
});

test('voturi: parsare, erori pe linii, comentarii și goluri, normalizare', () => {
  const text = [
    '# comentariu', '', JSON.stringify(V('x', 'y', 'a')), '{nu e json', '[]',
    JSON.stringify({ prompt: 'p-1', a: 'x', b: 'x', winner: 'a' }),
    JSON.stringify({ prompt: 'p 1', a: 'x', b: 'y', winner: 'a' }),
    JSON.stringify({ prompt: 'p-1', a: 'x', b: 'y', winner: 'c' }),
    JSON.stringify({ prompt: 'p-1', a: ' x', b: 'y', winner: 'a' }),
    JSON.stringify({ v: 2, prompt: 'p-1', a: 'x', b: 'y', winner: 'a' }),
    JSON.stringify({ prompt: 'p-1', a: 'x', b: 'y', winner: 'tie', t: 'ieri' }),
    JSON.stringify({ prompt: 'p-2', a: 'x', b: 'y', winner: 'bad', t: '2026-11-17T10:00:00Z', extra: 1 })
  ].join('\n');
  const r = E.parseVotes(text);
  assert.equal(r.votes.length, 2);
  assert.deepEqual(r.errors.map((e) => e.line + ':' + e.error), ['4:json', '5:object', '6:same', '7:prompt', '8:winner', '9:model', '10:version', '11:time']);
  assert.deepEqual(r.votes[1], { v: 1, prompt: 'p-2', a: 'x', b: 'y', winner: 'bad', t: '2026-11-17T10:00:00Z' });
  assert.equal(E.voteToLine(r.votes[1]), '{"v":1,"prompt":"p-2","a":"x","b":"y","winner":"bad","t":"2026-11-17T10:00:00Z"}');
  assert.deepEqual(E.parseVotes(E.votesToText(r.votes)).votes, r.votes);
  assert.equal(E.parseVotes('').votes.length, 0);
  assert.equal(E.parseVotes('\r\n' + JSON.stringify(V('x', 'y', 'b')) + '\r\n').votes.length, 1);
});

test('comasarea voturilor: dublurile exacte nu se adaugă, ordinea se păstrează', () => {
  const a = [V('x', 'y', 'a', 'p1', '2026-11-17T10:00:00Z'), V('x', 'y', 'b', 'p2')];
  const m = E.mergeVotes(a, [V('x', 'y', 'a', 'p1', '2026-11-17T10:00:00Z'), V('x', 'y', 'tie', 'p3'), V('x', 'y', 'b', 'p2')]);
  assert.equal(m.added, 1); assert.equal(m.duplicates, 2);
  assert.deepEqual(m.votes.map((v) => v.prompt), ['p1', 'p2', 'p3']);
  assert.deepEqual(E.modelsOf(m.votes), ['x', 'y']);
});

test('Elo: valori calculate de mână (1000/1000 → 1016/984; apoi a doua victorie)', () => {
  const e1 = E.elo([V('x', 'y', 'a')]);
  assert.equal(e1.rating.x, 1016); assert.equal(e1.rating.y, 984);
  const ea = 1 / (1 + Math.pow(10, (984 - 1016) / 400));       // așteptarea după prima victorie
  const e2 = E.elo([V('x', 'y', 'a'), V('x', 'y', 'a')]);
  near(e2.rating.x, 1016 + 32 * (1 - ea), 1e-9); near(e2.rating.y, 984 - 32 * (1 - ea), 1e-9);
  const t = E.elo([V('x', 'y', 'tie')]);
  assert.equal(t.rating.x, 1000); assert.equal(t.rating.y, 1000);
  const bad = E.elo([V('x', 'y', 'bad')]);
  assert.deepEqual(Object.keys(bad.rating), []);
  assert.equal(E.elo([V('x', 'y', 'a')], { k: 16 }).rating.x, 1008);
});

test('Bradley–Terry: simetrie, punct fix verificat independent, model neînvins finit, remiza = jumătate de victorie', () => {
  const sym = E.bradleyTerry([V('x', 'y', 'a'), V('x', 'y', 'a'), V('x', 'y', 'a'), V('x', 'y', 'b')]);
  near(sym.rating.x - 1000, 1000 - sym.rating.y, 1e-6, 'simetrie');
  assert.ok(sym.rating.x > 1000 && sym.rating.y < 1000 && sym.converged);
  const only = E.bradleyTerry([V('x', 'y', 'a'), V('x', 'y', 'a'), V('z', 'y', 'a'), V('x', 'z', 'tie')]);
  Object.keys(only.rating).forEach((m) => assert.ok(Number.isFinite(only.rating[m])));
  // punctul fix: W_i + 1/2 = p_i · (Σ_j n_ij/(p_i+p_j) + 1/(p_i+1)) pentru fiecare model
  const votes = [V('x', 'y', 'a'), V('x', 'y', 'a'), V('z', 'y', 'a'), V('x', 'z', 'tie'), V('y', 'z', 'b'), V('x', 'y', 'bad')];
  const bt = E.bradleyTerry(votes), p = {};
  Object.keys(bt.rating).forEach((m) => { p[m] = Math.pow(10, (bt.rating[m] - 1000) / 400); });
  const W = { x: 2.5, y: 0, z: 2.5 - 0 };                          // x: 2 victorii + 0,5 remiză; y: 0; z: victorie asupra lui y (a doua) + 0,5 remiză + victorie în «y,z → b» = 2,5
  const N = { x: { y: 2, z: 1 }, y: { x: 2, z: 2 }, z: { x: 1, y: 2 } };
  Object.keys(p).forEach((i) => {
    let den = 1 / (p[i] + 1);
    Object.keys(N[i]).forEach((j) => { den += N[i][j] / (p[i] + p[j]); });
    near(p[i] * den, W[i] + 0.5, 1e-7, 'punct fix ' + i);
  });
  assert.equal(E.bradleyTerry([V('x', 'y', 'bad')]).iterations >= 0, true);
  assert.deepEqual(Object.keys(E.bradleyTerry([V('x', 'y', 'bad')]).rating), []);
});

test('nume speciale de modele (__proto__, constructor, caractere Unicode) nu strică clasamentul', () => {
  const votes = [V('__proto__', 'constructor', 'a'), V('constructor', 'Ünï cödé', 'tie'), V('__proto__', 'Ünï cödé', 'a')];
  const s = E.summarize(votes, { rounds: 20 });
  assert.deepEqual(s.rows.map((r) => r.name).sort(), ['__proto__', 'constructor', 'Ünï cödé']);
  assert.equal(s.rows[0].name, '__proto__');
  assert.deepEqual(E.modelsOf(votes), ['__proto__', 'constructor', 'Ünï cödé']);
});

test('bootstrap: determinist pentru același seed, diferit pentru alt seed, intervalul include estimarea', () => {
  const votes = JSON.parse(fs.readFileSync(path.join(ROOT, 'test', 'fixture-votes.json'), 'utf8'));
  const a = E.bootstrap(votes, { rounds: 60, seed: 3 }), b = E.bootstrap(votes, { rounds: 60, seed: 3 }), c = E.bootstrap(votes, { rounds: 60, seed: 4 });
  assert.deepEqual(a, b);
  assert.notDeepEqual(a.lo, c.lo);
  const bt = E.bradleyTerry(votes).rating;
  Object.keys(bt).forEach((m) => assert.ok(a.lo[m] <= bt[m] + 30 && bt[m] - 30 <= a.hi[m], m));
  assert.deepEqual(Object.keys(E.bootstrap([], { rounds: 5 }).lo), []);
});

test('rezumat: contoare, matrice față în față, sortare, bias de poziție, grupe pe categorii', () => {
  const votes = [V('x', 'y', 'a', 'p1'), V('x', 'y', 'a', 'p2'), V('y', 'x', 'a', 'p3'), V('x', 'y', 'tie', 'p4'), V('x', 'y', 'bad', 'p5')];
  const s = E.summarize(votes, { ci: false });
  assert.equal(s.votes, 5); assert.equal(s.counted, 4);
  const x = s.rows.find((r) => r.name === 'x'), y = s.rows.find((r) => r.name === 'y');
  assert.deepEqual([x.wins, x.losses, x.ties, x.bad, x.games], [2, 1, 1, 1, 4]);
  assert.deepEqual([y.wins, y.losses, y.ties, y.bad, y.games], [1, 2, 1, 1, 4]);
  near(x.winRate, 2.5 / 4, 1e-12);
  assert.equal(s.rows[0].name, 'x'); assert.equal(s.rows[0].rank, 1);
  assert.deepEqual(s.h2h.x.y, { w: 2, l: 1, t: 1 });
  assert.deepEqual(s.h2h.y.x, { w: 1, l: 2, t: 1 });
  assert.deepEqual([s.position.a, s.position.b, s.position.tie, s.position.bad], [3, 0, 1, 1]);
  assert.equal(s.position.aShare, 1);
  const g = E.summarizeBy(votes, { p1: { category: 'grammar' }, p2: { category: 'grammar' }, p3: { category: 'culture' } }, 'category');
  assert.deepEqual(Object.keys(g).sort(), ['?', 'culture', 'grammar']);
  assert.equal(g.grammar.votes, 2);
  assert.equal(E.summarize([], { ci: false }).rows.length, 0);
});

test('rank.py dă aceleași numere ca motorul JavaScript (Elo, Bradley–Terry, intervale, contoare)', (t) => {
  const py = spawnSync('python3', ['--version']);
  if (py.status !== 0) { t.skip('python3 lipsește'); return; }
  const votes = JSON.parse(fs.readFileSync(path.join(ROOT, 'test', 'fixture-votes.json'), 'utf8'));
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'balanta-')), 'votes.jsonl');
  fs.writeFileSync(file, E.votesToText(votes));
  const r = spawnSync('python3', [path.join(ROOT, 'scripts', 'rank.py'), file, '--json', '--rounds', '40', '--seed', '7'], { encoding: 'utf8' });
  assert.equal(r.status, 0, r.stderr);
  const P = JSON.parse(r.stdout), J = E.summarize(votes, { rounds: 40, seed: 7 });
  assert.equal(P.votes, J.votes); assert.equal(P.counted, J.counted);
  assert.deepEqual(P.rows.map((x) => x.name), J.rows.map((x) => x.name));
  P.rows.forEach((p, i) => {
    const j = J.rows[i];
    ['games', 'wins', 'losses', 'ties', 'bad', 'rank'].forEach((k) => assert.equal(p[k], j[k], p.name + ' ' + k));
    ['elo', 'bt', 'lo', 'hi', 'winRate'].forEach((k) => near(p[k], j[k], 1e-6, p.name + ' ' + k));
  });
  near(P.position.aShare, J.position.aShare, 1e-12);
  const bad = spawnSync('python3', [path.join(ROOT, 'scripts', 'rank.py'), file, '--no-ci'], { encoding: 'utf8' });
  assert.equal(bad.status, 0); assert.match(bad.stdout, /votes, \d+ counted/);
});

test('rank.py: aceleași coduri de eroare pe linii ca motorul, iar un fișier fără voturi valide dă cod 2', (t) => {
  const py = spawnSync('python3', ['--version']);
  if (py.status !== 0) { t.skip('python3 lipsește'); return; }
  const lines = ['{nu e json', '[]', JSON.stringify({ prompt: 'p-1', a: 'x', b: 'x', winner: 'a' }), JSON.stringify({ prompt: 'p 1', a: 'x', b: 'y', winner: 'a' }), JSON.stringify({ prompt: 'p-1', a: 'x', b: 'y', winner: 'c' }), JSON.stringify({ v: 2, prompt: 'p-1', a: 'x', b: 'y', winner: 'a' }), JSON.stringify({ prompt: 'p-1', a: 'x', b: 'y', winner: 'a', t: 'ieri' })];
  const file = path.join(fs.mkdtempSync(path.join(os.tmpdir(), 'balanta-')), 'bad.jsonl');
  fs.writeFileSync(file, lines.join('\n') + '\n');
  const r = spawnSync('python3', [path.join(ROOT, 'scripts', 'rank.py'), file], { encoding: 'utf8' });
  assert.equal(r.status, 2);
  const js = E.parseVotes(lines.join('\n')).errors.map((e) => 'line ' + e.line + ': ' + e.error);
  assert.deepEqual(r.stderr.split('\n').filter((l) => /^line /.test(l)), js);
});

test('perechi de comparat: toate perechile cu răspunsuri, ordine stabilă la seed dat, fără voturi deja date', () => {
  const answers = { p1: { A: 'a1', B: 'b1', C: 'c1' }, p2: { A: 'a2', B: ' ', C: 'c2' }, p3: { A: 'a3' } };
  const t = E.pendingTasks(['A', 'B', 'C'], ['p1', 'p2', 'p3'], answers, [], 11);
  assert.equal(t.length, 4);                                         // p1: AB AC BC; p2: AC (B e gol); p3: nimic
  assert.deepEqual(t.map((x) => x.prompt + ':' + [x.a, x.b].sort().join('')).sort(), ['p1:AB', 'p1:AC', 'p1:BC', 'p2:AC']);
  assert.deepEqual(t, E.pendingTasks(['A', 'B', 'C'], ['p1', 'p2', 'p3'], answers, [], 11));
  assert.notDeepEqual(t.map((x) => x.a + x.b), E.pendingTasks(['A', 'B', 'C'], ['p1', 'p2', 'p3'], answers, [], 12).map((x) => x.a + x.b));
  const voted = E.pendingTasks(['A', 'B', 'C'], ['p1', 'p2', 'p3'], answers, [V(t[0].b, t[0].a, 'a', t[0].prompt)], 11);   // ordinea perechii nu contează
  assert.equal(voted.length, 3);
  assert.ok(!voted.some((x) => x.prompt === t[0].prompt && [x.a, x.b].sort().join() === [t[0].a, t[0].b].sort().join()));
  // un răspuns nou nu schimbă ordinea celor existente
  const more = E.pendingTasks(['A', 'B', 'C'], ['p1', 'p2', 'p3'], Object.assign({}, answers, { p3: { A: 'a3', B: 'b3' } }), [], 11);
  assert.deepEqual(more.filter((x) => x.prompt !== 'p3').map((x) => x.prompt + x.a + x.b), t.map((x) => x.prompt + x.a + x.b));
  // jumătate din părți sunt A în stânga: nu există părtinire sistematică pe un set mare
  const ids = []; const big = {}; for (let i = 0; i < 400; i++) { ids.push('q' + i); big['q' + i] = { A: 'x', B: 'y' }; }
  const left = E.pendingTasks(['A', 'B'], ids, big, [], 99).filter((x) => x.a === 'A').length;
  assert.ok(left > 150 && left < 250, 'A în stânga: ' + left);
});

test('răspunsuri: parsare JSON Lines, erori și exportul înapoi', () => {
  const text = [JSON.stringify({ prompt: 'p-1', model: 'M1', answer: 'Răspuns' }), '{x', '3', JSON.stringify({ prompt: 'p 1', model: 'M1', answer: 'x' }), JSON.stringify({ prompt: 'p-1', model: '', answer: 'x' }), JSON.stringify({ prompt: 'p-1', model: 'M1', answer: '  ' }), JSON.stringify({ prompt: 'p-1', model: 'M1', answer: 'x'.repeat(E.LIMITS.answer + 1) })].join('\n');
  const r = E.parseAnswers(text);
  assert.equal(r.items.length, 1);
  assert.deepEqual(r.errors.map((e) => e.line + ':' + e.error), ['2:json', '3:object', '4:prompt', '5:model', '6:answer', '7:long']);
  assert.deepEqual(E.parseAnswers(E.answersToText({ 'p-1': { M1: 'Răspuns', M2: '' } }, ['M1', 'M2'], ['p-1'])).items, r.items);
});

test('anonimizare: nume de modele și furnizori dispar, cuvintele care le conțin rămân, numele din sesiune se escapează', () => {
  const r = E.anonymise('Sunt ChatGPT, creat de OpenAI. Claude și gemini sunt colegi; Geminiană nu. C++ bot știe.', ['C++ bot']);
  assert.equal(r.text, 'Sunt [model], creat de [model]. [model] și [model] sunt colegi; Geminiană nu. [model] știe.');
  assert.equal(r.count, 5);
  assert.deepEqual(E.anonymise('nimic de ascuns aici', ['Zeta']), { text: 'nimic de ascuns aici', count: 0 });
  assert.equal(E.anonymise('(Mistral): ok', []).text, '([model]): ok');
  assert.equal(E.anonymise('x', ['a.b']).text, 'x');
  assert.equal(E.anonymise('a.b și axb', ['a.b']).text, '[model] și axb');
});

test('verificarea unui prompt: date personale, diacritice, drepturi de autor', () => {
  const c = (t, l) => E.checkPrompt(t, l).sort().join(',');
  assert.equal(c('Explică diferența dintre «s-au» și «sau» și dă exemple.', 'ro'), '');
  assert.match(c('Scrie-mi la ion.popescu@example.com despre asta, te rog.', 'ro'), /email/);
  assert.match(c('Sună-mă la 0722 123 456 mâine dimineață, te rog frumos.', 'ro'), /phone/);
  assert.match(c('Numărul meu este +40 722 123 456, sună oricând vrei.', 'ro'), /phone/);
  assert.match(c('Fixul meu este 021.234.5678 dacă ai nevoie de ceva.', 'ro'), /phone/);
  assert.match(c('CNP-ul meu este 1850101123456, verifică-l te rog frumos.', 'ro'), /cnp/);
  assert.match(c('Contul meu este RO49 AAAA 1B31 0075 9384 0000, ce zici?', 'ro'), /iban/);
  assert.equal(c('Ai 1234567890123 de mere? Cât costă douăsprezece mere acum?', 'ro').includes('cnp'), false);
  assert.match(c('Scrie corect: şcoală şi ţară, adică cu sedilă, te rog frumos.', 'ro'), /cedilla/);
  assert.match(c('Te rog sa imi explici diferenta dintre cele doua forme verbale folosite in propozitie.', 'ro'), /diacritics/);
  assert.equal(c('Te rog sa imi explici diferenta dintre cele doua forme verbale folosite in propozitie.', 'en'), '');
  assert.match(c('Rezumă textul: «' + 'a'.repeat(320) + '»', 'ro'), /quote/);
  assert.match(c('x', 'en'), /short/);
  assert.match(c('a'.repeat(E.LIMITS.prompt + 1), 'en'), /long/);
  assert.match(c('Salut\u0001 lume, cum merge treaba astăzi, prietene?', 'ro'), /ctrl/);
  assert.deepEqual(E.checkPrompt('   ', 'ro'), ['short']);
});

test('exporturi: tabel Markdown și pagină HTML statică, cu text scăpat și fără scripturi', () => {
  const votes = [V('<img src=x onerror=alert(1)>', 'y|z', 'a'), V('y|z', 'x', 'b')];
  votes[0].prompt = 'p-1'; votes[1].prompt = 'p-2';
  votes[0].a = '<b>mod</b>';
  const s = E.summarize(votes, { rounds: 20 });
  const L = { page: 'Rezultate <test>', model: 'Model', bt: 'BT', ci: '95%', elo: 'Elo', win: 'Victorii', games: 'Jocuri', bad: 'Ambele rele', votes: '{0} voturi, {1} numărate', pos: 'A a câștigat {0}%', note: 'Notă & text' };
  const md = E.ratingsMarkdown(s.rows, L);
  assert.match(md, /^\| # \| Model \| BT \| 95% \| Elo \| Victorii \| Jocuri \|/);
  assert.ok(md.includes('y\\|z'));
  const html = E.resultsPage(s, L, 'ro');
  assert.ok(html.startsWith('<!DOCTYPE html>'));
  assert.ok(!/<script|onerror=alert|<b>mod/i.test(html));
  assert.ok(html.includes('&lt;b&gt;mod&lt;/b&gt;') && html.includes('Rezultate &lt;test&gt;') && html.includes('Notă &amp; text'));
  assert.ok(html.includes("default-src 'none'"));
});
