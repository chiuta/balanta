/* BALANTA · interfața. Folosește din ambalaj: I18N, DATA, tr(), fmt() și funcțiile din engine.mjs. */
var STORE_KEY = 'balanta.state';
var TABS = ['setup', 'answers', 'vote', 'results', 'prompts'];
var DIFFS = ['easy', 'medium', 'hard'];
var BLOCKING = { email: 1, phone: 1, cnp: 1, iban: 1, ctrl: 1, long: 1, short: 1, quote: 1 };
var MAX_CUSTOM = 100, MAX_STORE_CHARS = 2500000, MAX_UI_VOTES = 20000, MAX_FILE = 5000000, MAX_PROMPTS = 200, MAX_SEED = 60;
var S = null;
var V = { tab: 'setup', pi: 0, skipped: dict(), lastVote: null, task: null, draft: null, check: null, fcat: 'all', flang: 'all', confirm: '', focus: '', modelsText: null, sd: null, live: null, main: null };
var cur = { el: null, lang: 'en', L: null };
var BUNDLED = [], BMAP = dict(), saveTimer = 0, booted = false;

/* ---------- ajutoare DOM ---------- */
function h(tag, attrs, kids) {
  var e = document.createElement(tag), k;
  if (attrs) for (k in attrs) {
    var v = attrs[k];
    if (v === null || v === undefined || v === false) continue;
    if (k === 'class') e.className = v;
    else if (k === 'text') e.textContent = v;
    else if (k.slice(0, 2) === 'on') e.addEventListener(k.slice(2), v);
    else e.setAttribute(k, v === true ? '' : String(v));
  }
  if (kids) for (var i = 0; i < kids.length; i++) {
    var c = kids[i];
    if (c === null || c === undefined || c === false) continue;
    e.appendChild(typeof c === 'object' ? c : document.createTextNode(String(c)));
  }
  return e;
}
function makeL(lang) {
  return {
    lang: lang,
    t: function (k) { return tr(lang, k); },
    f: function (k) { var a = [tr(lang, k)]; for (var i = 1; i < arguments.length; i++) a.push(arguments[i]); return fmt.apply(null, a); }
  };
}
function isHttps(u) { return typeof u === 'string' && /^https:\/\/[^\s]{1,500}$/.test(u); }
function nowIso() { return new Date().toISOString().replace(/\.\d{3}Z$/, 'Z'); }
function downloadText(name, text, mime) {
  try {
    var url = URL.createObjectURL(new Blob([text], { type: mime + ';charset=utf-8' })), a = document.createElement('a');
    a.href = url; a.download = name; document.body.appendChild(a); a.click(); document.body.removeChild(a);
    setTimeout(function () { URL.revokeObjectURL(url); }, 2000);
    return true;
  } catch (e) { return false; }
}
function copyText(text, done, fail) {
  function ok() { if (done) done(); }
  function fallback() {
    var ta = document.createElement('textarea'), good = false;
    ta.value = text; ta.className = 'ba-offscreen'; ta.setAttribute('readonly', '');
    document.body.appendChild(ta); ta.select();
    try { good = document.execCommand('copy'); } catch (e) { good = false; }
    document.body.removeChild(ta);
    if (good) ok(); else if (fail) fail();
  }
  try { if (navigator.clipboard && navigator.clipboard.writeText) { navigator.clipboard.writeText(text).then(ok, fallback); return; } } catch (e) { /* trecem la varianta veche */ }
  fallback();
}
function readFile(file, done) {
  var L = cur.L;
  if (!file) return;
  if (file.size > MAX_FILE) { flash(L.t('e_big')); return; }
  var fr = new FileReader();
  fr.onload = function () { done(String(fr.result)); };
  fr.onerror = function () { flash(L.t('e_read')); };
  fr.readAsText(file, 'utf-8');
}
function flash(msg, lines) {
  var box = V.live;
  if (!box) return;
  box.textContent = '';
  if (msg) box.appendChild(h('p', { text: msg }));
  if (lines && lines.length) box.appendChild(h('ul', { class: 'ba-lines' }, lines.map(function (x) { return h('li', { text: x }); })));
}

