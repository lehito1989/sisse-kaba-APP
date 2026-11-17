/* SISSÊ~KABA — construit le dictionnaire de valeurs formatées utilisé par tous les documents. */
(function (root) {
  'use strict';
  const NB = ' '; // espace simple : compatible avec toutes les polices et visionneuses
  function fr(x, d) {
    if (x === null || x === undefined || (typeof x === 'number' && !isFinite(x))) return 'n.d.';
    if (typeof x !== 'number') return String(x);
    d = d === undefined ? 0 : d;
    const neg = x < 0;
    let s = Math.abs(x).toFixed(d);
    let [i, f] = s.split('.');
    i = i.replace(/\B(?=(\d{3})+(?!\d))/g, NB);
    return (neg ? '−' : '') + i + (f ? ',' + f : '');
  }
  const M = (x, d) => fr(x / 1e6, d === undefined ? 2 : d);
  const pct = (x, d) => fr(x * 100, d === undefined ? 0 : d) + ' %';
  const YRS = [['B', '27'], ['C', '28'], ['D', '29']];

  /* Données réelles FEED 2026 — fichier GESTION_DES_DEPOTS_FEEDS_Q3_2026 (journal 18_Ventes_2026, 07/01 → 12/11/2026).
     Prémix stricts : Premix Volaille Ponte, Premix 2% Chair Poulette, Premix 2% Porcin, Premix Ruminant 1 %.
     Hors périmètre : DCP, méthionine (matières premières), Piglet booster, minéraux. Juillet incomplet (Yamoussoukro seul). */
  const DEPOTS = {
    asOf: '12/11/2026', jours: 316,
    rows: [
      { nom: 'Dépôt Yamoussoukro', statut: 'Actif', ouverture: '01/01/2026', t: 319.68, jours: 316 },
      { nom: 'Abidjan Siège SOLEVO', statut: 'Actif', ouverture: '01/01/2026', t: 106.52, jours: 316 },
      { nom: 'Dépôt Agnibilekro', statut: 'Actif', ouverture: '13/07/2026', t: 18.06, jours: 123 },
      { nom: 'Dépôt San-Pédro', statut: 'En installation', t: 0 }, { nom: 'Dépôt Gagnoa', statut: 'En installation', t: 0 },
      { nom: 'Dépôt Man', statut: 'En installation', t: 0 }, { nom: 'Dépôt Korhogo', statut: 'En installation', t: 0 },
    ],
    ytd: 444.26, ytdAliment: 22713, runRate3m: 155.6, // août-oct. 2026
    autresFeed: 47.85, // minéraux + Piglet booster
    caFeed2026: 841956535,
  };
  DEPOTS.annual = DEPOTS.ytd * 365 / DEPOTS.jours;
  DEPOTS.annualAliment = DEPOTS.ytdAliment * 365 / DEPOTS.jours;
  DEPOTS.runRateAn = DEPOTS.runRate3m / 3 * 12;
  DEPOTS.rows.forEach((r) => { r.an = r.jours ? r.t * 365 / r.jours : 0; });

  function build(v, meta) {
    meta = meta || {};
    const g = (s, r, c) => v[s + '!' + c + r];
    const H = (r, c) => g('Hypotheses', r, c || 'B');
    const P = (r, c) => g('Previsions', r, c);
    const T = (r, c) => g('Tresorerie', r, c);
    const N = {}; // valeurs numériques brutes
    const S = {}; // chaînes formatées

    const rowsP = {
      premix: 5, sacs: 6, aliment: 7, mais: 8, ha: 9, prod: 10, haPanier: 11, poulets: 12, places: 13, chair: 14,
      pondeuses: 15, ponte: 16, semences: 18, npk: 19, uree: 20, herb: 21, insect: 22, panier: 24, caIntT: 25,
      caFeed: 27, achFeed: 28, mbFeed: 29, caSeed: 30, achSeed: 31, mbSeed: 32, ca: 33, ach: 34, mb: 35,
      soldeFixe: 37, mktFixe: 41, fixes: 42, variables: 43, charges: 44, contrib: 45, pertes: 46, exced: 47,
      amort: 48, res: 49, seuil: 50, fracAdd: 51, gainProd: 53, econAch: 54, solde: 55, mkt: 56,
    };
    const rowsT = { crF: 5, crS: 6, stF: 7, stS: 8, four: 9, bfr: 10, varBfr: 11, capex: 12, flux: 14, bfrMaj: 16, coussin: 17, env: 18, capSup: 19 };
    for (const [c, y] of YRS) {
      for (const k in rowsP) N[k + y] = P(rowsP[k], c);
      for (const k in rowsT) N[k + y] = T(rowsT[k], c);
      N['histFixe' + y] = H(27, c);
      N['histVarU' + y] = H(29, c);
      N['hist' + y] = N['fixes' + y] - (H(23, c) || 0) - (H(24, c) || 0) - (H(25, c) || 0) - (H(26, c) || 0) + N['variables' + y];
      N['haTerrain' + y] = Math.ceil(N['ha' + y] - 1e-9);
      N['risqAmort' + y] = N['pertes' + y] + N['amort' + y];
      N['croiss' + y] = y === '27' ? null : H(52, c);
      N['prixSac' + y] = H(9, c);
      N['mPremix' + y] = H(56, c); N['mAliment' + y] = H(57, c);
      N['pdmP' + y] = P(58, c); N['pdmA' + y] = P(59, c); N['prodBrute' + y] = P(60, c);
      N['ventesExist' + y] = H(58, c) || 0; N['partChair' + y] = H(59, c);
      N['premixTot' + y] = P(62, c); N['pdmPTot' + y] = P(63, c); N['pdmATot' + y] = P(64, c);
      N['alimChair' + y] = P(65, c); N['placesMix' + y] = P(66, c); N['chairMix' + y] = P(67, c);
      N['caChair' + y] = P(80, c); N['caPonte' + y] = P(81, c); N['mbChair' + y] = P(82, c); N['mbPonte' + y] = P(83, c);
      N['sacsChair' + y] = P(78, c); N['sacsPonte' + y] = P(79, c);
      N['sacsPorc' + y] = P(85, c); N['caPorc' + y] = P(86, c); N['mbPorc' + y] = P(87, c); N['alimPorc' + y] = P(88, c); N['porcs' + y] = P(89, c); N['porcMix' + y] = P(90, c);
      N['partPorc' + y] = H(69, c) || 0; N['partPonteV' + y] = 1 - (H(59, c) || 0) - (H(69, c) || 0);
      N['prixChair' + y] = H(65, c); N['prixPonte' + y] = H(66, c); N['prixPorc' + y] = H(73, c); N['hausse' + y] = y === '27' ? 0 : (H(75, c) || 0);
      N['ctrlGamme' + y] = P(84, c); N['ctrlAlim' + y] = P(91, c);
      N['alimPonte' + y] = P(68, c); N['pondMix' + y] = P(69, c); N['ponteMix' + y] = P(70, c); N['eleveursMix' + y] = P(71, c);
    }
    // hypothèses 2027
    const hyp = {
      sacKg: 6, alimSac: 7, txMais: 8, prixSac: 9, margeFeed: 10, rdt: 12, util: 13, aff: 14, surf: 15, couv: 16, margeSeed: 17,
      kgPoulet: 18, cycles: 19, placesFerme: 20, pondJour: 21, pondFerme: 22, pertesPct: 30, dureeAmort: 32,
      jCliF: 33, jCliS: 34, jStF: 35, jStS: 36, jFour: 37, coefSais: 38, coussinH: 39, prixAncien: 40,
      doseSem: 41, prixSem: 42, doseNpk: 43, prixNpk: 44, doseUree: 45, prixUree: 46, doseHerb: 47, prixHerb: 48, doseIns: 49, prixIns: 50,
      partMkt: 28, prixChair: 65, prixPonte: 66, mChair: 67, mPonte: 68, partPorc: 69, inclChair: 70, inclPonte: 71, inclPorc: 72, prixPorc: 73, mPorc: 74, kgPorc: 76, porcsFerme: 77,
    };
    for (const k in hyp) N[k] = H(hyp[k], 'B');
    [['Sem', 60, 41, 42], ['Npk', 61, 43, 44], ['Uree', 62, 45, 46], ['Herb', 63, 47, 48], ['Ins', 64, 49, 50]].forEach(([k, r, d, p]) => {
      const m = H(r, 'B') || 0, dose = H(d, 'B'), prix = H(p, 'B');
      N['m' + k] = m; N['mbHa' + k] = dose * prix * m / (1 + m); N['mb27' + k] = P(72 + [60, 61, 62, 63, 64].indexOf(r), 'B');
    });
    N.mbHa = ['Sem', 'Npk', 'Uree', 'Herb', 'Ins'].reduce((a, k) => a + N['mbHa' + k], 0);
    N.baseFeed = H(11, 'B');
    N.surCout = String(N.baseFeed).toLowerCase() === 'sur coût';
    N.P = g('Gains acteurs', 3, 'B') || meta.P || 0;
    N.tHa = N.rdt * N.util * N.aff;
    N.maisParT = (1000 / N.sacKg) * N.alimSac * N.txMais;
    N.margeFeedCA = N.surCout ? N.margeFeed / (1 + N.margeFeed) : N.margeFeed;
    N.margeSeedCA = N.margeSeed / (1 + N.margeSeed);
    N.preQual = N.mais27 * 0.6;
    N.prospects = N.prod27 * 2;
    N.fermesProsp = N.chair27 * 2;
    N.sumRes = N.res27 + N.res28 + N.res29;
    N.partNat27 = N.mais27 / 1701426;
    N.partNat29 = N.mais29 / 1701426;
    N.haSimple = N.mais27 / N.rdt;
    // par tonne de maïs
    N.caFeedT = N.caFeed27 / N.mais27;
    N.caSeedT = N.caSeed27 / N.mais27;
    N.mbFeedT = N.mbFeed27 / N.mais27;
    N.mbSeedT = N.mbSeed27 / N.mais27;
    N.caT = N.caFeedT + N.caSeedT;
    N.mbT = N.mbFeedT + N.mbSeedT;
    // panier
    N.caSem = N.doseSem * N.prixSem; N.caNpk = N.doseNpk * N.prixNpk; N.caUree = N.doseUree * N.prixUree;
    N.caHerb = N.doseHerb * N.prixHerb; N.caIns = N.doseIns * N.prixIns;
    // sensibilités 2027 (variations isolées)
    N.sensPrixCA = 0.05 * N.caFeed27;
    N.sensPrix = 0.05 * N.caFeed27 * (1 - N.pertesPct);
    const caSeed60 = N.caSeed27 * (0.6 / N.couv);
    N.sensCouvCA = N.caSeed27 - caSeed60;
    N.sensCouv = (N.caSeed27 - caSeed60) * (N.margeSeed / (1 + N.margeSeed)) - (N.caSeed27 - caSeed60) * N.pertesPct;
    N.sensDelai = N.caSeed27 * 30 / 365;
    N.sensRisk = 0.02 * N.ca27;
    N.sensRdtHa = N.mais27 / (3 * N.util * N.aff);
    // marketing 2027 : répartition proportionnelle de la proposition initiale (15/10/8/6/6/4 sur 49)
    const parts = [15, 10, 8, 6, 6, 4];
    const lab = ['Démonstrations et journées terrain', 'Rencontres acheteurs et mobilisation', 'Communication ciblée par zone', 'Supports imprimés et contenus', 'Coopératives et formation plateforme', 'Mesure et ajustements'];
    N.mktSplit = parts.map((p, i) => ({ label: lab[i], v: N.mkt27 * p / 49 }));
    parts.forEach((p, i) => { N['mktA' + (i + 1)] = N.mkt27 * p / 49; });
    // acteurs
    /* P = prix bord champ de référence (FCFA/kg). Avant : producteur 100 %, transport 15 %, entrepôt 5 %, majoration intermédiaire 40 % = 160 % de P.
       Avec SISSÊ~KABA : producteur 115 %, transport 15 %, entrepôt 5 %, majoration 0 % = 135 % de P. */
    N.prixProdAv = N.P; N.prixProdAp = N.P * 1.15; N.prixAchAv = N.P * 1.6; N.prixAchAp = N.P * 1.35;
    N.transpKg = N.P * 0.15; N.entrepotKg = N.P * 0.05; N.majorKg = N.P * 0.4;
    N.gainProdKg = N.P * 0.15; N.gainProdT = N.P * 150; N.econAchKg = N.P * 0.25; N.econAchT = N.P * 250;
    for (const [, y] of YRS) { N['gainP' + y] = N.gainProdT * N['mais' + y]; N['econA' + y] = N.econAchT * N['mais' + y]; }
    N.effetMaisAliment = 0.15625 * N.txMais; // baisse max sur la part maïs de la formule
    N.gainParProd = N.prod27 ? N.gainP27 / N.prod27 : 0;
    N.maisParProd = N.prod27 ? N.mais27 / N.prod27 : 0;
    N.alimParFerme = N.chair27 ? N.aliment27 / N.chair27 : 0;
    N.econParFerme = N.chair27 ? N.econA27 / N.chair27 : 0;
    N.ctrlOK = [g('Controles', 11, 'B'), g('Controles', 11, 'C'), g('Controles', 11, 'D')];
    N.ctrlTotal = 7;

    /* --------- chaînes formatées --------- */
    for (const [, y] of YRS) {
      S['premix' + y] = fr(N['premix' + y], N['premix' + y] % 1 ? 1 : 0);
      S['sacs' + y] = fr(N['sacs' + y]); S['aliment' + y] = fr(N['aliment' + y]); S['mais' + y] = fr(N['mais' + y]);
      S['ha' + y] = fr(N['ha' + y], 2); S['haR' + y] = fr(N['ha' + y]); S['haTerrain' + y] = fr(N['haTerrain' + y]);
      S['prod' + y] = fr(N['prod' + y]); S['haPanier' + y] = fr(N['haPanier' + y]); S['haPanier2' + y] = fr(N['haPanier' + y], 2);
      S['poulets' + y] = fr(N['poulets' + y] / 1e6, 2); S['places' + y] = fr(N['places' + y]); S['chair' + y] = fr(N['chair' + y]);
      S['pondeuses' + y] = fr(N['pondeuses' + y]); S['ponte' + y] = fr(N['ponte' + y]);
      S['semences' + y] = fr(N['semences' + y] / 1000, 1); S['npk' + y] = fr(N['npk' + y] / 1000, 1); S['uree' + y] = fr(N['uree' + y] / 1000, 1);
      S['herb' + y] = fr(N['herb' + y]); S['insect' + y] = fr(N['insect' + y]);
      for (const k of ['caFeed', 'achFeed', 'mbFeed', 'caSeed', 'achSeed', 'mbSeed', 'ca', 'ach', 'mb', 'fixes', 'variables', 'charges', 'contrib', 'pertes', 'exced', 'amort', 'res', 'gainProd', 'econAch', 'solde', 'mkt', 'histFixe', 'hist', 'risqAmort',
        'crF', 'crS', 'stF', 'stS', 'four', 'bfr', 'varBfr', 'capex', 'flux', 'bfrMaj', 'coussin', 'env', 'capSup', 'gainP', 'econA'])
        S[k + y] = M(N[k + y]);
      for (const k of ['ca', 'res', 'bfr', 'env', 'flux', 'mb', 'mkt', 'solde', 'charges', 'caFeed', 'caSeed'])
        S[k + y + '_1'] = M(N[k + y], 1);
      for (const k of ['caFeed', 'caSeed', 'mb', 'res', 'charges', 'mkt', 'ca', 'bfr', 'env', 'gainP', 'econA'])
        S[k + y + 'n'] = (N[k + y] / 1e6).toFixed(2); // valeurs brutes pour graphiques
      S['premix' + y + 'n'] = String(+N['premix' + y].toFixed(2));
      S['mais' + y + 'n'] = String(Math.round(N['mais' + y]));
      S['seuil' + y] = fr(N['seuil' + y], 1);
      S['fracAdd' + y] = pct(N['fracAdd' + y], 1);
      S['histVarU' + y] = fr(N['histVarU' + y]);
      S['croiss' + y] = N['croiss' + y] === null ? '' : pct(N['croiss' + y], 1);
      S['prixSac' + y] = fr(N['prixSac' + y]);
      S['mPremix' + y] = fr(N['mPremix' + y]); S['mAliment' + y] = fr(N['mAliment' + y]);
      S['pdmP' + y] = pct(N['pdmP' + y] || 0, 1); S['pdmA' + y] = pct(N['pdmA' + y] || 0, 1);
      S['prodBrute' + y] = fr(N['prodBrute' + y]);
      S['ventesExist' + y] = fr(N['ventesExist' + y]); S['premixTot' + y] = fr(N['premixTot' + y], N['premixTot' + y] % 1 ? 1 : 0);
      S['pdmPTot' + y] = pct(N['pdmPTot' + y] || 0, 1); S['pdmATot' + y] = pct(N['pdmATot' + y] || 0, 1);
      S['partChair' + y] = pct(N['partChair' + y] || 0, (N['partChair' + y] * 1000) % 10 ? 1 : 0); S['partPonte' + y] = pct(1 - (N['partChair' + y] || 0) - (N['partPorc' + y] || 0), ((1 - (N['partChair' + y] || 0) - (N['partPorc' + y] || 0)) * 1000) % 10 ? 1 : 0);
      for (const k of ['alimChair', 'placesMix', 'chairMix', 'alimPonte', 'pondMix', 'ponteMix', 'eleveursMix']) S[k + y] = fr(N[k + y]);
      S['pdmPTot' + y + 'n'] = ((N['pdmPTot' + y] || 0) * 100).toFixed(2);
      S['pdmP' + y + 'n'] = ((N['pdmP' + y] || 0) * 100).toFixed(2); S['pdmA' + y + 'n'] = ((N['pdmA' + y] || 0) * 100).toFixed(2);
      S['ctrl' + y] = N.ctrlOK[YRS.findIndex((x) => x[1] === y)] + '/' + N.ctrlTotal;
    }
    S.sacKg = fr(N.sacKg); S.alimSac = fr(N.alimSac); S.txMais = pct(N.txMais); S.prixSac = fr(N.prixSac);
    S.margeFeed = pct(N.margeFeed, N.margeFeed * 1000 % 10 ? 1 : 0); S.baseFeed = N.surCout ? 'sur coût' : 'sur chiffre d’affaires';
    S.margeFeedCA = pct(N.margeFeedCA, 2); S.margeSeed = pct(N.margeSeed, N.margeSeed * 1000 % 10 ? 1 : 0); S.margeSeedCA = pct(N.margeSeedCA, 2);
    S.coefFeed = fr(1 + N.margeFeed, 2); S.coefSeed = fr(1 + N.margeSeed, 2);
    S.rdt = fr(N.rdt, N.rdt % 1 ? 1 : 0); S.util = pct(N.util); S.aff = pct(N.aff); S.surf = fr(N.surf, N.surf % 1 ? 1 : 0); S.couv = pct(N.couv);
    S.tHa = fr(N.tHa, 2); S.maisParT = fr(N.maisParT, 1);
    S.kgPoulet = fr(N.kgPoulet, N.kgPoulet % 1 ? 1 : 0); S.cycles = fr(N.cycles); S.placesFerme = fr(N.placesFerme); S.pondJour = fr(N.pondJour * 1000); S.pondFerme = fr(N.pondFerme);
    S.pertesPct = pct(N.pertesPct, N.pertesPct * 100 % 1 ? 1 : 0); S.dureeAmort = fr(N.dureeAmort);
    S.jCliF = fr(N.jCliF); S.jCliS = fr(N.jCliS); S.jStF = fr(N.jStF); S.jStS = fr(N.jStS); S.jFour = fr(N.jFour);
    S.coefSais = fr(N.coefSais, 1); S.coussinH = M(N.coussinH, 0); S.capex27_0 = M(N.capex27, 0);
    S.partMkt = pct(N.partMkt); S.partSolde = pct(1 - N.partMkt);
    S.panier = fr(N.panier27); S.caIntT = fr(N.caIntT27);
    ['Sem', 'Npk', 'Uree', 'Herb', 'Ins'].forEach((k) => { S['m' + k] = pct(N['m' + k], 1); S['mbHa' + k] = fr(N['mbHa' + k]); S['mb27' + k] = M(N['mb27' + k]); S['marque' + k] = pct(N['m' + k] / (1 + N['m' + k]), 1); });
    S.mbHa = fr(N.mbHa); S.mbHaT = fr(N.mbHa / N.tHa);
    const mq = (m) => (N.surCout ? m / (1 + m) : m);
    const cu = (p, m) => (N.surCout ? p / (1 + m) : p * (1 - m));
    S.prixChair = fr(N.prixChair); S.prixPonte = fr(N.prixPonte); S.mChair = pct(N.mChair, 1); S.mPonte = pct(N.mPonte, 1);
    S.marqueChair = pct(mq(N.mChair), 1); S.marquePonte = pct(mq(N.mPonte), 1);
    S.coutChair = fr(cu(N.prixChair, N.mChair)); S.coutPonte = fr(cu(N.prixPonte, N.mPonte));
    S.gainSacChair = fr(N.prixChair - cu(N.prixChair, N.mChair)); S.gainSacPonte = fr(N.prixPonte - cu(N.prixPonte, N.mPonte));
    S.prixPorc = fr(N.prixPorc); S.mPorc = pct(N.mPorc, 1); S.marquePorc = pct(mq(N.mPorc), 1);
    S.coutPorc = fr(cu(N.prixPorc, N.mPorc)); S.gainSacPorc = fr(N.prixPorc - cu(N.prixPorc, N.mPorc));
    S.inclChair = pct(N.inclChair, 1); S.inclPonte = pct(N.inclPonte, 1); S.inclPorc = pct(N.inclPorc, 1);
    S.kgPorc = fr(N.kgPorc); S.porcsFerme = fr(N.porcsFerme);
    S.hausse28 = pct(N.hausse28, 1); S.hausse29 = pct(N.hausse29, 1);
    S.alimSacMoy = fr(N.alimSac, 2);
    S.prixSacT = fr(N.prixSac); S.margeFeedP = pct(N.margeFeed, 1); S.marqueFeed = pct(N.margeFeedCA, 1);
    for (const [, y] of YRS) {
      S['sacsChair' + y] = fr(N['sacsChair' + y]); S['sacsPonte' + y] = fr(N['sacsPonte' + y]);
      for (const k of ['caChair', 'caPonte', 'mbChair', 'mbPonte', 'caPorc', 'mbPorc']) S[k + y] = M(N[k + y]);
      /* équivalent euros (1 € = 656 FCFA) des CA et marges : jetons {{ca27E}}, {{mb27E}}… */
      for (const k of ['ca', 'mb', 'res', 'caFeed', 'caSeed', 'mbFeed', 'mbSeed', 'caChair', 'caPonte', 'mbChair', 'mbPonte', 'caPorc', 'mbPorc']) {
        const v = N[k + y]; if (typeof v !== 'number' || !isFinite(v)) continue; const e = v / 656, a = Math.abs(e);
        S[k + y + 'E'] = a >= 1e6 ? fr(e / 1e6, 2) + ' M€' : a >= 1e4 ? fr(e / 1e3, 0) + ' k€' : fr(e, 0) + ' €';
      }
      S['sacsPorc' + y] = fr(N['sacsPorc' + y]); S['alimPorc' + y] = fr(N['alimPorc' + y]); S['porcs' + y] = fr(N['porcs' + y]); S['porcMix' + y] = fr(N['porcMix' + y]);
      S['partPorc' + y] = pct(N['partPorc' + y], 1); S['partPonteV' + y] = pct(N['partPonteV' + y], 1); S['partChairV' + y] = pct(N['partChair' + y] || 0, 1);
      S['prixChair' + y] = fr(N['prixChair' + y]); S['prixPonte' + y] = fr(N['prixPonte' + y]); S['prixPorc' + y] = fr(N['prixPorc' + y]);
    }
    S.doseSem = fr(N.doseSem); S.prixSem = fr(N.prixSem); S.caSem = fr(N.caSem);
    S.doseNpk = fr(N.doseNpk); S.prixNpk = fr(N.prixNpk); S.caNpk = fr(N.caNpk);
    S.doseUree = fr(N.doseUree); S.prixUree = fr(N.prixUree); S.caUree = fr(N.caUree);
    S.doseHerb = fr(N.doseHerb); S.prixHerb = fr(N.prixHerb); S.caHerb = fr(N.caHerb);
    S.doseIns = fr(N.doseIns); S.prixIns = fr(N.prixIns); S.caIns = fr(N.caIns);
    S.preQual = fr(N.preQual); S.prospects = fr(N.prospects); S.fermesProsp = fr(N.fermesProsp);
    S.sumRes = M(N.sumRes); S.partNat27 = pct(N.partNat27, 2); S.partNat29 = pct(N.partNat29, 2); S.haSimple = fr(N.haSimple);
    S.caFeedT = fr(N.caFeedT); S.caSeedT = fr(N.caSeedT); S.mbFeedT = fr(N.mbFeedT); S.mbSeedT = fr(N.mbSeedT); S.caT = fr(N.caT); S.mbT = fr(N.mbT);
    S.sensPrixCA = M(N.sensPrixCA); S.sensPrix = M(N.sensPrix); S.sensCouvCA = M(N.sensCouvCA); S.sensCouv = M(N.sensCouv);
    S.sensDelai = M(N.sensDelai); S.sensRisk = M(N.sensRisk); S.sensRdtHa = fr(N.sensRdtHa);
    for (let i = 1; i <= 6; i++) S['mktA' + i] = M(N['mktA' + i], 1);
    const f1 = (x) => fr(x, Math.abs(x - Math.round(x)) < 1e-9 ? 0 : 1);
    S.P = fr(N.P); S.prixProdAv = f1(N.prixProdAv); S.prixProdAp = f1(N.prixProdAp); S.prixAchAv = f1(N.prixAchAv); S.prixAchAp = f1(N.prixAchAp);
    S.transpKg = f1(N.transpKg); S.entrepotKg = f1(N.entrepotKg); S.majorKg = f1(N.majorKg);
    S.gainProdKg = f1(N.gainProdKg); S.gainProdT = fr(N.gainProdT); S.econAchKg = f1(N.econAchKg); S.econAchT = fr(N.econAchT);
    S.pctProd = '+15 %'; S.pctEleveur = '−15,6 %';
    S.prixProdApT = fr(N.prixProdAp * 1000); S.transpT = fr(N.transpKg * 1000); S.entrepotT = fr(N.entrepotKg * 1000); S.prixAchApT = fr(N.prixAchAp * 1000); S.prixAchAvT = fr(N.prixAchAv * 1000);
    S.gainParProd = M(N.gainParProd, 2); S.maisParProd = fr(N.maisParProd, 1); S.alimParFerme = fr(N.alimParFerme, 0); S.econParFerme = M(N.econParFerme, 2);
    S.gainParProdF = fr(N.gainParProd); S.econParFermeF = fr(N.econParFerme);
    S.effetMaisAliment = pct(N.effetMaisAliment, 0);
    // part de marché actuelle (données dépôts 2026)
    const D = DEPOTS, mP = N.mPremix27 || 35000, mA = N.mAliment27 || 500000;
    N.depAnnual = D.annual; N.pdmAct = D.annual / mP; N.pdmActYtd = D.ytd / mP; N.pdmRun = D.runRateAn / mP;
    N.pdmAlimAct = D.annualAliment / mA; N.ratioMarche = mA / mP;
    S.depAsOf = D.asOf; S.depYtd = fr(D.ytd, 1); S.depAnnual = fr(D.annual, 0); S.depRun = fr(D.runRateAn, 0);
    S.pdmAct = pct(N.pdmAct, 2); S.pdmActYtd = pct(N.pdmActYtd, 2); S.pdmRun = pct(N.pdmRun, 2);
    S.depAlimAn = fr(D.annualAliment, 0); S.pdmAlimAct = pct(N.pdmAlimAct, 1); S.ratioMarche = fr(N.ratioMarche, 1);
    S.inclMarche = pct(1 / N.ratioMarche, 1);
    D.rows.forEach((r, i) => { S['depNom' + i] = r.nom; S['depStat' + i] = r.statut; S['depT' + i] = r.t ? fr(r.t, 1) : '—'; S['depAn' + i] = r.an ? fr(r.an, 0) : '—'; S['depPart' + i] = r.t ? pct(r.t / D.ytd, 0) : '—'; });
    S.depAutres = fr(D.autresFeed, 1);
    const gP = N.mPremix27 ? N.mPremix28 / N.mPremix27 - 1 : 0, gA = N.mAliment27 ? N.mAliment28 / N.mAliment27 - 1 : 0;
    S.mktGrowth = (Math.abs(gP) < 1e-9 && Math.abs(gA) < 1e-9) ? 'stables sur 2027–2029' : `croissance de ${pct(gP, 1)} par an pour le prémix et de ${pct(gA, 1)} pour l’aliment`;
    S.ventesExistNote = N.ventesExist27 > 0 ? '' : ' (ventes actuelles hors programme non renseignées : part totale = part du programme)';
    S.scenario = meta.label || String(v['Hypotheses!B54'] || 'Scénario personnalisé');
    S.scenarioTag = meta.tag || 'scenario';
    S.date = meta.date || '';
    S.dateLong = meta.dateLong || '';
    S.depNew = String(meta.depNew ?? 4); S.depTotal = String(3 + (meta.depNew ?? 4));
    S.users27 = fr((N.prod27 || 0) + (N.eleveursMix27 || 0));
    S.alimSacChairT = fr(N.sacKg / 1000 / N.inclChair, 2); S.alimSacPonteT = fr(N.sacKg / 1000 / N.inclPonte, 2); S.alimSacPorcT = fr(N.sacKg / 1000 / N.inclPorc, 2);
    S.pres = 'Elvis LEHITO et Arnaud AGOHI';
    for (const w of ['Elev', 'Prod']) {
      const t = (meta.temo && meta.temo[w]) || {};
      const ok = !!(t.ok && t.citation && t.nom);
      S['temo' + w + 'Ok'] = ok ? '1' : '';
      S['temo' + w + 'Nom'] = t.nom || ''; S['temo' + w + 'Lieu'] = t.lieu || ''; S['temo' + w + 'Profil'] = t.profil || '';
      S['temo' + w + 'Citation'] = t.citation ? '« ' + String(t.citation).replace(/^[«"“\s]+|[»"”\s]+$/g, '') + ' »' : '';
      S['temo' + w + 'Chiffre'] = t.chiffre || ''; S['temo' + w + 'ChiffreL'] = t.chiffreL || ''; S['temo' + w + 'Date'] = t.date || meta.date || '';
    }
    {
      const aC = N.placesFerme * N.kgPoulet * N.cycles / 1000, aP = N.pondFerme * N.pondJour * 365 / 1000, aK = N.porcsFerme * N.kgPorc / 1000;
      const asC = N.sacKg / 1000 / N.inclChair, asP = N.sacKg / 1000 / N.inclPonte, asK = N.sacKg / 1000 / N.inclPorc;
      S.alimAnChair = fr(aC, 0); S.alimAnPonte = fr(aP, 0); S.alimAnPorc = fr(aK, 0);
      S.sacsAnChair = fr(aC / asC, 0); S.sacsAnPonte = fr(aP / asP, 0); S.sacsAnPorc = fr(aK / asK, 0);
      S.maisAnChair = fr(aC * N.txMais, 0); S.maisAnPonte = fr(aP * N.txMais, 0); S.maisAnPorc = fr(aK * N.txMais, 0);
      S.econAnChair = M(aC * N.txMais * 1000 * (N.prixAchAv - N.prixAchAp), 2); S.econAnPonte = M(aP * N.txMais * 1000 * (N.prixAchAv - N.prixAchAp), 2); S.econAnPorc = M(aK * N.txMais * 1000 * (N.prixAchAv - N.prixAchAp), 2);
      const recAv = N.tHa * 1000 * N.prixProdAv, recAp = N.tHa * 1000 * N.prixProdAp;
      S.recHaAv = fr(recAv, 0); S.recHaAp = fr(recAp, 0); S.gainHa = fr(recAp - recAv, 0); S.gainHa5 = M((recAp - recAv) * N.surf, 2);
    }
    S.dateGarde = meta.dateGarde || ('©' + (meta.dateLong || ''));
    S.contact = 'Elvis.lehito@solevogroup.com';
    S.porteur = 'LEHITO GNAKOURY Elvis, Key Account Manager FEED, SOLEVO Côte d’Ivoire';
    // phrases conditionnelles
    S.txtCroissance = (N.croiss28 !== null ? 'croissance de ' + pct(N.croiss28, 1) + ' en 2028 puis ' + pct(N.croiss29, 1) + ' en 2029, composée à partir de la base 2027' : '');
    S.txtBaseFeed = N.surCout
      ? `Le modèle retient ${S.margeFeed} sur coût pour le prémix : achats = CA ÷ ${S.coefFeed}. La marge brute FEED 2027 est donc de ${M(N.mbFeed27)} M FCFA, soit ${S.margeFeedCA} du CA, et non ${M(N.caFeed27 * N.margeFeed)} M. Si le taux signifie une marge sur CA, choisir « Sur CA » dans Excel.`
      : `Le modèle retient ${S.margeFeed} sur chiffre d’affaires pour le prémix : achats = CA × (1 − ${S.margeFeed}). La marge brute FEED 2027 est de ${M(N.mbFeed27)} M FCFA. Si le taux signifie une marge sur coût, choisir « Sur coût » dans Excel.`;
    S.txtFlux = N.flux27 < 0
      ? `Le flux 2027 est négatif de ${M(-N.flux27)} M FCFA malgré un résultat positif : le démarrage constitue le BFR.`
      : `Le flux 2027 reste positif à ${M(N.flux27)} M FCFA, après constitution du BFR.`;
    S.flux27s = (N.flux27 < 0 ? '−' : '') + M(Math.abs(N.flux27), 1) + ' M';
    S.ctrlSummary = N.ctrlOK.every((x) => x === N.ctrlTotal) ? 'Tous les contrôles du modèle sont OK' : 'Attention : un contrôle du modèle signale un écart';
    return { N, S, fr, M, pct };
  }

  root.SKV = { build, fr, DEPOTS };
})(typeof window !== 'undefined' ? window : globalThis);
