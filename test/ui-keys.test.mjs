import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';
import I18N from '../src/i18n.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const ui = fs.readFileSync(path.join(ROOT, 'src', 'ui.js'), 'utf8');
const eng = fs.readFileSync(path.join(ROOT, 'src', 'engine.mjs'), 'utf8');
const LANGS = ['ro', 'en', 'fr', 'de', 'es', 'it', 'hu', 'pt'];
const keys = Object.keys(I18N.en);
const ph = (s) => [...String(s).matchAll(/\{(\d)\}/g)].map((m) => +m[1]);

// Cheile folosite de ambalajul generat (meniu, titlu, buton de deschidere) și nu de ui.js.
const BUILDER = ['nav', 'title', 'open'];
// r_votes și r_pos sunt șabloane cu {0}/{1} înlocuite de motor în pagina de rezultate exportată.
const TEMPLATES = ['r_votes', 'r_pos'];

function list(re, src) { const m = src.match(re); assert.ok(m, 'nu găsesc ' + re); return [...m[1].matchAll(/'([a-z]+)'/g)].map((x) => x[1]); }
const TABS = list(/var TABS = \[([^\]]*)\]/, ui);
const DIFFS = list(/var DIFFS = \[([^\]]*)\]/, ui);
const ERR = [...new Set([...eng.matchAll(/error: '([a-z]+)'/g)].map((m) => m[1]).concat([...eng.slice(eng.indexOf('export function checkVote'), eng.indexOf('export function normVote')).matchAll(/return '([a-z]+)'/g)].map((m) => m[1])))].sort();
const ISSUES = [...new Set([...eng.matchAll(/out\.push\('([a-z]+)'\)/g)].map((m) => m[1]).concat(['short']))].sort();

/** Argumentele de la nivelul superior ale apelului care începe imediat după paranteza deschisă de la poziția i. */
function callArgs(src, i) {
  const args = []; let depth = 0, q = '', cur = '';
  for (let k = i; k < src.length; k++) {
    const c = src[k];
    if (q) { cur += c; if (c === '\\') { cur += src[++k]; } else if (c === q) q = ''; continue; }
    if (c === "'" || c === '"') { q = c; cur += c; continue; }
    if ('([{'.includes(c)) depth++;
    if (')]}'.includes(c)) { if (depth === 0) { args.push(cur.trim()); return args; } depth--; }
    if (c === ',' && depth === 0) { args.push(cur.trim()); cur = ''; continue; }
    cur += c;
  }
  throw new Error('apel neînchis');
}

test('toate limbile au exact aceleași chei și aceiași substituenți {n}, fără texte goale', () => {
  for (const l of LANGS) {
    assert.deepEqual(Object.keys(I18N[l]), keys, l + ': chei diferite');
    for (const k of keys) {
      assert.ok(typeof I18N[l][k] === 'string' && I18N[l][k].trim().length > 0, l + '/' + k + ': text gol');
      assert.deepEqual(ph(I18N[l][k]).sort(), ph(I18N.en[k]).sort(), l + '/' + k + ': substituenți diferiți');
    }
  }
  assert.ok(keys.length >= 170, keys.length + ' chei');
});

test('fiecare șir snake_case din ui.js este o cheie de traducere existentă', () => {
  const lits = [...ui.matchAll(/'([a-z]+_[a-z0-9_]*)'/g)].map((m) => m[1]).filter((s) => !s.endsWith('_'));
  assert.ok(lits.length > 100, 'puține cheie găsite: ' + lits.length);
  for (const k of new Set(lits)) assert.ok(keys.includes(k), 'cheie lipsă în i18n: ' + k);
});