/* ---------- starea salvată ---------- */
function defaults() {
  var langs = dict(), cats = dict();
  langs.ro = true;
  CATEGORIES.forEach(function (c) { cats[c] = true; });
  return { models: [], seed: 'balanta', langs: langs, cats: cats, count: 10, reveal: false, custom: [], answers: dict(), votes: [] };
}
function cleanCustom(c) {
  if (!isObj(c)) return null;
  if (typeof c.id !== 'string' || !/^custom-[0-9]{1,6}$/.test(c.id)) return null;
  if (LANGS.indexOf(c.lang) < 0 || CATEGORIES.indexOf(c.category) < 0 || DIFFS.indexOf(c.difficulty) < 0) return null;
  if (typeof c.prompt !== 'string' || !c.prompt.trim() || c.prompt.length > LIMITS.prompt) return null;
  var src = [];
  if (Array.isArray(c.sources)) c.sources.forEach(function (u) { if (isHttps(u) && src.length < 10) src.push(u); });
  return { id: c.id, lang: c.lang, category: c.category, prompt: c.prompt, difficulty: c.difficulty, notes: typeof c.notes === 'string' && c.notes.length <= LIMITS.prompt ? c.notes : '', sources: src, custom: true };
}
function loadState() {
  var s = defaults(), raw = null;
  try { raw = JSON.parse(localStorage.getItem(STORE_KEY)); } catch (e) { raw = null; }
  if (!isObj(raw)) return s;
  if (Array.isArray(raw.models)) raw.models.forEach(function (m) { if (checkModelName(m) && s.models.indexOf(m) < 0 && s.models.length < LIMITS.models) s.models.push(m); });
  if (typeof raw.seed === 'string' && raw.seed.length >= 1 && raw.seed.length <= MAX_SEED && !/[\u0000-\u001f\u007f]/.test(raw.seed)) s.seed = raw.seed;
  if (isObj(raw.langs)) { s.langs = dict(); LANGS.forEach(function (l) { if (raw.langs[l] === true) s.langs[l] = true; }); }
  if (isObj(raw.cats)) { s.cats = dict(); CATEGORIES.forEach(function (c) { if (raw.cats[c] === true) s.cats[c] = true; }); }
  if (typeof raw.count === 'number' && raw.count >= 1 && raw.count <= MAX_PROMPTS) s.count = Math.floor(raw.count);
  if (raw.reveal === true) s.reveal = true;
  if (Array.isArray(raw.custom)) raw.custom.forEach(function (c) {
    var k = cleanCustom(c);
    if (k && s.custom.length < MAX_CUSTOM && !s.custom.some(function (x) { return x.id === k.id; })) s.custom.push(k);
  });
  if (isObj(raw.answers)) {
    var total = 0;
    Object.keys(raw.answers).forEach(function (pid) {
      var row = raw.answers[pid];
      if (!isObj(row) || !/^[A-Za-z0-9._:-]{1,80}$/.test(pid)) return;
      var known = !!BMAP[pid] || s.custom.some(function (x) { return x.id === pid; });
      if (!known) return;
      Object.keys(row).forEach(function (m) {
        var t = row[m];
        if (typeof t !== 'string' || !t.trim() || t.length > LIMITS.answer || !checkModelName(m) || total + t.length > MAX_STORE_CHARS) return;
        (s.answers[pid] || (s.answers[pid] = dict()))[m] = t;
        total += t.length;
      });
    });
  }
  if (Array.isArray(raw.votes)) raw.votes.forEach(function (o) { if (s.votes.length < MAX_UI_VOTES && checkVote(o) === '') s.votes.push(normVote(o)); });
  return s;
}
function saveNow() {
  clearTimeout(saveTimer); saveTimer = 0;
  try {
    localStorage.setItem(STORE_KEY, JSON.stringify({ v: 1, models: S.models, seed: S.seed, langs: S.langs, cats: S.cats, count: S.count, reveal: S.reveal, custom: S.custom, answers: S.answers, votes: S.votes }));
    return true;
  } catch (e) { flash(cur.L ? cur.L.t('e_quota') : ''); return false; }
}
function saveLater() { clearTimeout(saveTimer); saveTimer = setTimeout(saveNow, 300); }
function flushSave() { if (saveTimer) saveNow(); }
function answerChars() { var n = 0; Object.keys(S.answers).forEach(function (p) { Object.keys(S.answers[p]).forEach(function (m) { n += S.answers[p][m].length; }); }); return n; }

/* ---------- prompturi ---------- */
function buildBundled() {
  BUNDLED = []; BMAP = dict();
  var keys = typeof DATA === 'undefined' ? [] : Object.keys(DATA);
  keys.sort();
  keys.forEach(function (id) {
    var d = DATA[id];
    if (!isObj(d) || typeof d.prompt !== 'string' || LANGS.indexOf(d.lang) < 0 || CATEGORIES.indexOf(d.category) < 0) return;
    var p = { id: id, lang: d.lang, category: d.category, prompt: d.prompt, difficulty: DIFFS.indexOf(d.difficulty) >= 0 ? d.difficulty : 'medium', notes: typeof d.reference_notes === 'string' ? d.reference_notes : '', sources: Array.isArray(d.sources) ? d.sources.filter(isHttps) : [], custom: false };
    BUNDLED.push(p); BMAP[id] = p;
  });
}
function promptById(id) {
  if (BMAP[id]) return BMAP[id];
  for (var i = 0; i < S.custom.length; i++) if (S.custom[i].id === id) return S.custom[i];
  return null;
}
function metaMap() {
  var m = dict();
  BUNDLED.forEach(function (p) { m[p.id] = { category: p.category, lang: p.lang }; });
  S.custom.forEach(function (p) { m[p.id] = { category: p.category, lang: p.lang }; });
  return m;
}
function poolPrompts() { return BUNDLED.filter(function (p) { return S.langs[p.lang] === true && S.cats[p.category] === true; }); }
function activeIds() {
  var pool = poolPrompts();
  pool.sort(function (a, b) { return fnv(S.seed + '|' + a.id) - fnv(S.seed + '|' + b.id) || (a.id < b.id ? -1 : 1); });
  var ids = pool.slice(0, S.count).map(function (p) { return p.id; });
  S.custom.forEach(function (c) { ids.push(c.id); });
  ids.sort();
  return ids;
}
function usedLangs() { var o = dict(), out = []; BUNDLED.forEach(function (p) { o[p.lang] = 1; }); LANGS.forEach(function (l) { if (o[l]) out.push(l); }); return out; }
function usedCats() { var o = dict(), out = []; BUNDLED.forEach(function (p) { o[p.category] = 1; }); CATEGORIES.forEach(function (c) { if (o[c]) out.push(c); }); return out; }
function repoId(c) {
  var re = new RegExp('^' + c.lang + '-' + c.category + '-([0-9]+)$'), max = 0, idx = 0;
  BUNDLED.forEach(function (p) { var m = re.exec(p.id); if (m && +m[1] > max) max = +m[1]; });
  for (var i = 0; i < S.custom.length; i++) { var x = S.custom[i]; if (x.lang === c.lang && x.category === c.category) { idx++; if (x === c) break; } }
  var n = String(max + idx);
  while (n.length < 4) n = '0' + n;
  return c.lang + '-' + c.category + '-' + n;
}
function promptJson(c) {
  var o = { id: repoId(c), lang: c.lang, category: c.category, prompt: c.prompt, difficulty: c.difficulty };
  if (c.notes) o.reference_notes = c.notes;
  if (c.sources.length) o.sources = c.sources;
  return JSON.stringify(o, null, 2) + '\n';
}

