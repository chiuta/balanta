import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const read = (f) => fs.readFileSync(path.join(ROOT, f), 'utf8');
const DOCS = { en: read('docs/votes.md'), ro: read('docs/votes.ro.md') };
const eng = read('src/engine.mjs');
const pkg = JSON.parse(read('package.json'));
const app = JSON.parse(read('src/app.json'));

function blocks(t) { return [...t.matchAll(/```([^\n]*)\n([\s\S]*?)```/g)].map((m) => ({ info: m[1].trim(), body: m[2] })); }
// Secțiunea numerotată «## n.» a documentului, până la următoarea.
function section(t, n) { const m = t.match(new RegExp('^## ' + n + '\\. [^\\n]*\\n([\\s\\S]*?)(?=^## \\d+\\. |$(?![\\s\\S]))', 'm')); assert.ok(m, 'lipsește secțiunea ' + n); return m[1]; }
// Primele celule din rândurile unui tabel, fără ghilimelele de cod.
function firstCells(t) { return [...t.matchAll(/^\| `([^|`]+)`(?:, `([^|`]+)`)? \|/gm)].flatMap((m) => [m[1], m[2]]).filter(Boolean); }
// Numere cu separator de mii: en «200,000», ro «200.000».
const num = (n, lang) => String(n).replace(/\B(?=(\d{3})+(?!\d))/g, lang === 'ro' ? '.' : ',');

