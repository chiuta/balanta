import test from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { fileURLToPath } from 'node:url';
import * as E from '../src/engine.mjs';

const ROOT = path.join(path.dirname(fileURLToPath(import.meta.url)), '..');
const DIR = path.join(ROOT, 'data', 'prompts');
const schema = JSON.parse(fs.readFileSync(path.join(ROOT, 'schema.json'), 'utf8'));
const files = fs.readdirSync(DIR).filter((f) => f.endsWith('.json')).sort();
const dataFiles = files.filter((f) => f !== 'example.json');
const prompts = dataFiles.map((f) => ({ file: f, ...JSON.parse(fs.readFileSync(path.join(DIR, f), 'utf8')) }));
const KEYS = Object.keys(schema.properties);

test('schema.json și motorul au aceleași limbi și categorii, iar cheile permise sunt cele documentate', () => {
  assert.deepEqual(schema.properties.lang.enum, E.LANGS);
  assert.deepEqual(schema.properties.category.enum, E.CATEGORIES);
  assert.deepEqual(KEYS, ['id', 'lang', 'category', 'prompt', 'difficulty', 'reference_notes', 'sources']);
  assert.equal(schema.additionalProperties, false);
  assert.deepEqual(schema.required, ['id', 'lang', 'category', 'prompt', 'difficulty']);
});

test('fiecare fișier are doar cheile din schemă, tipurile corecte și id-ul egal cu numele fișierului', () => {
  assert.ok(prompts.length >= 90, 'setul inclus are ' + prompts.length + ' prompturi');
  for (const p of prompts) {
    const { file, ...o } = p;
    for (const k of Object.keys(o)) assert.ok(KEYS.includes(k), file + ': cheie în plus «' + k + '»');
    for (const k of schema.required) assert.ok(k in o, file + ': lipsește «' + k + '»');
    assert.equal(o.id + '.json', file, file + ': id ≠ nume de fișier');
    assert.match(o.id, /^[a-z]{2}-[a-z]+-\d{4}$/, file);
    assert.ok(schema.properties.difficulty.enum.includes(o.difficulty), file + ': dificultate');
    assert.equal(typeof o.prompt, 'string');
    assert.ok(o.prompt.length >= 12 && o.prompt.length <= E.LIMITS.prompt, file + ': lungime ' + o.prompt.length);
    assert.equal(o.prompt, o.prompt.trim(), file + ': spații la capete');
    if ('reference_notes' in o) assert.ok(typeof o.reference_notes === 'string' && o.reference_notes.trim() === o.reference_notes && o.reference_notes.length > 0, file);
    if ('sources' in o) {
      assert.ok(Array.isArray(o.sources) && o.sources.length >= 1, file);
      for (const u of o.sources) assert.match(u, /^https:\/\/[^\s]+$/, file + ': sursă ' + u);
      assert.equal(new Set(o.sources).size, o.sources.length, file + ': surse repetate');
    }
  }
});

test('id-ul urmează tiparul <limbă>-<categorie>-NNNN și numerele sunt consecutive (de la 0001) în fiecare grup', () => {
  const groups = {};
  for (const p of prompts) {
    const m = p.id.match(/^([a-z]{2})-([a-z]+)-(\d{4})$/);
    assert.ok(m, p.id);
    assert.equal(m[1], p.lang, p.id + ': prefix de limbă');
    assert.equal(m[2], p.category, p.id + ': prefix de categorie');
    (groups[m[1] + '-' + m[2]] = groups[m[1] + '-' + m[2]] || []).push(+m[3]);
  }
  for (const [g, nums] of Object.entries(groups)) {
    nums.sort((a, b) => a - b);
    assert.deepEqual(nums, nums.map((_, i) => i + 1), g + ': numere neconsecutive');
  }
});