/* ---------- ecranul ---------- */
function tabsBar() {
  var L = cur.L, bar = h('div', { class: 'ba-tabs', role: 'tablist', 'aria-label': L.t('title') });
  TABS.forEach(function (id, i) {
    var on = id === V.tab;
    bar.appendChild(h('button', {
      type: 'button', class: 'btn ba-tab' + (on ? ' pri' : ''), role: 'tab', id: 'ba-t-' + id, 'aria-selected': on ? 'true' : 'false', 'aria-controls': 'ba-p-' + id, tabindex: on ? '0' : '-1', text: L.t('tab_' + id),
      onclick: function () { gotoTab(id, 'ba-t-' + id); },
      onkeydown: function (ev) {
        var j = null;
        if (ev.key === 'ArrowRight') j = i + 1; else if (ev.key === 'ArrowLeft') j = i - 1; else if (ev.key === 'Home') j = 0; else if (ev.key === 'End') j = TABS.length - 1;
        if (j === null) return;
        ev.preventDefault();
        j = (j + TABS.length) % TABS.length;
        gotoTab(TABS[j], 'ba-t-' + TABS[j]);
      }
    }));
  });
  return bar;
}
function gotoTab(id, focus) {
  flushSave();
  V.tab = id; V.confirm = ''; V.focus = focus || '';
  flash('');
  render();
}
function render() {
  var main = V.main, L = cur.L;
  if (!main) return;
  main.textContent = '';
  var root = h('div', { class: 'ba-root' });
  root.appendChild(tabsBar());
  TABS.forEach(function (id) {
    var p = h('div', { class: 'ba-panel', role: 'tabpanel', id: 'ba-p-' + id, 'aria-labelledby': 'ba-t-' + id, hidden: id !== V.tab });
    if (id === V.tab) p.appendChild(PANELS[id](L));
    root.appendChild(p);
  });
  root.addEventListener('keydown', onKey);
  main.appendChild(root);
  if (V.focus) {
    var f = document.getElementById(V.focus);
    if (f) { if (!/^(button|input|select|textarea|a)$/i.test(f.tagName)) f.setAttribute('tabindex', '-1'); f.focus(); }
    V.focus = '';
  }
}
function field(label, control, id) { return h('div', { class: 'ba-f' }, [h('label', { for: id, text: label }), control]); }
function checkGroup(legend, items, current, onChange, pfx) {
  var fs = h('fieldset', { class: 'ba-group' }, [h('legend', { text: legend })]);
  items.forEach(function (it) {
    var id = 'ba-cb-' + pfx + '-' + it[0], cb = h('input', { type: 'checkbox', id: id, value: it[0], checked: current[it[0]] === true });
    cb.addEventListener('change', function () { onChange(it[0], cb.checked); });
    fs.appendChild(h('label', { class: 'ba-check', for: id }, [cb, ' ', it[1]]));
  });
  return fs;
}
/* --- Pregătire --- */
function parseModels(text, L) {
  var lines = String(text).split(/\r?\n/), out = [];
  for (var i = 0; i < lines.length; i++) {
    var n = lines[i].trim();
    if (!n) continue;
    if (n.length > LIMITS.name) return { error: L.f('e_m_long', n.slice(0, 20) + '…') };
    if (!checkModelName(n)) return { error: L.t('e_m_chars') };
    if (out.indexOf(n) >= 0) return { error: L.f('e_m_dup', n) };
    out.push(n);
  }
  if (out.length < 2) return { error: L.t('e_m_few') };
  if (out.length > LIMITS.models) return { error: L.t('e_m_many') };
  return { models: out };
}
function setupDraft() {
  if (!V.sd) {
    V.sd = { langs: dict(), cats: dict(), seed: S.seed, count: String(S.count), reveal: S.reveal === true };
    Object.keys(S.langs).forEach(function (k) { V.sd.langs[k] = S.langs[k]; });
    Object.keys(S.cats).forEach(function (k) { V.sd.cats[k] = S.cats[k]; });
  }
  return V.sd;
}
function draftPool(sd) { return BUNDLED.filter(function (p) { return sd.langs[p.lang] === true && sd.cats[p.category] === true; }).length; }
function panelSetup(L) {
  var box = h('div', { class: 'ba-box' }), sd = setupDraft();
  var ta = h('textarea', { id: 'ba-models', class: 'ba-inp', rows: '5', spellcheck: 'false', autocomplete: 'off' });
  ta.value = V.modelsText === null ? S.models.join('\n') : V.modelsText;
  ta.addEventListener('input', function () { V.modelsText = ta.value; });
  box.appendChild(field(L.t('s_models_l'), ta, 'ba-models'));
  box.appendChild(h('p', { class: 'note', text: L.t('s_models_h') }));
  var seed = h('input', { id: 'ba-seed', class: 'ba-inp', type: 'text', maxlength: String(MAX_SEED), value: sd.seed, autocomplete: 'off', spellcheck: 'false' });
  seed.addEventListener('input', function () { sd.seed = seed.value; });
  box.appendChild(field(L.t('s_seed_l'), seed, 'ba-seed'));
  var pool = h('p', { class: 'ba-pool', id: 'ba-pool', text: L.f('s_pool', draftPool(sd), S.custom.length) });
  function upd() { pool.textContent = L.f('s_pool', draftPool(sd), S.custom.length); }
  box.appendChild(checkGroup(L.t('s_langs_l'), usedLangs().map(function (l) { return [l, L.t('l_' + l)]; }), sd.langs, function (k, v) { sd.langs[k] = v; upd(); }, 'l'));
  box.appendChild(checkGroup(L.t('s_cats_l'), usedCats().map(function (c) { return [c, L.t('c_' + c)]; }), sd.cats, function (k, v) { sd.cats[k] = v; upd(); }, 'c'));
  var cnt = h('input', { id: 'ba-count', class: 'ba-inp ba-num', type: 'number', min: '1', max: String(MAX_PROMPTS), step: '1', value: sd.count });
  cnt.addEventListener('input', function () { sd.count = cnt.value; });
  box.appendChild(field(L.t('s_count_l'), cnt, 'ba-count'));
  box.appendChild(pool);
  var rv = h('input', { type: 'checkbox', id: 'ba-reveal', checked: sd.reveal });
  rv.addEventListener('change', function () { sd.reveal = rv.checked; });
  box.appendChild(h('div', { class: 'ba-f' }, [h('label', { class: 'ba-check', for: 'ba-reveal' }, [rv, ' ', L.t('s_reveal_l')])]));
  box.appendChild(h('div', { class: 'ba-bar' }, [
    h('button', {
      type: 'button', class: 'btn pri', id: 'ba-apply', text: L.t('s_apply'),
      onclick: function () {
        var r = parseModels(ta.value, L);
        if (r.error) { flash(r.error); return; }
        var sdv = sd.seed.trim();
        if (/[\u0000-\u001f\u007f]/.test(sdv) || sdv.length > MAX_SEED) sdv = '';
        var c = Math.floor(+sd.count);
        S.models = r.models; S.seed = sdv || 'balanta'; S.reveal = sd.reveal === true;
        S.langs = dict(); Object.keys(sd.langs).forEach(function (k) { if (sd.langs[k] === true) S.langs[k] = true; });
        S.cats = dict(); Object.keys(sd.cats).forEach(function (k) { if (sd.cats[k] === true) S.cats[k] = true; });
        if (c >= 1 && c <= MAX_PROMPTS) S.count = c;
        V.sd = null; V.modelsText = null; V.pi = 0; V.skipped = dict();
        saveNow();
        flash(L.f('s_applied', S.models.length, activeIds().length));
        V.focus = 'ba-apply';
        render();
      }
    }),
    h('button', {
      type: 'button', class: 'btn', id: 'ba-reset', text: V.confirm === 'reset' ? L.t('s_reset2') : L.t('s_reset'),
      onclick: function () {
        if (V.confirm !== 'reset') { V.confirm = 'reset'; V.focus = 'ba-reset'; render(); return; }
        S = defaults(); V.confirm = ''; V.sd = null; V.modelsText = null; V.pi = 0; V.skipped = dict(); V.lastVote = null; V.draft = null; V.check = null;
        try { localStorage.removeItem(STORE_KEY); } catch (e) { /* ignorat */ }
        flash(L.t('s_reset_done'));
        V.focus = 'ba-t-setup';
        render();
      }
    })
  ]));
  box.appendChild(h('p', { class: 'note', text: L.t('s_priv') }));
  return box;
}