test('ambele documente există, au aceleași blocuri de cod și trimit unul la altul', () => {
  assert.deepEqual(blocks(DOCS.en), blocks(DOCS.ro));
  assert.match(DOCS.en, /\[Română\]\(votes\.ro\.md\)/);
  assert.match(DOCS.ro, /\[English\]\(votes\.md\)/);
  const h2 = (t) => (t.match(/^## /gm) || []).length;
  assert.equal(h2(DOCS.en), 7);
  assert.equal(h2(DOCS.ro), 7);
});

test('versiunea și data din documente sunt cele din package.json și src/app.json', () => {
  assert.equal(pkg.version, app.version);
  assert.match(DOCS.en, new RegExp('Version: ' + pkg.version.replace(/\./g, '\\.') + ' · Last updated: ' + app.updated));
  assert.match(DOCS.ro, new RegExp('Versiune: ' + pkg.version.replace(/\./g, '\\.') + ' · Ultima actualizare: ' + app.updated));
});

test('exemplele din documente se citesc fără erori și folosesc prompturi care există', () => {
  for (const lang of ['en', 'ro']) {
    const b = blocks(DOCS[lang]);
    const votes = b.find((x) => x.info === 'jsonl votes'), answers = b.find((x) => x.info === 'jsonl answers');
    assert.ok(votes && answers, lang);
    const pv = E.parseVotes(votes.body);
    assert.deepEqual(pv.errors, []);
    assert.equal(pv.votes.length, 3);
    assert.deepEqual(pv.votes.map((v) => v.winner), ['a', 'tie', 'bad']);
    const pa = E.parseAnswers(answers.body);
    assert.deepEqual(pa.errors, []);
    assert.equal(pa.items.length, 1);
    for (const id of new Set([...pv.votes.map((v) => v.prompt), ...pa.items.map((x) => x.prompt)])) {
      assert.ok(fs.existsSync(path.join(ROOT, 'data', 'prompts', id + '.json')), id);
    }
    // Formatul scris de aplicație pentru primul rând e chiar cel din exemplu.
    assert.equal(E.voteToLine(pv.votes[0]), votes.body.split('\n')[0]);
  }
});

test('exemplul de voturi trece prin scripts/rank.py', () => {
  const py = spawnSync('python3', ['-I', '-c', 'pass'], { encoding: 'utf8' });
  if (py.error || py.status !== 0) return; // fără Python nu avem ce compara (CI-ul îl are)
  const tmp = fs.mkdtempSync(path.join(process.env.TMPDIR || '/tmp', 'balanta-docs-'));
  try {
    const f = path.join(tmp, 'votes.jsonl');
    fs.writeFileSync(f, blocks(DOCS.en).find((x) => x.info === 'jsonl votes').body);
    const r = spawnSync('python3', ['-I', path.join(ROOT, 'scripts', 'rank.py'), f, '--no-ci'], { encoding: 'utf8' });
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /3 votes, 2 counted/);
    for (const m of ['model-1', 'model-2', 'model-3']) assert.ok(r.stdout.includes(m), m);
  } finally { fs.rmSync(tmp, { recursive: true, force: true }); }
});

test('codurile de eroare din tabele sunt exact cele din motor', () => {
  const fn = (a, b) => eng.slice(eng.indexOf(a), eng.indexOf(b));
  const voteCodes = [...new Set([...fn('export function checkVote', 'export function normVote').matchAll(/return '([a-z]+)'/g)].map((m) => m[1]).concat([...fn('export function parseVotes', 'export function voteKey').matchAll(/error: '([a-z]+)'/g)].map((m) => m[1])))].sort();
  const ansCodes = [...new Set([...fn('export function parseAnswers', 'export function answersToText').matchAll(/error: '([a-z]+)'/g)].map((m) => m[1]))].sort();
  for (const lang of ['en', 'ro']) {
    const s1 = section(DOCS[lang], 1), s2 = section(DOCS[lang], 2);
    const errTable = s1.slice(s1.indexOf('| `json`') - 40);
    assert.deepEqual([...new Set(firstCells(errTable))].sort(), voteCodes, lang + ': voturi');
    const line = s2.split('\n').find((l) => /`json`/.test(l) && /`long`/.test(l));
    assert.ok(line, lang + ': lista de coduri pentru răspunsuri');
    const tail = line.slice(line.search(/Error codes:|Coduri de eroare:/));
    assert.ok(tail.length < line.length, lang + ': începutul listei de coduri');
    assert.deepEqual([...new Set([...tail.matchAll(/`([a-z]+)`/g)].map((m) => m[1]))].sort(), ansCodes, lang + ': răspunsuri');
  }
});

test('verificările de prompt din tabel sunt cele din motor, iar limitele coincid', () => {
  const issues = [...new Set([...eng.matchAll(/out\.push\('([a-z]+)'\)/g)].map((m) => m[1]).concat(['short']))].sort();
  for (const lang of ['en', 'ro']) {
    const s6 = section(DOCS[lang], 6);
    const codes = [...s6.matchAll(/^\|[^\n]*\| `([a-z]+)`(?:, `([a-z]+)`)? \|/gm)].flatMap((m) => [m[1], m[2]]).filter(Boolean);
    assert.deepEqual(codes.filter((c) => issues.includes(c)).sort(), issues, lang);
    assert.deepEqual(codes.filter((c) => !issues.includes(c)).sort(), ['notes', 'sources'], lang);
    const t = DOCS[lang];
    for (const n of [E.LIMITS.votes, E.LIMITS.answer, E.LIMITS.prompt]) assert.ok(t.includes(num(n, lang)), lang + ' ' + n);
    assert.ok(t.includes('1–' + E.LIMITS.name) && t.includes('1–' + E.LIMITS.idLen), lang + ': lungimi');
    assert.ok(t.includes('300') && t.includes('12') && t.includes('80'), lang + ': praguri');
  }
  // Pragurile din text sunt cele din cod: 300 (citat), 12 (scurt), 80 (diacritice).
  assert.ok(E.checkPrompt('«' + 'a'.repeat(300) + '»' + ' (text de verificare lung)', 'en').includes('quote'));
  assert.ok(!E.checkPrompt('«' + 'a'.repeat(299) + '» (text de verificare lung)', 'en').includes('quote'));
  assert.ok(E.checkPrompt('x'.repeat(11), 'en').includes('short') && !E.checkPrompt('x'.repeat(12), 'en').includes('short'));
  assert.ok(E.checkPrompt('a'.repeat(80), 'ro').includes('diacritics') && !E.checkPrompt('a'.repeat(79), 'ro').includes('diacritics'));
});

test('constantele algoritmilor din text sunt cele din cod', () => {
  // K = 32 și start 1000: după un vot câștigat între modele noi, schimbarea este K/2.
  const e = E.elo([{ v: 1, prompt: 'p', a: 'x', b: 'y', winner: 'a' }]);
  assert.equal(e.rating.x, 1016);
  assert.equal(e.rating.y, 984);
  // Adversarul virtual: un model neînvins are scor finit, peste 1000.
  const bt = E.bradleyTerry([{ v: 1, prompt: 'p', a: 'x', b: 'y', winner: 'a' }]);
  assert.ok(Number.isFinite(bt.rating.x) && bt.rating.x > 1000 && bt.rating.y < 1000);
  assert.ok(bt.converged);
  for (const lang of ['en', 'ro']) {
    const s4 = section(DOCS[lang], 4);
    for (const piece of ['K = 32', '1000', '1e-12', num(20000, lang), '200', '60', num(3000, lang), 'mulberry32']) assert.ok(s4.includes(piece), lang + ' ' + piece);
  }
  // 60 de runde peste 3.000 de voturi și 200 altfel, ca în aplicație.
  const ui = read('src/ui.js');
  assert.match(ui, /votes\.length > 3000 \? 60 : 200/);
  assert.match(eng, /opt && opt\.rounds \? opt\.rounds : 200/);
  assert.match(eng, /delta < 1e-12/);
  assert.match(eng, /it < 20000/);
  assert.match(eng, /K = opt && opt\.k \? opt\.k : 32/);
  assert.match(ui, /sum\.counted < 30/);
});
