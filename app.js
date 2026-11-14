/* SISSÊ~KABA — simulateur de scénarios : interface. */
(function () {
  'use strict';
  const $ = (s, r) => (r || document).querySelector(s);
  const $$ = (s, r) => Array.from((r || document).querySelectorAll(s));
  const fr = SKV.fr;
  const NET_DEFAULT = { actuel: 513, nouveaux: 4, vol: 53.6, g: 0, r27: 50, r28: 100, r29: 100, auto: true };
  const state = { mkt: { MGP: 0, MGA: 0 }, net: Object.assign({}, NET_DEFAULT), base: null, hyp: {}, wbOp: null, buffers: {}, values: null, V: null, ref: null, label: '', downloads: null, busy: false };
  const YC = ['B', 'C', 'D'];

  /* ---------- paramètres exposés ---------- */
  // apply: 'all' = même valeur sur les 3 années ; 'b' = 2027 seulement ; 'growth' = 2027 puis +2 %/an
  const LEVERS = [
    { g: 'Objectifs', k: 'B5', lab: 'Prémix 2027', unit: 't', min: 50, max: 3000, step: 10, apply: 'b' },
    { g: 'Objectifs', k: 'C52', lab: 'Croissance 2028', unit: '%', pct: true, min: -20, max: 100, step: 0.5, apply: 'b' },
    { g: 'Objectifs', k: 'D52', lab: 'Croissance 2029', unit: '%', pct: true, min: -20, max: 100, step: 0.5, apply: 'b' },
    { g: 'FEED', k: 'B65', lab: 'Prix du sac de prémix chair 2027', unit: 'FCFA', min: 10000, max: 60000, step: 100, apply: 'b' },
    { g: 'FEED', k: 'B67', lab: 'Marge prémix chair', unit: '%', pct: true, min: 0, max: 60, step: 0.1, apply: 'all' },
    { g: 'FEED', k: 'B66', lab: 'Prix du sac de prémix pondeuse 2027', unit: 'FCFA', min: 10000, max: 60000, step: 100, apply: 'b' },
    { g: 'FEED', k: 'B68', lab: 'Marge prémix pondeuse', unit: '%', pct: true, min: 0, max: 60, step: 0.1, apply: 'all' },
    { g: 'FEED', k: 'B73', lab: 'Prix du sac de prémix porcin 2027', unit: 'FCFA', min: 10000, max: 60000, step: 100, apply: 'b' },
    { g: 'FEED', k: 'B74', lab: 'Marge prémix porcin', unit: '%', pct: true, min: 0, max: 60, step: 0.1, apply: 'all' },
    { g: 'FEED', k: 'C75', lab: 'Hausse des prix du prémix en 2028', unit: '%', pct: true, min: -10, max: 20, step: 0.5, apply: 'b' },
    { g: 'FEED', k: 'D75', lab: 'Hausse des prix du prémix en 2029', unit: '%', pct: true, min: -10, max: 20, step: 0.5, apply: 'b' },
    { g: 'FEED', k: 'B8', lab: 'Maïs dans l’aliment fini', unit: '%', pct: true, min: 30, max: 75, step: 1, apply: 'all' },
    { g: 'SEED', k: 'B12', lab: 'Rendement brut', unit: 't/ha', min: 1.5, max: 8, step: 0.1, apply: 'all' },
    { g: 'SEED', k: 'B13', lab: 'Fraction utilisable', unit: '%', pct: true, min: 70, max: 100, step: 1, apply: 'all' },
    { g: 'SEED', k: 'B14', lab: 'Récolte affectée au programme', unit: '%', pct: true, min: 40, max: 100, step: 1, apply: 'all' },
    { g: 'SEED', k: 'B16', lab: 'Couverture commerciale intrants', unit: '%', pct: true, min: 20, max: 100, step: 1, apply: 'all' },
    { g: 'SEED', k: 'B15', lab: 'Surface moyenne par producteur', unit: 'ha', min: 1, max: 50, step: 0.5, apply: 'all' },
    { g: 'SEED', k: 'B17', lab: 'Marge SEED sur coût (moyenne ; appliquer à tous les intrants)', unit: '%', pct: true, min: 5, max: 80, step: 0.5, apply: 'seedall' },
    { g: 'Budget IT et marketing', k: 'B27', lab: 'Frais fixes plateforme 2027', unit: 'M FCFA', mil: true, min: 0, max: 100, step: 0.5, apply: 'b' },
    { g: 'Budget IT et marketing', k: 'B29', lab: 'Frais variables plateforme 2027', unit: 'FCFA/t', min: 0, max: 20000, step: 100, apply: 'growth' },
    { g: 'Budget IT et marketing', k: 'B28', lab: 'Part affectée au marketing', unit: '%', pct: true, min: 0, max: 100, step: 1, apply: 'all' },
    { g: 'Risques et BFR', k: 'B30', lab: 'Pertes sur créances', unit: '% CA', pct: true, min: 0, max: 10, step: 0.1, apply: 'all' },
    { g: 'Risques et BFR', k: 'B34', lab: 'Délai clients SEED', unit: 'jours', min: 0, max: 180, step: 5, apply: 'all' },
    { g: 'Risques et BFR', k: 'B38', lab: 'Coefficient saisonnier BFR', unit: '×', min: 1, max: 2.5, step: 0.05, apply: 'all' },
    { g: 'Marché Côte d’Ivoire', k: 'B56', lab: 'Marché national du prémix 2027', unit: 't/an', min: 5000, max: 100000, step: 500, apply: 'b' },
    { g: 'Marché Côte d’Ivoire', k: 'MGP', lab: 'Croissance annuelle du marché du prémix', unit: '%/an', min: -10, max: 30, step: 0.5, apply: 'mkt' },
    { g: 'Marché Côte d’Ivoire', k: 'B57', lab: 'Marché national de l’aliment fini 2027', unit: 't/an', min: 50000, max: 2000000, step: 5000, apply: 'b' },
    { g: 'Marché Côte d’Ivoire', k: 'MGA', lab: 'Croissance annuelle du marché de l’aliment', unit: '%/an', min: -10, max: 30, step: 0.5, apply: 'mkt' },
    { g: 'Marché Côte d’Ivoire', k: 'B58', lab: 'Ventes actuelles de prémix SOLEVO (hors programme)', unit: 't/an', min: 0, max: 20000, step: 50, apply: 'all' },
    { g: 'Marché Côte d’Ivoire', k: 'B59', lab: 'Part des ventes de prémix : chair', unit: '%', pct: true, min: 0, max: 100, step: 0.5, apply: 'all' },
    { g: 'Marché Côte d’Ivoire', k: 'B69', lab: 'Part des ventes de prémix : porcin (reste : pondeuse)', unit: '%', pct: true, min: 0, max: 100, step: 0.5, apply: 'all' },
    { g: 'Acteurs', k: 'GB3', lab: 'Prix ancien du maïs P (illustratif)', unit: 'FCFA/kg', min: 50, max: 500, step: 5, apply: 'gains' },
  ];
  const PRESETS = {
    s2: { label: 'Scénario 2 : 500 t, croissance 10 %/an', set: {} },
    s1: { label: 'Scénario 1 : 300 t, 450 t, 600 t (dossier du 12/11)', set: { 'Hypotheses!B5': 300, 'Hypotheses!C52': 0.5, 'Hypotheses!D52': 1 / 3 } },
    stress: { label: 'Test de stress : 500 t, +5 %/an, rendement 3,5 t/ha, couverture 60 %, pertes 3 %', set: { 'Hypotheses!C52': 0.05, 'Hypotheses!D52': 0.05, 'Hypotheses!B12': 3.5, 'Hypotheses!C12': 3.5, 'Hypotheses!D12': 3.5, 'Hypotheses!B16': 0.6, 'Hypotheses!C16': 0.6, 'Hypotheses!D16': 0.6, 'Hypotheses!B30': 0.03, 'Hypotheses!C30': 0.03, 'Hypotheses!D30': 0.03 } },
  };

  /* ---------- chargement ---------- */
  async function getBuf(path) {
    if (state.buffers[path]) return state.buffers[path].slice(0);
    if (window.SK_TPL && window.SK_TPL[path]) {
      const bin = atob(window.SK_TPL[path]); const u = new Uint8Array(bin.length);
      for (let i = 0; i < bin.length; i++) u[i] = bin.charCodeAt(i);
      state.buffers[path] = u.buffer; return u.buffer.slice(0);
    }
    const r = await fetch(path);
    if (!r.ok) throw new Error('Fichier introuvable : ' + path);
    const b = await r.arrayBuffer();
    state.buffers[path] = b;
    return b.slice(0);
  }
  async function loadTemplate() {
    const zip = await JSZip.loadAsync(await getBuf('tpl/Modele_Operationnel.xlsx'));
    state.wbOp = await SKX.loadWorkbook(zip);
    const H = state.wbOp.sheets['Hypotheses'].cells;
    state.base = {};
    for (const ref in H) {
      const r = +ref.replace(/[A-Z]+/, '');
      const c = ref.replace(/\d+/, '');
      if (r >= 5 && r <= 77 && r !== 54 && 'BCD'.includes(c) && !H[ref].f && H[ref].value !== null) state.base['Hypotheses!' + ref] = H[ref].value;
    }
    state.base['Gains acteurs!B3'] = state.wbOp.sheets['Gains acteurs'].cells['B3'].value;
    state.rows = [];
    for (let r = 5; r <= 77; r++) {
      if (r === 54) continue;
      const a = H['A' + r];
      if (a && a.value) state.rows.push({ r, label: a.value, unit: (H['E' + r] || {}).value || '', note: (H['F' + r] || {}).value || '' });
    }
  }

  function overrides() {
    const o = Object.assign({}, state.hyp);
    o['Hypotheses!B54'] = state.label || 'Scénario personnalisé';
    return o;
  }
  function compute(hyp) {
    const o = Object.assign({}, hyp); o['Hypotheses!B54'] = state.label || 'Scénario personnalisé';
    return SKX.evaluate(state.wbOp, o);
  }
  function today() {
    const d = new Date();
    const p = (n) => String(n).padStart(2, '0');
    const mois = ['janvier', 'février', 'mars', 'avril', 'mai', 'juin', 'juillet', 'août', 'septembre', 'octobre', 'novembre', 'décembre'];
    const M = mois[d.getMonth()]; const j = d.getDate();
    return { iso: `${d.getFullYear()}-${p(d.getMonth() + 1)}-${p(j)}`, fr: `${p(j)}/${p(d.getMonth() + 1)}/${d.getFullYear()}`, long: `${j} ${M} ${d.getFullYear()}`, garde: `©${M[0].toUpperCase() + M.slice(1)} ${p(j)}${j === 1 ? 'er' : 'ème'} ${d.getFullYear()}` };
  }
  function tag(N) {
    const g = (x) => (x === null ? '' : String(+(x * 100).toFixed(1)).replace('.', ','));
    const same = Math.abs(N.croiss28 - N.croiss29) < 1e-9;
    return `${+N.premix27.toFixed(1)}t-${same ? g(N.croiss28) + 'pct' : g(N.croiss28) + '-' + g(N.croiss29) + 'pct'}`.replace(/,/g, 'p');
  }

  function applyNetwork() {
    const n = state.net; if (!n.auto) return;
    [['B', 1, n.r27], ['C', 2, n.r28], ['D', 3, n.r29]].forEach(([c, k, r]) => {
      state.hyp['Hypotheses!' + c + '58'] = Math.round(n.actuel * Math.pow(1 + n.g / 100, k) + n.nouveaux * n.vol * r / 100);
    });
  }
  function applyMarket() {
    const g = state.mkt;
    [['56', g.MGP], ['57', g.MGA]].forEach(([r, pc]) => {
      const b = state.hyp['Hypotheses!B' + r]; if (typeof b !== 'number') return;
      state.hyp['Hypotheses!C' + r] = Math.round(b * (1 + pc / 100));
      state.hyp['Hypotheses!D' + r] = Math.round(b * Math.pow(1 + pc / 100, 2));
    });
  }
  function recalc() {
    applyMarket();
    applyNetwork();
    state.values = compute(state.hyp);
    const d = today();
    let pre = SKV.build(state.values, {});
    if (state.autoLabel) {
      const N = pre.N, p = (x) => fr(x * 100, 1) + ' %';
      state.label = `Scénario personnalisé : ${fr(N.premix27, N.premix27 % 1 ? 1 : 0)} t en 2027, croissance ${p(N.croiss28)} puis ${p(N.croiss29)}`;
      state.values = compute(state.hyp); pre = SKV.build(state.values, {});
    }
    state.tag = tag(pre.N);
    state.V = SKV.build(state.values, { date: d.fr, dateLong: d.long, dateGarde: d.garde, label: state.label, tag: state.tag, depNew: (state.net && state.net.nouveaux) ?? 4, temo: state.temo });
    render();
  }

  /* ---------- rendu ---------- */
  function leverValue(L) {
    if (L.k === 'GB3') return state.hyp['Gains acteurs!B3'];
    if (L.apply === 'seedall') return +(((state.values && state.values['Hypotheses!B17']) || 0) * 100).toFixed(2);
    if (L.apply === 'mkt') return state.mkt[L.k];
    const v = state.hyp['Hypotheses!' + L.k];
    if (L.pct) return +(v * 100).toFixed(4);
    if (L.mil) return +(v / 1e6).toFixed(3);
    return v;
  }
  function setLever(L, raw) {
    let v = parseFloat(String(raw).replace(',', '.'));
    if (!isFinite(v)) return;
    if (L.pct) v = v / 100;
    if (L.mil) v = v * 1e6;
    const row = L.k.replace(/[A-Z]+/, '');
    if (L.k === 'B58') state.net.auto = false;
    if (L.apply === 'mkt') { state.mkt[L.k] = parseFloat(String(raw).replace(',', '.')); markCustom(); return; }
    if (L.apply === 'seedall') { [60, 61, 62, 63, 64].forEach((r) => YC.forEach((c) => { state.hyp['Hypotheses!' + c + r] = v; })); markCustom(); return; }
    if (L.apply === 'gains') state.hyp['Gains acteurs!B3'] = v;
    else if (L.apply === 'b') state.hyp['Hypotheses!' + L.k] = v;
    else if (L.apply === 'all') YC.forEach((c) => { if (!isFormula(c + row)) state.hyp['Hypotheses!' + c + row] = v; });
    else if (L.apply === 'growth') { state.hyp['Hypotheses!B' + row] = v; state.hyp['Hypotheses!C' + row] = Math.round(v * 1.02); state.hyp['Hypotheses!D' + row] = Math.round(v * 1.02 * 1.02); }
    markCustom();
  }
  function markCustom() {
    $('#preset').value = 'custom';
    if (!state.userLabel) state.autoLabel = true;
  }

  function buildLevers() {
    const box = $('#levers'); box.innerHTML = '';
    let grp = null, wrap = null;
    for (const L of LEVERS) {
      if (L.g !== grp) {
        grp = L.g;
        const fs = document.createElement('fieldset'); fs.innerHTML = `<legend>${grp}</legend>`; box.appendChild(fs); wrap = fs;
        if (grp === 'FEED') {
          const d = document.createElement('div'); d.className = 'lever';
          d.innerHTML = `<label>Base de la marge FEED</label><div class="seg"><button data-base="Sur coût">Sur coût</button><button data-base="Sur CA">Sur CA</button></div>`;
          wrap.appendChild(d);
        }
      }
      const d = document.createElement('div'); d.className = 'lever';
      d.innerHTML = `<label for="lv-${L.k}">${L.lab}<span class="u">${L.unit}</span></label>
        <div class="row"><input type="range" id="rg-${L.k}" min="${L.min}" max="${L.max}" step="${L.step}"><input type="number" inputmode="decimal" id="lv-${L.k}" min="${L.min}" max="${L.max}" step="${L.step}"></div>`;
      wrap.appendChild(d);
      const rg = $('#rg-' + L.k, d), nb = $('#lv-' + L.k, d);
      rg.addEventListener('input', () => { nb.value = rg.value; setLever(L, rg.value); schedule(); });
      nb.addEventListener('change', () => { rg.value = nb.value; setLever(L, nb.value); schedule(); });
    }
    $$('[data-base]').forEach((b) => b.addEventListener('click', () => {
      YC.forEach((c) => { state.hyp['Hypotheses!' + c + '11'] = b.dataset.base; });
      markCustom(); syncInputs(); recalc();
    }));
  }
  function syncInputs() {
    for (const L of LEVERS) {
      const v = leverValue(L);
      const nb = $('#lv-' + L.k), rg = $('#rg-' + L.k);
      if (nb && document.activeElement !== nb) nb.value = v;
      if (rg) rg.value = v;
    }
    const base = state.hyp['Hypotheses!B11'];
    $$('[data-base]').forEach((b) => b.classList.toggle('on', b.dataset.base.toLowerCase() === String(base).toLowerCase()));
    $('#label').value = state.label;
    buildAdvanced();
  }
  function buildAdvanced() {
    const tb = $('#adv tbody'); if (!tb) return;
    tb.innerHTML = state.rows.map((r) => {
      const cells = YC.map((c) => {
        const key = 'Hypotheses!' + c + r.r;
        const formula = state.wbOp.sheets['Hypotheses'].cells[c + r.r] && state.wbOp.sheets['Hypotheses'].cells[c + r.r].f;
        if (formula) return `<td class="calc" title="Calculé : ${formula}">${fr(state.values ? state.values[key] : 0, 1)}</td>`;
        const v = state.hyp[key];
        if (v === undefined || v === null) return '<td></td>';
        return `<td><input data-k="${key}" value="${typeof v === 'number' ? +v.toPrecision(10) : v}"></td>`;
      }).join('');
      return `<tr><th>${r.label}<small>${r.unit}</small></th>${cells}</tr>`;
    }).join('');
    $$('#adv input[data-k]').forEach((i) => i.addEventListener('change', () => {
      const k = i.dataset.k; const old = state.hyp[k];
      state.hyp[k] = typeof old === 'number' ? parseFloat(i.value.replace(',', '.')) : i.value;
      markCustom(); syncInputs(); recalc();
    }));
  }

  let tmr = null;
  function schedule() { clearTimeout(tmr); tmr = setTimeout(recalc, 120); }

  function delta(a, b, d) {
    if (b === null || b === undefined) return '';
    const x = a - b; if (Math.abs(x) < 1e-6) return '<span class="d0">=</span>';
    return `<span class="${x > 0 ? 'dp' : 'dn'}">${x > 0 ? '+' : '−'}${fr(Math.abs(x), d)}</span>`;
  }
  function bars(title, series, cats, unit) {
    const W = 300, H = 150, pad = 22;
    const max = Math.max(...series.flatMap((s) => s.v), 1);
    const gw = (W - pad) / cats.length; const n = series.length; const bw = gw * 0.62 / n;
    const cols = ['#0B5FA1', '#37A028', '#9BBB59'];
    let g = '';
    cats.forEach((c, i) => {
      series.forEach((s, si) => {
        const h = Math.max(1, s.v[i] / max * (H - 40));
        const x = pad + i * gw + gw * 0.19 + si * bw;
        g += `<rect x="${x}" y="${H - 20 - h}" width="${bw - 2}" height="${h}" fill="${cols[si]}" rx="2"/>`;
        g += `<text x="${x + bw / 2 - 1}" y="${H - 24 - h}" text-anchor="middle" font-size="9" fill="#333">${fr(s.v[i], s.v[i] < 100 ? 1 : 0)}</text>`;
      });
      g += `<text x="${pad + i * gw + gw / 2}" y="${H - 6}" text-anchor="middle" font-size="10" fill="#555">${c}</text>`;
    });
    const leg = series.length > 1 ? `<div class="leg">${series.map((s, i) => `<span><i style="background:${cols[i]}"></i>${s.n}</span>`).join('')}</div>` : '';
    return `<figure class="chart"><figcaption>${title} <small>${unit}</small></figcaption><svg viewBox="0 0 ${W} ${H}" role="img" aria-label="${title}">${g}</svg>${leg}</figure>`;
  }

  /* équivalent euros (1 € = 656 FCFA) pour les CA et marges */
  function eurS(x) { if (typeof x !== 'number' || !isFinite(x)) return ''; const e = x / 656, a = Math.abs(e); return '≈ ' + (a >= 1e6 ? fr(e / 1e6, 2) + ' M€' : a >= 1e4 ? fr(e / 1e3, 0) + ' k€' : fr(e, 0) + ' €'); }
  const eurH = (x) => ` <small class="eur">(${eurS(x)})</small>`;
  const fcE = (x) => fr(x) + ' FCFA' + eurH(x);
  function render() {
    const { N, S } = state.V; const R = state.ref ? state.ref.N : null;
    $('#scenarioName').textContent = S.scenario;
    const kp = [
      ['Prémix 2027', S.premix27 + ' t', R && delta(N.premix27, R.premix27, 0)],
      ['Maïs 2027', S.mais27 + ' t', R && delta(N.mais27, R.mais27, 0)],
      ['Producteurs 2027', S.prod27, R && delta(N.prod27, R.prod27, 0)],
      ['CA SOLEVO 2027', S.ca27 + ' M' + `<small class="eur">${eurS(N.ca27)}</small>`, R && delta(N.ca27 / 1e6, R.ca27 / 1e6, 2)],
      ['Marge brute 2027', S.mb27 + ' M' + `<small class="eur">${eurS(N.mb27)}</small>`, R && delta(N.mb27 / 1e6, R.mb27 / 1e6, 2)],
      ['Résultat av. fin. et impôt', S.res27 + ' M' + `<small class="eur">${eurS(N.res27)}</small>`, R && delta(N.res27 / 1e6, R.res27 / 1e6, 2)],
      ['Marketing 2027', S.mkt27 + ' M', R && delta(N.mkt27 / 1e6, R.mkt27 / 1e6, 2)],
      ['BFR normatif 2027', S.bfr27 + ' M', R && delta(N.bfr27 / 1e6, R.bfr27 / 1e6, 2)],
      ['Enveloppe démarrage', S.env27 + ' M', R && delta(N.env27 / 1e6, R.env27 / 1e6, 2)],
    ];
    $('#kpis').innerHTML = kp.map(([l, v, d]) => `<div class="kpi"><div class="v">${v}</div><div class="l">${l}</div>${d ? `<div class="d">vs réf. ${d}</div>` : ''}</div>`).join('');
    const rows = [
      ['Prémix vendu (t)', 'premix'], ['Croissance', 'croiss'], ['Sacs de 20 kg', 'sacs'], ['Aliment fini (t)', 'aliment'], ['Maïs (t)', 'mais'],
      ['Surface minimum (ha)', 'haTerrain'], ['Producteurs équivalents', 'prod'], ['Élevages chair équivalents', 'chair'], ['Élevages ponte (alternative)', 'ponte'],
      ['CA FEED (M FCFA)', 'caFeed'], ['CA SEED (M FCFA)', 'caSeed'], ['CA du programme', 'ca', 1], ['Marge brute', 'mb', 1], ['Charges d’exploitation', 'charges'],
      ['dont marketing et communication', 'mkt'], ['dont solde à affecter', 'solde'], ['Résultat avant financement et impôt', 'res', 1],
      ['BFR normatif', 'bfr'], ['Flux avant financement et impôt', 'flux'], ['Enveloppe / capacité cible', 'env', 1], ['Seuil de prémix (t)', 'seuil'], ['Contrôles du modèle', 'ctrl'],
    ];
    const EUR_K = ['caFeed', 'caSeed', 'ca', 'mb', 'res'];
    $('#tbl tbody').innerHTML = rows.map(([l, k, strong]) => `<tr class="${strong ? 'strong' : ''}"><th>${l}</th>${['27', '28', '29'].map((y) => `<td>${S[k + y] || '—'}${EUR_K.includes(k) && typeof N[k + y] === 'number' ? `<small class="eur">${eurS(N[k + y])}</small>` : ''}</td>`).join('')}</tr>`).join('');
    $('#charts').innerHTML =
      bars('CA SOLEVO du programme', [{ n: 'FEED', v: [N.caFeed27, N.caFeed28, N.caFeed29].map((x) => x / 1e6) }, { n: 'SEED', v: [N.caSeed27, N.caSeed28, N.caSeed29].map((x) => x / 1e6) }], ['2027', '2028', '2029'], 'M FCFA') +
      bars('Marge brute et résultat', [{ n: 'Marge brute', v: [N.mb27, N.mb28, N.mb29].map((x) => x / 1e6) }, { n: 'Résultat', v: [N.res27, N.res28, N.res29].map((x) => x / 1e6) }], ['2027', '2028', '2029'], 'M FCFA') +
      bars('Maïs à mobiliser', [{ n: 'Maïs', v: [N.mais27, N.mais28, N.mais29] }], ['2027', '2028', '2029'], 't') +
      bars('Marketing et communication', [{ n: 'Marketing', v: [N.mkt27, N.mkt28, N.mkt29].map((x) => x / 1e6) }], ['2027', '2028', '2029'], 'M FCFA');
    const ok = N.ctrlOK.every((x) => x === N.ctrlTotal);
    $('#ctrl').className = 'ctrl ' + (ok ? 'ok' : 'ko');
    $('#ctrl').textContent = ok ? '✓ 7/7 contrôles de cohérence OK sur 2027, 2028 et 2029' : '⚠ Un contrôle de cohérence signale un écart : vérifier les hypothèses avancées';
    $('#gains').innerHTML = `Avec P = <b>${S.P} FCFA/kg</b> : producteur ${S.prixProdAv} → <b>${S.prixProdAp}</b> FCFA/kg (+30 %), acheteur ${S.P} → <b>${S.prixAchAp}</b> FCFA/kg (−15 %). Sur ${S.mais27} t en 2027 : <b>${S.gainP27} M FCFA</b> de recettes brutes en plus pour les producteurs et autant d’économies pour les acheteurs. <em>Gains conditionnels, jamais ajoutés au CA SOLEVO.</em>`;
    syncInputs();
    renderSim();
    renderObj();
    renderNet();
    renderDocs();
  }

  /* ---------- simulations SEED (intrants) et FEED (cheptel) ---------- */
  const INTRANTS = [
    { n: 'Semences', d: 41, p: 42, m: 60, ud: 'kg', up: 'FCFA/kg' },
    { n: 'NPK', d: 43, p: 44, m: 61, ud: 'kg', up: 'FCFA/kg' },
    { n: 'Urée', d: 45, p: 46, m: 62, ud: 'kg', up: 'FCFA/kg' },
    { n: 'Herbicide', d: 47, p: 48, m: 63, ud: 'L', up: 'FCFA/L' },
    { n: 'Insecticide', d: 49, p: 50, m: 64, ud: 'L', up: 'FCFA/L' },
  ];
  function isFormula(ref) { const c = state.wbOp && state.wbOp.sheets['Hypotheses'].cells[ref]; return !!(c && c.f); }
  function setAllYears(row, v) { YC.forEach((c) => { if (!isFormula(c + row)) state.hyp['Hypotheses!' + c + row] = v; }); markCustom(); }
  function simInput(row, scale) {
    const v = state.hyp['Hypotheses!B' + row];
    return `<input type="number" inputmode="decimal" data-hrow="${row}" ${scale ? `data-scale="${scale}"` : ''} value="${+(scale ? v / scale : v).toPrecision(8)}">`;
  }
  function bindSimInputs(root) {
    $$('input[data-hrow]', root).forEach((i) => {
      if (i.dataset.bound) return; i.dataset.bound = '1';
      i.addEventListener('change', () => {
        let v = parseFloat(String(i.value).replace(',', '.')); if (!isFinite(v) || v < 0) return;
        if (i.dataset.scale) v = v * parseFloat(i.dataset.scale);
        setAllYears(i.dataset.hrow, v); recalc();
      });
    });
  }
  const FEED_PRESETS = {
    realise: { 65: 29062, 66: 25080, 73: 28486, 67: 0.287, 68: 0.306, 74: 0.289 },
    catalogue: { 65: 31610, 66: 27210, 73: 31610, 67: 0.401, 68: 0.383, 74: 0.434 },
    mix: { 59: 0.486, 69: 0.064 },
    dossier: { 65: 30000, 66: 30000, 73: 30000, 67: 0.24, 68: 0.24, 74: 0.24, 59: 0.6, 69: 0, 70: 0.02, 71: 0.02, 72: 0.02 },
  };
  function applyFeedPreset(k) {
    const P = FEED_PRESETS[k]; if (!P) return;
    for (const r in P) setAllYears(r, P[r]);
    if (k === 'realise' || k === 'catalogue') YC.forEach((c) => { state.hyp['Hypotheses!' + c + '11'] = 'Sur coût'; }); // marges du fichier = % du coût d’achat
    syncInputs(); recalc();
  }
  function renderSim() {
    const { N } = state.V;
    const tRec = N.rdt, tLiv = N.tHa;
    // SEED
    const rows = INTRANTS.map((x) => {
      const dose = N[{ 41: 'doseSem', 43: 'doseNpk', 45: 'doseUree', 47: 'doseHerb', 49: 'doseIns' }[x.d]];
      const prix = N[{ 42: 'prixSem', 44: 'prixNpk', 46: 'prixUree', 48: 'prixHerb', 50: 'prixIns' }[x.p]];
      const m = state.hyp['Hypotheses!B' + x.m];
      const cout = prix / (1 + m);
      return { x, dose, prix, m, cout, ha: dose * prix, mHa: dose * (prix - cout) };
    });
    const panier = rows.reduce((a, r) => a + r.ha, 0);
    const mPanier = rows.reduce((a, r) => a + r.mHa, 0);
    const haC = N.haPanier27;
    $('#seedTbl tbody').innerHTML = rows.map((r) => `<tr><td>${r.x.n}</td><td>${simInput(r.x.d)} ${r.x.ud}</td><td>${simInput(r.x.p)} ${r.x.up}</td>
      <td>${simInput(r.x.m, 0.01)} %</td><td>${fr(r.cout)}</td><td>${fr(r.prix ? (r.prix - r.cout) / r.prix * 100 : 0, 1)} %</td>
      <td>${fr(r.ha)}</td><td>${fr(r.ha / tLiv)}</td><td>${fr(r.mHa)}</td><td>${fr(r.mHa / tLiv)}</td><td>${fr(r.mHa * haC / 1e6, 2)}</td><td>${fr(mPanier ? r.mHa / mPanier * 100 : 0, 1)} %</td></tr>`).join('');
    $('#seedTbl tfoot').innerHTML = `<tr><td>Panier complet</td><td></td><td></td><td>${fr(N.margeSeed * 100, 1)} %</td><td></td><td>${fr(panier ? mPanier / panier * 100 : 0, 1)} %</td><td>${fr(panier)}</td><td>${fr(panier / tLiv)}</td><td>${fr(mPanier)}</td><td>${fr(mPanier / tLiv)}</td><td>${fr(mPanier * haC / 1e6, 2)}</td><td>100 %</td></tr>`;
    $('#seedCards').innerHTML = rows.map((r) => `<div class="icard"><h3>${r.x.n}<small>${fr(mPanier ? r.mHa / mPanier * 100 : 0, 1)} % du gain</small></h3>
      <div class="in"><div><label>Dose / ha (${r.x.ud})</label>${simInput(r.x.d)}</div><div><label>Prix (${r.x.up})</label>${simInput(r.x.p)}</div><div><label>Marge % coût</label>${simInput(r.x.m, 0.01)}</div></div>
      <div class="out"><div><b>${fr(r.cout)}</b>Coût d’achat SOLEVO</div><div><b>${fr(r.prix ? (r.prix - r.cout) / r.prix * 100 : 0, 1)} %</b>Taux de marque</div>
      <div><b>${fr(r.ha)}</b>Prix / ha client</div><div><b>${fr(r.ha / tLiv)}</b>Prix / t livrée</div>
      <div><b>${fr(r.mHa)}</b>Gain SOLEVO / ha</div><div><b>${fr(r.mHa / tLiv)}</b>Gain / t livrée</div>
      <div><b>${fr(r.mHa * haC / 1e6, 2)} M</b>Gain 2027 (FCFA)</div></div></div>`).join('') +
      `<div class="icard tot"><h3>Panier complet<small>100 %</small></h3><div class="out"><div><b>${fr(N.margeSeed * 100, 1)} %</b>Marge moyenne / coût</div><div><b>${fr(panier ? mPanier / panier * 100 : 0, 1)} %</b>Taux de marque</div>
      <div><b>${fr(panier)}</b>Prix / ha client</div><div><b>${fr(panier / tLiv)}</b>Prix / t livrée</div><div><b>${fr(mPanier)}</b>Gain / ha</div><div><b>${fr(mPanier / tLiv)}</b>Gain / t livrée</div>
      <div><b>${fr(mPanier * haC / 1e6, 2)} M</b>Gain 2027 (FCFA)</div></div></div>`;
    bindSimInputs($('#seedCards'));
    const mSeed = N.margeSeed / (1 + N.margeSeed);
    const prixProd = N.prixProdAp * 1000; // FCFA/t visé producteur
    const recetteHa = N.rdt * N.util * prixProd;
    $('#seedK').innerHTML = [
      ['Coût intrants / ha', fr(panier) + ' FCFA'],
      ['Coût / t de maïs livrée', fr(panier / tLiv) + ' FCFA'],
      ['Rendement utile programme', fr(tLiv, 2) + ' t/ha'],
      ['Gain réel SOLEVO / ha (marge moyenne ' + fr(N.margeSeed * 100, 1) + ' % sur coût)', fr(mPanier) + ' FCFA' + eurH(mPanier)],
      ['Gain réel SOLEVO SEED 2027 (marge brute)', fr(N.mbSeed27 / 1e6, 2) + ' M FCFA' + eurH(N.mbSeed27)],
      ['Gain réel / t de maïs livrée', fr(mPanier / tLiv) + ' FCFA'],
      ['CA SEED / t de maïs (couverture ' + fr(N.couv * 100) + ' %)', fr(N.caIntT27) + ' FCFA'],
      ['Recette brute producteur / ha (P = ' + fr(N.P) + ')', fr(recetteHa) + ' FCFA'],
      ['Poids des intrants dans la recette', recetteHa ? fr(panier / recetteHa * 100, 1) + ' %' : 'n.d.'],
      ['Hectares couverts 2027', fr(N.haPanier27) + ' ha'],
    ].map(([l, v]) => `<div><b>${v}</b>${l}</div>`).join('');
    // FEED chair
    const sacT = 1000 / N.sacKg; // sacs par tonne de prémix
    const alimSac = N.alimSac;   // t d'aliment par sac
    const S = state.V.S;
    const cu = (p, m) => (N.surCout ? p / (1 + m) : p * (1 - m));
    const cuC = cu(N.prixChair, N.mChair), cuP = cu(N.prixPonte, N.mPonte), cuK = cu(N.prixPorc, N.mPorc);
    const asC = N.sacKg / 1000 / N.inclChair, asP = N.sacKg / 1000 / N.inclPonte, asK = N.sacKg / 1000 / N.inclPorc; // t d'aliment par sac
    const cPlaces = N.placesFerme, kg = N.kgPoulet, cyc = N.cycles;
    const aCycle = cPlaces * kg / 1000, aAn = aCycle * cyc;
    const chair = [
      ['Cheptel (places)', fr(cPlaces)],
      ['Aliment par cycle', fr(aCycle, 1) + ' t'],
      ['Aliment par an (' + fr(cyc, cyc % 1 ? 1 : 0) + ' cycles)', fr(aAn, 1) + ' t'],
      ['Poulets produits par an', fr(cPlaces * cyc)],
      ['Maïs par an (' + fr(N.txMais * 100) + ' %)', fr(aAn * N.txMais, 1) + ' t'],
      ['Sacs de prémix par cycle', fr(aCycle / asC, 0)],
      ['Sacs de prémix par an', fr(aAn / asC, 0) + ' (' + fr(aAn / asC / sacT, 2) + ' t)'],
      ['Coût d’achat SOLEVO du sac / gain par sac', `${fr(cuC)} / ${fr(N.prixChair - cuC)} FCFA`],
      ['CA prémix SOLEVO par éleveur / an', fcE(aAn / asC * N.prixChair), 1],
      ['Gain SOLEVO par éleveur / an (marge brute)', fcE(aAn / asC * (N.prixChair - cuC)), 1],
      ['CA / marge brute prémix chair 2027', `${S.caChair27} / ${S.mbChair27} M FCFA` + ` <small class="eur">(${eurS(N.caChair27)} / ${eurS(N.mbChair27)})</small>`, 1],
      ['Éleveurs de chair du portefeuille 2027 / 2028 / 2029', `${S.chairMix27} / ${S.chairMix28} / ${S.chairMix29}`, 1],
    ];
    $('#chairTbl tbody').innerHTML = chair.map(([l, v, sub]) => `<tr class="${sub ? 'sub' : ''}"><td>${l}</td><td>${v}</td></tr>`).join('');
    // FEED ponte
    const pT = N.pondFerme, g = N.pondJour; // g en kg/jour
    const aJour = pT * g, aAnP = aJour * 365 / 1000;
    const ponte = [
      ['Cheptel (pondeuses)', fr(pT)],
      ['Consommation par poule', fr(g * 1000) + ' g/jour'],
      ['Aliment par jour', fr(aJour) + ' kg'],
      ['Aliment par mois (30 j)', fr(aJour * 30 / 1000, 1) + ' t'],
      ['Aliment par an', fr(aAnP, 1) + ' t'],
      ['Maïs par an (' + fr(N.txMais * 100) + ' %)', fr(aAnP * N.txMais, 1) + ' t'],
      ['Sacs de prémix par mois / par an', `${fr(aJour * 30 / 1000 / asP, 0)} / ${fr(aAnP / asP, 0)}`],
      ['Coût d’achat SOLEVO du sac / gain par sac', `${fr(cuP)} / ${fr(N.prixPonte - cuP)} FCFA`],
      ['CA prémix SOLEVO par éleveur / an', fcE(aAnP / asP * N.prixPonte), 1],
      ['Gain SOLEVO par éleveur / an (marge brute)', fcE(aAnP / asP * (N.prixPonte - cuP)), 1],
      ['CA / marge brute prémix pondeuse 2027', `${S.caPonte27} / ${S.mbPonte27} M FCFA` + ` <small class="eur">(${eurS(N.caPonte27)} / ${eurS(N.mbPonte27)})</small>`, 1],
      ['Éleveurs de pondeuses du portefeuille 2027 / 2028 / 2029', `${S.ponteMix27} / ${S.ponteMix28} / ${S.ponteMix29}`, 1],
    ];
    $('#ponteTbl tbody').innerHTML = ponte.map(([l, v, sub]) => `<tr class="${sub ? 'sub' : ''}"><td>${l}</td><td>${v}</td></tr>`).join('');
    // FEED porc
    const nP = N.porcsFerme, aPorcAn = nP * N.kgPorc / 1000;
    const porc = [
      ['Porcs produits par an', fr(nP)],
      ['Aliment par porc produit', fr(N.kgPorc) + ' kg'],
      ['Aliment par an', fr(aPorcAn, 1) + ' t'],
      ['Maïs par an (' + fr(N.txMais * 100) + ' %)', fr(aPorcAn * N.txMais, 1) + ' t'],
      ['Sacs de prémix par an', fr(aPorcAn / asK, 0)],
      ['Coût d’achat SOLEVO du sac / gain par sac', `${fr(cuK)} / ${fr(N.prixPorc - cuK)} FCFA`],
      ['CA prémix SOLEVO par éleveur / an', fcE(aPorcAn / asK * N.prixPorc), 1],
      ['Gain SOLEVO par éleveur / an (marge brute)', fcE(aPorcAn / asK * (N.prixPorc - cuK)), 1],
      ['CA / marge brute prémix porcin 2027', `${S.caPorc27} / ${S.mbPorc27} M FCFA` + ` <small class="eur">(${eurS(N.caPorc27)} / ${eurS(N.mbPorc27)})</small>`, 1],
      ['Éleveurs de porcs du portefeuille 2027 / 2028 / 2029', `${S.porcMix27} / ${S.porcMix28} / ${S.porcMix29}`, 1],
    ];
    $('#porcTbl tbody').innerHTML = porc.map(([l, v, sub]) => `<tr class="${sub ? 'sub' : ''}"><td>${l}</td><td>${v}</td></tr>`).join('');
    const mixKo = N.partPonteV27 < -1e-9 || N.partPonteV28 < -1e-9 || N.partPonteV29 < -1e-9;
    $('#feedK').innerHTML = [
      ['Mix des ventes de prémix : chair / pondeuse / porcin', mixKo ? '<span class="warnmix">Chair + porcin > 100 %</span>' : `${S.partChairV27} / ${S.partPonteV27} / ${S.partPorc27}`],
      ['Aliment par sac (moyenne pondérée des incorporations)', S.alimSacMoy + ' t'],
      ['Prix moyen pondéré du sac 2027 / 2028 / 2029', `${S.prixSac27} / ${S.prixSac28} / ${S.prixSac29} FCFA`],
      ['CA prémix porcin 2027 / marge brute', `${S.caPorc27} / ${S.mbPorc27} M` + `<small class="eur">${eurS(N.caPorc27)} / ${eurS(N.mbPorc27)}</small>`],
      ['Marge FEED moyenne pondérée (' + S.baseFeed + ')', S.margeFeedP + ' (= ' + S.marqueFeed + ' du prix)'],
      ['CA FEED 2027 = chair + pondeuse + porcin', `${S.caFeed27} M = ${S.caChair27} + ${S.caPonte27} + ${S.caPorc27}` + `<small class="eur">${eurS(N.caFeed27)}</small>`],
      ['Marge brute FEED 2027 = chair + pondeuse + porcin', `${S.mbFeed27} M = ${S.mbChair27} + ${S.mbPonte27} + ${S.mbPorc27}` + `<small class="eur">${eurS(N.mbFeed27)}</small>`],
      ['Contrôles gammes (CA, marge, aliment)', [27, 28, 29].every((y) => N['ctrlGamme' + y] === 'OK' && N['ctrlAlim' + y] === 'OK') ? '✓ OK sur 3 ans' : '<span class="warnmix">Écart à vérifier</span>'],
    ].map(([l, v]) => `<div><b>${v}</b>${l}</div>`).join('');
    // valeurs des champs FEED
    $$('.fin input[data-hrow]').forEach((i) => {
      if (document.activeElement === i) return;
      const v = state.hyp['Hypotheses!B' + i.dataset.hrow];
      i.value = +(i.dataset.scale ? v / parseFloat(i.dataset.scale) : v).toPrecision(8);
    });
    bindSimInputs($('#secSim'));
  }

  /* ---------- part de marché actuelle et réseau de dépôts ---------- */
  function renderNet() {
    const { N, S } = state.V; const D = SKV.DEPOTS; const n = state.net;
    $('#depTbl tbody').innerHTML = D.rows.map((r) => `<tr class="${r.statut === 'Actif' ? '' : 'muted'}"><td>${r.nom}</td><td>${r.statut}${r.ouverture ? ' depuis le ' + r.ouverture : ''}</td><td>${r.t ? fr(r.t, 1) : '—'}</td><td>${r.an ? fr(r.an, 0) : '—'}</td><td>${r.t ? fr(r.t / D.ytd * 100, 0) + ' %' : '—'}</td></tr>`).join('')
      + `<tr class="sub"><td>Total réseau (3 dépôts actifs)</td><td></td><td>${fr(D.ytd, 1)}</td><td>${fr(D.annual, 0)}</td><td>100 %</td></tr>`;
    $('#depK').innerHTML = [
      [S.pdmAct, `Part de marché prémix actuelle (${S.depAnnual} t/an ÷ ${S.mPremix27} t)`],
      [S.pdmActYtd + ' à ' + S.pdmRun, 'Fourchette : cumul brut au 12/11 → rythme août-octobre'],
      [S.pdmAlimAct, `Part de l’aliment fini couvert (${S.depAlimAn} t ÷ ${S.mAliment27} t)`],
      [S.ratioMarche + ' t/t', `Ratio aliment/prémix du marché (inclusion moyenne ${S.inclMarche}, SOLEVO 2 %)`],
    ].map(([v, l]) => `<div><b>${v}</b>${l}</div>`).join('');
    const yrs = ['27', '28', '29'];
    const rows = [
      ['Ventes de prémix hors programme (réseau de dépôts, t)', (y) => S['ventesExist' + y]],
      ['Prémix du programme SISSÊ~KABA (t)', (y) => S['premix' + y]],
      ['Ventes totales de prémix SOLEVO (t)', (y) => S['premixTot' + y]],
      ['Part de marché totale — prémix', (y) => S['pdmPTot' + y]],
      ['Part de marché totale — aliment fini couvert', (y) => S['pdmATot' + y]],
    ];
    $('#netTbl tbody').innerHTML = rows.map(([l, f], i) => `<tr class="${i >= 2 ? 'sub' : ''}"><td>${l}</td>${yrs.map((y) => `<td>${f(y)}</td>`).join('')}</tr>`).join('');
    for (const k of ['actuel', 'nouveaux', 'vol', 'g', 'r27', 'r28', 'r29']) { const el = $('#net-' + k); if (el && document.activeElement !== el) el.value = n[k]; }
    $('#net-auto').checked = n.auto;
    $$('[data-netp]').forEach((b) => b.classList.toggle('on', Math.abs(+b.dataset.netp - n.vol) < 0.05));
  }
  function bindNet() {
    for (const k of ['actuel', 'nouveaux', 'vol', 'g', 'r27', 'r28', 'r29']) {
      $('#net-' + k).addEventListener('change', (e) => { const v = parseFloat(String(e.target.value).replace(',', '.')); if (isFinite(v) && v >= 0) { state.net[k] = v; markCustom(); recalc(); } });
    }
    $('#net-auto').addEventListener('change', (e) => { state.net.auto = e.target.checked; recalc(); });
    $$('[data-netp]').forEach((b) => b.addEventListener('click', () => { state.net.vol = +b.dataset.netp; markCustom(); recalc(); }));
  }

  /* ---------- objectifs techniques ---------- */
  function renderObj() {
    const { S } = state.V;
    const R = state.ref ? state.ref.S : null;
    const rows = [
      ['SEED', null],
      ['Hectares à mobiliser (minimum terrain)', 'haTerrain'], ['Hectares achetant le panier intrants', 'haPanier'],
      ['Maïs à livrer au programme (t)', 'mais'], ['Production brute de maïs sur ces surfaces (t)', 'prodBrute'],
      ['Producteurs de ' + S.surf + ' ha', 'prod'],
      ['FEED', null],
      ['Prémix vendu (t)', 'premix'], ['Aliment fini produit (t)', 'aliment'],
      ['Mix des ventes de prémix : chair / pondeuse / porcin', 'mix'],
      ['Aliment pour la chair (t)', 'alimChair'], ['Cheptel chair à nourrir (places)', 'placesMix'],
      ['Éleveurs de chair (' + S.placesFerme + ' places par élevage)', 'chairMix'],
      ['Aliment pour les pondeuses (t)', 'alimPonte'], ['Pondeuses à nourrir', 'pondMix'],
      ['Éleveurs de pondeuses (' + S.pondFerme + ' têtes par élevage)', 'ponteMix'],
      ['Porcs nourris par an', 'porcs'], ['Éleveurs de porcs (' + S.porcsFerme + ' porcs par an)', 'porcMix'],
      ['Total des éleveurs (chair, pondeuses, porcs)', 'eleveursMix'],
      ['Repère 100 % chair : éleveurs / 100 % ponte : éleveurs', 'alt'],
      ['PART DE MARCHÉ CÔTE D’IVOIRE', null],
      ['Marché national du prémix (t)', 'mPremix'], ['Part de marché du programme — prémix', 'pdmP'],
      ['Marché national de l’aliment fini (t)', 'mAliment'], ['Part de marché du programme — aliment fini', 'pdmA'],
      ['Ventes actuelles de prémix hors programme (t)', 'ventesExist'], ['Ventes totales de prémix SOLEVO (t)', 'premixTot'],
      ['Part de marché totale SOLEVO — prémix', 'pdmPTot'], ['Part de marché totale — aliment fini associé', 'pdmATot'],
    ];
    const cell = (k, y) => k === 'mix' ? `${S['partChair' + y]} / ${S['partPonte' + y]} / ${S['partPorc' + y]}` : k === 'alt' ? `${S['chair' + y]} / ${S['ponte' + y]}` : S[k + y];
    $('#objTbl tbody').innerHTML = rows.map(([l, k]) => k === null
      ? `<tr class="grp"><td colspan="4">${l}</td></tr>`
      : `<tr class="${/^pdm|eleveursMix/.test(k) ? 'sub' : ''}"><td>${l}</td>${['27', '28', '29'].map((y) => `<td>${cell(k, y)}</td>`).join('')}</tr>`).join('');
    $('#objNote').textContent = `Portefeuille mixte : le mix des ventes de prémix (leviers « Part des ventes de prémix ») répartit les sacs entre chair, pondeuse et porcin ; chaque gamme a son taux d’incorporation ; les éleveurs s’additionnent. Les repères 100 % chair ou 100 % ponte restent des alternatives.` + (state.V.N.ventesExist27 > 0 ? '' : ' Ventes actuelles de prémix hors programme non renseignées : la part totale égale la part du programme.');
  }


  /* ---------- présentations plein écran : SELAB (12), CODIR (13), IT SOLEVO (15) — même source que les PowerPoint ---------- */
  const PZ = { i: 0, timer: null, f: 1, deck: 'selab', notes: false, calc: { type: 'chair', n: null, ha: null } };
  const visSlides = (d) => d.slides.filter((x) => !x.temo || (state.V && state.V.S['temo' + x.temo + 'Ok']));
  const k3 = (v, l, n) => `<div class="pz-k"><b>${v}</b><span>${l}</span>${n ? `<i>${n}</i>` : ''}</div>`;
  const STRONG = /^(Total|CA du programme|Résultat|Producteurs|Éleveurs|Total des éleveurs)/;
  /* ---- QR code d’inscription ---- */
  state.qrLink = (() => { try { const v = localStorage.getItem('sk_qr'); return v && v !== SKD.QR_WA_OLD && !/6rBRUQBgYjDduPFEFBSYq8/.test(v) ? v : SKD.QR_DEFAULT; } catch (e) { return SKD.QR_DEFAULT; } })();
  function qrCanvas(link, px) {
    const q = qrcode(0, 'M'); q.addData(link); q.make();
    const n = q.getModuleCount(), m = 4, s = Math.max(4, Math.floor((px || 600) / (n + 2 * m)));
    const c = document.createElement('canvas'); c.width = c.height = (n + 2 * m) * s;
    const g = c.getContext('2d'); g.fillStyle = '#fff'; g.fillRect(0, 0, c.width, c.height); g.fillStyle = '#000';
    for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) g.fillRect((k + m) * s, (r + m) * s, s, s);
    return c;
  }
  function qrRefresh() {
    try { const c = qrCanvas(state.qrLink, 700); imgs.qr = c.toDataURL('image/png'); } catch (e) { imgs.qr = null; }
    try { const q = qrcode(0, 'M'); q.addData(state.qrLink); q.make(); const n = q.getModuleCount(); imgs.qrMatrix = Array.from({ length: n }, (_, r) => Array.from({ length: n }, (_, k) => (q.isDark(r, k) ? '1' : '0')).join('')); } catch (e) { imgs.qrMatrix = null; }
  }
  async function qrPngBytes() {
    const c = qrCanvas(state.qrLink, 730);
    const blob = await new Promise((res) => c.toBlob(res, 'image/png'));
    return new Uint8Array(await blob.arrayBuffer());
  }
  /* retire les diapos de témoignage non renseignées (forme TEMO_SLIDE_xxx) */
  async function dropTemoSlides(zip) {
    const S = state.V.S;
    for (const n of Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
      const x = await zip.file(n).async('string');
      const m = x.match(/name="TEMO_SLIDE_(\w+)"/);
      if (!m) continue;
      if (S['temo' + m[1] + 'Ok']) {
        let y = x.replace(/<p:sp>(?:(?!<p:sp>)[\s\S])*?name="TEMO_SLIDE_\w+"[\s\S]*?<\/p:sp>/, '');
        const ph = temoPhoto(m[1]);
        const pm = y.match(/<p:pic>(?:(?!<p:pic>)[\s\S])*?descr="TEMO_PHOTO"[\s\S]*?<\/p:pic>/);
        if (pm && !ph) y = y.replace(pm[0], '');
        else if (pm && ph) {
          const rid = (pm[0].match(/r:embed="(rId\d+)"/) || [])[1];
          const relN2 = n.replace('slides/', 'slides/_rels/') + '.rels';
          const rels2 = await zip.file(relN2).async('string');
          const t = rels2.match(new RegExp('Id="' + rid + '"[^>]*Target="([^"]+)"')) || rels2.match(new RegExp('Target="([^"]+)"[^>]*Id="' + rid + '"'));
          if (t) zip.file('ppt/' + t[1].replace('../', ''), await dataUrlBytes(ph));
        }
        zip.file(n, y); continue;
      }
      const base = n.split('/').pop();
      const pr = await zip.file('ppt/_rels/presentation.xml.rels').async('string');
      const rid = (pr.match(new RegExp('Id="(rId\\d+)"[^>]*Target="slides/' + base + '"')) || pr.match(new RegExp('Target="slides/' + base + '"[^>]*Id="(rId\\d+)"')) || [])[1];
      if (rid) {
        zip.file('ppt/_rels/presentation.xml.rels', pr.replace(new RegExp('<Relationship[^>]*Id="' + rid + '"[^>]*/>'), ''));
        const p = await zip.file('ppt/presentation.xml').async('string');
        zip.file('ppt/presentation.xml', p.replace(new RegExp('<p:sldId [^>]*r:id="' + rid + '"[^>]*/>'), ''));
      }
      const relN = 'ppt/slides/_rels/' + base + '.rels';
      const rels = zip.file(relN) ? await zip.file(relN).async('string') : '';
      const notes = (rels.match(/Target="\.\.\/notesSlides\/(notesSlide\d+\.xml)"/) || [])[1];
      let ct = await zip.file('[Content_Types].xml').async('string');
      ct = ct.replace(new RegExp('<Override PartName="/ppt/slides/' + base + '"[^>]*/>'), '');
      if (notes) { ct = ct.replace(new RegExp('<Override PartName="/ppt/notesSlides/' + notes + '"[^>]*/>'), ''); zip.remove('ppt/notesSlides/' + notes); zip.remove('ppt/notesSlides/_rels/' + notes + '.rels'); }
      zip.file('[Content_Types].xml', ct); zip.remove(n); zip.remove(relN);
    }
  }
  /* remplace l’image QR (descr="QR_INSCRIPTION") dans un PowerPoint généré */
  async function pptxWithQr(bytes) {
    const zip = await JSZip.loadAsync(bytes);
    await dropTemoSlides(zip);
    const png = await qrPngBytes();
    for (const n of Object.keys(zip.files).filter((f) => /^ppt\/slides\/slide\d+\.xml$/.test(f))) {
      const x = await zip.file(n).async('string');
      const m = x.match(/descr="QR_INSCRIPTION"[\s\S]*?r:embed="(rId\d+)"/);
      if (!m) continue;
      const relN = n.replace('slides/', 'slides/_rels/') + '.rels';
      const rels = await zip.file(relN).async('string');
      const t = rels.match(new RegExp('Id="' + m[1] + '"[^>]*Target="([^"]+)"')) || rels.match(new RegExp('Target="([^"]+)"[^>]*Id="' + m[1] + '"'));
      if (t) zip.file('ppt/' + t[1].replace('../', ''), png);
    }
    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  }
  /* ---- rendu des diapos ---- */
  function pzBlock(b, F) {
    if (b.k === 'kpis') return `<div class="pz-grid">${b.items.map((it) => k3(F(it.v), F(it.l))).join('')}</div>`;
    if (b.k === 'cols' || b.k === 'cards') return `<div class="pz-cols">${b.items.map((c) => `<div class="pz-col"><h3>${F(c.h)}</h3>${c.l ? `<ul>${c.l.map((x) => `<li>${F(x)}</li>`).join('')}</ul>` : `<p>${F(c.t)}</p>`}</div>`).join('')}</div>`;
    if (b.k === 'steps') return `<ol class="pz-steps">${b.items.map((it, i) => `<li><em>${i + 1}</em><b>${F(it.h)}</b><span>${F(it.t)}</span></li>`).join('')}</ol>`;
    if (b.k === 'table') return `<table class="pz-tbl"><thead><tr>${b.head.map((h) => `<th>${F(h)}</th>`).join('')}</tr></thead><tbody>${b.rows.map((r) => `<tr class="${STRONG.test(r[0]) ? 'st' : ''}">${r.map((c) => `<td>${F(c)}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    if (b.k === 'quote') return `<div class="pz-quote"><blockquote><span class="qm">“</span><p>${F(b.q)}</p><footer><b>${F(b.n)}</b><span>${F(b.p)}</span></footer></blockquote><div class="pz-qfig">${b.who && temoPhoto(b.who) ? `<img src="${temoPhoto(b.who)}" alt="">` : ''}<b>${F(b.v)}</b><span>${F(b.l)}</span></div></div>`;
    if (b.k === 'flow') return `<div class="pz-flow">${SKG.flowSvg(SKD.FLOW, state.V.S, true)}</div>`;
    if (b.k === 'qr') return `<div class="pz-qr"><figure>${imgs.qr ? `<img src="${imgs.qr}" alt="QR code d’inscription">` : ''}<figcaption><b>${F(b.h)}</b><span>${F(b.t)}</span></figcaption></figure>
      <div class="pz-qrl">${b.lines.map((l) => k3(F(l.v), F(l.l))).join('')}<p class="pz-sign">${F(b.sign)}</p></div></div>`;
    return '';
  }
  function pzCover(s, d, F) {
    return `<div class="pz-cover pz-cv-${s.theme}"><div class="cv-deco"><i></i><i></i><i></i></div>
      <div class="cv-main">
        <div class="cv-logos"><img src="assets/solevo_big.png" alt="SOLEVO"><span></span><img src="assets/logo_sisse.png" alt="SISSÊ~KABA"></div>
        <div class="cv-tag">${F(s.tag)}</div>
        <h1>${F(s.title)}</h1><p class="cv-sub">${F(s.sub)}</p><div class="cv-bar"></div>
        <dl class="cv-meta"><div><dt>Public</dt><dd>${F(s.aud)}</dd></div><div><dt>Date</dt><dd>${F('{{dateLong}}')}</dd></div>
          <div><dt>Scénario</dt><dd>${F('{{scenario}}')}</dd></div><div><dt>Présenté par</dt><dd>${esc(s.pres || SKD.PRES)}<br><small>${esc(s.presSub || SKD.PRES_R).replace(/\n/g, '<br>')}</small></dd></div></dl>
      </div>
      <div class="cv-figs">${s.figs.map((f) => `<div><b>${F(f.v)}</b><span>${F(f.l)}</span></div>`).join('')}</div>
      <div class="cv-foot"><span>SOLEVO Côte d’Ivoire</span><span>FEED &amp; SEED</span><span>${F(s.band)}</span></div></div>`;
  }

  /* ---- calculateur du visiteur (diapo 3 des présentations du stand) ---- */
  function pzCalcHtml(kind) {
    const N = state.V.N, c = PZ.calc;
    if (kind === 'eleveur') {
      const def = { chair: N.placesFerme, pondeuse: N.pondFerme, porc: N.porcsFerme }[c.type];
      return `<div class="pz-calc"><b>Votre élevage :</b>
        <select id="pcType"><option value="chair">Poulets de chair (places)</option><option value="pondeuse">Pondeuses (têtes)</option><option value="porc">Porcs produits par an</option></select>
        <input id="pcN" type="number" inputmode="numeric" min="1" step="100" value="${c.n || def}"><div class="pz-calc-out" id="pcOut"></div>${prosForm()}</div>`;
    }
    return `<div class="pz-calc"><b>Votre surface en maïs :</b><input id="pcHa" type="number" inputmode="decimal" min="0.5" step="0.5" value="${c.ha || N.surf}"> ha<div class="pz-calc-out" id="pcOut"></div>${prosForm()}</div>`;
  }
  function pzCalcBind(kind) {
    const N = state.V.N, c = PZ.calc;
    const out = () => {
      let cells;
      if (kind === 'eleveur') {
        c.type = $('#pcType').value; c.n = parseFloat($('#pcN').value) || 0;
        const a = c.type === 'chair' ? c.n * N.kgPoulet * N.cycles / 1000 : c.type === 'pondeuse' ? c.n * N.pondJour * 365 / 1000 : c.n * N.kgPorc / 1000;
        const incl = { chair: N.inclChair, pondeuse: N.inclPonte, porc: N.inclPorc }[c.type];
        const sacs = a / (N.sacKg / 1000 / incl), mais = a * N.txMais, eco = mais * 1000 * (N.P - N.prixAchAp);
        c.res = { type: { chair: 'Poulets de chair', pondeuse: 'Pondeuses', porc: 'Porcs' }[c.type], q: c.n, u: { chair: 'places', pondeuse: 'têtes', porc: 'porcs/an' }[c.type], aliment: a, sacs, mais, eco };
        cells = [[fr(a, 1) + ' t', 'd’aliment par an'], [fr(sacs, 0), 'sacs de prémix par an (' + fr(sacs / 12, 1) + ' par mois)'], [fr(mais, 1) + ' t', 'de maïs par an'], [fr(eco / 1e6, 2) + ' M', 'FCFA d’économies attendues par an']];
      } else {
        c.ha = parseFloat($('#pcHa').value) || 0;
        const t = c.ha * N.tHa, av = t * 1000 * N.prixProdAv, ap = t * 1000 * N.prixProdAp;
        c.res = { type: 'Maïs', q: c.ha, u: 'ha', mais: t, av, ap, gain: ap - av, panier: c.ha * N.panier27 };
        cells = [[fr(t, 1) + ' t', 'de maïs livré au programme'], [fr(av / 1e6, 2) + ' → ' + fr(ap / 1e6, 2) + ' M', 'FCFA de recettes par an'], ['+' + fr((ap - av) / 1e6, 2) + ' M', 'FCFA en plus par an'], [fr(c.ha * N.panier27 / 1e6, 2) + ' M', 'FCFA de panier d’intrants']];
      }
      $('#pcOut').innerHTML = cells.map(([v, l]) => `<div><b>${v}</b><span>${l}</span></div>`).join('');
    };
    if (kind === 'eleveur') {
      $('#pcType').value = c.type;
      $('#pcType').addEventListener('change', () => { c.n = null; $('#pcN').value = { chair: N.placesFerme, pondeuse: N.pondFerme, porc: N.porcsFerme }[$('#pcType').value]; out(); });
      $('#pcN').addEventListener('input', out);
    } else $('#pcHa').addEventListener('input', out);
    out();
    $('#prSave').addEventListener('click', () => prosSave(kind));
  }
  /* ======================================================================
     STAND SOLEVO : borne d’inscription, tables d’entretien, suivi et messages
     ====================================================================== */
  const DEPOTS_S = ['Abidjan', 'Yamoussoukro', 'Agnibilékrou', 'Autre / à préciser'];
  const TM = SKD.TEAM;
  const ATES = ['À attribuer', TM.ouattara.nom, TM.kouadio.nom, TM.koffi.nom, TM.lehito.court, TM.agohi.court, 'Autre'];
  const ATE_BY_DEP = { 'Yamoussoukro': TM.kouadio.nom, 'Agnibilékrou': TM.ouattara.nom };
  const ATE_TEAM = { [TM.ouattara.nom]: TM.ouattara, [TM.kouadio.nom]: TM.kouadio, [TM.koffi.nom]: TM.koffi, [TM.lehito.court]: TM.lehito, [TM.agohi.court]: TM.agohi };
  const STATUTS = ['À rappeler', 'Rappelé', 'Visite prévue', 'Inscrit', 'Pas intéressé'];
  const ETATS = ['En attente', 'En entretien', 'Terminé'];
  const PROFILS = ['Éleveur', 'Producteur de maïs', 'Éleveur et producteur', 'Fabricant d’aliment', 'Autre'];
  const PRIOS = ['Maïs moins cher', 'Prémix SOLEVO', 'Semences et engrais', 'Vendre mon maïs', 'Conseil technique', 'Financement'];
  const CONTACTS = ['WhatsApp', 'SMS', 'Appel', 'E-mail'];
  const VEILLE = [['mais', 'Maïs', 'FCFA/kg'], ['soja', 'Soja (tourteau)', 'FCFA/kg'], ['son', 'Son de blé', 'FCFA/kg'], ['coq', 'Coquillage', 'FCFA/kg'], ['huile', 'Huile rouge', 'FCFA/litre'], ['pxChair', 'Prémix chair', 'FCFA/sac'], ['pxPonte', 'Prémix ponte', 'FCFA/sac'], ['plaq', 'Plaquette de 30 œufs (vente)', 'FCFA/plaquette'], ['poulet', 'Poulet de chair (vente)', 'FCFA/poulet']];
  const SACS = ['1', '20', '25', '50', '100', '120'];
  const nrm = (x) => String(x).toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]+/g, ' ').trim();
  const VISITES = ['Seul(e)', 'En groupe', 'Délégation de coopérative', 'Association'];
  const KAMS = ['Elvis LEHITO (KAM FEED)', 'Arnaud AGOHI (KAM SEED)', 'Les deux Key Account Managers'];
  const ACCUEIL = ['Eau', 'Café'];
  const isDeleg = (r) => /Délégation|Association/.test(r.visite || '');
  const nbP = (r) => Math.max(1, parseInt(r.nb, 10) || 1);
  const CAP_DEF = 4;
  const kamAgent = (k) => (k === KAMS[0] ? 'Elvis LEHITO, Key Account Manager FEED' : k === KAMS[1] ? 'Arnaud AGOHI, Key Account Manager SEED' : 'Elvis LEHITO et Arnaud AGOHI, Key Account Managers');
  const capOf = (t) => (t.cap === 0 || t.cap === '0' ? 0 : (parseInt(t.cap, 10) || (/^Salle/i.test(t.lieu || '') ? 0 : CAP_DEF)));
  const occOf = (n) => state.pros.filter((r) => String(r.table) === String(n) && r.etat === 'En entretien').reduce((a, r) => a + nbP(r), 0);
  const accLab = (r) => { const a = r.accueil || []; if (!a.length) return ''; const n = nbP(r); return a.map((x) => (n > 1 ? n + ' ' : '') + (x === 'Eau' ? (n > 1 ? 'bouteilles d’eau' : '1 bouteille d’eau') : (n > 1 ? 'cafés' : '1 café'))).join(' + '); };
  const SOLEVO_TEL = '+225 07 77 19 09 94', SOLEVO_TEL2 = '07 10 47 14 02', SOLEVO_MAIL = 'elvis.lehito@solevogroup.com';
  const CFG_DEFAULT = {
    v: 8, qrMode: 'nav', testMode: false, rep: {},
    tables: [{ n: 1, lieu: 'Table 1', agent: 'Ibrahim OUATTARA, agent technique élevage', pour: 'Éleveurs', cap: 4 }, { n: 2, lieu: 'Table 2', agent: 'Kouassi François KOUADIO, agent technique élevage', pour: 'Éleveurs' }, { n: 3, lieu: 'Table 3', agent: 'Aubin Ghislain KOFFI, agent technique semence', pour: 'Producteurs' },
      { n: 4, lieu: 'Table 4', agent: 'Agent technique (à nommer)', pour: 'Éleveurs' }, { n: 5, lieu: 'Table 5', agent: 'Agent technique (à nommer)', pour: 'Producteurs' }, { n: 6, lieu: 'Table 6', agent: 'Agent technique (à nommer)', pour: 'Tous' },
      { n: 7, lieu: 'Table KAM FEED', agent: 'Elvis LEHITO, Key Account Manager FEED', pour: 'Grands comptes FEED' }, { n: 8, lieu: 'Table KAM SEED', agent: 'Arnaud AGOHI, Key Account Manager SEED', pour: 'Grands comptes SEED' },
      { n: 9, lieu: 'Salle de conférence SOLEVO', agent: 'Elvis LEHITO et Arnaud AGOHI, Key Account Managers', pour: 'Grands comptes' }],
    kioskTel: '',
    inscription: '',
    autoProv: 'off', autoTable: true, autoMerci: true, autoReplies: true, rappelOn: true, rappelMin: 15,
    autoTransfert: true, notifKam: true, kamFeedTel: '07 10 47 14 02', kamSeedTel: '07 87 87 73 54',
    msgKam: 'SISSÊ~KABA • Visiteur transféré {lieu} : {nom} ({profil}, {localite}). Activité : {activite}. Motif : {motif}. Transféré par {de}. Tél. : {tel}.',
    msgTransfert: 'Bonjour {prenom}, suite à votre échange avec {de}, nous vous orientons vers {agent}, pour approfondir votre projet ({motif}). Merci de vous rendre {lieu} : vous êtes {rang} dans la file d’attente. Votre nom s’affichera à l’écran.',
    msgRappel: 'Bonjour {prenom}, merci de votre patience sur le stand SOLEVO Côte d’Ivoire. {agent} vous reçoit très bientôt {lieu}. Restez à proximité, votre nom s’affichera à l’écran.', bilanAuto: false, bilanHour: '19:00', bilanTo: 'elvis.lehito@solevogroup.com, arnaud.agohi@solevogroup.com, lehitognakoury@gmail.com', finalTo: 'elvis.lehito@solevogroup.com, arnaud.agohi@solevogroup.com, christophe.kouame@solevogroup.com, olivier.konan@solevogroup.com, jean-noel.kouakou@solevogroup.com, lehitognakoury@gmail.com', bilanLast: '',
    msgTable: 'Bonjour {prenom}, merci pour votre inscription sur le stand SOLEVO Côte d’Ivoire (SELAB SHOW). Rendez-vous {lieu} avec {agent}, pour un échange sur votre activité ({activite}). Vous êtes {rang} dans la file d’attente. En attendant, une bouteille d’eau et un café vous sont offerts à l’accueil SOLEVO. À tout de suite !',
    ficheUrl: '',
    msgMerci: 'Bonjour {prenom}, merci pour votre visite et votre échange avec {agent} sur le stand SOLEVO Côte d’Ivoire.\n\nSISSÊ~KABA relie les producteurs de maïs et les éleveurs : maïs mieux payé au producteur (+30 % visés), maïs moins cher pour l’éleveur (−15 % visés), prémix et intrants SOLEVO, appui des techniciens.\n\n👉 Pour vous inscrire au projet, répondez « OUI » à ce message{lien}.\n\nVos contacts SOLEVO :\n{contacts}{mail}',
  };
  state.pros = []; state.standCfg = JSON.parse(JSON.stringify(CFG_DEFAULT));
  function esc(t) { return String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/"/g, '&quot;'); }
  const dbOn = () => state.db && !state.prosLocal;
  function waNum(t) {
    let d = String(t || '').replace(/\D/g, '');
    if (d.startsWith('00')) d = d.slice(2);
    if (d.length === 10) d = '225' + d;
    return d;
  }
  const prenom = (r) => { const w = String(r.nom || '').trim().split(/\s+/).filter(Boolean); if (!w.length) return ''; if (w.length > 1 && w[0] === w[0].toUpperCase() && /[A-ZÀ-Ý]/.test(w[0])) return w.slice(1).join(' '); return w[0]; };
  const isElev = (r) => /leveur|Fabricant/.test(r.profil || r.public || '');
  const isProd = (r) => /Producteur|producteur/.test(r.profil || r.public || '');
  function activite(r) {
    const a = [];
    if (isElev(r)) a.push(['chair', 'pondeuse', 'porc'].filter((k) => r[k]).map((k) => fr(r[k]) + ' ' + { chair: 'poulets de chair', pondeuse: 'pondeuses', porc: 'porcs/an' }[k]).join(', ') || 'élevage');
    if (isProd(r)) a.push(r.surface ? fr(r.surface, 1) + ' ha de maïs' : 'production de maïs');
    return a.join(' et ') || 'activité';
  }
  function fillMsg(tpl, r, extra) {
    const c = state.standCfg; const t = (c.tables || []).find((x) => String(x.n) === String(r.table)) || {};
    const lien = c.inscription ? ' ou inscrivez-vous ici : ' + c.inscription : '';
    return String(tpl).replace(/\{prenom\}/g, prenom(r)).replace(/\{nom\}/g, r.nom || '').replace(/\{table\}/g, tLab(r.table)).replace(/\{lieu\}/g, tA(r.table)).replace(/\{agent\}/g, r.agent || t.agent || 'un technicien SOLEVO')
      .replace(/\{activite\}/g, activite(r)).replace(/\{contacts\}/g, contactsOf(r)).replace(/\{rang\}/g, rangLab(r)).replace(/\{profil\}/g, r.public || r.profil || '').replace(/\{localite\}/g, r.localite || '—').replace(/\{tel\}/g, r.tel || '').replace(/\{de\}/g, (r.transfert && r.transfert.deAgent) || 'notre technicien').replace(/\{motif\}/g, (r.transfert && r.transfert.motif) || 'grand compte').replace(/\{lien\}/g, lien).replace(/\{mail\}/g, (extra && extra.mail) || '');
  }
  /* contacts à donner au visiteur selon son profil : Key Account Manager + technicien de suivi */
  /* place dans la file d’attente de la table (arrivée ou transfert) */
  function rangOf(r) {
    const t0 = (x) => (x.transfert && x.transfert.le) || x.at || '';
    return state.pros.filter((x) => x.id !== r.id && String(x.table) === String(r.table) && x.etat === 'En attente' && t0(x) <= t0(r)).length + 1;
  }
  const rangLab = (r) => { const n = rangOf(r); return n === 1 ? '1er' : n + 'e'; };
  function contactsOf(r) {
    const L = [];
    if (isElev(r) || !isProd(r)) L.push(`• ${TM.lehito.court}, ${TM.lehito.role} : ${TM.lehito.tel}, ${TM.lehito.mail}`);
    if (isProd(r)) L.push(`• ${TM.agohi.court}, ${TM.agohi.role} : ${TM.agohi.tel}, ${TM.agohi.mail}`);
    const norm = (x) => String(x || '').toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').split(/[^a-z]+/).filter(Boolean).sort().join(' ');
    const find = (x) => { const n = norm(x); if (!n) return null; return Object.values(ATE_TEAM).find((t) => norm(t.nom) === n || n.includes(norm(t.nom))) || null; };
    const tAgent = (tOf(r.table) || {}).agent || '';
    const ate = find(r.ate) || Object.values(ATE_TEAM).find((t) => tAgent.includes(t.nom)) || (isProd(r) && !isElev(r) ? TM.koffi : find(ATE_BY_DEP[r.depot]));
    if (ate && ![TM.lehito, TM.agohi].includes(ate)) L.push(`• Votre technicien de suivi : ${ate.nom} (${ate.role}) : ${ate.tel}`);
    L.push(`• Inscriptions WhatsApp : ${SOLEVO_TEL}`);
    return L.join('\n');
  }
  const POURS = ['Éleveurs', 'Producteurs', 'Tous', 'Grands comptes FEED', 'Grands comptes SEED', 'Grands comptes'];
  const tOf = (n) => (state.standCfg.tables || []).find((x) => String(x.n) === String(n));
  const tLab = (n) => { const t = tOf(n); return t ? (t.lieu || 'Table ' + t.n) : (n ? 'Table ' + n : '—'); };
  const tA = (n) => { const l = tLab(n); return /^Table/i.test(l) ? 'à la ' + l.toUpperCase() : /^Salle/i.test(l) ? 'à la ' + l : 'à ' + l; };
  /* grand compte : gros cheptel, grande surface ou fabricant d’aliment */
  const bigFeed = (r) => (r.chair || 0) >= 20000 || (r.pondeuse || 0) >= 20000 || (r.porc || 0) >= 1000 || /Fabricant/.test(r.profil || '');
  const bigSeed = (r) => (r.surface || 0) >= 50 || !!(r.coop && (r.surface || 0) >= 20);
  const waLink = (tel, txt) => 'https://wa.me/' + waNum(tel) + '?text=' + encodeURIComponent(txt);
  const smsLink = (tel, txt) => 'sms:+' + waNum(tel) + '?body=' + encodeURIComponent(txt);
  /* ---- configuration partagée (tables, agents, messages) ---- */
  function cfgMigrate(c) {
    if ((c.v || 1) < 2) {
      const have = new Set((c.tables || []).map((t) => String(t.n)));
      c.tables = (c.tables || []).map((t) => Object.assign({ lieu: 'Table ' + t.n }, t)).concat(CFG_DEFAULT.tables.filter((t) => !have.has(String(t.n))).map((t) => Object.assign({}, t)));
      if (/TABLE \{table\}/.test(c.msgTable || '')) c.msgTable = CFG_DEFAULT.msgTable;
      c.v = 2;
    }
    if (c.v < 3) {
      const D = CFG_DEFAULT;
      (c.tables || []).forEach((t) => { const d = D.tables.find((x) => x.n === t.n); if (d && (/à nommer|^Ibrahim Ouattara$|^Kouadio Kouassi François$|^X$|^Y$/i.test(t.agent || '') || !t.agent)) t.agent = d.agent; });
      if (/Contact : LEHITO GNAKOURY Elvis/.test(c.msgMerci || '')) c.msgMerci = D.msgMerci;
      if (!c.bilanTo || c.bilanTo === 'elvis.lehito@solevogroup.com, lehitognakoury@gmail.com') c.bilanTo = D.bilanTo;
      if (!c.finalTo) c.finalTo = D.finalTo;
      c.v = 3;
    }
    if (c.v < 4) {
      if (c.msgTable && !/café/.test(c.msgTable)) c.msgTable = c.msgTable.replace(/\s*À tout de suite !\s*$/, '') + ' En attendant, une bouteille d’eau et un café vous sont offerts à l’accueil SOLEVO. À tout de suite !';
      c.v = 4;
    }
    if (c.v < 6) {
      if (c.msgTable && !/\{rang\}/.test(c.msgTable)) c.msgTable = /En attendant/.test(c.msgTable) ? c.msgTable.replace(/\s*En attendant/, ' Vous êtes {rang} dans la file d’attente. En attendant') : c.msgTable.replace(/\s*À tout de suite !\s*$/, '') + ' Vous êtes {rang} dans la file d’attente. À tout de suite !';
      if (c.msgTransfert && !/\{rang\}/.test(c.msgTransfert)) c.msgTransfert = c.msgTransfert.replace(/vous y serez reçu\(e\) dans quelques instants\./, 'vous êtes {rang} dans la file d’attente.');
    }
    if (c.v < 5) { if (/6rBRUQBgYjDduPFEFBSYq8/.test(c.ficheUrl || '')) c.ficheUrl = ''; if (!c.qrMode) c.qrMode = 'wa'; }
    if (c.v < 7) { if (!c.qrMode || c.qrMode === 'wa') c.qrMode = 'nav'; c.v = 7; }
    if (c.v < 8) { if (c.finalTo && !/jean-noel\.kouakou/.test(c.finalTo)) c.finalTo = c.finalTo.replace(/,?\s*lehitognakoury@gmail\.com/, '') + ', jean-noel.kouakou@solevogroup.com, lehitognakoury@gmail.com'; c.v = 8; }
    return c;
  }
  async function cfgSave() {
    try { localStorage.setItem('sk_standcfg', JSON.stringify(state.standCfg)); } catch (e) { /* */ }
    if (dbOn()) { try { await state.db.collection('config').doc('stand').set(state.standCfg); } catch (e) { console.error(e); } }
  }
  function cfgStart() {
    try { const l = JSON.parse(localStorage.getItem('sk_standcfg') || 'null'); if (l) state.standCfg = cfgMigrate(Object.assign({}, CFG_DEFAULT, l, { v: l.v || 1 })); } catch (e) { /* */ }
    if (state.db) { try { state.db.collection('config').doc('stand').onSnapshot((d) => { const v = d && d.exists !== false && d.data ? d.data() : null; if (v && v.tables) { state.standCfg = cfgMigrate(Object.assign({}, CFG_DEFAULT, v, { v: v.v || 1 })); renderPros(); } }, () => {}); } catch (e) { /* */ } }
  }
  /* ---- attribution d’une table ---- */
  function assignTable(r) {
    const T = state.standCfg.tables || [];
    const load = (t) => state.pros.filter((x) => String(x.table) === String(t.n) && x.etat !== 'Terminé').reduce((a, x) => a + nbP(x), 0) / (capOf(t) || 12);
    const pick = (cand) => cand.slice().sort((a, b) => load(a) - load(b) || a.n - b.n)[0];
    if (isDeleg(r) || nbP(r) > CAP_DEF) {
      const salle = T.find((t) => /^Salle/i.test(t.lieu || '')) || T.find((t) => t.pour === 'Grands comptes');
      if (salle) {
        r.table = salle.n;
        const k = r.kam || (isProd(r) && !isElev(r) ? KAMS[1] : isElev(r) && !isProd(r) ? KAMS[0] : KAMS[2]);
        r.kam = k; r.agent = kamAgent(k);
        return;
      }
    }
    const bF = bigFeed(r), bS = bigSeed(r);
    let want = [];
    if ((bF && bS) || (bF && isProd(r)) || (bS && isElev(r))) want = ['Grands comptes', 'Grands comptes FEED', 'Grands comptes SEED'];
    else if (bF) want = ['Grands comptes FEED', 'Grands comptes'];
    else if (bS) want = ['Grands comptes SEED', 'Grands comptes'];
    let best = null;
    for (const w of want) { const c = T.filter((t) => t.pour === w); if (c.length) { best = pick(c); break; } }
    if (!best) {
      const std = T.filter((t) => !/^Grands/.test(t.pour || ''));
      const ww = isProd(r) && !isElev(r) ? 'Producteurs' : isElev(r) && !isProd(r) ? 'Éleveurs' : null;
      let cand = std.filter((t) => !ww || t.pour === ww || t.pour === 'Tous'); if (!cand.length) cand = std.length ? std : T;
      best = pick(cand);
    }
    if (r.tableVoulue) { const tv = T.find((t) => (t.lieu || 'Table ' + t.n).toLowerCase() === String(r.tableVoulue).toLowerCase()); if (tv && !/^Salle/i.test(tv.lieu || '')) best = tv; }
    if (best) { r.table = best.n; r.agent = best.agent; }
  }
  /* ---- enregistrement ---- */
  function newRec(src) {
    const now = new Date();
    return { id: 'p' + now.getTime().toString(36) + Math.random().toString(36).slice(2, 6), at: now.toISOString(), date: today().fr + ' ' + String(now.getHours()).padStart(2, '0') + ':' + String(now.getMinutes()).padStart(2, '0'),
      source: src, profil: '', public: '', nom: '', tel: '', email: '', localite: '', depot: '', chair: 0, pondeuse: 0, porc: 0, fabrique: '', maisMois: 0, fournisseur: '', surface: 0, coop: '', intrants: '',
      prios: [], contact: 'WhatsApp', consent: false, table: '', agent: '', etat: 'En attente', debut: '', fin: '', interet: '', inscription: '', action: '', ate: 'À attribuer', statut: 'À rappeler', note: '',
      test: !!state.standCfg.testMode, msgTable: '', msgMerci: '', mailMerci: '', visite: 'Seul(e)', nb: 1, org: '', kam: '', accueil: [], servi: '', scenario: state.V.S.scenario };
  }
  function finalize(r) {
    r.public = isElev(r) && isProd(r) ? 'Éleveur et producteur' : isProd(r) ? 'Producteur' : isElev(r) ? 'Éleveur' : (r.profil || 'Autre');
    if (!r.ate || r.ate === 'À attribuer') r.ate = isProd(r) && !isElev(r) ? TM.koffi.nom : (ATE_BY_DEP[r.depot] || 'À attribuer');
    const N = state.V.N;
    const al = (r.chair || 0) * N.kgPoulet * N.cycles / 1000 + (r.pondeuse || 0) * N.pondJour * 365 / 1000 + (r.porc || 0) * N.kgPorc / 1000;
    if (al) { r.aliment = al; r.mais = al * N.txMais; r.sacs = (r.chair || 0) * N.kgPoulet * N.cycles / 1000 / (N.sacKg / 1000 / N.inclChair) + (r.pondeuse || 0) * N.pondJour * 365 / 1000 / (N.sacKg / 1000 / N.inclPonte) + (r.porc || 0) * N.kgPorc / 1000 / (N.sacKg / 1000 / N.inclPorc); r.eco = r.mais * 1000 * (N.P - N.prixAchAp); }
    if (r.surface) { const t = r.surface * N.tHa; r.maisP = t; r.gain = t * 1000 * (N.prixProdAp - N.prixProdAv); r.panier = r.surface * N.panier27; }
    return r;
  }
  async function prosPut(r) {
    finalize(r);
    if (dbOn()) await state.db.collection('prospects').doc(r.id).set(JSON.parse(JSON.stringify(r)));
    else { const i = state.pros.findIndex((x) => x.id === r.id); if (i >= 0) state.pros[i] = r; else state.pros.unshift(r); prosLocal(); renderPros(); }
  }
  function prosLocal() { try { localStorage.setItem('sk_pros', JSON.stringify(state.pros)); } catch (e) { /* */ } }
  async function prosUpdate(id, patch) {
    const r = state.pros.find((x) => x.id === id); if (r) Object.assign(r, patch);
    if (dbOn()) { try { await state.db.collection('prospects').doc(id).update(patch); return; } catch (e) { console.error(e); } }
    prosLocal(); renderPros();
  }
  async function prosDelete(id) {
    if (!confirm('Supprimer ce visiteur de la liste ?')) return;
    if (dbOn()) { try { await state.db.collection('prospects').doc(id).delete(); return; } catch (e) { console.error(e); } }
    state.pros = state.pros.filter((x) => x.id !== id); prosLocal(); renderPros();
  }
  function startPros() {
    cfgStart();
    if (state.db) {
      try { state.db.collection('prospects').orderBy('at', 'desc').limit(2000).onSnapshot((snap) => { state.pros = snap.docs.map((d) => Object.assign({ id: d.id }, d.data())); renderPros(); renderAgents(); renderAppel(); }, (e) => { console.error(e); prosFallback(); }); return; } catch (e) { console.error(e); }
    }
    prosFallback();
  }
  function prosFallback() { state.prosLocal = true; try { state.pros = JSON.parse(localStorage.getItem('sk_pros') || '[]'); } catch (e) { state.pros = []; } renderPros(); }
  /* ---- formulaire (borne et éditeur) ---- */
  function visForm(r, editor) {
    const chk = (name, v, arr) => `<label class="chip"><input type="checkbox" name="${name}" value="${esc(v)}" ${arr && arr.includes(v) ? 'checked' : ''}><span>${v}</span></label>`;
    const rad = (name, v, cur) => `<label class="chip"><input type="radio" name="${name}" value="${esc(v)}" ${cur === v ? 'checked' : ''}><span>${v}</span></label>`;
    return `<form class="visf" autocomplete="off">
      <fieldset><legend>Vous êtes</legend><div class="chips">${PROFILS.map((p) => rad('profil', p, r.profil)).join('')}</div></fieldset>
      <div class="vg"><label>Nom et prénom *<input name="nom" value="${esc(r.nom)}" required></label><label>Téléphone WhatsApp *<input name="tel" type="tel" inputmode="tel" value="${esc(r.tel)}" required placeholder="07 00 00 00 00"></label>
        <label>Localité *<input name="localite" value="${esc(r.localite)}" required></label><label>E-mail (pour recevoir la présentation)<input name="email" type="email" inputmode="email" value="${esc(r.email)}"></label></div>
      <fieldset><legend>Votre visite</legend><div class="chips">${VISITES.map((v) => rad('visite', v, r.visite || 'Seul(e)')).join('')}</div>
        <div class="vg fx-gr"><label>Nombre de personnes<input name="nb" type="number" inputmode="numeric" min="1" max="60" value="${r.nb || 1}"></label><label class="fx-dl">Coopérative ou association (nom)<input name="org" value="${esc(r.org)}"></label></div>
        <div class="chips fx-dl"><b>Entretien souhaité en salle de conférence avec :</b>${KAMS.map((v) => rad('kam', v, r.kam)).join('')}</div>
        <p class="note fx-gr">Chaque table reçoit 4 personnes au plus. Les délégations de coopératives et les associations sont reçues en salle de conférence par les Key Account Managers.</p></fieldset>
      <fieldset class="fx-el"><legend>Votre élevage</legend><div class="vg"><label>Poulets de chair (places)<input name="chair" type="number" inputmode="numeric" min="0" value="${r.chair || ''}"></label><label>Pondeuses (têtes)<input name="pondeuse" type="number" inputmode="numeric" min="0" value="${r.pondeuse || ''}"></label>
        <label>Porcs produits par an<input name="porc" type="number" inputmode="numeric" min="0" value="${r.porc || ''}"></label><label>Maïs acheté par mois (t)<input name="maisMois" type="number" inputmode="decimal" min="0" step="0.5" value="${r.maisMois || ''}"></label></div>
        <div class="chips"><b>Votre aliment :</b>${['Je le fabrique', 'Je l’achète complet', 'Les deux'].map((v) => rad('fabrique', v, r.fabrique)).join('')}</div>
        <label class="w">Prémix ou aliment utilisé aujourd’hui (marque)<input name="fournisseur" value="${esc(r.fournisseur)}"></label></fieldset>
      <fieldset class="fx-pr"><legend>Votre production de maïs</legend><div class="vg"><label>Surface en maïs (ha)<input name="surface" type="number" inputmode="decimal" min="0" step="0.5" value="${r.surface || ''}"></label><label>Coopérative (si membre)<input name="coop" value="${esc(r.coop)}"></label></div>
        <div class="chips"><b>Achetez-vous semences et engrais ?</b>${['Oui', 'Non', 'Parfois'].map((v) => rad('intrants', v, r.intrants)).join('')}</div></fieldset>
      <details class="veille" ${r.veille && Object.keys(r.veille).length ? 'open' : ''}><summary>Veille des prix : prix d’achat et de vente actuels du visiteur <span>(facultatif)</span></summary><div class="vg">${VEILLE.map(([k, l, u]) => `<label>${l} <small>(${u})</small><input name="vx_${k}" type="number" inputmode="decimal" min="0" step="any" value="${esc((r.veille || {})[k] || '')}"></label>${/^px/.test(k) ? `<div class="sacs"><b>Sac de ${l.toLowerCase()} :</b><div class="chips">${SACS.map((z) => rad('sac_' + k, z + ' kg', (r.veille || {})[k + 'Kg'] ? (r.veille || {})[k + 'Kg'] + ' kg' : '')).join('')}</div></div>` : ''}`).join('')}</div></details>
      <fieldset><legend>Vos priorités</legend><div class="chips">${PRIOS.map((v) => chk('prios', v, r.prios)).join('')}</div></fieldset>
      <div class="vg"><label>Dépôt SOLEVO le plus proche<select name="depot">${DEPOTS_S.map((d) => `<option ${d === r.depot ? 'selected' : ''}>${d}</option>`).join('')}</select></label>
        <div class="chips"><b>Être contacté par :</b>${CONTACTS.map((v) => rad('contact', v, r.contact)).join('')}</div></div>
      ${editor ? `<div class="chips"><b>Offert à l’accueil :</b>${ACCUEIL.map((v) => chk('accueil', v, r.accueil)).join('')}<label class="chip"><input type="checkbox" name="servi" ${r.servi ? 'checked' : ''}><span>Servi</span></label></div>` : ''}
      ${editor ? `<fieldset><legend>Suivi SOLEVO</legend><div class="vg">
        <label>Table<select name="table">${['', ...(state.standCfg.tables || []).map((t) => t.n)].map((n) => `<option value="${n}" ${String(n) === String(r.table) ? 'selected' : ''}>${n ? esc(tLab(n)) : '—'}</option>`).join('')}</select></label>
        <label>Entretien<select name="etat">${ETATS.map((v) => `<option ${v === r.etat ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        <label>ATE de suivi<select name="ate">${ATES.map((v) => `<option ${v === r.ate ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        <label>Statut<select name="statut">${STATUTS.map((v) => `<option ${v === r.statut ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        <label>Intérêt<select name="interet">${['', 'Fort', 'Moyen', 'Faible'].map((v) => `<option ${v === r.interet ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
        <label>Inscription au projet<select name="inscription">${['', 'Oui', 'À relancer', 'Non'].map((v) => `<option ${v === r.inscription ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>
        <label class="w">Note<textarea name="note" rows="2">${esc(r.note)}</textarea></label></fieldset>` : ''}
      <label class="consent"><input type="checkbox" name="consent" ${r.consent ? 'checked' : ''} required> J’accepte que SOLEVO Côte d’Ivoire utilise ces informations pour me recontacter au sujet du programme SISSÊ~KABA. *</label>
      <p class="ferr" hidden></p>
      <button type="submit" class="fsub">${editor ? 'Enregistrer' : 'Enregistrer mon inscription'}</button></form>`;
  }
  function bindForm(root, r, onSave) {
    const f = $('form.visf', root);
    const vis = () => { const p = (f.querySelector('[name=profil]:checked') || {}).value || ''; const t = { profil: p };
      $('.fx-el', f).hidden = !(isElev(t) || !p); $('.fx-pr', f).hidden = !(isProd(t) || !p); };
    const vis2 = () => { const v = (f.querySelector('[name=visite]:checked') || {}).value || 'Seul(e)'; const d = /Délégation|Association/.test(v);
      $$('.fx-dl', f).forEach((x) => { x.hidden = !d; }); $$('.fx-gr', f).forEach((x) => { x.hidden = v === 'Seul(e)'; });
      if (v === 'Seul(e)' && f.elements.nb) f.elements.nb.value = 1; else if (f.elements.nb && +f.elements.nb.value < 2) f.elements.nb.value = 2; };
    $$('[name=visite]', f).forEach((i) => i.addEventListener('change', vis2)); vis2();
    $$('[name=profil]', f).forEach((i) => i.addEventListener('change', vis)); vis();
    f.addEventListener('submit', async (e) => {
      e.preventDefault();
      const g = (n) => (f.elements[n] ? f.elements[n].value.trim() : '');
      const num = (n) => parseFloat(String(g(n)).replace(',', '.')) || 0;
      const err = $('.ferr', f);
      r.profil = (f.querySelector('[name=profil]:checked') || {}).value || '';
      Object.assign(r, { nom: g('nom'), tel: g('tel'), localite: g('localite'), email: g('email'), chair: num('chair'), pondeuse: num('pondeuse'), porc: num('porc'), maisMois: num('maisMois'),
        fournisseur: g('fournisseur'), surface: num('surface'), coop: g('coop'), depot: g('depot'),
        fabrique: (f.querySelector('[name=fabrique]:checked') || {}).value || '', intrants: (f.querySelector('[name=intrants]:checked') || {}).value || '',
        contact: (f.querySelector('[name=contact]:checked') || {}).value || 'WhatsApp', prios: $$('[name=prios]:checked', f).map((i) => i.value), consent: f.elements.consent.checked,
        veille: Object.fromEntries(VEILLE.flatMap(([k]) => { const v = num('vx_' + k); const sk = parseFloat(((f.querySelector('[name=sac_' + k + ']:checked') || {}).value || '')); return v > 0 ? [[k, v]].concat(sk > 0 ? [[k + 'Kg', sk]] : []) : []; })), visite: (f.querySelector('[name=visite]:checked') || {}).value || 'Seul(e)', nb: Math.max(1, parseInt(g('nb'), 10) || 1), org: g('org'), kam: (f.querySelector('[name=kam]:checked') || {}).value || '' });
      if (r.visite === 'Seul(e)') r.nb = 1; if (!isDeleg(r)) r.kam = '';
      if (f.elements.servi) { r.accueil = $$('[name=accueil]:checked', f).map((i) => i.value); r.servi = f.elements.servi.checked ? (r.servi || today().fr) : ''; }
      ['table', 'etat', 'ate', 'statut', 'interet', 'inscription', 'note'].forEach((k) => { if (f.elements[k]) r[k] = g(k); });
      if (r.table) { const t = (state.standCfg.tables || []).find((x) => String(x.n) === String(r.table)); if (t) r.agent = isDeleg(r) && r.kam && /^Salle/i.test(t.lieu || '') ? kamAgent(r.kam) : t.agent; }
      const miss = [];
      if (!r.profil) miss.push('votre profil'); if (!r.nom) miss.push('le nom'); if (waNum(r.tel).length < 11) miss.push('un téléphone valide'); if (!r.localite) miss.push('la localité');
      if (!r.consent) miss.push('votre accord');
      if (isDeleg(r) && !r.org) miss.push('le nom de la coopérative ou de l’association');
      if (isDeleg(r) && !r.kam) miss.push('le Key Account Manager souhaité');
      if (miss.length) { err.hidden = false; err.textContent = 'Merci d’indiquer ' + miss.join(', ') + '.'; return; }
      err.hidden = true; await onSave(r);
    });
  }
  /* ---- modale générique ---- */
  function modal(title, html, wide) {
    const m = $('#skModal'); m.hidden = false; m.classList.toggle('wide', !!wide);
    $('#skModalT').textContent = title; $('#skModalB').innerHTML = html; return $('#skModalB');
  }
  function modalClose() { $('#skModal').hidden = true; }
  /* ---- éditeur ---- */
  function editVisitor(id) {
    const r = id ? JSON.parse(JSON.stringify(state.pros.find((x) => x.id === id))) : newRec('Saisie');
    const b = modal(id ? 'Modifier le visiteur' : 'Ajouter un visiteur', visForm(r, true), true);
    bindForm(b, r, async (rr) => { if (!id && !rr.table) assignTable(rr); await prosPut(rr); modalClose(); status('Visiteur enregistré : ' + rr.nom, 'ok'); });
  }
  /* ---- import d’un message WhatsApp d’inscription ---- */
  const FICHE_RE = /FICHE D.INSCRIPTION SISS/i;
  const CR_RE = /COMPTE RENDU D.ENTRETIEN SISS/i;
  function kvOf(txt) { const kv = {}; String(txt).split(/\n/).forEach((l) => { const m = l.match(/^\s*([^:]{2,90}?)\s*:\s*(.*)$/); if (m) kv[m[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]+/g, ' ').trim()] = m[2].trim(); }); return kv; }
  /* compte rendu envoyé depuis l’interface d’entretien (navigateur) : met à jour ou crée la fiche */
  async function applyCR(txt) {
    const kv = kvOf(txt); const g = (k) => kv[k] || ''; const n = (k) => parseFloat(String(g(k)).replace(/\s/g, '').replace(',', '.')) || 0;
    const tel = g('telephone'); const k8 = waNum(tel).slice(-8);
    const tb = (state.standCfg.tables || []).find((t) => (t.lieu || 'Table ' + t.n).toLowerCase() === g('table').toLowerCase());
    const pick = (v, L) => L.find((x) => x.toLowerCase() === String(v).toLowerCase()) || '';
    const tr = g('transfert');
    const patch = { etat: 'Terminé', interet: pick(g('interet'), ['Fort', 'Moyen', 'Faible']), inscription: pick(g('inscription'), ['Oui', 'À relancer', 'Non']), action: g('action'),
      cr: 'Interface d’entretien ' + today().fr, agent: g('agent') || undefined };
    if (patch.inscription === 'Oui') patch.statut = 'Inscrit';
    if (tb) patch.table = tb.n;
    const note = [g('besoins') ? 'Besoins : ' + g('besoins') : '', g('note'), tr ? 'Transfert : ' + tr : ''].filter(Boolean).join(' • ');
    const ex = k8.length === 8 ? state.pros.find((x) => waNum(x.tel).slice(-8) === k8) : null;
    if (ex) { patch.note = ((ex.note || '') + (note ? ' • ' + note : '')).trim(); if (!ex.fin) patch.fin = new Date().toISOString(); if (tr && !ex.transfert) patch.transfert = { de: g('table'), deAgent: g('agent'), vers: tr.replace(/\s*\(.*$/, ''), motif: (tr.match(/\((.*)\)/) || ['', ''])[1], le: new Date().toISOString() }; Object.keys(patch).forEach((k) => patch[k] === undefined && delete patch[k]); await prosUpdate(ex.id, patch); return { maj: true, nom: ex.nom }; }
    const r = newRec('Interface d’entretien');
    Object.assign(r, patch, { nom: g('nom'), tel, localite: g('localite'), email: g('e mail'), profil: pick(g('profil'), PROFILS), nb: Math.max(1, n('nombre de personnes')), chair: n('poulets de chair'), pondeuse: n('pondeuses'), porc: n('porcs par an'), surface: n('surface mais ha'), consent: true, note, fin: new Date().toISOString() });
    if (tr) r.transfert = { de: g('table'), deAgent: g('agent'), vers: tr.replace(/\s*\(.*$/, ''), motif: (tr.match(/\((.*)\)/) || ['', ''])[1], le: new Date().toISOString() };
    if (!r.agent) r.agent = g('agent');
    await prosPut(r); return { maj: false, nom: r.nom };
  }
  function parseFiche(txt) {
    const r = newRec('QR fiche'); const kv = {};
    String(txt).split(/\n/).forEach((l) => { const m = l.match(/^\s*([^:]{2,90}?)\s*:\s*(.*)$/); if (m) kv[m[1].toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^a-z]+/g, ' ').trim()] = m[2].trim(); });
    const g = (...k) => { for (const x of k) if (kv[x]) return kv[x]; return ''; };
    const n = (...k) => parseFloat(String(g(...k)).replace(/\s/g, '').replace(',', '.')) || 0;
    const pick = (v, L) => L.find((x) => x.toLowerCase() === String(v).toLowerCase()) || '';
    const pk = Object.keys(kv).find((k) => /^profil/.test(k)); const pv = pk ? kv[pk] : '';
    const pvn = pv.toLowerCase(); const pf = pick(pv, PROFILS) || (/lev/.test(pvn) && /produc/.test(pvn) ? 'Éleveur et producteur' : /produc/.test(pvn) ? 'Producteur de maïs' : /lev/.test(pvn) ? 'Éleveur' : /fabric/.test(pvn) ? 'Fabricant d’aliment' : '');
    Object.assign(r, { profil: pf, nom: g('nom'), tel: g('telephone'), localite: g('localite'), email: g('e mail', 'email'), visite: pick(g('visite'), VISITES) || 'Seul(e)', nb: Math.max(1, n('nombre de personnes')), org: g('organisation'),
      kam: pick(g('entretien souhaite avec'), KAMS), chair: n('poulets de chair'), pondeuse: n('pondeuses'), porc: n('porcs par an'), maisMois: n('mais achete par mois t'), fabrique: g('aliment'), fournisseur: g('fournisseur'),
      surface: n('surface mais ha'), coop: g('cooperative'), intrants: g('intrants'), prios: g('priorites').split(/\s*,\s*/).filter((x) => PRIOS.includes(x)), depot: pick(g('depot'), DEPOTS_S) || DEPOTS_S[0], contact: pick(g('contact'), CONTACTS) || 'WhatsApp',
      veille: Object.fromEntries(VEILLE.flatMap(([k, l, u]) => { const v = n('prix ' + nrm(l) + ' ' + nrm(u)); const sk = n('sac ' + nrm(l) + ' kg'); return v > 0 ? [[k, v]].concat(sk > 0 ? [[k + 'Kg', sk]] : []) : []; })), tableVoulue: g('table souhaitee'), accueil: ACCUEIL.filter((a) => new RegExp(a, 'i').test(g('accueil'))), consent: /oui/i.test(g('accord')), note: 'Fiche d’inscription remplie sur téléphone (QR code de la borne).' });
    return r;
  }
  function parseWa(txt) {
    if (FICHE_RE.test(txt)) return parseFiche(txt);
    const r = newRec('QR WhatsApp'); const lines = String(txt).split(/\n/);
    const get = (re) => { for (const l of lines) { const m = l.match(re); if (m && m[1].trim() && !/^\.+$/.test(m[1].trim())) return m[1].trim(); } return ''; };
    r.nom = get(/nom[^:]*:\s*(.*)/i); r.tel = get(/t[ée]l[ée]?phone[^:]*:\s*(.*)/i); r.localite = get(/localit[ée][^:]*:\s*(.*)/i); r.email = get(/e-?mail[^:]*:\s*(\S+)/i);
    const prof = get(/(?:profil|je suis)[^:]*:\s*(.*)/i).toLowerCase();
    const el = /lev/.test(prof), pr = /produc/.test(prof);
    r.profil = el && pr ? 'Éleveur et producteur' : pr ? 'Producteur de maïs' : el ? 'Éleveur' : /fabric/.test(prof) ? 'Fabricant d’aliment' : '';
    const ch = get(/(?:élevage|elevage|cheptel)[^:]*:\s*(.*)/i);
    const n = parseFloat((ch.match(/[\d\s.,]+/) || [''])[0].replace(/[\s.]/g, '').replace(',', '.')) || 0;
    if (n) { if (/pond/i.test(ch)) r.pondeuse = n; else if (/porc/i.test(ch)) r.porc = n; else r.chair = n; if (!r.profil) r.profil = 'Éleveur'; }
    const sf = get(/surface[^:]*:\s*(.*)/i); r.surface = parseFloat((sf.match(/[\d.,]+/) || ['0'])[0].replace(',', '.')) || 0;
    if (r.surface && !r.profil) r.profil = 'Producteur de maïs';
    r.consent = true; r.note = 'Inscription reçue par WhatsApp (QR code).';
    return r;
  }
  function importWa() {
    const b = modal('Importer une inscription reçue par WhatsApp', `<p class="note">Copiez le message reçu sur le WhatsApp SOLEVO (fiche d’inscription du QR code ou compte rendu de l’interface d’entretien), collez-le ci-dessous.</p>
      <textarea id="waTxt" rows="9" style="width:100%"></textarea><div class="mbar"><button id="waGo" type="button">Lire le message</button></div>`);
    $('#waGo', b).addEventListener('click', async () => {
      const raw = $('#waTxt', b).value;
      if (CR_RE.test(raw)) { const x = await applyCR(raw); modalClose(); status((x.maj ? 'Compte rendu intégré à la fiche de ' : 'Visiteur créé depuis le compte rendu : ') + x.nom, 'ok'); return; }
      const r = parseWa(raw); assignTable(r);
      const bb = modal('Vérifier l’inscription importée', visForm(r, true), true);
      bindForm(bb, r, async (rr) => { await prosPut(rr); modalClose(); status('Inscription importée : ' + rr.nom, 'ok'); simuAuto(rr); });
    });
  }
  /* ---- configuration (tables, agents, messages, borne) ---- */
  function editCfg() {
    const c = state.standCfg;
    const b = modal('Tables, agents et messages', `<div class="cfgt">${(c.tables || []).map((t, i) => `<div class="cfgr"><input data-ti="${i}" data-tk="n" type="number" min="1" value="${t.n}" title="N° interne"><input data-ti="${i}" data-tk="lieu" value="${esc(t.lieu || 'Table ' + t.n)}" placeholder="Nom affiché (Table 4, Salle de conférence…)"><input data-ti="${i}" data-tk="agent" value="${esc(t.agent)}" placeholder="Agent ou responsable"><input data-ti="${i}" data-tk="cap" type="number" min="0" max="60" value="${t.cap != null && t.cap !== '' ? t.cap : capOf(t)}" title="Personnes au plus en même temps (0 = sans limite)" style="width:64px"><select data-ti="${i}" data-tk="pour">${POURS.map((v) => `<option ${v === t.pour ? 'selected' : ''}>${v}</option>`).join('')}</select><button type="button" data-tdel="${i}">✕</button></div>`).join('')}</div>
      <div class="mbar"><button type="button" id="tAdd">+ Ajouter une table</button></div>
      <label class="w">Message envoyé à l’inscription (table d’entretien)<textarea id="mTable" rows="4">${esc(c.msgTable)}</textarea></label>
      <label class="w">Message de remerciement après l’entretien (WhatsApp, SMS et e-mail)<textarea id="mMerci" rows="8">${esc(c.msgMerci)}</textarea></label>
      <p class="note">Grands comptes (envoyés vers les tables KAM ou la salle de conférence) : au moins 20 000 poulets de chair ou 20 000 pondeuses, 1 000 porcs par an, fabricant d’aliment, ou au moins 50 ha de maïs (20 ha pour une coopérative).</p>
      <p class="note">Repères utilisables : {prenom}, {nom}, {rang} (place dans la file : « 1er », « 3e »), {contacts} (Key Account Manager et technicien selon le profil), {lieu} (« à la TABLE 4 », « à la Salle de conférence SOLEVO »), {table}, {agent}, {activite}, {lien} (lien d’inscription ci-dessous), {mail} (mention de l’e-mail envoyé).</p>
      <p class="note">Capacité : chaque table reçoit au plus le nombre de personnes indiqué (4 par défaut ; 0 = sans limite, réservé à la salle de conférence). Les délégations de coopératives, les associations et les groupes de plus de 4 personnes sont dirigés vers la salle de conférence avec le Key Account Manager choisi.</p>

      <label class="w">Lien d’inscription au projet (facultatif : formulaire en ligne)<input id="mLien" value="${esc(c.inscription)}" placeholder="https://…"></label>
      <fieldset class="autof"><legend>Envoi automatique WhatsApp / SMS (sans clic)</legend>
        <label>Service connecté dans Zapier<select id="mProv">${Object.entries(AUTO_PROV).map(([k, v]) => `<option value="${k}" ${k === (c.autoProv || 'off') ? 'selected' : ''}>${v.n}</option>`).join('')}</select></label>
        <label class="consent"><input type="checkbox" id="mAT" ${c.autoTable ? 'checked' : ''}> Envoyer automatiquement la table à l’inscription</label>
        <label class="consent"><input type="checkbox" id="mAM" ${c.autoMerci ? 'checked' : ''}> Envoyer automatiquement le remerciement à la fin de l’entretien</label>
        <label>Objectif du jour : prémix MG2MIX simulé (t/an potentielles, affiché sur l’écran d’appel)<input type="number" min="1" step="1" id="mObjPx" value="${esc(c.objPremix || 10)}"></label>
        <label class="consent"><input type="checkbox" id="mASim" ${c.autoSimu !== false ? 'checked' : ''}> Envoyer automatiquement au visiteur ses coûts MG2MIX (e-mail + WhatsApp) dès que sa fiche contient la veille des prix</label>
        <label class="consent"><input type="checkbox" id="mAR" ${c.autoReplies ? 'checked' : ''}> Lire les réponses toutes les 3 minutes : « OUI » = inscrit au projet (Smsmobileapi)</label>
        <label class="consent"><input type="checkbox" id="mRO" ${c.rappelOn ? 'checked' : ''}> Rappeler le visiteur s’il attend depuis plus de <input id="mRM" type="number" min="5" max="90" value="${+c.rappelMin || 15}" style="width:64px"> minutes</label>
        <label class="consent"><input type="checkbox" id="mATr" ${c.autoTransfert !== false ? 'checked' : ''}> Envoyer automatiquement un message au visiteur transféré vers un Key Account Manager</label>
        <label class="consent"><input type="checkbox" id="mNK" ${c.notifKam !== false ? 'checked' : ''}> Prévenir le Key Account Manager sur son téléphone à chaque transfert</label>
        <div class="vg"><label>Téléphone KAM FEED (Elvis LEHITO)<input id="mKF" value="${esc(c.kamFeedTel || CFG_DEFAULT.kamFeedTel)}"></label><label>Téléphone KAM SEED (Arnaud AGOHI)<input id="mKS" value="${esc(c.kamSeedTel || CFG_DEFAULT.kamSeedTel)}"></label></div>
        <label class="w">Message au Key Account Manager ({nom}, {profil}, {localite}, {activite}, {motif}, {de}, {tel}, {lieu})<textarea id="mKam" rows="3">${esc(c.msgKam || CFG_DEFAULT.msgKam)}</textarea></label>
        <label class="w">Message de transfert ({de} = agent d’origine, {motif} = raison du transfert)<textarea id="mTransf" rows="3">${esc(c.msgTransfert || CFG_DEFAULT.msgTransfert)}</textarea></label>
        <label class="w">Message de rappel<textarea id="mRappel" rows="3">${esc(c.msgRappel || CFG_DEFAULT.msgRappel)}</textarea></label>
        <p class="note">Smsmobileapi envoie depuis le téléphone Android SOLEVO (application installée) par WhatsApp puis SMS si besoin. WhatsApp Business API ne permet un premier message que par modèle approuvé par Meta. En cas d’échec, les boutons manuels restent disponibles.</p></fieldset>
      <label class="w">Numéro WhatsApp de la borne digitale (pour lui envoyer le lien)<input id="mKiosk" value="${esc(c.kioskTel)}" placeholder="07 00 00 00 00"></label>
      <div class="mbar"><button type="button" id="cfgOk">Enregistrer</button><button type="button" id="cfgReset">Messages par défaut</button></div>`, true);
    const read = () => { $$('[data-ti]', b).forEach((i) => { const t = c.tables[+i.dataset.ti]; t[i.dataset.tk] = i.dataset.tk === 'n' ? parseInt(i.value, 10) || 1 : i.dataset.tk === 'cap' ? Math.max(0, parseInt(i.value, 10) || 0) : i.value.trim(); });
      c.msgTable = $('#mTable', b).value; c.msgMerci = $('#mMerci', b).value; c.autoProv = $('#mProv', b).value; c.autoTable = $('#mAT', b).checked; c.autoMerci = $('#mAM', b).checked; c.autoSimu = $('#mASim', b).checked; c.objPremix = Math.max(1, +$('#mObjPx', b).value || 10); c.autoReplies = $('#mAR', b).checked; c.rappelOn = $('#mRO', b).checked; c.rappelMin = Math.max(5, parseInt($('#mRM', b).value, 10) || 15); c.msgRappel = $('#mRappel', b).value; c.autoTransfert = $('#mATr', b).checked; c.notifKam = $('#mNK', b).checked; c.kamFeedTel = $('#mKF', b).value.trim(); c.kamSeedTel = $('#mKS', b).value.trim(); c.msgKam = $('#mKam', b).value; c.msgTransfert = $('#mTransf', b).value; c.inscription = $('#mLien', b).value.trim(); c.kioskTel = $('#mKiosk', b).value.trim(); };
    $('#tAdd', b).addEventListener('click', () => { read(); { const nn = (c.tables.reduce((a, t) => Math.max(a, t.n), 0) || 0) + 1; c.tables.push({ n: nn, lieu: 'Table ' + nn, agent: '', pour: 'Tous' }); } editCfg(); });
    $$('[data-tdel]', b).forEach((x) => x.addEventListener('click', () => { read(); c.tables.splice(+x.dataset.tdel, 1); editCfg(); }));
    $('#cfgReset', b).addEventListener('click', () => { c.msgTable = CFG_DEFAULT.msgTable; c.msgMerci = CFG_DEFAULT.msgMerci; c.msgTransfert = CFG_DEFAULT.msgTransfert; c.msgKam = CFG_DEFAULT.msgKam; editCfg(); });
    $('#cfgOk', b).addEventListener('click', async () => { read(); await cfgSave(); modalClose(); renderPros(); status('Configuration du stand enregistrée.', 'ok'); });
  }
  function sendKioskLink() {
    const tel = state.standCfg.kioskTel;
    if (waNum(tel).length < 11) { editCfg(); status('Indiquez d’abord le numéro WhatsApp de la borne.', 'err'); return; }
    const url = 'https://claude.ai/artifact/TUnnsq3KPaGHqWqgX2PpWF';
    const txt = `Borne d’inscription SOLEVO – SELAB SHOW\n\n1. Ouvrez ce lien sur la borne, dans le navigateur (claude.ai, compte SOLEVO connecté) ou dans l’application Claude : ${url}#borne\n2. Si le mode borne ne s’ouvre pas tout seul : onglet Stand, bouton « ▣ Mode borne ».\n3. Laissez l’écran en plein écran : les visiteurs s’inscrivent sur l’écran ou par le QR code. Tout est enregistré dans la même liste.`;
    window.open(waLink(tel, txt), '_blank', 'noopener');
  }
  /* ---- borne d’inscription plein écran ---- */
  function kioskQrLink() {
    const c = state.standCfg;
    if (c.qrMode === 'fiche') return LINKS.main + '#fiche';
    if (!c.qrMode || c.qrMode === 'nav') return LINKS.fiche;
    const u = (c.ficheUrl || '').trim();
    if (c.qrMode === 'url' && /^https?:\/\//.test(u)) return u;
    const msg2 = 'FICHE D’INSCRIPTION SISSÊ~KABA – Stand SOLEVO (SELAB SHOW)\nProfil (Éleveur / Producteur de maïs / Éleveur et producteur) : \nNom : \nTéléphone : \nLocalité : \nVisite : Seul(e)\nNombre de personnes : 1\nPoulets de chair : \nPondeuses : \nPorcs par an : \nSurface maïs (ha) : \nE-mail : \nAccord : oui';
    if (msg2) return 'https://wa.me/' + waNum(SOLEVO_TEL) + '?text=' + encodeURIComponent(msg2);
    const msg = 'INSCRIPTION SISSÊ~KABA – Stand SOLEVO\nNom : \nTéléphone : \nLocalité : \nProfil (éleveur / producteur / les deux) : \nÉlevage et cheptel (ex. 5000 chair) : \nSurface en maïs (ha) : \nE-mail : ';
    return 'https://wa.me/' + waNum(SOLEVO_TEL) + '?text=' + encodeURIComponent(msg);
  }
  let kioskTimer = null;
  function kioskOpen() {
    const k = $('#borne'); k.hidden = false; k.classList.remove('fiche'); kioskForm();
    if (k.requestFullscreen) k.requestFullscreen().catch(() => {});
  }
  function kioskClose() { clearTimeout(kioskTimer); $('#borne').hidden = true; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); }
  function kioskForm() {
    clearTimeout(kioskTimer);
    const r = newRec('Borne');
    const qr = qrCanvas(kioskQrLink(), 520).toDataURL('image/png');
    $('#borneB').innerHTML = `<div class="bk-l"><h2>Inscrivez-vous sur l’écran</h2><p>Deux minutes, puis un technicien SOLEVO vous reçoit à sa table.</p>${visForm(r, false)}</div>
      <div class="bk-r"><div class="bk-or">ou</div><h2>Depuis votre téléphone</h2><img src="${qr}" alt="QR code d’inscription"><p>${state.standCfg.qrMode !== 'wa' ? 'Scannez : la même fiche d’inscription s’ouvre dans le navigateur de votre téléphone. Validez, puis envoyez-la : votre table vous est indiquée en retour.' : 'Scannez : une fiche d’inscription s’ouvre dans WhatsApp, déjà prête. Complétez-la et envoyez-la : votre table vous est indiquée en retour.'}</p><p class="bk-c">${SOLEVO_TEL} • ${SOLEVO_MAIL}</p></div>`;
    bindForm($('#borneB'), r, async (rr) => {
      assignTable(rr);
      try { await prosPut(rr); } catch (e) { $('.ferr', $('#borneB')).hidden = false; $('.ferr', $('#borneB')).textContent = 'Enregistrement impossible, merci de vous adresser à l’accueil.'; return; }
      simuAuto(rr);
      kioskDone(rr);
    });
  }
  /* fiche visiteur intégrée (téléphone ou ordinateur) : même formulaire que la borne, enregistrement direct dans la liste */
  function ficheOpen() {
    const k = $('#borne'); k.hidden = false; k.classList.add('fiche'); clearTimeout(kioskTimer);
    const r = newRec('Fiche visiteur');
    $('#borneB').innerHTML = `<div class="bk-l"><h2>Fiche d’inscription visiteur</h2><p>Deux minutes, puis un technicien ou un Key Account Manager SOLEVO vous reçoit.</p>${visForm(r, false)}</div>`;
    bindForm($('#borneB'), r, async (rr) => {
      assignTable(rr);
      try { if (!state.db && !state.prosLocal) throw new Error('hors ligne'); await prosPut(rr); kioskDone(rr, true); simuAuto(rr); }
      catch (e) {
        const t = 'FICHE D’INSCRIPTION SISSÊ~KABA – Stand SOLEVO (SELAB SHOW)\nProfil : ' + rr.profil + '\nNom : ' + rr.nom + '\nTéléphone : ' + rr.tel + '\nLocalité : ' + rr.localite + '\nE-mail : ' + rr.email + '\nVisite : ' + rr.visite + '\nNombre de personnes : ' + nbP(rr) + (rr.org ? '\nOrganisation : ' + rr.org : '') + (rr.kam ? '\nEntretien souhaité avec : ' + rr.kam : '') + '\nPoulets de chair : ' + (rr.chair || '') + '\nPondeuses : ' + (rr.pondeuse || '') + '\nPorcs par an : ' + (rr.porc || '') + '\nSurface maïs (ha) : ' + (rr.surface || '') + '\nPriorités : ' + (rr.prios || []).join(', ') + '\nDépôt : ' + rr.depot + '\nAccord : oui';
        $('#borneB').innerHTML = `<div class="bk-done"><div class="bk-ok">✓</div><h2>Merci ${esc(prenom(rr))} !</h2><p>Dernière étape : envoyez votre fiche à SOLEVO, votre table vous sera indiquée en retour.</p><div class="mbar"><a class="bk-btn" target="_blank" rel="noopener" href="${waLink(SOLEVO_TEL, t)}">Envoyer ma fiche par WhatsApp</a><a class="bk-btn alt" href="${smsLink(SOLEVO_TEL, t)}">par SMS</a></div><p class="note">Une bouteille d’eau et un café vous sont offerts à l’accueil SOLEVO.</p></div>`;
      }
    });
  }
  function kioskDone(r, fiche) {
    const txt = fillMsg(state.standCfg.msgTable, r);
    autoSend(r, txt, 'table').then((res) => { const el = $('#bkAuto'); if (el && res) { el.textContent = res.ok ? '✓ ' + res.msg.replace('Message envoyé automatiquement', 'Ce message vous a été envoyé') : ''; el.className = res.ok ? 'okm' : ''; } });
    $('#borneB').innerHTML = `<div class="bk-done"><div class="bk-ok">✓</div><h2>Merci ${esc(prenom(r))} !</h2>
      <p class="bk-t">Rendez-vous ${/^Table/i.test(tLab(r.table)) ? 'à la' : /^Salle/i.test(tLab(r.table)) ? 'à la' : 'à'} <b>${esc(/^Table/i.test(tLab(r.table)) ? tLab(r.table).toUpperCase() : tLab(r.table))}</b></p><p class="bk-a">avec ${esc(r.agent || 'un technicien SOLEVO')}</p><p class="bk-rang">Vous êtes <b>${rangLab(r)}</b> dans la file d’attente</p><p id="bkAuto"></p>
      <div class="bk-off"><h3>SOLEVO vous offre${nbP(r) > 1 ? ' (' + nbP(r) + ' personnes)' : ''}</h3><div class="bk-offb"><button type="button" data-acc="Eau" class="on">💧 ${nbP(r) > 1 ? nbP(r) + ' bouteilles' : '1 bouteille'} d’eau</button><button type="button" data-acc="Café" class="on">☕ ${nbP(r) > 1 ? nbP(r) + ' cafés' : '1 café'}</button><button type="button" data-acc="non">Non merci</button></div><p class="note">Servi à l’accueil pendant votre attente.</p></div>
      <div class="mbar"><a class="bk-btn" href="${waLink(r.tel, txt)}" target="_blank" rel="noopener" data-sent="wa">Recevoir ce message sur WhatsApp</a><a class="bk-btn alt" href="${smsLink(r.tel, txt)}" data-sent="sms">par SMS</a></div>
      ${fiche ? '' : '<p class="note">Retour automatique à l’accueil dans 30 secondes.</p>'}<button type="button" class="bk-next">Nouvelle inscription</button></div>`;
    $$('#borneB [data-sent]').forEach((a) => a.addEventListener('click', () => prosUpdate(r.id, { msgTable: (a.dataset.sent === 'wa' ? 'WhatsApp ' : 'SMS ') + today().fr })));
    const accSave = () => { const a = $$('#borneB [data-acc].on').map((x) => x.dataset.acc).filter((x) => x !== 'non'); r.accueil = a; prosUpdate(r.id, { accueil: a }); };
    $$('#borneB [data-acc]').forEach((bt) => bt.addEventListener('click', () => {
      if (bt.dataset.acc === 'non') { $$('#borneB [data-acc]').forEach((x) => x.classList.toggle('on', x === bt)); }
      else { bt.classList.toggle('on'); $('#borneB [data-acc=non]').classList.remove('on'); }
      accSave(); clearTimeout(kioskTimer); if (!fiche) kioskTimer = setTimeout(kioskForm, 30000);
    }));
    accSave();
    $('#borneB .bk-next').addEventListener('click', fiche ? ficheOpen : kioskForm);
    if (!fiche) kioskTimer = setTimeout(kioskForm, 30000);
  }
  /* ---- vue des agents (tables d’entretien) ---- */
  /* ---- transfert en un clic vers un Key Account Manager ---- */
  const KAM_DEST = [{ k: 'feed', lab: 'KAM FEED', re: /KAM FEED/i, pour: 'Grands comptes FEED' }, { k: 'seed', lab: 'KAM SEED', re: /KAM SEED/i, pour: 'Grands comptes SEED' }, { k: 'salle', lab: 'Salle', re: /^Salle/i, pour: 'Grands comptes' }];
  const kamTable = (d) => (state.standCfg.tables || []).find((t) => d.re.test(t.lieu || '')) || (state.standCfg.tables || []).find((t) => t.pour === d.pour);
  function motifAuto(r, d) {
    const m = [];
    if (bigFeed(r)) m.push('élevage de grande taille'); if (bigSeed(r)) m.push('grande surface de maïs');
    if (isDeleg(r)) m.push(r.visite.toLowerCase());
    if (!m.length) m.push(d.k === 'seed' ? 'offre semences, engrais et achat du maïs' : d.k === 'feed' ? 'offre prémix et approvisionnement en maïs' : 'offre complète FEED et SEED');
    return m.join(', ');
  }
  async function transferTo(id, dk) {
    const r = state.pros.find((x) => x.id === id); const d = KAM_DEST.find((x) => x.k === dk); const t = d && kamTable(d);
    if (!r || !t) { status('Table du Key Account Manager introuvable : vérifiez « ⚙ Tables, agents et messages ».', 'err'); return; }
    if (String(r.table) === String(t.n)) { status(nomCourt(r) + ' est déjà ' + tA(t.n) + '.', 'err'); return; }
    const deT = tOf(r.table) || {};
    const mLibre = String((state.trMotif || {})[id] || '').trim().slice(0, 120);
    const tr = { de: tLab(r.table), deAgent: String(deT.agent || r.agent || 'notre technicien').split(',')[0], vers: tLab(t.n), dk, le: new Date().toISOString(), motif: mLibre || motifAuto(r, d), motifLibre: !!mLibre };
    if (state.trMotif) delete state.trMotif[id];
    const hist = (r.transferts || []).concat([tr]);
    const patch = { table: t.n, agent: t.agent, etat: 'En attente', debut: '', rappel: '', transfert: tr, transferts: hist, msgTransfert: '',
      note: ((r.note || '') + ' • Transféré de ' + tr.de + ' vers ' + tr.vers + ' (' + tr.motif + ') le ' + today().fr).trim() };
    if (dk === 'salle' && isDeleg(r) && r.kam) patch.agent = kamAgent(r.kam);
    await prosUpdate(id, patch);
    const rr = Object.assign({}, r, patch);
    const txt = fillMsg(state.standCfg.msgTransfert || CFG_DEFAULT.msgTransfert, rr);
    renderAgents(); renderAppel();
    /* prévenir le ou les Key Account Managers concernés */
    const c = state.standCfg;
    const kams = dk === 'feed' ? [['Elvis LEHITO', c.kamFeedTel || TM.lehito.tel]] : dk === 'seed' ? [['Arnaud AGOHI', c.kamSeedTel || TM.agohi.tel]]
      : (r.kam === KAMS[0] ? [['Elvis LEHITO', c.kamFeedTel || TM.lehito.tel]] : r.kam === KAMS[1] ? [['Arnaud AGOHI', c.kamSeedTel || TM.agohi.tel]] : [['Elvis LEHITO', c.kamFeedTel || TM.lehito.tel], ['Arnaud AGOHI', c.kamSeedTel || TM.agohi.tel]]);
    const kTxt = fillMsg(c.msgKam || CFG_DEFAULT.msgKam, rr);
    const kRes = [];
    if (c.notifKam !== false) for (const [n, tel] of kams) { const x = await sendTel(tel, kTxt); kRes.push({ n, tel, ok: x.ok, ch: x.ch }); }
    const kLab = kRes.filter((x) => x.ok).map((x) => x.n + ' (' + x.ch + ')').join(', ');
    if (kRes.length) await prosUpdate(id, { kamPrevenu: kLab ? kLab + ' ' + today().fr : 'À prévenir (manuel)' });
    const res = await autoSend(rr, txt, 'transfert');
    const kamOk = !kRes.length || kRes.every((x) => x.ok);
    if (res && res.ok && kamOk) { status(`${nomCourt(r)} transféré(e) ${tA(t.n)} • ${res.msg}${kLab ? ' • ' + kLab + ' prévenu(s).' : ''}`, 'ok'); return; }
    const b = modal('Transfert effectué : ' + r.nom, `<p><b>${esc(r.nom)}</b> passe de <b>${esc(tr.de)}</b> à <b>${esc(tr.vers)}</b> (${esc(t.agent)}).</p>${res ? `<p class="note">${esc(res.msg)}</p>` : ''}
      <label class="w">Message au visiteur<textarea id="trTxt" rows="5">${esc(txt)}</textarea></label>
      <div class="mbar"><a class="bk-btn" id="trWa" target="_blank" rel="noopener">Envoyer par WhatsApp</a><a class="bk-btn alt" id="trSms">par SMS</a></div>
      ${c.notifKam !== false ? `<h4 style="margin:12px 0 4px">Prévenir le Key Account Manager</h4><p class="note">${esc(kTxt)}</p><div class="mbar">${kams.map(([n, tel]) => { const ok = kRes.find((x) => x.n === n && x.ok); return ok ? `<span class="okm">✓ ${esc(n)} prévenu par ${ok.ch}</span>` : `<a class="bk-btn alt" target="_blank" rel="noopener" data-kam="${esc(n)}" href="${waLink(tel, kTxt)}">Prévenir ${esc(n)} (WhatsApp)</a>`; }).join('')}</div>` : ''}
      <div class="mbar"><button type="button" id="trOk">Fermer</button></div>`);
    $$('[data-kam]', b).forEach((a) => a.addEventListener('click', () => prosUpdate(id, { kamPrevenu: a.dataset.kam + ' (WhatsApp manuel) ' + today().fr })));
    const upd = () => { const v = $('#trTxt', b).value; $('#trWa', b).href = waLink(r.tel, v); $('#trSms', b).href = smsLink(r.tel, v); };
    $('#trTxt', b).addEventListener('input', upd); upd();
    $('#trWa', b).addEventListener('click', () => prosUpdate(id, { msgTransfert: 'WhatsApp ' + today().fr }));
    $('#trSms', b).addEventListener('click', () => prosUpdate(id, { msgTransfert: 'SMS ' + today().fr }));
    $('#trOk', b).addEventListener('click', modalClose);
  }
  function trButtons(r) {
    const cur = tOf(r.table) || {};
    const sugg = bigFeed(r) && !bigSeed(r) ? 'feed' : bigSeed(r) && !bigFeed(r) ? 'seed' : isDeleg(r) ? 'salle' : isProd(r) && !isElev(r) ? 'seed' : isElev(r) && !isProd(r) ? 'feed' : 'salle';
    const mv = (state.trMotif || {})[r.id] || '';
    return `<div class="agtr"><input class="trm" data-trm="${r.id}" value="${esc(mv)}" maxlength="120" placeholder="Motif du transfert (facultatif, ex. 30 000 pondeuses, veut un contrat maïs)"><span>Transférer vers :</span>${KAM_DEST.map((d) => { const t = kamTable(d); if (!t || String(t.n) === String(cur.n)) return ''; return `<button type="button" data-ag="tr" data-dk="${d.k}" data-id="${r.id}" class="tr ${d.k === sugg ? 'sug' : ''}" title="${esc(t.agent)}">${d.k === 'salle' ? 'Salle de conf.' : d.lab}${d.k === sugg ? ' ★' : ''}</button>`; }).join('')}</div>`;
  }
  async function poolTake(n) {
    const t = tOf(n) || {}; const L = state.pros.filter((r) => state.poolSel && state.poolSel.has(r.id) && r.etat === 'En attente');
    if (!L.length) return;
    const cap = capOf(t), occ = occOf(n), add = L.reduce((a, r) => a + nbP(r), 0);
    if (cap && occ + add > cap) { status(`${tLab(n)} : ${cap} personnes au plus en entretien (${occ} déjà reçues, ${add} cochée(s)). Décochez un visiteur ou orientez-le vers la salle de conférence.`, 'err'); return; }
    const now = new Date().toISOString();
    for (const r of L) {
      const patch = { table: t.n, agent: t.agent, etat: 'En entretien', debut: now, rappel: r.rappel || '' };
      if (String(r.table) !== String(t.n)) patch.note = ((r.note || '') + ' • Pris en entretien à la ' + tLab(t.n) + (r.table ? ' (prévu ' + tLab(r.table) + ')' : '') + ' le ' + today().fr).trim();
      await prosUpdate(r.id, patch);
    }
    state.poolSel.clear(); state.poolQ = '';
    status(L.length + ' visiteur(s) en entretien à la ' + tLab(n) + ' : ' + L.map((r) => nomCourt(r)).join(', ') + '.', 'ok');
    renderAgents(); renderAppel();
  }
  function tableBilan(n) {
    const t = tOf(n) || {}; const day = new Date().toISOString().slice(0, 10);
    const L = state.pros.filter((r) => String(r.table) === String(n) && String(r.at).slice(0, 10) === day); const d = L.filter((r) => r.etat === 'Terminé');
    const txt = [`BILAN DE TABLE SISSÊ~KABA – ${tLab(n)} – ${today().fr}`, `Agent : ${t.agent || ''}`, `Visiteurs : ${L.length} (personnes : ${L.reduce((a, r) => a + nbP(r), 0)})`, `Entretiens terminés : ${d.length}`, `Inscrits au projet : ${d.filter((r) => r.inscription === 'Oui').length}`, `Intérêts forts : ${d.filter((r) => r.interet === 'Fort').length}`, `Transferts vers un KAM : ${L.filter((r) => r.transfert).length}`, '', 'Détail :']
      .concat(d.map((r) => `- ${r.nom} • ${r.tel} • ${r.localite || ''} • ${activite(r)} • intérêt ${r.interet || '—'} • inscription ${r.inscription || '—'} • ${r.action || ''}`)).join('\n');
    const to = ['elvis.lehito@solevogroup.com', 'arnaud.agohi@solevogroup.com'];
    const b = modal('Bilan de la ' + tLab(n), `<pre class="bjout" style="white-space:pre-wrap">${esc(txt)}</pre><div class="mbar"><button type="button" id="tbM">Envoyer aux Key Account Managers (e-mail)</button><a class="bk-btn alt" target="_blank" rel="noopener" href="${waLink(SOLEVO_TEL2, txt)}">WhatsApp à Elvis LEHITO</a><a class="bk-btn alt" target="_blank" rel="noopener" href="${waLink(TM.agohi.tel, txt)}">WhatsApp à Arnaud AGOHI</a><button type="button" id="tbX">Fermer</button></div>`, true);
    $('#tbX', b).addEventListener('click', modalClose);
    $('#tbM', b).addEventListener('click', async () => {
      if (!state.mcp) { location.href = 'mailto:' + to.join(',') + '?subject=' + encodeURIComponent('SISSÊ~KABA – Bilan ' + tLab(n) + ' – ' + today().fr) + '&body=' + encodeURIComponent(txt); return; }
      try { await state.mcp.callTool('Gmail', 'send_message', { to, subject: 'SISSÊ~KABA – Bilan ' + tLab(n) + ' – ' + today().fr, htmlBody: '<pre style="font-family:Arial,sans-serif;font-size:13px">' + esc(txt) + '</pre>' }); status('Bilan de table envoyé.', 'ok'); modalClose(); }
      catch (e) { status('Bilan non envoyé : ' + mailErr(e), 'err'); }
    });
  }
  function agentsOpen(table) {
    if (table != null) { const t = (state.standCfg.tables || []).find((x) => (x.lieu || 'Table ' + x.n).toLowerCase() === String(table).toLowerCase() || String(x.n) === String(table)); if (t) { state.agInit = true; $('#agTable').innerHTML = `<option value="${t.n}" selected></option>`; } } $('#agents').hidden = false; renderAgents(); }
  function renderAgents() {
    if (!$('#agents') || $('#agents').hidden) return;
    const T = state.standCfg.tables || [];
    if (!state.agInit) { state.agInit = true; try { const m = localStorage.getItem('sk_agTable'); if (m) $('#agTable').innerHTML = `<option value="${esc(m)}" selected></option>`; } catch (e) { /* */ } }
    const sel = $('#agTable').value;
    try { localStorage.setItem('sk_agTable', sel); } catch (e) { /* */ }
    $('#agTable').innerHTML = '<option value="">Toutes les tables</option>' + T.map((t) => `<option value="${t.n}" ${String(t.n) === sel ? 'selected' : ''}>${esc(tLab(t.n))} – ${esc(t.agent)}</option>`).join('');
    const tb = T.filter((t) => !sel || String(t.n) === sel);
    const lim = +state.standCfg.rappelMin || 15;
    const toServe = state.pros.filter((r) => r.etat !== 'Terminé' && (r.accueil || []).length && !r.servi);
    const accHtml = `<section class="agt acc"><h3>☕ Accueil : à servir <small>${toServe.length} visiteur(s)</small></h3>${toServe.map((r) => `<div class="agc"><b>${esc(r.nom)}${nbP(r) > 1 ? ' • ' + nbP(r) + ' pers.' : ''}</b><span>${esc(accLab(r))} • ${esc(tLab(r.table))}</span><div class="agb"><button data-ag="servi" data-id="${r.id}">Servi ✓</button></div></div>`).join('') || '<p class="note">Rien à servir pour le moment.</p>'}</section>`;
    const card = (r) => `<div class="agc ${r.etat === 'En entretien' ? 'on' : ''} ${r.etat === 'En attente' && waitMin(r) >= lim ? 'late' : ''}"><b>${esc(r.nom)}${nbP(r) > 1 ? ` <em class="nbp">${nbP(r)} pers.</em>` : ''}</b><span>${isDeleg(r) ? esc(r.visite + ' : ' + (r.org || '')) + ' • ' : ''}${esc(r.public)} • ${esc(r.localite)}${r.etat === 'En attente' ? ` • <em class="wt">attend depuis ${fr(waitMin(r), 0)} min</em>` : ''}</span>
      ${r.etat === 'En attente' && waitMin(r) >= lim ? `<small class="rp">${/auto/.test(r.rappel || '') ? '✓ Rappel envoyé (' + esc(r.rappel) + ')' : `⏰ <a href="${waLink(r.tel, fillMsg(state.standCfg.msgRappel || CFG_DEFAULT.msgRappel, r))}" target="_blank" rel="noopener">Envoyer le rappel WhatsApp</a>`}</small>` : ''}<small>${esc(activite(r))}${r.prios && r.prios.length ? ' • ' + esc(r.prios.join(', ')) : ''}</small>
      <div class="agb">${r.etat === 'En attente' ? `<button data-ag="start" data-id="${r.id}">Appeler et démarrer</button>` : `<button data-ag="end" data-id="${r.id}" class="end">Terminer l’entretien</button>`}<button data-ag="edit" data-id="${r.id}" class="alt">Fiche</button><button data-ag="sim" data-id="${r.id}" class="alt" title="Formulation et rentabilité avec le prémix MG2MIX">🧮 Simulation${r.simu ? ' ✓' : ''}</button></div>${r.transfert ? `<small class="trd">↪ Transféré de ${esc(r.transfert.de)} (${esc(r.transfert.motif)})${r.msgTransfert ? ' • message : ' + esc(r.msgTransfert) : ''}</small>` : ''}${trButtons(r)}</div>`;
    $('#agB').innerHTML = tb.map((t) => {
      const L = state.pros.filter((r) => String(r.table) === String(t.n) && r.etat !== 'Terminé').sort((a, b) => (a.etat === 'En entretien' ? -1 : 0) - (b.etat === 'En entretien' ? -1 : 0) || a.at.localeCompare(b.at));
      const done = state.pros.filter((r) => String(r.table) === String(t.n) && r.etat === 'Terminé').length;
      const cap = capOf(t), occ = occOf(t.n);
      return `<section class="agt ${cap && occ >= cap ? 'full' : ''}"><h3>${esc(tLab(t.n))} <small>${esc(t.agent)} • ${esc(t.pour)}</small></h3><p class="agk"><b>${occ}${cap ? ' / ' + cap : ''} personne(s) en entretien</b>${cap && occ >= cap ? ' • table complète' : ''} • ${L.length} en cours ou en attente • ${done} terminé(s)</p>${L.map(card).join('') || '<p class="note">Aucun visiteur en attente.</p>'}</section>`;
    }).join('') || '<p>Aucune table configurée.</p>';
    /* alerte sonore : nouveau visiteur envoyé à la table suivie (ou à n’importe quelle table si « Toutes ») */
    const wIds = state.pros.filter((r) => r.etat === 'En attente' && (!sel || String(r.table) === sel)).map((r) => r.id + '|' + r.table + '|' + ((r.transfert && r.transfert.le) || ''));
    const key = sel || '*';
    if (state.agSeenKey !== key) { state.agSeenKey = key; state.agSeen = new Set(wIds); }
    else {
      const fresh = wIds.filter((x) => !state.agSeen.has(x));
      wIds.forEach((x) => state.agSeen.add(x));
      if (fresh.length) {
        if ($('#agSnd') && $('#agSnd').checked) { chime(); try { navigator.vibrate && navigator.vibrate([250, 120, 250]); } catch (e) { /* */ } }
        state.agFlash = new Set(fresh.map((x) => x.split('|')[0])); setTimeout(() => { state.agFlash = null; }, 8000);
        status(fresh.length > 1 ? fresh.length + ' nouveaux visiteurs pour vous.' : 'Nouveau visiteur pour vous : ' + nomCourt(state.pros.find((r) => r.id === fresh[0].split('|')[0]) || {}), 'ok');
      }
    }
    if (state.agFlash) state.agFlash.forEach((id) => { const c = $(`#agB [data-ag][data-id="${id}"]`); const card = c && c.closest('.agc'); if (card) card.classList.add('newv'); });
    if (!sel) $('#agB').insertAdjacentHTML('afterbegin', accHtml);
    else {
      const t = tOf(sel) || {}; const mine = state.pros.filter((r) => String(r.table) === String(sel) && String(r.at).slice(0, 10) === new Date().toISOString().slice(0, 10));
      const dn = mine.filter((r) => r.etat === 'Terminé'); const dur = dn.filter((r) => r.debut && r.fin).map((r) => (new Date(r.fin) - new Date(r.debut)) / 60000);
      const cap = capOf(t), occ = occOf(sel);
      const k = (v, l, c) => `<div class="agkpi ${c || ''}"><b>${v}</b><span>${l}</span></div>`;
      $('#agB').insertAdjacentHTML('afterbegin', `<section class="agkpis">${k(occ + (cap ? '/' + cap : ''), 'personnes en entretien', cap && occ >= cap ? 'full' : '')}${k(mine.filter((r) => r.etat === 'En attente').length, 'en attente')}${k(dn.length, 'terminés aujourd’hui')}${k(dn.filter((r) => r.inscription === 'Oui').length, 'inscrits au projet')}${k(dn.filter((r) => r.interet === 'Fort').length, 'intérêts forts')}${k(mine.filter((r) => r.transfert).length, 'transferts KAM')}${k(dur.length ? fr(dur.reduce((a, b) => a + b, 0) / dur.length, 0) + ' min' : '—', 'durée moyenne')}${(() => { const J = premixJour(); return k(fr(J.t, 1) + ' / ' + fr(J.obj, 0) + ' t', 'prémix MG2MIX simulé aujourd’hui (stand) • ' + fr(J.pct, 0) + ' % • ' + eurS(J.M.ca) + ' de CA potentiel', J.pct >= 100 ? 'ok' : ''); })()}<button type="button" id="agBil" class="agbil">Bilan de ma table</button></section>`);
      $('#agBil').addEventListener('click', () => tableBilan(sel));
      /* base des inscrits : chaque table coche le ou les visiteurs en face d’elle et valide */
      state.poolSel = state.poolSel || new Set(); const q = (state.poolQ || '').toLowerCase().trim();
      const day = new Date().toISOString().slice(0, 10);
      const pool = state.pros.filter((r) => r.etat === 'En attente' && String(r.at).slice(0, 10) === day)
        .filter((r) => !q || [r.nom, r.tel, r.localite, r.org].join(' ').toLowerCase().includes(q))
        .sort((a, b) => String((a.transfert && a.transfert.le) || a.at).localeCompare(String((b.transfert && b.transfert.le) || b.at)));
      /* groupes : même coopérative / association, ou même nom de famille et même localité inscrits à moins de 10 minutes d’écart */
      const fam = (r) => String(r.nom || '').trim().split(/\s+/)[0].toUpperCase();
      const grpOf = (r) => pool.filter((x) => (r.org && x.org && x.org.toLowerCase() === r.org.toLowerCase()) || (fam(x) === fam(r) && fam(r).length > 1 && (x.localite || '').toLowerCase() === (r.localite || '').toLowerCase() && Math.abs(new Date(x.at) - new Date(r.at)) <= 10 * 60000));
      const lim = +state.standCfg.rappelMin || 15;
      [...state.poolSel].forEach((id) => { if (!pool.some((r) => r.id === id) && !q) state.poolSel.delete(id); });
      const nSel = pool.filter((r) => state.poolSel.has(r.id)).reduce((a, r) => a + nbP(r), 0);
      $('.agkpis').insertAdjacentHTML('afterend', `<section class="agpool"><h3>Visiteurs inscrits en attente <small>${pool.length} • cochez le ou les visiteurs en face de vous puis validez</small></h3>
        <div class="agpb"><input id="poolQ" type="search" placeholder="Rechercher : nom, téléphone, localité…" value="${esc(state.poolQ || '')}">${state.poolSel.size ? '<button type="button" id="poolNone" class="alt">Tout décocher</button>' : ''}<button type="button" id="poolGo" ${nSel ? '' : 'disabled'}>✓ Je reçois ${nSel ? nSel + ' personne(s)' : 'les visiteurs cochés'} à la ${esc(tLab(sel))}</button></div>
        <div class="agpl">${pool.map((r) => `<label class="agpi ${state.poolSel.has(r.id) ? 'on' : ''}"><input type="checkbox" data-pool="${r.id}" ${state.poolSel.has(r.id) ? 'checked' : ''}><span><b>${esc(r.nom)}</b>${nbP(r) > 1 ? ` <em class="nbp">${nbP(r)} pers.</em>` : ''} <em class="wtm ${waitMin(r) >= lim ? 'late' : waitMin(r) >= 10 ? 'mid' : ''}">⏱ ${fr(waitMin(r), 0)} min</em><br><small>${esc(r.public || r.profil || '')} • ${esc(r.localite || '—')} • ${esc(activite(r))}</small><br><small>inscrit à ${String(r.date || '').slice(-5)} • ${String(r.table) === String(sel) ? '<b>votre table</b>' : esc(tLab(r.table))}</small>${(() => { const g = grpOf(r); return g.length > 1 ? `<br><button type="button" class="mini grp" data-grp="${g.map((x) => x.id).join(',')}">👥 Tout cocher pour ce groupe (${g.length}${r.org ? ' • ' + esc(r.org) : ' • famille ' + esc(fam(r))})</button>` : ''; })()}</span></label>`).join('') || '<p class="note">Aucun visiteur en attente' + (q ? ' pour cette recherche' : '') + '.</p>'}</div></section>`);
      $('#poolQ').addEventListener('input', (e) => { state.poolQ = e.target.value; const pos = e.target.selectionStart; renderAgents(); const i = $('#poolQ'); if (i) { i.focus(); try { i.setSelectionRange(pos, pos); } catch (er) { /* */ } } });
      $$('[data-pool]').forEach((c) => c.addEventListener('change', () => { if (c.checked) state.poolSel.add(c.dataset.pool); else state.poolSel.delete(c.dataset.pool); renderAgents(); }));
      $('#poolGo').addEventListener('click', () => poolTake(sel));
      if ($('#poolNone')) $('#poolNone').addEventListener('click', () => { state.poolSel.clear(); renderAgents(); });
      $$('[data-grp]').forEach((g) => g.addEventListener('click', (e) => { e.preventDefault(); e.stopPropagation(); g.dataset.grp.split(',').forEach((id) => state.poolSel.add(id)); renderAgents(); }));
    }
    $$('#agB [data-trm]').forEach((i) => i.addEventListener('input', () => { state.trMotif = state.trMotif || {}; state.trMotif[i.dataset.trm] = i.value; }));
    $$('#agB [data-ag]').forEach((b) => b.addEventListener('click', () => {
      const id = b.dataset.id;
      if (b.dataset.ag === 'start') {
        const r = state.pros.find((x) => x.id === id); const t = tOf(r && r.table) || {}; const cap = capOf(t);
        if (r && cap && occOf(t.n) + nbP(r) > cap) { status(`${tLab(t.n)} complète : ${cap} personnes au plus en entretien (${occOf(t.n)} déjà reçues${nbP(r) > 1 ? ', groupe de ' + nbP(r) : ''}). Terminez un entretien ou orientez vers la salle de conférence.`, 'err'); return; }
        prosUpdate(id, { etat: 'En entretien', debut: new Date().toISOString() }).then(() => { renderAgents(); renderAppel(); });
      } else if (b.dataset.ag === 'tr') transferTo(id, b.dataset.dk);
      else if (b.dataset.ag === 'servi') prosUpdate(id, { servi: new Date().toISOString() }).then(renderAgents);
      else if (b.dataset.ag === 'end') endInterview(id);
      else if (b.dataset.ag === 'sim') formulOpen(id);
      else editVisitor(id);
    }));
  }
  /* ---- fin d’entretien et remerciements ---- */
  function endInterview(id) {
    const r = state.pros.find((x) => x.id === id); if (!r) return;
    const b = modal('Terminer l’entretien : ' + r.nom, `<div class="vg"><label>Intérêt<select id="eInt">${['Fort', 'Moyen', 'Faible'].map((v) => `<option ${v === r.interet ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label>Inscription au projet<select id="eIns">${['Oui', 'À relancer', 'Non'].map((v) => `<option ${v === r.inscription ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label>Prochaine action<select id="eAct">${['Rappel', 'Visite terrain', 'Devis', 'Livraison prémix', 'Aucune'].map((v) => `<option ${v === r.action ? 'selected' : ''}>${v}</option>`).join('')}</select></label>
      <label>ATE de suivi<select id="eAte">${ATES.map((v) => `<option ${v === r.ate ? 'selected' : ''}>${v}</option>`).join('')}</select></label></div>
      <label class="w">Besoins et note de l’entretien<textarea id="eNote" rows="3">${esc(r.note)}</textarea></label>
      <label class="consent"><input type="checkbox" id="eMail" ${r.email ? 'checked' : 'disabled'}> Envoyer automatiquement l’e-mail de remerciement avec la présentation ${r.email ? '(' + esc(r.email) + ')' : '(pas d’e-mail renseigné)'}</label>
      <div class="mbar"><button type="button" id="eOk">Terminer et remercier</button></div>`);
    $('#eOk', b).addEventListener('click', async () => {
      const patch = { etat: 'Terminé', fin: new Date().toISOString(), interet: $('#eInt', b).value, inscription: $('#eIns', b).value, action: $('#eAct', b).value, ate: $('#eAte', b).value, note: $('#eNote', b).value.trim() };
      if (patch.inscription === 'Oui') patch.statut = 'Inscrit'; else if (patch.inscription === 'Non') patch.statut = 'Pas intéressé'; else patch.statut = 'À rappeler';
      await prosUpdate(id, patch); Object.assign(r, patch);
      let mailRes = '';
      if ($('#eMail', b).checked && r.email) { $('#eOk', b).disabled = true; $('#eOk', b).textContent = 'Envoi de l’e-mail…'; mailRes = await mailThanks(r); }
      const auto = await autoSend(r, fillMsg(state.standCfg.msgMerci, r, { mail: r.email && /envoy/.test(mailRes) ? '\n\nLa présentation du projet vous a été envoyée par e-mail (' + r.email + ').' : '' }), 'merci');
      thanksPanel(r, [mailRes, auto && auto.msg].filter(Boolean).join(' '));
    });
  }
  function thanksPanel(r, mailRes) {
    const txt = fillMsg(state.standCfg.msgMerci, r, { mail: r.email && /envoy/.test(mailRes) ? '\n\nLa présentation du projet vous a été envoyée par e-mail (' + r.email + ').' : '' });
    const b = modal('Remercier ' + r.nom, `${mailRes ? `<p class="${/(non envoy|impossible|Échec)/.test(mailRes) ? 'errm' : 'okm'}">${esc(mailRes)}</p>` : ''}
      <p>Envoyez le message de remerciement (préférence du visiteur : <b>${esc(r.contact)}</b>) :</p><pre class="msgp">${esc(txt)}</pre>
      <div class="mbar"><a class="bk-btn" href="${waLink(r.tel, txt)}" target="_blank" rel="noopener" data-th="WhatsApp">WhatsApp</a><a class="bk-btn alt" href="${smsLink(r.tel, txt)}" data-th="SMS">SMS</a>${r.email ? `<button type="button" id="thMail">${/envoy/.test(mailRes) ? 'Renvoyer l’e-mail' : 'Envoyer l’e-mail'}</button>` : ''}<button type="button" id="thClose">Fermer</button></div>`);
    $$('[data-th]', b).forEach((a) => a.addEventListener('click', () => prosUpdate(r.id, { msgMerci: a.dataset.th + ' ' + today().fr })));
    if ($('#thMail', b)) $('#thMail', b).addEventListener('click', async () => { const m = await mailThanks(r); thanksPanel(r, m); });
    $('#thClose', b).addEventListener('click', () => { modalClose(); renderAgents(); });
  }
  async function mailThanks(r) {
    if (!state.mcp) return 'E-mail non envoyé : Gmail n’est disponible que dans claude.ai.';
    try {
      const S = state.V.S; const decks = [];
      if (isElev(r) || !isProd(r)) decks.push(SKD.short.find((d) => d.short === 'eleveur'));
      if (isProd(r)) decks.push(SKD.short.find((d) => d.short === 'producteur'));
      const atts = [];
      for (const d of decks) {
        const fiche = await pdf(SKG.pdfFlyer(d, S, imgs));
        atts.push({ filename: 'SOLEVO_SISSE_KABA_Fiche_' + (d.short === 'eleveur' ? 'Eleveur' : 'Producteur') + '.pdf', bytes: fiche });
        const pres = await pdf(SKG.pdfDeck(d, S, imgs, { noNotes: true }));
        atts.push({ filename: 'SOLEVO_SISSE_KABA_Presentation_' + (d.short === 'eleveur' ? 'Eleveur' : 'Producteur') + '.pdf', bytes: pres });
      }
      let total = atts.reduce((a, x) => a + x.bytes.length, 0);
      let fileArgs = false; try { fileArgs = !!(await state.mcp.listTools()).fileArgs; } catch (e) { fileArgs = false; }
      if (!fileArgs && total > INLINE_LIMIT) { for (let i = atts.length - 1; i >= 0 && total > INLINE_LIMIT; i--) if (/Presentation/.test(atts[i].filename)) { total -= atts[i].bytes.length; atts.splice(i, 1); } }
      const txt = fillMsg(state.standCfg.msgMerci, r, { mail: '' });
      const html = '<div style="font-family:Arial,sans-serif;font-size:14px;color:#1d2433">' + esc(txt).replace(/\n/g, '<br>') +
        `<p style="margin-top:16px"><b>Ce que SISSÊ~KABA peut vous apporter :</b><br>${esc(activite(r))}${r.eco ? ' : environ ' + fr(r.eco / 1e6, 2) + ' M FCFA d’économies attendues par an sur le maïs' : ''}${r.gain ? ' : environ ' + fr(r.gain / 1e6, 2) + ' M FCFA de recettes en plus par an' : ''} (estimations, non garanties).</p>
        <p>Vous trouverez en pièces jointes la présentation du projet et la fiche SOLEVO.</p>
        <p style="color:#5b6476;font-size:12px">SOLEVO Côte d’Ivoire • FEED &amp; SEED • ${SOLEVO_TEL} • ${SOLEVO_MAIL}<br>Vous recevez ce message suite à votre inscription sur le stand SOLEVO au SELAB SHOW 2026.</p></div>`;
      const mk = (mode) => ({ to: [r.email], subject: 'SOLEVO Côte d’Ivoire – Merci pour votre visite et présentation SISSÊ~KABA', htmlBody: html,
        attachments: atts.map((a) => ({ filename: a.filename, mimeType: 'application/pdf', content: mode === 'file' ? { $file: { data: new Blob([a.bytes], { type: 'application/pdf' }), name: a.filename, type: 'application/pdf' } } : b64(a.bytes) })) });
      try { await state.mcp.callTool('Gmail', 'send_message', mk(fileArgs ? 'file' : 'inline')); }
      catch (e) { if (fileArgs && ['bad_request', 'capability_disabled', 'transform_error', 'capability_removed'].includes(e && e.code)) await state.mcp.callTool('Gmail', 'send_message', mk('inline')); else throw e; }
      await prosUpdate(r.id, { mailMerci: 'Envoyé ' + today().fr });
      return 'E-mail envoyé à ' + r.email + ' (' + atts.length + ' pièce(s) jointe(s)).';
    } catch (e) { console.error(e); await prosUpdate(r.id, { mailMerci: 'Échec' }); return 'E-mail non envoyé : ' + mailErr(e); }
  }
  /* ---- envoi automatique WhatsApp / SMS via Zapier (Smsmobileapi ou WhatsApp Business) ---- */
  const AUTO_PROV = {
    off: { n: 'Désactivé (envoi par clic)' },
    smsmobileapi: { n: 'Smsmobileapi (téléphone SOLEVO : WhatsApp et SMS)', api: 'App211674CLIAPI', wa: 'send_whatsapp', sms: 'send_sms', p: (to, m) => ({ recipients: to, message: m }) },
    wabusiness: { n: 'WhatsApp Business API (Meta)', api: 'App228834CLIAPI', wa: 'send_freeform_message', p: (to, m) => ({ recipient: to, message_text: m }) },
  };
  async function autoSend(r, txt, kind) {
    const c = state.standCfg; const P = AUTO_PROV[c.autoProv || 'off'];
    if (!P || !P.api || !(kind === 'table' ? c.autoTable : kind === 'rappel' ? c.rappelOn : kind === 'transfert' ? c.autoTransfert !== false : c.autoMerci)) return null;
    if (!state.mcp) return { ok: false, msg: 'envoi automatique indisponible hors de claude.ai' };
    const to = '+' + waNum(r.tel);
    const order = r.contact === 'SMS' && P.sms ? ['sms', 'wa'] : ['wa', 'sms'];
    let last = '';
    for (const ch of order) {
      if (!P[ch]) continue;
      try {
        await state.mcp.callTool('Zapier', 'execute_zapier_write_action', { selected_api: P.api, action: P[ch], params: P.p(to, txt) });
        const lab = (ch === 'wa' ? 'WhatsApp' : 'SMS') + ' auto ' + today().fr;
        await prosUpdate(r.id, kind === 'table' ? { msgTable: lab } : kind === 'rappel' ? { rappel: lab } : kind === 'transfert' ? { msgTransfert: lab } : { msgMerci: lab });
        return { ok: true, msg: 'Message envoyé automatiquement par ' + (ch === 'wa' ? 'WhatsApp' : 'SMS') + '.' };
      } catch (e) { console.error(e); last = (e && (e.message || e.code)) || 'erreur'; }
    }
    await prosUpdate(r.id, kind === 'table' ? { msgTable: 'Échec auto' } : kind === 'rappel' ? { rappel: 'Échec auto' } : kind === 'transfert' ? { msgTransfert: 'Échec auto' } : { msgMerci: 'Échec auto' });
    return { ok: false, msg: 'Envoi automatique impossible (' + String(last).slice(0, 80) + ') : utilisez les boutons ci-dessous.' };
  }
  async function sendTel(tel, txt) {
    const c = state.standCfg; const P = AUTO_PROV[c.autoProv || 'off'];
    if (!P || !P.api || !state.mcp) return { ok: false, msg: 'envoi automatique non branché' };
    let last = '';
    for (const ch of ['wa', 'sms']) {
      if (!P[ch]) continue;
      try { await state.mcp.callTool('Zapier', 'execute_zapier_write_action', { selected_api: P.api, action: P[ch], params: P.p('+' + waNum(tel), txt) }); return { ok: true, ch: ch === 'wa' ? 'WhatsApp' : 'SMS' }; }
      catch (e) { console.error(e); last = (e && (e.message || e.code)) || 'erreur'; }
    }
    return { ok: false, msg: String(last).slice(0, 80) };
  }
  /* ---- écran d’appel (2e écran du stand) ---- */
  const nomCourt = (r) => { const p = prenom(r); const w = String(r.nom || '').trim().split(/\s+/); const fam = w.find((x) => !p.split(' ').includes(x)) || ''; return (p || w[0] || '') + (fam ? ' ' + fam[0].toUpperCase() + '.' : ''); };
  state.appelSeen = {};
  function appelOpen() { const a = $('#appel'); a.hidden = false; if (a.requestFullscreen) a.requestFullscreen().catch(() => {}); renderAppel(true); }
  function chime() { try { const A = new (window.AudioContext || window.webkitAudioContext)(); [660, 880].forEach((f, i) => { const o = A.createOscillator(), g = A.createGain(); o.frequency.value = f; o.connect(g); g.connect(A.destination); g.gain.setValueAtTime(0.25, A.currentTime + i * 0.35); g.gain.exponentialRampToValueAtTime(0.001, A.currentTime + i * 0.35 + 0.6); o.start(A.currentTime + i * 0.35); o.stop(A.currentTime + i * 0.35 + 0.65); }); } catch (e) { /* */ } }
  /* durée moyenne d’entretien de la table aujourd’hui (20 min par défaut) */
  function durTable(n) { const day = new Date().toISOString().slice(0, 10); const d = state.pros.filter((r) => String(r.table) === String(n) && r.debut && r.fin && String(r.at).slice(0, 10) === day).map((r) => (new Date(r.fin) - new Date(r.debut)) / 60000).filter((x) => x > 0 && x < 180); return d.length ? d.reduce((a, b) => a + b, 0) / d.length : 20; }
  /* jauge du prémix MG2MIX simulé aujourd’hui (t/an potentielles) face à l’objectif du jour */
  function premixJour() {
    const day = new Date().toISOString().slice(0, 10); const M = simuStats(state.pros.filter((r) => String(r.at).slice(0, 10) === day && !r.test));
    const obj = +state.standCfg.objPremix > 0 ? +state.standCfg.objPremix : 10; const t = M.tC + M.tP;
    return { M, obj, t, pct: Math.min(100, obj ? t / obj * 100 : 0) };
  }
  function renderAppel(first) {
    if (!$('#appel') || $('#appel').hidden) return;
    { const J = premixJour(); const g = $('#apGauge'); if (g) g.innerHTML = `<b>${fr(J.t, 1)} t</b> de prémix MG2MIX simulées aujourd’hui<span class="apg"><i style="width:${fr(J.pct, 0).replace(/\s/g, '')}%"></i></span><em>objectif ${fr(J.obj, 0)} t • ${J.M.n} simulation(s)</em>`; }
    const T = state.standCfg.tables || []; let fresh = false;
    $('#appelB').classList.toggle('many', T.length > 6);
    const est = (t) => { const w = state.pros.filter((r) => String(r.table) === String(t.n) && r.etat === 'En attente'); const cap = capOf(t) || 4; const pw = w.reduce((a, r) => a + nbP(r), 0); const free = Math.max(0, cap - occOf(t.n));
      const avgW = w.length ? w.reduce((a, r) => a + waitMin(r), 0) / w.length : 0; const dur = durTable(t.n); return { n: w.length, avgW, wait: Math.max(0, Math.ceil((pw - free) / cap)) * dur, free }; };
    const std = T.filter((t) => !/^Grands/.test(t.pour || '') && !/^Salle/i.test(t.lieu || ''));
    const best = std.slice().sort((a, b) => est(a).wait - est(b).wait || est(a).n - est(b).n || a.n - b.n)[0];
    $('#appelB').innerHTML = T.map((t) => {
      const cur = state.pros.filter((r) => String(r.table) === String(t.n) && r.etat === 'En entretien').sort((a, b) => String(b.debut).localeCompare(String(a.debut)))[0];
      const wait = state.pros.filter((r) => String(r.table) === String(t.n) && r.etat === 'En attente').sort((a, b) => a.at.localeCompare(b.at));
      const isNew = cur && !state.appelSeen[cur.id + cur.debut]; if (isNew) { state.appelSeen[cur.id + cur.debut] = 1; if (!first) fresh = true; }
      return `<section class="ap-t ${isNew && !first ? 'flash' : ''} ${/^Grands/.test(t.pour || '') ? 'kam' : ''}"><h2>${esc(/^Table/i.test(tLab(t.n)) ? tLab(t.n).toUpperCase() : tLab(t.n))}</h2><p class="ap-ag">${esc(t.agent)}${capOf(t) ? ` • <span class="ap-cap">${occOf(t.n)}/${capOf(t)}</span>` : ''}</p>${(() => { const e = est(t); return `<p class="ap-w">${e.n ? `${e.n} en attente • attente moy. <b>${fr(e.avgW, 0)} min</b>` : 'Aucune attente'}${e.wait ? ` • prochain créneau ≈ ${fr(e.wait, 0)} min` : ''}</p>${best && best.n === t.n ? '<p class="ap-best">★ Table la plus libre</p>' : ''}`; })()}
        ${cur ? `<div class="ap-cur"><span>C’est à vous</span><b>${esc(nomCourt(cur))}</b></div>` : '<div class="ap-cur idle"><span>Table libre</span><b>—</b></div>'}
        <div class="ap-next"><span>Ensuite</span>${wait.slice(0, 3).map((r, i) => `<p>${i + 1}. ${esc(nomCourt(r))}</p>`).join('') || '<p class="muted">Personne en attente</p>'}${wait.length > 3 ? `<p class="muted">+ ${wait.length - 3} autre(s)</p>` : ''}</div></section>`;
    }).join('');
    if (fresh) chime();
  }
  /* ---- bilan de la journée ---- */
  function bilanData(dayIso) {
    const L = state.pros.filter((r) => String(r.at).slice(0, 10) === dayIso && (!r.test || state.bilanTest));
    const by = (k) => L.reduce((m, r) => { const v = r[k] || '—'; m[v] = (m[v] || 0) + 1; return m; }, {});
    const mins = (a, b) => (a && b ? (new Date(b) - new Date(a)) / 60000 : null);
    const avg = (arr) => { const v = arr.filter((x) => x != null && isFinite(x) && x >= 0); return v.length ? v.reduce((s, x) => s + x, 0) / v.length : null; };
    return { L, n: L.length, profil: by('public'), source: by('source'), etat: by('etat'), insc: by('inscription'), interet: by('interet'), loc: by('localite'),
      tables: (state.standCfg.tables || []).map((t) => ({ t, n: L.filter((r) => String(r.table) === String(t.n)).length, fin: L.filter((r) => String(r.table) === String(t.n) && r.etat === 'Terminé').length })),
      attente: avg(L.map((r) => mins(r.at, r.debut))), duree: avg(L.map((r) => mins(r.debut, r.fin))),
      maxW: L.map((r) => ({ r, m: r.debut ? mins((r.transfert && r.transfert.le) || r.at, r.debut) : (r.etat === 'En attente' && dayIso === new Date().toISOString().slice(0, 10) ? waitMin(r) : null) })).filter((x) => x.m != null && x.m >= 0).sort((a, b) => b.m - a.m)[0] || null,
      attT: (state.standCfg.tables || []).map((t) => ({ t, a: avg(L.filter((r) => String(r.table) === String(t.n)).map((r) => mins(r.at, r.debut))) })).filter((x) => x.a != null),
      mails: L.filter((r) => /Envoy/.test(r.mailMerci || '')).length, eau: L.filter((r) => (r.accueil || []).includes('Eau')).reduce((a, r) => a + nbP(r), 0), cafe: L.filter((r) => (r.accueil || []).includes('Café')).reduce((a, r) => a + nbP(r), 0), deleg: L.filter(isDeleg).length, transf: L.filter((r) => r.transfert).length, transfIns: L.filter((r) => r.transfert && r.inscription === 'Oui').length, pers: L.reduce((a, r) => a + nbP(r), 0), merci: L.filter((r) => r.msgMerci).length,
      forts: L.filter((r) => r.interet === 'Fort' || r.inscription === 'Oui'), relance: L.filter((r) => r.statut === 'À rappeler' && r.etat === 'Terminé') };
  }
  function bilanHtml(dayIso) {
    const B = bilanData(dayIso); const d = dayIso.split('-').reverse().join('/');
    const li = (o) => Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<li>${esc(k)} : <b>${v}</b></li>`).join('');
    const row = (r) => `<tr><td>${esc(r.nom)}</td><td>${esc(r.public)}</td><td>${esc(r.localite)}</td><td>${esc(activite(r))}</td><td>${esc(r.tel)}</td><td>${esc(r.interet || '')}</td><td>${esc(r.inscription || '')}</td><td>${esc(r.ate || '')}</td><td>${esc(r.note || '')}</td></tr>`;
    const tb = (L) => L.length ? `<table cellpadding="5" style="border-collapse:collapse;font-size:12px" border="1"><tr style="background:#37A028;color:#fff"><th>Nom</th><th>Profil</th><th>Localité</th><th>Activité</th><th>Téléphone</th><th>Intérêt</th><th>Inscription</th><th>ATE</th><th>Note</th></tr>${L.map(row).join('')}</table>` : '<p>Aucun.</p>';
    const m = (x) => (x == null ? 'n.d.' : fr(x, 0) + ' min');
    return `<div style="font-family:Arial,sans-serif;color:#1d2433;font-size:14px"><h2 style="color:#002060;margin:0">Bilan du stand SOLEVO – ${d}</h2><p style="color:#5b6476;margin:4px 0 14px">SELAB SHOW 2026 • programme SISSÊ~KABA</p>
      <table cellpadding="8" style="border-collapse:collapse;margin-bottom:12px"><tr>${[[B.n, 'visiteurs inscrits'], [B.etat['Terminé'] || 0, 'entretiens terminés'], [B.etat['En attente'] || 0, 'encore en attente'], [B.insc['Oui'] || 0, 'inscrits au projet'], [B.interet['Fort'] || 0, 'intérêts forts'], [B.mails, 'e-mails de présentation envoyés']].map(([v, l]) => `<td style="background:#F4F7FB;border-top:3px solid #37A028;text-align:center"><b style="font-size:22px;color:#0B5FA1">${v}</b><br><span style="font-size:12px">${l}</span></td>`).join('')}</tr></table>
      <p>Attente moyenne avant entretien : <b>${m(B.attente)}</b> • durée moyenne d’entretien : <b>${m(B.duree)}</b> • remerciements WhatsApp/SMS : <b>${B.merci}</b></p>
      <p>Délai d’attente le plus long : <b>${B.maxW ? fr(B.maxW.m, 0) + ' min' : 'n.d.'}</b>${B.maxW ? ` (${esc(B.maxW.r.nom)}, ${esc(tLab(B.maxW.r.table))}${B.maxW.r.debut ? '' : ', toujours en attente'})` : ''}${B.attT.length ? ' • attente moyenne par table : ' + B.attT.sort((a, b) => b.a - a.a).map((x) => esc(tLab(x.t.n)) + ' ' + fr(x.a, 0) + ' min').join(', ') : ''}</p>
      <p>Personnes reçues : <b>${B.pers}</b> dont <b>${B.deleg}</b> délégation(s) ou association(s) en salle de conférence • <b>${B.transf}</b> transfert(s) vers les Key Account Managers (dont <b>${B.transfIns}</b> inscrit(s) au projet) • accueil : <b>${B.eau}</b> bouteille(s) d’eau et <b>${B.cafe}</b> café(s) offerts</p>
      <table cellpadding="6"><tr valign="top"><td><b>Par profil</b><ul>${li(B.profil)}</ul></td><td><b>Par mode d’inscription</b><ul>${li(B.source)}</ul></td><td><b>Localités</b><ul>${li(B.loc)}</ul></td><td><b>Par table</b><ul>${B.tables.map((x) => `<li>${esc(tLab(x.t.n))} (${esc(x.t.agent)}) : <b>${x.n}</b> dont ${x.fin} terminés</li>`).join('')}</ul></td></tr></table>
      ${simuHtml(simuStats(B.L))}
      <h3 style="color:#002060">Intérêts forts et inscriptions au projet (${B.forts.length})</h3>${tb(B.forts)}
      <h3 style="color:#002060">À rappeler par les ATE (${B.relance.length})</h3>${tb(B.relance)}
      <p style="color:#5b6476;font-size:12px;margin-top:16px">Liste complète : simulateur SISSÊ~KABA, onglet Stand, « Exporter la liste (Excel) ». Données personnelles à usage interne SOLEVO Côte d’Ivoire.</p></div>`;
  }
  async function bilanSend(dayIso) {
    dayIso = dayIso || new Date().toISOString().slice(0, 10);
    const to = (state.standCfg.bilanTo || CFG_DEFAULT.bilanTo).split(/[,;\s]+/).filter((x) => /@/.test(x));
    if (!state.mcp) { status('Envoi du bilan disponible seulement dans claude.ai avec Gmail connecté.', 'err'); return; }
    try {
      const B = bilanData(dayIso);
      const rows = B.L.map((r) => [r.date, r.source, r.public, r.nom, r.tel, r.email, r.localite, r.depot, activite(r), (r.prios || []).join(', '), tLab(r.table), r.agent, r.etat, r.interet, r.inscription, r.action, r.ate, r.statut, r.note]);
      const x = await SKG.xlsxTable(JSZip, 'Visiteurs ' + dayIso, ['Date', 'Source', 'Profil', 'Nom', 'Téléphone', 'E-mail', 'Localité', 'Dépôt', 'Activité', 'Priorités', 'Table', 'Agent', 'Entretien', 'Intérêt', 'Inscription', 'Action', 'ATE', 'Statut', 'Note'], rows, [16, 14, 16, 24, 15, 24, 15, 14, 30, 30, 6, 22, 12, 9, 11, 14, 22, 12, 30]);
      const name = 'SISSE_KABA_Bilan_stand_' + dayIso + '.xlsx';
      await state.mcp.callTool('Gmail', 'send_message', { to, subject: 'SISSÊ~KABA – Bilan du stand SOLEVO du ' + dayIso.split('-').reverse().join('/'), htmlBody: bilanHtml(dayIso),
        attachments: [{ filename: name, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', content: b64(x) }] });
      status('Bilan du ' + dayIso.split('-').reverse().join('/') + ' envoyé à ' + to.join(', ') + '.', 'ok');
      state.standCfg.bilanLast = dayIso; await cfgSave();
    } catch (e) { console.error(e); status('Bilan non envoyé : ' + mailErr(e), 'err'); }
  }
  function bilanOpen() {
    const day = new Date().toISOString().slice(0, 10);
    const b = modal('Bilan de la journée', `<div class="vg"><label>Journée<input type="date" id="bjDay" value="${day}"></label><label>Destinataires<input id="bjTo" value="${esc(state.standCfg.bilanTo || CFG_DEFAULT.bilanTo)}"></label></div>
       <label class="consent"><input type="checkbox" id="bjTest" ${state.bilanTest ? 'checked' : ''}> Inclure les inscriptions de répétition (test)</label>
      <label class="consent"><input type="checkbox" id="bjAuto" ${state.standCfg.bilanAuto ? 'checked' : ''}> Envoyer automatiquement le bilan du jour à <input id="bjHour" type="time" value="${esc(state.standCfg.bilanHour || '19:00')}" style="width:auto"> quand ce simulateur est ouvert (borne, écran d’appel ou vue des tables)</label>
      <div class="mbar"><button type="button" id="bjPrev">Aperçu</button><button type="button" id="bjSend">Envoyer maintenant</button><button type="button" id="bjSave">Enregistrer les réglages</button></div><div id="bjOut" class="bjout"></div>`, true);
    $('#bjTest', b).addEventListener('change', () => { state.bilanTest = $('#bjTest', b).checked; });
    const keep = () => { state.standCfg.bilanTo = $('#bjTo', b).value; state.standCfg.bilanAuto = $('#bjAuto', b).checked; state.standCfg.bilanHour = $('#bjHour', b).value || '19:00'; };
    $('#bjPrev', b).addEventListener('click', () => { $('#bjOut', b).innerHTML = bilanHtml($('#bjDay', b).value); });
    $('#bjSend', b).addEventListener('click', async () => { keep(); await bilanSend($('#bjDay', b).value); });
    $('#bjSave', b).addEventListener('click', async () => { keep(); await cfgSave(); status('Réglages du bilan enregistrés.', 'ok'); modalClose(); });
  }
  /* envoi automatique du bilan à l’heure choisie (si le simulateur est ouvert) */
  setInterval(() => {
    const c = state.standCfg; if (!c || !c.bilanAuto || !state.mcp) return;
    const now = new Date(); const day = now.toISOString().slice(0, 10);
    const [h, m] = String(c.bilanHour || '19:00').split(':').map(Number);
    if (c.bilanLast === day || now.getHours() * 60 + now.getMinutes() < h * 60 + m) return;
    if (!state.pros.some((r) => String(r.at).slice(0, 10) === day)) return;
    c.bilanLast = day; bilanSend(day);
  }, 60000);
  /* ---- lecture des réponses WhatsApp / SMS (Smsmobileapi) : « OUI » = inscrit au projet ---- */
  const OUI_RE = /^\s*(oui|yes|ok|okay|d'?accord|je\s+m'?inscris|inscri(s|ption)|partant)\b/i;
  function flatRecords(x, out) {
    out = out || [];
    if (Array.isArray(x)) x.forEach((y) => flatRecords(y, out));
    else if (x && typeof x === 'object') {
      const vals = Object.values(x); const prim = vals.filter((v) => v == null || typeof v !== 'object');
      if (prim.length >= 2) out.push(x);
      vals.filter((v) => v && typeof v === 'object').forEach((v) => flatRecords(v, out));
    } else if (typeof x === 'string') { try { const j = JSON.parse(x); if (j && typeof j === 'object') flatRecords(j, out); } catch (e) { /* */ } }
    return out;
  }
  function replyOf(rec) {
    let tel = '', txt = '', when = '';
    for (const [k, v] of Object.entries(rec)) {
      if (v == null || typeof v === 'object') continue; const s = String(v);
      if (!tel && /(from|sender|phone|number|numero|contact|originator|author|remote)/i.test(k) && s.replace(/\D/g, '').length >= 8) tel = s;
      if (!txt && /(message|body|text|content|sms|msg)/i.test(k) && !/(id|type|status)$/i.test(k)) txt = s;
      if (!when && /(date|time|received|created|timestamp)/i.test(k)) when = s;
    }
    return tel && txt ? { tel, txt: txt.trim(), when } : null;
  }
  async function checkReplies(manual) {
    const c = state.standCfg; const P = AUTO_PROV[c.autoProv || 'off'];
    if (!P || c.autoProv !== 'smsmobileapi' || !state.mcp) { if (manual) status('Lecture des réponses : choisissez Smsmobileapi dans « ⚙ Tables, agents et messages » (claude.ai uniquement).', 'err'); return; }
    let n = 0, seen = 0, nf = 0;
    for (const action of ['new_whatsapp', 'new_sms']) {
      try {
        const res = await state.mcp.callTool('Zapier', 'execute_zapier_read_action', { selected_api: P.api, action, params: {} });
        const recs = flatRecords(res && (res.payload !== undefined ? res.payload : res));
        for (const rec of recs) {
          const rp = replyOf(rec); if (!rp) continue; seen++;
          if (CR_RE.test(rp.txt)) {
            const key = 'cr:' + waNum(rp.tel) + ':' + rp.txt.length + ':' + rp.txt.slice(-40);
            if ((c.crSeen || []).includes(key)) continue;
            await applyCR(rp.txt); c.crSeen = (c.crSeen || []).concat([key]).slice(-500); nf++; continue;
          }
          if (FICHE_RE.test(rp.txt)) {
            const key = waNum(rp.tel) + ':' + rp.txt.length + ':' + rp.txt.slice(-40);
            if (state.pros.some((x) => x.waKey === key)) continue;
            const nr = parseFiche(rp.txt); nr.waKey = key; if (!nr.tel) nr.tel = rp.tel; nr.source = 'QR fiche (auto)';
            assignTable(nr); await prosPut(nr); nf++; simuAuto(nr);
            if (c.autoTable) await autoSend(nr, fillMsg(c.msgTable, nr), 'table');
            continue;
          }
          const k8 = waNum(rp.tel).slice(-8);
          const r = state.pros.find((x) => waNum(x.tel).slice(-8) === k8); if (!r) continue;
          const lab = (action === 'new_whatsapp' ? 'WhatsApp' : 'SMS') + ' : « ' + rp.txt.slice(0, 80) + ' »';
          if (OUI_RE.test(rp.txt) && r.inscription !== 'Oui') {
            await prosUpdate(r.id, { inscription: 'Oui', statut: 'Inscrit', reponse: lab, note: ((r.note || '') + ' • Inscrit au projet par réponse ' + lab + ' le ' + today().fr).trim() }); n++;
          } else if (r.reponse !== lab && !OUI_RE.test(rp.txt)) await prosUpdate(r.id, { reponse: lab });
        }
      } catch (e) { console.error(e); if (manual) status('Lecture des réponses impossible (' + ((e && (e.message || e.code)) || 'erreur') + ').', 'err'); return; }
    }
    c.repliesLast = new Date().toISOString();
    if (manual || n || nf) status(`Réponses lues : ${seen} message(s), ${nf} fiche(s) d’inscription importée(s), ${n} nouvel(le)(s) inscription(s) au projet.`, 'ok');
  }
  setInterval(() => { const c = state.standCfg; if (c && c.autoReplies && c.autoProv === 'smsmobileapi') checkReplies(false); }, 3 * 60000);
  /* ---- rappel automatique si le visiteur attend depuis trop longtemps ---- */
  const waitMin = (r) => (Date.now() - new Date((r.transfert && r.transfert.le) || r.at).getTime()) / 60000;
  setInterval(async () => {
    const c = state.standCfg; if (!c || !c.rappelOn) return;
    const lim = +c.rappelMin || 15;
    for (const r of state.pros.filter((x) => x.etat === 'En attente' && !x.rappel && waitMin(x) >= lim)) {
      await prosUpdate(r.id, { rappel: 'À envoyer ' + new Date().toISOString() });
      const res = await autoSend(r, fillMsg(c.msgRappel || CFG_DEFAULT.msgRappel, r), 'rappel');
      if (!res || !res.ok) await prosUpdate(r.id, { rappel: 'À faire (manuel)' });
    }
    renderAgents();
  }, 60000);
  /* ---- rapport final du salon (synthèse des jours + plan de relance par ATE) ---- */
  const DAY_MS = 86400000;
  function relancePlan(L, ref) {
    const base = new Date((ref || new Date().toISOString().slice(0, 10)) + 'T12:00:00Z').getTime();
    const ech = (j) => new Date(base + j * DAY_MS).toISOString().slice(0, 10).split('-').reverse().join('/');
    return L.filter((r) => r.statut !== 'Pas intéressé' && r.inscription !== 'Non').map((r) => {
      let p, j, act;
      if (r.inscription === 'Oui' || r.interet === 'Fort' || r.transfert || isDeleg(r)) { p = 'P1'; j = 2; act = r.action && r.action !== 'Aucune' ? r.action : 'Appel puis visite terrain'; }
      else if (r.interet === 'Moyen' || r.inscription === 'À relancer' || r.etat !== 'Terminé') { p = 'P2'; j = 7; act = r.etat !== 'Terminé' ? 'Appel (entretien non réalisé au stand)' : (r.action && r.action !== 'Aucune' ? r.action : 'Appel de relance'); }
      else { p = 'P3'; j = 14; act = 'Message WhatsApp puis appel'; }
      const kamOf = () => { const k = r.transfert ? (r.transfert.dk || (/FEED/.test(r.transfert.vers) ? 'feed' : /SEED/.test(r.transfert.vers) ? 'seed' : 'salle')) : ''; const kk = k === 'feed' || r.kam === KAMS[0] ? KAMS[0] : k === 'seed' || r.kam === KAMS[1] ? KAMS[1] : KAMS[2]; return kk === KAMS[0] ? TM.lehito.court : kk === KAMS[1] ? TM.agohi.court : TM.lehito.court + ' et ' + TM.agohi.court; };
      const ate = r.transfert || isDeleg(r) ? kamOf() : r.ate && r.ate !== 'À attribuer' ? r.ate : (isProd(r) && !isElev(r) ? TM.koffi.nom : (ATE_BY_DEP[r.depot] || 'À attribuer'));
      return { r, p, ech: ech(j), act, ate };
    }).sort((a, b) => a.ate.localeCompare(b.ate) || a.p.localeCompare(b.p) || String(a.r.at).localeCompare(String(b.r.at)));
  }
  function daysBetween(a, b) { const out = []; for (let t = new Date(a + 'T00:00:00Z').getTime(); t <= new Date(b + 'T00:00:00Z').getTime(); t += DAY_MS) out.push(new Date(t).toISOString().slice(0, 10)); return out; }
  /* efficacité des transferts vers les Key Account Managers */
  function transfStats(L) {
    const pct = (a, b) => (b ? Math.round((a / b) * 1000) / 10 : null);
    const grp = (A) => { const ins = A.filter((r) => r.inscription === 'Oui').length; const fort = A.filter((r) => r.interet === 'Fort').length; const fin = A.filter((r) => r.etat === 'Terminé').length; return { n: A.length, ins, fort, fin, taux: pct(ins, A.length), tauxFort: pct(fort, A.length) }; };
    const T = L.filter((r) => r.transfert), N = L.filter((r) => !r.transfert);
    const dests = [['KAM FEED (Elvis LEHITO)', 'feed'], ['KAM SEED (Arnaud AGOHI)', 'seed'], ['Salle de conférence', 'salle']].map(([lab, k]) => Object.assign({ lab }, grp(T.filter((r) => (r.transfert.dk || (/FEED/.test(r.transfert.vers) ? 'feed' : /SEED/.test(r.transfert.vers) ? 'seed' : 'salle')) === k))));
    const from = [...new Set(T.map((r) => r.transfert.de))].map((de) => Object.assign({ lab: de }, grp(T.filter((r) => r.transfert.de === de))));
    const all = grp(T), non = grp(N);
    return { all, non, dests, from, ecart: all.taux != null && non.taux != null ? Math.round((all.taux - non.taux) * 10) / 10 : null, prevenus: T.filter((r) => r.kamPrevenu && !/^À prévenir/.test(r.kamPrevenu)).length, list: T };
  }
  /* prémix MG2MIX annuel (kg) pour les élevages simulés du visiteur */
  function simuAn(R, sps, prix) {
    const P = Object.assign({ pxChair: 1500, pxPonte: 1400 }, Object.fromEntries(Object.entries(prix || {}).filter(([, v]) => +v > 0)));
    let c = 0, p = 0;
    if (sps.includes('chair')) c += R.chair.premix.chair * (R.chair.bandes || 6);
    if (sps.includes('ponte')) { const k = 365 / (R.ponte.duree || 546); c += R.ponte.premix.chair * k; p += R.ponte.premix.ponte * k; }
    return { c, p, ca: c * P.pxChair + p * P.pxPonte, sps };
  }
  /* simulations MG2MIX : entonnoir et volume potentiel de prémix */
  function simuStats(L) {
    const S = L.filter((r) => r.simu);
    const an = (r) => { const m = r.simu, i = m.inp || {}; if (m.an) return m.an; const pc = m.premixC != null ? m.premixC : (m.sp === 'chair' ? m.premixKg : 0), pp = m.premixP != null ? m.premixP : (m.sp === 'ponte' ? m.premixKg : 0);
      const k = m.sp === 'chair' ? (+((i.chair || {}).bandes) || 6) : 365 / 546; const P = Object.assign({ pxChair: 1500, pxPonte: 1400 }, Object.fromEntries(Object.entries(i.prix || {}).filter(([, v]) => +v > 0)));
      return { c: pc * k, p: pp * k, ca: (pc * k) * P.pxChair + (pp * k) * P.pxPonte }; };
    const rows = S.map((r) => Object.assign({ r }, an(r)));
    const sum = (f, A) => (A || rows).reduce((a, x) => a + f(x), 0);
    const val = rows.filter((x) => x.r.simu.valide), ins = (A) => A.filter((x) => x.r.inscription === 'Oui').length;
    const sansSimu = L.filter((r) => !r.simu);
    return { veille: L.filter((r) => r.veille && Object.keys(r.veille).some((k) => +r.veille[k] > 0)).length, n: rows.length, auto: L.filter((r) => /✓/.test(r.simuAuto || '')).length,
      valide: val.length, chair: rows.filter((x) => x.r.simu.sp === 'chair').length, ponte: rows.filter((x) => x.r.simu.sp === 'ponte').length,
      tC: sum((x) => x.c) / 1000, tP: sum((x) => x.p) / 1000, ca: sum((x) => x.ca), caVal: sum((x) => x.ca, val), tVal: sum((x) => x.c + x.p, val) / 1000,
      insVal: ins(val), tauxVal: val.length ? ins(val) / val.length * 100 : null, tauxSans: sansSimu.length ? sansSimu.filter((r) => r.inscription === 'Oui').length / sansSimu.length * 100 : null, rows };
  }
  function simuHtml(M) {
    if (!M.n) return '<h3 style="color:#002060">Simulations MG2MIX</h3><p>Aucune simulation enregistrée sur la période.</p>';
    const p = (x) => (x == null ? 'n.d.' : fr(x, 1) + ' %'); const e = (x) => fr(x) + ' FCFA (' + eurS(x) + ')';
    return `<h3 style="color:#002060">Simulations MG2MIX et volume potentiel de prémix</h3>
      <p>${M.veille} visiteur(s) ont donné leur veille des prix → <b>${M.n}</b> simulation(s) (${M.chair} chair, ${M.ponte} pondeuses) → ${M.auto} envoyée(s) automatiquement → <b>${M.valide}</b> validée(s) en entretien.</p>
      <table cellpadding="6" border="1" style="border-collapse:collapse;font-size:13px"><tr style="background:#37A028;color:#fff"><th>Indicateur</th><th>Toutes les simulations</th><th>Simulations validées</th></tr>
      <tr><td>Prémix MG2MIX potentiel / an</td><td><b>${fr(M.tC + M.tP, 1)} t</b> (chair ${fr(M.tC, 1)} t • ponte ${fr(M.tP, 1)} t)</td><td><b>${fr(M.tVal, 1)} t</b></td></tr>
      <tr><td>CA prémix potentiel / an (prix des visiteurs ou de référence)</td><td><b>${e(M.ca)}</b></td><td><b>${e(M.caVal)}</b></td></tr>
      <tr><td>Taux d’inscription au projet</td><td colspan="2">${p(M.tauxVal)} avec simulation validée, contre ${p(M.tauxSans)} sans simulation</td></tr></table>
      <p style="font-size:12px;color:#5b6476">Volume annuel = prémix d’une bande × bandes/an (chair) ou d’un cycle ramené à 365 jours (pondeuses). Potentiel commercial, pas un engagement d’achat.</p>`;
  }
  function finalData(from, to) {
    const days = daysBetween(from, to);
    const L = state.pros.filter((r) => days.includes(String(r.at).slice(0, 10)) && !r.test);
    const per = days.map((d) => { const B = bilanData(d); return { d, B }; });
    return { days, L, per, plan: relancePlan(L, to), tr: transfStats(L), simu: simuStats(L) };
  }
  async function finalBook(F) {
    const fd = (d) => d.split('-').reverse().join('/');
    const ind = (B) => [B.n, B.profil['Éleveur'] || 0, B.profil['Producteur'] || 0, B.profil['Éleveur et producteur'] || 0, B.etat['Terminé'] || 0, B.insc['Oui'] || 0, B.interet['Fort'] || 0, B.mails, B.attente == null ? '' : Math.round(B.attente), B.duree == null ? '' : Math.round(B.duree)];
    const sumRow = F.per.reduce((acc, x) => ind(x.B).map((v, i) => (i < 8 ? (acc[i] || 0) + (+v || 0) : '')), []);
    const synth = F.per.map((x) => [fd(x.d)].concat(ind(x.B))).concat([['Total'].concat(sumRow)]);
    const vis = F.L.map((r) => [r.date, r.source, r.public, r.nom, r.tel, r.email, r.localite, r.depot, activite(r), (r.prios || []).join(', '), tLab(r.table), r.agent, r.etat, r.interet, r.inscription, r.action, r.ate, r.statut, r.reponse || '', r.note]);
    const planRow = (x) => [x.ate, x.p, x.ech, x.r.nom, x.r.tel, x.r.public, x.r.localite, x.r.depot, activite(x.r), (x.r.prios || []).join(', '), x.r.interet || '', x.r.inscription || '', x.act, x.r.note || '', ''];
    const planHead = ['ATE', 'Priorité', 'Échéance', 'Nom', 'Téléphone', 'Profil', 'Localité', 'Dépôt', 'Activité', 'Priorités du visiteur', 'Intérêt', 'Inscription projet', 'Action prévue', 'Note du stand', 'Compte rendu de la relance'];
    const pw = [22, 8, 11, 24, 15, 16, 14, 14, 30, 28, 9, 12, 26, 32, 30];
    const sheets = [
      { name: 'Synthèse', head: ['Journée', 'Visiteurs', 'Éleveurs', 'Producteurs', 'Éleveurs et producteurs', 'Entretiens terminés', 'Inscrits au projet', 'Intérêts forts', 'E-mails envoyés', 'Attente moy. (min)', 'Entretien moy. (min)'], rows: synth, widths: [12, 10, 10, 11, 12, 12, 11, 11, 11, 12, 12] },
      { name: 'Plan de relance', head: planHead, rows: F.plan.map(planRow), widths: pw },
    ];
    [...new Set(F.plan.map((x) => x.ate))].forEach((a) => sheets.push({ name: 'ATE ' + a, head: planHead, rows: F.plan.filter((x) => x.ate === a).map(planRow), widths: pw }));
    const S = F.tr; const pf = (x) => (x == null ? '' : x);
    const trRows = [['Visiteurs transférés vers un KAM', S.all.n, S.all.fin, S.all.ins, pf(S.all.taux), S.all.fort, pf(S.all.tauxFort)], ['Visiteurs non transférés', S.non.n, S.non.fin, S.non.ins, pf(S.non.taux), S.non.fort, pf(S.non.tauxFort)], ['', '', '', '', '', '', '']]
      .concat(S.dests.map((x) => ['Vers ' + x.lab, x.n, x.fin, x.ins, pf(x.taux), x.fort, pf(x.tauxFort)])).concat([['', '', '', '', '', '', '']]).concat(S.from.map((x) => ['Depuis ' + x.lab, x.n, x.fin, x.ins, pf(x.taux), x.fort, pf(x.tauxFort)]))
      .concat([['', '', '', '', '', '', ''], ['Détail : nom', 'De', 'Vers', 'Motif', 'KAM prévenu', 'Inscription', 'Intérêt']]).concat(S.list.map((r) => [r.nom, r.transfert.de, r.transfert.vers, r.transfert.motif, r.kamPrevenu || '', r.inscription || '', r.interet || '']));
    sheets.push({ name: 'Transferts KAM', head: ['Groupe', 'Visiteurs', 'Entretiens terminés', 'Inscrits au projet', 'Taux d’inscription (%)', 'Intérêts forts', 'Taux d’intérêt fort (%)'], rows: trRows, widths: [34, 14, 14, 14, 14, 12, 14] });
    { const M = F.simu || simuStats(F.L); sheets.push({ name: 'Simulations MG2MIX', head: ['Nom', 'Téléphone', 'Localité', 'Élevage', 'Effectif', 'Formule', 'Coût unitaire (FCFA)', 'Marge unitaire (FCFA)', 'Marge annuelle (FCFA)', 'Marge annuelle (€)', 'Prémix chair / an (kg)', 'Prémix ponte / an (kg)', 'CA prémix potentiel / an (FCFA)', 'CA prémix potentiel / an (€)', 'Envoi auto', 'Validée', 'Inscription projet'],
      rows: M.rows.map((x) => { const m = x.r.simu; return [x.r.nom, x.r.tel, x.r.localite, m.sp === 'chair' ? 'Poulet de chair' : 'Pondeuses', Math.round(m.effectif || 0), m.formule, Math.round(m.cout || 0), Math.round(m.marge || 0), Math.round(m.margeAn || 0), Math.round((m.margeAn || 0) / 656), Math.round(x.c), Math.round(x.p), Math.round(x.ca), Math.round(x.ca / 656), x.r.simuAuto || '', m.valide ? (x.r.simuValide || 'Oui') : 'Non', x.r.inscription || '']; })
        .concat([['TOTAL', '', '', '', '', '', '', '', '', '', Math.round(M.tC * 1000), Math.round(M.tP * 1000), Math.round(M.ca), Math.round(M.ca / 656), '', M.valide + ' validée(s)', '']]),
      widths: [24, 15, 14, 14, 9, 22, 12, 12, 15, 12, 13, 13, 17, 14, 30, 22, 12] }); }
    sheets.push({ name: 'Visiteurs', head: ['Date', 'Source', 'Profil', 'Nom', 'Téléphone', 'E-mail', 'Localité', 'Dépôt', 'Activité', 'Priorités', 'Lieu d’entretien', 'Agent', 'Entretien', 'Intérêt', 'Inscription', 'Action', 'ATE', 'Statut', 'Réponse', 'Note'], rows: vis, widths: [16, 14, 16, 24, 15, 24, 14, 14, 30, 28, 18, 24, 12, 9, 11, 14, 22, 12, 30, 30] });
    return SKG.xlsxBook(JSZip, sheets);
  }
  function finalHtml(F) {
    const fd = (d) => d.split('-').reverse().join('/');
    const T = (k) => F.per.reduce((a, x) => a + (k(x.B) || 0), 0);
    const tot = [[F.L.length, 'visiteurs inscrits'], [T((B) => B.etat['Terminé']), 'entretiens réalisés'], [T((B) => B.insc['Oui']), 'inscrits au projet'], [T((B) => B.interet['Fort']), 'intérêts forts'], [T((B) => B.mails), 'présentations envoyées par e-mail'], [F.plan.length, 'contacts à relancer']];
    const byAte = [...new Set(F.plan.map((x) => x.ate))].map((a) => ({ a, L: F.plan.filter((x) => x.ate === a) }));
    const loc = F.L.reduce((m, r) => { const k = r.localite || '—'; m[k] = (m[k] || 0) + 1; return m; }, {});
    return `<div style="font-family:Arial,sans-serif;color:#1d2433;font-size:14px"><h2 style="color:#002060;margin:0">Rapport final du stand SOLEVO – SELAB SHOW 2026</h2><p style="color:#5b6476;margin:4px 0 14px">Du ${fd(F.days[0])} au ${fd(F.days[F.days.length - 1])} • programme SISSÊ~KABA</p>
      <table cellpadding="8" style="border-collapse:collapse;margin-bottom:12px"><tr>${tot.map(([v, l]) => `<td style="background:#F4F7FB;border-top:3px solid #37A028;text-align:center"><b style="font-size:22px;color:#0B5FA1">${v}</b><br><span style="font-size:12px">${l}</span></td>`).join('')}</tr></table>
      <h3 style="color:#002060">Jour par jour</h3><table cellpadding="5" border="1" style="border-collapse:collapse;font-size:12px"><tr style="background:#37A028;color:#fff"><th>Journée</th><th>Visiteurs</th><th>Entretiens</th><th>Inscrits</th><th>Intérêts forts</th></tr>${F.per.map((x) => `<tr><td>${fd(x.d)}</td><td>${x.B.n}</td><td>${x.B.etat['Terminé'] || 0}</td><td>${x.B.insc['Oui'] || 0}</td><td>${x.B.interet['Fort'] || 0}</td></tr>`).join('')}</table>
      ${(() => { const S = F.tr; const p = (x) => (x == null ? 'n.d.' : fr(x, 1) + ' %'); const row = (x, l) => `<tr><td>${esc(l || x.lab)}</td><td>${x.n}</td><td>${x.ins}</td><td><b>${p(x.taux)}</b></td><td>${x.fort}</td></tr>`;
        return `<h3 style="color:#002060">Efficacité des transferts vers les Key Account Managers</h3><p>${S.all.n} visiteur(s) transféré(s), dont <b>${S.all.ins}</b> inscrit(s) au projet (<b>${p(S.all.taux)}</b>) contre ${p(S.non.taux)} pour les visiteurs non transférés${S.ecart == null ? '' : ` : écart de <b>${S.ecart > 0 ? '+' : ''}${fr(S.ecart, 1)} point(s)</b>`}. KAM prévenus sur leur téléphone : ${S.prevenus}/${S.all.n}.</p>
        <table cellpadding="5" border="1" style="border-collapse:collapse;font-size:12px"><tr style="background:#0B5FA1;color:#fff"><th>Groupe</th><th>Visiteurs</th><th>Inscrits</th><th>Taux d’inscription</th><th>Intérêts forts</th></tr>${row(S.all, 'Transférés vers un KAM')}${row(S.non, 'Non transférés')}${S.dests.filter((x) => x.n).map((x) => row(x, 'Vers ' + x.lab)).join('')}${S.from.map((x) => row(x, 'Depuis ' + x.lab)).join('')}</table>`; })()}
      ${simuHtml(F.simu || simuStats(F.L))}
      <p><b>Localités les plus représentées :</b> ${Object.entries(loc).sort((a, b) => b[1] - a[1]).slice(0, 8).map(([k, v]) => esc(k) + ' (' + v + ')').join(', ') || '—'}</p>
      <h3 style="color:#002060">Plan de relance par ATE</h3><p style="font-size:12px;color:#5b6476">P1 : inscrits ou intérêt fort, relance sous 48 h • P2 : intérêt moyen, à relancer ou entretien non réalisé, sous 7 jours • P3 : autres, sous 14 jours. Visiteurs « Pas intéressé » exclus.</p>
      ${byAte.map(({ a, L }) => `<h4 style="margin:12px 0 4px;color:#0B5FA1">${esc(a)} – ${L.length} contact(s) (P1 : ${L.filter((x) => x.p === 'P1').length})</h4><table cellpadding="4" border="1" style="border-collapse:collapse;font-size:12px"><tr style="background:#002060;color:#fff"><th>Priorité</th><th>Échéance</th><th>Nom</th><th>Téléphone</th><th>Profil</th><th>Localité</th><th>Activité</th><th>Action</th></tr>${L.map((x) => `<tr><td>${x.p}</td><td>${x.ech}</td><td>${esc(x.r.nom)}</td><td>${esc(x.r.tel)}</td><td>${esc(x.r.public)}</td><td>${esc(x.r.localite)}</td><td>${esc(activite(x.r))}</td><td>${esc(x.act)}</td></tr>`).join('')}</table>`).join('') || '<p>Aucun contact à relancer.</p>'}
      <p style="color:#5b6476;font-size:12px;margin-top:16px">Le classeur joint contient la synthèse, le plan de relance global, une feuille par ATE (avec une colonne pour le compte rendu) et la liste complète des visiteurs. Données personnelles à usage interne SOLEVO Côte d’Ivoire.</p></div>`;
  }
  async function finalSend(from, to, dests) {
    if (!state.mcp) { status('Envoi du rapport disponible seulement dans claude.ai avec Gmail connecté.', 'err'); return; }
    try {
      const F = finalData(from, to); const x = await finalBook(F);
      const name = 'SISSE_KABA_Rapport_final_SELAB_2026_' + new Date().toISOString().slice(0, 10) + '.xlsx';
      await state.mcp.callTool('Gmail', 'send_message', { to: dests, subject: 'SISSÊ~KABA – Rapport final du stand SOLEVO au SELAB SHOW 2026 et plan de relance', htmlBody: finalHtml(F),
        attachments: [{ filename: name, mimeType: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', content: b64(x) }] });
      status('Rapport final envoyé à ' + dests.join(', ') + '.', 'ok');
    } catch (e) { console.error(e); status('Rapport non envoyé : ' + mailErr(e), 'err'); }
  }
  function finalOpen() {
    const b = modal('Rapport final du salon', `<div class="vg"><label>Du<input type="date" id="fnFrom" value="2026-11-20"></label><label>Au<input type="date" id="fnTo" value="2026-11-22"></label><label>Destinataires<input id="fnDest" value="${esc(state.standCfg.finalTo || CFG_DEFAULT.finalTo)}"></label></div>
      <p class="note">Un rapport final est aussi programmé le 23/11/2026 à 9 h (heure d’Abidjan) : il est envoyé automatiquement, même si le simulateur est fermé.</p>
      <div class="mbar"><button type="button" id="fnPrev">Aperçu</button><button type="button" id="fnXl">⬇ Télécharger le classeur</button><button type="button" id="fnSend">Envoyer par e-mail</button></div><div id="fnOut" class="bjout"></div>`, true);
    const rng = () => [$('#fnFrom', b).value, $('#fnTo', b).value];
    $('#fnPrev', b).addEventListener('click', () => { const [f, t] = rng(); $('#fnOut', b).innerHTML = finalHtml(finalData(f, t)); });
    $('#fnXl', b).addEventListener('click', async () => { const [f, t] = rng(); await save('SISSE_KABA_Rapport_final_SELAB_2026_' + new Date().toISOString().slice(0, 10) + '.xlsx', await finalBook(finalData(f, t))); });
    $('#fnSend', b).addEventListener('click', async () => { const [f, t] = rng(); await finalSend(f, t, $('#fnDest', b).value.split(/[,;\s]+/).filter((x) => /@/.test(x))); });
  }
  /* ---- calcul au stand (diapo 3) : enregistrement rapide ---- */
  function prosForm() {
    return `<div class="pz-pros"><b>Enregistrer ce visiteur (table et suivi ATE) :</b>
      <input id="prNom" placeholder="Nom et prénom" autocomplete="off"><input id="prTel" type="tel" placeholder="Téléphone WhatsApp" autocomplete="off">
      <input id="prLoc" placeholder="Localité" autocomplete="off"><select id="prDep">${DEPOTS_S.map((d) => `<option>${d}</option>`).join('')}</select>
      <button id="prSave" type="button">Enregistrer</button><span id="prMsg"></span></div>`;
  }
  async function prosSave(kind) {
    const nom = $('#prNom').value.trim(), tel = $('#prTel').value.trim();
    if (!nom || waNum(tel).length < 11) { $('#prMsg').textContent = 'Nom et téléphone valides obligatoires.'; return; }
    const c = PZ.calc.res || {}; const r = newRec('Calcul au stand');
    Object.assign(r, { nom, tel, localite: $('#prLoc').value.trim(), depot: $('#prDep').value, consent: true, profil: kind === 'eleveur' ? 'Éleveur' : 'Producteur de maïs', note: 'Accord oral recueilli au stand.' });
    if (kind === 'eleveur') r[{ 'Poulets de chair': 'chair', 'Pondeuses': 'pondeuse', 'Porcs': 'porc' }[c.type] || 'chair'] = c.q || 0; else r.surface = c.q || 0;
    assignTable(r);
    try { await prosPut(r); ['#prNom', '#prTel', '#prLoc'].forEach((k) => { $(k).value = ''; }); $('#prMsg').innerHTML = `✓ ${esc(nom)} : ${esc(tLab(r.table))} (${esc(r.agent)}). <a href="${waLink(r.tel, fillMsg(state.standCfg.msgTable, r))}" target="_blank" rel="noopener">Envoyer la table par WhatsApp</a>`; }
    catch (e) { $('#prMsg').textContent = 'Échec de l’enregistrement : ' + (e.message || e); }
  }
  /* ---- liste (éditeur) ---- */
  function prosBesoin(r) {
    const a = [];
    if (r.aliment) a.push(`${activite(r)} • ${fr(r.sacs || 0, 0)} sacs/an • ${fr(r.mais || 0, 1)} t maïs • ${fr((r.eco || 0) / 1e6, 2)} M éco.`);
    if (r.surface) a.push(`${fr(r.surface, 1)} ha • ${fr(r.maisP || 0, 1)} t maïs • +${fr((r.gain || 0) / 1e6, 2)} M recettes`);
    return a.join('<br>') || esc(activite(r));
  }
  function renderPros() {
    { const tb = $('#testBan'); if (tb) tb.hidden = !state.standCfg.testMode; }
    try { renderKitVal(); } catch (e) { /* */ }
    if (!$('#prosTbl')) return;
    const f = $('#prosFilter').value; const L = state.pros.filter((r) => !f || r.statut === f || r.public === f || r.etat === f || tLab(r.table) === f);
    const cnt = (k, v) => state.pros.filter((r) => r[k] === v).length;
    { const nd = dupGroups().length; const bt = $('#prosDup'); if (bt) { bt.textContent = nd ? '⚠ Fusionner les doublons (' + nd + ')' : 'Doublons : aucun'; bt.classList.toggle('warn', !!nd); } }
    $('#prosK').innerHTML = [[state.pros.length, 'visiteurs enregistrés'], [cnt('etat', 'En attente'), 'en attente d’entretien'], [cnt('etat', 'En entretien'), 'en entretien'], [cnt('etat', 'Terminé'), 'entretiens terminés'], [cnt('inscription', 'Oui'), 'inscrits au projet'], [cnt('statut', 'À rappeler'), 'à rappeler']].map(([v, l]) => `<div><b>${v}</b>${l}</div>`).join('');
    const opts = ['', 'En attente', 'En entretien', 'Terminé', 'Éleveur', 'Producteur', 'Éleveur et producteur', ...STATUTS, ...(state.standCfg.tables || []).map((t) => tLab(t.n))];
    if ($('#prosFilter').options.length !== opts.length) $('#prosFilter').innerHTML = opts.map((o) => `<option value="${o}" ${o === f ? 'selected' : ''}>${o || 'Tous les visiteurs'}</option>`).join('');
    $('#prosTbl tbody').innerHTML = L.length ? L.map((r) => `<tr><td>${r.date}<br><small>${esc(r.source || '')}</small></td><td>${esc(r.public)}</td><td><b>${esc(r.nom)}</b><br><a href="tel:+${waNum(r.tel)}">${esc(r.tel)}</a>${r.email ? '<br><small>' + esc(r.email) + '</small>' : ''}</td><td>${esc(r.localite)}<br><small>${esc(r.depot)}</small></td><td class="bes">${prosBesoin(r)}</td>
      <td>${r.table ? esc(tLab(r.table)) + '<br><small>' + esc(r.agent || '') + '</small>' : '—'}<br><span class="et et${ETATS.indexOf(r.etat)}">${esc(r.etat || '')}</span></td>
      <td><select data-pid="${r.id}" data-pk="ate">${ATES.map((a) => `<option ${a === r.ate ? 'selected' : ''}>${a}</option>`).join('')}</select><select data-pid="${r.id}" data-pk="statut">${STATUTS.map((a) => `<option ${a === r.statut ? 'selected' : ''}>${a}</option>`).join('')}</select></td>
      <td class="msgs"><small>Table : ${esc(r.msgTable || '—')}${r.rappel ? '<br>Rappel : ' + esc(r.rappel) : ''}<br>Merci : ${esc(r.msgMerci || '—')}<br>E-mail : ${esc(r.mailMerci || '—')}${r.reponse ? '<br><b>Réponse ' + esc(r.reponse) + '</b>' : ''}</small></td>
      <td class="acts"><button data-pe="${r.id}" title="Modifier">✎</button>${r.etat === 'Terminé' ? `<button data-pt="${r.id}" title="Remercier">✉</button>` : `<button data-pend="${r.id}" title="Terminer l’entretien">✓</button>`}<button data-pdel="${r.id}" title="Supprimer">✕</button></td></tr>`).join('')
      : '<tr><td colspan="9" class="muted">Aucun visiteur. Ouvrez le « Mode borne », ajoutez un visiteur ou importez une inscription WhatsApp.</td></tr>';
    $$('#prosTbl [data-pk]').forEach((i) => i.addEventListener('change', () => prosUpdate(i.dataset.pid, { [i.dataset.pk]: i.value })));
    $$('#prosTbl [data-pdel]').forEach((b) => b.addEventListener('click', () => prosDelete(b.dataset.pdel)));
    $$('#prosTbl [data-pe]').forEach((b) => b.addEventListener('click', () => editVisitor(b.dataset.pe)));
    $$('#prosTbl [data-pend]').forEach((b) => b.addEventListener('click', () => endInterview(b.dataset.pend)));
    $$('#prosTbl [data-pt]').forEach((b) => b.addEventListener('click', () => thanksPanel(state.pros.find((x) => x.id === b.dataset.pt), '')));
    renderAgents(); renderAppel();
  }
  async function prosExport() {
    if (!state.pros.length) { status('Aucun visiteur à exporter.', 'err'); return; }
    const head = ['Date', 'Source', 'Profil', 'Nom', 'Téléphone', 'E-mail', 'Localité', 'Dépôt le plus proche', 'Poulets de chair', 'Pondeuses', 'Porcs / an', 'Aliment', 'Maïs acheté / mois (t)', 'Prémix ou aliment actuel', 'Surface maïs (ha)', 'Coopérative', 'Achète des intrants', 'Priorités', 'Contact préféré',
      'Aliment / an (t)', 'Sacs de prémix / an', 'Maïs / an (t)', 'Économies maïs / an (FCFA)', 'Gain recettes / an (FCFA)', 'Visite', 'Personnes', 'Coopérative ou association', 'KAM demandé', ...VEILLE.map(([, l, u]) => 'Prix ' + l + ' (' + u + ')'), 'Sac prémix chair (kg)', 'Sac prémix ponte (kg)', 'Simulation MG2MIX', 'Marge annuelle simulée (FCFA)', 'Prémix MG2MIX simulé (kg/cycle)', 'Accueil offert', 'Transfert vers KAM', 'Table', 'Agent', 'Entretien', 'Intérêt', 'Inscription au projet', 'Prochaine action', 'ATE de suivi', 'Statut', 'Message table', 'Message merci', 'E-mail merci', 'Note', 'Consentement'];
    const rd = (x, d) => Math.round((x || 0) * Math.pow(10, d || 0)) / Math.pow(10, d || 0);
    const rows = state.pros.map((r) => [r.date, r.source, r.profil || r.public, r.nom, r.tel, r.email, r.localite, r.depot, r.chair || '', r.pondeuse || '', r.porc || '', r.fabrique, r.maisMois || '', r.fournisseur, r.surface || '', r.coop, r.intrants, (r.prios || []).join(', '), r.contact,
      rd(r.aliment, 1), rd(r.sacs), rd((r.mais || 0) + (r.maisP || 0), 1), rd(r.eco), rd(r.gain), r.visite || 'Seul(e)', nbP(r), r.org || '', r.kam || '', ...VEILLE.map(([k]) => (r.veille || {})[k] || ''), (r.veille || {}).pxChairKg || '', (r.veille || {}).pxPonteKg || '', r.simu ? (r.simu.sp === 'chair' ? 'Chair ' : 'Ponte ') + fr(r.simu.effectif) + ' sujets • ' + r.simu.formule + ' • coût ' + fr(r.simu.cout) + ' F' : '', r.simu ? Math.round(r.simu.margeAn) : '', r.simu ? Math.round(r.simu.premixKg) : '', accLab(r) + (r.servi ? ' (servi)' : ''), r.transfert ? r.transfert.de + ' → ' + r.transfert.vers + ' (' + r.transfert.motif + ')' : '', tLab(r.table), r.agent, r.etat, r.interet, r.inscription, r.action, r.ate, r.statut, r.msgTable, r.msgMerci, r.mailMerci, r.note, r.consent ? 'Oui' : 'Non']);
    const b = await SKG.xlsxTable(JSZip, 'Visiteurs stand', head, rows, [16, 14, 18, 24, 15, 24, 15, 15, 10, 10, 10, 16, 10, 18, 10, 16, 10, 30, 12, 10, 10, 10, 14, 14, 18, 9, 22, 24, ...VEILLE.map(() => 12), 10, 10, 24, 30, 7, 22, 12, 9, 12, 14, 22, 13, 18, 18, 16, 30, 10]);
    await save('SISSE_KABA_Visiteurs_Stand_SELAB_suivi_ATE_' + today().iso + '.xlsx', b);
  }
  function renderTeam() {
    const el = $('#teamBox'); if (!el) return;
    const card = (t, tag) => `<div class="tm"><em>${tag}</em><b>${esc(t.nom)}</b><span>${esc(t.role)}</span><small>${esc(t.mission)}</small><a href="tel:+225${t.tel.replace(/\D/g, '')}">${esc(t.tel)}</a><a href="mailto:${esc(t.mail)}">${esc(t.mail)}</a></div>`;
    el.innerHTML = `<div class="tmg"><span>Mandants</span>${card(TM.kouame, 'Mandant FEED')}${card(TM.konan, 'Mandant Agro / SEED')}</div>
      <div class="tmg"><span>Porteurs du projet au SELAB</span>${card(TM.lehito, 'KAM FEED')}${card(TM.agohi, 'KAM SEED')}</div>
      <div class="tmg"><span>Marketing Agro</span>${card(TM.kouakou, 'Responsable marketing Agro')}</div>
      <div class="tmg"><span>Agents techniques (tables et suivi)</span>${card(TM.ouattara, 'Table 1 • éleveurs')}${card(TM.kouadio, 'Table 2 • éleveurs')}${card(TM.koffi, 'Table 3 • producteurs')}</div>`;
  }
  /* ---- liens d’accès (Claude et navigateur) : borne, interface d’entretien, écran d’appel ---- */
  const LINKS = {
    main: 'https://claude.ai/artifact/TUnnsq3KPaGHqWqgX2PpWF',
    fiche: 'https://lehito1989.github.io/sisse-kaba-inscription-Public/',
    entretien: 'https://claude.ai/artifact/3ojPgP82bziXg2MJ29xVW2',
  };
  /* chaque outil : version navigateur sans compte Claude (nav) et version plateforme Claude (h) */
  const ACCES = [
    { k: 'borne', t: 'Borne digitale', who: 'Tablette ou écran d’accueil du stand', h: '#borne', tip: 'onglet Stand, bouton « ▣ Mode borne » : fiche sur l’écran et QR code à côté ; les inscriptions arrivent directement dans la liste',
      nav: () => LINKS.fiche + '#borne', navTip: 'touchez « Mode borne » en haut à droite ; chaque fiche est envoyée par WhatsApp à SOLEVO puis intégrée à la liste' },
    { k: 'entretien', t: 'Interface d’entretien', who: 'Agents techniques et Key Account Managers', h: '#entretien', tip: 'onglet Stand, bouton « ☷ Interface d’entretien », puis choisir sa table : file d’attente partagée en temps réel, alerte sonore',
      nav: (x) => LINKS.entretien + (x && /^Table \d/.test(x.table) ? '#table=' + encodeURIComponent(x.table) : ''), navTip: 'choisissez votre table ; collez la fiche WhatsApp du visiteur ou ajoutez-le ; envoyez chaque compte rendu à SOLEVO (WhatsApp ou e-mail) : il est intégré à la liste' },
    { k: 'fiche', t: 'Fiche d’inscription visiteur', who: 'Accueil, hôtesses, inscription sur téléphone', h: '#fiche', tip: 'onglet Stand, bouton « 📝 Fiche visiteur » : inscription directe dans la liste',
      nav: () => LINKS.fiche, navTip: 'la fiche s’envoie par WhatsApp à SOLEVO puis est intégrée à la liste' },
    { k: 'appel', t: 'Écran d’appel', who: 'Second écran du stand', h: '#appel', tip: 'onglet Stand, bouton « 📺 Écran d’appel »', nav: null, navTip: '' },
  ];
  function accesPeople() {
    const c = state.standCfg; const em = c.emails || {};
    return [
      { id: 'ouattara', p: TM.ouattara, table: 'Table 1', mail: em.ouattara || TM.ouattara.mail, keys: ['entretien'], navFirst: true },
      { id: 'kouadio', p: TM.kouadio, table: 'Table 2', mail: em.kouadio || TM.kouadio.mail, keys: ['entretien'], navFirst: true },
      { id: 'koffi', p: TM.koffi, table: 'Table 3', mail: em.koffi || TM.koffi.mail, keys: ['entretien'], navFirst: true },
      { id: 'lehito', p: TM.lehito, table: 'Table KAM FEED et salle de conférence', mail: em.lehito || TM.lehito.mail, keys: ['borne', 'entretien', 'appel', 'fiche'], navFirst: false },
      { id: 'agohi', p: TM.agohi, table: 'Table KAM SEED et salle de conférence', mail: em.agohi || TM.agohi.mail, keys: ['borne', 'entretien', 'appel', 'fiche'], navFirst: false },
      { id: 'borne', p: { nom: 'Borne digitale / accueil', role: 'Appareil du stand', tel: c.kioskTel || '' }, table: 'Accueil', mail: em.borne || '', keys: ['borne', 'fiche'], navFirst: false },
    ];
  }
  /* options ordonnées selon le rôle : techniciens = navigateur d’abord */
  function accesOpts(a, x) {
    const nav = a.nav ? { lab: 'Dans un navigateur (Chrome, Safari…), sans compte Claude', url: a.nav(x), tip: a.navTip } : null;
    const cl = { lab: 'Avec un compte Claude (plateforme SISSÊ~KABA, données en temps réel)', url: LINKS.main + a.h, tip: a.tip };
    const L = (x.navFirst ? [nav, cl] : [cl, nav]).filter(Boolean);
    return L.map((o, i) => Object.assign({ n: i + 1, best: i === 0 && L.length > 1 }, o));
  }
  function accesText(x) {
    const L = ACCES.filter((a) => x.keys.includes(a.k));
    const pr = x.p.nom.split(' ').length > 1 && x.id !== 'borne' ? prenom({ nom: x.p.nom }) : '';
    return `Bonjour${pr ? ' ' + pr : ''},\n\nVoici vos accès pour le stand SOLEVO Côte d’Ivoire au SELAB SHOW 2026 (20 au 22 novembre, Parc des sports d’Abidjan), programme SISSÊ~KABA. Votre poste : ${x.table}.\n\n` +
      L.map((a) => `▶ ${a.t.toUpperCase()}\n` + accesOpts(a, x).map((o) => `Option ${o.n}${o.best ? ' (recommandée)' : ''} – ${o.lab} :\n${o.url}\n${o.tip}`).join('\n\n')).join('\n\n') +
      `\n\nRègles du stand : 4 personnes au plus par table ; délégations et associations en salle de conférence ; eau et café offerts à l’accueil ; grands comptes transférés vers le Key Account Manager concerné.\n\nContacts : Elvis LEHITO (KAM FEED) ${TM.lehito.tel} • Arnaud AGOHI (KAM SEED) ${TM.agohi.tel} • WhatsApp inscriptions ${SOLEVO_TEL}.`;
  }
  function accesHtml(x) {
    const L = ACCES.filter((a) => x.keys.includes(a.k));
    const btn = (u, l, c) => `<a href="${u}" style="display:inline-block;background:${c};color:#ffffff;text-decoration:none;font-weight:bold;padding:9px 14px;border-radius:8px;margin:4px 6px 4px 0">${l}</a>`;
    return `<div style="font-family:Arial,sans-serif;color:#1d2433;font-size:14px;max-width:640px"><div style="border-bottom:4px solid #37A028;padding-bottom:6px"><b style="color:#002060;font-size:18px">SISSÊ~KABA • Stand SOLEVO Côte d’Ivoire – SELAB SHOW 2026</b><br><span style="color:#5b6476">20 au 22 novembre 2026 • Parc des sports d’Abidjan</span></div>
      <p>Bonjour ${esc(x.p.nom)},</p><p>Voici vos accès pour le stand. Votre poste : <b>${esc(x.table)}</b>.</p>
      ${L.map((a) => `<div style="background:#F4F7FB;border-left:4px solid #0B5FA1;border-radius:8px;padding:10px 12px;margin:12px 0"><b style="color:#002060;font-size:15px">${a.t}</b> <span style="color:#5b6476;font-size:12px">• ${a.who}</span>
        ${accesOpts(a, x).map((o) => `<div style="margin-top:8px"><b>Option ${o.n}${o.best ? ' (recommandée)' : ''}</b> – ${esc(o.lab)}<br>${btn(o.url, o.n === 1 ? 'Ouvrir (option 1)' : 'Ouvrir (option 2)', o.n === 1 ? '#37A028' : '#0B5FA1')}<br><a href="${o.url}" style="color:#0B5FA1;font-size:13px;word-break:break-all">${o.url}</a><div style="font-size:12px;color:#5b6476;margin-top:2px">${esc(o.tip)}</div></div>`).join('')}</div>`).join('')}
      <p style="font-size:13px"><b>Règles du stand :</b> 4 personnes au plus par table ; délégations de coopératives et associations en salle de conférence avec le Key Account Manager choisi ; eau et café offerts à l’accueil ; grands comptes transférés en un clic vers le Key Account Manager concerné.</p>
      <p style="font-size:13px">Contacts : Elvis LEHITO, KAM FEED, ${TM.lehito.tel} • Arnaud AGOHI, KAM SEED, ${TM.agohi.tel} • WhatsApp inscriptions ${SOLEVO_TEL}</p>
      <p style="color:#5b6476;font-size:12px">Elvis LEHITO et Arnaud AGOHI, Key Account Managers FEED et SEED, mandatés par Christophe KOUAME et Olivier KONAN – SOLEVO Côte d’Ivoire</p></div>`;
  }
  async function accesMail(x, to) {
    if (!state.mcp) { status('Envoi par e-mail disponible seulement dans claude.ai avec Gmail connecté. Utilisez « Copier » ou WhatsApp.', 'err'); return false; }
    try { await state.mcp.callTool('Gmail', 'send_message', { to: [to], subject: 'SISSÊ~KABA – Vos accès au stand SOLEVO (SELAB SHOW 2026)', htmlBody: accesHtml(x), body: accesText(x) }); return true; }
    catch (e) { console.error(e); status('E-mail non envoyé à ' + to + ' : ' + mailErr(e), 'err'); return false; }
  }
  function accesOpen() {
    const P = accesPeople();
    const c0 = state.standCfg;
    const b = modal('Liens d’accès : navigateur ou Claude', `<p class="note">Chaque outil a deux accès. <b>Navigateur, sans compte Claude</b> : à privilégier pour les techniciens (option 1 dans leurs messages) ; les fiches et comptes rendus arrivent par WhatsApp ou e-mail et sont intégrés à la liste. <b>Plateforme Claude</b> : file partagée en temps réel (option 1 pour les Key Account Managers et la borne). Pour l’accès navigateur, partagez la « Fiche d’inscription visiteur » et l’« Interface d’entretien » par lien public (menu Partager de chaque page) ; pour l’accès Claude, partagez ce simulateur avec le compte de chaque membre.</p>
      <table class="acc-t"><tr><th>Outil</th><th>Navigateur, sans compte Claude</th><th>Plateforme Claude</th></tr>${ACCES.map((a) => `<tr><td><b>${a.t}</b><br><small>${a.who}</small></td><td>${a.nav ? `<a href="${a.nav()}" target="_blank" rel="noopener">${a.nav().replace('https://', '')}</a><br><small>${esc(a.navTip)}</small> <button type="button" class="mini" data-cp="${a.nav()}">Copier</button>` : '<small>—</small>'}</td><td><a href="${LINKS.main + a.h}" target="_blank" rel="noopener">${(LINKS.main + a.h).replace('https://', '')}</a> <button type="button" class="mini" data-cp="${LINKS.main + a.h}">Copier</button><br><small>${esc(a.tip)}</small> <button type="button" class="mini" data-go="${a.k}">Ouvrir ici</button></td></tr>`).join('')}</table>
      <h4 style="margin:12px 0 4px">Aperçu du message d’un technicien</h4><pre class="bjout" style="white-space:pre-wrap;max-height:220px;overflow:auto;font-size:12px">${esc(accesText(accesPeople()[0]))}</pre>
      <fieldset class="autof"><legend>QR code de la borne (téléphone des visiteurs)</legend>
        <label class="consent"><input type="radio" name="qrm" value="nav" ${!c0.qrMode || c0.qrMode === 'nav' ? 'checked' : ''}> <b>Fiche d’inscription dans le navigateur du visiteur (recommandé)</b> : la même fiche que la borne, sans compte Claude ; envoyée par WhatsApp à SOLEVO puis intégrée à la liste</label>
        <label class="consent"><input type="radio" name="qrm" value="wa" ${c0.qrMode === 'wa' ? 'checked' : ''}> Fiche d’inscription prête dans WhatsApp (fonctionne pour tous les visiteurs ; importée automatiquement dans la liste avec Smsmobileapi, sinon via « Importer »)</label>
        <label class="consent"><input type="radio" name="qrm" value="fiche" ${c0.qrMode === 'fiche' ? 'checked' : ''}> Fiche visiteur du simulateur (seulement pour les personnes qui ont accès au simulateur)</label></fieldset>
      <h4 style="margin:14px 0 6px">Envoyer les accès à l’équipe</h4>
      <div class="acc-p">${P.map((x) => `<div class="acc-r"><div><b>${esc(x.p.nom)}</b><br><small>${esc(x.p.role)} • ${esc(x.table)}</small></div><input data-em="${x.id}" type="email" value="${esc(x.mail)}" placeholder="adresse e-mail"><div class="mbar"><button type="button" data-am="${x.id}">E-mail</button>${x.p.tel ? `<a class="bk-btn alt" target="_blank" rel="noopener" href="${waLink(x.p.tel, accesText(x))}">WhatsApp</a>` : ''}<button type="button" class="mini" data-at="${x.id}">Copier</button></div><span class="acc-s" data-as="${x.id}">${esc((state.standCfg.accesSent || {})[x.id] || '')}</span></div>`).join('')}</div>
      <p class="note">À vérifier : l’adresse d’Ibrahim OUATTARA (fiche Lucca : ibrahim.ouattara@solevogroup.com ; tâches FEED : ouattara.daouda@solevogroup.com). Les adresses modifiées ici sont enregistrées.</p>
      <div class="mbar"><button type="button" id="accAll">Envoyer à toute l’équipe par e-mail</button><button type="button" id="accX">Fermer</button></div>`, true);
    const readEm = () => { const c = state.standCfg; c.emails = c.emails || {}; $$('[data-em]', b).forEach((i) => { c.emails[i.dataset.em] = i.value.trim(); }); };
    const sendOne = async (id) => {
      readEm(); const x = accesPeople().find((y) => y.id === id); const to = (state.standCfg.emails[id] || '').trim();
      if (!/@/.test(to)) { status('Indiquez une adresse e-mail pour ' + x.p.nom + '.', 'err'); return false; }
      const ok = await accesMail(x, to);
      if (ok) { state.standCfg.accesSent = Object.assign({}, state.standCfg.accesSent, { [id]: '✓ envoyé à ' + to + ' le ' + today().fr }); $(`[data-as="${id}"]`, b).textContent = state.standCfg.accesSent[id]; }
      await cfgSave(); return ok;
    };
    $$('[data-am]', b).forEach((x) => x.addEventListener('click', async () => { if (await sendOne(x.dataset.am)) status('Accès envoyés par e-mail.', 'ok'); }));
    $$('[data-at]', b).forEach((x) => x.addEventListener('click', () => { const p = accesPeople().find((y) => y.id === x.dataset.at); try { navigator.clipboard.writeText(accesText(p)); x.textContent = 'Copié ✓'; } catch (e) { /* */ } }));
    $$('[data-go]', b).forEach((x) => x.addEventListener('click', () => { modalClose(); ({ borne: kioskOpen, fiche: ficheOpen, entretien: () => agentsOpen(), appel: appelOpen })[x.dataset.go](); }));
    $$('[name=qrm]', b).forEach((x) => x.addEventListener('change', async () => { state.standCfg.qrMode = x.value; await cfgSave(); status('QR code de la borne : ' + ({ fiche: 'fiche du simulateur', wa: 'fiche WhatsApp', nav: 'fiche dans le navigateur' })[x.value] + '.', 'ok'); }));
    $$('[data-cp]', b).forEach((x) => x.addEventListener('click', () => { try { navigator.clipboard.writeText(x.dataset.cp); x.textContent = 'Copié ✓'; } catch (e) { /* */ } }));
    $('#accAll', b).addEventListener('click', async () => { let n = 0; for (const x of accesPeople()) { if (/@/.test((state.standCfg.emails || {})[x.id] || x.mail) && await sendOne(x.id)) n++; } status(n + ' e-mail(s) d’accès envoyé(s).', n ? 'ok' : 'err'); });
    $('#accX', b).addEventListener('click', async () => { readEm(); await cfgSave(); modalClose(); });
  }
  /* ---- répétition générale du 19/11 : mode test, scénario par rôle, suivi ---- */
  const REP = [
    ['r1', 'Elvis LEHITO', 'Ouvrir la borne sur la tablette du stand (lien #borne ou « ▣ Mode borne »), plein écran.', 'Fiche et QR code affichés côte à côte.'],
    ['r2', 'Toute l’équipe', 'Ouvrir l’« Interface d’entretien » sur son téléphone, choisir sa table, activer 🔔.', 'Chacun voit sa table et ses compteurs.'],
    ['r3', 'Aubin Ghislain KOFFI', 'S’inscrire sur la borne comme producteur de maïs fictif (5 ha), avec son propre numéro.', 'Message reçu : TABLE 3, « 1er dans la file », eau et café proposés ; alerte sonore sur le téléphone d’Aubin.'],
    ['r4', 'Kouassi François KOUADIO', 'Scanner le QR code de la borne, compléter la fiche WhatsApp et l’envoyer.', 'Fiche reçue sur le WhatsApp SOLEVO puis intégrée (automatique ou « Importer »).'],
    ['r5', 'Arnaud AGOHI', 'Inscrire via « 📝 Fiche visiteur » une délégation de coopérative de 6 personnes, KAM SEED demandé.', 'Envoi en salle de conférence avec Arnaud AGOHI ; 6 eaux et 6 cafés à l’accueil.'],
    ['r6', 'Ibrahim OUATTARA', 'Faire inscrire 5 éleveurs fictifs à la Table 1, démarrer 5 entretiens.', 'Le 5e est bloqué (4 personnes au plus) ; « 3e dans la file » affiché pour le 3e inscrit.'],
    ['r7', 'Ibrahim OUATTARA', 'Terminer un entretien (intérêt fort, inscription oui) et envoyer le remerciement + e-mail de présentation.', 'Visiteur remercié par WhatsApp/SMS et e-mail ; contacts KAM FEED + technicien dans le message.'],
    ['r8', 'Ibrahim OUATTARA', 'Transférer un éleveur de 30 000 poulets vers KAM FEED avec un motif.', 'Visiteur prévenu ; Elvis reçoit l’alerte sur son téléphone ; son interface sonne.'],
    ['r9', 'Elvis LEHITO', 'Afficher l’« Écran d’appel » sur le second écran.', 'Nom affiché à la bonne table avec carillon à chaque démarrage.'],
    ['r10', 'Aubin Ghislain KOFFI', 'Répondre « OUI » au message de remerciement reçu.', 'Visiteur passé en « Inscrit » (lecture des réponses).'],
    ['r11', 'Toute l’équipe', 'Laisser un visiteur fictif attendre 15 minutes.', 'Rappel automatique (ou lien de rappel) envoyé.'],
    ['r12', 'Accueil', 'Servir eau et café aux visiteurs fictifs, cliquer « Servi ✓ ».', 'Liste « Accueil : à servir » vidée.'],
    ['r13', 'Elvis LEHITO', 'Envoyer le bilan de la journée de test par e-mail (case « inclure la répétition »).', 'E-mail reçu par Elvis, Arnaud et lehitognakoury@gmail.com avec l’Excel.'],
    ['r14', 'Elvis LEHITO', 'Purger les données de répétition et désactiver le mode répétition.', 'Liste vide de tout visiteur fictif ; bilans du salon non pollués.'],
  ];
  function repOpen() {
    const c = state.standCfg; c.rep = c.rep || {};
    const T = state.pros.filter((r) => r.test); const ok = REP.filter((x) => c.rep[x[0]] && c.rep[x[0]].ok).length;
    const b = modal('Répétition générale du 19/11/2026', `<div class="vg"><label class="consent"><input type="checkbox" id="rpOn" ${c.testMode ? 'checked' : ''}> <b>Mode répétition</b> : les inscriptions sont marquées « test » et exclues des bilans et du rapport final</label>
        <label>Date et heure<input id="rpWhen" value="${esc(c.repWhen || '19/11/2026, 10 h – 12 h, stand ou bureau SOLEVO')}"></label></div>
      <div class="simk"><div><b>${ok}/${REP.length}</b><span>étapes validées</span></div><div><b>${T.length}</b><span>visiteurs fictifs</span></div><div><b>${T.filter((r) => /auto/.test(r.msgTable || '')).length}</b><span>messages de table auto</span></div><div><b>${T.filter((r) => r.transfert).length}</b><span>transferts KAM</span></div><div><b>${T.filter((r) => r.etat === 'Terminé').length}</b><span>entretiens terminés</span></div></div>
      <table class="acc-t rep-t"><tr><th>#</th><th>Qui</th><th>À faire</th><th>Résultat attendu</th><th>OK</th><th>Remarque</th></tr>${REP.map((x, i) => `<tr><td>${i + 1}</td><td><b>${esc(x[1])}</b></td><td>${esc(x[2])}</td><td><small>${esc(x[3])}</small></td><td><input type="checkbox" data-rk="${x[0]}" ${c.rep[x[0]] && c.rep[x[0]].ok ? 'checked' : ''}></td><td><input data-rn="${x[0]}" value="${esc((c.rep[x[0]] || {}).n || '')}" placeholder="ex. message reçu en 20 s"></td></tr>`).join('')}</table>
      <div class="mbar"><button type="button" id="rpSave">Enregistrer</button><button type="button" id="rpMail">Envoyer le programme à l’équipe (e-mail)</button><button type="button" id="rpCr">Envoyer le compte rendu de répétition</button><button type="button" id="rpJ" class="pri">▶ Configurer le jour J</button><button type="button" id="rpPurge">Purger les données de répétition (${T.length})</button><button type="button" id="rpX">Fermer</button></div>
      <p class="note">Les messages WhatsApp/SMS de la répétition partent vraiment : utilisez les numéros de l’équipe comme visiteurs fictifs. Les e-mails de programme vont aux adresses du panneau « Liens d’accès ».</p>`, true);
    const read = () => { c.testMode = $('#rpOn', b).checked; c.repWhen = $('#rpWhen', b).value.trim(); REP.forEach((x) => { c.rep[x[0]] = { ok: $(`[data-rk="${x[0]}"]`, b).checked, n: $(`[data-rn="${x[0]}"]`, b).value.trim() }; }); };
    const prog = () => `Répétition générale du stand SOLEVO – SELAB SHOW 2026 (SISSÊ~KABA)\nQuand : ${c.repWhen}\nPlateforme : ${LINKS.main} (borne #borne, interface d’entretien #entretien, fiche #fiche, écran d’appel #appel)\nApportez votre téléphone chargé, WhatsApp actif, connecté à Claude.\n\n` + REP.map((x, i) => `${i + 1}. ${x[1]} – ${x[2]}\n   Attendu : ${x[3]}`).join('\n');
    $('#rpOn', b).addEventListener('change', async () => { read(); await cfgSave(); renderPros(); status(c.testMode ? 'Mode répétition activé : les nouvelles inscriptions sont marquées « test ».' : 'Mode répétition désactivé.', 'ok'); });
    $('#rpSave', b).addEventListener('click', async () => { read(); await cfgSave(); status('Suivi de la répétition enregistré.', 'ok'); });
    $('#rpX', b).addEventListener('click', async () => { read(); await cfgSave(); modalClose(); renderPros(); });
    $('#rpMail', b).addEventListener('click', async () => {
      read(); await cfgSave();
      const to = accesPeople().map((x) => ((state.standCfg.emails || {})[x.id] || x.mail || '').trim()).filter((x) => /@/.test(x));
      if (!state.mcp) { location.href = 'mailto:' + to.join(',') + '?subject=' + encodeURIComponent('SISSÊ~KABA – Répétition générale du stand SOLEVO') + '&body=' + encodeURIComponent(prog()); return; }
      try { await state.mcp.callTool('Gmail', 'send_message', { to, subject: 'SISSÊ~KABA – Répétition générale du stand SOLEVO (' + c.repWhen + ')', htmlBody: '<div style="font-family:Arial,sans-serif;font-size:14px"><pre style="font-family:Arial,sans-serif;white-space:pre-wrap">' + esc(prog()) + '</pre></div>' }); status('Programme envoyé à ' + to.join(', ') + '.', 'ok'); }
      catch (e) { status('Programme non envoyé : ' + mailErr(e), 'err'); }
    });
    $('#rpCr', b).addEventListener('click', async () => {
      read(); await cfgSave();
      const txt = `Compte rendu de la répétition générale (${c.repWhen})\nÉtapes validées : ${REP.filter((x) => c.rep[x[0]].ok).length}/${REP.length}\nVisiteurs fictifs : ${T.length} • messages de table auto : ${T.filter((r) => /auto/.test(r.msgTable || '')).length} • transferts KAM : ${T.filter((r) => r.transfert).length}\n\n` + REP.map((x, i) => `${c.rep[x[0]].ok ? '✓' : '✗'} ${i + 1}. ${x[1]} – ${x[2]}${c.rep[x[0]].n ? '\n   Remarque : ' + c.rep[x[0]].n : ''}`).join('\n');
      const to = ['elvis.lehito@solevogroup.com', 'arnaud.agohi@solevogroup.com', 'lehitognakoury@gmail.com'];
      if (!state.mcp) { location.href = 'mailto:' + to.join(',') + '?subject=' + encodeURIComponent('SISSÊ~KABA – Compte rendu de la répétition') + '&body=' + encodeURIComponent(txt); return; }
      try { await state.mcp.callTool('Gmail', 'send_message', { to, subject: 'SISSÊ~KABA – Compte rendu de la répétition générale', htmlBody: '<pre style="font-family:Arial,sans-serif;font-size:13px;white-space:pre-wrap">' + esc(txt) + '</pre>' }); status('Compte rendu de répétition envoyé.', 'ok'); }
      catch (e) { status('Compte rendu non envoyé : ' + mailErr(e), 'err'); }
    });
    $('#rpJ', b).addEventListener('click', async () => {
      read(); const T = state.pros.filter((r) => r.test);
      Object.assign(c, { testMode: false, qrMode: 'nav', rappelOn: true, autoTransfert: true, notifKam: true });
      const prov = c.autoProv && c.autoProv !== 'off';
      if (prov) Object.assign(c, { autoTable: true, autoMerci: true, autoReplies: true });
      await cfgSave(); renderPros();
      modal('Configuration du jour J appliquée', `<ul class="jj">
        <li>✓ Mode répétition désactivé${T.length ? ` <b>(attention : ${T.length} visiteur(s) de test encore dans la base, à purger)</b>` : ''}</li>
        <li>✓ Borne : fiche à l’écran → base partagée en temps réel (${LINKS.main}#borne)</li>
        <li>✓ Tables : « Interface d’entretien » sur la base partagée, cocher et valider, alerte sonore (${LINKS.main}#entretien)</li>
        <li>✓ Téléphones des visiteurs : QR code vers la fiche dans le navigateur (${LINKS.fiche})</li>
        <li>✓ Rappel après ${+c.rappelMin || 15} min, message de transfert et alerte KAM activés</li>
        <li>${prov ? '✓ Envois automatiques (table, remerciement, lecture des « OUI » et des fiches) activés' : '⚠ Envois automatiques inactifs : choisissez Smsmobileapi dans « ⚙ Tables, agents et messages » après l’avoir connecté dans Zapier'}</li>
        <li>À vérifier sur place : réseau Wi-Fi ou 4G, son des téléphones, borne en plein écran, second écran sur « Écran d’appel », QR codes imprimés sur chaque table.</li></ul><div class="mbar"><button type="button" onclick="document.getElementById('skModal').hidden=true">Fermer</button></div>`, true);
    });
    $('#rpPurge', b).addEventListener('click', async () => {
      const x = $('#rpPurge', b); if (x.dataset.sure !== '1') { x.dataset.sure = '1'; x.textContent = 'Confirmer la suppression de ' + T.length + ' visiteur(s) fictif(s)'; return; }
      for (const r of T) { if (dbOn()) { try { await state.db.collection('prospects').doc(r.id).delete(); } catch (e) { console.error(e); } } }
      if (!dbOn()) { state.pros = state.pros.filter((r) => !r.test); prosLocal(); }
      renderPros(); status(T.length + ' visiteur(s) de répétition supprimé(s).', 'ok'); modalClose();
    });
  }
  /* ---- QR codes à imprimer : accueil + un chevalet par table (fiche dans le navigateur) ---- */
  function qrRects(link, sizeMm, mm) {
    const q = qrcode(0, 'M'); q.addData(link); q.make(); const n = q.getModuleCount(), m = 4, cell = sizeMm / (n + 2 * m);
    const rects = [{ type: 'rect', x: 0, y: 0, w: sizeMm * mm, h: sizeMm * mm, color: 'white' }];
    for (let r = 0; r < n; r++) { let c0 = -1; for (let k = 0; k <= n; k++) { const on = k < n && q.isDark(r, k); if (on && c0 < 0) c0 = k; if (!on && c0 >= 0) { rects.push({ type: 'rect', x: (m + c0) * cell * mm, y: (m + r) * cell * mm, w: (k - c0) * cell * mm + 0.2, h: cell * mm + 0.2, color: 'black' }); c0 = -1; } } }
    return rects;
  }
  const gainPct = () => { const S = (state.V && state.V.S) || {}; const n = (x) => parseFloat(String(x || '').replace(/\s/g, '').replace(',', '.')); const av = n(S.prixProdAv), ap = n(S.prixProdAp); return av > 0 && ap > 0 ? String(Math.round((ap / av - 1) * 100)) : '30'; };
  const gainKg = () => String((state.V && state.V.S && state.V.S.gainProdKg) || '30').replace(/,0+$/, '');
  /* visuel carré 1080 × 1080 (WhatsApp, Facebook) annonçant le stand */
  async function squarePng() {
    if (!imgs.solevoBig) { try { await loadImages(); } catch (e) { console.error(e); } }
    const W = 1080, c = document.createElement('canvas'); c.width = c.height = W; const g = c.getContext('2d');
    const img = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
    const gr = g.createLinearGradient(0, 0, W, W); gr.addColorStop(0, '#00143D'); gr.addColorStop(1, '#0B4F8F'); g.fillStyle = gr; g.fillRect(0, 0, W, W);
    g.strokeStyle = 'rgba(155,187,89,.55)'; g.lineWidth = 10; g.beginPath(); g.arc(930, 150, 230, 0, Math.PI * 2); g.stroke();
    g.fillStyle = '#37A028'; g.fillRect(0, 838, W, 14); g.fillStyle = '#9BBB59'; g.fillRect(0, 852, 640, 6);
    const rr = (x, y, w, h, r, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); g.fill(); };
    rr(56, 56, 560, 130, 22, '#fff');
    const l1 = await img(imgs.solevoBig), l2 = await img(imgs.sisseUrl);
    if (l1) g.drawImage(l1, 80, 78, 86 * l1.width / l1.height, 86); if (l2) g.drawImage(l2, 350, 72, 98 * l2.width / l2.height, 98);
    const fit = (t, x, y, max, font) => { let sz = font[1]; g.font = font[0].replace('S', sz); while (g.measureText(t).width > max && sz > 16) { sz--; g.font = font[0].replace('S', sz); } g.fillText(t, x, y); };
    g.fillStyle = '#9BBB59'; g.font = '800 34px Arial, sans-serif'; g.fillText('SELAB SHOW 2026', 60, 250);
    g.fillStyle = '#fff'; g.font = '800 80px Arial, sans-serif'; g.fillText('Visitez le stand', 56, 336); g.fillText('SOLEVO', 56, 420);
    g.fillStyle = '#E8F0FA'; fit('Programme SISSÊ~KABA', 60, 474, 620, ['600 Spx Arial, sans-serif', 34]);
    /* slogan FEED */
    g.fillStyle = '#B5E07A'; fit('Dépensez moins, gagnez plus', 60, 536, 620, ['800 Spx Arial, sans-serif', 46]);
    g.fillStyle = '#fff'; fit('Prémix et intrants SOLEVO :', 60, 578, 620, ['400 Spx Arial, sans-serif', 28]);
    fit('−30 à 40 % sur vos coûts de production', 60, 614, 620, ['800 Spx Arial, sans-serif', 30]);
    /* producteur / éleveur */
    g.fillStyle = '#9BBB59'; g.fillRect(60, 646, 6, 66);
    const duo = (lab, txt, y) => { g.font = '800 27px Arial, sans-serif'; g.fillStyle = '#B5E07A'; g.fillText(lab, 80, y); const w = g.measureText(lab + ' ').width; g.fillStyle = '#fff'; fit(txt, 80 + w, y, 590 - w, ['600 Spx Arial, sans-serif', 27]); };
    duo('Producteur', 'maïs mieux payé, +' + gainPct() + ' % bord champ', 672);
    duo('Éleveur', 'maïs moins cher, −15 % sur son prix d’achat', 708);
    rr(56, 742, 600, 76, 14, '#37A028'); g.fillStyle = '#fff'; g.font = '800 40px Arial, sans-serif'; g.fillText('20 – 22 novembre 2026', 80, 794);
    g.fillStyle = '#fff'; g.font = '600 34px Arial, sans-serif'; g.fillText('Parc des sports d’Abidjan', 60, 920);
    g.font = '400 28px Arial, sans-serif'; g.fillStyle = '#C8D4E8'; g.fillText('Eau et café offerts • Entretien avec nos techniciens', 60, 968); g.fillText('Inscriptions : ' + SOLEVO_TEL, 60, 1012);
    g.font = 'italic 400 19px Arial, sans-serif'; g.fillStyle = '#8FA3C4'; g.fillText('Gains estimés selon les conditions d’exploitation.', 60, 1052);
    rr(700, 520, 330, 380, 22, '#fff');
    const q = qrcode(0, 'M'); q.addData(LINKS.fiche); q.make(); const n = q.getModuleCount(), cs = Math.floor(290 / (n + 4)), x0 = 700 + (330 - cs * (n + 4)) / 2, y0 = 540;
    g.fillStyle = '#000'; for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) g.fillRect(x0 + (k + 2) * cs, y0 + (r + 2) * cs, cs, cs);
    g.fillStyle = '#002060'; g.font = '800 26px Arial, sans-serif'; g.textAlign = 'center'; g.fillText('Inscrivez-vous', 865, 868); g.textAlign = 'left';
    const blob = await new Promise((ok) => c.toBlob(ok, 'image/png')); return new Uint8Array(await blob.arrayBuffer());
  }
  function renderKitVal() {
    const el = $('#kitVal'); if (!el) return; const k = (state.standCfg && state.standCfg.kitVal) || {};
    const st = k.statut || 'Non envoyé'; const cls = /Validé/.test(st) ? 'ok' : /corriger/.test(st) ? 'ko' : /attente/.test(st) ? 'wait' : '';
    el.innerHTML = `<span class="kv ${cls}">Validation du kit : <b>${esc(st)}</b>${k.envoye ? ' • envoyé le ' + esc(k.envoye) : ''}${k.le ? ' • ' + esc(k.le) : ''}${k.rem ? ' • ' + esc(k.rem) : ''}</span> <button type="button" id="kvOk" class="mini">✓ Kit validé par Jean-Noël</button> <button type="button" id="kvKo" class="mini">À corriger…</button>`;
    $('#kvOk').addEventListener('click', async () => { state.standCfg.kitVal = Object.assign({}, k, { statut: 'Validé', le: 'validé le ' + today().fr, rem: '' }); await cfgSave(); renderKitVal(); status('Kit communication validé : impression possible.', 'ok'); });
    $('#kvKo').addEventListener('click', () => { const b = modal('Corrections demandées sur le kit', `<label class="w">Remarques de Jean-Noël KOUAKOU<textarea id="kvR" rows="4">${esc(k.rem || '')}</textarea></label><div class="mbar"><button type="button" id="kvS">Enregistrer</button></div>`); $('#kvS', b).addEventListener('click', async () => { state.standCfg.kitVal = Object.assign({}, k, { statut: 'À corriger', le: 'retour du ' + today().fr, rem: $('#kvR', b).value.trim() }); await cfgSave(); modalClose(); renderKitVal(); }); });
  }
  /* visuel vertical 1080 × 1920 (statut WhatsApp) */
  async function storyPng() {
    if (!imgs.solevoBig) { try { await loadImages(); } catch (e) { console.error(e); } }
    const W = 1080, H = 1920, c = document.createElement('canvas'); c.width = W; c.height = H; const g = c.getContext('2d');
    const img = (src) => new Promise((ok) => { const i = new Image(); i.onload = () => ok(i); i.onerror = () => ok(null); i.src = src; });
    const rr = (x, y, w, h, r, col) => { g.fillStyle = col; g.beginPath(); g.moveTo(x + r, y); g.arcTo(x + w, y, x + w, y + h, r); g.arcTo(x + w, y + h, x, y + h, r); g.arcTo(x, y + h, x, y, r); g.arcTo(x, y, x + w, y, r); g.closePath(); g.fill(); };
    const fit = (t, x, y, max, font, sz) => { g.font = font.replace('S', sz); while (g.measureText(t).width > max && sz > 16) { sz--; g.font = font.replace('S', sz); } g.fillText(t, x, y); };
    const gr = g.createLinearGradient(0, 0, W, H); gr.addColorStop(0, '#00143D'); gr.addColorStop(1, '#0B4F8F'); g.fillStyle = gr; g.fillRect(0, 0, W, H);
    g.strokeStyle = 'rgba(155,187,89,.55)'; g.lineWidth = 12; g.beginPath(); g.arc(960, 220, 300, 0, Math.PI * 2); g.stroke();
    rr(70, 90, 640, 150, 24, '#fff'); const l1 = await img(imgs.solevoBig), l2 = await img(imgs.sisseUrl);
    if (l1) g.drawImage(l1, 100, 117, 96 * l1.width / l1.height, 96); if (l2) g.drawImage(l2, 400, 110, 110 * l2.width / l2.height, 110);
    g.fillStyle = '#9BBB59'; g.font = '800 42px Arial, sans-serif'; g.fillText('SELAB SHOW 2026', 76, 340);
    g.fillStyle = '#fff'; g.font = '800 104px Arial, sans-serif'; g.fillText('Visitez le stand', 70, 460); g.fillText('SOLEVO', 70, 570);
    g.fillStyle = '#E8F0FA'; fit('Programme SISSÊ~KABA', 76, 645, 920, '600 Spx Arial, sans-serif', 44);
    g.fillStyle = '#B5E07A'; fit('Dépensez moins, gagnez plus', 76, 765, 940, '800 Spx Arial, sans-serif', 72);
    g.fillStyle = '#fff'; fit('Prémix et intrants SOLEVO :', 76, 825, 930, '400 Spx Arial, sans-serif', 40);
    fit('−30 à 40 % sur vos coûts de production', 76, 878, 930, '800 Spx Arial, sans-serif', 44);
    g.fillStyle = '#9BBB59'; g.fillRect(76, 925, 8, 110);
    const duo = (lab, txt, y) => { g.font = '800 40px Arial, sans-serif'; g.fillStyle = '#B5E07A'; g.fillText(lab, 104, y); const w = g.measureText(lab + ' ').width; g.fillStyle = '#fff'; fit(txt, 104 + w, y, 900 - w, '600 Spx Arial, sans-serif', 40); };
    duo('Producteur', 'maïs mieux payé, +' + gainPct() + ' % bord champ', 965); duo('Éleveur', 'maïs moins cher, −15 % sur son prix d’achat', 1020);
    rr(70, 1085, 940, 110, 20, '#37A028'); g.fillStyle = '#fff'; g.font = '800 62px Arial, sans-serif'; g.textAlign = 'center'; g.fillText('20 – 22 novembre 2026', W / 2, 1162);
    g.font = '700 46px Arial, sans-serif'; g.fillText('Parc des sports d’Abidjan', W / 2, 1265);
    rr(300, 1310, 480, 480, 28, '#fff');
    const q = qrcode(0, 'M'); q.addData(LINKS.fiche); q.make(); const n = q.getModuleCount(), cs = Math.floor(400 / (n + 4)), x0 = 300 + (480 - cs * (n + 4)) / 2, y0 = 1322;
    g.fillStyle = '#000'; for (let r = 0; r < n; r++) for (let k = 0; k < n; k++) if (q.isDark(r, k)) g.fillRect(x0 + (k + 2) * cs, y0 + (r + 2) * cs, cs, cs);
    g.fillStyle = '#002060'; g.font = '800 36px Arial, sans-serif'; g.fillText('Scannez et inscrivez-vous', W / 2, 1768);
    g.fillStyle = '#C8D4E8'; g.font = '400 34px Arial, sans-serif'; g.fillText('Eau et café offerts • Entretien avec nos techniciens', W / 2, 1840); g.fillText('Inscriptions : ' + SOLEVO_TEL, W / 2, 1880);
    g.font = 'italic 400 24px Arial, sans-serif'; g.fillStyle = '#8FA3C4'; g.fillText('Gains estimés selon les conditions d’exploitation.', W / 2, 1910); g.textAlign = 'left';
    const blob = await new Promise((ok) => c.toBlob(ok, 'image/png')); return new Uint8Array(await blob.arrayBuffer());
  }
  async function qrPrint() {
    const kv = (state.standCfg.kitVal || {}).statut;
    if (kv !== 'Validé' && !state.qrWarned) { state.qrWarned = true; status('Kit pas encore validé par Jean-Noël KOUAKOU (marketing Agro) : vérifiez couleurs, logos et mentions légales avant d’imprimer. Cliquez à nouveau pour télécharger quand même.', 'err'); return; }
    await save('SISSE_KABA_QR_inscription_tables_' + today().iso + '.pdf', await qrPdfBytes()); }
  async function qrPdfBytes() {
    if (!imgs.solevoBig) { try { await loadImages(); } catch (e) { console.error(e); } }
    const mm = 2.8346, W = 210 * mm, H = 297 * mm, P = (x, y) => ({ x: x * mm, y: y * mm });
    const T = (state.standCfg.tables || []).filter((t) => !/^Salle/i.test(t.lieu || ''));
    const pages = [{ titre: 'Accueil du stand', sous: 'Inscription au programme SISSÊ~KABA', link: LINKS.fiche }]
      .concat(T.map((t) => ({ titre: (t.lieu || 'Table ' + t.n).replace(/^Table/, 'TABLE'), sous: String(t.agent || '').replace(/\(à nommer\)/, '').trim(), link: LINKS.fiche + '#table=' + encodeURIComponent(t.lieu || 'Table ' + t.n) })));
    const content = [];
    pages.forEach((pg, i) => {
      const brk = i ? { pageBreak: 'before' } : {};
      content.push(Object.assign({ canvas: [{ type: 'rect', x: 0, y: 0, w: W, h: 62 * mm, color: '#002060' }, { type: 'rect', x: 0, y: 62 * mm, w: W, h: 4 * mm, color: '#37A028' }, { type: 'rect', x: 0, y: 277 * mm, w: W, h: 20 * mm, color: '#000B22' }], absolutePosition: { x: 0, y: 0 } }, brk));
      content.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 120 * mm, h: 26 * mm, r: 4 * mm, color: 'white' }], absolutePosition: P(12, 10) });
      if (imgs.solevoBig) content.push({ image: imgs.solevoBig, height: 18 * mm, absolutePosition: P(16, 14) });
      if (imgs.sisseUrl) content.push({ image: imgs.sisseUrl, height: 20 * mm, absolutePosition: P(78, 13) });
      content.push({ text: 'SELAB SHOW 2026\n20 au 22 novembre', color: '#C8D4E8', fontSize: 11, alignment: 'right', absolutePosition: P(138, 15), width: 60 * mm });
      content.push({ text: pg.titre, color: 'white', bold: true, fontSize: 30, absolutePosition: P(12, 40), width: 186 * mm });
      content.push({ text: 'Inscrivez-vous en 1 minute', color: '#002060', bold: true, fontSize: 30, alignment: 'center', absolutePosition: P(0, 76), width: W });
      content.push({ text: 'Scannez avec l’appareil photo de votre téléphone : la fiche s’ouvre dans votre navigateur, sans application à installer.', color: '#1D2433', fontSize: 13, alignment: 'center', absolutePosition: P(20, 92), width: 170 * mm });
      const size = 120, x0 = (210 - size) / 2, y0 = 108;
      content.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: (size + 10) * mm, h: (size + 10) * mm, r: 5 * mm, color: '#37A028' }], absolutePosition: P(x0 - 5, y0 - 5) });
      content.push({ canvas: qrRects(pg.link, size, mm), absolutePosition: P(x0, y0) });
      content.push({ text: [{ text: '1. ', bold: true, color: '#37A028' }, 'Scannez   ', { text: '2. ', bold: true, color: '#37A028' }, 'Remplissez   ', { text: '3. ', bold: true, color: '#37A028' }, 'Envoyez par WhatsApp'], fontSize: 15, alignment: 'center', absolutePosition: P(0, 240), width: W });
      content.push({ text: (pg.sous ? 'Vous êtes reçu(e) par ' + pg.sous + '  •  ' : '') + 'Eau et café offerts à l’accueil', fontSize: 11.5, color: '#0B5FA1', alignment: 'center', absolutePosition: P(10, 252), width: 190 * mm });
      content.push({ text: 'Sans smartphone ? Inscrivez-vous sur la borne digitale ou au ' + SOLEVO_TEL, fontSize: 10.5, color: '#5B6476', alignment: 'center', absolutePosition: P(10, 263), width: 190 * mm });
      content.push({ text: 'SOLEVO Côte d’Ivoire  •  FEED & SEED  •  Programme SISSÊ~KABA', fontSize: 11, color: 'white', alignment: 'center', absolutePosition: P(0, 284), width: W });
    });
    const dd = { pageSize: 'A4', pageMargins: [0, 0, 0, 0], content, defaultStyle: { font: 'Roboto' }, info: { title: 'QR codes d’inscription – stand SOLEVO SELAB SHOW 2026', author: 'SOLEVO Côte d’Ivoire' } };
    return pdf(dd);
  }
  /* ---- doublons : même téléphone inscrit plusieurs fois ---- */
  function dupGroups() {
    const m = {}; state.pros.forEach((r) => { const k = waNum(r.tel).slice(-8); if (k.length === 8) (m[k] = m[k] || []).push(r); });
    return Object.values(m).filter((g) => g.length > 1).map((g) => g.slice().sort((a, b) => String(a.at).localeCompare(String(b.at))));
  }
  function mergeRecs(g) {
    const keep = JSON.parse(JSON.stringify(g[0])); const rank = { 'En attente': 0, 'En entretien': 1, 'Terminé': 2 }; const ir = { '': 0, Faible: 1, Moyen: 2, Fort: 3 }; const ins = { '': 0, Non: 1, 'À relancer': 2, Oui: 3 };
    g.slice(1).forEach((r) => {
      Object.keys(r).forEach((k) => { const v = r[k]; if (keep[k] === '' || keep[k] == null || keep[k] === 0 || (Array.isArray(keep[k]) && !keep[k].length)) { if (v !== '' && v != null) keep[k] = v; } });
      if ((rank[r.etat] || 0) > (rank[keep.etat] || 0)) Object.assign(keep, { etat: r.etat, table: r.table, agent: r.agent, debut: r.debut || keep.debut, fin: r.fin || keep.fin });
      if ((ir[r.interet || ''] || 0) > (ir[keep.interet || ''] || 0)) keep.interet = r.interet;
      if ((ins[r.inscription || ''] || 0) > (ins[keep.inscription || ''] || 0)) { keep.inscription = r.inscription; if (r.inscription === 'Oui') keep.statut = 'Inscrit'; }
      keep.prios = [...new Set([...(keep.prios || []), ...(r.prios || [])])]; keep.accueil = [...new Set([...(keep.accueil || []), ...(r.accueil || [])])];
      if (r.note && !String(keep.note || '').includes(r.note)) keep.note = ((keep.note || '') + ' • ' + r.note).trim();
    });
    if (keep.inscription === 'Oui') keep.statut = 'Inscrit';
    keep.note = ((keep.note || '') + ' • Fusion de ' + g.length + ' fiches (' + g.map((r) => r.source || '—').join(', ') + ') le ' + today().fr).trim();
    keep.fusion = g.slice(1).map((r) => r.id);
    return keep;
  }
  async function dupOpen() {
    const G = dupGroups();
    const b = modal('Fiches en double (même téléphone)', G.length ? `<p class="note">La fiche la plus ancienne est conservée ; les champs vides sont complétés par les autres fiches, l’état d’entretien le plus avancé, le meilleur intérêt et l’inscription au projet sont repris, les notes sont regroupées. Les autres fiches sont supprimées.</p>
      ${G.map((g, i) => `<div class="dupg"><b>${esc(g[0].tel)}</b> • ${g.length} fiches<ul>${g.map((r) => `<li>${esc(r.nom)} • ${esc(r.public || r.profil || '')} • ${esc(r.localite || '')} • ${esc(r.date || '')} • ${esc(r.source || '')} • ${esc(r.etat)} • ${esc(tLab(r.table))}</li>`).join('')}</ul><button type="button" data-mg="${i}">Fusionner ces ${g.length} fiches</button></div>`).join('')}
      <div class="mbar"><button type="button" id="mgAll">Tout fusionner (${G.length})</button><button type="button" id="mgX">Fermer</button></div>` : '<p>Aucun doublon : chaque téléphone n’apparaît qu’une fois.</p><div class="mbar"><button type="button" id="mgX">Fermer</button></div>', true);
    const one = async (g) => { const k = mergeRecs(g); await prosPut(k); for (const r of g.slice(1)) { if (dbOn()) { try { await state.db.collection('prospects').doc(r.id).delete(); } catch (e) { console.error(e); } } } if (!dbOn()) { state.pros = state.pros.filter((r) => !g.slice(1).some((x) => x.id === r.id)); prosLocal(); } };
    $('#mgX', b).addEventListener('click', modalClose);
    $$('[data-mg]', b).forEach((x) => x.addEventListener('click', async () => { await one(G[+x.dataset.mg]); renderPros(); renderAgents(); status('Fiches fusionnées.', 'ok'); dupOpen(); }));
    if ($('#mgAll', b)) $('#mgAll', b).addEventListener('click', async () => { for (const g of G) await one(g); renderPros(); renderAgents(); status(G.length + ' groupe(s) de doublons fusionné(s).', 'ok'); modalClose(); });
  }
  /* ---- bilan marketing : origine des inscriptions et QR codes ---- */
  const ORIG = (r) => /QR fiche/.test(r.source || '') ? 'QR code' + (r.tableVoulue ? ' ' + r.tableVoulue : ' accueil / borne') : /QR WhatsApp/.test(r.source || '') ? 'QR WhatsApp' : (r.source || 'Autre');
  function mktData(dayIso) {
    const L = state.pros.filter((r) => (!dayIso || String(r.at).slice(0, 10) === dayIso) && !r.test);
    const cnt = (f) => L.reduce((m, r) => { const k = f(r) || '—'; m[k] = (m[k] || 0) + 1; return m; }, {});
    const canal = cnt((r) => /QR/.test(r.source || '') ? 'QR codes (téléphone du visiteur)' : /Borne/.test(r.source || '') ? 'Borne digitale' : /Fiche visiteur/.test(r.source || '') ? 'Fiche visiteur (équipe)' : 'Saisie par l’équipe');
    const qr = cnt((r) => /QR/.test(r.source || '') ? ORIG(r) : null); delete qr['—'];
    const heures = cnt((r) => String(new Date(r.at).getHours()).padStart(2, '0') + ' h');
    return { L, n: L.length, canal, qr, heures, profil: cnt((r) => r.public), loc: cnt((r) => r.localite), prios: L.reduce((m, r) => { (r.prios || []).forEach((p) => { m[p] = (m[p] || 0) + 1; }); return m; }, {}), insc: L.filter((r) => r.inscription === 'Oui').length, fort: L.filter((r) => r.interet === 'Fort').length };
  }
  function mktHtml(dayIso) {
    const M = mktData(dayIso); const d = dayIso ? dayIso.split('-').reverse().join('/') : 'tout le salon';
    const tb = (o, h) => `<table cellpadding="5" style="border-collapse:collapse;font-size:12px;margin:4px 0 10px" border="1"><tr style="background:#37A028;color:#fff"><th>${h}</th><th>Inscrits</th><th>Part</th></tr>${Object.entries(o).sort((a, b) => b[1] - a[1]).map(([k, v]) => `<tr><td>${esc(k)}</td><td align="right">${v}</td><td align="right">${M.n ? fr(v / M.n * 100, 0) : 0} %</td></tr>`).join('') || '<tr><td colspan="3">Aucune donnée</td></tr>'}</table>`;
    return `<div style="font-family:Arial,sans-serif;color:#1d2433;font-size:14px"><h2 style="color:#002060;margin:0">Bilan marketing du stand SOLEVO – ${d}</h2><p style="color:#5b6476;margin:4px 0 12px">SELAB SHOW 2026 • programme SISSÊ~KABA • pour Jean-Noël KOUAKOU, responsable marketing Agro</p>
      <p><b>${M.n}</b> inscrits • <b>${M.insc}</b> inscrits au projet • <b>${M.fort}</b> intérêts forts</p>
      <h3 style="color:#002060;margin:10px 0 2px">Origine des inscriptions</h3>${tb(M.canal, 'Canal')}
      <h3 style="color:#002060;margin:10px 0 2px">QR codes les plus utilisés</h3><p style="font-size:12px;color:#5b6476;margin:0">Fiches reçues par QR code, selon l’emplacement du QR (accueil ou table). Les scans sans envoi de fiche ne sont pas mesurables.</p>${tb(M.qr, 'QR code')}
      <h3 style="color:#002060;margin:10px 0 2px">Profils, localités et attentes</h3>${tb(M.profil, 'Profil')}${tb(Object.fromEntries(Object.entries(M.loc).sort((a, b) => b[1] - a[1]).slice(0, 10)), 'Localité (top 10)')}${tb(M.prios, 'Priorité exprimée')}
      <h3 style="color:#002060;margin:10px 0 2px">Affluence par heure</h3>${tb(M.heures, 'Heure')}
      ${veilleHtml(M.L)}
      <p style="color:#5b6476;font-size:12px">Données personnelles à usage interne SOLEVO Côte d’Ivoire. Aucune liste nominative dans ce bilan.</p></div>`;
  }
  /* veille des prix déclarés par les visiteurs : moyenne, minimum, maximum, par localité */
  function veilleData(L) {
    return VEILLE.map(([k, l, u]) => { const v = L.map((r) => ({ p: +((r.veille || {})[k] || 0), kg: +((r.veille || {})[k + 'Kg'] || 0), loc: r.localite || '—' })).filter((x) => x.p > 0); const ps = v.map((x) => x.p);
      const pk = v.filter((x) => x.kg > 0).map((x) => x.p / x.kg); const sacs = v.filter((x) => x.kg > 0).reduce((m, x) => { m[x.kg + ' kg'] = (m[x.kg + ' kg'] || 0) + 1; return m; }, {});
      const byLoc = v.reduce((m, x) => { (m[x.loc] = m[x.loc] || []).push(x.p); return m; }, {});
      return { k, l, u, n: v.length, perKg: pk.length ? pk.reduce((a, b) => a + b, 0) / pk.length : null, sacs: Object.entries(sacs).sort((a, b) => b[1] - a[1]).map(([z, c]) => z + ' (' + c + ')').join(', '), moy: ps.length ? ps.reduce((a, b) => a + b, 0) / ps.length : null, min: ps.length ? Math.min(...ps) : null, max: ps.length ? Math.max(...ps) : null, loc: Object.entries(byLoc).map(([loc, a]) => loc + ' ' + fr(a.reduce((x, y) => x + y, 0) / a.length, 0)).join(' • ') };
    }).filter((x) => x.n);
  }
  function veilleHtml(L) {
    const V = veilleData(L);
    return `<h3 style="color:#002060;margin:10px 0 2px">Veille des prix déclarés par les visiteurs</h3>${V.length ? `<table cellpadding="5" style="border-collapse:collapse;font-size:12px;margin:4px 0 10px" border="1"><tr style="background:#37A028;color:#fff"><th>Produit</th><th>Unité</th><th>Réponses</th><th>Moyenne</th><th>Min</th><th>Max</th><th>Moyenne par localité</th></tr>${V.map((x) => `<tr><td>${x.l}</td><td>${x.u}</td><td align="right">${x.n}</td><td align="right"><b>${fr(x.moy, 0)}</b></td><td align="right">${fr(x.min, 0)}</td><td align="right">${fr(x.max, 0)}</td><td>${esc(x.loc)}${x.perKg != null ? `<br><small>≈ ${fr(x.perKg, 0)} FCFA/kg • sacs : ${esc(x.sacs)}</small>` : ''}</td></tr>`).join('')}</table>` : '<p style="font-size:12px;color:#5b6476">Aucun prix déclaré pour le moment.</p>'}`;
  }
  function mktOpen() {
    const day = new Date().toISOString().slice(0, 10);
    const b = modal('Bilan marketing (Jean-Noël KOUAKOU)', `<div class="vg"><label>Journée<input type="date" id="mkDay" value="${day}"></label><label>Destinataires<input id="mkTo" value="${esc(state.standCfg.mktTo || 'jean-noel.kouakou@solevogroup.com, elvis.lehito@solevogroup.com, lehitognakoury@gmail.com')}"></label></div>
      <div class="mbar"><button type="button" id="mkPrev">Aperçu</button><button type="button" id="mkAll">Aperçu des 3 jours</button><button type="button" id="mkSend">Envoyer</button></div><div id="mkOut" class="bjout"></div><p class="note">Un bilan marketing est aussi envoyé automatiquement chaque soir du salon (20–22/11) à 19 h 23, même simulateur fermé.</p>`, true);
    $('#mkPrev', b).addEventListener('click', () => { $('#mkOut', b).innerHTML = mktHtml($('#mkDay', b).value); });
    $('#mkAll', b).addEventListener('click', () => { $('#mkOut', b).innerHTML = mktHtml(''); });
    $('#mkSend', b).addEventListener('click', async () => {
      const to = $('#mkTo', b).value.split(/[,;\s]+/).filter((x) => /@/.test(x)); state.standCfg.mktTo = to.join(', '); await cfgSave();
      if (!state.mcp) { status('Envoi disponible seulement dans claude.ai avec Gmail connecté.', 'err'); return; }
      const dd = $('#mkDay', b).value;
      try { await state.mcp.callTool('Gmail', 'send_message', { to, subject: 'SISSÊ~KABA – Bilan marketing du stand SOLEVO du ' + dd.split('-').reverse().join('/'), htmlBody: mktHtml(dd) }); status('Bilan marketing envoyé à ' + to.join(', ') + '.', 'ok'); }
      catch (e) { status('Bilan marketing non envoyé : ' + mailErr(e), 'err'); }
    });
  }
  /* ---- Formulation & rentabilité MG2MIX (classeur SOLEVO évalué en direct) ---- */
  async function skfReady() {
    if (!window.SKF_XLSX) await new Promise((ok, ko) => { const s = document.createElement('script'); s.src = 'formul_wb.js'; s.onload = ok; s.onerror = () => ko(new Error('modèle de formulation introuvable')); document.head.appendChild(s); });
    await SKF.load();
  }
  const fEur = (x) => `${fr(x, 0)} FCFA <small class="eur">(≈ ${fr(x / 656, 0)} €)</small>`;
  const fEurT = (x) => `${fr(x, 0)} FCFA (≈ ${fr(x / 656, 0)} €)`;
  function skfFromRec(r) {
    const B = SKF.base(); const vf = SKF.inputFromVeille((r && r.veille) || {}, r || {});
    const sp = r ? ((+r.pondeuse || 0) > (+r.chair || 0) || /ponte|pondeu/i.test(r.profil || '') ? 'ponte' : 'chair') : 'chair';
    return { sp, batiment: 'neuf', prix: vf.inp.prix, veille: vf.veille,
      chair: Object.assign({}, B.chair, vf.inp.chair, { mortalite: B.chair.mortalite * 100, formule: 1 }),
      ponte: Object.assign({}, B.ponte, vf.inp.ponte, { mortalite: B.ponte.mortalite * 100, mortP: B.ponte.mortP * 100, formule: 1 }),
      client: { nom: (r && r.nom) || '', localite: (r && r.localite) || '', tel: (r && r.tel) || '', email: (r && r.email) || '' } };
  }
  /* envoi du rapport au visiteur : e-mail (Gmail) + WhatsApp/SMS (Smsmobileapi) */
  async function simuSend(r, rep, label, atts) {
    const out = [];
    if (!state.mcp) return { ok: false, out: ['envoi automatique disponible seulement dans claude.ai'] };
    if (r.email && /@/.test(r.email)) {
      try {
        atts = (atts || []).filter((a) => a && a.bytes && a.bytes.length);
        let fileArgs = false; if (atts.length) { try { fileArgs = !!(await state.mcp.listTools()).fileArgs; } catch (e) { fileArgs = false; } }
        let inl = atts.slice(); let tot = inl.reduce((a, x) => a + x.bytes.length, 0);
        for (let i = inl.length - 1; i >= 0 && tot > INLINE_LIMIT; i--) if (/\.xlsx$/.test(inl[i].filename)) { tot -= inl[i].bytes.length; inl.splice(i, 1); }
        const mk = (mode) => { const A = mode === 'file' ? atts : inl; const miss = atts.length > A.length ? '<p style="font-size:12px;color:#666">Le devis Excel personnalisé vous sera transmis par votre conseiller SOLEVO sur simple demande.</p>' : '';
          const o = { to: [r.email.trim()], subject: 'SOLEVO – ' + (label === 'valide' ? 'Votre simulation validée' : 'Vos coûts de production avec les prémix MG2MIX'), htmlBody: rep.html.replace(/<\/div>$/, miss + '</div>'), body: rep.text.replace(/[*_]/g, '') };
          if (A.length) o.attachments = A.map((a) => ({ filename: a.filename, mimeType: a.mime, content: mode === 'file' ? { $file: { data: new Blob([a.bytes], { type: a.mime }), name: a.filename, type: a.mime } } : b64(a.bytes) }));
          return { o, n: A.length }; };
        let sent;
        try { sent = mk(fileArgs ? 'file' : 'inline'); await state.mcp.callTool('Gmail', 'send_message', sent.o); }
        catch (e) { if (fileArgs && ['bad_request', 'capability_disabled', 'transform_error', 'capability_removed'].includes(e && e.code)) { sent = mk('inline'); await state.mcp.callTool('Gmail', 'send_message', sent.o); } else throw e; }
        out.push('e-mail ✓' + (sent.n ? ' (' + sent.n + ' pièce' + (sent.n > 1 ? 's' : '') + ' jointe' + (sent.n > 1 ? 's' : '') + ')' : ''));
      }
      catch (e) { out.push('e-mail non envoyé (' + mailErr(e) + ')'); }
    } else out.push('pas d’e-mail');
    const t = await sendTel(r.tel, rep.text); out.push(t.ok ? t.ch + ' ✓' : 'WhatsApp non envoyé (' + t.msg + ')');
    const lab = (label === 'valide' ? 'Validée ' : 'Auto ') + today().fr + ' : ' + out.join(', ');
    await prosUpdate(r.id, label === 'valide' ? { simuValide: lab } : { simuAuto: lab });
    return { ok: out.some((x) => /✓/.test(x)), out };
  }
  /* dès qu’une fiche avec veille des prix arrive : calcul automatique et envoi au visiteur */
  async function simuAuto(r) {
    try {
      const c = state.standCfg || {};
      if (c.autoSimu === false || !r || r.simuAuto || !r.veille || !Object.keys(r.veille).some((k) => +r.veille[k] > 0)) return;
      await skfReady();
      const vf = SKF.inputFromVeille(r.veille, r); const R = SKF.compute(vf.inp);
      const rep = SKF.report(R, { nom: r.nom, localite: r.localite, sps: vf.sps });
      const X = vf.sps[0] === 'ponte' ? R.ponte : R.chair, ch = vf.sps[0] !== 'ponte';
      const inp = skfFromRec(r); inp.sp = ch ? 'chair' : 'ponte';
      await prosUpdate(r.id, { simu: { inp, le: new Date().toISOString(), auto: true, sp: inp.sp, formule: X.formule.nom, effectif: X.effectif, cout: ch ? X.coutPoulet : X.coutPlaq, marge: ch ? X.margePoulet : X.margePlaq, caAn: X.caAn, margeAn: X.margeAn, demarrage: X.demarrage, premixKg: X.premix.chair + X.premix.ponte, premixC: X.premix.chair, premixP: X.premix.ponte, an: simuAn(R, vf.sps, vf.inp.prix), resume: rep.text } });
      const res = await simuSend(state.pros.find((x) => x.id === r.id) || r, rep, 'auto');
      status('Coûts MG2MIX envoyés à ' + r.nom + ' : ' + res.out.join(', ') + '.', res.ok ? 'ok' : 'warn');
    } catch (e) { console.error('simuAuto', e); }
  }
  function skfResume(inp, R) {
    const c = R.chair, p = R.ponte, ch = inp.sp === 'chair';
    const L = ['*SIMULATION SOLEVO – Formulation MG2MIX 2 %*', (inp.client.nom ? 'Pour : ' + inp.client.nom + (inp.client.localite ? ' (' + inp.client.localite + ')' : '') : ''),
      ch ? `Élevage : ${fr(c.effectif)} poulets de chair, bande de ${fr(c.duree)} jours` : `Élevage : ${fr(p.effectif)} pondeuses, cycle de ${fr(p.duree)} jours (78 semaines)`,
      'Formule : ' + (ch ? c : p).formule.nom + ' + prémix MG2MIX 2 %',
      ch ? `Coût de revient : ${fr(c.coutPoulet)} FCFA/poulet (${fr(c.coutKgVif)} FCFA/kg vif)` : `Coût de revient : ${fr(p.coutOeuf, 1)} FCFA/œuf • ${fr(p.coutPlaq)} FCFA/plaquette`,
      ch ? `Marge brute : ${fr(c.margePoulet)} FCFA/poulet • ${fEurT(c.margeBande)} par bande` : `Marge brute : ${fr(p.margePlaq)} FCFA/plaquette • ${fEurT(p.margePlaq * p.plaquettes)} par cycle`,
      `Chiffre d’affaires annuel estimé : ${fEurT((ch ? c : p).caAn)}`,
      `Marge annuelle après amortissement (estimation) : ${fEurT((ch ? c : p).margeAn)}`,
      (ch ? c : p).invest ? `Investissement bâtiment + équipements : ${fEurT((ch ? c : p).invest)}` : 'Bâtiment existant : pas d’investissement compté',
      `À prévoir pour démarrer : ${fEurT((ch ? c : p).demarrage)}`,
      ch ? `Prémix MG2MIX chair nécessaire : ${fr(c.premix.chair, 0)} kg par bande` : `Prémix MG2MIX nécessaire : ${fr(p.premix.chair, 0)} kg chair-poulette + ${fr(p.premix.ponte, 0)} kg ponte par cycle`,
      'Estimation indicative : les prix appliqués lors de l’achat peuvent varier. SOLEVO Côte d’Ivoire – 07 77 19 09 94'];
    return L.filter(Boolean).join('\n');
  }
  async function formulOpen(id) {
    const b = modal('🧮 Formulation & rentabilité MG2MIX', '<p class="note" id="fxLoad">Chargement du modèle SOLEVO…</p>', true);
    try { await skfReady(); } catch (e) { $('#fxLoad', b).textContent = 'Modèle indisponible : ' + (e.message || e); return; }
    let rec = id ? state.pros.find((x) => x.id === id) : null;
    let inp = rec && rec.simu && rec.simu.inp ? JSON.parse(JSON.stringify(rec.simu.inp)) : skfFromRec(rec);
    const opts = state.pros.slice().sort((a, c) => String(c.date || '').localeCompare(String(a.date || ''))).slice(0, 300);
    b.innerHTML = `<div class="fx"><div class="vg"><label>Visiteur<select id="fxRec"><option value="">— Simulation libre —</option>${opts.map((r) => `<option value="${r.id}" ${rec && rec.id === r.id ? 'selected' : ''}>${esc(r.nom)} • ${esc(r.localite || '')}</option>`).join('')}</select></label><label>Nom du client<input id="fxNom"></label><label>Localité<input id="fxLoc"></label><label>Téléphone<input id="fxTel" inputmode="tel"></label><label>E-mail<input id="fxMail" type="email"></label></div>
      <div class="chips fxsp"><button type="button" data-sp="chair">🐔 Poulet de chair</button><button type="button" data-sp="ponte">🥚 Pondeuses</button></div>
      <div id="fxIn"></div><div id="fxOut"></div>
      <div class="mbar"><button type="button" id="fxVal" class="fxval">✅ Valider avec le visiteur et lui envoyer</button><button type="button" id="fxSave" class="alt">💾 Enregistrer dans la fiche</button><a class="bk-btn" id="fxWa" target="_blank" rel="noopener">WhatsApp au visiteur</a><button type="button" id="fxCopy" class="alt">Copier le résumé</button><button type="button" id="fxXl">📊 Devis Excel personnalisé</button><button type="button" id="fxPdf">📄 Fiche PDF</button></div>
      <p class="note">Calculs issus du classeur SOLEVO « Formulation alimentaire avec les prémix MG2MIX » (1 197 formules recalculées à chaque saisie). Estimation indicative avant impôts et frais financiers : ce n’est pas un bénéfice net garanti. 1 € = 656 FCFA.</p></div>`;
    const setClient = () => { $('#fxNom', b).value = inp.client.nom || ''; $('#fxLoc', b).value = inp.client.localite || ''; $('#fxTel', b).value = inp.client.tel || ''; $('#fxMail', b).value = inp.client.email || (rec && rec.email) || ''; };
    setClient();
    const num = (x) => (x === '' || x == null ? '' : +(+x).toFixed(4));
    function renderIn() {
      $$('[data-sp]', b).forEach((x) => x.classList.toggle('on', x.dataset.sp === inp.sp));
      const sp = inp.sp, S = inp[sp], F = sp === 'chair' ? SKF.CHAIR_F : SKF.PONTE_F, B = SKF.base();
      $('#fxIn', b).innerHTML = `<div class="vg">${SKF.PAR[sp].map(([k, l, , u]) => `<label>${l} <small>(${u})</small><input type="number" min="0" step="any" data-fp="${k}" value="${num(S[k])}"></label>`).join('')}
        <label>Formule d’aliment<select data-fp="formule">${F.map((f) => `<option value="${f.id}" ${+S.formule === f.id ? 'selected' : ''}>${esc(f.nom)}</option>`).join('')}</select></label>
        <label>Bâtiment<select id="fxBat"><option value="neuf" ${inp.batiment !== 'existant' ? 'selected' : ''}>À construire (devis complet)</option><option value="existant" ${inp.batiment === 'existant' ? 'selected' : ''}>Déjà disponible</option></select></label></div>
        <details class="veille" ${inp.veille && inp.veille.length ? 'open' : ''}><summary>Prix des matières premières <span>(FCFA/kg${inp.veille && inp.veille.length ? ' • ' + inp.veille.length + ' prix issus de la veille du visiteur' : ''})</span></summary><div class="vg">${SKF.MP.map(([k, l]) => `<label>${l}${(inp.veille || []).includes(k) ? ' <em class="vtag">veille</em>' : ''}<input type="number" min="0" step="any" data-mp="${k}" value="${num(inp.prix[k] != null ? inp.prix[k] : B.prix[k])}"></label>`).join('')}</div>
        <div class="mbar"><button type="button" id="fxBase" class="alt">Prix de référence SOLEVO</button>${rec && rec.veille ? '<button type="button" id="fxVx" class="alt">Reprendre la veille du visiteur</button>' : ''}</div></details>`;
      $$('[data-fp]', b).forEach((i) => i.addEventListener('input', () => { inp[sp][i.dataset.fp] = i.tagName === 'SELECT' ? +i.value : i.value; tick(); }));
      $$('[data-mp]', b).forEach((i) => i.addEventListener('input', () => { inp.prix[i.dataset.mp] = i.value === '' ? undefined : +i.value; inp.veille = (inp.veille || []).filter((x) => x !== i.dataset.mp); tick(); }));
      $('#fxBat', b).addEventListener('change', (e) => { inp.batiment = e.target.value; tick(); });
      $('#fxBase', b).addEventListener('click', () => { inp.prix = {}; inp.veille = []; renderIn(); tick(); });
      if ($('#fxVx', b)) $('#fxVx', b).addEventListener('click', () => { const f = skfFromRec(rec); inp.prix = f.prix; inp.veille = f.veille; renderIn(); tick(); });
    }
    let R = null, tm = 0;
    function tick() { clearTimeout(tm); tm = setTimeout(renderOut, 180); }
    function clean() {
      const o = JSON.parse(JSON.stringify(inp));
      ['chair', 'ponte'].forEach((sp) => SKF.PAR[sp].forEach(([k, , , u]) => { if (u === '%') o[sp][k] = (+o[sp][k] || 0) / 100; }));
      o.client = { nom: $('#fxNom', b).value.trim(), localite: $('#fxLoc', b).value.trim(), tel: $('#fxTel', b).value.trim(), email: $('#fxMail', b).value.trim() }; inp.client = o.client;
      return o;
    }
    function renderOut() {
      let o; try { o = clean(); R = SKF.compute(o); } catch (e) { console.error(e); $('#fxOut', b).innerHTML = '<p class="err">Calcul impossible : ' + esc(e.message || e) + '</p>'; return; }
      const ch = inp.sp === 'chair', X = ch ? R.chair : R.ponte, cmp = R.comp[inp.sp];
      const k = (v, l, cl) => `<div class="fxk ${cl || ''}"><b>${v}</b><span>${l}</span></div>`;
      const mois = X.retour ? fr(X.retour * 12, 0) + ' mois' : '—';
      const kp = ch ? [k(fr(X.coutPoulet) + ' F', 'coût de revient / poulet'), k(fr(X.margePoulet) + ' F', 'marge brute / poulet (' + fr(X.margePct * 100, 0) + ' %)', X.margePoulet < 0 ? 'neg' : 'pos'), k(fEur(X.margeBande), 'marge brute de la bande', X.margeBande < 0 ? 'neg' : ''), k(fr(X.ic, 2), 'indice de consommation')]
        : [k(fr(X.coutOeuf, 1) + ' F', 'coût de revient / œuf'), k(fr(X.coutPlaq) + ' F', 'coût / plaquette de 30'), k(fr(X.margePlaq) + ' F', 'marge brute / plaquette', X.margePlaq < 0 ? 'neg' : 'pos'), k(fr(X.coutPoulette) + ' F', 'coût d’une poulette à 18 sem.')];
      kp.push(k(fEur(X.caAn), 'chiffre d’affaires / an'), k(fEur(X.margeAn), 'marge annuelle après amortissement', X.margeAn < 0 ? 'neg' : ''), k(fEur(X.demarrage), 'à prévoir pour démarrer'), k(mois, 'retour sur investissement'));
      const pm = ch ? `${fr(X.premix.chair, 0)} kg de prémix chair` : `${fr(X.premix.chair, 0)} kg chair-poulette + ${fr(X.premix.ponte, 0)} kg ponte`;
      kp.push(k(pm, 'MG2MIX 2 % par ' + (ch ? 'bande' : 'cycle') + ' • ' + fr(X.sacs) + ' sacs d’aliment de 50 kg', 'mg'));
      const F = X.formule, ph = X.phases;
      const tbl = `<table class="fxt"><thead><tr><th>Matière première (kg / tonne)</th><th>Prix</th>${ph.map((p) => `<th>${esc(p.nom)}<small>${esc(p.age)}</small></th>`).join('')}</tr></thead><tbody>
        ${F.rows.map((r) => `<tr class="${/PREMIX/i.test(r.nom) ? 'px' : ''}"><td>${esc(r.nom)}</td><td>${fr(r.prix)}</td>${r.kg.map((x) => `<td>${x ? fr(x) : '–'}</td>`).join('')}</tr>`).join('')}
        <tr class="tot"><td>Prix de l’aliment fini (FCFA/kg)</td><td></td>${F.prixKg.map((x) => `<td>${fr(x, 1)}</td>`).join('')}</tr>
        <tr class="tot"><td>Prix du sac de 50 kg (FCFA)</td><td></td>${F.prixSac.map((x) => `<td>${fr(x)}</td>`).join('')}</tr>
        <tr><td>Quantité à prévoir (kg)</td><td></td>${ph.map((p) => `<td>${fr(p.qte)}</td>`).join('')}</tr>
        <tr><td>Coût de la phase (FCFA)</td><td></td>${ph.map((p) => `<td>${fr(p.cout)}</td>`).join('')}</tr></tbody></table>`;
      const ctb = `<table class="fxt cmp"><thead><tr><th>Formule</th><th>Prix moyen aliment</th><th>Coût aliment ${ch ? 'bande' : 'cycle'}</th><th>${ch ? 'Coût / poulet' : 'Coût / plaquette'}</th><th>Marge ${ch ? '/ poulet' : '/ plaquette'}</th></tr></thead><tbody>${cmp.map((c) => `<tr class="${c.best ? 'best' : ''} ${c.id === +inp[inp.sp].formule ? 'cur' : ''}"><td>${c.best ? '★ ' : ''}${esc(c.nom)}</td><td>${fr(c.prixMoyen, 1)} F/kg</td><td>${fr(c.coutAliment)}</td><td>${fr(ch ? c.coutPoulet : c.coutPlaq)}</td><td>${fr(c.marge)}</td></tr>`).join('')}</tbody></table>`;
      const part = `Part de l’aliment dans le coût : <b>${fr(X.partAliment * 100, 0)} %</b> • bâtiment ${fr(X.surface)} m²${X.invest ? ' • investissement ' + fEur(X.invest) : ' (existant)'}.`;
      $('#fxOut', b).innerHTML = `<div class="fxks">${kp.join('')}</div><p class="note">${part}</p><h4 class="fxh">Formule ${esc(F.nom)} + MG2MIX 2 %</h4><div class="fxw">${tbl}</div><h4 class="fxh">Comparatif des 4 formules du modèle</h4><div class="fxw">${ctb}</div><details class="fxsens" id="fxSens" ${state.fxSensOpen ? 'open' : ''}><summary>📉 Sensibilité de la marge : prix du maïs ±20 % × prix de vente ±10 %</summary><div id="fxSensB" class="fxw"></div></details>`;
      const sd = $('#fxSens', b); const sensRun = () => { const Z = SKF.sens(o, inp.sp); const pv = Z.prix0;
        $('#fxSensB', b).innerHTML = `<table class="fxt sens"><thead><tr><th>Prix du maïs ↓ / prix de vente ${ch ? 'du poulet' : 'de la plaquette'} →</th>${Z.dv.map((w) => `<th>${w > 0 ? '+' : ''}${fr(w * 100)} %<small>${fr(pv * (1 + w))} F</small></th>`).join('')}</tr></thead><tbody>${Z.rows.map((r) => `<tr class="${r.m === 0 ? 'cur' : ''}"><td>${r.m > 0 ? '+' : ''}${fr(r.m * 100)} % • ${fr(r.mais)} F/kg<small> (coût ${fr(r.cout)} F)</small></td>${r.marges.map((x, j) => `<td class="${x < 0 ? 'neg' : ''} ${r.m === 0 && Z.dv[j] === 0 ? 'base' : ''}">${fr(x)}</td>`).join('')}</tr>`).join('')}</tbody></table><p class="note">Marge brute ${ch ? 'par poulet' : 'par plaquette de 30 œufs'} en FCFA. Rouge = perte. Toutes les autres hypothèses restent identiques.</p>`; };
      if (sd.open) sensRun(); sd.addEventListener('toggle', () => { state.fxSensOpen = sd.open; if (sd.open) sensRun(); });
      const txt = skfResume(inp, R); const tel = $('#fxTel', b).value;
      const wa = $('#fxWa', b); wa.href = tel ? waLink(tel, txt) : 'https://wa.me/?text=' + encodeURIComponent(txt);
    }
    $$('[data-sp]', b).forEach((x) => x.addEventListener('click', () => { inp.sp = x.dataset.sp; renderIn(); tick(); }));
    ['#fxNom', '#fxLoc', '#fxTel', '#fxMail'].forEach((s) => $(s, b).addEventListener('input', tick));
    $('#fxRec', b).addEventListener('change', (e) => { rec = state.pros.find((x) => x.id === e.target.value) || null; inp = rec && rec.simu && rec.simu.inp ? JSON.parse(JSON.stringify(rec.simu.inp)) : skfFromRec(rec); setClient(); renderIn(); renderOut(); });
    $('#fxCopy', b).addEventListener('click', async () => { try { await navigator.clipboard.writeText(skfResume(inp, R)); status('Résumé copié.', 'ok'); } catch (e) { status('Copie impossible dans cette vue.', 'err'); } });
    async function saveSimu(valide) {
      if (!rec) { status('Choisissez d’abord le visiteur dans la liste.', 'err'); return false; }
      const X = inp.sp === 'chair' ? R.chair : R.ponte;
      const simu = { inp: JSON.parse(JSON.stringify(inp)), le: new Date().toISOString(), valide: !!valide, sp: inp.sp, formule: X.formule.nom, effectif: X.effectif, cout: inp.sp === 'chair' ? X.coutPoulet : X.coutPlaq, marge: inp.sp === 'chair' ? X.margePoulet : X.margePlaq, caAn: X.caAn, margeAn: X.margeAn, demarrage: X.demarrage, premixKg: X.premix.chair + X.premix.ponte, premixC: X.premix.chair, premixP: X.premix.ponte, resume: skfResume(inp, R) };
      const sps2 = [inp.sp].concat(inp.sp === 'chair' ? ((+rec.pondeuse || 0) > 0 ? ['ponte'] : []) : ((+rec.chair || 0) > 0 ? ['chair'] : [])); simu.an = simuAn(R, sps2, inp.prix);
      const patch = { simu }; const em = inp.client.email; if (em && em !== rec.email) patch.email = em;
      await prosUpdate(rec.id, patch); rec = state.pros.find((x) => x.id === rec.id) || rec; return true;
    }
    $('#fxSave', b).addEventListener('click', async () => { if (await saveSimu(false)) status('Simulation enregistrée dans la fiche de ' + rec.nom + '.', 'ok'); });
    $('#fxVal', b).addEventListener('click', async () => {
      clean(); if (!(await saveSimu(true))) return;
      const sps = [inp.sp].concat(inp.sp === 'chair' ? ((+rec.pondeuse || 0) > 0 ? ['ponte'] : []) : ((+rec.chair || 0) > 0 ? ['chair'] : []));
      const rep = SKF.report(R, { nom: rec.nom, localite: rec.localite, sps, valide: true });
      $('#fxVal', b).disabled = true; status('Préparation de la fiche PDF et du devis Excel…', '');
      const o = clean(), nm = (o.client.nom || 'client').normalize('NFD').replace(/[\u0300-\u036f]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, ''), sp = inp.sp === 'chair' ? 'Chair' : 'Pondeuses', dt = new Date().toISOString().slice(0, 10);
      const atts = [];
      try { atts.push({ filename: `SOLEVO_Simulation_MG2MIX_${sp}_${nm}_${dt}.pdf`, mime: 'application/pdf', bytes: await formulPdf(inp, R, true) }); } catch (e) { console.error(e); }
      try { atts.push({ filename: `SOLEVO_Devis_MG2MIX_${sp}_${nm}_${dt}.xlsx`, mime: 'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet', bytes: await SKF.exportXlsx(o) }); } catch (e) { console.error(e); }
      status('Envoi de la simulation validée…', '');
      const res = await simuSend(rec, rep, 'valide', atts); $('#fxVal', b).disabled = false;
      if (res.ok) status('Simulation validée envoyée à ' + rec.nom + ' : ' + res.out.join(', ') + '.', 'ok');
      else { status('Simulation validée enregistrée. Envoi : ' + res.out.join(', ') + '. Utilisez le bouton WhatsApp.', 'warn'); }
    });
    $('#fxWa', b).addEventListener('click', () => { if (rec) prosUpdate(rec.id, { msgSimu: 'WhatsApp ' + today().fr }); });
    $('#fxXl', b).addEventListener('click', async () => {
      try { const o = clean(); const u8 = await SKF.exportXlsx(o); const nm = (o.client.nom || 'client').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
        await save(`SOLEVO_Devis_MG2MIX_${inp.sp === 'chair' ? 'Chair' : 'Pondeuses'}_${nm}_${today().iso || new Date().toISOString().slice(0, 10)}.xlsx`, u8); }
      catch (e) { console.error(e); status('Devis Excel impossible : ' + (e.message || e), 'err'); }
    });
    $('#fxPdf', b).addEventListener('click', () => formulPdf(inp, R).catch((e) => { console.error(e); status('Fiche PDF impossible : ' + (e.message || e), 'err'); }));
    renderIn(); renderOut();
  }
  async function formulPdf(inp, R, asBytes) {
    if (!imgs.solevoBig) { try { await loadImages(); } catch (e) { console.error(e); } }
    const ch = inp.sp === 'chair', X = ch ? R.chair : R.ponte, F = X.formule;
    const E = (x) => fr(x, 0) + ' FCFA (≈ ' + fr(x / 656, 0) + ' €)';
    const kv = (ch ? [['Coût de revient par poulet', fr(X.coutPoulet) + ' FCFA'], ['Marge brute par poulet', fr(X.margePoulet) + ' FCFA'], ['Marge brute de la bande', E(X.margeBande)]]
      : [['Coût de revient par œuf', fr(X.coutOeuf, 1) + ' FCFA'], ['Coût par plaquette de 30', fr(X.coutPlaq) + ' FCFA'], ['Marge brute par plaquette', fr(X.margePlaq) + ' FCFA']])
      .concat([['Chiffre d’affaires annuel estimé', E(X.caAn)], ['Marge annuelle après amortissement (estimation)', E(X.margeAn)], ['Investissement bâtiment + équipements', X.invest ? E(X.invest) : 'Bâtiment existant'], ['À prévoir pour démarrer', E(X.demarrage)], ['Retour sur investissement', X.retour ? fr(X.retour * 12, 0) + ' mois' : '—'],
        ['Prémix MG2MIX 2 % nécessaire', ch ? fr(X.premix.chair, 0) + ' kg par bande' : fr(X.premix.chair, 0) + ' kg chair-poulette + ' + fr(X.premix.ponte, 0) + ' kg ponte par cycle']]);
    const head = ['Matière (kg/t)'].concat(X.phases.map((p) => p.nom + '\n' + p.age));
    const body = [head.map((t) => ({ text: t, bold: true, color: 'white', fillColor: '#002060', fontSize: 7.5 }))]
      .concat(F.rows.map((r) => [r.nom].concat(r.kg.map((x) => (x ? fr(x) : '–'))).map((t, i) => ({ text: String(t), fontSize: 8, alignment: i ? 'center' : 'left', bold: /PREMIX/i.test(r.nom), color: /PREMIX/i.test(r.nom) ? '#2E7D1F' : '#000' }))))
      .concat([['Prix aliment (FCFA/kg)'].concat(F.prixKg.map((x) => fr(x, 1))), ['Sac de 50 kg (FCFA)'].concat(F.prixSac.map((x) => fr(x))), ['Quantité à prévoir (kg)'].concat(X.phases.map((p) => fr(p.qte)))].map((row) => row.map((t, i) => ({ text: String(t), fontSize: 8, bold: true, alignment: i ? 'center' : 'left', fillColor: '#EAF6E6' }))));
    const dd = { pageSize: 'A4', pageMargins: [32, 30, 32, 36], defaultStyle: { fontSize: 10 },
      content: [
        { columns: [imgs.solevoBig ? { image: imgs.solevoBig, width: 120 } : { text: 'SOLEVO', bold: true, fontSize: 20, color: '#002060' }, { stack: [{ text: 'SIMULATION FORMULATION & RENTABILITÉ', bold: true, color: '#002060', fontSize: 13, alignment: 'right' }, { text: 'Prémix MG2MIX 2 % – ' + (ch ? 'poulet de chair' : 'pondeuses'), alignment: 'right', color: '#37A028', bold: true }, { text: 'SELAB SHOW – ' + today().fr, alignment: 'right', fontSize: 9, color: '#555' }] }] },
        { canvas: [{ type: 'rect', x: 0, y: 6, w: 531, h: 3, color: '#37A028' }] },
        { margin: [0, 8, 0, 6], text: [{ text: 'Client : ', bold: true }, (inp.client.nom || '—') + (inp.client.localite ? ' • ' + inp.client.localite : '') + (inp.client.tel ? ' • ' + inp.client.tel : '')] },
        { text: ch ? `${fr(X.effectif)} poussins mis en place • bande de ${fr(X.duree)} jours • ${fr(X.vendus)} poulets vendus • ${fr(X.bandes)} bandes/an` : `${fr(X.effectif)} poussins ponte • cycle de ${fr(X.duree)} jours • ${fr(X.plaquettes)} plaquettes vendables`, fontSize: 9, color: '#444', margin: [0, 0, 0, 6] },
        { table: { widths: ['*', 'auto'], body: kv.map(([a, c]) => [{ text: a, fontSize: 9.5 }, { text: c, bold: true, fontSize: 9.5, alignment: 'right' }]) }, layout: 'lightHorizontalLines' },
        { text: 'Formule ' + F.nom + ' + MG2MIX 2 % (kg par tonne d’aliment)', bold: true, color: '#002060', margin: [0, 12, 0, 4] },
        { table: { headerRows: 1, widths: ['*'].concat(X.phases.map(() => 'auto')), body }, layout: 'lightHorizontalLines' },
        { text: 'Comparatif des formules : ' + R.comp[inp.sp].map((c) => c.nom + ' ' + fr(c.marge) + ' F' + (c.best ? ' (la plus rentable)' : '')).join(' • ') + (ch ? ' (marge / poulet)' : ' (marge / plaquette)'), fontSize: 8.5, margin: [0, 8, 0, 0], color: '#333' },
        { text: 'Estimation indicative issue du modèle SOLEVO, avant impôts et frais financiers ; les prix appliqués lors de l’achat peuvent varier. 1 € = 656 FCFA.', fontSize: 8, italics: true, color: '#666', margin: [0, 10, 0, 0] },
        { text: 'Contacts SOLEVO Côte d’Ivoire : Elvis LEHITO – 07 77 19 09 94 – elvis.lehito@solevogroup.com', fontSize: 9, bold: true, color: '#002060', margin: [0, 6, 0, 0] }] };
    const blob = await pdfMake.createPdf(dd).getBlob();
    if (asBytes) return new Uint8Array(await blob.arrayBuffer());
    const nm = (inp.client.nom || 'client').normalize('NFD').replace(/[̀-ͯ]/g, '').replace(/[^A-Za-z0-9]+/g, '_').replace(/^_|_$/g, '');
    await save(`SOLEVO_Simulation_MG2MIX_${ch ? 'Chair' : 'Pondeuses'}_${nm}.pdf`, blob);
  }
  function initStand() {
    renderTeam();
    $('#prosExport').addEventListener('click', prosExport); $('#prosFilter').addEventListener('change', renderPros);
    $('#prosAdd').addEventListener('click', () => editVisitor(null));
    $('#prosImport').addEventListener('click', importWa);
    $('#prosCfg').addEventListener('click', editCfg);
    $('#prosKiosk').addEventListener('click', kioskOpen);
    $('#prosKioskWa').addEventListener('click', sendKioskLink);
    $('#prosAppel').addEventListener('click', appelOpen); $('#appelX').addEventListener('click', () => { $('#appel').hidden = true; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); });
    $('#prosBilan').addEventListener('click', bilanOpen);
    $('#prosReplies').addEventListener('click', () => checkReplies(true));
    $('#prosFinal').addEventListener('click', finalOpen);
    $('#prosAcces').addEventListener('click', accesOpen);
    $('#prosRep').addEventListener('click', repOpen);
    $('#prosDup').addEventListener('click', dupOpen);
    $('#prosMkt').addEventListener('click', mktOpen);
    $('#prosFormul').addEventListener('click', () => formulOpen(null));
    $('#prosQr').addEventListener('click', () => qrPrint().catch((e) => { console.error(e); status('PDF des QR codes impossible : ' + (e.message || e), 'err'); }));
    $('#borneX').addEventListener('click', kioskClose);
    $('#agX').addEventListener('click', () => { $('#agents').hidden = true; });
    $('#prosAgents').addEventListener('click', () => agentsOpen());
    $('#agTable').addEventListener('change', renderAgents);
    $('#skModalX').addEventListener('click', modalClose);
    $('#skModal').addEventListener('click', (e) => { if (e.target.id === 'skModal') modalClose(); });
    $('#prosFiche').addEventListener('click', ficheOpen);
    try {
      const h = decodeURIComponent(location.hash + location.search);
      const m = h.match(/entretien(?:=([^&#]+))?/i);
      if (/borne/i.test(h)) setTimeout(kioskOpen, 800);
      else if (/fiche/i.test(h)) setTimeout(ficheOpen, 800);
      else if (m) setTimeout(() => agentsOpen(m[1] || null), 800);
      else if (/appel/i.test(h)) setTimeout(appelOpen, 800);
    } catch (e) { /* */ }
  }
  function temoPhoto(w) { const t = (state.temo || {})[w] || {}; return t.ok && t.photoOk && t.photo ? t.photo : null; }
  function temoImgs() { imgs.temoElev = temoPhoto('Elev'); imgs.temoProd = temoPhoto('Prod'); }
  async function dataUrlBytes(u) { const r = await fetch(u); return new Uint8Array(await r.arrayBuffer()); }
  function readPhoto(file) {
    return new Promise((res, rej) => {
      const fr2 = new FileReader(); fr2.onerror = rej;
      fr2.onload = () => { const im = new Image(); im.onerror = rej; im.onload = () => {
        const sz = 400, c = document.createElement('canvas'); c.width = c.height = sz; const g = c.getContext('2d');
        const m = Math.min(im.width, im.height); g.drawImage(im, (im.width - m) / 2, (im.height - m) / 2, m, m, 0, 0, sz, sz);
        res(c.toDataURL('image/png')); }; im.src = fr2.result; };
      fr2.readAsDataURL(file);
    });
  }
  /* ---- témoignages (diapo ajoutée seulement si renseignée et accord donné) ---- */
  function temoForm() {
    const T = state.temo || {};
    const f = (w, lab) => {
      const t = T[w] || {};
      return `<details class="temo"><summary>Témoignage ${lab} ${t.ok && t.citation && t.nom ? '<em>• affiché</em>' : '<i>• non renseigné</i>'}</summary>
        <div class="temo-g"><label>Nom<input data-tw="${w}" data-tk="nom" value="${t.nom || ''}"></label><label>Profil<input data-tw="${w}" data-tk="profil" value="${t.profil || ''}" placeholder="${w === 'Elev' ? 'Éleveur de 5 000 poulets de chair' : 'Producteur de 5 ha de maïs'}"></label>
        <label>Localité<input data-tw="${w}" data-tk="lieu" value="${t.lieu || ''}"></label><label>Date<input data-tw="${w}" data-tk="date" value="${t.date || ''}" placeholder="jj/mm/aaaa"></label>
        <label class="w2">Citation (ses propres mots)<textarea data-tw="${w}" data-tk="citation" rows="2">${t.citation || ''}</textarea></label>
        <label>Chiffre clé<input data-tw="${w}" data-tk="chiffre" value="${t.chiffre || ''}" placeholder="${w === 'Elev' ? '−12 %' : '+25 %'}"></label><label>Libellé du chiffre<input data-tw="${w}" data-tk="chiffreL" value="${t.chiffreL || ''}" placeholder="${w === 'Elev' ? 'sur son coût d’aliment' : 'sur son prix de vente'}"></label>
        <label class="w2 chk"><input type="checkbox" data-tw="${w}" data-tk="ok" ${t.ok ? 'checked' : ''}> La personne a donné son accord pour la diffusion de son nom et de ses propos</label>
        <div class="w2 temo-ph">${t.photo ? `<img src="${t.photo}" alt="Photo du témoin">` : '<span class="nop">Pas de photo</span>'}
          <label>Photo (facultative)<input type="file" accept="image/*" data-tph="${w}"></label>${t.photo ? `<button type="button" data-tdel="${w}">Retirer la photo</button>` : ''}</div>
        <label class="w2 chk"><input type="checkbox" data-tw="${w}" data-tk="photoOk" ${t.photoOk ? 'checked' : ''}> La personne a donné son accord pour la diffusion de sa photo</label></div></details>`;
    };
    $('#temoBox').innerHTML = f('Elev', 'éleveur') + f('Prod', 'producteur');
    $$('#temoBox [data-tw]').forEach((i) => i.addEventListener('change', () => {
      const w = i.dataset.tw; state.temo[w] = state.temo[w] || {};
      state.temo[w][i.dataset.tk] = i.type === 'checkbox' ? i.checked : i.value.trim();
      try { localStorage.setItem('sk_temo', JSON.stringify(state.temo)); } catch (e) { /* */ }
      recalc(); temoImgs(); temoForm(); refreshMenu();
    }));
    const saveT = () => { try { localStorage.setItem('sk_temo', JSON.stringify(state.temo)); } catch (e) { status('Photo trop lourde pour être gardée dans ce navigateur.', 'err'); } };
    $$('#temoBox [data-tph]').forEach((i) => i.addEventListener('change', async () => {
      const w = i.dataset.tph; if (!i.files[0]) return;
      try { state.temo[w] = state.temo[w] || {}; state.temo[w].photo = await readPhoto(i.files[0]); saveT(); temoImgs(); temoForm(); renderDocs(); } catch (e) { status('Image illisible.', 'err'); }
    }));
    $$('#temoBox [data-tdel]').forEach((b) => b.addEventListener('click', () => { const w = b.dataset.tdel; if (state.temo[w]) delete state.temo[w].photo; saveT(); temoImgs(); temoForm(); renderDocs(); }));
  }
  /* ---- présentation « Coûts & devis MG2MIX » : diapos calculées en direct par le modèle SOLEVO ---- */
  const FXDECK = { short: 'fx', menu: 'Coûts & devis MG2MIX', foot: 'SOLEVO Côte d’Ivoire • Prémix MG2MIX 2 % • Simulation calculée avec le modèle de formulation SOLEVO', live: true,
    slides: [
      { fx: 'cover', type: 'cover', notes: 'OBJECTIF : montrer en 3 chiffres ce que coûte vraiment un poulet et un œuf avec le prémix SOLEVO.\nCONSEIL : régler d’abord le cheptel du visiteur (barre du haut) ou choisir son nom pour reprendre ses prix.' },
      { fx: 'formChair', title: 'Aliment formulé MG2MIX : poulet de chair', notes: 'MESSAGE CLÉ : avec 2 % de prémix MG2MIX, l’éleveur fabrique son aliment complet à ce prix, phase par phase.\nCONSEIL : comparer avec le prix du sac d’aliment qu’il achète aujourd’hui.' },
      { fx: 'formPonte', title: 'Aliment formulé MG2MIX : poulette et pondeuse', notes: 'MESSAGE CLÉ : un programme complet de la poussine à la fin de ponte, avec prémix chair en démarrage puis prémix ponte.\nCONSEIL : insister sur la phase « entrée en ponte », la plus consommatrice.' },
      { fx: 'coutChair', title: 'Coût de production du poulet de chair', notes: 'MESSAGE CLÉ : l’aliment pèse la plus grande part du coût ; c’est là que le prémix SOLEVO fait gagner.\nCHIFFRES : coût de revient, indice de consommation, marge par poulet et par bande.' },
      { fx: 'coutPonte', title: 'Coût de la poulette et de l’œuf', notes: 'MESSAGE CLÉ : le coût de l’œuf et de la plaquette se décide dès l’élevage de la poulette.\nCONSEIL : comparer le coût de la plaquette au prix de vente local.' },
      { fx: 'marges', title: 'Marges : simulation selon le prix du maïs', notes: 'MESSAGE CLÉ : même avec un maïs plus cher, la marge reste positive ; un maïs sous contrat SISSÊ~KABA sécurise la marge.\nPOINT DE VIGILANCE : estimations avant impôts et frais financiers.' },
      { fx: 'devisChair', title: 'Devis estimatif : poulet de chair', notes: 'OBJECTIF : chiffrer le projet du visiteur selon sa quantité (barre du haut).\nCONSEIL : si le bâtiment existe déjà, choisir « Bâtiment existant ».' },
      { fx: 'devisPonte', title: 'Devis estimatif : pondeuses', notes: 'OBJECTIF : chiffrer un élevage de pondeuses selon la quantité choisie.\nCONSEIL : remettre la fiche PDF ou le devis Excel depuis la fenêtre « Formulation & rentabilité ».' },
      { fx: 'besoin', title: 'Votre besoin en prémix MG2MIX', full: true, notes: 'CONCLUSION : inscrire le visiteur et programmer la visite du technicien pour valider la formule sur son élevage.' }] };
  const allDecks = () => SKD.short.concat([FXDECK]);
  PZ.fx = { chair: 1000, ponte: 1000, cf: 1, pf: 1, bat: 'neuf', rec: '' };
  function fxInput() {
    const B = SKF.base(), P = PZ.fx; const r = P.rec ? state.pros.find((x) => x.id === P.rec) : null;
    const base = r ? skfFromRec(r) : { prix: {}, chair: Object.assign({}, B.chair), ponte: Object.assign({}, B.ponte) };
    const inp = { prix: base.prix || {}, batiment: P.bat, chair: Object.assign({}, base.chair, { effectif: P.chair, formule: P.cf }), ponte: Object.assign({}, base.ponte, { effectif: P.ponte, formule: P.pf }) };
    ['chair', 'ponte'].forEach((sp) => SKF.PAR[sp].forEach(([k, , , u]) => { if (u === '%' && inp[sp][k] > 1) inp[sp][k] = inp[sp][k] / 100; }));
    return { inp, r };
  }
  function fxBar() {
    const P = PZ.fx; const L = state.pros.filter((x) => x.veille && Object.keys(x.veille).some((k) => +x.veille[k] > 0)).slice(-60).reverse();
    return `<div class="pz-fxbar"><label>Poulets de chair<input type="number" min="100" step="100" data-fxb="chair" value="${P.chair}"></label><label>Pondeuses<input type="number" min="100" step="100" data-fxb="ponte" value="${P.ponte}"></label>
      <label>Formule chair<select data-fxb="cf">${SKF.CHAIR_F.map((f) => `<option value="${f.id}" ${+P.cf === f.id ? 'selected' : ''}>${esc(f.nom)}</option>`).join('')}</select></label>
      <label>Formule ponte<select data-fxb="pf">${SKF.PONTE_F.map((f) => `<option value="${f.id}" ${+P.pf === f.id ? 'selected' : ''}>${esc(f.nom)}</option>`).join('')}</select></label>
      <label>Bâtiment<select data-fxb="bat"><option value="neuf" ${P.bat === 'neuf' ? 'selected' : ''}>À construire</option><option value="existant" ${P.bat === 'existant' ? 'selected' : ''}>Existant</option></select></label>
      <label>Prix utilisés<select data-fxb="rec"><option value="">Référence SOLEVO</option>${L.map((x) => `<option value="${x.id}" ${P.rec === x.id ? 'selected' : ''}>Veille de ${esc(x.nom)} (${esc(x.localite || '')})</option>`).join('')}</select></label></div>`;
  }
  const eur1 = (x) => `<i>${eurS(x)}</i>`;
  function fxSlide(s, d, F) {
    const { inp, r } = fxInput(); const R = SKF.compute(inp); const c = R.chair, p = R.ponte;
    const who = r ? 'Prix déclarés par ' + esc(r.nom) + (r.localite ? ' (' + esc(r.localite) + ')' : '') : 'Prix de référence SOLEVO (registre terrain)';
    const hd = (t, sub) => `<div class="pz-hd"><span>${d.menu}</span><span>${PZ.i + 1} / ${d.slides.length}</span></div>${fxBar()}<h2>${t}</h2><p class="pz-subt">${sub}</p>`;
    const K = (v, l, n) => k3(v, l, n);
    const T = (head, rows, cls) => `<table class="pz-tbl ${cls || ''}"><thead><tr>${head.map((h) => `<th>${h}</th>`).join('')}</tr></thead><tbody>${rows.map((rw) => `<tr class="${rw.st ? 'st' : ''}">${rw.c.map((x) => `<td>${x}</td>`).join('')}</tr>`).join('')}</tbody></table>`;
    const formT = (X) => { const F2 = X.formule; const main = F2.rows.filter((x) => x.kg.some((k) => k >= 15) || /PREMIX/i.test(x.nom));
      return T(['kg par tonne'].concat(X.phases.map((ph) => `${esc(ph.nom)}<small>${esc(ph.age)}</small>`)),
        main.map((x) => ({ c: [esc(x.nom.replace(/MG2MIX 2\s?%/i, 'MG2MIX 2 %').replace(/\s*C[ôo]te d.Ivoire/i, '').replace(/^T\.\s?/, 'Tourteau de ').replace(/^MAIS\b/i, 'Maïs').replace(/^SON de BLE/i, 'Son de blé').replace(/^COQUILLES LAGUNES/i, 'Coquillages').replace(/^PREMIX/i, 'Prémix').replace(/\b(SOJA|COTON|CHAIR|PONTE|POISSON|PALME|HUILE|FARINE)\b/g, (m) => m.toLowerCase()).replace('2 %', '2\u00a0%'))].concat(x.kg.map((k) => (k ? fr(k) : '–'))), st: /PREMIX/i.test(x.nom) }))
          .concat([{ st: true, c: ['Prix de l’aliment (FCFA/kg)'].concat(F2.prixKg.map((k) => fr(k, 1))) }, { st: true, c: ['Sac de 50 kg (FCFA)'].concat(F2.prixSac.map((k) => fr(k))) }]), 'pz-fxt pz-dv'); };
    if (s.fx === 'cover') {
      return `<div class="pz-cover pz-cv-eleveur"><div class="cv-deco"><i></i><i></i><i></i></div><div class="cv-main">
        <div class="cv-logos"><img src="assets/solevo_big.png" alt="SOLEVO"><span></span><img src="assets/logo_sisse.png" alt="SISSÊ~KABA"></div>
        <div class="cv-tag">Prémix MG2MIX 2 % • Simulation réelle</div><h1>Coûts formulés, coûts de production et devis</h1>
        <p class="cv-sub">Poulet de chair, poulette et œuf : ce que coûte votre production avec les prémix SOLEVO, et ce qu’elle rapporte.</p><div class="cv-bar"></div>
        <dl class="cv-meta"><div><dt>Élevages simulés</dt><dd>${fr(c.effectif)} poulets • ${fr(p.effectif)} pondeuses</dd></div><div><dt>Prix utilisés</dt><dd>${who}</dd></div><div><dt>Présenté par</dt><dd>Elvis LEHITO<br><small>Key Account Manager FEED • SOLEVO Côte d’Ivoire</small></dd></div></dl>${fxBar()}</div>
        <div class="cv-figs"><div><b>${fr(c.coutPoulet)} F</b><span>coût de revient d’un poulet</span></div><div><b>${fr(p.coutOeuf, 1)} F</b><span>coût de production d’un œuf</span></div><div><b>${fr(c.margePoulet)} F</b><span>marge brute par poulet (${eurS(c.margeBande)} par bande)</span></div></div>
        <div class="cv-foot"><span>SOLEVO Côte d’Ivoire</span><span>FEED</span><span>Dépensez moins, gagnez plus</span></div></div>`;
    }
    let h = '';
    if (s.fx === 'formChair') h = hd(s.title, `Formule ${esc(c.formule.nom)} + MG2MIX 2 % • ${who}`) + `<div class="pz-blocks">${formT(c)}</div><p class="pz-note">Formule la plus rentable du modèle : ${esc(R.comp.chair.find((x) => x.best).nom)} • prix moyen de l’aliment sur la bande : ${fr(c.coutAliment / (c.aliment || 1), 1)} FCFA/kg.</p>`;
    else if (s.fx === 'formPonte') h = hd(s.title, `Formule ${esc(p.formule.nom)} + MG2MIX 2 % • ${who}`) + `<div class="pz-blocks">${formT(p)}</div><p class="pz-note">Prémix chair jusqu’à 18 semaines, puis prémix ponte • formule la plus rentable : ${esc(R.comp.ponte.find((x) => x.best).nom)}.</p>`;
    else if (s.fx === 'coutChair') h = hd(s.title, `${fr(c.effectif)} poussins • bande de ${fr(c.duree)} jours • ${fr(c.vendus)} poulets vendus de ${fr(inp.chair.poids || SKF.base().chair.poids, 1)} kg`) +
      `<div class="pz-blocks"><div class="pz-grid three">${K(fr(c.coutPoulet) + ' F', 'coût de revient par poulet', fr(c.coutKgVif) + ' FCFA/kg vif')}${K(fr(c.ic, 2), 'indice de consommation', fr(c.aliment / 1000, 1) + ' t d’aliment par bande')}${K(fr(c.partAliment * 100) + ' %', 'part de l’aliment dans le coût', fr(c.coutAliment) + ' FCFA d’aliment')}${K(fr(c.margePoulet) + ' F', 'marge brute par poulet', 'vendu ' + fr(c.prixVente) + ' FCFA (' + fr(c.margePct * 100) + ' %)')}${K(fr(c.margeBande / 1e6, 2) + ' M', 'marge brute de la bande (FCFA)', eurS(c.margeBande))}${K(fr(c.margeAn / 1e6, 2) + ' M', 'marge annuelle après amortissement', eurS(c.margeAn) + ' • ' + fr(c.bandes) + ' bandes/an')}</div></div>`;
    else if (s.fx === 'coutPonte') h = hd(s.title, `${fr(p.effectif)} poussins ponte • cycle de 78 semaines • ${fr(p.plaquettes)} plaquettes vendables`) +
      `<div class="pz-blocks"><div class="pz-grid three">${K(fr(p.coutPoulette) + ' F', 'coût d’une poulette à 18 semaines')}${K(fr(p.coutOeuf, 1) + ' F', 'coût de production d’un œuf')}${K(fr(p.coutPlaq) + ' F', 'coût d’une plaquette de 30 œufs', 'vendue ' + fr(p.prixPlaq) + ' FCFA')}${K(fr(p.margePlaq) + ' F', 'marge brute par plaquette')}${K(fr(p.margePlaq * p.plaquettes / 1e6, 2) + ' M', 'marge brute du cycle (FCFA)', eurS(p.margePlaq * p.plaquettes))}${K(fr(p.margeAn / 1e6, 2) + ' M', 'marge annuelle après amortissement', eurS(p.margeAn))}</div></div>`;
    else if (s.fx === 'marges') {
      const Zc = SKF.sens(inp, 'chair', [-0.2, -0.1, 0, 0.1, 0.2], [0]), Zp = SKF.sens(inp, 'ponte', [-0.2, -0.1, 0, 0.1, 0.2], [0]);
      h = hd(s.title, `Toutes les autres hypothèses identiques • ${who}`) + `<div class="pz-blocks">${T(['Prix du maïs', 'Coût d’un poulet', 'Marge / poulet', 'Marge / bande', 'Coût d’une plaquette', 'Marge / plaquette'],
        Zc.rows.map((rw, i) => { const q = Zp.rows[i]; return { st: rw.m === 0, c: [`${rw.m > 0 ? '+' : ''}${fr(rw.m * 100)} % • ${fr(rw.mais)} F/kg`, fr(rw.cout) + ' F', fr(rw.marges[0]) + ' F', fr(rw.marges[0] * c.vendus / 1e6, 2) + ' M' + `<small>${eurS(rw.marges[0] * c.vendus)}</small>`, fr(q.cout) + ' F', fr(q.marges[0]) + ' F'] }; }), 'pz-dv')}</div><p class="pz-note">Prix de vente retenus : ${fr(c.prixVente)} FCFA le poulet, ${fr(p.prixPlaq)} FCFA la plaquette • estimations avant impôts et frais financiers.</p>`;
    } else if (s.fx === 'devisChair' || s.fx === 'devisPonte') {
      const ch = s.fx === 'devisChair', X = ch ? c : p;
      const mF = (v) => (Math.abs(v) >= 1e6 ? fr(v / 1e6, 2) + ' M' : fr(v));
      const row = (l, v, st) => ({ st, c: [l, mF(v), eurS(v)] });
      const rows = (X.invest ? [{ c: ['Bâtiment (' + fr(X.surface) + ' m²)', mF(X.batiment), eurS(X.batiment)] }, row('Équipements', X.equipements), row('Investissement total', X.invest, true)] : [{ c: ['Bâtiment et équipements', 'existants', '—'] }])
        .concat([row(ch ? 'Charges d’une bande' : 'Charges du cycle', ch ? X.chargesBande : X.chargesCycle), row('À prévoir pour démarrer', X.demarrage, true), row('Chiffre d’affaires par an', X.caAn), row('Marge brute par an', X.margeBruteAn), row('Marge annuelle après amortissement', X.margeAn, true)]);
      h = hd(s.title + ` – ${fr(X.effectif)} ${ch ? 'poulets' : 'pondeuses'}`, `Devis estimatif calculé avec le modèle SOLEVO • ${who}`) + `<div class="pz-blocks"><div class="pz-fxdv">${T(['Poste', 'FCFA', 'Euros'], rows, 'pz-dv')}<div class="pz-grid one">${K(X.retour ? fr(X.retour * 12, 0) + ' mois' : '—', 'retour sur investissement')}${K(fr(X.mensuel / 1e3, 0) + ' k', 'FCFA de marge par mois', eurS(X.mensuel))}</div></div></div><p class="pz-note">Devis indicatif : les prix des matériaux, des poussins et de l’aliment varient selon la zone et la date d’achat. Devis Excel détaillé disponible auprès de votre conseiller SOLEVO.</p>`;
    } else if (s.fx === 'besoin') {
      h = hd(s.title, 'Prémix MG2MIX 2 % nécessaire pour les élevages simulés') + `<div class="pz-blocks"><div class="pz-grid">${K(fr(c.premix.chair) + ' kg', 'prémix chair par bande de ' + fr(c.effectif) + ' poulets', fr(c.premix.chair * c.bandes / 1000, 2) + ' t par an')}${K(fr(p.premix.chair + p.premix.ponte) + ' kg', 'prémix par cycle de ' + fr(p.effectif) + ' pondeuses', fr(p.premix.chair) + ' kg chair + ' + fr(p.premix.ponte) + ' kg ponte')}${K(fr(c.sacs + p.sacs), 'sacs d’aliment de 50 kg fabriqués', 'chair ' + fr(c.sacs) + ' • pondeuses ' + fr(p.sacs))}</div><div class="pz-cta"><b>Prochaine étape</b><span>Votre technicien SOLEVO valide la formule sur votre élevage et organise la première livraison de MG2MIX depuis le dépôt le plus proche.</span><em>Elvis LEHITO • Key Account Manager FEED • +225 07 77 19 09 94</em></div></div>`;
    }
    return h + `<div class="pz-dots">${d.slides.map((_, j) => `<i class="${j === PZ.i ? 'on' : ''}"></i>`).join('')}</div>`;
  }
  function fxBind() {
    $$('#pzSlide [data-fxb]').forEach((i) => i.addEventListener('change', () => { const k = i.dataset.fxb; PZ.fx[k] = /chair|ponte|cf|pf/.test(k) ? Math.max(1, +i.value || 1) : i.value; pzRender(); }));
  }
  function pzRender() {
    const d = allDecks().find((x) => x.short === PZ.deck); const sl = visSlides(d);
    if (d.live) {
      PZ.i = (PZ.i + sl.length) % sl.length; const s = sl[PZ.i]; const el = $('#pzSlide');
      el.classList.toggle('is-cover', s.type === 'cover'); $('#prez').classList.toggle('on-cover', s.type === 'cover');
      if (!window.SKF || !SKF.loaded()) { el.innerHTML = '<div class="pz-load">Chargement du modèle de formulation SOLEVO…</div>'; skfReady().then(pzRender).catch((e) => { el.innerHTML = '<div class="pz-load">Modèle indisponible : ' + esc(e.message || e) + '</div>'; }); return; }
      try { el.innerHTML = fxSlide(s, d, (t) => t); } catch (e) { console.error(e); el.innerHTML = '<div class="pz-load">Calcul impossible : ' + esc(e.message || e) + '</div>'; }
      fxBind();
      $('#pzNotes').innerHTML = s.notes ? `<b>Commentaires orateur — diapositive ${PZ.i + 1}</b>${esc(s.notes).replace(/\n/g, '<br>')}` : '';
      $('#pzNotes').hidden = !PZ.notes; $('#pzNotesBtn').classList.toggle('on', PZ.notes);
      $('#pzNum').textContent = (PZ.i + 1) + ' / ' + sl.length; $('#pzScen').textContent = d.menu; $('#pzFoot').textContent = d.foot; $('#pzDeck').value = PZ.deck;
      $('#prez').style.setProperty('--pzf', PZ.f);
      return;
    }
    PZ.i = (PZ.i + sl.length) % sl.length; const s = sl[PZ.i];
    const S = state.V.S; const F = (t) => SKG.fill(t, S);
    const el = $('#pzSlide');
    el.classList.toggle('is-cover', s.type === 'cover'); $('#prez').classList.toggle('on-cover', s.type === 'cover');
    if (s.type === 'cover') el.innerHTML = pzCover(s, d, F);
    else {
      const bl = s.blocks || [];
      el.innerHTML = `<div class="pz-hd"><span>${d.menu}</span><span>${PZ.i + 1} / ${sl.length}</span></div><h2>${F(s.title)}</h2>${s.sub ? `<p class="pz-subt">${F(s.sub)}</p>` : ''}
        <div class="pz-blocks">${bl.map((b) => pzBlock(b, F)).join('')}</div>${s.calc ? pzCalcHtml(s.calc) : ''}${(s.comments || []).length ? `<p class="pz-note">${s.comments.map(F).join(' • ')}</p>` : ''}
        <div class="pz-dots">${sl.map((_, j) => `<i class="${j === PZ.i ? 'on' : ''}"></i>`).join('')}</div>`;
    }
    if (s.calc) pzCalcBind(s.calc);
    $('#pzNotes').innerHTML = s.notes ? `<b>Commentaires orateur — diapositive ${PZ.i + 1}</b>${F(s.notes).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/\n/g, '<br>')}` : '';
    $('#pzNotes').hidden = !PZ.notes; $('#pzNotesBtn').classList.toggle('on', PZ.notes);
    $('#pzNum').textContent = (PZ.i + 1) + ' / ' + sl.length; $('#pzScen').textContent = d.menu;
    $('#pzFoot').textContent = d.foot; $('#pzDeck').value = PZ.deck;
    $('#prez').style.setProperty('--pzf', PZ.f);
  }
  function refreshMenu() { if (window.__skRefreshMenu) window.__skRefreshMenu(); }
  function pzAuto(on) { clearInterval(PZ.timer); PZ.timer = on ? setInterval(() => { PZ.i++; pzRender(); }, 10000) : null; $('#pzAuto').classList.toggle('on', !!on); }
  function pzOpen(deck) { PZ.deck = deck || PZ.deck; PZ.i = 0; $('#pzMenu').hidden = true; $('#prez').hidden = false; pzRender(); const el = $('#prez'); if (el.requestFullscreen) el.requestFullscreen().catch(() => {}); }
  function pzClose() { pzAuto(false); $('#prez').hidden = true; if (document.fullscreenElement) document.exitFullscreen().catch(() => {}); }
  function initPrez() {
    qrRefresh();
    const qi = $('#qrLink'); if (qi) { qi.value = state.qrLink; $('#qrPrev').src = imgs.qr || ''; }
    if (qi) qi.addEventListener('change', () => {
      const v = qi.value.trim() || SKD.QR_DEFAULT; state.qrLink = v; qi.value = v;
      try { localStorage.setItem('sk_qr', v); } catch (e) { /* */ }
      qrRefresh(); $('#qrPrev').src = imgs.qr || ''; renderDocs();
    });
    $('#qrReset').addEventListener('click', () => { qi.value = ''; qi.dispatchEvent(new Event('change')); });
    $('#qrTest').addEventListener('click', () => { window.open(state.qrLink, '_blank', 'noopener'); });
    $('#prezBtn').addEventListener('click', () => { refreshMenu(); temoForm(); $('#pzMenu').hidden = false; });
    const DESC = { selab: 'Éleveurs, producteurs, partenaires • 20–22 novembre 2026', codir: 'Objectifs, économie du programme, décisions attendues', it: 'Cadrage fonctionnel et technique de la plateforme', eleveur: 'Court et concret : maïs −15 %, besoins de l’élevage, inscription', producteur: 'Court et concret : +30 % sur le prix, recettes par hectare, inscription', fx: 'Aliment formulé, coût du poulet, de la poulette et de l’œuf, marges et devis selon la quantité' };
    window.__skRefreshMenu = () => {
    const card = (d, i) => `<button data-pzopen="${d.short}" class="pzm-c c${i + 1}"><em>${visSlides(d).length} diapos</em><b>${d.menu}</b><span>${DESC[d.short] || ''}</span></button>`;
    $('#pzmList').innerHTML = '<div class="pzm-sep">Présentations</div>' + SKD.short.slice(0, 3).map(card).join('') + '<div class="pzm-sep">Stand SOLEVO : visiteurs</div>' + SKD.short.slice(3).map((d, i) => card(d, i + 3)).join('') + card(FXDECK, 5);
    $('#pzDeck').innerHTML = allDecks().map((d) => `<option value="${d.short}">${d.menu} (${visSlides(d).length})</option>`).join('');
    $$('[data-pzopen]').forEach((b) => b.addEventListener('click', () => pzOpen(b.dataset.pzopen)));
    };
    window.__skRefreshMenu();
    $('#pzMenu').addEventListener('click', (e) => { if (e.target.id === 'pzMenu' || e.target.dataset.pzm === 'close') $('#pzMenu').hidden = true; });
    $('#pzDeck').addEventListener('change', (e) => { PZ.deck = e.target.value; PZ.i = 0; pzRender(); });
    $$('[data-pz]').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.pz;
      if (a === 'next') { PZ.i++; pzRender(); } else if (a === 'prev') { PZ.i--; pzRender(); } else if (a === 'auto') pzAuto(!PZ.timer);
      else if (a === 'notes') { PZ.notes = !PZ.notes; pzRender(); }
      else if (a === 'z+') { PZ.f = Math.min(1.6, PZ.f + 0.1); pzRender(); } else if (a === 'z-') { PZ.f = Math.max(0.6, PZ.f - 0.1); pzRender(); } else if (a === 'close') pzClose();
    }));
    window.addEventListener('keydown', (e) => {
      if (!$('#pzMenu').hidden && e.key === 'Escape') { $('#pzMenu').hidden = true; return; }
      if ($('#prez').hidden) return;
      if (e.key === 'Escape') { pzClose(); return; }
      if (e.target.tagName === 'INPUT' || e.target.tagName === 'SELECT' || e.target.tagName === 'TEXTAREA') return;
      if (e.key === 'ArrowRight' || e.key === ' ' || e.key === 'PageDown') { e.preventDefault(); PZ.i++; pzRender(); }
      else if (e.key === 'ArrowLeft' || e.key === 'PageUp') { e.preventDefault(); PZ.i--; pzRender(); }
      else if (e.key === 'Home') { PZ.i = 0; pzRender(); } else if (e.key === 'End') { PZ.i = -1; pzRender(); }
      else if (e.key === 'n' || e.key === 'N') { PZ.notes = !PZ.notes; pzRender(); }
      else if (e.key === 'Escape') pzClose(); else if (e.key === 'a' || e.key === 'A') pzAuto(!PZ.timer);
    });
    let x0 = null; $('#prez').addEventListener('touchstart', (e) => { x0 = e.touches[0].clientX; }, { passive: true });
    $('#prez').addEventListener('touchend', (e) => { if (x0 === null) return; const dx = e.changedTouches[0].clientX - x0; if (Math.abs(dx) > 50) { PZ.i += dx < 0 ? 1 : -1; pzRender(); } x0 = null; });
  }

  /* ---------- documents ---------- */
  function docList() {
    const t = state.tag, d = today().iso;
    const nm = (base, ext) => `${base}_${t}_${d}.${ext}`;
    const L = [];
    L.push({ cat: 'scenario', folder: '00_Scenario', name: nm('SISSE_KABA_LIRE_D_ABORD', 'txt'), kind: 'txt', label: 'Lire d’abord (scénario et contenu)', gen: () => readme() });
    const KIT_DECKS = ['selab12', 'stand_eleveur', 'stand_producteur'];
    for (const dk of SKD.decks) {
      L.push({ kit: KIT_DECKS.includes(dk.id), cat: 'pres', folder: dk.folder, name: nm(dk.file, 'pptx'), kind: 'pptx', label: dk.name, gen: async () => { const b = await SKG.pptx(JSZip, await getBuf('tpl/' + dk.id + '.pptx'), state.V.S); return (dk.slides || []).some((x) => (x.blocks || []).some((k) => k.k === 'qr')) ? pptxWithQr(b) : b; } });
      L.push({ kit: KIT_DECKS.includes(dk.id), cat: 'pres', folder: dk.folder, name: nm(dk.file + '_avec_commentaires', 'pdf'), kind: 'pdf', label: dk.name + ' (PDF avec commentaires)', gen: () => pdf(SKG.pdfDeck(dk, state.V.S, imgs)) });
    }
    L.push({ cat: 'excel', folder: '03_Business_plan_et_modeles', name: nm('SISSE_KABA_Modele_Operationnel', 'xlsx'), kind: 'xlsx', label: 'Modèle Excel opérationnel', gen: async () => (await SKG.xlsx(JSZip, SKX, await getBuf('tpl/Modele_Operationnel.xlsx'), overrides())).bytes });
    L.push({ cat: 'excel', folder: '03_Business_plan_et_modeles', name: nm('SISSE_KABA_Business_Plan_2027_2029_Modele', 'xlsx'), kind: 'xlsx', label: 'Modèle Excel financier', gen: async () => (await SKG.xlsx(JSZip, SKX, await getBuf('tpl/Business_Plan_Modele.xlsx'), overrides())).bytes });
    for (const d of SKD.short.filter((x) => x.short === 'eleveur' || x.short === 'producteur')) {
      L.push({ kit: true, cat: 'pres', folder: '02_Lancement_SELAB', name: nm('SISSE_KABA_Kakemono_85x200_' + (d.short === 'eleveur' ? 'Eleveur' : 'Producteur'), 'pdf'), kind: 'pdf', label: 'Kakémono 85 × 200 cm du stand : ' + d.menu.toLowerCase(), gen: () => pdf(SKG.pdfKakemono(d, state.V.S, imgs)) });
      L.push({ kit: true, cat: 'pres', folder: '02_Lancement_SELAB', name: nm('SISSE_KABA_Fiche_A5_Stand_' + (d.short === 'eleveur' ? 'Eleveur' : 'Producteur'), 'pdf'), kind: 'pdf', label: 'Fiche A5 recto-verso du stand : ' + d.menu.toLowerCase(), gen: () => pdf(SKG.pdfFlyer(d, state.V.S, imgs)) });
    }
    for (const dc of SKDOC.docs) {
      L.push({ cat: 'docs', folder: dc.folder, name: nm(dc.file, 'docx'), kind: 'docx', label: SKG.fill(dc.title, state.V.S), gen: async () => new Uint8Array(await (await docx.Packer.toBlob(SKG.docx(docx, dc, state.V.S, { sisse: imgBytes.sisse, solevo: imgBytes.solevo }))).arrayBuffer()) });
      L.push({ cat: 'docs', folder: dc.folder, name: nm(dc.id === 'bmc' ? 'SISSE_KABA_Canvas_Export' : dc.file, 'pdf'), kind: 'pdf', label: SKG.fill(dc.title, state.V.S), gen: () => pdf(SKG.pdfDoc(dc, state.V.S, imgs)) });
    }
    L.push({ cat: 'excel', folder: '05_Canvas_et_canevas', name: nm('SISSE_KABA_Canvas_Modifiable', 'xlsx'), kind: 'xlsx', label: 'Canvas modifiable (Excel A3)', gen: async () => SKG.xlsxStrings(JSZip, await getBuf('tpl/Canvas_Modifiable.xlsx'), state.V.S) });
    for (const f of ['SISSE_KABA_Contrat_Producteurs_Mais', 'SISSE_KABA_Contrat_Eleveurs']) {
      for (const ext of ['docx', 'pdf']) L.push({ cat: 'contrats', folder: '04_Contrats', name: `${f}.${ext}`, kind: ext, label: (f.includes('Eleveurs') ? 'Contrat éleveurs' : 'Contrat producteurs de maïs') + ' (modèle inchangé)', gen: async () => new Uint8Array(await getBuf('static/' + f + '.' + ext)) });
    }
    L.push({ cat: 'kit', kit: true, folder: '02_Lancement_SELAB', name: nm('SISSE_KABA_Visuel_carre_WhatsApp_Facebook_1080', 'png'), kind: 'png', label: 'Visuel carré 1080 × 1080 (WhatsApp, Facebook) annonçant le stand', gen: () => squarePng() });
    L.push({ cat: 'kit', kit: true, folder: '02_Lancement_SELAB', name: nm('SISSE_KABA_Visuel_vertical_statut_WhatsApp_1080x1920', 'png'), kind: 'png', label: 'Visuel vertical 1080 × 1920 (statut WhatsApp) annonçant le stand', gen: () => storyPng() });
    L.push({ cat: 'kit', kit: true, folder: '02_Lancement_SELAB', name: nm('SISSE_KABA_QR_inscription_tables', 'pdf'), kind: 'pdf', label: 'QR codes d’inscription à imprimer (accueil + une page par table)', gen: () => qrPdfBytes() });
    L.push({ kit: true, cat: 'logos', folder: '07_Logo', name: 'Logo_SISSE_KABA.png', kind: 'png', label: 'Logo SISSÊ~KABA', gen: async () => new Uint8Array(await getBuf('assets/logo_sisse.png')) });
    L.push({ kit: true, cat: 'logos', folder: '07_Logo', name: 'Logo_SOLEVO.png', kind: 'png', label: 'Logo SOLEVO', gen: async () => new Uint8Array(await getBuf('assets/Logo_SOLEVO.png')) });
    L.push({ cat: 'scenario', folder: '00_Scenario', name: nm('SISSE_KABA_Scenario', 'json'), kind: 'json', label: 'Paramètres du scénario (réimportables)', gen: () => JSON.stringify({ label: state.label, hyp: state.hyp, date: today().iso }, null, 1) });
    return L;
  }
  function readme() {
    const S = state.V.S;
    return [
      'SISSÊ~KABA — DOSSIER GÉNÉRÉ PAR LE SIMULATEUR — ' + S.date,
      '', 'Scénario : ' + S.scenario,
      `Objectifs prémix : ${S.premix27} t (2027), ${S.premix28} t (2028), ${S.premix29} t (2029).`,
      `Maïs : ${S.mais27} / ${S.mais28} / ${S.mais29} t. Surfaces minimum : ${S.haTerrain27} / ${S.haTerrain28} / ${S.haTerrain29} ha. Producteurs de ${S.surf} ha : ${S.prod27} / ${S.prod28} / ${S.prod29}.`,
      `CA SOLEVO du programme (M FCFA) : ${S.ca27} / ${S.ca28} / ${S.ca29}. Marge brute : ${S.mb27} / ${S.mb28} / ${S.mb29}. Résultat avant financement et impôt : ${S.res27} / ${S.res28} / ${S.res29}.`,
      `Marketing et communication : ${S.mkt27} / ${S.mkt28} / ${S.mkt29} M. Solde à affecter : ${S.solde27} / ${S.solde28} / ${S.solde29} M.`,
      `BFR normatif 2027 : ${S.bfr27} M. Enveloppe indicative de ressources au démarrage : ${S.env27} M.`,
      `Contrôles de cohérence du modèle : ${S.ctrl27} (2027), ${S.ctrl28} (2028), ${S.ctrl29} (2029).`,
      '', 'Lancement officiel : SELAB SHOW 2026, 20–22 novembre 2026, Parc des sports d’Abidjan, participation FEED et SEED (informations du porteur).',
      'Plateforme fournie par l’IT SOLEVO-CI. Aucun portage de stock, financement de récolte ni commission sur le maïs n’est présumé pour SOLEVO.',
      'Résultats : ni bénéfice net, ni gain additionnel garanti. Gains producteurs et acheteurs conditionnels et séparés du CA SOLEVO.',
      'Hypothèses, doses et tarifs à valider par les équipes compétentes. Contrats : modèles inchangés, à compléter et valider avant signature.',
      '', 'Contenu : 01_CODIR (PPTX format SOLEVO + PDF avec commentaires), 02_Lancement_SELAB, 03_Business_plan_et_modeles (Word, PDF, 2 Excel),',
      '04_Contrats, 05_Canvas_et_canevas, 06_Dossier_et_notes, 07_Logo, 08_IT_SOLEVO (présentation IT), 00_Scenario (paramètres réimportables dans le simulateur).',
      'Excel : Hypotheses!B5 = prémix 2027 ; C52 et D52 = croissance 2028 et 2029 ; onglet Controles = vérification des formules.',
      'Contact projet : Elvis.lehito@solevogroup.com',
    ].join('\r\n');
  }
  let imgs = {}, imgBytes = {};
  async function loadImages() {
    for (const [k, f] of [['sisseUrl', 'logo_sisse.jpg'], ['solevoBig', 'solevo_big.jpg'], ['solevoSmall', 'solevo_small.jpg'], ['solevoWhite', 'solevo_white.jpg']]) {
      const b = new Uint8Array(await getBuf('assets/' + f));
      if (k === 'sisseUrl') imgBytes.sisse = b;
      if (k === 'solevoBig') imgBytes.solevo = b;
      let s = ''; for (let i = 0; i < b.length; i += 0x8000) s += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
      imgs[k] = 'data:image/jpeg;base64,' + btoa(s);
    }
  }
  async function pdf(dd) {
    const blob = await pdfMake.createPdf(dd).getBlob();
    return new Uint8Array(await blob.arrayBuffer());
  }
  const ICON = { pptx: 'PPT', pdf: 'PDF', docx: 'DOC', xlsx: 'XLS', txt: 'TXT', json: 'JSON', png: 'PNG' };
  function renderDocs() {
    const L = docList();
    const groups = {};
    L.forEach((d, i) => { (groups[d.folder] = groups[d.folder] || []).push([d, i]); });
    $('#docs').innerHTML = Object.keys(groups).sort().map((g) => `<div class="dgroup"><h4>${g.replace(/^\d+_/, '').replace(/_/g, ' ')}</h4>${groups[g].map(([d, i]) => `<button class="doc" data-i="${i}"><span class="ic ${d.kind}">${ICON[d.kind]}</span><span class="dn">${d.label}<small>${d.name}</small></span></button>`).join('')}</div>`).join('');
    $$('#docs .doc').forEach((b) => b.addEventListener('click', () => saveOne(L[+b.dataset.i], b)));
  }
  function status(msg, kind) { const s = $('#status'); s.textContent = msg; s.className = 'status ' + (kind || ''); }
  async function save(name, data) {
    if (!state.downloads) {
      /* hors de claude.ai (ex. GitHub Pages) : téléchargement classique du navigateur */
      try { const blob = data instanceof Blob ? data : new Blob([data]); const u = URL.createObjectURL(blob); const el = document.createElement('a'); el.href = u; el.download = name; document.body.appendChild(el); el.click(); el.remove(); setTimeout(() => URL.revokeObjectURL(u), 4000); status('Fichier téléchargé : ' + name, 'ok'); return true; }
      catch (e) { status('Téléchargement impossible (' + (e.message || e) + ').', 'err'); return false; }
    }
    try {
      await state.downloads.save({ filename: name, data: data instanceof Uint8Array ? new Blob([data]) : data });
      status('Fichier proposé : ' + name, 'ok'); return true;
    } catch (e) {
      const c = e && e.code;
      status(c === 'declined' ? 'Téléchargement annulé.' : c === 'rate_limited' ? 'Une confirmation est déjà ouverte : réessayez dans un instant.' : 'Téléchargement impossible (' + (c || e.message || e) + ').', 'err');
      return false;
    }
  }
  async function saveOne(d, btn) {
    if (state.busy) return; state.busy = true; btn && btn.classList.add('wait');
    status('Génération de ' + d.name + '…');
    try { const data = await d.gen(); await save(d.name, data); }
    catch (e) { console.error(e); status('Erreur de génération : ' + e.message, 'err'); }
    finally { state.busy = false; btn && btn.classList.remove('wait'); }
  }
  /* ---------- contrôle qualité ---------- */
  const BADCH = ['\u202F', '\u2009', '\uFFFD'];
  async function qa(name, data) {
    const ext = name.split('.').pop().toLowerCase();
    const r = { name, ext, bad: 0, tokens: 0, images: null, ok: true };
    try {
      if (['docx', 'pptx', 'xlsx'].includes(ext)) {
        const z = await JSZip.loadAsync(data instanceof Uint8Array ? data : new TextEncoder().encode(String(data)));
        let txt = '';
        for (const n of Object.keys(z.files)) if (n.endsWith('.xml')) txt += await z.file(n).async('string');
        r.bad = BADCH.reduce((a, c) => a + txt.split(c).length - 1, 0);
        r.tokens = (txt.match(/\{\{\w+\}\}/g) || []).length;
        r.images = Object.keys(z.files).filter((n) => /\/media\//.test(n)).length;
      } else if (ext === 'pdf') {
        const b = data; let head = ''; for (let i = 0; i < 5; i++) head += String.fromCharCode(b[i]);
        let s2 = ''; for (let i = 0; i < b.length; i += 0x8000) s2 += String.fromCharCode.apply(null, b.subarray(i, i + 0x8000));
        r.images = (s2.match(/\/Subtype\s*\/Image/g) || []).length;
        if (head !== '%PDF-') r.bad++;
      } else if (ext === 'txt' || ext === 'json') {
        const t = typeof data === 'string' ? data : new TextDecoder().decode(data);
        r.bad = BADCH.reduce((a, c) => a + t.split(c).length - 1, 0);
        r.tokens = (t.match(/\{\{\w+\}\}/g) || []).length;
      }
    } catch (e) { r.bad++; r.err = e.message; }
    r.ok = r.bad === 0 && r.tokens === 0 && (r.images === null || r.images > 0);
    return r;
  }
  function qaReport(res) {
    const office = res.filter((r) => r.images !== null);
    const bad = res.reduce((a, r) => a + r.bad, 0), tok = res.reduce((a, r) => a + r.tokens, 0);
    const nologo = office.filter((r) => r.images === 0).length;
    const ok = res.filter((r) => r.ok).length;
    const S = state.V.S;
    const lines = ['CONTRÔLE QUALITÉ — SISSÊ~KABA — ' + S.date, 'Scénario : ' + S.scenario, '',
      `Fichiers contrôlés : ${res.length} ; conformes : ${ok}/${res.length}`,
      `Caractères mal affichés : ${bad}`, `Jetons non remplacés : ${tok}`, `Fichiers bureautiques sans logo : ${nologo}/${office.length}`,
      `Contrôles de cohérence du modèle Excel : ${S.ctrl27} (2027), ${S.ctrl28} (2028), ${S.ctrl29} (2029)`, '', 'Détail :']
      .concat(res.map((r) => `${r.ok ? 'OK ' : 'KO '} ${r.name}${r.images !== null ? ' — images : ' + r.images : ''}${r.bad ? ' — défauts : ' + r.bad : ''}${r.tokens ? ' — jetons : ' + r.tokens : ''}${r.err ? ' — ' + r.err : ''}`));
    return { text: lines.join('\r\n'), ok, total: res.length, bad, tok, nologo };
  }
  function showQa(q) {
    const el = $('#qa');
    el.className = 'ctrl ' + (q.ok === q.total ? 'ok' : 'ko');
    el.textContent = (q.ok === q.total ? '✓ ' : '⚠ ') + `Contrôle qualité : ${q.ok}/${q.total} fichiers conformes — ${q.bad} caractère mal affiché, ${q.nologo} logo manquant, ${q.tok} jeton non remplacé.`;
  }

  /* génère tous les fichiers du scénario + rapport qualité */
  async function buildAll(prefix, cats) {
    const L = docList().filter((d) => !cats || d.cat === 'scenario' || cats.includes(d.cat) || (cats.includes('kit') && d.kit)); const files = []; const res = [];
    let i = 0;
    for (const d of L) {
      i++; status(`${prefix || 'Génération'} ${i}/${L.length} : ${d.name}`);
      let data = await d.gen();
      if (typeof data === 'string') data = new TextEncoder().encode(data);
      files.push({ folder: d.folder, name: d.name, data });
      res.push(await qa(d.name, data));
    }
    const q = qaReport(res); showQa(q);
    files.unshift({ folder: '00_Scenario', name: `SISSE_KABA_Controle_Qualite_${state.tag}_${today().iso}.txt`, data: new TextEncoder().encode(q.text) });
    return { files, q };
  }
  function rootName() { return `SISSE_KABA_Dossier_${state.tag}_${today().iso}`; }

  /* répartit les fichiers en archives autonomes de taille maximale `limit` octets (compressés) */
  async function packParts(files, limit) {
    const root = rootName();
    const est = await Promise.all(files.map(async (f) => {
      const z = new JSZip(); z.file('x', f.data);
      return (await z.generateAsync({ type: 'uint8array', compression: 'DEFLATE' })).length + 200;
    }));
    const groups = []; let cur = [], size = 0;
    files.forEach((f, i) => {
      if (cur.length && size + est[i] > limit) { groups.push(cur); cur = []; size = 0; }
      cur.push(f); size += est[i];
    });
    if (cur.length) groups.push(cur);
    const parts = [];
    for (let g = 0; g < groups.length; g++) {
      const z = new JSZip();
      groups[g].forEach((f) => z.file(root + '/' + f.folder + '/' + f.name, f.data));
      const bytes = await z.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
      const name = groups.length === 1 ? root + '.zip' : `${root}_partie${g + 1}sur${groups.length}.zip`;
      parts.push({ name, bytes, files: groups[g] });
    }
    return parts;
  }

  async function saveZip() {
    if (state.busy) return; state.busy = true; const btn = $('#zipAll'); btn.disabled = true;
    try {
      const { files } = await buildAll();
      status('Compression de l’archive…');
      const [part] = await packParts(files, Infinity);
      await save(part.name, part.bytes);
    } catch (e) { console.error(e); status('Erreur : ' + e.message, 'err'); }
    finally { state.busy = false; btn.disabled = false; }
  }

  /* ---------- envoi par e-mail (Gmail du visiteur) ---------- */
  const MAIL_LIMIT = 10 * 1024 * 1024;      // découpage demandé : 10 Mo par partie
  const INLINE_LIMIT = 650 * 1024;           // sans transfert de fichier : entrée limitée à 1 Mio (base64)
  function b64(bytes) { let s = ''; for (let i = 0; i < bytes.length; i += 0x8000) s += String.fromCharCode.apply(null, bytes.subarray(i, i + 0x8000)); return btoa(s); }
  function recipients() {
    return $('#mailTo').value.split(/[;,\s]+/).map((x) => x.trim()).filter((x) => /^[^@\s]+@[^@\s]+\.[^@\s]+$/.test(x));
  }
  function mailErr(e) {
    const c = e && e.code;
    switch (c) {
      case 'server_not_connected': return 'Gmail n’est pas connecté : ajoutez-le dans claude.ai, Paramètres › Connecteurs.';
      case 'needs_reauth': return 'La connexion Gmail a expiré : reconnectez Gmail dans claude.ai, Paramètres › Connecteurs.';
      case 'not_in_manifest': return 'L’envoi Gmail a été refusé pour cette page. Autorisez Gmail pour l’artefact puis réessayez.';
      case 'approval_required': return 'L’envoi demande votre autorisation : ouvrez l’artefact dans claude.ai et acceptez la demande.';
      case 'blocked_by_policy': return 'L’envoi Gmail est bloqué par la politique de votre organisation.';
      case 'selection_required': return 'Plusieurs comptes Gmail sont connectés : choisissez-en un dans la fenêtre proposée par claude.ai.';
      case 'bad_request': case 'transform_error': return 'La pièce jointe a été refusée avant l’envoi (format ou taille). Rien n’est parti : cliquez sur « Renvoyer ».';
      case 'tool_error': return 'Gmail a refusé le message : ' + (e.message || 'erreur inconnue') + '.';
      case 'server_unavailable': case 'upstream_error': return 'Gmail n’a pas répondu. Le message est peut-être parti : vérifiez vos « Messages envoyés » avant de relancer.';
      default: return 'Envoi impossible (' + (c || (e && e.message) || e) + ').';
    }
  }
  async function sendMail(opts) {
    opts = opts && opts.resend ? opts : null;
    if (state.busy) return;
    const to = opts ? opts.to : recipients();
    if (!to.length) { status('Indiquez au moins une adresse e-mail valide.', 'err'); return; }
    if (!state.mcp) { status('L’envoi par e-mail n’est disponible que dans claude.ai, avec Gmail connecté.', 'err'); return; }
    if (!opts && !$('#mailOk').checked) { status('Cochez la case de confirmation avant l’envoi.', 'err'); return; }
    if (opts) {
      // rétablit le scénario et le contenu de l’envoi d’origine
      state.hyp = Object.assign({}, state.base, opts.hyp || {}); state.label = opts.label; state.autoLabel = false; state.userLabel = true;
      $('#preset').value = 'custom'; recalc();
    }
    state.busy = true; const btn = $('#mailBtn'); btn.disabled = true;
    try {
      let fileArgs = false;
      try { fileArgs = !!(await state.mcp.listTools()).fileArgs; } catch (e) { fileArgs = false; }
      const cats = opts ? opts.cats : selectedCats();
      if (!cats.length) { status('Choisissez au moins un type de contenu à envoyer.', 'err'); return; }
      const catLabel = cats.map((c) => CATS[c]).join(', ');
      const { files, q } = await buildAll('Préparation de l’envoi', cats);
      const S = state.V.S;
      // mode « fichier » (pièce jointe transférée, parties de 10 Mo) puis repli automatique
      // en mode « intégré » (parties de 650 Ko) si la plateforme refuse le transfert de fichier
      const modes = opts && opts.mode ? [opts.mode] : (fileArgs ? ['file', 'inline'] : ['inline']);
      let parts, n, total, start, sent, base, mode, done = false;
      for (let m = 0; m < modes.length && !done; m++) {
        mode = modes[m];
        status(m ? 'Transfert de fichier refusé : nouvel essai en parties plus petites…' : 'Découpage en parties…');
        parts = await packParts(files, mode === 'file' ? MAIL_LIMIT : INLINE_LIMIT);
        n = parts.length;
        total = parts.reduce((a, p) => a + p.bytes.length, 0);
        start = opts && opts.mode === mode ? Math.min(opts.start || 0, n - 1) : 0;
        sent = start;
        base = { to, cats: catLabel, catKeys: cats, parts: n, size: total, quality: `${q.ok}/${q.total}`, hyp: state.hyp, label: state.label, resendOf: opts ? opts.id : null, mode };
        let fallback = false;
        for (let i = start; i < n; i++) {
          const p = parts[i];
          status(`Envoi de la partie ${i + 1}/${n} (${(p.bytes.length / 1048576).toFixed(1).replace('.', ',')} Mo)…`);
          const list = p.files.map((f) => '<li>' + f.folder.replace(/^\d+_/, '').replace(/_/g, ' ') + ' — ' + f.name + '</li>').join('');
          const html = `<p>Bonjour,</p><p>Veuillez trouver ci-joint ${n > 1 ? `la <b>partie ${i + 1}/${n}</b> du` : 'le'} dossier SISSÊ~KABA généré par le simulateur.</p>
          <p><b>Scénario :</b> ${S.scenario}<br><b>Date :</b> ${S.date}</p>
          <p><b>Repères 2027 :</b> prémix ${S.premix27} t ; maïs ${S.mais27} t ; CA SOLEVO du programme ${S.ca27} M FCFA ; marge brute ${S.mb27} M ; résultat avant financement et impôt ${S.res27} M ; marketing ${S.mkt27} M ; BFR normatif ${S.bfr27} M ; enveloppe de démarrage ${S.env27} M.</p>
          <p><b>Contrôle qualité :</b> ${q.ok}/${q.total} fichiers conformes.</p>
          <p><b>Contenu de cette partie :</b></p><ul>${list}</ul>
          ${n > 1 ? '<p>Chaque partie est une archive autonome : extraire toutes les parties dans le même dossier pour reconstituer le dossier complet.</p>' : ''}
          ${cats.includes('kit') ? `<div style="border:2px solid #37A028;border-radius:10px;padding:10px 14px;margin:12px 0"><p style="margin:0 0 6px"><b style="color:#002060">Validation avant impression (marketing Agro)</b></p><ol style="margin:0;padding-left:18px"><li>Couleurs SOLEVO (vert #37A028, bleu #002060 / #0B5FA1) et lisibilité</li><li>Logos SOLEVO et SISSÊ~KABA : version, taille, position</li><li>Mentions légales et réglementaires (raison sociale, contacts, mentions produits, mention « Gains estimés selon les conditions d’exploitation »)</li><li>Messages : « Dépensez moins, gagnez plus » (−30 à 40 % sur les coûts de production), producteur +30 % sur le prix bord champ (selon le scénario), éleveur −15 % sur son prix d’achat du maïs</li><li>Dates, lieu et numéros : 20–22/11/2026, Parc des sports d’Abidjan, ${SOLEVO_TEL}</li><li>QR codes : test de scan sur deux téléphones</li><li>Formats d’impression : kakémono 85 × 200 cm, fiches A5 recto-verso, QR A4, visuels 1080 × 1080 et 1080 × 1920</li></ol><p style="margin:8px 0 0">Merci de répondre <b>« KIT VALIDÉ »</b> ou d’indiquer vos corrections, fichier par fichier.</p></div>` : ''}
          <p>Hypothèses et budgets soumis à validation. Résultat avant financement et impôt : ni bénéfice net, ni gain additionnel garanti.</p>`;
          const att = { filename: p.name, mimeType: 'application/zip', content: mode === 'file' ? { $file: { data: new Blob([p.bytes], { type: 'application/zip' }), name: p.name, type: 'application/zip' } } : b64(p.bytes) };
          const input = { to, subject: `SISSÊ~KABA – ${cats.length >= Object.keys(CATS).length - 1 && !cats.includes('kit') ? 'Dossier' : catLabel} ${S.scenarioTag} du ${S.date}${n > 1 ? ` – Partie ${i + 1}/${n}` : ''}`, htmlBody: html, attachments: [att] };
          try { await state.mcp.callTool('Gmail', 'send_message', input); sent++; }
          catch (e) {
            console.error(e);
            const code = e && e.code;
            // le transfert de fichier n’a jamais atteint Gmail : repli sûr, rien n’a été envoyé
            if (mode === 'file' && i === start && sent === start && ['bad_request', 'capability_disabled', 'transform_error', 'capability_removed'].includes(code) && m + 1 < modes.length) { fallback = true; break; }
            status(`Partie ${i + 1}/${n} : ` + mailErr(e) + (sent ? ` (${sent} partie(s) déjà envoyée(s)).` : ''), 'err');
            await logSend(Object.assign({}, base, { sent, status: sent ? `Partiel (${sent}/${n})` : 'Échec', error: code || 'erreur', detail: String((e && e.message) || '').slice(0, 160) }));
            return;
          }
        }
        if (!fallback) done = true;
      }
      status(opts ? `✓ Renvoi terminé : parties ${start + 1} à ${n} envoyées à ${to.join(' et ')}.` : `✓ Envoyé en ${n} partie${n > 1 ? 's' : ''} à ${to.join(' et ')} (${catLabel}).`, 'ok');
      await logSend(Object.assign({}, base, { sent, status: 'Envoyé' }));
      if (cats.includes('kit')) { state.standCfg.kitVal = Object.assign({}, state.standCfg.kitVal, { statut: 'En attente de validation', envoye: today().fr, a: to.join(', ') }); await cfgSave(); renderKitVal(); }
      if ($('#mailCopy') && $('#mailCopy').checked) {
        const cc = ($('#mailCopyTo').value || '').split(/[;,\s]+/).filter((x) => /@/.test(x));
        if (cc.length) {
          const T = teamMails(); const who = (m) => { const x = T.find((y) => y.mail.toLowerCase() === m.toLowerCase()); return x ? `${x.nom} (${x.role}) – ${m}` : m; };
          const rows = parts.map((p, i) => `<tr><td style="padding:4px 8px;border:1px solid #D6DEEA">Partie ${i + 1}/${n}<br><small>${p.name} • ${(p.bytes.length / 1048576).toFixed(1).replace('.', ',')} Mo</small></td><td style="padding:4px 8px;border:1px solid #D6DEEA"><ul style="margin:0;padding-left:16px">${p.files.map((f) => '<li>' + f.name + '</li>').join('')}</ul></td></tr>`).join('');
          const d = new Date(); const hh = String(d.getHours()).padStart(2, '0') + ':' + String(d.getMinutes()).padStart(2, '0');
          const html = `<div style="font-family:Arial,sans-serif;font-size:13px;color:#1d2433"><p><b style="color:#002060">Copie de l’envoi SISSÊ~KABA du ${today().fr} à ${hh}</b></p>
            <p><b>Destinataires :</b></p><ul>${to.map((m) => '<li>' + who(m) + '</li>').join('')}</ul>
            <p><b>Contenu :</b> ${catLabel} • scénario ${S.scenario} • ${n} partie(s), ${(total / 1048576).toFixed(1).replace('.', ',')} Mo • contrôle qualité ${q.ok}/${q.total}</p>
            <table style="border-collapse:collapse;font-size:12px">${rows}</table><p style="color:#5b6476;font-size:11px">Message de copie automatique du simulateur SISSÊ~KABA (pièces jointes non renvoyées).</p></div>`;
          try { await state.mcp.callTool('Gmail', 'send_message', { to: cc, subject: `Copie – SISSÊ~KABA ${catLabel} envoyé à ${to.length} destinataire(s) le ${today().fr}`, htmlBody: html }); status(`✓ Envoyé à ${to.join(' et ')} • copie récapitulative envoyée à ${cc.join(', ')}.`, 'ok'); }
          catch (e) { console.error(e); status('Envoi réussi, mais la copie récapitulative n’a pas pu partir : ' + mailErr(e), 'err'); }
        }
      }
      if (opts && opts.id) await markResent(opts.id);
      if (!opts) $('#mailOk').checked = false;
    } catch (e) { console.error(e); status('Erreur : ' + e.message, 'err'); }
    finally { state.busy = false; btn.disabled = false; }
  }

  /* ---------- choix du contenu ---------- */
  const CATS = { pres: 'Présentations', excel: 'Excel', docs: 'Documents Word et PDF', contrats: 'Contrats', logos: 'Logos', kit: 'Kit communication' };
  function selectedCats() { return $$('#mailCats input:checked').map((i) => i.value); }

  /* ---------- journal des envois ---------- */
  const LOGKEY = 'sk_envois';
  function localLog() { try { return JSON.parse(localStorage.getItem(LOGKEY) || '[]'); } catch (e) { return []; } }
  async function logSend(entry) {
    const S = state.V.S;
    const e = Object.assign({ at: new Date().toISOString(), scenario: S.scenario, tag: state.tag }, entry);
    e.to = (e.to || []).join(', ');
    e.to = e.to; e.id = e.id || ('e' + Date.now().toString(36) + Math.random().toString(36).slice(2, 6));
    if (state.db) {
      try { await state.db.collection('envois').doc(e.id).set(JSON.parse(JSON.stringify(e))); return; }
      catch (err) { console.error(err); if (err && err.code === 'quota_exceeded') status('Journal plein : supprimez d’anciens envois.', 'err'); }
    }
    try { const l = localLog(); l.unshift(e); localStorage.setItem(LOGKEY, JSON.stringify(l.slice(0, 200))); } catch (err) { /* indisponible */ }
    renderLog(localLog(), 'local');
  }
  function renderLog(rows, src) {
    state.logRows = rows;
    const tb = $('#log tbody'); if (!tb) return;
    if (!rows.length) { tb.innerHTML = '<tr><td colspan="7" class="note">Aucun envoi enregistré.</td></tr>'; }
    else tb.innerHTML = rows.slice(0, 50).map((r) => {
      const d = new Date(r.at); const p = (x) => String(x).padStart(2, '0');
      const dt = isNaN(d) ? r.at : `${p(d.getDate())}/${p(d.getMonth() + 1)}/${d.getFullYear()} ${p(d.getHours())}:${p(d.getMinutes())}`;
      const ok = r.status === 'Envoyé';
      const canResend = !ok && !r.resent && r.hyp && r.catKeys;
      const act = canResend ? `<button class="mini" data-resend="${esc(r.id)}" title="Renvoie les parties manquantes (${(r.sent || 0) + 1} à ${r.parts}) avec le même scénario, le même contenu et les mêmes destinataires">Renvoyer</button>` : (r.resent ? '<span class="note">renvoyé</span>' : (r.resendOf ? '<span class="note">renvoi</span>' : ''));
      return `<tr><td>${dt}</td><td>${esc(r.scenario)}</td><td>${esc(r.cats || '')}</td><td>${r.sent ?? r.parts}/${r.parts} · ${(r.size / 1048576).toFixed(1).replace('.', ',')} Mo</td><td>${esc(r.to)}</td><td class="${ok ? 'dp' : 'dn'}" title="${esc(r.detail || '')}">${esc(r.status)}${r.error ? ' (' + esc(r.error) + ')' : ''}</td><td>${act}</td></tr>`;
    }).join('');
    $$('#log [data-resend]').forEach((b) => b.addEventListener('click', () => {
      const r = (state.logRows || []).find((x) => x.id === b.dataset.resend); if (!r) return;
      sendMail({ resend: true, id: r.id, to: String(r.to).split(/,\s*/), cats: r.catKeys, hyp: r.hyp, label: r.label || r.scenario, start: r.sent || 0, mode: r.sent ? r.mode : null });
    }));
    $('#logSrc').textContent = src === 'db' ? 'Journal conservé avec l’artefact (visible sur tous vos appareils).' : src === 'local' ? 'Journal conservé dans ce navigateur uniquement.' : '';
  }
  async function markResent(id) {
    if (state.db) { try { await state.db.collection('envois').doc(id).update({ resent: true }); return; } catch (e) { console.error(e); } }
    try { const l = localLog(); const r = l.find((x) => x.id === id); if (r) { r.resent = true; localStorage.setItem(LOGKEY, JSON.stringify(l)); renderLog(l, 'local'); } } catch (e) { /* indisponible */ }
  }

  /* ---------- listes de destinataires ---------- */
  /* agents SOLEVO Côte d’Ivoire enregistrés (adresses modifiables dans « Liens d’accès ») */
  function teamMails() {
    const em = (state.standCfg && state.standCfg.emails) || {};
    return [['kouame', 'Mandants'], ['konan', 'Mandants'], ['lehito', 'Key Account Managers'], ['agohi', 'Key Account Managers'], ['kouakou', 'Marketing Agro'], ['ouattara', 'Agents techniques'], ['kouadio', 'Agents techniques'], ['koffi', 'Agents techniques']]
      .map(([k, g]) => ({ k, g, nom: SKD.TEAM[k].court || SKD.TEAM[k].nom, role: SKD.TEAM[k].role, mail: (em[k] || SKD.TEAM[k].mail || '').trim() })).filter((x) => /@/.test(x.mail));
  }
  function teamLists() {
    const T = teamMails(); const j = (f) => T.filter(f).map((x) => x.mail).join(', ');
    return [{ id: 'equipe', name: 'Équipe SOLEVO CI (tous)', to: j(() => true) }, { id: 'mandants-kam', name: 'Mandants et Key Account Managers', to: j((x) => /Mandants|Key/.test(x.g)) },
      { id: 'kam-marketing', name: 'Key Account Managers et marketing', to: j((x) => /Key|Marketing/.test(x.g)) }, { id: 'ate', name: 'Agents techniques', to: j((x) => /Agents/.test(x.g)) }];
  }
  function renderTeamMail() {
    const box = $('#teamMail'); if (!box) return; const cur = recipients().map((x) => x.toLowerCase());
    const T = teamMails(); const groups = [...new Set(T.map((x) => x.g))];
    box.innerHTML = groups.map((g) => `<div class="tmm"><b>${esc(g)}</b>${T.filter((x) => x.g === g).map((x) => `<label class="tmc"><input type="checkbox" data-tm="${esc(x.mail)}" ${cur.includes(x.mail.toLowerCase()) ? 'checked' : ''}><span>${esc(x.nom)}<small>${esc(x.role)} • ${esc(x.mail)}</small></span></label>`).join('')}</div>`).join('');
    $$('[data-tm]', box).forEach((c) => c.addEventListener('change', () => {
      let L = recipients(); const m = c.dataset.tm;
      L = c.checked ? (L.some((x) => x.toLowerCase() === m.toLowerCase()) ? L : L.concat([m])) : L.filter((x) => x.toLowerCase() !== m.toLowerCase());
      $('#mailTo').value = L.join(', '); $('#mailOk').checked = false;
    }));
  }
  const DEFAULT_LISTS = [{ id: 'moi', name: 'Moi', to: 'elvis.lehito@solevogroup.com, lehitognakoury@gmail.com' }];
  const LISTKEY = 'sk_listes';
  function localLists() { try { return JSON.parse(localStorage.getItem(LISTKEY) || 'null'); } catch (e) { return null; } }
  function slug(x) { return String(x).normalize('NFD').replace(/[\u0300-\u036f]/g, '').toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-|-$/g, '').slice(0, 60) || 'liste'; }
  function renderLists(lists) {
    const all = DEFAULT_LISTS.concat(teamLists()).filter((d) => !lists.some((l) => l.id === d.id)).concat(lists).sort((a, b) => (a.id === 'moi' ? -1 : b.id === 'moi' ? 1 : a.name.localeCompare(b.name, 'fr')));
    state.lists = all;
    const sel = $('#listSel'); const cur = sel.value;
    sel.innerHTML = '<option value="">— Choisir une liste —</option>' + all.map((l) => `<option value="${esc(l.id)}">${esc(l.name)} (${esc(l.to.split(/,\s*/).length)})</option>`).join('');
    if (all.some((l) => l.id === cur)) sel.value = cur;
  }
  function applyList() {
    const l = (state.lists || []).find((x) => x.id === $('#listSel').value);
    if (l) { $('#mailTo').value = l.to; $('#listName').value = l.name; renderTeamMail(); }
  }
  async function saveList() {
    const name = $('#listName').value.trim();
    const to = recipients();
    if (!name) { status('Donnez un nom à la liste (par exemple « CODIR »).', 'err'); return; }
    if (!to.length) { status('La liste doit contenir au moins une adresse valide.', 'err'); return; }
    const item = { id: slug(name), name, to: to.join(', '), at: new Date().toISOString() };
    if (state.db) {
      try { await state.db.collection('listes').doc(item.id).set(item); $('#listSel').value = item.id; status(`Liste « ${name} » enregistrée (${to.length} adresse${to.length > 1 ? 's' : ''}).`, 'ok'); return; }
      catch (e) { console.error(e); }
    }
    try { const l = (localLists() || []).filter((x) => x.id !== item.id); l.push(item); localStorage.setItem(LISTKEY, JSON.stringify(l)); renderLists(l); $('#listSel').value = item.id; status(`Liste « ${name} » enregistrée dans ce navigateur.`, 'ok'); }
    catch (e) { status('Enregistrement de la liste impossible.', 'err'); }
  }
  async function deleteList() {
    const id = $('#listSel').value; if (!id) { status('Choisissez la liste à supprimer.', 'err'); return; }
    if (id === 'moi' && !(state.lists || []).some((l) => l.id === 'moi' && l.at)) { status('La liste « Moi » par défaut ne peut pas être supprimée.', 'err'); return; }
    if (state.db) { try { await state.db.collection('listes').doc(id).delete(); status('Liste supprimée.', 'ok'); $('#listSel').value = ''; return; } catch (e) { console.error(e); } }
    try { const l = (localLists() || []).filter((x) => x.id !== id); localStorage.setItem(LISTKEY, JSON.stringify(l)); renderLists(l); status('Liste supprimée.', 'ok'); } catch (e) { /* */ }
  }
  function startLists() {
    if (!state.db) { renderLists(localLists() || []); return; }
    state.db.collection('listes').onSnapshot((snap) => renderLists(snap.docs.map((d) => Object.assign({ id: d.id }, d.data()))),
      (err) => { console.error(err); renderLists(localLists() || []); });
  }
  function esc(x) { return String(x ?? '').replace(/[&<>"]/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c])); }
  function startLog() {
    if (!state.db) { renderLog(localLog(), 'local'); return; }
    const tm = setTimeout(() => { $('#logSrc').textContent = 'Journal momentanément inaccessible ; nouvel essai automatique.'; }, 10000);
    state.db.collection('envois').orderBy('at', 'desc').limit(200).onSnapshot((snap) => {
      if (!snap.metadata.fromCache) clearTimeout(tm);
      renderLog(snap.docs.map((d) => Object.assign({ id: d.id }, d.data())), 'db');
    }, (err) => { clearTimeout(tm); console.error(err); renderLog(localLog(), 'local'); });
  }
  async function exportLog() {
    const rows = state.logRows || [];
    const head = ['Date', 'Scénario', 'Contenu', 'Parties envoyées', 'Parties', 'Taille (Mo)', 'Destinataires', 'Statut', 'Contrôle qualité'];
    const q = (x) => '"' + String(x ?? '').replace(/"/g, '""') + '"';
    const csv = '\uFEFF' + [head.join(';')].concat(rows.map((r) => [r.at, r.scenario, r.cats, r.sent ?? r.parts, r.parts, (r.size / 1048576).toFixed(2).replace('.', ','), r.to, r.status + (r.error ? ' (' + r.error + ')' : ''), r.quality].map(q).join(';'))).join('\r\n');
    await save(`SISSE_KABA_Journal_envois_${today().iso}.csv`, csv);
  }

  /* ---------- scénarios ---------- */
  function applyPreset(id) {
    state.hyp = Object.assign({}, state.base);
    const p = PRESETS[id];
    if (p) { Object.assign(state.hyp, p.set); state.label = p.label; }
    state.autoLabel = false; state.userLabel = false;
    $('#preset').value = id;
    recalc();
  }
  function setRef() { state.ref = SKV.build(state.values, {}); $('#refInfo').textContent = 'Référence figée : ' + state.label; render(); }
  function storeList() { try { return JSON.parse(localStorage.getItem('sk_scen') || '[]'); } catch (e) { return []; } }
  function storeSave() {
    const l = storeList().filter((x) => x.label !== state.label); l.unshift({ label: state.label, hyp: state.hyp });
    try { localStorage.setItem('sk_scen', JSON.stringify(l.slice(0, 12))); status('Scénario mémorisé dans ce navigateur.', 'ok'); } catch (e) { status('Mémorisation indisponible : utilisez l’export JSON.', 'err'); }
    renderStore();
  }
  function renderStore() {
    const l = storeList(); const s = $('#stored');
    s.innerHTML = l.length ? l.map((x, i) => `<button data-s="${i}">${x.label}</button>`).join('') : '<em>Aucun scénario mémorisé.</em>';
    $$('#stored [data-s]').forEach((b) => b.addEventListener('click', () => { const x = l[+b.dataset.s]; state.hyp = Object.assign({}, state.base, x.hyp); state.label = x.label; state.autoLabel = false; state.userLabel = true; $('#preset').value = 'custom'; recalc(); }));
  }
  function importJson(file) {
    const r = new FileReader();
    r.onload = () => { try { const x = JSON.parse(r.result); state.hyp = Object.assign({}, state.base, x.hyp || {}); state.label = x.label || 'Scénario importé'; state.autoLabel = false; state.userLabel = true; $('#preset').value = 'custom'; recalc(); status('Scénario importé.', 'ok'); } catch (e) { status('Fichier JSON invalide.', 'err'); } };
    r.readAsText(file);
  }

  /* ---------- modes d’affichage ---------- */
  function applyEffective() {
    const v = state.view || 'auto';
    const eff = v === 'auto' ? (window.innerWidth <= 900 ? 'mobile' : 'wide') : v;
    document.body.classList.remove('m-mobile', 'm-desktop', 'm-wide', 'm-scaled');
    document.body.classList.add('m-' + eff);
    if (eff === 'desktop') document.body.classList.add('m-wide');
    if (state.eff !== eff) { state.eff = eff; state.zoom = loadZoom(eff); }
    applyZoom();
  }
  /* zoom : l’affichage ordinateur est réduit pour tenir dans un écran étroit, puis le zoom de l’utilisateur s’applique */
  const ZMIN = 0.5, ZMAX = 2, ZSTEP = 0.1;
  function applyZoom() {
    const W = Math.min(window.innerWidth, (window.screen && window.screen.width) || window.innerWidth);
    const scaled = state.eff === 'desktop' && W < 1240;
    document.body.classList.toggle('m-scaled', scaled);
    const base = scaled ? Math.max(0.3, (W - 4) / 1240) : 1;
    const z = base * (state.zoom || 1);
    document.documentElement.style.setProperty('--z', z.toFixed(4));
    const lab = $('#zoomVal'); if (lab) { lab.textContent = Math.round((state.zoom || 1) * 100) + ' %'; lab.title = 'Zoom de la vue ' + (zkey(state.eff) === 'mobile' ? 'téléphone' : 'ordinateur') + ' (mémorisé séparément)'; }
  }
  function zkey(eff) { return eff === 'mobile' ? 'mobile' : 'pc'; }
  function loadZoom(eff) { try { return parseFloat(localStorage.getItem('sk_zoom_' + zkey(eff))) || 1; } catch (e) { return 1; } }
  function setZoom(z) {
    state.zoom = Math.min(ZMAX, Math.max(ZMIN, Math.round(z * 10) / 10));
    try { localStorage.setItem('sk_zoom_' + zkey(state.eff), String(state.zoom)); } catch (e) { /* */ }
    applyZoom();
  }
  function setView(v) {
    state.view = v; applyEffective();
    $$('.viewsw button').forEach((b) => b.classList.toggle('on', b.dataset.view === v));
    // en mode ordinateur sur un petit écran, la page garde sa largeur d’écran d’ordinateur
    try { localStorage.setItem('sk_view', v); } catch (e) { /* indisponible */ }
  }
  function initView() {
    let v = 'auto'; try { v = localStorage.getItem('sk_view') || 'auto'; } catch (e) { /* */ }
    setView(v);
    state.zoom = loadZoom(state.eff);
    applyZoom();
    window.addEventListener('resize', () => { if (state.view === 'auto') applyEffective(); else applyZoom(); });
    $$('[data-zoom]').forEach((b) => b.addEventListener('click', () => {
      const a = b.dataset.zoom; setZoom(a === 'fit' ? 1 : (state.zoom || 1) + (a === '+' ? ZSTEP : -ZSTEP));
    }));
    // Ctrl/Cmd + molette ou + / − / 0 : zoom interne de la page
    window.addEventListener('wheel', (e) => { if (e.ctrlKey || e.metaKey) { e.preventDefault(); setZoom((state.zoom || 1) + (e.deltaY < 0 ? ZSTEP : -ZSTEP)); } }, { passive: false });
    window.addEventListener('keydown', (e) => {
      if (!(e.ctrlKey || e.metaKey)) return;
      if (e.key === '+' || e.key === '=') { e.preventDefault(); setZoom((state.zoom || 1) + ZSTEP); }
      else if (e.key === '-') { e.preventDefault(); setZoom((state.zoom || 1) - ZSTEP); }
      else if (e.key === '0') { e.preventDefault(); setZoom(1); }
    });
    $$('.viewsw button').forEach((b) => b.addEventListener('click', () => setView(b.dataset.view)));
    $$('.bottomnav [data-go]').forEach((b) => b.addEventListener('click', () => {
      if (b.dataset.go === 'top') window.scrollTo({ top: 0, behavior: 'smooth' });
      else document.getElementById(b.dataset.go).scrollIntoView({ behavior: 'smooth', block: 'start' });
    }));
  }

  /* ---------- démarrage ---------- */
  async function init() {
    try { state.temo = JSON.parse(localStorage.getItem('sk_temo') || '{}'); } catch (e) { state.temo = {}; }
    initView(); initPrez();
    $$('[data-fpre]').forEach((b) => b.addEventListener('click', () => applyFeedPreset(b.dataset.fpre)));
    try {
      await loadTemplate(); await loadImages(); temoImgs();
      buildLevers(); bindNet();
      applyPreset('s2');
      setRef();
      $('#preset').addEventListener('change', (e) => { if (e.target.value !== 'custom') applyPreset(e.target.value); });
      $('#label').addEventListener('change', (e) => { state.label = e.target.value || 'Scénario personnalisé'; state.userLabel = true; state.autoLabel = false; recalc(); });
      $('#setRef').addEventListener('click', setRef);
      $('#zipAll').addEventListener('click', saveZip);
      $('#mailBtn').addEventListener('click', () => sendMail());
      $('#listSel').addEventListener('change', applyList);
      $('#mailTo').addEventListener('input', renderTeamMail); renderTeamMail(); renderKitVal();
      $('#kitBtn').addEventListener('click', () => {
        $$('#mailCats input').forEach((i) => { i.checked = i.value === 'kit'; });
        $('#mailTo').value = (SKD.TEAM.kouakou.mail); $('#listSel').value = ''; $('#listName').value = ''; renderTeamMail(); $('#mailOk').checked = false;
        status('Kit communication prêt pour Jean-Noël KOUAKOU : QR codes, kakémonos, fiches A5, présentations du stand (SELAB 12 diapos, visiteur éleveur, visiteur producteur) et logos. Cochez la confirmation puis « Envoyer par mail ».', 'ok');
      });
      $('#listSave').addEventListener('click', saveList);
      $('#listDel').addEventListener('click', deleteList);
      $('#logCsv').addEventListener('click', exportLog);
      $('#memo').addEventListener('click', storeSave);
      $('#imp').addEventListener('change', (e) => e.target.files[0] && importJson(e.target.files[0]));
      $('#reset').addEventListener('click', () => applyPreset('s2'));
      renderStore();
      $('#app').classList.remove('loading');
      $('#loadmsg').textContent = '';
    } catch (e) { console.error(e); $('#loadmsg').textContent = 'Erreur de chargement : ' + e.message; }
    try { state.downloads = window.claude && window.claude.use ? await window.claude.use('downloads') : null; } catch (e) { state.downloads = null; }
    if (!state.downloads) status('Téléchargements disponibles uniquement dans claude.ai (vue artefact).', 'warn');
    try { state.mcp = window.claude && window.claude.use ? await window.claude.use('mcp') : null; } catch (e) { state.mcp = null; }
    if (!state.mcp) { $('#mailNote').textContent = 'Envoi par e-mail disponible uniquement dans claude.ai, avec le connecteur Gmail.'; }
    try { state.db = window.claude && window.claude.use ? await window.claude.use('db') : null; } catch (e) { state.db = null; }
    startLog(); startLists(); startPros(); initStand();
  }
  window.__skS = () => state.V && state.V.S;
  document.addEventListener('DOMContentLoaded', init);
})();