/* --- Răspunsuri --- */
function answerCount(pid) { var r = S.answers[pid], n = 0; if (r) S.models.forEach(function (m) { if (typeof r[m] === 'string' && r[m].trim()) n++; }); return n; }
function setAnswer(pid, model, text) {
  var L = cur.L, row = S.answers[pid];
  var old = row && typeof row[model] === 'string' ? row[model].length : 0;
  if (text.length > LIMITS.answer) text = text.slice(0, LIMITS.answer);
  if (answerChars() - old + text.length > MAX_STORE_CHARS) { flash(L.t('e_quota')); return false; }
  if (!text.trim()) { if (row) delete row[model]; } else (row || (S.answers[pid] = dict()))[model] = text;
  saveLater();
  return true;
}
function panelAnswers(L) {
  var box = h('div', { class: 'ba-box' }), ids = activeIds();
  if (S.models.length < 2) { box.appendChild(h('p', { class: 'ba-empty', text: L.t('a_nomodels') })); return box; }
  if (!ids.length) { box.appendChild(h('p', { class: 'ba-empty', text: L.t('a_noprompts') })); return box; }
  if (V.pi >= ids.length) V.pi = ids.length - 1;
  if (V.pi < 0) V.pi = 0;
  var pid = ids[V.pi], p = promptById(pid);
  var sel = h('select', { id: 'ba-pick', class: 'sel ba-inp', onchange: function () { V.pi = +sel.value; V.focus = 'ba-pick'; render(); } });
  ids.forEach(function (id, i) { sel.appendChild(h('option', { value: String(i), selected: i === V.pi, text: (i + 1) + '. ' + id + ' · ' + answerCount(id) + '/' + S.models.length })); });
  box.appendChild(h('div', { class: 'ba-bar' }, [
    h('button', { type: 'button', class: 'btn', id: 'ba-prev', text: L.t('a_prev'), disabled: V.pi === 0, onclick: function () { V.pi--; V.focus = 'ba-prev'; render(); } }),
    field(L.f('a_of', V.pi + 1, ids.length), sel, 'ba-pick'),
    h('button', { type: 'button', class: 'btn', id: 'ba-next', text: L.t('a_next'), disabled: V.pi >= ids.length - 1, onclick: function () { V.pi++; V.focus = 'ba-next'; render(); } })
  ]));
  box.appendChild(h('p', { class: 'ba-meta', text: L.t('l_' + p.lang) + ' · ' + L.t('c_' + p.category) + ' · ' + L.t('d_' + p.difficulty) }));
  box.appendChild(h('blockquote', { class: 'ba-prompt', id: 'ba-prompt-text', text: p.prompt }));
  box.appendChild(h('div', { class: 'ba-bar' }, [
    h('button', { type: 'button', class: 'btn', id: 'ba-copy', text: L.t('a_copy'), onclick: function () { copyText(p.prompt, function () { flash(L.t('copied')); }, function () { flash(L.t('copy_fail')); }); } }),
    h('button', {
      type: 'button', class: 'btn', id: 'ba-copyall', text: L.t('a_copy_all'),
      onclick: function () { copyText(ids.map(function (id) { return '### ' + id + '\n' + promptById(id).prompt; }).join('\n\n') + '\n', function () { flash(L.t('copied')); }, function () { flash(L.t('copy_fail')); }); }
    })
  ]));
  var counter = h('p', { class: 'ba-count', id: 'ba-count-l', role: 'status', text: L.f('a_count', answerCount(pid), S.models.length) });
  S.models.forEach(function (m, i) {
    var id = 'ba-ans-' + i, ta = h('textarea', { id: id, class: 'ba-inp ba-ansin', rows: '6', maxlength: String(LIMITS.answer), spellcheck: 'false' });
    ta.value = S.answers[pid] && typeof S.answers[pid][m] === 'string' ? S.answers[pid][m] : '';
    ta.addEventListener('input', function () {
      if (!setAnswer(pid, m, ta.value)) return;
      counter.textContent = L.f('a_count', answerCount(pid), S.models.length);
    });
    ta.addEventListener('change', flushSave);
    box.appendChild(field(L.f('a_resp', m), ta, id));
  });
  box.appendChild(counter);
  if (p.notes) box.appendChild(refBox(L, p));
  var file = h('input', { type: 'file', id: 'ba-afile', class: 'ba-file', accept: '.jsonl,.json,.txt,text/plain,application/json' });
  file.addEventListener('change', function () {
    readFile(file.files && file.files[0], function (text) {
      var r = parseAnswers(text), added = 0, skipped = 0;
      r.items.forEach(function (it) {
        if (S.models.indexOf(it.model) < 0 || !promptById(it.prompt)) { skipped++; return; }
        if (setAnswer(it.prompt, it.model, it.answer)) added++; else skipped++;
      });
      saveNow();
      flash(L.f('a_imported', added, skipped + r.errors.length), r.errors.slice(0, 5).map(function (e) { return L.f('line_err', e.line, L.t('err_' + e.error)); }));
      V.focus = 'ba-afile'; render();
    });
    file.value = '';
  });
  box.appendChild(h('div', { class: 'ba-bar' }, [
    file, h('label', { class: 'btn ba-filelab', for: 'ba-afile', text: L.t('a_import') }),
    h('button', { type: 'button', class: 'btn', id: 'ba-aexp', text: L.t('a_export'), onclick: function () { var t = answersToText(S.answers, S.models, ids); if (!t) { flash(L.t('a_none')); return; } downloadText('answers.jsonl', t, 'application/x-ndjson'); } })
  ]));
  return box;
}
function refBox(L, p) {
  var d = h('details', { class: 'ba-ref', id: 'ba-ref' }, [h('summary', { text: L.t('v_notes_h') }), h('p', { class: 'ba-notes', text: p.notes })]);
  if (p.sources.length) d.appendChild(h('ul', { class: 'ba-src' }, p.sources.map(function (u) { return h('li', null, [h('a', { href: u, target: '_blank', rel: 'noopener noreferrer', text: u })]); })));
  return d;
}