test('numărul de prompturi pe limbă și categorie este cel anunțat în documentație', () => {
  const c = {};
  for (const p of prompts) { const k = p.lang + '-' + p.category; c[k] = (c[k] || 0) + 1; }
  assert.deepEqual(c, {
    'en-translation': 5,
    'hu-culture': 2, 'hu-grammar': 4, 'hu-reasoning': 3, 'hu-translation': 3,
    'ro-culture': 20, 'ro-grammar': 30, 'ro-reasoning': 20, 'ro-translation': 5
  });
  assert.equal(prompts.length, 92);
});

test('categoria «culture» are mereu note de referință și cel puțin o sursă https', () => {
  const cult = prompts.filter((p) => p.category === 'culture');
  assert.equal(cult.length, 22);
  for (const p of cult) {
    assert.ok(p.reference_notes && p.reference_notes.length >= 20, p.id + ': note de referință');
    assert.ok(p.sources && p.sources.length >= 1, p.id + ': surse');
  }
});

// Notele pot fi în altă limbă sau fără litere cu diacritice (de ex. un calcul sau o traducere în engleză): euristica «fără diacritice» se aplică doar textului promptului.
test('toate prompturile trec verificarea din interfață (fără date personale, fără citări lungi, diacritice corecte în română)', () => {
  for (const p of prompts) assert.deepEqual(E.checkPrompt(p.prompt, p.lang), [], p.id);
  for (const p of prompts.filter((x) => x.reference_notes)) assert.deepEqual(E.checkPrompt(p.reference_notes, p.lang).filter((c) => c !== 'short' && c !== 'diacritics'), [], p.id + ' (note)');
  const ro = prompts.filter((p) => p.lang === 'ro');
  assert.ok(ro.some((p) => /[ăâîșț]/.test(p.prompt)));
});

test('nu există prompturi duplicate (nici după normalizarea spațiilor și a majusculelor)', () => {
  const seen = new Map();
  for (const p of prompts) {
    const k = p.prompt.toLowerCase().replace(/\s+/g, ' ');
    assert.ok(!seen.has(k), p.id + ' dublează ' + seen.get(k));
    seen.set(k, p.id);
  }
});

test('example.json este un șablon valid, cu id rezervat, și nu se numără printre prompturile incluse', () => {
  const ex = JSON.parse(fs.readFileSync(path.join(DIR, 'example.json'), 'utf8'));
  assert.equal(ex.id, 'ro-culture-0000');
  for (const k of Object.keys(ex)) assert.ok(KEYS.includes(k), k);
  assert.ok(!prompts.some((p) => p.id === ex.id));
  assert.ok(ex.reference_notes && ex.sources && ex.sources.length);
});

test('toate prompturile incluse au note de referință; cele de traducere citează textul de tradus, cele de raționament sunt întrebări complete', () => {
  for (const p of prompts) assert.ok(p.reference_notes, p.id + ': lipsesc notele de referință');
  for (const p of prompts.filter((x) => x.category === 'translation')) assert.match(p.prompt, /[„«"“]/, p.id + ': textul de tradus trebuie citat');
  for (const p of prompts.filter((x) => x.category === 'reasoning')) assert.ok(p.prompt.length >= 30 && /\?|[.:]$/.test(p.prompt), p.id);
});

test('versiunea din package.json și din src/app.json coincide, iar scriptul Python acceptă același set de date', async () => {
  const pkg = JSON.parse(fs.readFileSync(path.join(ROOT, 'package.json'), 'utf8'));
  const app = JSON.parse(fs.readFileSync(path.join(ROOT, 'src', 'app.json'), 'utf8'));
  assert.equal(pkg.version, app.version);
  assert.equal(app.slug, 'balanta');
  assert.equal(app.data, 'data/prompts');
  const { spawnSync } = await import('node:child_process');
  const r = spawnSync('python3', [path.join(ROOT, 'scripts', 'validate.py'), DIR], { encoding: 'utf8' });
  if (r.error) return;   // fără Python în mediu: verificarea se face în CI
  assert.equal(r.status, 0, r.stdout + r.stderr);
});
