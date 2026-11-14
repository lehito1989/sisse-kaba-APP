/* SISSÊ~KABA — trois présentations courtes (SELAB 12, CODIR 13, IT SOLEVO 15).
   Une seule source pour le mode plein écran du simulateur et pour les fichiers PowerPoint / PDF.
   Jetons {{cle}} remplacés par les valeurs du scénario courant. */
(function (root) {
  'use strict';
  /* Équipe SOLEVO Côte d’Ivoire du projet (annuaire interne) */
  const TEAM = {
    kouame: { nom: 'Konan Christophe KOUAME', role: 'Chemical Regional Business Manager', tel: '07 98 47 66 85', mail: 'christophe.kouame@solevogroup.com', mission: 'Mandant (FEED)' },
    konan: { nom: 'Yao Kouassi Philippe Olivier KONAN', role: 'Regional Business Manager Agro', tel: '07 49 48 59 54', mail: 'olivier.konan@solevogroup.com', mission: 'Mandant (SEED / Agro)' },
    lehito: { nom: 'Gnakoury Elvis LEHITO', court: 'Elvis LEHITO', role: 'Key Account Manager FEED (Nutrition animale)', tel: '07 10 47 14 02', mail: 'elvis.lehito@solevogroup.com', mission: 'Porteur du projet, volet FEED' },
    agohi: { nom: 'Kauphy Arnaud AGOHI', court: 'Arnaud AGOHI', role: 'Key Account Manager SEED', tel: '07 87 87 73 54', mail: 'arnaud.agohi@solevogroup.com', mission: 'Porteur du projet, volet SEED' },
    ouattara: { nom: 'Ibrahim OUATTARA', role: 'Agent technique élevage', tel: '07 09 62 54 62', mail: 'ibrahim.ouattara@solevogroup.com', mission: 'Suivi des éleveurs (zone Est, Agnibilékrou)', manager: 'Elvis LEHITO' },
    kouadio: { nom: 'Kouassi François KOUADIO', role: 'Agent technique élevage', tel: '07 09 20 91 15', mail: 'francois.kouadio@solevogroup.com', mission: 'Suivi des éleveurs (zone Centre, Yamoussoukro)', manager: 'Elvis LEHITO' },
    kouakou: { nom: 'Jean-Noël KOUAKOU', role: 'Responsable marketing Agro', tel: '07 58 39 21 43', mail: 'jean-noel.kouakou@solevogroup.com', mission: 'Marketing Agro : communication du salon et du projet' },
    koffi: { nom: 'Aubin Ghislain KOFFI', role: 'Agent technique semence', tel: '07 58 21 49 95', mail: 'aubin.koffi@solevogroup.com', mission: 'Suivi des producteurs de maïs', manager: 'Arnaud AGOHI' },
  };
  const PRES = 'Elvis LEHITO et Arnaud AGOHI';
  const PRES_R = 'Key Account Managers FEED et SEED • SOLEVO Côte d’Ivoire';
  const MANDAT = 'Mandatés par Christophe KOUAME et Olivier KONAN';
  const COVER = { pres: PRES, presSub: 'Key Account Managers FEED et SEED\n' + MANDAT };
  const H3 = ['', '2027', '2028', '2029'];
  const EURK = /^(ca|mb|res|caFeed|caSeed|mbFeed|mbSeed)$/;
  const y3 = (l, k) => [l].concat(['27', '28', '29'].map((y) => `{{${k}${y}}}` + (EURK.test(k) ? `\n≈ {{${k}${y}E}}` : '')));

  const selab = {
    id: 'selab12', short: 'selab', folder: '02_Lancement_SELAB', file: 'SISSE_KABA_SELAB_SHOW_12_diapos',
    name: 'Présentation SELAB SHOW (12 diapos)', menu: 'SELAB SHOW', aud: 'Éleveurs, producteurs et partenaires',
    foot: 'SOLEVO Côte d’Ivoire • FEED & SEED • SELAB SHOW, 20–22 novembre 2026 • Parc des sports d’Abidjan',
    slides: [
      { type: 'cover', pres: COVER.pres, presSub: COVER.presSub, theme: 'selab', tag: 'SELAB SHOW 2026 • Présentation publique', title: 'SISSÊ~KABA', sub: 'Le maïs des producteurs ivoiriens, au cœur de l’aliment des éleveurs',
        aud: 'Éleveurs, producteurs et partenaires', band: 'SELAB SHOW • 20–22 novembre 2026 • Parc des sports d’Abidjan',
        figs: [{ v: '{{mais27}} t', l: 'de maïs à valoriser en 2027' }, { v: '{{prod27}}', l: 'producteurs de maïs' }, { v: '{{eleveursMix27}}', l: 'éleveurs accompagnés' }],
        notes: `OBJECTIF : accueillir le public du stand et donner envie d’écouter 10 minutes.
MESSAGES CLÉS : SISSÊ~KABA relie les producteurs de maïs et les éleveurs ivoiriens, avec SOLEVO Côte d’Ivoire comme tiers de confiance technique (prémix FEED, intrants SEED, appui des techniciens).
CHIFFRES À CITER : {{mais27}} t de maïs à valoriser en 2027, {{prod27}} producteurs et {{eleveursMix27}} éleveurs.
CONSEIL D’ANIMATION : se présenter ({{pres}}), demander qui est producteur, qui est éleveur, puis adapter les exemples.
TRANSITION : « Partons de ce que vous vivez chaque campagne. »` },
      { type: 'content', title: 'Le défi que nous relevons ensemble', sub: 'Un même maïs, deux métiers qui se cherchent',
        blocks: [{ k: 'cols', items: [
          { h: 'Côté éleveurs', l: ['Le maïs pèse environ {{txMais}} de l’aliment', 'Prix élevés et irréguliers selon les saisons', 'Qualité variable, risques de mycotoxines'] },
          { h: 'Côté producteurs', l: ['Débouchés incertains à la récolte', 'Prix bord champ bas, intermédiaires nombreux', 'Accès limité aux intrants de qualité'] },
          { h: 'Pour la filière', l: ['Peu de contrats entre maillons', 'Stockage et logistique dispersés', 'Besoin d’un tiers de confiance technique'] }] }],
        comments: ['Partir des difficultés vécues par le public avant de présenter la solution.'],
        notes: `OBJECTIF : créer l’adhésion en nommant les difficultés des deux publics.
MESSAGES CLÉS : l’éleveur paie un maïs cher et de qualité inégale ; le producteur vend mal faute d’acheteur sûr. Les deux ont intérêt à se rencontrer avec des règles claires.
QUESTION À POSER : « Qui a déjà manqué de maïs ou l’a payé plus cher que prévu cette année ? »
TRANSITION : « Voici comment nous proposons de les relier. »` },
      { type: 'content', title: 'Notre réponse : relier le champ et l’élevage', sub: 'Trois leviers réunis dans un seul programme',
        blocks: [{ k: 'cols', items: [
          { h: 'FEED — prémix SOLEVO', l: ['Prémix chair, pondeuse et porcin', 'Appui technique des ATE sur le terrain', '{{premix27}} t de prémix visées en 2027'] },
          { h: 'SEED — intrants maïs', l: ['Semences, NPK, urée, protection des cultures', 'Panier de {{panier}} FCFA par hectare', '{{haPanier27}} ha couverts en 2027'] },
          { h: 'Plateforme SISSÊ~KABA', l: ['Mise en relation producteurs – éleveurs', 'Contrats, livraisons et suivi qualité', 'Tableaux de bord pour chaque acteur'] }] }],
        comments: ['SOLEVO vend le prémix et les intrants ; le maïs reste vendu par le producteur à l’éleveur.'],
        notes: `OBJECTIF : présenter la solution en trois leviers simples.
MESSAGES CLÉS : FEED apporte la demande (éleveurs et prémix), SEED sécurise la production (intrants et conseil), la plateforme organise les contrats et les livraisons.
POINT DE VIGILANCE : SOLEVO n’achète ni ne revend le maïs ; il facilite la relation et garantit l’appui technique.
TRANSITION : « Concrètement, comment cela se passe ? »` },
      { type: 'content', title: 'Comment ça marche', sub: 'Cinq étapes, de l’inscription à l’aliment',
        blocks: [{ k: 'steps', items: [
          { h: 'Inscription', t: 'Producteurs et éleveurs rejoignent le programme via les ATE et les dépôts SOLEVO.' },
          { h: 'Contrat', t: 'Volumes, qualité et prix de référence du maïs fixés avant la campagne.' },
          { h: 'Production', t: 'Le producteur cultive avec le panier d’intrants et l’appui technique.' },
          { h: 'Livraison', t: 'Le maïs conforme est livré aux éleveurs ou à leurs fabricants d’aliment.' },
          { h: 'Aliment', t: 'L’éleveur fabrique son aliment avec le prémix SOLEVO et suit ses résultats.' }] }],
        comments: ['Chaque étape est suivie sur la plateforme et accompagnée par un technicien.'],
        notes: `OBJECTIF : rendre le parcours concret et rassurant.
DÉROULÉ : inscription (gratuite, sur le stand ou auprès d’un ATE), contrat avant la campagne, production avec le panier SEED, livraison contrôlée, puis fabrication de l’aliment avec le prémix SOLEVO.
QUESTION PROBABLE : « Qui fixe le prix ? » Un prix de référence est convenu avant la campagne entre producteurs et éleveurs, avec l’appui du programme.
TRANSITION : « Voici l’ambition pour 2027. »` },
      { type: 'content', title: 'Le programme en 2027', sub: 'Les volumes visés pour la première année',
        blocks: [{ k: 'kpis', items: [{ v: '{{premix27}} t', l: 'de prémix SOLEVO' }, { v: '{{aliment27}} t', l: 'd’aliment fini produit' }, { v: '{{mais27}} t', l: 'de maïs mobilisé' }] },
          { k: 'kpis', items: [{ v: '{{prod27}}', l: 'producteurs de maïs' }, { v: '{{eleveursMix27}}', l: 'éleveurs accompagnés' }, { v: '{{haTerrain27}} ha', l: 'à mobiliser' }] }],
        comments: ['Objectifs de travail, ajustés campagne après campagne.'],
        notes: `OBJECTIF : donner l’échelle du programme.
CHIFFRES : {{premix27}} t de prémix permettent de fabriquer {{aliment27}} t d’aliment, qui contiennent {{mais27}} t de maïs. Il faut pour cela {{haTerrain27}} ha et environ {{prod27}} producteurs de {{surf}} ha ; côté élevage, {{eleveursMix27}} éleveurs.
TRANSITION : « Que gagne chacun ? Commençons par le producteur. »` },
      { type: 'content', title: 'Ce que gagne le producteur', sub: 'Un débouché sûr et un meilleur prix',
        blocks: [{ k: 'kpis', items: [{ v: '{{prixProdAv}} → {{prixProdAp}}', l: 'FCFA/kg payés au producteur (+30 %)' }, { v: '{{gainParProd}} M', l: 'FCFA de recettes en plus par producteur et par an' }, { v: '{{gainP27}} M', l: 'FCFA de recettes en plus pour tous les producteurs en 2027' }] }],
        comments: ['Gains attendus si les conditions du programme sont réunies (prix illustratif P = {{P}} FCFA/kg).', 'Ces gains ne sont pas ajoutés au chiffre d’affaires SOLEVO.'],
        notes: `OBJECTIF : convaincre les producteurs.
CALCUL : le producteur vend aujourd’hui autour de {{prixProdAv}} FCFA/kg bord champ ; le programme vise {{prixProdAp}} FCFA/kg (+30 %) grâce au contrat et à la qualité. Pour {{maisParProd}} t livrées en moyenne, cela fait {{gainParProd}} M FCFA de recettes en plus par an.
POINT DE VIGILANCE : ce sont des gains attendus, pas garantis ; ils dépendent du rendement, de la qualité et du respect du contrat.
TRANSITION : « Et l’éleveur ? »` },
      { type: 'content', title: 'Ce que gagne l’éleveur', sub: 'Un maïs moins cher et plus régulier',
        blocks: [{ k: 'kpis', items: [{ v: '{{P}} → {{prixAchAp}}', l: 'FCFA/kg payés pour le maïs (−15 %)' }, { v: '{{econParFerme}} M', l: 'FCFA d’économies par élevage et par an' }, { v: '{{alimParFerme}} t', l: 'd’aliment par élevage et par an' }] }],
        comments: ['Économies attendues, à confirmer avec les prix réels de la campagne.'],
        notes: `OBJECTIF : convaincre les éleveurs.
CALCUL : en achetant directement aux producteurs sous contrat, l’éleveur vise un maïs à {{prixAchAp}} FCFA/kg au lieu de {{P}} FCFA/kg, soit {{econParFerme}} M FCFA d’économies par an pour un élevage qui consomme {{alimParFerme}} t d’aliment.
AUTRES BÉNÉFICES : moins de ruptures, qualité suivie, conseil des ATE sur la formule.
TRANSITION : « Voici les prémix que nous proposons. »` },
      { type: 'content', title: 'Nos prémix pour chaque élevage', sub: 'Gamme MG2MIX distribuée par SOLEVO Côte d’Ivoire',
        blocks: [{ k: 'table', head: ['Gamme', 'Incorporation', 'Aliment par sac de 20 kg', 'Part du programme'], w: [2, 1.2, 1.6, 1.3], rows: [
          ['Poulet de chair', '{{inclChair}}', '{{alimSacChairT}} t', '{{partChair27}}'], ['Poule pondeuse', '{{inclPonte}}', '{{alimSacPonteT}} t', '{{partPonte27}}'], ['Porc', '{{inclPorc}}', '{{alimSacPorcT}} t', '{{partPorc27}}']] }],
        comments: ['Conseil de formulation assuré par les techniciens d’élevage (ATE).'],
        notes: `OBJECTIF : présenter l’offre FEED sans entrer dans les prix.
MESSAGES CLÉS : un sac de 20 kg de prémix à {{inclChair}} d’incorporation donne {{alimSacChairT}} t d’aliment ; chaque gamme a sa formule. Les ATE aident à calculer la bonne formule selon le cheptel.
TRANSITION : « Côté producteurs, voici le panier d’intrants. »` },
      { type: 'content', title: 'Le panier d’intrants SEED par hectare', sub: 'Tout ce qu’il faut pour un hectare de maïs',
        blocks: [{ k: 'table', head: ['Intrant', 'Dose par ha', 'Coût par ha (FCFA)'], w: [2, 1.3, 1.5], rows: [
          ['Semences', '{{doseSem}} kg', '{{caSem}}'], ['NPK', '{{doseNpk}} kg', '{{caNpk}}'], ['Urée', '{{doseUree}} kg', '{{caUree}}'], ['Herbicide', '{{doseHerb}} L', '{{caHerb}}'], ['Insecticide', '{{doseIns}} L', '{{caIns}}'], ['Total panier', '', '{{panier}}']] }],
        comments: ['Doses et prix de chiffrage, à valider par l’équipe agronomique (pas une prescription).'],
        notes: `OBJECTIF : montrer l’offre SEED.
MESSAGES CLÉS : le panier complet coûte {{panier}} FCFA par hectare ; il vise un rendement de {{rdt}} t/ha. Les doses seront adaptées à chaque zone par l’équipe agronomique.
TRANSITION : « Pour être proches de vous, nous ouvrons des dépôts. »` },
      { type: 'content', title: 'Un réseau de proximité', sub: 'Le prémix au plus près des élevages',
        blocks: [{ k: 'kpis', items: [{ v: '3 + {{depNew}}', l: 'dépôts : 3 actifs, {{depNew}} en installation' }, { v: '{{depAnnual}} t', l: 'de prémix vendues en 2026 (année pleine)' }, { v: 'ATE', l: 'techniciens d’élevage sur le terrain' }] }],
        comments: ['Dépôts actifs : Abidjan, Yamoussoukro, Agnibilékrou. Données au {{depAsOf}}.'],
        notes: `OBJECTIF : rassurer sur la disponibilité.
MESSAGES CLÉS : 3 dépôts actifs (Abidjan, Yamoussoukro, Agnibilékrou) et {{depNew}} en installation pour décentraliser le stock de prémix. Les ATE prennent les commandes et suivent les élevages.
TRANSITION : « Voici où nous voulons aller d’ici 2029. »` },
      { type: 'content', title: 'Nos objectifs 2027–2029', sub: 'Une montée en puissance progressive',
        blocks: [{ k: 'table', head: ['Objectif', '2027', '2028', '2029'], w: [2.6, 1, 1, 1], rows: [y3('Producteurs de maïs', 'prod'), y3('Hectares à mobiliser', 'haTerrain'), y3('Maïs valorisé (t)', 'mais'), y3('Éleveurs accompagnés', 'eleveursMix'), y3('Aliment fini produit (t)', 'aliment')] }],
        comments: ['{{txtCroissance}}.'],
        notes: `OBJECTIF : montrer la trajectoire.
CHIFFRES : de {{prod27}} producteurs en 2027 à {{prod29}} en 2029 ; de {{eleveursMix27}} à {{eleveursMix29}} éleveurs ; {{mais29}} t de maïs valorisées en 2029.
TRANSITION : « Et maintenant, comment nous rejoindre ? »` },
      { type: 'content', title: 'Rejoignez SISSÊ~KABA', sub: 'Inscrivez-vous dès aujourd’hui sur notre stand', full: true,
        blocks: [{ k: 'qr', h: 'Scannez pour vous inscrire', t: 'Le QR code ouvre la fiche d’inscription dans votre navigateur, sans application. Remplissez-la, puis envoyez-la : votre table vous est indiquée en retour.', lines: [{ v: '+225 07 77 19 09 94', l: 'Inscription par WhatsApp' }, { v: '07 10 47 14 02 • 07 87 87 73 54', l: 'Elvis LEHITO (élevage, FEED) • Arnaud AGOHI (maïs, SEED)' }, { v: 'elvis.lehito@solevogroup.com', l: 'E-mail (arnaud.agohi@solevogroup.com pour le maïs)' }], sign: PRES + ' • ' + PRES_R }],
        notes: `OBJECTIF : transformer l’intérêt en inscriptions.
APPEL À L’ACTION : inviter chacun à scanner le QR code (fiche d’inscription en ligne, sans application) ou à laisser ses coordonnées à l’équipe du stand.
À NOTER POUR CHAQUE INSCRIT : nom, téléphone, localité, producteur ou éleveur, surface ou cheptel.
CONCLUSION : remercier le public et proposer un échange individuel.` },
    ],
  };

  const codir = {
    id: 'codir13', short: 'codir', folder: '01_CODIR', file: 'SISSE_KABA_CODIR_SOLEVO_13_diapos',
    name: 'Présentation CODIR SOLEVO (13 diapos)', menu: 'CODIR SOLEVO', aud: 'Direction générale et directions FEED, SEED, finance',
    foot: 'Confidentiel • Comité de direction SOLEVO Côte d’Ivoire • Projections de scénario, ni bénéfice net ni gain garanti',
    slides: [
      { type: 'cover', pres: COVER.pres, presSub: COVER.presSub, theme: 'codir', tag: 'CODIR • Document confidentiel', title: 'SISSÊ~KABA 2027–2029', sub: 'Programme intégré FEED & SEED : objectifs, économie et décisions attendues',
        aud: 'Direction générale et directions FEED, SEED, finance', band: 'Confidentiel',
        figs: [{ v: '{{ca27}} M', l: 'CA du programme 2027 (≈ {{ca27E}})' }, { v: '{{mb27}} M', l: 'marge brute 2027 (≈ {{mb27E}})' }, { v: '{{res27}} M', l: 'résultat avant financement et impôt (≈ {{res27E}})' }],
        notes: `OBJECTIF : ouvrir la séance et annoncer les décisions attendues.
SCÉNARIO PRÉSENTÉ : {{scenario}}.
MESSAGES CLÉS : SISSÊ~KABA est un programme commun FEED et SEED. En 2027 il représente {{ca27}} M (≈ {{ca27E}}) FCFA (≈ {{ca27E}}) de CA SOLEVO, {{mb27}} M (≈ {{mb27E}}) de marge brute et {{res27}} M (≈ {{res27E}}) de résultat avant financement et impôt.
POINT DE VIGILANCE : projections de scénario, ni bénéfice net ni gain garanti.
TRANSITION : « Voici la synthèse en une page. »` },
      { type: 'content', title: 'Synthèse exécutive', sub: '{{scenario}}',
        blocks: [{ k: 'kpis', items: [{ v: '{{ca27}} M', l: 'CA du programme 2027 (≈ {{ca27E}})' }, { v: '{{mb27}} M', l: 'marge brute 2027 (≈ {{mb27E}})' }, { v: '{{res27}} M', l: 'résultat avant financement et impôt (≈ {{res27E}})' }] },
          { k: 'kpis', items: [{ v: '{{env27}} M', l: 'enveloppe de démarrage' }, { v: '{{prod27}}', l: 'producteurs à mobiliser' }, { v: '{{eleveursMix27}}', l: 'éleveurs à accompagner' }] }],
        comments: ['FEED {{caFeed27}} M (≈ {{caFeed27E}}) et SEED {{caSeed27}} M (≈ {{caSeed27E}}) de CA ; aucune vente de maïs ni d’aliment fini dans le CA SOLEVO.'],
        notes: `OBJECTIF : donner l’essentiel en une diapositive.
CHIFFRES 2027 : CA {{ca27}} M (≈ {{ca27E}}) (FEED {{caFeed27}} M (≈ {{caFeed27E}}), SEED {{caSeed27}} M (≈ {{caSeed27E}})) ; marge brute {{mb27}} M (≈ {{mb27E}}) (FEED {{mbFeed27}} M (≈ {{mbFeed27E}}), SEED {{mbSeed27}} M (≈ {{mbSeed27E}})) ; résultat avant financement et impôt {{res27}} M (≈ {{res27E}}) ; enveloppe de démarrage {{env27}} M dont BFR normatif {{bfr27}} M.
QUESTION PROBABLE : « Est-ce du CA additionnel ? » Pas entièrement : une partie des clients achète déjà chez SOLEVO ; le gain net sera mesuré en retirant les ventes qui auraient eu lieu sans le programme.
TRANSITION : « D’où partons-nous ? »` },
      { type: 'content', title: 'Enjeux et position de départ', sub: 'Une part de marché à construire',
        blocks: [{ k: 'kpis', items: [{ v: '{{pdmAct}}', l: 'part de marché actuelle du prémix' }, { v: '{{mPremix27}} t', l: 'marché national du prémix' }, { v: '{{pdmPTot29}}', l: 'part totale visée en 2029' }] },
          { k: 'kpis', items: [{ v: '{{depAnnual}} t', l: 'ventes 2026 en année pleine' }, { v: '3 + {{depNew}}', l: 'dépôts actifs et en installation' }, { v: '{{mAliment27}} t', l: 'marché de l’aliment fini' }] }],
        comments: ['Valeurs de marché confirmées le 13/11/2026, évolutives. Ventes : fichier des dépôts au {{depAsOf}}.'],
        notes: `OBJECTIF : situer le programme dans le marché.
MESSAGES CLÉS : SOLEVO détient aujourd’hui {{pdmAct}} du marché national du prémix ({{depAnnual}} t sur {{mPremix27}} t). Le programme et l’ouverture de {{depNew}} dépôts portent la part totale à {{pdmPTot29}} en 2029.
TRANSITION : « Voici comment les volumes s’enchaînent. »` },
      { type: 'content', title: 'Mécanique du programme', sub: 'Du sac de prémix au producteur de maïs',
        blocks: [{ k: 'steps', items: [
          { h: 'Prémix', t: '{{premix27}} t, soit {{sacs27}} sacs de 20 kg en 2027.' },
          { h: 'Aliment', t: '{{aliment27}} t d’aliment fini (incorporation par gamme).' },
          { h: 'Maïs', t: '{{mais27}} t de maïs à {{txMais}} de l’aliment.' },
          { h: 'Surfaces', t: '{{haTerrain27}} ha à {{tHa}} t/ha livrées au programme.' },
          { h: 'Acteurs', t: '{{prod27}} producteurs de {{surf}} ha et {{eleveursMix27}} éleveurs.' }] }],
        comments: ['Chaque maillon se modifie dans le simulateur ; le modèle Excel recalcule toute la chaîne.'],
        notes: `OBJECTIF : montrer la logique de dimensionnement.
CALCULS : sacs = prémix × 1 000 ÷ {{sacKg}} kg ; aliment = sacs × aliment par sac ({{alimSacMoy}} t en moyenne) ; maïs = aliment × {{txMais}} ; hectares = maïs ÷ {{tHa}} t/ha livrées ; producteurs = hectares ÷ {{surf}} ha.
TRANSITION : « Voici les objectifs techniques sur trois ans. »` },
      { type: 'content', title: 'Objectifs techniques 2027–2029', sub: 'Ce que les équipes terrain doivent mobiliser',
        blocks: [{ k: 'table', head: H3, w: [2.6, 1, 1, 1], rows: [y3('Prémix vendu (t)', 'premix'), y3('Aliment fini (t)', 'aliment'), y3('Maïs à livrer (t)', 'mais'), y3('Hectares à mobiliser', 'haTerrain'), y3('Producteurs', 'prod'), y3('Total des éleveurs (chair, pondeuses, porcs)', 'eleveursMix')] }],
        comments: ['Mix des ventes de prémix : {{partChair27}} chair, {{partPonte27}} pondeuse, {{partPorc27}} porcin.'],
        notes: `OBJECTIF : traduire les objectifs commerciaux en objectifs terrain.
CHIFFRES : {{premix27}} t puis {{premix28}} t et {{premix29}} t de prémix ({{txtCroissance}}). Côté élevage : {{chairMix27}} élevages de chair, {{ponteMix27}} de pondeuses et {{porcMix27}} de porcs en 2027.
TRANSITION : « Passons à l’économie du programme. »` },
      { type: 'content', title: 'Chiffre d’affaires et marge du programme', sub: 'En millions de FCFA',
        blocks: [{ k: 'table', head: ['M FCFA', '2027', '2028', '2029'], w: [2.6, 1, 1, 1], rows: [y3('CA FEED', 'caFeed'), y3('CA SEED', 'caSeed'), y3('CA du programme', 'ca'), y3('Marge brute FEED', 'mbFeed'), y3('Marge brute SEED', 'mbSeed'), y3('Total marge brute', 'mb')] }],
        comments: ['FEED : {{margeFeedP}} de marge moyenne {{baseFeed}} ; SEED : {{margeSeed}} sur coût.'],
        notes: `OBJECTIF : présenter le CA et la marge sur trois ans.
CHIFFRES : CA {{ca27}} M (≈ {{ca27E}}) en 2027, {{ca28}} M (≈ {{ca28E}}) en 2028, {{ca29}} M (≈ {{ca29E}}) en 2029. Marge brute {{mb27}} M (≈ {{mb27E}}), {{mb28}} M (≈ {{mb28E}}), {{mb29}} M (≈ {{mb29E}}).
POINT DE VIGILANCE : aucune vente de maïs ni d’aliment fini n’est comptée dans le CA SOLEVO.
TRANSITION : « Détaillons le FEED par gamme. »` },
      { type: 'content', title: 'FEED : prix et marges par gamme', sub: 'Prix du sac de 20 kg et marge {{baseFeed}}',
        blocks: [{ k: 'table', head: ['Gamme', 'Part', 'Prix du sac', 'Marge', 'CA 2027 (M)', 'Marge brute 2027 (M)'], w: [1.6, 0.8, 1, 0.9, 1.1, 1.3], rows: [
          ['Chair', '{{partChair27}}', '{{prixChair}}', '{{mChair}}', '{{caChair27}}\n≈ {{caChair27E}}', '{{mbChair27}}\n≈ {{mbChair27E}}'], ['Pondeuse', '{{partPonte27}}', '{{prixPonte}}', '{{mPonte}}', '{{caPonte27}}\n≈ {{caPonte27E}}', '{{mbPonte27}}\n≈ {{mbPonte27E}}'],
          ['Porcin', '{{partPorc27}}', '{{prixPorc}}', '{{mPorc}}', '{{caPorc27}}\n≈ {{caPorc27E}}', '{{mbPorc27}}\n≈ {{mbPorc27E}}'], ['Total moyenne pondérée', '100 %', '{{prixSac}}', '{{margeFeedP}}', '{{caFeed27}}\n≈ {{caFeed27E}}', '{{mbFeed27}}\n≈ {{mbFeed27E}}']] }],
        comments: ['Hausse des prix : {{hausse28}} en 2028, {{hausse29}} en 2029.', 'Repères 2026 des dépôts : marges réalisées 28,7 % (chair), 30,6 % (pondeuse), 28,9 % (porcin).'],
        notes: `OBJECTIF : faire valider les prix et marges par gamme.
CHIFFRES : prix moyen pondéré {{prixSac}} FCFA le sac, marge moyenne {{margeFeedP}} {{baseFeed}}, soit {{mbFeed27}} M (≈ {{mbFeed27E}}) de marge brute FEED en 2027.
REPÈRES DU FICHIER DES DÉPÔTS (2026) : prix réalisés 29 062 FCFA (chair), 25 080 FCFA (pondeuse), 28 486 FCFA (porcin) le sac.
DÉCISION ATTENDUE : valider les prix et marges retenus, ou demander un nouveau calcul avec les prix réalisés.
TRANSITION : « Et côté SEED ? »` },
      { type: 'content', title: 'SEED : gain réel par intrant', sub: 'Marge brute SOLEVO sur le panier d’intrants',
        blocks: [{ k: 'table', head: ['Intrant', 'Marge sur coût', 'Gain / ha (FCFA)', 'Gain 2027 (M)'], w: [1.6, 1, 1.1, 1.1], rows: [
          ['Semences', '{{mSem}}', '{{mbHaSem}}', '{{mb27Sem}}'], ['NPK', '{{mNpk}}', '{{mbHaNpk}}', '{{mb27Npk}}'], ['Urée', '{{mUree}}', '{{mbHaUree}}', '{{mb27Uree}}'],
          ['Herbicide', '{{mHerb}}', '{{mbHaHerb}}', '{{mb27Herb}}'], ['Insecticide', '{{mIns}}', '{{mbHaIns}}', '{{mb27Ins}}'], ['Total panier', '{{margeSeed}}', '{{mbHa}}', '{{mbSeed27}}\n≈ {{mbSeed27E}}']] }],
        comments: ['Taux par intrant à valider avec la direction SEED.'],
        notes: `OBJECTIF : montrer le gain réel SEED.
CHIFFRES : {{mbHa}} FCFA de marge brute par hectare couvert, soit {{mbSeed27}} M (≈ {{mbSeed27E}}) en 2027 sur {{haPanier27}} ha.
TRANSITION : « Voici le compte de résultat du programme. »` },
      { type: 'content', title: 'Compte de résultat du programme', sub: 'En millions de FCFA, avant financement et impôt',
        blocks: [{ k: 'table', head: ['M FCFA', '2027', '2028', '2029'], w: [2.6, 1, 1, 1], rows: [y3('CA du programme', 'ca'), y3('Marge brute', 'mb'), y3('Charges d’exploitation', 'charges'), y3('dont marketing et communication', 'mkt'), y3('Pertes sur créances', 'pertes'), y3('Résultat avant financement et impôt', 'res')] }],
        comments: ['Ni bénéfice net, ni gain additionnel garanti.'],
        notes: `OBJECTIF : présenter la rentabilité du programme.
CHIFFRES : résultat avant financement et impôt de {{res27}} M (≈ {{res27E}}) en 2027, {{res28}} M (≈ {{res28E}}) en 2028 et {{res29}} M (≈ {{res29E}}) en 2029. Charges 2027 : {{charges27}} M, dont {{mkt27}} M de marketing.
TRANSITION : « Quel financement faut-il prévoir ? »` },
      { type: 'content', title: 'Besoin de financement', sub: 'BFR et enveloppe de démarrage',
        blocks: [{ k: 'kpis', items: [{ v: '{{bfr27}} M', l: 'BFR normatif 2027' }, { v: '{{flux27}} M', l: 'flux avant financement et impôt 2027' }, { v: '{{env27}} M', l: 'enveloppe de démarrage 2027' }] }],
        comments: ['Aucun financement présumé : la source (fonds propres, crédit, partenaire) reste à décider.', 'Enveloppe {{env28}} M en 2028 et {{env29}} M en 2029.'],
        notes: `OBJECTIF : faire voir le besoin de trésorerie.
CHIFFRES : le BFR normatif atteint {{bfr27}} M en 2027 (coefficient saisonnier {{coefSais}}) ; l’enveloppe de démarrage est de {{env27}} M.
DÉCISION ATTENDUE : choisir la source de financement.
TRANSITION : « Rapportons ces volumes au marché. »` },
      { type: 'content', title: 'Part de marché et réseau', sub: 'Programme et ventes actuelles',
        blocks: [{ k: 'table', head: ['Indicateur', '2027', '2028', '2029'], w: [2.6, 1, 1, 1], rows: [y3('Marché national du prémix (t)', 'mPremix'), y3('Part du programme — prémix', 'pdmP'), y3('Ventes totales de prémix SOLEVO (t)', 'premixTot'), y3('Part de marché totale — prémix', 'pdmPTot'), y3('Part de l’aliment fini national', 'pdmATot')] }],
        comments: ['Ventes hors programme projetées avec le réseau de 3 + {{depNew}} dépôts.'],
        notes: `OBJECTIF : montrer la conquête de parts de marché.
CHIFFRES : part totale du prémix {{pdmPTot27}} en 2027 et {{pdmPTot29}} en 2029.
TRANSITION : « Quels sont les risques ? »` },
      { type: 'content', title: 'Risques et sensibilités', sub: 'Ce qui peut faire varier le résultat',
        blocks: [{ k: 'cols', items: [
          { h: 'Marché', l: ['Prix du maïs et du prémix volatils', 'Sensibilité au prix : {{sensPrix}} M', 'Concurrence des prémix importés'] },
          { h: 'Exécution', l: ['Couverture intrants : {{sensCouv}} M', 'Rendement et qualité du maïs', 'Recrutement des ATE, ouverture des dépôts'] },
          { h: 'Finance', l: ['Délais clients : {{sensDelai}} M de BFR', 'Risque crédit : {{sensRisk}} M', 'Contrôles du modèle : {{ctrl27}}'] }] }],
        comments: ['Test de stress disponible dans le simulateur (+5 %/an, rendement 3,5 t/ha, couverture 60 %).'],
        notes: `OBJECTIF : montrer que les risques sont identifiés et chiffrés.
DÉTAIL : chaque sensibilité est l’effet d’une variation raisonnable d’une hypothèse sur le résultat ou le BFR (voir le business plan).
TRANSITION : « Voici les décisions que nous vous demandons. »` },
      { type: 'content', title: 'Décisions attendues du CODIR', sub: 'Pour lancer le programme au SELAB SHOW',
        blocks: [{ k: 'steps', items: [
          { h: 'Mandat', t: 'Confirmer le mandat donné par Christophe KOUAME et Olivier KONAN à Elvis LEHITO (FEED) et Arnaud AGOHI (SEED).' },
          { h: 'Objectifs', t: 'Valider {{premix27}} t de prémix en 2027 et la trajectoire 2028–2029.' },
          { h: 'Prix et marges', t: 'Valider les prix et marges par gamme FEED et par intrant SEED.' },
          { h: 'Budget', t: 'Valider {{mkt27}} M de marketing et l’enveloppe de {{env27}} M.' },
          { h: 'Lancement', t: 'Présenter le programme au SELAB SHOW du 20 au 22 novembre 2026.' }] }],
        comments: ['Présenté par ' + PRES + ' (' + PRES_R + '), ' + MANDAT.replace('Mandatés', 'mandatés') + '.'],
        notes: `OBJECTIF : obtenir les décisions.
CONSEIL : faire valider chaque point un par un et noter les réserves. Proposer un point d’étape après le SELAB pour partager les inscriptions obtenues.
CONCLUSION : remercier le CODIR.` },
    ],
  };

  const it = {
    id: 'it15', short: 'it', folder: '08_IT_SOLEVO', file: 'SISSE_KABA_IT_SOLEVO_15_diapos',
    name: 'Présentation IT SOLEVO (15 diapos)', menu: 'IT SOLEVO', aud: 'Direction des systèmes d’information SOLEVO Côte d’Ivoire',
    foot: 'Document de travail • IT SOLEVO Côte d’Ivoire • Plateforme SISSÊ~KABA',
    slides: [
      { type: 'cover', pres: COVER.pres, presSub: COVER.presSub, theme: 'it', tag: 'IT SOLEVO • Cadrage de la plateforme', title: 'Plateforme SISSÊ~KABA', sub: 'Cadrage fonctionnel et technique pour l’équipe IT SOLEVO Côte d’Ivoire',
        aud: 'Direction des systèmes d’information SOLEVO Côte d’Ivoire', band: 'Document de travail',
        figs: [{ v: '{{users27}}', l: 'utilisateurs terrain en 2027' }, { v: '{{sacs27}}', l: 'sacs de prémix suivis' }, { v: '3 + {{depNew}}', l: 'dépôts connectés' }],
        notes: `OBJECTIF : lancer le cadrage de la plateforme avec l’IT.
MESSAGES CLÉS : la plateforme SISSÊ~KABA doit relier {{prod27}} producteurs et {{eleveursMix27}} éleveurs en 2027, avec les ATE, les dépôts et l’ERP SOLEVO.
TRANSITION : « Pourquoi ce projet digital ? »` },
      { type: 'content', title: 'Objectif du projet digital', sub: 'Un outil unique pour FEED, SEED et le terrain',
        blocks: [{ k: 'cols', items: [
          { h: 'Pourquoi', l: ['Relier {{prod27}} producteurs et {{eleveursMix27}} éleveurs', 'Tracer le maïs du champ à l’aliment', 'Piloter FEED et SEED avec les mêmes données'] },
          { h: 'Pour qui', l: ['Producteurs, éleveurs, fabricants', 'ATE, magasiniers des dépôts, RBM', 'Directions FEED, SEED et finance'] },
          { h: 'Résultat attendu', l: ['Un outil mobile d’abord', 'Des tableaux de bord en temps réel', 'Moins de saisies dans les fichiers Excel'] }] }],
        comments: ['Aujourd’hui, le suivi des dépôts repose sur un classeur Excel partagé.'],
        notes: `OBJECTIF : partager le besoin.
CONSTAT : le suivi des dépôts, des commandes ATE et des ventes repose sur un classeur Excel ; le programme multiplie les acteurs et les flux.
TRANSITION : « Voici le périmètre fonctionnel. »` },
      { type: 'content', title: 'Périmètre fonctionnel', sub: 'Six modules',
        blocks: [{ k: 'kpis', items: [{ v: 'Inscription', l: 'producteurs, éleveurs, parcelles, cheptels' }, { v: 'Contrats', l: 'volumes, qualité et prix du maïs' }, { v: 'Commandes', l: 'prémix et intrants via ATE et dépôts' }] },
          { k: 'kpis', items: [{ v: 'Livraisons', l: 'maïs : pesée, qualité, réception' }, { v: 'Paiements', l: 'encaissements et crédits' }, { v: 'Pilotage', l: 'tableaux de bord et alertes' }] }],
        comments: ['Version pilote : inscription, commandes et pilotage ; contrats et paiements ensuite.'],
        notes: `OBJECTIF : délimiter le périmètre.
PROPOSITION : commencer par l’inscription, les commandes et le pilotage (pilote), puis ajouter les contrats, les livraisons de maïs et les paiements.
TRANSITION : « Qui utilise la plateforme ? »` },
      { type: 'content', title: 'Acteurs et rôles', sub: 'Qui fait quoi dans la plateforme',
        blocks: [{ k: 'table', head: ['Acteur', 'Rôle dans la plateforme', 'Accès'], w: [1.3, 3.2, 1.3], rows: [
          ['Producteur', 'S’inscrit, déclare ses parcelles, suit contrats et paiements', 'Mobile, SMS'], ['Éleveur', 'Commande prémix et maïs, suit ses livraisons', 'Mobile'], ['ATE', 'Inscrit, conseille, saisit commandes et visites', 'Mobile hors ligne'],
          ['Dépôt', 'Stocks, réceptions, DLU, ventes', 'Web'], ['RBM et directions', 'Tableaux de bord, validations', 'Web'], ['IT SOLEVO', 'Administration, sécurité, intégrations', 'Console']] }],
        comments: ['Comptes nominatifs et droits par rôle et par dépôt.'],
        notes: `OBJECTIF : définir les rôles et les accès.
POINT CLÉ : les producteurs ont souvent un téléphone simple ; prévoir un accès par SMS ou WhatsApp et la saisie par l’ATE.
TRANSITION : « Voici le parcours du producteur. »` },
      { type: 'content', title: 'Parcours producteur', sub: 'De l’inscription au paiement',
        blocks: [{ k: 'steps', items: [{ h: 'Inscription', t: 'Par l’ATE ou en autonomie : identité, localité, surface.' }, { h: 'Contrat', t: 'Volume de maïs, qualité, prix de référence.' }, { h: 'Intrants', t: 'Commande du panier SEED et suivi du crédit éventuel.' }, { h: 'Récolte', t: 'Déclaration, contrôle qualité, date de livraison.' }, { h: 'Paiement', t: 'Réception, pesée, paiement et historique.' }] }],
        comments: ['Notifications SMS à chaque étape.'],
        notes: `OBJECTIF : décrire le parcours producteur.
EXIGENCE : écrans très simples, saisie possible par l’ATE pour le compte du producteur.
TRANSITION : « Et celui de l’éleveur. »` },
      { type: 'content', title: 'Parcours éleveur', sub: 'Des besoins à la performance',
        blocks: [{ k: 'steps', items: [{ h: 'Inscription', t: 'Type d’élevage, cheptel, localité, dépôt de rattachement.' }, { h: 'Besoins', t: 'Calcul de l’aliment, du maïs et des sacs de prémix.' }, { h: 'Commande', t: 'Prémix au dépôt, maïs auprès des producteurs sous contrat.' }, { h: 'Livraison', t: 'Suivi des lots, qualité, réclamations.' }, { h: 'Performance', t: 'Consommation, ponte, croissance, conseils ATE.' }] }],
        comments: ['Le calcul des besoins reprend les formules du simulateur.'],
        notes: `OBJECTIF : décrire le parcours éleveur.
POINT CLÉ : le calcul des besoins (aliment, maïs, sacs de prémix) existe déjà dans le simulateur et peut être repris.
TRANSITION : « Quels volumes la plateforme doit-elle supporter ? »` },
      { type: 'content', title: 'Volumétrie à supporter', sub: 'Dimensionnement indicatif du scénario',
        blocks: [{ k: 'table', head: ['Volume annuel', '2027', '2028', '2029'], w: [2.6, 1, 1, 1], rows: [y3('Producteurs actifs', 'prod'), y3('Éleveurs actifs', 'eleveursMix'), y3('Sacs de prémix vendus', 'sacs'), y3('Maïs livré (t)', 'mais'), y3('Hectares suivis', 'haTerrain')] }],
        comments: ['À affiner avec le nombre de commandes et de livraisons par acteur.'],
        notes: `OBJECTIF : donner l’ordre de grandeur.
CHIFFRES : {{users27}} utilisateurs terrain en 2027 (producteurs et éleveurs), {{sacs27}} sacs de prémix et {{mais27}} t de maïs.
TRANSITION : « Voici l’architecture proposée. »` },
      { type: 'content', title: 'Architecture cible proposée', sub: 'Quatre couches',
        blocks: [{ k: 'cols', items: [
          { h: 'Applications', l: ['Application mobile ATE (hors ligne)', 'Portail web dépôts et directions', 'SMS et WhatsApp producteurs'] },
          { h: 'Services et données', l: ['API sécurisée', 'Contrats, commandes, stocks, livraisons', 'Base centrale et journal d’audit'] },
          { h: 'Intégrations', l: ['ERP SOLEVO', 'Mobile money', 'Reprise du fichier des dépôts'] }] }],
        comments: ['Proposition à challenger : développement, solution du marché ou extension de l’existant.'],
        notes: `OBJECTIF : proposer une architecture à discuter.
POINT CLÉ : le choix de la solution revient à l’IT SOLEVO ; l’architecture décrit les besoins, pas un produit.
TRANSITION : « Voici les flux de données entre acteurs, dépôts et ERP. »` },
      { type: 'content', title: 'Flux de données', sub: 'Entre acteurs, dépôts, plateforme et ERP SOLEVO', full: true,
        blocks: [{ k: 'flow' }],
        notes: `OBJECTIF : montrer qui échange quelles données avec la plateforme.
LECTURE : la plateforme est au centre. Producteurs et éleveurs envoient inscriptions, contrats et commandes ; les ATE saisissent sur le terrain, même hors ligne ; les dépôts transmettent stocks et ventes ; l’ERP fournit catalogue, prix et factures ; le mobile money confirme les paiements ; les directions reçoivent les tableaux de bord ; la messagerie envoie alertes et confirmations.
QUESTION À TRANCHER : sens et fréquence de la synchronisation avec l’ERP (temps réel ou quotidien).
TRANSITION : « Quels indicateurs produire ? »` },
      { type: 'content', title: 'Indicateurs à produire', sub: 'Tableaux de bord par public',
        blocks: [{ k: 'kpis', items: [{ v: 'Volumes', l: 'prémix, aliment, maïs, intrants' }, { v: 'Économie', l: 'CA et marge par gamme et par intrant' }, { v: 'Terrain', l: 'inscriptions, visites ATE, nouveaux clients' }] },
          { k: 'kpis', items: [{ v: 'Qualité', l: 'lots conformes, réclamations, DLU' }, { v: 'Marché', l: 'part de marché par zone' }, { v: 'Acteurs', l: 'prix producteur, économies éleveurs' }] }],
        comments: ['Les indicateurs du simulateur servent de référence.'],
        notes: `OBJECTIF : définir les sorties attendues.
POINT CLÉ : reprendre les indicateurs déjà suivis dans le fichier des dépôts (CA, marge, clients, DLU) et ceux du simulateur.
TRANSITION : « Parlons sécurité et conformité. »` },
      { type: 'content', title: 'Sécurité et conformité', sub: 'Données personnelles et données sensibles',
        blocks: [{ k: 'cols', items: [
          { h: 'Données personnelles', l: ['Loi ivoirienne n° 2013-450 (à confirmer)', 'Formalités auprès de l’ARTCI à vérifier', 'Consentement des producteurs et éleveurs'] },
          { h: 'Sécurité', l: ['Comptes nominatifs et rôles', 'Chiffrement et sauvegardes', 'Journal d’audit des modifications'] },
          { h: 'Données sensibles', l: ['Coûts d’achat réservés aux gestionnaires', 'Accès séparés par dépôt', 'Exports contrôlés'] }] }],
        comments: ['Cadre juridique à faire confirmer par le service juridique.'],
        notes: `OBJECTIF : intégrer la conformité dès le départ.
POINT DE VIGILANCE : la référence à la loi n° 2013-450 et à l’ARTCI est à faire confirmer par le service juridique avant tout engagement.
TRANSITION : « Quel budget ? »` },
      { type: 'content', title: 'Budget plateforme et marketing', sub: 'Poste historique recalculé selon le volume',
        blocks: [{ k: 'table', head: ['M FCFA', '2027', '2028', '2029'], w: [2.6, 1, 1, 1], rows: [y3('Frais fixes plateforme', 'histFixe'), y3('Frais variables', 'variables'), y3('Total poste plateforme historique', 'hist'), y3('dont marketing et communication', 'mkt'), y3('dont solde à affecter (IT, support)', 'solde')] }],
        comments: ['Reclassement de {{partMkt}} du poste historique en marketing ; le solde reste à affecter.'],
        notes: `OBJECTIF : situer l’enveloppe disponible.
CHIFFRES : poste historique de {{hist27}} M en 2027, dont {{mkt27}} M de marketing et {{solde27}} M de solde à affecter, notamment au support IT.
TRANSITION : « Voici la feuille de route proposée. »` },
      { type: 'content', title: 'Feuille de route proposée', sub: 'Du SELAB au déploiement national',
        blocks: [{ k: 'steps', items: [{ h: 'Nov. 2026', t: 'SELAB SHOW : simulateur et prise d’inscriptions.' }, { h: 'Déc. 2026 – janv. 2027', t: 'Cahier des charges, choix de la solution, devis.' }, { h: 'T1 2027', t: 'Pilote sur les dépôts actifs avec les ATE.' }, { h: 'T2 – T3 2027', t: 'Déploiement aux {{depTotal}} dépôts, paiements mobiles, ERP.' }, { h: '2028 – 2029', t: 'Extension nationale et analyses avancées.' }] }],
        comments: ['Calendrier proposé, à valider avec l’IT SOLEVO.'],
        notes: `OBJECTIF : proposer un calendrier réaliste.
POINT CLÉ : le pilote au T1 2027 s’appuie sur les 3 dépôts actifs ; le déploiement suit l’ouverture des {{depNew}} nouveaux dépôts.
TRANSITION : « Quelles exigences techniques ? »` },
      { type: 'content', title: 'Exigences non fonctionnelles', sub: 'Adaptées au terrain ivoirien',
        blocks: [{ k: 'kpis', items: [{ v: 'Hors ligne', l: 'saisie sans réseau, synchronisation' }, { v: 'Faible débit', l: 'écrans légers, photos compressées' }, { v: 'Simplicité', l: 'parcours courts, assistance ATE' }] },
          { k: 'kpis', items: [{ v: 'Disponibilité', l: 'pendant les campagnes et la récolte' }, { v: 'Évolutivité', l: '{{users27}} utilisateurs en 2027, plus ensuite' }, { v: 'Traçabilité', l: 'historique par lot et par acteur' }] }],
        comments: ['Exigences à intégrer au cahier des charges.'],
        notes: `OBJECTIF : fixer les exigences techniques.
POINT CLÉ : le hors ligne est indispensable pour les ATE en zone rurale.
TRANSITION : « Pour finir, les décisions à prendre. »` },
      { type: 'content', title: 'Décisions et prochaines étapes', sub: 'Pour démarrer le cadrage',
        blocks: [{ k: 'steps', items: [{ h: 'Référent IT', t: 'Désigner le référent IT SOLEVO du projet.' }, { h: 'Cadrage', t: 'Valider le périmètre de la version pilote.' }, { h: 'Solution', t: 'Comparer développement, solution du marché et existant.' }, { h: 'Budget', t: 'Affecter le solde de {{solde27}} M FCFA (2027).' }, { h: 'Calendrier', t: 'Fixer la date du pilote au T1 2027.' }] }],
        comments: [PRES + ' • ' + PRES_R + ' • elvis.lehito@solevogroup.com • arnaud.agohi@solevogroup.com'],
        notes: `OBJECTIF : obtenir les premières décisions IT.
CONCLUSION : proposer un atelier de cadrage avec l’IT dans les deux semaines suivant le SELAB.` },
    ],
  };


  const eleveur = {
    id: 'stand_eleveur', short: 'eleveur', folder: '02_Lancement_SELAB', file: 'SISSE_KABA_Stand_Visiteur_Eleveur_5_diapos',
    name: 'Stand SOLEVO : visiteur éleveur (5 diapos)', menu: 'Visiteur ÉLEVEUR', aud: 'Éleveurs de poulets de chair, de pondeuses et de porcs',
    foot: 'Stand SOLEVO Côte d’Ivoire • SELAB SHOW, 20–22 novembre 2026 • Parc des sports d’Abidjan',
    slides: [
      { type: 'cover', slogan: 'Dépensez moins, gagnez plus', sloganSub: 'Prémix et intrants SOLEVO : −30 à 40 % sur vos coûts de production', pres: 'Elvis LEHITO', presSub: 'Key Account Manager FEED • SOLEVO Côte d’Ivoire\nAvec Ibrahim OUATTARA et Kouassi François KOUADIO', theme: 'eleveur', tag: 'Stand SOLEVO • Espace éleveurs', title: 'Votre maïs, sécurisé', sub: 'Un maïs moins cher et régulier, un prémix adapté et un technicien à vos côtés',
        aud: 'Éleveurs de chair, de pondeuses et de porcs', band: 'SELAB SHOW • 20–22 novembre 2026 • Stand SOLEVO',
        figs: [{ v: '−15 %', l: 'sur le prix du maïs' }, { v: '{{econAnChair}} M', l: 'FCFA économisés par an (élevage de {{placesFerme}} poulets)' }, { v: '3 + {{depNew}}', l: 'dépôts de prémix près de chez vous' }],
        notes: `OBJECTIF : accrocher l’éleveur en moins de 30 secondes.
QUESTION D’OUVERTURE : « Quel élevage avez-vous, et combien d’animaux ? » Adapter ensuite les chiffres de la diapo 3.
MESSAGE CLÉ : SISSÊ~KABA vous relie à des producteurs de maïs sous contrat, avec le prémix SOLEVO et l’appui d’un technicien.
TRANSITION : « Voici ce que vous y gagnez. »` },
      { type: 'content', title: 'Ce que vous y gagnez', sub: 'Pour votre élevage, dès la première campagne',
        blocks: [{ k: 'kpis', items: [{ v: '{{P}} → {{prixAchAp}}', l: 'FCFA/kg de maïs (−15 %)' }, { v: 'Régularité', l: 'maïs sous contrat, moins de ruptures' }, { v: 'Qualité', l: 'maïs contrôlé, conseils de formulation' }] }],
        comments: ['Économies attendues, à confirmer avec les prix réels de la campagne (prix illustratif {{P}} FCFA/kg).'],
        notes: `OBJECTIF : montrer le bénéfice concret.
CHIFFRES : le maïs représente environ {{txMais}} de l’aliment. En l’achetant à {{prixAchAp}} FCFA/kg au lieu de {{P}}, l’éleveur réduit fortement son coût d’aliment.
POINT DE VIGILANCE : ce sont des économies attendues, pas garanties.
TRANSITION : « Regardons votre élevage en chiffres. »` },
      { type: 'content', calc: 'eleveur', title: 'Votre élevage en chiffres', sub: 'Besoins annuels d’un élevage type et économies attendues sur le maïs',
        blocks: [{ k: 'table', head: ['Élevage type', 'Aliment / an', 'Sacs de prémix / an', 'Maïs / an', 'Économies / an'], w: [2.2, 1, 1.3, 1, 1.2], rows: [
          ['{{placesFerme}} poulets de chair ({{cycles}} cycles)', '{{alimAnChair}} t', '{{sacsAnChair}}', '{{maisAnChair}} t', '{{econAnChair}} M'],
          ['{{pondFerme}} pondeuses', '{{alimAnPonte}} t', '{{sacsAnPonte}}', '{{maisAnPonte}} t', '{{econAnPonte}} M'],
          ['{{porcsFerme}} porcs par an', '{{alimAnPorc}} t', '{{sacsAnPorc}}', '{{maisAnPorc}} t', '{{econAnPorc}} M']] }],
        comments: ['Prémix SOLEVO à {{inclChair}} (chair), {{inclPonte}} (pondeuse) et {{inclPorc}} (porc) ; économies en M FCFA.', 'Votre technicien refait le calcul avec votre cheptel réel.'],
        notes: `OBJECTIF : parler la langue de l’éleveur : son cheptel, ses sacs, son maïs.
EXEMPLE : un élevage de {{placesFerme}} poulets de chair consomme {{alimAnChair}} t d’aliment par an ({{kgPoulet}} kg par poulet, {{cycles}} cycles), soit {{sacsAnChair}} sacs de prémix et {{maisAnChair}} t de maïs ; l’économie attendue sur le maïs est de {{econAnChair}} M FCFA par an.
CONSEIL : demander le cheptel du visiteur et refaire le calcul dans le simulateur (onglet Intrants).
TRANSITION : « Comment ça se passe pour vous ? »` },
      { type: 'content', title: 'Comment ça marche pour vous', sub: 'Quatre étapes simples',
        blocks: [{ k: 'steps', items: [
          { h: 'Inscription', t: 'Aujourd’hui sur le stand ou auprès d’un technicien SOLEVO.' },
          { h: 'Vos besoins', t: 'Le technicien calcule votre aliment, votre maïs et vos sacs de prémix.' },
          { h: 'Commande', t: 'Prémix au dépôt le plus proche, maïs auprès des producteurs sous contrat.' },
          { h: 'Suivi', t: 'Livraisons contrôlées et conseils pour améliorer vos résultats.' }] }],
        comments: ['Dépôts actifs : Abidjan, Yamoussoukro, Agnibilékrou ; {{depNew}} autres en installation.'],
        notes: `OBJECTIF : rendre l’adhésion simple.
MESSAGE CLÉ : l’inscription est gratuite ; le technicien vient ensuite calculer les besoins réels et organiser les premières commandes.
TRANSITION : « Inscrivez-vous maintenant. »` },
      { type: 'content', temo: 'Elev', title: 'Ils l’ont fait : témoignage d’un éleveur', sub: '{{temoElevProfil}} • {{temoElevLieu}}',
        blocks: [{ k: 'quote', who: 'Elev', q: '{{temoElevCitation}}', n: '{{temoElevNom}}', p: '{{temoElevProfil}} • {{temoElevLieu}}', v: '{{temoElevChiffre}}', l: '{{temoElevChiffreL}}' }],
        comments: ['Témoignage recueilli avec l’accord de l’éleveur, le {{temoElevDate}}.'],
        notes: `OBJECTIF : rassurer par l’exemple d’un pair.
CONSEIL : laisser le visiteur lire la citation, puis préciser le contexte (élevage, cheptel, durée dans le programme). Si le témoin est présent sur le stand, le présenter.
TRANSITION : « Vous aussi, inscrivez-vous. »` },
      { type: 'content', title: 'Inscrivez-vous maintenant', sub: 'Un technicien SOLEVO vous rappelle après le salon', full: true,
        blocks: [{ k: 'qr', h: 'Scannez pour vous inscrire', t: 'Le QR code ouvre la fiche d’inscription dans votre navigateur, sans application. Remplissez-la, puis envoyez-la : votre table vous est indiquée en retour.', lines: [{ v: '+225 07 77 19 09 94', l: 'Inscription par WhatsApp' }, { v: '07 10 47 14 02', l: 'Elvis LEHITO, Key Account Manager FEED' }, { v: 'elvis.lehito@solevogroup.com', l: 'E-mail' }], sign: 'Elvis LEHITO • Key Account Manager FEED • techniciens élevage : Ibrahim OUATTARA, Kouassi François KOUADIO' }],
        notes: `OBJECTIF : obtenir l’inscription sur place.
À NOTER : nom, téléphone, localité, type d’élevage, cheptel, dépôt le plus proche.
CONCLUSION : remettre la plaquette, remercier, proposer une visite du technicien.` },
    ],
  };

  const producteur = {
    id: 'stand_producteur', short: 'producteur', folder: '02_Lancement_SELAB', file: 'SISSE_KABA_Stand_Visiteur_Producteur_5_diapos',
    name: 'Stand SOLEVO : visiteur producteur (5 diapos)', menu: 'Visiteur PRODUCTEUR', aud: 'Producteurs de maïs et coopératives',
    foot: 'Stand SOLEVO Côte d’Ivoire • SELAB SHOW, 20–22 novembre 2026 • Parc des sports d’Abidjan',
    slides: [
      { type: 'cover', pres: 'Arnaud AGOHI', presSub: 'Key Account Manager SEED • SOLEVO Côte d’Ivoire\nAvec Aubin Ghislain KOFFI', theme: 'producteur', tag: 'Stand SOLEVO • Espace producteurs', title: 'Votre maïs mieux vendu', sub: 'Un acheteur sûr avant la récolte, de meilleurs intrants et un meilleur prix',
        aud: 'Producteurs de maïs et coopératives', band: 'SELAB SHOW • 20–22 novembre 2026 • Stand SOLEVO',
        figs: [{ v: '+30 %', l: 'sur le prix bord champ' }, { v: '{{gainHa}}', l: 'FCFA de recettes en plus par hectare' }, { v: '{{panier}}', l: 'FCFA : panier d’intrants par hectare' }],
        notes: `OBJECTIF : accrocher le producteur en moins de 30 secondes.
QUESTION D’OUVERTURE : « Combien d’hectares de maïs cultivez-vous, et à qui vendez-vous votre récolte ? »
MESSAGE CLÉ : SISSÊ~KABA vous trouve des éleveurs acheteurs avant la récolte, avec un prix de référence et l’appui de SOLEVO.
TRANSITION : « Voici ce que vous y gagnez. »` },
      { type: 'content', title: 'Ce que vous y gagnez', sub: 'Un débouché sûr et un meilleur prix',
        blocks: [{ k: 'kpis', items: [{ v: '{{prixProdAv}} → {{prixProdAp}}', l: 'FCFA/kg payés au producteur (+30 %)' }, { v: 'Débouché', l: 'des éleveurs acheteurs sous contrat' }, { v: 'Appui', l: 'intrants de qualité et conseil technique' }] }],
        comments: ['Gains attendus si les conditions du programme sont réunies (prix illustratif P = {{P}} FCFA/kg).'],
        notes: `OBJECTIF : montrer le bénéfice concret.
CHIFFRES : le prix bord champ visé passe de {{prixProdAv}} à {{prixProdAp}} FCFA/kg grâce au contrat et à la qualité.
POINT DE VIGILANCE : gains attendus, pas garantis ; ils dépendent du rendement, de la qualité et du respect du contrat.
TRANSITION : « Regardons un hectare. »` },
      { type: 'content', calc: 'producteur', title: 'Votre hectare en chiffres', sub: 'Recettes attendues par hectare livré au programme ({{tHa}} t/ha)',
        blocks: [{ k: 'kpis', items: [{ v: '{{recHaAv}}', l: 'FCFA par ha aujourd’hui ({{prixProdAv}} FCFA/kg)' }, { v: '{{recHaAp}}', l: 'FCFA par ha avec SISSÊ~KABA ({{prixProdAp}} FCFA/kg)' }, { v: '+{{gainHa}}', l: 'FCFA en plus par hectare' }] },
          { k: 'kpis', items: [{ v: '{{panier}}', l: 'FCFA : panier d’intrants par ha' }, { v: '{{rdt}} t/ha', l: 'rendement visé avec le panier' }, { v: '{{gainHa5}} M', l: 'FCFA en plus pour {{surf}} ha' }] }],
        comments: ['Panier : semences, NPK, urée, herbicide et insecticide ; doses à valider par l’agronome.'],
        notes: `OBJECTIF : parler la langue du producteur : son hectare.
CALCUL : {{tHa}} t livrées par hectare × {{prixProdAp}} FCFA/kg = {{recHaAp}} FCFA, contre {{recHaAv}} FCFA aujourd’hui, soit {{gainHa}} FCFA de plus par hectare ; pour {{surf}} ha, {{gainHa5}} M FCFA de plus par an.
INTRANTS : le panier complet coûte {{panier}} FCFA par hectare et vise {{rdt}} t/ha.
CONSEIL : demander la surface du visiteur et refaire le calcul.
TRANSITION : « Comment ça se passe pour vous ? »` },
      { type: 'content', title: 'Comment ça marche pour vous', sub: 'Cinq étapes, du contrat au paiement',
        blocks: [{ k: 'steps', items: [
          { h: 'Inscription', t: 'Aujourd’hui sur le stand ou auprès d’un technicien SOLEVO.' },
          { h: 'Contrat', t: 'Volume, qualité et prix de référence fixés avant la campagne.' },
          { h: 'Intrants', t: 'Panier SEED et conseil technique pendant la culture.' },
          { h: 'Récolte', t: 'Contrôle qualité et date de livraison planifiée.' },
          { h: 'Paiement', t: 'Pesée à la livraison et paiement suivi.' }] }],
        comments: ['Producteurs individuels et coopératives bienvenus.'],
        notes: `OBJECTIF : rendre l’adhésion simple et rassurante.
QUESTION PROBABLE : « Qui fixe le prix ? » Un prix de référence convenu avant la campagne entre producteurs et éleveurs, avec l’appui du programme.
TRANSITION : « Inscrivez-vous maintenant. »` },
      { type: 'content', temo: 'Prod', title: 'Ils l’ont fait : témoignage d’un producteur', sub: '{{temoProdProfil}} • {{temoProdLieu}}',
        blocks: [{ k: 'quote', who: 'Prod', q: '{{temoProdCitation}}', n: '{{temoProdNom}}', p: '{{temoProdProfil}} • {{temoProdLieu}}', v: '{{temoProdChiffre}}', l: '{{temoProdChiffreL}}' }],
        comments: ['Témoignage recueilli avec l’accord du producteur, le {{temoProdDate}}.'],
        notes: `OBJECTIF : rassurer par l’exemple d’un pair.
CONSEIL : laisser le visiteur lire la citation, puis préciser le contexte (surface, rendement, durée dans le programme). Si le témoin est présent sur le stand, le présenter.
TRANSITION : « Vous aussi, inscrivez-vous. »` },
      { type: 'content', title: 'Inscrivez-vous maintenant', sub: 'Un technicien SOLEVO vous rappelle après le salon', full: true,
        blocks: [{ k: 'qr', h: 'Scannez pour vous inscrire', t: 'Le QR code ouvre la fiche d’inscription dans votre navigateur, sans application. Remplissez-la, puis envoyez-la : votre table vous est indiquée en retour.', lines: [{ v: '+225 07 77 19 09 94', l: 'Inscription par WhatsApp' }, { v: '07 87 87 73 54', l: 'Arnaud AGOHI, Key Account Manager SEED' }, { v: 'arnaud.agohi@solevogroup.com', l: 'E-mail' }], sign: 'Arnaud AGOHI • Key Account Manager SEED • technicien semence : Aubin Ghislain KOFFI' }],
        notes: `OBJECTIF : obtenir l’inscription sur place.
À NOTER : nom, téléphone, localité, surface en maïs, coopérative éventuelle.
CONCLUSION : remercier et proposer une visite du technicien avant la prochaine campagne.` },
    ],
  };

  const short = [selab, codir, it, eleveur, producteur];
  root.SKD = root.SKD || { decks: [] };
  root.SKD.short = short;
  root.SKD.PRES = PRES; root.SKD.PRES_R = PRES_R; root.SKD.MANDAT = MANDAT; root.SKD.TEAM = TEAM;
  for (const d of short) if (!root.SKD.decks.find((x) => x.id === d.id)) root.SKD.decks.push(d);
})(typeof window !== 'undefined' ? window : globalThis);
(function (root) {
  'use strict';
  /* Lien par défaut du QR code d’inscription : fiche en ligne (GitHub Pages), ouverte dans n’importe quel navigateur. */
  const msg = 'INSCRIPTION SISSÊ~KABA – Stand SOLEVO\nNom : \nTéléphone : \nLocalité : \nProfil (éleveur / producteur / les deux) : \nÉlevage et cheptel (ex. 5000 chair) : \nSurface en maïs (ha) : \nE-mail : ';
  root.SKD.QR_WA_OLD = 'https://wa.me/2250777190994?text=' + encodeURIComponent(msg);
  root.SKD.QR_DEFAULT = 'https://lehito1989.github.io/sisse-kaba-inscription-Public/';
  /* Schéma des flux de données (plateforme au centre) */
  root.SKD.FLOW = {
    center: 'Plateforme SISSÊ~KABA',
    nodes: [
      { id: 'prod', r: 0, c: 0, h: 'Producteurs', s: 'mobile, SMS, WhatsApp', e: 'Inscriptions, parcelles, contrats, récoltes' },
      { id: 'msg', r: 0, c: 1, h: 'Messagerie', s: 'SMS / WhatsApp', e: 'Alertes, confirmations, rappels' },
      { id: 'elev', r: 0, c: 2, h: 'Éleveurs', s: 'mobile', e: 'Besoins, commandes de prémix et de maïs' },
      { id: 'ate', r: 1, c: 0, h: 'ATE', s: 'application hors ligne', e: 'Visites, inscriptions, commandes terrain' },
      { id: 'dep', r: 1, c: 2, h: 'Dépôts (3 + {{depNew}})', s: 'portail web', e: 'Stocks, réceptions, DLU, ventes' },
      { id: 'mm', r: 2, c: 0, h: 'Mobile money', s: 'opérateurs de paiement', e: 'Paiements producteurs, encaissements' },
      { id: 'erp', r: 2, c: 1, h: 'ERP SOLEVO', s: 'référentiel et facturation', e: 'Catalogue, prix, coûts, factures, clients' },
      { id: 'dir', r: 2, c: 2, h: 'Directions et RBM', s: 'tableaux de bord', e: 'Indicateurs, validations, alertes' },
    ],
  };
})(typeof window !== 'undefined' ? window : globalThis);