/* --- Vot --- */
function taskKey(t) { return t.prompt + '\u0001' + (t.a < t.b ? t.a + '\u0001' + t.b : t.b + '\u0001' + t.a); }
function currentTasks() {
  var ids = activeIds(), all = pendingTasks(S.models, ids, S.answers, S.votes, S.seed), skip = V.skipped;
  var first = all.filter(function (t) { return !skip[taskKey(t)]; }), rest = all.filter(function (t) { return skip[taskKey(t)]; });
  if (!first.length && rest.length) { V.skipped = dict(); return { list: all, left: all.length, total: pendingTasks(S.models, ids, S.answers, [], S.seed).length }; }
  return { list: first.concat(rest), left: all.length, total: pendingTasks(S.models, ids, S.answers, [], S.seed).length };
}
function ansBlock(L, label, id, text) {
  var an = anonymise(text, S.models), hid = 'ba-vh-' + id;
  return { count: an.count, node: h('section', { class: 'ba-answer' }, [h('h4', { id: hid, text: label }), h('div', { class: 'ba-anstext', id: 'ba-v-' + id, role: 'region', 'aria-labelledby': hid, tabindex: '0', text: an.text })]) };
}
function panelVote(L) {
  var box = h('div', { class: 'ba-box' });
  if (S.models.length < 2) { box.appendChild(h('p', { class: 'ba-empty', text: L.t('a_nomodels') })); V.task = null; return box; }
  var info = currentTasks(), t = info.list[0];
  V.task = t || null;
  if (!t) {
    box.appendChild(h('p', { class: 'ba-empty', id: 'ba-vh', text: S.votes.length ? L.f('v_done', S.votes.length) : L.t('v_none') }));
    box.appendChild(h('div', { class: 'ba-bar' }, [h('button', { type: 'button', class: 'btn', id: 'ba-goans', text: L.t('tab_answers'), onclick: function () { gotoTab('answers', 'ba-t-answers'); } }), h('button', { type: 'button', class: 'btn', id: 'ba-gores', text: L.t('tab_results'), onclick: function () { gotoTab('results', 'ba-t-results'); } })]));
    if (V.lastVote) box.appendChild(h('button', { type: 'button', class: 'btn', id: 'ba-undo', text: L.t('btn_undo'), onclick: undoVote }));
    return box;
  }
  var p = promptById(t.prompt), A = ansBlock(L, L.t('v_a'), 'a', S.answers[t.prompt][t.a]), B = ansBlock(L, L.t('v_b'), 'b', S.answers[t.prompt][t.b]);
  box.appendChild(h('h3', { id: 'ba-vh', class: 'ba-vh', text: L.f('v_progress', info.total - info.left + 1, info.total, info.left) }));
  box.appendChild(h('p', { class: 'ba-meta', text: L.t('l_' + p.lang) + ' · ' + L.t('c_' + p.category) + ' · ' + L.t('d_' + p.difficulty) }));
  box.appendChild(h('blockquote', { class: 'ba-prompt', id: 'ba-prompt-text', text: p.prompt }));
  box.appendChild(h('div', { class: 'ba-cols' }, [A.node, B.node]));
  if (A.count + B.count > 0) box.appendChild(h('p', { class: 'note', id: 'ba-hidden', text: L.f('v_hidden', A.count + B.count) }));
  var buttons = [['a', 'btn_a', 'pri'], ['b', 'btn_b', 'pri'], ['tie', 'btn_tie', ''], ['bad', 'btn_bad', '']];
  box.appendChild(h('div', { class: 'ba-bar ba-votes', role: 'group', 'aria-label': L.t('v_title') }, buttons.map(function (b) {
    return h('button', { type: 'button', class: 'btn ' + b[2], id: 'ba-w-' + b[0], text: L.t(b[1]), onclick: function () { castVote(b[0]); } });
  }).concat([h('button', { type: 'button', class: 'btn', id: 'ba-skip', text: L.t('btn_skip'), onclick: skipCurrent })])));
  box.appendChild(h('p', { class: 'note', text: L.t('v_keys') }));
  if (V.lastVote) box.appendChild(h('button', { type: 'button', class: 'btn', id: 'ba-undo', text: L.t('btn_undo'), onclick: undoVote }));
  if (p.notes) box.appendChild(refBox(L, p));
  return box;
}
function castVote(w) {
  var t = V.task, L = cur.L;
  if (!t || V.tab !== 'vote') return;
  if (S.votes.length >= MAX_UI_VOTES) { flash(L.t('e_votes')); return; }
  var v = normVote({ v: 1, prompt: t.prompt, a: t.a, b: t.b, winner: w, t: nowIso() });
  S.votes.push(v); V.lastVote = v;
  saveNow();
  flash(L.f('v_recorded', S.votes.length), S.reveal ? [L.f('v_reveal', t.a, t.b)] : null);
  V.focus = 'ba-vh';
  render();
}
function skipCurrent() {
  if (!V.task || V.tab !== 'vote') return;
  V.skipped[taskKey(V.task)] = 1;
  V.focus = 'ba-vh';
  render();
}
function undoVote() {
  var L = cur.L;
  if (V.lastVote && S.votes.length && S.votes[S.votes.length - 1] === V.lastVote) {
    S.votes.pop(); V.lastVote = null;
    saveNow();
    flash(L.f('v_undone', S.votes.length));
  }
  V.focus = 'ba-vh';
  render();
}
function onKey(ev) {
  if (V.tab !== 'vote' || ev.ctrlKey || ev.metaKey || ev.altKey) return;
  var t = ev.target, tag = t && t.tagName ? t.tagName.toLowerCase() : '';
  if (tag === 'textarea' || tag === 'input' || tag === 'select') return;
  var map = { '1': 'a', '2': 'b', '3': 'tie', '4': 'bad' };
  if (map[ev.key]) { ev.preventDefault(); castVote(map[ev.key]); }
  else if (ev.key === 's' || ev.key === 'S') { ev.preventDefault(); skipCurrent(); }
}

