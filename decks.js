/* SISSÊ~KABA — contenu des trois présentations (format SOLEVO) et commentaires orateur.
   Les jetons {{cle}} sont remplacés par les valeurs du scénario courant. */
(function (root) {
  'use strict';
  const SRC = 'Source : modèle Excel SISSÊ~KABA, {{scenario}}, version du {{date}}.';

  const codir = {
    id: 'codir',
    folder: '01_CODIR',
    file: 'SISSE_KABA_Presentation_CODIR_2027_2029',
    name: 'Présentation CODIR 2027–2029',
    slides: [
      { type: 'title', title: 'Présentation au CODIR', sub: 'SISSÊ~KABA — FEED & SEED', date: '{{dateGarde}}',
        notes: `OBJECTIF DE LA SLIDE : ouvrir la séance et situer la décision attendue.
MESSAGES CLÉS : SISSÊ~KABA est un projet national porté conjointement par les segments FEED (prémix et accompagnement nutritionnel) et SEED (semences, engrais, phytosanitaires) de SOLEVO Côte d’Ivoire. La plateforme est fournie par l’équipe IT de SOLEVO-CI. Le lancement public est prévu au SELAB SHOW, du 20 au 22 novembre 2026, au Parc des sports d’Abidjan.
SCÉNARIO PRÉSENTÉ : {{scenario}}. Objectif 2027 : {{premix27}} t de prémix, puis {{premix28}} t en 2028 et {{premix29}} t en 2029.
POINT DE VIGILANCE : tous les chiffres sont issus du modèle Excel joint ; ce sont des hypothèses de travail soumises à validation, pas des engagements.
TRANSITION : « Voici le déroulé de la séance et les points sur lesquels nous attendons votre décision. »` },
      { type: 'agenda', title: 'Agenda', items: ['Décisions attendues (5 min)', 'Le projet et son fonctionnement (10 min)', 'Objectifs et dimensionnement (10 min)', 'Économie, budget IT et marketing (15 min)', 'Trésorerie et risques (10 min)', 'Lancement SELAB et gouvernance (10 min)', 'Validation et prochaines étapes (5 min)'],
        notes: `OBJECTIF : annoncer la structure de la présentation (environ 65 minutes).
CONSEIL D’ANIMATION : rappeler que les questions de chiffres sont traitées dans les parties 4 et 5 ; noter les questions hors sujet dans un « parking » pour la partie 7.
TRANSITION : « Commençons par ce que nous vous demandons de décider aujourd’hui. »` },
      { type: 'section', title: 'Décisions attendues',
        notes: `Séparateur de partie. Annoncer que quatre décisions sont proposées et qu’elles conditionnent le lancement au SELAB dans quelques jours.` },
      { type: 'content', title: 'Les décisions proposées au CODIR', sub: 'Autoriser un lancement commercial encadré',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Périmètre national', t: 'Confirmer le pilotage commun FEED et SEED et le déploiement progressif par corridors.' },
          { n: '02', h: 'Objectif 2027', t: 'Valider {{premix27}} t de prémix, soit {{mais27}} t de maïs à mobiliser.' },
          { n: '03', h: 'Budget et trésorerie', t: 'Arbitrer {{mkt27_1}} M de marketing, {{solde27_1}} M de solde et une enveloppe indicative de {{env27_1}} M.' },
          { n: '04', h: 'Lancement au SELAB', t: 'Autoriser les messages et le dispositif du 20 au 22 novembre 2026.' }] }],
        comments: ['Décisions de principe : aucun contrat partenaire, financement ou signature n’est présumé acquis.', 'Scénario présenté : {{scenario}}.'],
        notes: `OBJECTIF : poser d’emblée les quatre décisions attendues pour que la suite serve à les éclairer.
DÉTAIL :
• 01 Périmètre : un seul dispositif national, piloté conjointement par FEED et SEED, déployé corridor par corridor selon les résultats.
• 02 Objectif 2027 : {{premix27}} t de prémix, ce qui représente {{sacs27}} sacs de 20 kg, {{aliment27}} t d’aliment fini et {{mais27}} t de maïs. Les cibles {{premix28}} t (2028) et {{premix29}} t (2029) découlent d’une {{txtCroissance}}.
• 03 Budget : les frais historiques de plateforme sont recalculés selon le volume ({{hist27}} M en 2027) puis réaffectés : {{partMkt}} au marketing et à la communication ({{mkt27}} M), {{partSolde}} en solde budgété à affecter ({{solde27}} M). L’enveloppe indicative de ressources au démarrage est de {{env27}} M.
• 04 SELAB : valider les messages publics et l’équipe présente.
QUESTIONS PROBABLES : « Est-ce un engagement de volume ? » Non : ce sont des objectifs de travail, la contractualisation se fait campagne par campagne.
TRANSITION : « Revenons d’abord sur le problème terrain que le projet adresse. »` },
      { type: 'section', title: 'Le projet et son fonctionnement',
        notes: `Séparateur. Annoncer : le besoin terrain, puis la contribution de chaque segment et le parcours d’une transaction.` },
      { type: 'content', title: 'Le besoin terrain', sub: 'Le projet rapproche les débouchés et les disponibilités',
        blocks: [{ k: 'cards', items: [
          { h: 'Côté production', t: 'Producteurs et coopératives cherchent des acheteurs, des intrants adaptés et de la visibilité sur les débouchés.' },
          { h: 'Côté consommation', t: 'Éleveurs et fabricants d’aliments cherchent des lots conformes, livrables au bon moment et à un coût rendu maîtrisé.' }] }],
        comments: ['Le constat porte sur l’accès commercial au maïs. Aucun déficit national structurel n’est présumé.', 'Production nationale 2024 : environ 1,7 million de tonnes (FIRCA ; Bilan gouvernemental 2011–2025).'],
        notes: `OBJECTIF : faire partager le diagnostic qui justifie le projet.
MESSAGES CLÉS : le problème n’est pas un manque de maïs à l’échelle nationale (environ 1,7 Mt produites en 2024 selon le FIRCA et le bilan gouvernemental), mais un décalage commercial : des producteurs qui peinent à vendre au bon prix et des acheteurs qui peinent à sécuriser des lots réguliers et conformes.
ORDRE DE GRANDEUR : les {{mais27}} t visées en 2027 représentent environ {{partNat27}} de la production nationale 2024 ; {{mais29}} t en 2029 représentent environ {{partNat29}}. Cela ne prouve pas que ces lots soient accessibles : il faudra le démontrer par la préqualification (60 % des besoins, soit {{preQual}} t, au T1 2027).
QUESTIONS PROBABLES : « Pourquoi SOLEVO ? » Parce que FEED connaît les éleveurs et leurs besoins d’aliment, et SEED connaît les producteurs et leurs surfaces : le projet relie deux portefeuilles existants.
TRANSITION : « Voyons comment chaque segment contribue. »` },
      { type: 'content', title: 'La contribution de FEED et SEED', sub: 'Une seule chaîne commerciale suivie par les deux segments',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Production', t: 'SEED : producteurs et coopératives déclarent surfaces et lots ; vente de semences et intrants.' },
          { n: '02', h: 'Demande', t: 'FEED : éleveurs et fabricants expriment volumes et spécifications ; vente de prémix.' },
          { n: '03', h: 'Coordination', t: 'SOLEVO facilite la mise en relation et le suivi via la plateforme IT SOLEVO-CI.' },
          { n: '04', h: 'Paiement et livraison', t: 'L’éleveur paie via le circuit ADVANS ; producteur, transport et entrepôt sont réglés ensuite.' }] }],
        comments: ['Aucun portage de stock, financement de récolte ni commission sur le maïs n’est présumé pour SOLEVO.', 'Le CA SOLEVO = prémix FEED + intrants SEED uniquement.'],
        notes: `OBJECTIF : clarifier le modèle économique et ce que SOLEVO vend réellement.
MESSAGES CLÉS :
• FEED vend le prémix (sac de 20 kg : {{prixChair}} FCFA en chair, {{prixPonte}} FCFA en pondeuse, {{prixPorc}} FCFA en porcin, {{prixSac}} FCFA en moyenne) et l’accompagnement technique ; il apporte la demande en maïs via les éleveurs.
• SEED vend le panier d’intrants ({{panier}} FCFA/ha simulés) et apporte l’offre de maïs via les producteurs.
• La plateforme, fournie par l’IT SOLEVO-CI, sert à enregistrer les acteurs, les lots, les besoins et à tracer les accords.
• Le maïs se négocie directement entre producteur et acheteur : SOLEVO ne l’achète pas, ne le stocke pas et ne prend pas de commission dans ce scénario.
POURQUOI C’EST IMPORTANT : cela limite le BFR et le risque de SOLEVO, mais cela signifie aussi que le CA du maïs et de l’aliment fini ne doit jamais être additionné au CA SOLEVO.
TRANSITION : « Passons aux objectifs chiffrés. »` },
      { type: 'section', title: 'Objectifs et dimensionnement',
        notes: `Séparateur. Annoncer la chaîne de conversion prémix → aliment → maïs → hectares → producteurs.` },
      { type: 'content', title: 'Les conversions de l’objectif 2027', sub: 'Paramètres fournis par le porteur du projet',
        blocks: [{ k: 'kpis', items: [
          { v: '{{premix27}} t', l: 'Prémix — {{sacs27}} sacs de {{sacKg}} kg' },
          { v: '{{aliment27}} t', l: 'Aliment fini — {{alimSac}} t par sac' },
          { v: '{{mais27}} t', l: 'Maïs — {{txMais}} d’incorporation' }] }],
        comments: ['1 t de prémix = 50 sacs = 50 t d’aliment fini = {{maisParT}} t de maïs.', 'Prix moyen du sac : {{prixSac}} FCFA, soit {{caFeed27}} M FCFA (≈ {{caFeed27E}}) de CA FEED en 2027.'],
        notes: `OBJECTIF : montrer le moteur du modèle, en une ligne.
CALCUL : {{premix27}} t × 1 000 ÷ {{sacKg}} kg = {{sacs27}} sacs. Chaque sac permet de fabriquer {{alimSac}} t d’aliment fini, soit {{aliment27}} t. Le maïs représente {{txMais}} de la formule, soit {{mais27}} t de maïs à mobiliser.
À RETENIR : 1 tonne de prémix « tire » {{maisParT}} tonnes de maïs. Toute variation de l’objectif prémix se répercute proportionnellement sur le maïs, les hectares et les producteurs.
POINT DE VIGILANCE : le taux de {{txMais}} est une moyenne de dimensionnement ; il varie selon les espèces et les formules. Le contrat éleveurs le rappelle.
TRANSITION : « Ces tonnes de maïs doivent ensuite être produites : voici le dimensionnement terrain. »` },
      { type: 'content', title: 'Le dimensionnement prudent', sub: 'Hypothèses de planification à valider par SEED',
        blocks: [{ k: 'table', head: ['Paramètre 2027', 'Valeur'], w: [3, 2], rows: [
          ['Rendement brut et fraction utilisable', '{{rdt}} t/ha et {{util}}'],
          ['Récolte affectée au programme', '{{aff}}'],
          ['Tonnes de maïs fournies par hectare mobilisé', '{{tHa}} t'],
          ['Surface minimum et producteurs de {{surf}} ha', '{{haTerrain27}} ha et {{prod27}} producteurs'],
          ['Hectares achetant le panier intrants ({{couv}})', '{{haPanier27}} ha'],
          ['Élevages chair équivalents', '{{chair27}} fermes de {{placesFerme}} places']] }],
        comments: ['Scénario chair : {{kgPoulet}} kg d’aliment par poulet, {{cycles}} cycles par an. Alternative ponte : {{ponte27}} fermes de {{pondFerme}} têtes.', 'Les scénarios chair et ponte sont des alternatives : ne pas les additionner.'],
        notes: `OBJECTIF : montrer que le dimensionnement intègre des marges de prudence.
LECTURE : un hectare ne fournit pas {{rdt}} t au programme mais {{tHa}} t ({{rdt}} × {{util}} utilisable × {{aff}} affecté). D’où {{ha27}} ha calculés, arrondis à {{haTerrain27}} ha minimum sur le terrain, soit {{prod27}} producteurs équivalents de {{surf}} ha (arrondi au supérieur). Le ratio simpliste {{mais27}} ÷ {{rdt}} donnerait seulement {{haSimple}} ha.
INTRANTS : seuls {{couv}} des surfaces sont supposées acheter le panier complet SOLEVO, soit {{haPanier27}} ha.
ÉLEVAGES : {{aliment27}} t d’aliment correspondent à {{chair27}} fermes chair de {{placesFerme}} places ({{kgPoulet}} kg/poulet/cycle, {{cycles}} cycles/an) OU à {{ponte27}} fermes de {{pondFerme}} pondeuses ({{pondJour}} g/jour). Ce sont des équivalents de dimensionnement, pas des clients identifiés, et les deux scénarios ne s’additionnent pas.
QUESTION PROBABLE : « Pourquoi 90 % affectés ? » Le producteur garde une part pour l’autoconsommation ou d’autres acheteurs ; c’est une hypothèse de contractualisation à valider.
TRANSITION : « Voici la trajectoire sur trois ans. »` },
      { type: 'content', title: 'Les objectifs sur trois ans', sub: 'Les cibles 2028–2029 constituent une proposition conditionnelle',
        blocks: [
          { k: 'table', head: ['Objectif', '2027', '2028', '2029'], w: [3, 1.3, 1.3, 1.3], rows: [
            ['Prémix en tonnes', '{{premix27}}', '{{premix28}}', '{{premix29}}'],
            ['Croissance annuelle', '—', '{{croiss28}}', '{{croiss29}}'],
            ['Maïs en tonnes', '{{mais27}}', '{{mais28}}', '{{mais29}}'],
            ['Surface minimum (ha)', '{{haTerrain27}}', '{{haTerrain28}}', '{{haTerrain29}}'],
            ['Producteurs de {{surf}} ha', '{{prod27}}', '{{prod28}}', '{{prod29}}'],
            ['Élevages chair équivalents', '{{chair27}}', '{{chair28}}', '{{chair29}}']] },
          { k: 'chart', type: 'col', title: 'Prémix vendu (t)', cats: ['2027', '2028', '2029'], series: [{ name: 'Prémix (t)', vals: ['{{premix27n}}', '{{premix28n}}', '{{premix29n}}'] }] }],
        comments: ['Une campagne annuelle par hypothèse. Les surfaces du modèle conservent les décimales avant arrondi terrain.', 'Passage à l’année suivante sous conditions : qualité, recouvrement, BFR financé.'],
        notes: `OBJECTIF : présenter la trajectoire et son caractère conditionnel.
LECTURE : {{txtCroissance}}. Le prémix passe de {{premix27}} t à {{premix29}} t ; le maïs à mobiliser de {{mais27}} t à {{mais29}} t ; les producteurs équivalents de {{prod27}} à {{prod29}}.
MÉTHODE : dans le modèle Excel, l’objectif 2027 se saisit en Hypotheses!B5 ; les taux de croissance 2028 et 2029 en Hypotheses!C52 et D52. Tout le reste se recalcule.
CONDITIONS DE PASSAGE : l’objectif de l’année suivante n’est engagé qu’après bilan de campagne : qualité acceptée, encaissements, BFR autorisé et capacités logistiques confirmées.
QUESTION PROBABLE : « La croissance est-elle prudente ? » Elle doit être confirmée par la direction commerciale à partir du portefeuille réel FEED.
TRANSITION : « Que représentent ces volumes pour les ventes de SOLEVO ? »` },
      { type: 'content', title: 'Les objectifs techniques SEED et FEED', sub: 'Ce qu’il faut mobiliser sur le terrain chaque année',
        blocks: [{ k: 'table', head: ['Objectif technique', '2027', '2028', '2029'], w: [3.2, 1.1, 1.1, 1.1], rows: [
          ['SEED — hectares à mobiliser (minimum terrain)', '{{haTerrain27}}', '{{haTerrain28}}', '{{haTerrain29}}'],
          ['SEED — maïs à livrer au programme (t)', '{{mais27}}', '{{mais28}}', '{{mais29}}'],
          ['SEED — production brute sur ces surfaces (t)', '{{prodBrute27}}', '{{prodBrute28}}', '{{prodBrute29}}'],
          ['SEED — producteurs de {{surf}} ha', '{{prod27}}', '{{prod28}}', '{{prod29}}'],
          ['FEED — aliment fini produit (t)', '{{aliment27}}', '{{aliment28}}', '{{aliment29}}'],
          ['FEED — cheptel chair à nourrir ({{partChair27}} des sacs)', '{{placesMix27}}', '{{placesMix28}}', '{{placesMix29}}'],
          ['FEED — éleveurs de chair ({{placesFerme}} places)', '{{chairMix27}}', '{{chairMix28}}', '{{chairMix29}}'],
          ['FEED — pondeuses à nourrir ({{partPonte27}} des sacs)', '{{pondMix27}}', '{{pondMix28}}', '{{pondMix29}}'],
          ['FEED — éleveurs de pondeuses ({{pondFerme}} têtes)', '{{ponteMix27}}', '{{ponteMix28}}', '{{ponteMix29}}'],
          ['FEED — éleveurs de porcs ({{partPorc27}} des sacs, {{porcsFerme}} porcs/an)', '{{porcMix27}}', '{{porcMix28}}', '{{porcMix29}}'],
          ['Total des éleveurs (chair, pondeuses, porcs)', '{{eleveursMix27}}', '{{eleveursMix28}}', '{{eleveursMix29}}']] }],
        comments: ['Mix des ventes de prémix : {{partChair27}} chair, {{partPonte27}} pondeuse, {{partPorc27}} porcin ; incorporation {{inclChair}} / {{inclPonte}} / {{inclPorc}} ; les éleveurs s’additionnent.', 'Cheptel fixe par élevage : {{placesFerme}} places de chair et {{pondFerme}} pondeuses (modifiable dans le simulateur).'],
        notes: `OBJECTIF : traduire les objectifs commerciaux en objectifs techniques que les équipes terrain peuvent suivre.
SEED : pour livrer {{mais27}} t de maïs en 2027, il faut au moins {{haTerrain27}} ha, soit {{prod27}} producteurs de {{surf}} ha. Ces surfaces produisent environ {{prodBrute27}} t de maïs brut ({{rdt}} t/ha), dont une partie reste chez le producteur (pertes, autoconsommation, autres ventes).
FEED : les sacs de prémix sont répartis selon le mix des ventes : {{partChair27}} en chair ({{alimChair27}} t d’aliment à {{inclChair}} d’incorporation, soit {{placesMix27}} places et {{chairMix27}} élevages de {{placesFerme}} places), {{partPonte27}} en pondeuse ({{alimPonte27}} t à {{inclPonte}}, soit {{pondMix27}} pondeuses et {{ponteMix27}} élevages de {{pondFerme}} têtes) et {{partPorc27}} en porcin ({{alimPorc27}} t à {{inclPorc}}, soit {{porcs27}} porcs et {{porcMix27}} élevages de {{porcsFerme}} porcs par an). Total : {{eleveursMix27}} éleveurs à mobiliser en 2027, pour {{aliment27}} t d’aliment.
REPÈRES : si tout l’aliment allait à la chair, il faudrait {{chair27}} élevages ; tout à la ponte, {{ponte27}} élevages. Ces deux repères ne s’additionnent pas ; seul le portefeuille mixte s’additionne.
LECTURE TERRAIN : ces nombres sont des cibles de prospection ; la réalité mêlera des élevages de tailles variées et quelques fabricants industriels.
QUESTION PROBABLE : « Pourquoi ce mix {{partChair27}} / {{partPonte27}} / {{partPorc27}} ? » C’est une hypothèse de répartition des ventes (les ventes 2026 des dépôts donnent 48,6 % chair, 45,0 % pondeuse, 6,4 % porcin) ; elle se modifie dans le simulateur.
TRANSITION : « Rapportons ces volumes au marché national. »` },
      { type: 'content', title: 'La part de marché visée par SOLEVO en Côte d’Ivoire', sub: 'Marché national 2027 : {{mPremix27}} t de prémix et {{mAliment27}} t d’aliment fini (valeurs confirmées, évolutives)',
        blocks: [
          { k: 'table', head: ['Part de marché', '2027', '2028', '2029'], w: [2.6, 1.1, 1.1, 1.1], rows: [
            ['Prémix SOLEVO du programme (t)', '{{premix27}}', '{{premix28}}', '{{premix29}}'],
            ['Marché national du prémix (t)', '{{mPremix27}}', '{{mPremix28}}', '{{mPremix29}}'],
            ['Part de marché prémix', '{{pdmP27}}', '{{pdmP28}}', '{{pdmP29}}'],
            ['Aliment fini associé (t)', '{{aliment27}}', '{{aliment28}}', '{{aliment29}}'],
            ['Marché national de l’aliment fini (t)', '{{mAliment27}}', '{{mAliment28}}', '{{mAliment29}}'],
            ['Part de marché aliment fini', '{{pdmA27}}', '{{pdmA28}}', '{{pdmA29}}'],
            ['Ventes actuelles de prémix hors programme (t)', '{{ventesExist27}}', '{{ventesExist28}}', '{{ventesExist29}}'],
            ['Part de marché totale SOLEVO — prémix', '{{pdmPTot27}}', '{{pdmPTot28}}', '{{pdmPTot29}}']] },
          { k: 'chart', type: 'col', title: 'Parts de marché prémix (%)', cats: ['2027', '2028', '2029'], series: [
            { name: 'Programme', vals: ['{{pdmP27n}}', '{{pdmP28n}}', '{{pdmP29n}}'] },
            { name: 'Total SOLEVO', vals: ['{{pdmPTot27n}}', '{{pdmPTot28n}}', '{{pdmPTot29n}}'] }] }],
        comments: ['Part totale = (prémix du programme + ventes actuelles hors programme) ÷ marché national{{ventesExistNote}}.', 'Marché : valeurs confirmées par le porteur le 13/11/2026, évolutives et à actualiser à chaque revue ({{mktGrowth}}).'],
        notes: `OBJECTIF : situer l’ambition du programme dans le marché ivoirien.
CALCUL : part prémix = {{premix27}} t ÷ {{mPremix27}} t = {{pdmP27}} en 2027 ({{pdmP29}} en 2029). Part aliment fini = {{aliment27}} t ÷ {{mAliment27}} t = {{pdmA27}} en 2027 ({{pdmA29}} en 2029).
LECTURE : la part d’aliment est plus élevée que la part de prémix car 1 t de prémix fabrique 50 t d’aliment ; le rapport aliment/prémix du marché national ({{mAliment27}} ÷ {{mPremix27}}) n’est pas forcément de 50.
PART TOTALE : en ajoutant les ventes actuelles de prémix hors programme ({{ventesExist27}} t en 2027), SOLEVO vendrait {{premixTot27}} t, soit {{pdmPTot27}} du marché du prémix et {{pdmATot27}} du marché de l’aliment fini associé.
PRÉCAUTIONS : les ventes actuelles sont une saisie du porteur (onglet Hypotheses ligne 58) ; si elles ne sont pas renseignées, la part totale égale la part du programme. Les valeurs de marché ({{mPremix27}} t et {{mAliment27}} t en 2027, {{mktGrowth}}) sont valeurs confirmées par le porteur le 13/11/2026, évolutives et à actualiser à chaque revue ; elles sont modifiables dans le simulateur et dans l’onglet Hypotheses (lignes 56 et 57).
TRANSITION : « Voyons ce que ces volumes représentent pour les ventes de SOLEVO. »` },
      { type: 'content', title: 'Notre part de marché actuelle et le réseau de dépôts', sub: 'Ventes FEED réelles 2026 au {{depAsOf}} : 3 points de vente actifs, 4 en installation',
        blocks: [
          { k: 'kpis', items: [
            { v: '{{depAnnual}} t', l: 'Prémix vendus en 2026 (annualisé ; {{depYtd}} t au {{depAsOf}})' },
            { v: '{{pdmAct}}', l: 'Part du marché du prémix ({{mPremix27}} t)' },
            { v: '{{pdmAlimAct}}', l: 'Part de l’aliment fini couvert ({{mAliment27}} t)' }] },
          { k: 'table', head: ['Point de vente', 'Prémix 2026 (t)', 'Annualisé (t/an)', 'Part'], w: [2.6, 1.2, 1.2, 0.8], rows: [
            ['{{depNom0}}', '{{depT0}}', '{{depAn0}}', '{{depPart0}}'], ['{{depNom1}}', '{{depT1}}', '{{depAn1}}', '{{depPart1}}'],
            ['{{depNom2}} (depuis le 13/07)', '{{depT2}}', '{{depAn2}}', '{{depPart2}}'],
            ['San-Pédro, Gagnoa, Man, Korhogo', 'En installation', '—', '—']] }],
        comments: ['Fourchette de part prémix : {{pdmActYtd}} (cumul brut) à {{pdmRun}} (rythme août-octobre, {{depRun}} t/an).', 'Avec la décentralisation : ventes hors programme projetées à {{ventesExist27}} t en 2027 et {{ventesExist29}} t en 2029.'],
        notes: `OBJECTIF : établir le point de départ réel de SOLEVO avant le programme.
SOURCE : fichier de gestion des dépôts FEED (journal des ventes 2026, du 07/01 au {{depAsOf}}). Périmètre : prémix stricts (volaille ponte, chair, porcin et ruminant 1 %), hors DCP, méthionine, minéraux et Piglet booster ({{depAutres}} t).
CHIFFRES : {{depYtd}} t de prémix vendus en un peu plus de 10 mois, soit {{depAnnual}} t sur une année pleine ; la part du marché du prémix est de {{pdmAct}} (fourchette {{pdmActYtd}} à {{pdmRun}} selon la méthode). Yamoussoukro porte {{depPart0}} des volumes, Abidjan {{depPart1}}, Agnibilekro {{depPart2}} (ouvert en juillet).
LECTURE IMPORTANTE : la part de l’aliment fini couvert ({{pdmAlimAct}}) est bien plus élevée que la part du prémix, car le marché de 35 000 t de prémix correspond à une inclusion moyenne de {{inclMarche}} ({{ratioMarche}} t d’aliment par t de prémix) alors que les prémix SOLEVO s’incorporent à 2 %. Le marché du prémix inclut donc des produits plus fortement dosés (concentrés, CMV) : présenter les deux parts côte à côte. Les valeurs de marché sont valeurs confirmées par le porteur le 13/11/2026, évolutives et à actualiser à chaque revue.
DÉCENTRALISATION : les 4 dépôts en installation (San-Pédro, Gagnoa, Man, Korhogo) élargissent la couverture. Hypothèse prudente : chaque nouveau dépôt atteint le niveau d’Agnibilekro (54 t/an), à 50 % la première année. Le simulateur propose aussi les références « moyenne » (171 t) et « Yamoussoukro » (369 t).
TRANSITION : « Voyons ce que le programme représente pour nos ventes. »` },
      { type: 'section', title: 'Économie, budget IT et marketing',
        notes: `Séparateur. Annoncer : ventes et marges, frais de plateforme réaffectés, plan marketing, résultat avant financement et impôt.` },
      { type: 'content', title: 'L’économie des ventes SOLEVO', sub: 'Millions FCFA, hors taxes par convention du modèle',
        blocks: [
          { k: 'table', head: ['Indicateur', '2027', '2028', '2029'], w: [2.4, 1.2, 1.2, 1.2], rows: [
            ['CA FEED', '{{caFeed27}}\n≈ {{caFeed27E}}', '{{caFeed28}}\n≈ {{caFeed28E}}', '{{caFeed29}}\n≈ {{caFeed29E}}'],
            ['CA SEED', '{{caSeed27}}\n≈ {{caSeed27E}}', '{{caSeed28}}\n≈ {{caSeed28E}}', '{{caSeed29}}\n≈ {{caSeed29E}}'],
            ['CA du programme', '{{ca27}}\n≈ {{ca27E}}', '{{ca28}}\n≈ {{ca28E}}', '{{ca29}}\n≈ {{ca29E}}'],
            ['Marge brute', '{{mb27}}\n≈ {{mb27E}}', '{{mb28}}\n≈ {{mb28E}}', '{{mb29}}\n≈ {{mb29E}}']] },
          { k: 'chart', type: 'stack', title: 'CA du programme (M FCFA)', cats: ['2027', '2028', '2029'], series: [
            { name: 'CA FEED', vals: ['{{caFeed27n}}', '{{caFeed28n}}', '{{caFeed29n}}'] },
            { name: 'CA SEED', vals: ['{{caSeed27n}}', '{{caSeed28n}}', '{{caSeed29n}}'] }] }],
        comments: ['FEED : chair {{mChair}}, pondeuse {{mPonte}}, porcin {{mPorc}} {{baseFeed}}, soit {{margeFeedP}} en moyenne (= {{margeFeedCA}} du CA). SEED : marge moyenne pondérée {{margeSeed}} sur coût (= {{margeSeedCA}} du CA), taux propre à chaque intrant.', 'Aucun CA de maïs ni d’aliment fini n’est ajouté au CA SOLEVO.'],
        notes: `OBJECTIF : présenter ce que SOLEVO vend réellement dans le programme.
CALCULS 2027 :
• CA FEED = {{sacs27}} sacs × {{prixSac}} FCFA (prix moyen pondéré) = {{caFeed27}} M (≈ {{caFeed27E}}).
  – Prémix chair : {{sacsChair27}} sacs × {{prixChair}} FCFA = {{caChair27}} M (≈ {{caChair27E}}) ; marge {{mChair}} {{baseFeed}} = {{mbChair27}} M (≈ {{mbChair27E}}).
  – Prémix pondeuse : {{sacsPonte27}} sacs × {{prixPonte}} FCFA = {{caPonte27}} M (≈ {{caPonte27E}}) ; marge {{mPonte}} {{baseFeed}} = {{mbPonte27}} M (≈ {{mbPonte27E}}).
  – Prémix porcin : {{sacsPorc27}} sacs × {{prixPorc}} FCFA = {{caPorc27}} M (≈ {{caPorc27E}}) ; marge {{mPorc}} {{baseFeed}} = {{mbPorc27}} M (≈ {{mbPorc27E}}).
  – Prix 2028 et 2029 : hausse de {{hausse28}} puis {{hausse29}} sur les trois gammes.
• CA SEED = {{haPanier27}} ha × {{panier}} FCFA/ha = {{caSeed27}} M (≈ {{caSeed27E}}).
• CA du programme = {{ca27}} M (≈ {{ca27E}}) ; marge brute = {{mb27}} M (≈ {{mb27E}}) (FEED {{mbFeed27}} M (≈ {{mbFeed27E}}) + SEED {{mbSeed27}} M (≈ {{mbSeed27E}})).
POINT CLÉ SUR LES MARGES : {{txtBaseFeed}}
POINT DE VIGILANCE : ce CA est celui du programme, pas un CA additionnel. Une partie des clients FEED et SEED achète déjà chez SOLEVO ; pour mesurer le gain réel, il faudra soustraire les ventes qui auraient été faites sans projet.
QUESTION PROBABLE : « Pourquoi ne pas compter le maïs ? » Parce que SOLEVO n’achète ni ne revend le maïs : ces flux appartiennent aux producteurs et aux acheteurs.
TRANSITION : « Côté charges, la principale ligne est le poste historique de plateforme. »` },
      { type: 'content', title: 'Les frais historiques deviennent un budget commercial', sub: 'La plateforme est fournie par l’équipe IT de SOLEVO-CI',
        blocks: [{ k: 'table', head: ['Affectation (M FCFA)', '2027', '2028', '2029'], w: [3, 1.2, 1.2, 1.2], rows: [
          ['Frais historiques fixes', '{{histFixe27}}', '{{histFixe28}}', '{{histFixe29}}'],
          ['Frais historiques variables (FCFA/t × t maïs)', '{{variables27}}', '{{variables28}}', '{{variables29}}'],
          ['Enveloppe recalculée selon le volume', '{{hist27}}', '{{hist28}}', '{{hist29}}'],
          ['Dont marketing et communication ({{partMkt}})', '{{mkt27}}', '{{mkt28}}', '{{mkt29}}'],
          ['Solde budgété à affecter ({{partSolde}})', '{{solde27}}', '{{solde28}}', '{{solde29}}']] }],
        comments: ['Reclassement sans double compte : aucune deuxième enveloppe de développement externe n’est ajoutée.', 'Coûts IT internes éventuels et affectation du solde : à confirmer avec l’IT et la finance.'],
        notes: `OBJECTIF : expliquer la réaffectation budgétaire demandée.
MÉCANISME : le fichier opérationnel prévoyait un poste « plateforme » composé d’un fixe ({{histFixe27}} M en 2027) et d’un variable de {{histVarU27}} FCFA par tonne de maïs. Recalculé sur {{mais27}} t, il atteint {{hist27}} M en 2027. Comme la plateforme est fournie en interne par l’IT SOLEVO-CI, ce poste est réaffecté : {{partMkt}} au marketing et à la communication ({{mkt27}} M) et {{partSolde}} conservés en solde budgété ({{solde27}} M) dont l’affectation reste à valider.
2028–2029 : les fixes passent à {{histFixe28}} M puis {{histFixe29}} M et le variable unitaire progresse de 2 % par an ({{histVarU28}} puis {{histVarU29}} FCFA/t) ; le marketing atteint {{mkt28}} M puis {{mkt29}} M. Il croît donc plus vite que le volume, en raison de ces deux hypothèses : à confirmer.
CE QUE NOUS DEMANDONS : valider le principe du reclassement et le taux de {{partMkt}} ; nommer qui arbitre l’usage du solde.
TRANSITION : « Voici comment nous proposons d’utiliser le budget marketing 2027. »` },
      { type: 'content', title: 'Le plan marketing et communication 2027', sub: 'Répartition proposée de {{mkt27_1}} M FCFA',
        blocks: [{ k: 'table', head: ['Action', 'M FCFA'], w: [3.5, 1.2], rows: [
          ['Démonstrations et journées terrain', '{{mktA1}}'],
          ['Rencontres acheteurs et mobilisation', '{{mktA2}}'],
          ['Communication ciblée par zone', '{{mktA3}}'],
          ['Supports imprimés et contenus', '{{mktA4}}'],
          ['Coopératives et formation plateforme', '{{mktA5}}'],
          ['Mesure et ajustements', '{{mktA6}}'],
          ['Total', '{{mkt27_1}}']] }],
        comments: ['Dépenses débloquées par campagne, sur devis validés.', 'KPIs : contacts qualifiés, commandes payées, réachat, coût d’acquisition, marge après coût commercial.'],
        notes: `OBJECTIF : montrer que le budget marketing est piloté par la performance.
RÉPARTITION : la clé initiale (15/10/8/6/6/4 sur 49) est appliquée au budget du scénario, soit {{mkt27_1}} M en 2027. Le terrain (démonstrations, rencontres acheteurs) concentre environ la moitié du budget, car la conversion se joue au contact des producteurs et des éleveurs.
PILOTAGE : chaque campagne est débloquée sur devis ; on mesure le coût par contact qualifié, le taux de conversion en commande payée et le réachat. Une action qui ne convertit pas est arrêtée et son budget réaffecté.
POINT DE VIGILANCE : les fonctions terrain, qualité et logistique devront être rapprochées du solde de {{solde27_1}} M et des ressources existantes avant validation.
TRANSITION : « Toutes charges intégrées, voici le résultat du programme. »` },
      { type: 'content', title: 'Le résultat avant financement et impôt', sub: 'L’impôt, les intérêts et la TVA restent à chiffrer',
        blocks: [
          { k: 'table', head: ['M FCFA', '2027', '2028', '2029'], w: [2.6, 1.1, 1.1, 1.1], rows: [
            ['Marge brute', '{{mb27}}\n≈ {{mb27E}}', '{{mb28}}\n≈ {{mb28E}}', '{{mb29}}\n≈ {{mb29E}}'],
            ['Charges exploitation', '{{charges27}}', '{{charges28}}', '{{charges29}}'],
            ['Risque clients et amortissements', '{{risqAmort27}}', '{{risqAmort28}}', '{{risqAmort29}}'],
            ['Résultat avant financement et impôt', '{{res27}}\n≈ {{res27E}}', '{{res28}}\n≈ {{res28E}}', '{{res29}}\n≈ {{res29E}}']] },
          { k: 'chart', type: 'col', title: 'Marge brute et résultat (M FCFA)', cats: ['2027', '2028', '2029'], series: [
            { name: 'Marge brute', vals: ['{{mb27n}}', '{{mb28n}}', '{{mb29n}}'] },
            { name: 'Résultat', vals: ['{{res27n}}', '{{res28n}}', '{{res29n}}'] }] }],
        comments: ['Résultat du programme : ni bénéfice net, ni gain additionnel garanti.', 'Seuil 2027 : {{seuil27}} t de prémix. Part de marge réellement additionnelle requise : {{fracAdd27}}.'],
        notes: `OBJECTIF : présenter le résultat avec ses limites.
CALCUL 2027 : marge brute {{mb27}} M (≈ {{mb27E}}) − charges d’exploitation {{charges27}} M − risque clients {{pertes27}} M ({{pertesPct}} du CA) − amortissements {{amort27}} M = {{res27}} M (≈ {{res27E}}).
SEUIL : avec la structure de coûts 2027, le programme couvre ses coûts fixes à partir d’environ {{seuil27}} t de prémix (si les intrants suivent proportionnellement).
GAIN RÉEL POUR SOLEVO : il faut qu’environ {{fracAdd27}} de la marge brute 2027 soit réellement additionnelle (nouveaux clients ou volumes supplémentaires) pour couvrir les charges du programme. C’est l’indicateur à suivre en priorité.
LIMITES : ni impôt, ni frais financiers, ni effets de TVA, ni dépenses de lancement 2026. Ne pas présenter ce résultat comme un bénéfice net.
CUMUL : {{sumRes}} M sur trois ans, qui ne correspondent pas à de la trésorerie disponible (voir slide suivante).
TRANSITION : « Le résultat ne dit rien de la trésorerie : c’est le BFR qui conditionne le lancement. »` },
      { type: 'section', title: 'Trésorerie et risques',
        notes: `Séparateur. Annoncer : BFR, enveloppe indicative de ressources, tests de sensibilité.` },
      { type: 'content', title: 'La trésorerie conditionne le lancement', sub: 'Soldes normatifs, pas un pic mensuel calculé',
        blocks: [
          { k: 'kpis', items: [
            { v: '{{bfr27_1}} M', l: 'BFR normatif 2027' },
            { v: '{{env27_1}} M', l: 'Enveloppe indicative de lancement' },
            { v: '{{flux27s}}', l: 'Flux 2027 avant financement et impôt' }] },
          { k: 'table', head: ['BFR 2027 (M FCFA)', 'Montant'], w: [3, 1.2], rows: [
            ['Créances FEED ({{jCliF}} j) + SEED ({{jCliS}} j)', '{{crF27}} + {{crS27}}'],
            ['Stocks FEED ({{jStF}} j) + SEED ({{jStS}} j)', '{{stF27}} + {{stS27}}'],
            ['Dettes fournisseurs ({{jFour}} j)', '−{{four27}}']] }],
        comments: ['Enveloppe = {{coefSais}} × BFR + {{capex27_0}} M de matériels + {{coussinH}} M de coussin. Budget mensuel à établir.', 'Les capacités 2028–2029 ne sont pas des besoins nouveaux à additionner.'],
        notes: `OBJECTIF : distinguer résultat, BFR et trésorerie.
LECTURE : le BFR normatif 2027 atteint {{bfr27}} M : créances FEED {{crF27}} M et SEED {{crS27}} M, stocks FEED {{stF27}} M et SEED {{stS27}} M, moins les dettes fournisseurs {{four27}} M. {{txtFlux}}
ENVELOPPE : {{coefSais}} × {{bfr27}} M (saisonnalité) + {{capex27}} M de matériels + {{coussinH}} M de coussin = {{env27}} M. C’est une enveloppe de prudence, pas une demande de prêt calculée au mois.
2028–2029 : les capacités cibles ({{env28}} M et {{env29}} M) sont des capacités brutes et ne s’additionnent pas ; le besoin supplémentaire réel dépend des flux encaissés.
À FAIRE : budget mensuel d’encaissements et décaissements, intégration des taxes, intérêts, crédit fournisseurs négocié et dépenses de lancement 2026.
TRANSITION : « Quels paramètres peuvent faire basculer la décision ? »` },
      { type: 'content', title: 'Les risques qui changent la décision', sub: 'Tests isolés sur 2027',
        blocks: [{ k: 'table', head: ['Variation isolée', 'Incidence indicative'], w: [2.6, 2.4], rows: [
          ['Prix FEED −5 %, achats inchangés', 'Résultat −{{sensPrix}} M FCFA'],
          ['Couverture intrants 60 % au lieu de {{couv}}', 'Résultat −{{sensCouv}} M FCFA'],
          ['Rendement brut 3 t/ha au lieu de {{rdt}}', 'Surfaces portées à {{sensRdtHa}} ha'],
          ['Délai clients SEED +30 jours', 'BFR supplémentaire de {{sensDelai}} M FCFA'],
          ['Risque clients 3 % au lieu de {{pertesPct}}', 'Résultat −{{sensRisk}} M FCFA']] }],
        comments: ['Chaque test est indépendant : aucun scénario combiné ni coût financier inclus.', 'Le simulateur permet de tester toute autre combinaison.'],
        notes: `OBJECTIF : montrer la sensibilité du projet aux hypothèses clés.
LECTURE :
• Prix : une baisse de 5 % du prix du prémix sans baisse du coût d’achat retire {{sensPrixCA}} M de CA et {{sensPrix}} M de résultat (après réduction du risque clients).
• Adoption intrants : passer de {{couv}} à 60 % de couverture retire {{sensCouvCA}} M de CA SEED et environ {{sensCouv}} M de résultat.
• Agronomie : à 3 t/ha, il faudrait {{sensRdtHa}} ha au lieu de {{haTerrain27}} ha ; les ventes d’intrants supplémentaires ne sont pas automatiques.
• Recouvrement : 30 jours de délai SEED en plus coûtent {{sensDelai}} M de BFR.
• Risque clients : passer à 3 % retire {{sensRisk}} M de résultat.
MESSAGE : les deux leviers critiques sont le prix de vente FEED et l’adoption du panier SEED ; la trésorerie dépend du recouvrement SEED.
TRANSITION : « Comment allons-nous piloter ces risques ? »` },
      { type: 'section', title: 'Lancement SELAB et gouvernance',
        notes: `Séparateur. Annoncer : gouvernance, préparation du SELAB, mobilisation après salon, tableau de bord.` },
      { type: 'content', title: 'La gouvernance du dispositif', sub: 'Responsabilités proposées',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Direction et finance', t: 'Budget, limites de crédit et arbitrages trimestriels.' },
          { n: '02', h: 'Responsable projet', t: 'Prévisions communes, incidents et suivi hebdomadaire.' },
          { n: '03', h: 'FEED et SEED', t: 'Demandes acheteurs, producteurs, commandes et encaissements.' },
          { n: '04', h: 'IT et qualité', t: 'Accès, traçabilité, protocole de contrôle et support.' }] }],
        comments: ['Rythme : hebdomadaire en campagne, mensuel pour ventes, marges, impayés et BFR, trimestriel pour l’extension.'],
        notes: `OBJECTIF : montrer qui fait quoi.
DÉTAIL : la direction et la finance arbitrent le budget, les limites de crédit et l’extension ; le responsable projet tient une version unique des prévisions et suit les incidents ; FEED et SEED portent la prospection et les ventes ; l’IT SOLEVO-CI assure la plateforme (accès, sécurité, sauvegarde, support) et la qualité définit le protocole de contrôle des lots.
DEMANDE AU CODIR : nommer le sponsor, le responsable projet et un référent par segment (FEED, SEED, IT).
TRANSITION : « Première échéance : le SELAB, dans quelques jours. »` },
      { type: 'content', title: 'La préparation du SELAB SHOW 2026', sub: 'Parc des sports d’Abidjan, du 20 au 22 novembre',
        blocks: [{ k: 'table', head: ['Période', 'Livrable SOLEVO proposé'], w: [1.3, 4], rows: [
          ['13–19 novembre', 'Messages validés, supports, équipe FEED et SEED, formulaire et démonstration.'],
          ['20 novembre', 'Présentation du projet et ouverture des inscriptions.'],
          ['21 novembre', 'Rencontres acheteurs et producteurs, qualification des besoins.'],
          ['22 novembre', 'Synthèse des contacts et rendez-vous de suivi.'],
          ['23–30 novembre', 'Relances, qualification et affectation des responsables.']] }],
        comments: ['Programme SOLEVO proposé. Horaires et créneau de prise de parole à coordonner avec l’organisateur.', 'Dépenses de salon 2026 : budget préalable distinct, hors plan 2027–2029.'],
        notes: `OBJECTIF : sécuriser l’exécution du lancement.
POINTS D’ATTENTION : informations SELAB communiquées par le porteur (20–22 novembre 2026, Parc des sports d’Abidjan, FEED et SEED). Aucun contrat partenaire, financement ou signature n’est présumé. Le formulaire d’inscription doit permettre de qualifier : localité, surfaces et volumes pour les producteurs ; besoins mensuels et qualité pour les acheteurs.
INDICATEURS SALON : contacts uniques par segment, besoins mensuels de maïs déclarés, surfaces déclarées, rendez-vous tenus avant le 30 novembre.
TRANSITION : « Le salon ouvre la mobilisation, il ne la conclut pas. »` },
      { type: 'content', title: 'Le lancement ouvre la mobilisation pour 2027', sub: 'Une annonce publique adaptée au niveau de préparation',
        blocks: [{ k: 'cards', items: [
          { h: 'Au salon', t: 'Présenter le projet et les deux segments. Recueillir besoins et offres. Montrer le parcours prévu.' },
          { h: 'Après le salon', t: 'Qualifier les contacts. Tester les opérations. Contractualiser les volumes réellement disponibles.' }] }],
        comments: ['La mise en production de l’outil dépend de la recette IT : aucun service non disponible n’est annoncé actif.', 'Objectif T1 2027 : préqualifier {{preQual}} t de besoins en maïs (60 %).'],
        notes: `OBJECTIF : caler le niveau de promesse publique.
MESSAGE : au SELAB, on présente et on recueille ; après le salon, on qualifie et on contractualise. On n’annonce pas de prix garanti, de crédit ou de service plateforme non recetté.
OBJECTIF DE CONVERSION : pour atteindre {{prod27}} producteurs et {{chair27}} fermes équivalentes avec un taux de conversion de 50 % (hypothèse d’organisation), il faut qualifier environ {{prospects}} producteurs et {{fermesProsp}} fermes équivalentes. Quelques industriels peuvent remplacer de nombreuses fermes.
TRANSITION : « Pour suivre tout cela, un tableau de bord partagé. »` },
      { type: 'content', title: 'Le tableau de bord de décision', sub: 'Une revue mensuelle partagée',
        blocks: [{ k: 'table', head: ['Indicateur (KPI)', 'Cible 2027', 'Fréquence'], w: [2.8, 1.6, 1.2], rows: [
          ['Prémix facturé et encaissé', '{{premix27}} t', 'Mensuelle'],
          ['Maïs livré et accepté', '{{mais27}} t', 'Hebdo en campagne'],
          ['Hectares contractualisés', '{{haTerrain27}} ha', 'Mensuelle'],
          ['Producteurs qualifiés', '{{prod27}}', 'Mensuelle'],
          ['CA FEED / CA SEED', '{{caFeed27_1}} / {{caSeed27_1}} M', 'Mensuelle'],
          ['Marketing engagé / coût par commande', '{{mkt27_1}} M', 'Par campagne'],
          ['Part de marge réellement additionnelle', '≥ {{fracAdd27}}', 'Trimestrielle']] }],
        comments: ['L’onglet Suivi du modèle opérationnel sert à saisir les réalisations sans écraser les formules.'],
        notes: `OBJECTIF : montrer comment le CODIR suivra le projet.
LECTURE : chaque KPI a une cible issue du modèle et une fréquence. Le réalisé est saisi dans l’onglet « Suivi » du modèle opérationnel, qui calcule le reste à faire et le taux de réalisation.
KPI PRIORITAIRE : la part de marge réellement additionnelle (≥ {{fracAdd27}}) : c’est elle qui prouve que le programme crée de la valeur pour SOLEVO, au-delà du reclassement de ventes existantes.
AUTRES SIGNAUX : taux de rejet des lots, retards de paiement, BFR réel vs normatif.
TRANSITION : « Pour conclure, voici ce que nous vous demandons de valider. »` },
      { type: 'section', title: 'Validation et prochaines étapes',
        notes: `Séparateur. Passer à la demande de validation.` },
      { type: 'content', title: 'La validation attendue du CODIR', sub: 'Les engagements restent soumis aux délégations SOLEVO',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Sponsor et équipe', t: 'Nommer le responsable projet et les référents FEED, SEED et IT.' },
          { n: '02', h: 'Budget', t: 'Valider la base de marge, les {{mkt27_1}} M de marketing et l’affectation des {{solde27_1}} M de solde.' },
          { n: '03', h: 'Financement', t: 'Autoriser les ressources ({{env27_1}} M indicatifs) après budget mensuel et revue du BFR.' },
          { n: '04', h: 'Communication', t: 'Valider le support public et le déroulé du lancement au SELAB.' }] }],
        comments: ['Prochaine revue : fin novembre 2026, bilan des contacts SELAB et budget mensuel 2027.', SRC],
        notes: `OBJECTIF : obtenir une décision explicite sur chacun des quatre points.
FORMULATION PROPOSÉE : « Le CODIR valide le lancement encadré de SISSÊ~KABA au SELAB SHOW 2026, l’objectif de travail de {{premix27}} t de prémix en 2027, le reclassement de {{partMkt}} du poste historique au marketing ({{mkt27}} M) et demande un budget mensuel de trésorerie avant tout engagement au-delà de l’enveloppe indicative de {{env27}} M. »
SI LE CODIR HÉSITE : proposer de valider le lancement SELAB seul et de revenir fin novembre avec le bilan des contacts et le budget mensuel.
APRÈS LA SÉANCE : envoyer le compte rendu, le modèle Excel et la présentation actualisés ; nommer les responsables d’action.` },
      { type: 'section', title: 'Merci — Questions et échanges',
        notes: `Clôture. Rappeler le contact projet : {{contact}}. Ouvrir les questions ; reprendre le « parking » des questions notées pendant la séance.` },
    ],
  };

  const selab = {
    id: 'selab',
    folder: '02_Lancement_SELAB',
    file: 'SISSE_KABA_Presentation_Lancement_SELAB_2026',
    name: 'Présentation de lancement SELAB 2026',
    slides: [
      { type: 'title', title: 'Lancement officiel de SISSÊ~KABA', sub: 'SELAB SHOW 2026 — FEED & SEED', date: '20–22 novembre 2026, Parc des sports d’Abidjan',
        notes: `OBJECTIF : accueillir le public et annoncer le lancement officiel.
DISCOURS D’OUVERTURE (1 min) : « SOLEVO Côte d’Ivoire, avec ses segments FEED et SEED, lance aujourd’hui SISSÊ~KABA, un programme national qui rapproche les producteurs de maïs des éleveurs et des fabricants d’aliments. »
PUBLIC : producteurs, coopératives, éleveurs, fabricants d’aliments, prestataires logistiques, partenaires.
PRUDENCE : présentation publique ; ne pas citer de chiffres financiers internes ni de partenaires non signés.
TRANSITION : « Voici le programme de cette présentation. »` },
      { type: 'agenda', title: 'Agenda', items: ['Le projet national de SOLEVO-CI', 'Le besoin partagé des acteurs', 'Le fonctionnement de SISSÊ~KABA', 'Nos propositions aux producteurs et aux éleveurs', 'Le partage du prix du maïs', 'Qualité, traçabilité et plateforme', 'Comment participer'],
        notes: `OBJECTIF : donner la structure (environ 20 minutes + questions). Inviter le public à garder ses questions pour la fin et à passer au stand FEED et SEED.` },
      { type: 'section', title: 'Le projet national de SOLEVO-CI', notes: `Séparateur. Présenter les deux segments porteurs.` },
      { type: 'content', title: 'Le projet national de SOLEVO-CI', sub: 'Une coopération entre les segments FEED et SEED',
        blocks: [{ k: 'cards', items: [
          { h: 'FEED', t: 'Nutrition animale et prémix. Accompagnement des éleveurs et des fabricants d’aliments.' },
          { h: 'SEED', t: 'Semences, engrais et produits phytosanitaires. Accompagnement des producteurs de maïs.' }] }],
        comments: ['Une seule équipe projet, deux expertises complémentaires.', 'Plateforme fournie par l’équipe IT de SOLEVO-CI.'],
        notes: `OBJECTIF : présenter les deux segments et leur complémentarité.
MESSAGES : FEED connaît les besoins des éleveurs (aliment, prémix, performances) ; SEED connaît les producteurs (semences, fertilisation, protection des cultures). SISSÊ~KABA relie ces deux mondes autour du maïs, qui représente l’essentiel de l’aliment.
EXEMPLE CONCRET : un éleveur qui fabrique son aliment avec le prémix SOLEVO a besoin de maïs régulier ; un producteur accompagné par SEED a besoin d’un acheteur fiable. SISSÊ~KABA organise leur rencontre.
TRANSITION : « Pourquoi ce besoin est-il partagé ? »` },
      { type: 'content', title: 'Le besoin partagé des acteurs', sub: 'Deux difficultés qui se répondent',
        blocks: [{ k: 'cards', items: [
          { h: 'Producteurs de maïs', t: 'Des récoltes à commercialiser. Des besoins en intrants et en visibilité sur les débouchés.' },
          { h: 'Éleveurs et moulins', t: 'Des approvisionnements réguliers. Des lots identifiés et des conditions de livraison convenues.' }] }],
        comments: ['Le producteur cherche un acheteur ; l’éleveur cherche du maïs conforme au bon moment.'],
        notes: `OBJECTIF : faire se reconnaître chaque public dans le constat.
QUESTION AU PUBLIC (facultatif) : « Qui parmi vous a déjà eu du mal à vendre sa récolte au bon prix ? Qui a déjà manqué de maïs pour son aliment ? »
MESSAGE : ces deux difficultés sont les deux faces d’un même problème d’organisation commerciale, et non d’un manque de maïs à l’échelle du pays.
TRANSITION : « Voici comment SISSÊ~KABA fonctionne. »` },
      { type: 'section', title: 'Le fonctionnement de SISSÊ~KABA', notes: `Séparateur. Présenter le parcours en quatre étapes puis les propositions à chaque acteur.` },
      { type: 'content', title: 'Le fonctionnement de SISSÊ~KABA', sub: 'Un parcours en quatre étapes',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Production', t: 'Les producteurs et coopératives déclarent leurs surfaces et lots.' },
          { n: '02', h: 'Demande', t: 'Les acheteurs expriment leurs volumes et spécifications.' },
          { n: '03', h: 'Coordination', t: 'Tout maïs passe par un entrepôt : pesé, contrôlé, puis proposé aux éleveurs.' },
          { n: '04', h: 'Paiement et livraison', t: 'L’éleveur paie via ADVANS, le producteur est payé, puis le lot est livré.' }] }],
        comments: ['SOLEVO coordonne et vend ses intrants et son prémix ; il n’achète pas le maïs pour le revendre.'],
        notes: `OBJECTIF : rendre le parcours simple et concret.
DÉTAIL : 1) le producteur ou la coopérative s’inscrit et déclare surfaces et lots ; 2) l’éleveur ou le fabricant déclare son besoin mensuel et la qualité attendue ; 3) les équipes SOLEVO rapprochent offres et demandes et suivent les opérations sur la plateforme ; 4) vendeur et acheteur signent leur accord de prix et de livraison.
À DIRE CLAIREMENT : SOLEVO n’achète pas le maïs et ne prend pas de commission sur le maïs ; SOLEVO vend ses produits FEED et SEED et accompagne.
TRANSITION : « Ce que le programme propose à chaque acteur. »` },
      { type: 'content', title: 'La proposition aux producteurs', sub: 'Produire mieux et vendre de façon organisée',
        blocks: [{ k: 'cards', items: [
          { h: 'Un accompagnement agricole', t: 'Semences et intrants adaptés. Suivi des parcelles et préparation de la récolte.' },
          { h: 'Des débouchés documentés', t: 'Acheteurs identifiés. Conditions de vente convenues avant livraison.' }] }],
        comments: ['Les doses, tarifs, crédits et engagements d’achat suivent des accords spécifiques.'],
        notes: `OBJECTIF : convaincre les producteurs de s’inscrire.
ARGUMENTS : un panier d’intrants adapté (semences, NPK, urée, protection des cultures), un suivi technique par les équipes SEED, et surtout des acheteurs identifiés avant la récolte.
PRUDENCE : ne promettre ni rendement, ni prix garanti, ni crédit automatique : ces éléments font l’objet d’accords écrits.
TRANSITION : « Et pour les éleveurs et fabricants ? »` },
      { type: 'content', title: 'La proposition aux éleveurs et fabricants', sub: 'Sécuriser le maïs, optimiser l’aliment',
        blocks: [{ k: 'cards', items: [
          { h: 'Approvisionnement en maïs', t: 'Lots identifiés et besoins planifiés. Qualité et livraison convenues.' },
          { h: 'Offre FEED', t: 'Prémix selon les gammes retenues. Accompagnement technique adapté à l’exploitation.' }] }],
        comments: ['Les performances dépendent des pratiques, des produits et des conditions de l’exploitation.'],
        notes: `OBJECTIF : convaincre les éleveurs et fabricants d’aliments.
ARGUMENTS : planifier ses besoins de maïs avec des lots identifiés, une qualité convenue à l’avance (humidité, impuretés, mycotoxines) et des livraisons programmées ; bénéficier du prémix et de l’appui technique FEED.
TRANSITION : « Le programme vise aussi un meilleur partage de la valeur. »` },
      { type: 'section', title: 'Le partage du prix du maïs', notes: `Séparateur. Présenter le partage du prix en % du prix bord champ P.` },
      { type: 'content', title: 'Le partage du prix du maïs', sub: 'En % du prix bord champ de référence P',
        blocks: [
          { k: 'table', head: ['Poste', 'Avant', 'Avec SISSÊ~KABA'], w: [2.4, 1.1, 1.5], rows: [
            ['Producteur', '100 %', '115 %'], ['Transport', '15 %', '15 %'], ['Entrepôt', '5 %', '5 %'], ['Majoration intermédiaire', '40 %', '0 %'], ['Prix payé par l’éleveur', '160 %', '135 %']] },
          { k: 'chart', type: 'stack', title: 'Pour P = 100', cats: ['Avant', 'Avec SISSÊ~KABA'], series: [
            { name: 'Producteur', vals: ['100', '115'] }, { name: 'Transport', vals: ['15', '15'] }, { name: 'Entrepôt', vals: ['5', '5'] }, { name: 'Majoration intermédiaire', vals: ['40', '0'] }] }],
        comments: ['Référence « avant » à vérifier à qualité, période et lieu de livraison équivalents.'],
        notes: `OBJECTIF : expliquer simplement d’où vient le gain.
LECTURE : avant, pour 100 FCFA reçus par le producteur, l’éleveur payait 160 : transport 15, entrepôt 5 et majoration intermédiaire 40. Avec SISSÊ~KABA, la majoration disparaît : le producteur reçoit 115 et l’éleveur paie 135. Transport et entrepôt restent payés.
TRANSITION : « Concrètement, cela donne les bénéfices suivants. »` },
      { type: 'content', title: 'Ce que chacun y gagne', sub: 'Les 40 % de majoration redistribués',
        blocks: [{ k: 'kpis', items: [
          { v: '+15 %', l: 'pour le producteur : 115 au lieu de 100' },
          { v: '−15,6 %', l: 'pour l’éleveur : 135 au lieu de 160' },
          { v: '0 FCFA', l: 'pour SOLEVO sur le maïs : SOLEVO ne revend pas le maïs' }] }],
        comments: ['Paiement de l’éleveur par le circuit convenu avec ADVANS, avant livraison ; producteur payé après confirmation des fonds.', 'La baisse porte sur le maïs, pas sur tout le coût de l’aliment fini.'],
        notes: `OBJECTIF : énoncer les deux bénéfices.
EXPLICATION : 15 points de P vont en plus au producteur (+15 %) ; 25 points restent à l’éleveur, soit 25 ÷ 160 = 15,6 % de moins sur son maïs.
CONDITIONS : maïs conforme livré en entrepôt, éleveur à jour de son contrat FEED (au moins 80 % des engagements échus), accords signés.
TRANSITION : « Notre objectif de mobilisation pour 2027. »` },
      { type: 'content', title: 'L’objectif de mobilisation pour 2027', sub: 'Scénario de travail soumis à validation',
        blocks: [{ k: 'kpis', items: [
          { v: '{{premix27}} t', l: 'Prémix' },
          { v: '{{aliment27}} t', l: 'Aliment fini associé' },
          { v: '{{mais27}} t', l: 'Maïs à mobiliser' }] }],
        comments: ['Un sac de {{sacKg}} kg pour {{alimSac}} t d’aliment fini, avec {{txMais}} de maïs dans ce scénario.', 'Soit environ {{haTerrain27}} ha et {{prod27}} producteurs équivalents de {{surf}} ha.'],
        notes: `OBJECTIF : donner l’ambition chiffrée au public, sans chiffres financiers internes.
LECTURE : {{premix27}} t de prémix permettent de fabriquer {{aliment27}} t d’aliment, qui contiennent {{mais27}} t de maïs. Pour les produire, il faut au moins {{haTerrain27}} ha, soit environ {{prod27}} producteurs de {{surf}} ha.
MESSAGE AU PUBLIC : « Nous cherchons des producteurs et des coopératives pour ces volumes, et des éleveurs et fabricants pour les acheter. Inscrivez-vous dès aujourd’hui. »
TRANSITION : « Un programme ouvert à toute la Côte d’Ivoire. »` },
      { type: 'content', title: 'Les objectifs techniques 2027', sub: 'Producteurs et éleveurs à mobiliser',
        blocks: [{ k: 'kpis', items: [
          { v: '{{haTerrain27}} ha', l: 'Surfaces de maïs à mobiliser' },
          { v: '{{prod27}}', l: 'Producteurs de {{surf}} ha' },
          { v: '{{eleveursMix27}}', l: 'Éleveurs : {{chairMix27}} en chair et {{ponteMix27}} en ponte' }] },
          { k: 'table', head: ['Objectif 2027', 'Valeur'], w: [3, 1.6], rows: [
            ['Maïs à livrer (t)', '{{mais27}}'], ['Aliment fini produit (t)', '{{aliment27}}'],
            ['Cheptel chair à nourrir (places)', '{{placesMix27}}'], ['Pondeuses à nourrir', '{{pondMix27}}']] }],
        comments: ['Objectifs de travail soumis à validation ; mix des ventes de prémix {{partChair27}} chair / {{partPonte27}} pondeuse / {{partPorc27}} porcin.'],
        notes: `OBJECTIF : montrer au public l’ampleur de la mobilisation recherchée.
MESSAGE : « Nous cherchons environ {{prod27}} producteurs pour {{haTerrain27}} hectares de maïs, et {{eleveursMix27}} éleveurs : {{chairMix27}} élevages de poulets de chair ({{placesMix27}} places) et {{ponteMix27}} élevages de pondeuses ({{pondMix27}} poules). »
PRÉCISION : un élevage type de {{placesFerme}} places de chair consomme environ {{alimParFerme}} t d’aliment par an ; un élevage de {{pondFerme}} pondeuses en consomme davantage. Chaque inscription compte, quelle que soit la taille.
TRANSITION : « Un programme ouvert à toute la Côte d’Ivoire. »` },
      { type: 'content', title: 'Un programme ouvert à toute la Côte d’Ivoire', sub: 'Le SELAB constitue le point de lancement',
        blocks: [{ k: 'cards', items: [
          { h: 'Réseau de production', t: 'Producteurs et coopératives qualifiés. Mobilisation progressive par bassin.' },
          { h: 'Réseau d’acheteurs', t: 'Éleveurs et fabricants d’aliments. Déploiement selon les capacités de livraison.' }] }],
        comments: ['La sélection des corridors dépend de la qualité, des volumes et du coût rendu acheteur.'],
        notes: `OBJECTIF : rassurer les participants de toutes les régions.
MESSAGE : l’inscription est ouverte partout ; le déploiement opérationnel se fera par corridors (bassin de production relié à une zone de consommation), en fonction des volumes, de la qualité, des routes et des capacités de stockage.
TRANSITION : « La qualité et la traçabilité sont au cœur du dispositif. »` },
      { type: 'section', title: 'Qualité, traçabilité et plateforme', notes: `Séparateur. Présenter la maîtrise des lots et la plateforme IT.` },
      { type: 'content', title: 'La qualité et la traçabilité des lots', sub: 'Quatre étapes de maîtrise',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Origine', t: 'Un vendeur identifié et un lot documenté.' },
          { n: '02', h: 'Contrôle', t: 'Un protocole accepté avant réservation.' },
          { n: '03', h: 'Réception', t: 'Pesée et conformité constatées à livraison.' },
          { n: '04', h: 'Suivi', t: 'Preuves de livraison, écarts et règlements enregistrés.' }] }],
        comments: ['Chaque acheteur valide une fiche qualité : humidité, impuretés, grains endommagés, mycotoxines.'],
        notes: `OBJECTIF : montrer le sérieux du dispositif qualité.
DÉTAIL : chaque lot a un code unique, un propriétaire et une origine ; le protocole de contrôle est accepté par l’acheteur avant réservation ; la pesée et la conformité sont constatées à la réception ; les écarts et règlements sont tracés. En cas de litige : contre-analyse convenue.
TRANSITION : « Ces informations sont suivies sur la plateforme fournie par l’IT SOLEVO-CI. »` },
      { type: 'content', title: 'La plateforme fournie par l’IT SOLEVO-CI', sub: 'Un outil au service des transactions',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Enregistrement', t: 'Profils des acteurs et coordonnées professionnelles.' },
          { n: '02', h: 'Expression des besoins', t: 'Lots proposés et demandes d’achat.' },
          { n: '03', h: 'Suivi des accords', t: 'Quantités, qualité attendue et livraison.' },
          { n: '04', h: 'Traçabilité', t: 'Contrôles, réception et échéances.' }] }],
        comments: ['Le déploiement fonctionnel suit la validation métier et la recette IT.'],
        notes: `OBJECTIF : présenter la plateforme sans sur-promettre.
MESSAGE : la plateforme sert à enregistrer les acteurs, exprimer offres et besoins, suivre les accords et tracer les livraisons. Elle est fournie par l’équipe IT de SOLEVO-CI.
PRUDENCE : préciser que les fonctionnalités ouvrent progressivement après recette ; aucun paiement en ligne n’est prévu au démarrage.
TRANSITION : « Comment participer dès aujourd’hui ? »` },
      { type: 'section', title: 'Comment participer', notes: `Séparateur. Appel à l’inscription.` },
      { type: 'content', title: 'La participation au dispositif', sub: 'Les inscriptions ouvrent la qualification des acteurs',
        blocks: [{ k: 'table', head: ['Vous êtes', 'Informations à communiquer'], w: [1.8, 4], rows: [
          ['Producteur ou coopérative', 'Localité, surfaces, campagne, volume disponible et contact.'],
          ['Éleveur ou fabricant', 'Espèce ou activité, besoin mensuel, qualité attendue et livraison.'],
          ['Prestataire logistique', 'Capacités, zones couvertes, conditions et références.'],
          ['Étape suivante', 'Un référent SOLEVO vous recontacte pour qualifier votre dossier.']] }],
        comments: ['L’inscription ne constitue ni une commande ni une garantie d’achat ou de financement.'],
        notes: `OBJECTIF : convertir l’intérêt en inscriptions qualifiées.
APPEL À L’ACTION : « Passez au stand SOLEVO FEED et SEED ; remplissez la fiche ; un référent vous rappellera avant le 30 novembre. »
POUR L’ÉQUIPE STAND : vérifier que chaque fiche contient au minimum la localité, le type d’acteur, le volume (surface ou besoin mensuel) et un contact joignable.
TRANSITION : « Rencontrons-nous au salon. »` },
      { type: 'content', title: 'Rencontre avec les équipes FEED et SEED', sub: 'SELAB SHOW 2026, Parc des sports d’Abidjan',
        blocks: [{ k: 'kpis', items: [
          { v: '20–22 nov.', l: 'Du 20 au 22 novembre 2026' },
          { v: 'FEED + SEED', l: 'Présentation, qualification des besoins, rendez-vous' },
          { v: 'Contact', l: '{{contact}}' }] }],
        comments: ['Les équipes SOLEVO préciseront le lieu de rencontre et les modalités d’accueil au salon.'],
        notes: `OBJECTIF : conclure et donner le contact.
CLÔTURE : remercier le public et l’organisateur ; rappeler le contact projet {{contact}} ; inviter à prendre rendez-vous pour la campagne 2027.
QUESTIONS FRÉQUENTES : « Faut-il payer pour s’inscrire ? » Non. « SOLEVO achète-t-il le maïs ? » Non, la vente se fait directement entre producteur et acheteur. « Y a-t-il un crédit intrants ? » Selon accords spécifiques, après étude.` },
    ],
  };

  const acteurs = {
    id: 'acteurs',
    folder: '06_Dossier_et_notes',
    file: 'SISSE_KABA_Presentation_Acteurs_Gains',
    name: 'Présentation SISSÊ~KABA : fonctionnement et partage du prix',
    slides: [
      { type: 'title', title: 'SISSÊ~KABA : comment ça marche', sub: 'Fonctionnement opérationnel et partage du prix du maïs', date: '{{dateGarde}}',
        notes: `OBJECTIF : expliquer simplement le fonctionnement de SISSÊ~KABA et ce que chacun y gagne.
PUBLIC : producteurs et coopératives, éleveurs et fabricants d’aliments, ADVANS, partenaires et équipes terrain.
MESSAGE CLÉ : en supprimant la majoration des intermédiaires, le producteur gagne 15 % de plus et l’éleveur paie environ 15,6 % de moins. SOLEVO ne revend pas le maïs.` },
      { type: 'agenda', title: 'Agenda', items: ['Le projet en une phrase', 'Qui fait quoi', 'Le circuit du maïs et de l’argent', 'Le partage du prix', 'Exemple chiffré et gains sur trois ans', 'Les règles du programme'],
        notes: `OBJECTIF : annoncer le déroulé (environ 15 minutes). Préciser dès le début que les montants du maïs ne sont pas des revenus de SOLEVO.` },
      { type: 'content', title: 'Le projet en une phrase', sub: 'Relier directement les producteurs de maïs et les éleveurs',
        blocks: [{ k: 'kpis', items: [
          { v: '+15 %', l: 'pour le producteur : 115 % du prix bord champ au lieu de 100 %' },
          { v: '−15,6 %', l: 'pour l’éleveur : il paie 135 % de P au lieu de 160 %' },
          { v: '0 %', l: 'de majoration intermédiaire (40 % de P supprimés)' }] }],
        comments: ['P = prix bord champ de référence du maïs, en FCFA/kg. Tous les pourcentages sont calculés sur P.', 'SOLEVO coordonne et vend ses intrants SEED et ses produits FEED ; il n’achète pas le maïs pour le revendre.'],
        notes: `OBJECTIF : donner l’essentiel en une diapositive.
EXPLICATION : aujourd’hui, entre le champ et la mangeoire, les intermédiaires ajoutent une majoration d’environ 40 % du prix bord champ. SISSÊ~KABA la supprime : 15 % de P vont en plus au producteur, 25 % de P restent dans la poche de l’éleveur.
TRANSITION : « Voyons qui fait quoi. »` },
      { type: 'content', title: 'Qui fait quoi', sub: 'Cinq acteurs, des responsabilités claires',
        blocks: [{ k: 'table', head: ['Acteur', 'Rôle principal'], w: [1.6, 4.4], rows: [
          ['Producteurs et coopératives', 'Déclarer surfaces et récoltes, produire, livrer un maïs conforme, respecter les engagements.'],
          ['SOLEVO SEED et FEED', 'Fournir semences, intrants et prémix, accompagner les acteurs, coordonner via la plateforme.'],
          ['ADVANS', 'Partenaire SEED de SOLEVO : étudier les financements et organiser les règlements.'],
          ['Entrepôts et transporteurs', 'Réceptionner, peser, contrôler, conserver, tracer et livrer les lots.'],
          ['Éleveurs et fabricants d’aliments', 'Déclarer les besoins, respecter le contrat FEED, payer avant livraison.']] }],
        comments: ['Les modalités propres au projet (financement, comptes, frais, responsabilités) seront formalisées dans les conventions.'],
        notes: `OBJECTIF : montrer que chaque maillon a un rôle précis.
POINT CLÉ : SOLEVO coordonne mais ne revend pas le maïs. Les paiements du maïs, du transport et de l’entrepôt restent distincts de son chiffre d’affaires.
TRANSITION : « Comment circulent le maïs et l’argent ? »` },
      { type: 'content', title: 'Le circuit du maïs et de l’argent', sub: 'Six étapes, du paiement de l’éleveur à la livraison',
        blocks: [{ k: 'steps', items: [
          { h: 'Commande', t: 'Lot disponible, conforme, prix, délai et éleveur éligible vérifiés.' },
          { h: 'Paiement', t: 'L’éleveur paie par le circuit convenu avec ADVANS.' },
          { h: 'Validation', t: 'Les fonds sont confirmés avant tout règlement.' },
          { h: 'Producteur payé', t: 'Sa rémunération, moins le remboursement autorisé.' },
          { h: 'Livraison', t: 'Sortie du lot de l’entrepôt et transport.' },
          { h: 'Prestataires', t: 'Transport et entrepôt payés sur justificatifs.' }] }],
        comments: ['Le dépôt du maïs en entrepôt ne déclenche pas, à lui seul, le paiement du producteur.', 'ADVANS ne préfinance pas l’achat des stocks de maïs.'],
        notes: `OBJECTIF : expliquer l’ordre des opérations.
LECTURE : rien n’est livré ni payé tant que l’argent de l’éleveur n’est pas confirmé. Le producteur est payé ensuite, déduction faite du remboursement de son crédit intrants s’il l’a autorisé. Les prestataires logistiques sont payés sur preuve de service.
TRANSITION : « Et le financement des intrants ? »` },
      { type: 'content', title: 'Le financement des intrants avec ADVANS', sub: 'S’appuyer sur la collaboration SEED existante',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Le producteur déclare', t: 'Superficies, besoins en semences et intrants, calendrier, production prévue.' },
          { n: '02', h: 'SOLEVO SEED chiffre', t: 'Offre technique et commerciale correspondante.' },
          { n: '03', h: 'ADVANS décide', t: 'Étude du dossier ; après accord, règlement de la facture d’intrants SOLEVO.' },
          { n: '04', h: 'Remboursement', t: 'Retenue sur la vente du maïs, avec l’autorisation écrite du producteur.' }] }],
        comments: ['Critères de financement, frais et délais : selon les accords à signer entre les parties.'],
        notes: `OBJECTIF : rassurer sur le financement.
EXPLICATION : ADVANS travaille déjà avec SOLEVO sur le SEED. Le producteur reçoit ses intrants et l’appui technique ; il rembourse sur ses ventes de maïs, uniquement s’il l’a autorisé dans son contrat. Les frais financiers éventuels sont explicités contractuellement, jamais ajoutés en cachette à la grille de prix.
TRANSITION : « Voyons maintenant le partage du prix. »` },
      { type: 'section', title: 'Le partage du prix du maïs', notes: `Séparateur.` },
      { type: 'content', title: 'Le partage du prix, en % du prix bord champ P', sub: 'La majoration intermédiaire disparaît',
        blocks: [
          { k: 'table', head: ['Poste', 'Avant', 'Avec SISSÊ~KABA'], w: [2.4, 1.1, 1.5], rows: [
            ['Producteur', '100 %', '115 %'], ['Transport', '15 %', '15 %'], ['Entrepôt', '5 %', '5 %'], ['Majoration intermédiaire', '40 %', '0 %'], ['Prix payé par l’éleveur', '160 %', '135 %']] },
          { k: 'chart', type: 'stack', title: 'Pour P = 100', cats: ['Avant', 'Avec SISSÊ~KABA'], series: [
            { name: 'Producteur', vals: ['100', '115'] }, { name: 'Transport', vals: ['15', '15'] }, { name: 'Entrepôt', vals: ['5', '5'] }, { name: 'Majoration intermédiaire', vals: ['40', '0'] }] }],
        comments: ['Les 40 % de P supprimés : 15 % au producteur, 25 % d’économie pour l’éleveur. Aucune réserve ni commission n’est conservée.'],
        notes: `OBJECTIF : expliquer d’où vient le gain.
LECTURE : avant, pour 100 FCFA payés au producteur, l’éleveur payait 160 : 15 de transport, 5 d’entrepôt et 40 de majoration intermédiaire. Avec SISSÊ~KABA, la majoration disparaît : le producteur reçoit 115, l’éleveur paie 135. Transport et entrepôt restent payés.
CALCUL : 25 ÷ 160 = 15,6 % d’économie pour l’éleveur ; 15 ÷ 100 = +15 % pour le producteur.
PRUDENCE : la référence « avant » est une hypothèse à vérifier à qualité, période et lieu de livraison équivalents.
TRANSITION : « Prenons un exemple chiffré. »` },
      { type: 'content', title: 'Exemple avec P = {{P}} FCFA/kg', sub: 'Par kilo et par tonne de maïs',
        blocks: [{ k: 'table', head: ['Affectation', 'Avant', 'Avec SISSÊ~KABA', 'Écart'], w: [2.2, 1.2, 1.5, 1.1], rows: [
          ['Producteur (FCFA/kg)', '{{prixProdAv}}', '{{prixProdAp}}', '+{{gainProdKg}}'],
          ['Transport (FCFA/kg)', '{{transpKg}}', '{{transpKg}}', '0'],
          ['Entrepôt (FCFA/kg)', '{{entrepotKg}}', '{{entrepotKg}}', '0'],
          ['Majoration intermédiaire (FCFA/kg)', '{{majorKg}}', '0', '−{{majorKg}}'],
          ['Prix payé par l’éleveur (FCFA/kg)', '{{prixAchAv}}', '{{prixAchAp}}', '−{{econAchKg}}'],
          ['Par tonne : producteur / éleveur', '—', '—', '+{{gainProdT}} / −{{econAchT}}']] }],
        comments: ['Le supplément producteur est indiqué avant remboursement éventuel de son financement.', 'P se renseigne dans le simulateur ou en B3 de l’onglet « Gains acteurs » du modèle Excel.'],
        notes: `OBJECTIF : rendre les gains concrets.
CALCUL : avec P = {{P}} FCFA/kg, le producteur reçoit {{prixProdAp}} au lieu de {{prixProdAv}} FCFA/kg (+{{gainProdKg}}), l’éleveur paie {{prixAchAp}} au lieu de {{prixAchAv}} (−{{econAchKg}}). Par tonne : +{{gainProdT}} FCFA pour le producteur, −{{econAchT}} FCFA pour l’éleveur. Pour Q tonnes, multiplier par Q.
TRANSITION : « À l’échelle du programme, cela donne… »` },
      { type: 'content', title: 'Les gains sur trois ans', sub: 'Millions FCFA, pour P = {{P}} FCFA/kg',
        blocks: [
          { k: 'table', head: ['M FCFA', '2027', '2028', '2029'], w: [2.6, 1.1, 1.1, 1.1], rows: [
            ['Maïs du programme (t)', '{{mais27}}', '{{mais28}}', '{{mais29}}'],
            ['Supplément des producteurs (15 % de P)', '{{gainP27}}', '{{gainP28}}', '{{gainP29}}'],
            ['Économie des éleveurs (25 % de P)', '{{econA27}}', '{{econA28}}', '{{econA29}}']] },
          { k: 'chart', type: 'col', title: 'M FCFA', cats: ['2027', '2028', '2029'], series: [
            { name: 'Producteurs', vals: ['{{gainP27n}}', '{{gainP28n}}', '{{gainP29n}}'] }, { name: 'Éleveurs', vals: ['{{econA27n}}', '{{econA28n}}', '{{econA29n}}'] }] }],
        comments: ['Montants indicatifs et bruts, jamais ajoutés au chiffre d’affaires de SOLEVO.'],
        notes: `OBJECTIF : montrer l’impact global.
CALCUL : tonnes de maïs × {{gainProdT}} FCFA/t pour les producteurs et × {{econAchT}} FCFA/t pour les éleveurs. En 2027 : {{gainP27}} M FCFA en plus pour les producteurs, {{econA27}} M FCFA d’économies pour les éleveurs.
TRANSITION : « Ce que cela représente par exploitation. »` },
      { type: 'content', title: 'Ce que cela représente par acteur', sub: 'Équivalents 2027, à titre indicatif',
        blocks: [{ k: 'kpis', items: [
          { v: '{{gainParProdF}} FCFA', l: 'en plus par producteur de {{surf}} ha ({{maisParProd}} t livrées)' },
          { v: '{{alimParFerme}} t', l: 'd’aliment par ferme chair équivalente de {{placesFerme}} places' },
          { v: '{{econParFermeF}} FCFA', l: 'd’économie sur le maïs par ferme chair équivalente' }] }],
        comments: ['Moyennes : {{prod27}} producteurs et {{chair27}} fermes chair équivalentes. Les situations réelles varient.'],
        notes: `OBJECTIF : traduire les gains à l’échelle d’une exploitation.
LECTURE : un producteur moyen livre {{maisParProd}} t et gagne {{gainParProdF}} FCFA de plus ; une ferme chair équivalente économise {{econParFermeF}} FCFA sur son maïs.
TRANSITION : « Attention à ce que représente cette baisse. »` },
      { type: 'content', title: 'L’effet sur le coût de l’aliment', sub: 'La baisse de 15,6 % porte sur le maïs',
        blocks: [{ k: 'cards', items: [
          { h: 'Ce qui baisse', t: 'Le prix du maïs payé par l’éleveur : 135 % de P au lieu de 160 %.' },
          { h: 'Ce qui ne baisse pas', t: 'Prémix, tourteaux, autres matières premières, fabrication.' },
          { h: 'Ordre de grandeur', t: 'Le maïs pèse {{txMais}} de l’aliment : l’effet sur le coût total est plus faible que 15,6 %.' }] }],
        comments: ['Effet sur l’aliment ≈ 15,6 % × part du maïs dans le coût de la formule (à calculer par élevage).'],
        notes: `OBJECTIF : éviter un contresens.
EXPLICATION : seul le poste maïs baisse. L’économie sur l’aliment complet dépend de la part du maïs dans le coût de la formule ; combinée au prémix MG2MIX, elle s’ajoute aux autres leviers de formulation.
TRANSITION : « Voici les règles qui sécurisent le programme. »` },
      { type: 'section', title: 'Les règles du programme', notes: `Séparateur.` },
      { type: 'content', title: 'Les règles du programme', sub: 'Des stocks réels, des acheteurs éligibles, des coûts justifiés',
        blocks: [{ k: 'cards', items: [
          { n: '01', h: 'Tout passe par l’entrepôt', t: 'Lot réceptionné, pesé, identifié et contrôlé ; seuls les lots acceptés sont proposés.' },
          { n: '02', h: 'Stocks d’abord', t: 'Stocks en entrepôt prioritaires ; collectes complémentaires 5 à 7 jours avant livraison.' },
          { n: '03', h: 'Éleveurs éligibles', t: 'Au moins 80 % des engagements FEED échus respectés, échéances payées.' },
          { n: '04', h: 'Entrepôt : 5 % de P', t: 'Charges convenues et justifiées, sans double comptage ; vérifié au pilote.' }] }],
        comments: ['Les quantités réservées sont déduites pour éviter toute double affectation. Les coordonnées des producteurs restent réservées aux coordinateurs autorisés.'],
        notes: `OBJECTIF : montrer que le dispositif est sécurisé.
DÉTAIL : 1) aucun maïs « virtuel » n’est vendu ; 2) on écoule d’abord ce qui est stocké ; 3) l’accès aux conditions du programme est lié au respect du contrat FEED (seuil proposé de 80 % des engagements échus, en tenant compte du cheptel et du calendrier) ; 4) l’enveloppe entrepôt couvre réception, manutention, stockage et frais retenus.
TRANSITION : « Ce que ces gains ne sont pas. »` },
      { type: 'content', title: 'Ce que ces gains ne sont pas', sub: 'Trois clarifications indispensables',
        blocks: [{ k: 'cards', items: [
          { h: 'Pas un revenu SOLEVO', t: 'SOLEVO se rémunère sur le prémix (FEED) et les intrants (SEED), jamais sur le maïs.' },
          { h: 'Pas un gain garanti', t: 'La référence « avant » est à vérifier à qualité, période et lieu équivalents.' },
          { h: 'Pas de frais cachés', t: 'Frais financiers éventuels explicités par contrat, jamais ajoutés à la grille.' }] }],
        comments: ['Ces messages sont repris à l’identique dans toute communication publique.'],
        notes: `OBJECTIF : sécuriser la communication.
MESSAGE : utiliser les mots « indicatif », « à base comparable », « selon les conventions ». Les paiements du maïs, du transport et de l’entrepôt restent distincts du chiffre d’affaires SOLEVO.
TRANSITION : « Ce qu’il reste à formaliser avant le pilote. »` },
      { type: 'content', title: 'À formaliser avant le pilote', sub: 'Décisions et preuves attendues',
        blocks: [{ k: 'table', head: ['Domaine', 'Décision ou preuve attendue'], w: [1.8, 4.2], rows: [
          ['Financement et règlements', 'Convention ADVANS, autorisations de retenue, frais et délais de paiement.'],
          ['Stocks et qualité', 'Propriété des lots, transfert des risques, critères d’acceptation, pertes, assurance.'],
          ['Logistique', 'Périmètre des coûts, contrats entrepôts et transporteurs, preuves de service.'],
          ['Relations commerciales', 'Contrats producteurs et éleveurs, engagements FEED, réclamations.'],
          ['Suivi du pilote', 'Tonnes acceptées et livrées, délais, conformité, paiements, coûts réels.']] }],
        comments: ['Les gains réels sont publiés seulement après rapprochement des preuves de prix et de coûts.'],
        notes: `OBJECTIF : terminer sur les prochaines étapes concrètes.
CONCLUSION : « SISSÊ~KABA, c’est un partage plus juste du prix du maïs : le producteur gagne plus, l’éleveur paie moins, et chaque franc est tracé. »` },
      { type: 'section', title: 'Merci — Questions et échanges', notes: `Clôture. Contact projet : {{contact}}.` },
    ],
  };

  root.SKD = { decks: [codir, selab, acteurs] };
})(typeof window !== 'undefined' ? window : globalThis);