test('familiile dinamice de chei (file, limbi, categorii, dificultăți, coduri de eroare, probleme de prompt, limite) sunt complete', () => {
  assert.deepEqual(TABS, ['setup', 'answers', 'vote', 'results', 'prompts']);
  assert.deepEqual(DIFFS, ['easy', 'medium', 'hard']);
  assert.deepEqual(ERR, ['answer', 'json', 'long', 'many', 'model', 'object', 'prompt', 'same', 'time', 'version', 'winner']);
  assert.deepEqual(ISSUES, ['cedilla', 'cnp', 'ctrl', 'diacritics', 'email', 'iban', 'long', 'phone', 'quote', 'short']);
  const need = [].concat(
    TABS.map((x) => 'tab_' + x), E.LANGS.map((x) => 'l_' + x), E.CATEGORIES.map((x) => 'c_' + x), DIFFS.map((x) => 'd_' + x),
    ERR.map((x) => 'err_' + x), ISSUES.map((x) => 'issue_' + x), ['issue_notes', 'issue_sources', 'issue_badurl'], [1, 2, 3, 4, 5, 6].map((i) => 'lim_' + i));
  for (const k of need) assert.ok(keys.includes(k), 'lipsește ' + k);
  assert.ok(!keys.includes('lim_7'), 'ui.js afișează doar lim_1…lim_6');
});

test('nicio cheie nu rămâne nefolosită (nici statică, nici din familiile dinamice, nici în ambalaj)', () => {
  const used = new Set(BUILDER);
  for (const m of ui.matchAll(/'([a-z]+_[a-z0-9_]*)'/g)) used.add(m[1]);
  for (const m of ui.matchAll(/L\.[tf]\('([a-z_0-9]+)'/g)) used.add(m[1]);   // și cheile fără liniuță jos (intro, copied)
  for (const m of ui.matchAll(/issues\.push\('([a-z]+)'\)/g)) used.add('issue_' + m[1]);   // verificările făcute de interfață (notes, sources)
  const fam = [].concat(
    TABS.map((x) => 'tab_' + x), E.LANGS.map((x) => 'l_' + x), E.CATEGORIES.map((x) => 'c_' + x), DIFFS.map((x) => 'd_' + x),
    ERR.map((x) => 'err_' + x), ISSUES.map((x) => 'issue_' + x), [1, 2, 3, 4, 5, 6].map((i) => 'lim_' + i));
  fam.forEach((k) => used.add(k));
  const orphan = keys.filter((k) => !used.has(k));
  assert.deepEqual(orphan, []);
});

test('apelurile L.f dau cel puțin atâtea argumente câți substituenți are textul, iar L.t nu se folosește pe șabloane cu substituenți', () => {
  let nf = 0, nt = 0;
  for (const m of ui.matchAll(/L\.([tf])\('([a-z_0-9]+)'/g)) {
    const kind = m[1], key = m[2];
    const rest = callArgs(ui, m.index + m[0].length);   // ce urmează după cheie: '' dacă apelul se încheie, altfel argumentele
    const given = rest.filter((x) => x !== '').length;
    const need = Math.max(-1, ...ph(I18N.en[key]));
    if (kind === 'f') { nf++; assert.ok(given >= need + 1 && given >= 1, 'L.f(' + key + '): ' + given + ' argumente, ' + (need + 1) + ' necesare'); }
    else { nt++; if (need >= 0) assert.ok(TEMPLATES.includes(key), 'L.t(' + key + ') folosit pe un șablon cu substituenți'); }
  }
  assert.ok(nf >= 20 && nt >= 80, nf + ' apeluri L.f, ' + nt + ' apeluri L.t');
});

test('traducerile nu amestecă ghilimele străine și nu conțin caractere de control sau spații duble', () => {
  for (const l of LANGS) for (const k of keys) {
    const s = I18N[l][k];
    assert.ok(!/[\u0000-\u001f\u007f]/.test(s), l + '/' + k + ': caractere de control');
    assert.ok(!/ {2,}/.test(s), l + '/' + k + ': spații duble');
    assert.equal(s, s.trim(), l + '/' + k + ': spații la capete');
  }
  // fără sedilă în textele românești (se folosește virgula: ș, ț)
  for (const k of keys) assert.ok(!/[şţŞŢ]/.test(I18N.ro[k]), 'ro/' + k + ': sedilă');
});