/* --- Rezultate --- */
function pageLabels(L) {
  return { page: L.t('rp_page'), model: L.t('col_model'), bt: L.t('col_bt'), ci: L.t('col_ci'), elo: L.t('col_elo'), win: L.t('col_win'), games: L.t('col_games'), bad: L.t('col_bad'), votes: L.t('r_votes'), pos: L.t('r_pos'), note: L.t('rp_note') };
}
function table(head, rows, cap) {
  var t = h('table', { class: 'tbl ba-table' }, [h('caption', { class: 'ba-cap', text: cap })]);
  t.appendChild(h('thead', null, [h('tr', null, head.map(function (x) { return h('th', { scope: 'col', text: x }); }))]));
  var tb = h('tbody');
  rows.forEach(function (r) { tb.appendChild(h('tr', null, r.map(function (c, i) { return i === 1 ? h('th', { scope: 'row', text: c }) : h('td', { text: c }); }))); });
  t.appendChild(tb);
  return h('div', { class: 'tblw' }, [t]);
}
function groupTable(L, votes, meta, key, title) {
  var by = summarizeBy(votes, meta, key), names = Object.keys(by);
  if (names.length < 2) return null;
  var pre = key === 'lang' ? 'l_' : 'c_';
  var rows = names.map(function (g, i) {
    var s = by[g];
    return [String(i + 1), g === '?' ? '?' : L.t(pre + g), String(s.votes), s.rows.length ? s.rows.map(function (r) { return r.name; }).join(' > ') : '–'];
  });
  return h('div', { class: 'ba-group-table' }, [h('h3', { text: title }), table(['#', L.t(key === 'lang' ? 'col_lang' : 'col_cat'), L.t('col_votes'), L.t('col_order')], rows, title)]);
}
function rd(x) { return x === null || x === undefined ? '–' : String(Math.round(x)); }
function panelResults(L) {
  var box = h('div', { class: 'ba-box' });
  box.appendChild(h('h3', { text: L.t('r_title') }));
  var meta = metaMap();
  var catSel = h('select', { id: 'ba-fcat', class: 'sel ba-inp', onchange: function () { V.fcat = catSel.value; V.focus = 'ba-fcat'; render(); } }, [h('option', { value: 'all', text: L.t('r_all') })]);
  usedCats().concat(S.custom.map(function (c) { return c.category; }).filter(function (c, i, a) { return a.indexOf(c) === i && usedCats().indexOf(c) < 0; })).forEach(function (c) { catSel.appendChild(h('option', { value: c, selected: V.fcat === c, text: L.t('c_' + c) })); });
  var langSel = h('select', { id: 'ba-flang', class: 'sel ba-inp', onchange: function () { V.flang = langSel.value; V.focus = 'ba-flang'; render(); } }, [h('option', { value: 'all', text: L.t('r_all') })]);
  LANGS.forEach(function (l) { langSel.appendChild(h('option', { value: l, selected: V.flang === l, text: L.t('l_' + l) })); });
  catSel.value = V.fcat; langSel.value = V.flang;
  if (catSel.value !== V.fcat) { V.fcat = 'all'; catSel.value = 'all'; }
  if (langSel.value !== V.flang) { V.flang = 'all'; langSel.value = 'all'; }
  box.appendChild(h('div', { class: 'ba-bar' }, [field(L.t('r_fcat'), catSel, 'ba-fcat'), field(L.t('r_flang'), langSel, 'ba-flang')]));
  var votes = S.votes.filter(function (v) { var m = meta[v.prompt] || { category: '?', lang: '?' }; return (V.fcat === 'all' || m.category === V.fcat) && (V.flang === 'all' || m.lang === V.flang); });
  var file = h('input', { type: 'file', id: 'ba-vfile', class: 'ba-file', accept: '.jsonl,.json,.txt,text/plain,application/json' });
  file.addEventListener('change', function () {
    readFile(file.files && file.files[0], function (text) {
      var r = parseVotes(text), m = mergeVotes(S.votes, r.votes);
      S.votes = m.votes; saveNow();
      flash(L.f('r_imported', m.added, m.duplicates, r.errors.length), r.errors.slice(0, 5).map(function (e) { return L.f('line_err', e.line, L.t('err_' + e.error)); }));
      V.focus = 'ba-vfile'; render();
    });
    file.value = '';
  });
  var io = h('div', { class: 'ba-bar' }, [
    h('button', { type: 'button', class: 'btn', id: 'ba-dlvotes', text: L.t('r_dl_votes'), disabled: !S.votes.length, onclick: function () { downloadText('votes.jsonl', votesToText(S.votes), 'application/x-ndjson'); } }),
    file, h('label', { class: 'btn ba-filelab', for: 'ba-vfile', text: L.t('r_import') })
  ]);
  if (!votes.length) {
    box.appendChild(h('p', { class: 'ba-empty', id: 'ba-rnone', text: S.votes.length ? L.t('r_none_filter') : L.t('r_none') }));
    box.appendChild(io);
    return box;
  }
  var sum = summarize(votes, { rounds: votes.length > 3000 ? 60 : 200, seed: 1 });
  box.appendChild(h('p', { id: 'ba-rsum', text: L.f('r_votes', sum.votes, sum.counted) }));
  if (sum.counted < 30) box.appendChild(h('p', { class: 'note ba-warn', id: 'ba-rfew', text: L.t('r_few') }));
  var rows = sum.rows.map(function (r) { return [String(r.rank), r.name, rd(r.bt), r.lo === null ? '–' : rd(r.lo) + '–' + rd(r.hi), rd(r.elo), r.winRate === null ? '–' : Math.round(r.winRate * 100) + '%', String(r.games), String(r.bad)]; });
  box.appendChild(table([L.t('col_rank'), L.t('col_model'), L.t('col_bt'), L.t('col_ci'), L.t('col_elo'), L.t('col_win'), L.t('col_games'), L.t('col_bad')], rows, L.t('r_title')));
  box.appendChild(h('p', { class: 'note', text: L.f('r_ci_note', sum.counted > 0 ? (votes.length > 3000 ? 60 : 200) : 0) }));
  if (sum.position.aShare !== null) box.appendChild(h('p', { id: 'ba-rpos', text: L.f('r_pos', Math.round(sum.position.aShare * 100)) }));
  var names = sum.rows.map(function (r) { return r.name; });
  if (names.length >= 2) {
    var hrows = names.map(function (x, i) { return [String(i + 1), x].concat(names.map(function (y) { var c = sum.h2h[x][y]; return x === y ? '·' : c ? c.w + '–' + c.l + '–' + c.t : '0–0–0'; })); });
    box.appendChild(h('h3', { text: L.t('r_h2h') }));
    box.appendChild(table(['#', L.t('col_model')].concat(names.map(function (n, i) { return String(i + 1); })), hrows, L.t('r_h2h')));
  }
  var gc = groupTable(L, votes, meta, 'category', L.t('r_bycat')), gl = groupTable(L, votes, meta, 'lang', L.t('r_bylang'));
  if (gc) box.appendChild(gc);
  if (gl) box.appendChild(gl);
  box.appendChild(io);
  box.appendChild(h('div', { class: 'ba-bar' }, [
    h('button', { type: 'button', class: 'btn', id: 'ba-dlpage', text: L.t('r_dl_page'), onclick: function () { downloadText('balanta-results.html', resultsPage(sum, pageLabels(L), L.lang), 'text/html'); } }),
    h('button', { type: 'button', class: 'btn', id: 'ba-copymd', text: L.t('r_copy_md'), onclick: function () { copyText(ratingsMarkdown(sum.rows, pageLabels(L)), function () { flash(L.t('copied')); }, function () { flash(L.t('copy_fail')); }); } }),
    h('button', {
      type: 'button', class: 'btn', id: 'ba-clear', text: V.confirm === 'clear' ? L.t('r_clear2') : L.t('r_clear'),
      onclick: function () {
        if (V.confirm !== 'clear') { V.confirm = 'clear'; V.focus = 'ba-clear'; render(); return; }
        S.votes = []; V.lastVote = null; V.confirm = ''; saveNow(); flash(L.t('r_cleared')); V.focus = 'ba-t-results'; render();
      }
    })
  ]));
  return box;
}

/* --- Prompturi --- */
function draftOf() { return V.draft || (V.draft = { text: '', lang: usedLangs()[0] || 'ro', cat: usedCats()[0] || 'grammar', diff: 'easy', notes: '', sources: '' }); }
function checkDraft(d) {
  var issues = checkPrompt(d.text, d.lang), urls = d.sources.split(/\r?\n/).map(function (x) { return x.trim(); }).filter(Boolean), bad = [];
  urls.forEach(function (u) { if (!isHttps(u)) bad.push(u); });
  if (d.cat === 'culture') { if (!d.notes.trim()) issues.push('notes'); if (!urls.length) issues.push('sources'); }
  return { issues: issues, bad: bad, urls: urls };
}
function panelPrompts(L) {
  var box = h('div', { class: 'ba-box' }), d = draftOf();
  var text = h('textarea', { id: 'ba-pt', class: 'ba-inp', rows: '5', maxlength: String(LIMITS.prompt + 100), spellcheck: 'true' });
  text.value = d.text;
  text.addEventListener('input', function () { d.text = text.value; });
  var lang = h('select', { id: 'ba-pl', class: 'sel ba-inp', onchange: function () { d.lang = lang.value; } }), cat = h('select', { id: 'ba-pc', class: 'sel ba-inp', onchange: function () { d.cat = cat.value; } }), diff = h('select', { id: 'ba-pd', class: 'sel ba-inp', onchange: function () { d.diff = diff.value; } });
  LANGS.forEach(function (l) { lang.appendChild(h('option', { value: l, selected: d.lang === l, text: L.t('l_' + l) })); });
  CATEGORIES.forEach(function (c) { cat.appendChild(h('option', { value: c, selected: d.cat === c, text: L.t('c_' + c) })); });
  DIFFS.forEach(function (x) { diff.appendChild(h('option', { value: x, selected: d.diff === x, text: L.t('d_' + x) })); });
  lang.value = d.lang; cat.value = d.cat; diff.value = d.diff;
  var notes = h('textarea', { id: 'ba-pn', class: 'ba-inp', rows: '3', maxlength: String(LIMITS.prompt) }), src = h('textarea', { id: 'ba-ps', class: 'ba-inp', rows: '2', spellcheck: 'false' });
  notes.value = d.notes; src.value = d.sources;
  notes.addEventListener('input', function () { d.notes = notes.value; });
  src.addEventListener('input', function () { d.sources = src.value; });
  box.appendChild(h('h3', { text: L.t('p_title') }));
  box.appendChild(h('p', { class: 'note', text: L.f('p_bundled', BUNDLED.length) }));
  box.appendChild(field(L.t('p_text_l'), text, 'ba-pt'));
  box.appendChild(h('div', { class: 'ba-bar' }, [field(L.t('p_lang_l'), lang, 'ba-pl'), field(L.t('p_cat_l'), cat, 'ba-pc'), field(L.t('p_diff_l'), diff, 'ba-pd')]));
  box.appendChild(field(L.t('p_notes_l'), notes, 'ba-pn'));
  box.appendChild(field(L.t('p_src_l'), src, 'ba-ps'));
  var out = h('div', { class: 'ba-check-out', id: 'ba-pout', role: 'status' });
  function showCheck(r) {
    out.textContent = '';
    if (!r.issues.length && !r.bad.length) { out.appendChild(h('p', { class: 'ba-ok', text: L.t('p_ok') })); return; }
    out.appendChild(h('p', { text: L.t('p_issues') }));
    out.appendChild(h('ul', { class: 'ba-lines' }, r.issues.map(function (c) {
      var must = BLOCKING[c] || c === 'notes' || c === 'sources';
      return h('li', { class: must ? 'ba-bad' : '', text: L.t(must ? 'p_must' : 'p_warn') + ' ' + L.t('issue_' + c) });
    }).concat(r.bad.map(function (u) { return h('li', { class: 'ba-bad', text: L.t('p_must') + ' ' + L.f('issue_badurl', u) }); }))));
  }
  function collect() { d.text = text.value; d.lang = lang.value; d.cat = cat.value; d.diff = diff.value; d.notes = notes.value; d.sources = src.value; }
  box.appendChild(h('div', { class: 'ba-bar' }, [
    h('button', { type: 'button', class: 'btn', id: 'ba-pcheck', text: L.t('p_check'), onclick: function () { collect(); showCheck(checkDraft(d)); } }),
    h('button', {
      type: 'button', class: 'btn pri', id: 'ba-padd', text: L.t('p_add'),
      onclick: function () {
        collect();
        var r = checkDraft(d);
        showCheck(r);
        var blocked = r.bad.length > 0 || r.issues.some(function (c) { return BLOCKING[c] || c === 'notes' || c === 'sources'; });
        if (blocked) return;
        if (S.custom.length >= MAX_CUSTOM) { flash(L.t('e_custom')); return; }
        var n = 1;
        S.custom.forEach(function (c) { var k = +c.id.slice(7); if (k >= n) n = k + 1; });
        S.custom.push({ id: 'custom-' + n, lang: d.lang, category: d.cat, prompt: d.text.trim(), difficulty: d.diff, notes: d.notes.trim(), sources: r.urls, custom: true });
        saveNow();
        flash(L.f('p_added', 'custom-' + n));
        V.draft = null; V.focus = 'ba-pt'; render();
      }
    })
  ]));
  box.appendChild(out);
  box.appendChild(h('h3', { text: L.t('p_custom_h') }));
  if (!S.custom.length) box.appendChild(h('p', { class: 'ba-empty', text: L.t('p_none_custom') }));
  else {
    var ul = h('ul', { class: 'ba-custom' });
    S.custom.forEach(function (c, i) {
      ul.appendChild(h('li', null, [
        h('span', { class: 'ba-cid', text: c.id + ' → ' + repoId(c) }), ' ', h('span', { class: 'ba-cprompt', text: c.prompt.length > 90 ? c.prompt.slice(0, 90) + '…' : c.prompt }), ' ',
        h('button', { type: 'button', class: 'btn', id: 'ba-cd-' + i, text: L.t('p_dl'), onclick: function () { downloadText(repoId(c) + '.json', promptJson(c), 'application/json'); } }), ' ',
        h('button', { type: 'button', class: 'btn', id: 'ba-cr-' + i, text: L.t('p_rm'), onclick: function () { S.custom.splice(i, 1); delete S.answers[c.id]; S.votes = S.votes.filter(function (v) { return v.prompt !== c.id; }); saveNow(); V.focus = 'ba-t-prompts'; render(); } })
      ]));
    });
    box.appendChild(ul);
    box.appendChild(h('p', { class: 'note', text: L.t('p_pr') }));
  }
  return box;
}
var PANELS = { setup: panelSetup, answers: panelAnswers, vote: panelVote, results: panelResults, prompts: panelPrompts };

/* ---------- montare ---------- */
function boot() {
  if (booted) return;
  booted = true;
  buildBundled();
  S = loadState();
  window.addEventListener('pagehide', function () { if (saveTimer) saveNow(); });
  document.addEventListener('visibilitychange', function () { if (document.visibilityState === 'hidden' && saveTimer) saveNow(); });
}
function mount(el, lang) {
  cur.el = el; cur.lang = lang; cur.L = makeL(lang);
  boot();
  var L = cur.L, card = el.parentNode;
  if (card && card.classList) card.classList.add('in');
  el.textContent = '';
  V.live = h('div', { class: 'ba-msg', id: 'ba-live', role: 'status', 'aria-live': 'polite' });
  V.main = h('div', { class: 'ba-main' });
  el.appendChild(h('p', { class: 'ba-intro', text: L.t('intro') }));
  el.appendChild(V.live);
  el.appendChild(V.main);
  var lim = h('section', { class: 'card rv in ba-card', id: 'ba-lim-card' }, [h('h2', { id: 'ba-lim-h', text: L.t('h_limits') }), h('ul', { class: 'ba-list' }, [1, 2, 3, 4, 5, 6].map(function (i) { return h('li', { text: L.t('lim_' + i) }); }))]);
  if (card && card.insertAdjacentElement) card.insertAdjacentElement('afterend', lim);
  render();
}
