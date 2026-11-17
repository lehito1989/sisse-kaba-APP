/* SISSÊ~KABA — contenu des documents Word / PDF. Jetons {{cle}} = valeurs du scénario courant. */
(function (root) {
  'use strict';
  const SELAB = 'Lancement officiel au SELAB SHOW 2026, du 20 au 22 novembre 2026 au Parc des sports d’Abidjan, avec la participation des segments FEED et SEED de SOLEVO-CI.';
  const T = (head, rows, w) => ({ table: { head, rows, w } });
  const Y = ['2027', '2028', '2029'];
  const EURK = /^(ca|mb|res|caFeed|caSeed|mbFeed|mbSeed|caChair|caPonte|mbChair|mbPonte|caPorc|mbPorc)$/;
  const row3 = (label, k, suf) => [label].concat(['27', '28', '29'].map((y) => '{{' + k + y + (suf || '') + '}}' + (EURK.test(k) ? ' ({{' + k + y + 'E}})' : '')));

  const decision = [
    { p: 'Dossier de décision destiné à la direction, aux équipes FEED et SEED, à la finance, à l’IT et aux partenaires opérationnels. Périmètre national, déploiement progressif par bassins de production et zones de consommation.' },
    { p: 'Scénario : {{scenario}}.', style: 'accent' },
    { h2: 'La décision proposée' },
    { p: 'Lancer officiellement le projet au SELAB SHOW du 20 au 22 novembre 2026 au Parc des sports d’Abidjan, avec les segments FEED et SEED, puis déployer en 2027 un programme coordonné reliant les ventes de prémix, les besoins en maïs des éleveurs et industriels et la vente d’intrants aux producteurs. La plateforme est fournie par l’équipe IT de SOLEVO Côte d’Ivoire. Le modèle de départ prévoit des transactions de maïs directement entre producteurs et acheteurs, avec des partenaires de stockage et de transport.' },
    T(['Indicateur'].concat(Y), [
      row3('Prémix vendu en tonnes', 'premix'), row3('Maïs à livrer en tonnes', 'mais'),
      row3('CA total SOLEVO du programme (M FCFA)', 'ca', '_1'), row3('Résultat avant financement et impôt (M FCFA)', 'res', '_1')], [3, 1, 1, 1]),
    { p: 'Les objectifs 2028 et 2029 ({{premix28}} t et {{premix29}} t) résultent d’une {{txtCroissance}} ; ils constituent des hypothèses de croissance. Le résultat n’est ni un bénéfice net ni un gain additionnel déjà acquis.' },
    { p: 'Enveloppe indicative de ressources au démarrage 2027 : {{env27}} millions FCFA, comprenant BFR majoré pour saisonnalité, matériels et coussin de trésorerie. Elle reste à rapprocher du crédit fournisseurs, des ressources existantes et des encaissements mensuels.' },
  ];

  const s1 = [
    { h1: '1 Cadre de décision et périmètre' },
    { p: 'Le programme répond au décalage entre des acheteurs qui peinent à sécuriser un approvisionnement régulier en maïs et des producteurs qui rencontrent des difficultés de commercialisation. La valeur du dispositif provient de la coordination des volumes, de la qualité, des calendriers et des paiements, ainsi que de la vente de produits FEED et SEED.' },
    { h2: 'Ce que SOLEVO commercialise' },
    { p: 'SOLEVO vend le prémix (FEED) et les intrants agricoles (SEED : semences, engrais et produits phytosanitaires). Le chiffre d’affaires du maïs et celui des aliments finis ne sont pas intégrés au chiffre d’affaires SOLEVO. Aucun revenu d’abonnement, commission de plateforme, portage de stock, financement de récolte ou marge de revente de maïs n’est présumé.' },
    { h2: 'Ce que chaque partie engage' },
    { p: 'Les producteurs et coopératives s’engagent sur des surfaces, des lots et des calendriers réalistes. Les acheteurs expriment leurs besoins, acceptent les spécifications et paient selon les modalités contractuelles. SOLEVO accompagne et coordonne, sans garantir automatiquement le prix, le rendement, l’achat des récoltes ou le crédit.' },
    T(['Décision à valider', 'Proposition de travail'], [
      ['Objectif de départ', 'Positionner {{premix27}} t de prémix sur 2027.'],
      ['Base de marge', '{{margeFeed}} {{baseFeed}} pour FEED ; confirmer la convention comptable.'],
      ['Déploiement', 'Commencer par des corridors validés, puis étendre selon les résultats.'],
      ['Portage du maïs', 'Transactions directes ; pas de stock de maïs détenu par SOLEVO dans la base.'],
      ['Financement', 'Établir un budget mensuel et les lignes autorisées avant engagements.'],
      ['Événement de lancement', 'SELAB SHOW, du 20 au 22 novembre 2026 au Parc des sports d’Abidjan, avec FEED et SEED. Dates et lieu communiqués par le porteur.']], [1.4, 3]),
    { h2: 'Conditions de passage à l’échelle' },
    { p: 'Les objectifs 2028 et 2029 sont conditionnés à la fiabilité des fournisseurs, à la qualité acceptée, aux encaissements et au financement du besoin en fonds de roulement. Un volume non sécurisé ne doit pas déclencher des achats ou un crédit sans autorisation.' },
  ];

  const s2 = [
    { h1: '2 Marché et choix des clients' },
    { p: 'Le FIRCA présente une production nationale d’environ 1,7 million de tonnes de maïs en 2024 ; le bilan gouvernemental 2011–2025 indique 1 701 426 tonnes pour 2024 [1–2]. Ces données ne justifient pas de conclure à un déficit national structurel : le problème ciblé est l’accès à des lots disponibles, conformes et livrables au bon moment.' },
    { p: 'La cible de {{mais27}} tonnes représente environ {{partNat27}} de la production nationale 2024 ; {{mais29}} tonnes représentent environ {{partNat29}}. Ce rapprochement donne un ordre de grandeur, sans démontrer que ces lots sont commercialement accessibles ni qu’ils répondent aux spécifications des acheteurs.' },
    T(['Segment', 'Besoin', 'Offre du projet'], [
      ['Éleveurs fabriquant leur aliment', 'Régularité du maïs et coût rendu maîtrisé', 'Prémix, prévisions de besoins et accès à des lots qualifiés.'],
      ['Fabricants industriels', 'Volumes groupés et qualité homogène', 'Lots documentés et calendrier de livraison négocié.'],
      ['Producteurs de maïs', 'Intrants et visibilité commerciale', 'Panier adapté, accompagnement et mise en relation avec acheteurs.'],
      ['Coopératives', 'Agrégation, traçabilité et paiement', 'Registre de lots et interlocuteurs commerciaux identifiés.']], [1.4, 1.6, 2.2]),
    { h2: 'Qualification commerciale' },
    { p: 'SIPRA et Koudijs peuvent figurer parmi les prospects industriels ; aucun accord n’est présumé. La liste de prospection indique le décideur, la demande annuelle et mensuelle, le rayon logistique, les spécifications, les habitudes de paiement et les ventes SOLEVO déjà réalisées. La sélection des zones s’appuie sur la proximité des bassins, l’état des routes, les capacités de séchage et de stockage, les partenaires disponibles et les calendriers agricoles.' },
    { h2: 'Preuve de demande avant mobilisation' },
    { p: 'En T1 2027, viser la préqualification d’au moins 60 % des besoins annuels de maïs, soit {{preQual}} tonnes. Une intention ne vaut pas commande ferme. Les engagements définitifs préciseront quantité, qualité, prix ou règle de fixation, lieu, date et paiement.' },
  ];

  const s3 = [
    { h1: '3 Fonctionnement et partage de valeur' },
    { p: 'SISSÊ~KABA relie directement les producteurs de maïs aux éleveurs et fabricants d’aliments. SOLEVO coordonne les segments SEED et FEED, accompagne les acteurs et vend ses semences, intrants et produits de nutrition animale. SOLEVO n’achète pas le maïs pour le revendre pour son propre compte.' },
    { h2: 'Qui fait quoi' },
    T(['Acteur', 'Responsabilité principale'], [
      ['Producteurs et coopératives', 'Déclarer surfaces et récoltes, produire, livrer un maïs conforme et respecter les engagements.'],
      ['SOLEVO SEED et FEED', 'Fournir intrants et prémix, accompagner les acteurs et coordonner le programme via la plateforme.'],
      ['ADVANS', 'Partenaire SEED existant de SOLEVO : étudier le financement et organiser les règlements selon les accords du projet.'],
      ['Entrepôts et transporteurs', 'Réceptionner, peser, contrôler, conserver, tracer et livrer les lots selon les prestations convenues.'],
      ['Éleveurs et fabricants d’aliments', 'Déclarer les besoins, respecter le contrat FEED et payer les commandes avant leur exécution.']], [2, 4]),
    { h2: 'Le financement des intrants avec ADVANS' },
    { p: 'Le producteur déclare ses superficies, ses besoins en semences et intrants, son calendrier cultural et sa production prévisionnelle. SOLEVO SEED établit l’offre correspondante. ADVANS étudie la demande selon ses critères ; après accord et signature, le financement peut régler la facture d’intrants SOLEVO. Le remboursement peut être retenu sur les ventes de maïs, uniquement avec l’autorisation contractuelle du producteur.' },
    { h2: 'Le circuit du maïs et de l’argent' },
    T(['Étape', 'Ce qui se passe'], [
      ['1. Commande et vérification', 'Disponibilité du lot, conformité, prix, délai et éligibilité de l’éleveur.'],
      ['2. Paiement', 'L’éleveur règle sa commande par le circuit convenu avec ADVANS.'],
      ['3. Validation', 'Les fonds sont confirmés avant tout règlement.'],
      ['4. Règlement du producteur', 'Sa rémunération, après déduction du remboursement de financement expressément autorisé.'],
      ['5. Livraison', 'Sortie du lot de l’entrepôt et transport vers l’éleveur.'],
      ['6. Règlement des prestations', 'Transport et charges d’entrepôt payés sur justificatifs.']], [2, 4]),
    { p: 'Le dépôt du maïs en entrepôt ne déclenche pas, à lui seul, le paiement du producteur. Le dispositif ne suppose pas qu’ADVANS préfinance l’achat des stocks de maïs.' },
    { h2: 'Le partage du prix du maïs' },
    { p: 'P désigne le prix bord champ de référence du maïs, en FCFA/kg. Tous les pourcentages sont calculés sur P. La référence « avant » est une hypothèse de comparaison, à vérifier à qualité, période et lieu de livraison équivalents.' },
    T(['Poste, en % de P', 'Avant', 'Avec SISSÊ~KABA'], [
      ['Producteur', '100 %', '115 %'], ['Transport', '15 %', '15 %'], ['Entrepôt', '5 %', '5 %'], ['Majoration intermédiaire', '40 %', '0 %'], ['Prix payé par l’éleveur', '160 %', '135 %']], [3, 1, 1.4]),
    { p: 'La suppression de la majoration intermédiaire (40 % de P) apporte 15 % de P supplémentaires au producteur (+15 %) et 25 % de P d’économie à l’éleveur, soit 15,6 % de son prix d’achat avant projet. Aucun solde, aucune réserve et aucune commission ne sont conservés. La baisse porte sur le maïs, pas sur le coût total de l’aliment fini.' },
    { h2: 'Exemple avec P = {{P}} FCFA par kilogramme' },
    T(['Affectation', 'FCFA par kg', 'FCFA par tonne'], [
      ['Producteur', '{{prixProdAp}}', '{{prixProdApT}}'], ['Transport', '{{transpKg}}', '{{transpT}}'], ['Entrepôt', '{{entrepotKg}}', '{{entrepotT}}'],
      ['Prix payé par l’éleveur', '{{prixAchAp}}', '{{prixAchApT}}'], ['Référence avant projet', '{{prixAchAv}}', '{{prixAchAvT}}'], ['Économie de l’éleveur', '{{econAchKg}}', '{{econAchT}}']], [3, 1.2, 1.4]),
    { p: 'Le producteur reçoit {{gainProdT}} FCFA de plus par tonne, avant remboursement éventuel de son financement ; l’éleveur économise {{econAchT}} FCFA par tonne. Sur {{mais27}} tonnes en 2027 : {{gainP27}} millions FCFA en plus pour les producteurs et {{econA27}} millions FCFA d’économies pour les éleveurs. Ces montants restent distincts du chiffre d’affaires de SOLEVO.' },
    { h2: 'Les règles du programme' },
    { p: 'Stocks réels et traçables : tout maïs livré passe par un entrepôt où il est réceptionné, pesé, identifié et contrôlé ; seuls les lots acceptés sont proposés ; les quantités réservées sont déduites. Les stocks réceptionnés sont prioritaires ; les collectes complémentaires sont programmées cinq à sept jours avant livraison.' },
    { p: 'Éligibilité des éleveurs : l’accès aux conditions du programme est lié au contrat FEED, avec un seuil proposé d’au moins 80 % des engagements d’achat échus et des échéances de paiement respectées. Une non-conformité bloque la commande avant paiement.' },
    { p: 'Enveloppe entrepôt de 5 % de P : elle couvre les charges convenues et justifiées (réception, manutention, stockage, occupation, autres frais retenus), sans double comptage. Sa suffisance sera vérifiée pendant le pilote. Les frais financiers éventuels sont explicités contractuellement et ne sont pas ajoutés à la grille.' },
    { h2: 'À formaliser avant le pilote' },
    T(['Domaine', 'Décision ou preuve attendue'], [
      ['Financement et règlements', 'Convention ADVANS, autorisations de retenue, frais et délais de paiement.'],
      ['Stocks et qualité', 'Propriété des lots, transfert des risques, critères d’acceptation, pertes et assurance.'],
      ['Prestations logistiques', 'Périmètre des coûts, contrats entrepôts et transporteurs, preuves de service.'],
      ['Relations commerciales', 'Contrats producteurs et éleveurs, engagements FEED, procédure de réclamation.'],
      ['Suivi du pilote', 'Tonnes acceptées et livrées, délais, conformité, paiements et coûts réels.']], [2, 4]),
  ];

  const s4 = [
    { h1: '4 Objectifs physiques et portefeuille' },
    { p: 'Une tonne de prémix correspond à 50 sacs de {{sacKg}} kg. Chaque sac permet de fabriquer {{alimSac}} tonne d’aliment fini ; à {{txMais}} d’incorporation, une tonne de prémix correspond à {{maisParT}} tonnes de maïs. Cette conversion est le moteur du modèle Excel.' },
    T(['Volume ou capacité'].concat(Y), [
      row3('Prémix vendu en tonnes', 'premix'), row3('Sacs de prémix vendus', 'sacs'), row3('Aliment fini en tonnes', 'aliment'), row3('Maïs à livrer en tonnes', 'mais'),
      row3('Hectares à mobiliser (calcul)', 'ha'), row3('Surface minimum terrain (ha)', 'haTerrain'), row3('Producteurs de {{surf}} ha (arrondi supérieur)', 'prod'), row3('Hectares achetant le panier intrants', 'haPanier')], [3, 1, 1, 1]),
    { p: 'Le rendement de travail est de {{rdt}} t/ha, dont {{util}} utilisables, et {{aff}} affectés au programme : un hectare mobilisé fournit {{tHa}} tonnes au dispositif. La surface moyenne est supposée de {{surf}} ha par producteur, sur une campagne annuelle.' },
    { h2: 'Dimensionnement indicatif des élevages' },
    T(['Scénario alternatif'].concat(Y), [
      row3('Poulets de chair par an (millions)', 'poulets'), row3('Places chair équivalentes', 'places'), row3('Fermes chair de {{placesFerme}} places', 'chair'),
      row3('Pondeuses moyennes', 'pondeuses'), row3('Fermes de {{pondFerme}} pondeuses', 'ponte')], [3, 1, 1, 1]),
    { p: 'Les deux scénarios ne s’additionnent pas. Chair : {{kgPoulet}} kg d’aliment par poulet et par cycle, {{cycles}} cycles annuels. Pondeuses : {{pondJour}} g par jour sur 365 jours. Les capacités arrondies au supérieur ne sont pas des prévisions biologiques.' },
  ];

  const sObj = [
    { h2: 'Objectifs techniques SEED et FEED' },
    T(['Objectif technique'].concat(Y), [
      row3('SEED — hectares à mobiliser (minimum terrain)', 'haTerrain'), row3('SEED — maïs à livrer au programme (t)', 'mais'),
      row3('SEED — production brute de maïs sur ces surfaces (t)', 'prodBrute'), row3('SEED — producteurs de {{surf}} ha', 'prod'),
      row3('FEED — aliment fini produit (t)', 'aliment'), row3('FEED — part de l’aliment pour la chair', 'partChair'),
      row3('FEED — cheptel chair à nourrir (places)', 'placesMix'), row3('FEED — éleveurs de chair ({{placesFerme}} places par élevage)', 'chairMix'),
      row3('FEED — pondeuses à nourrir', 'pondMix'), row3('FEED — éleveurs de pondeuses ({{pondFerme}} têtes par élevage)', 'ponteMix'),
      row3('FEED — total des éleveurs (chair + pondeuses)', 'eleveursMix')], [3.4, 1, 1, 1]),
    { p: 'Portefeuille mixte : {{partChair27}} des sacs de prémix vont à la chair, {{partPonte27}} à la ponte et {{partPorc27}} au porc ; les éleveurs s’additionnent ({{porcMix27}} élevages de {{porcsFerme}} porcs par an, à {{kgPorc}} kg d’aliment par porc). Cheptel fixe par élevage : {{placesFerme}} places de chair ({{kgPoulet}} kg d’aliment par poulet et par cycle, {{cycles}} cycles par an) et {{pondFerme}} pondeuses ({{pondJour}} g par poule et par jour). Repères non additionnables : {{chair27}} élevages si tout l’aliment allait à la chair, {{ponte27}} si tout allait à la ponte.' },
    { h2: 'Part de marché visée en Côte d’Ivoire' },
    T(['Part de marché'].concat(Y), [
      row3('Prémix SOLEVO du programme (t)', 'premix'), row3('Marché national du prémix (t)', 'mPremix'), row3('Part de marché prémix', 'pdmP'),
      row3('Aliment fini associé (t)', 'aliment'), row3('Marché national de l’aliment fini (t)', 'mAliment'), row3('Part de marché aliment fini', 'pdmA'),
      row3('Ventes actuelles de prémix hors programme (t)', 'ventesExist'), row3('Ventes totales de prémix SOLEVO (t)', 'premixTot'),
      row3('Part de marché totale SOLEVO — prémix', 'pdmPTot'), row3('Part de marché totale — aliment fini associé', 'pdmATot')], [3.4, 1, 1, 1]),
    { h2: 'Part de marché actuelle de SOLEVO (données dépôts 2026)' },
    T(['Point de vente', 'Statut', 'Prémix 2026 (t)', 'Annualisé (t/an)'], [
      ['{{depNom0}}', 'Actif', '{{depT0}}', '{{depAn0}}'], ['{{depNom1}}', 'Actif', '{{depT1}}', '{{depAn1}}'], ['{{depNom2}}', 'Actif depuis le 13/07/2026', '{{depT2}}', '{{depAn2}}'],
      ['San-Pédro, Gagnoa, Man, Korhogo', 'En installation', '—', '—'], ['Total réseau', '3 dépôts actifs', '{{depYtd}}', '{{depAnnual}}']], [2.2, 1.8, 1.1, 1.1]),
    { p: 'Au {{depAsOf}}, SOLEVO a vendu {{depYtd}} t de prémix (volaille ponte, chair, porcin et ruminant), soit {{depAnnual}} t sur une année pleine : {{pdmAct}} du marché national du prémix (fourchette {{pdmActYtd}} à {{pdmRun}}). L’aliment fini fabriqué avec ces prémix ({{depAlimAn}} t par an) représente {{pdmAlimAct}} du marché de l’aliment. L’écart vient du ratio du marché ({{ratioMarche}} t d’aliment par tonne de prémix, soit une inclusion moyenne de {{inclMarche}}, contre 2 % pour les prémix SOLEVO) : la valeur de marché du prémix inclut des produits plus fortement dosés (concentrés, CMV). Les deux valeurs de marché sont valeurs confirmées par le porteur le 13/11/2026, évolutives et à actualiser à chaque revue. La décentralisation vers 7 dépôts porte les ventes hors programme projetées à {{ventesExist27}} t en 2027, {{ventesExist28}} t en 2028 et {{ventesExist29}} t en 2029 (hypothèses modifiables dans le simulateur).' },
    { p: 'Les parts du programme portent sur SISSÊ~KABA seul ; les parts totales ajoutent les ventes actuelles de prémix SOLEVO hors programme (saisie du porteur, onglet Hypotheses ligne 58){{ventesExistNote}}. Valeurs de marché national : {{mPremix27}} t de prémix et {{mAliment27}} t d’aliment fini en 2027 ({{mktGrowth}}) ; valeurs confirmées par le porteur le 13/11/2026, évolutives et à actualiser à chaque revue, modifiables dans le simulateur et dans l’onglet Hypotheses (lignes 56 et 57).' },
  ];

  const s5 = [
    { h1: '5 Offre intrants et économie par tonne de maïs' },
    { p: 'Le programme mobilise davantage de surfaces que le seul ratio {{mais27}} ÷ {{rdt}} = {{haSimple}} ha, car il intègre pertes et affectation partielle. En parallèle, seuls {{couv}} des hectares achètent le panier complet SOLEVO.' },
    T(['Intrant', 'Dose par ha', 'Prix unitaire', 'CA par ha'], [
      ['Semences', '{{doseSem}} kg', '{{prixSem}} FCFA/kg', '{{caSem}}'], ['NPK', '{{doseNpk}} kg', '{{prixNpk}} FCFA/kg', '{{caNpk}}'],
      ['Urée', '{{doseUree}} kg', '{{prixUree}} FCFA/kg', '{{caUree}}'], ['Herbicide', '{{doseHerb}} L', '{{prixHerb}} FCFA/L', '{{caHerb}}'],
      ['Insecticide', '{{doseIns}} L', '{{prixIns}} FCFA/L', '{{caIns}}'], ['Total panier', '', '', '{{panier}}']], [1.5, 1, 1.4, 1]),
    { h2: 'Prix et marges du prémix : chair, pondeuse et porcin' },
    T(['Prémix', 'Part des sacs', 'Incorporation', 'Prix du sac 2027', 'Marge ({{baseFeed}})', 'Taux de marque', 'Gain / sac', 'CA 2027 (M FCFA)', 'Marge brute 2027 (M FCFA)'], [
      ['Chair', '{{partChair27}}', '{{inclChair}}', '{{prixChair}}', '{{mChair}}', '{{marqueChair}}', '{{gainSacChair}}', '{{caChair27}} (≈ {{caChair27E}})', '{{mbChair27}} (≈ {{mbChair27E}})'],
      ['Pondeuse', '{{partPonte27}}', '{{inclPonte}}', '{{prixPonte}}', '{{mPonte}}', '{{marquePonte}}', '{{gainSacPonte}}', '{{caPonte27}} (≈ {{caPonte27E}})', '{{mbPonte27}} (≈ {{mbPonte27E}})'],
      ['Porcin', '{{partPorc27}}', '{{inclPorc}}', '{{prixPorc}}', '{{mPorc}}', '{{marquePorc}}', '{{gainSacPorc}}', '{{caPorc27}} (≈ {{caPorc27E}})', '{{mbPorc27}} (≈ {{mbPorc27E}})'],
      ['Moyenne pondérée', '100 %', '', '{{prixSac}}', '{{margeFeedP}}', '{{marqueFeed}}', '', '{{caFeed27}} (≈ {{caFeed27E}})', '{{mbFeed27}} (≈ {{mbFeed27E}})']], [1.3, 0.8, 0.9, 0.9, 1, 0.9, 0.8, 1, 1.1]),
    T(['Prix du sac (FCFA)', '2027', '2028', '2029'], [
      ['Prémix chair', '{{prixChair27}}', '{{prixChair28}}', '{{prixChair29}}'], ['Prémix pondeuse', '{{prixPonte27}}', '{{prixPonte28}}', '{{prixPonte29}}'],
      ['Prémix porcin', '{{prixPorc27}}', '{{prixPorc28}}', '{{prixPorc29}}'], ['Prix moyen pondéré', '{{prixSac27}}', '{{prixSac28}}', '{{prixSac29}}']], [2, 1, 1, 1]),
    { p: 'Le prix moyen du sac, la marge FEED et l’aliment produit par sac sont calculés à partir des prix, des taux de marge et des taux d’incorporation propres aux prémix chair, pondeuse et porcin, pondérés par le mix des ventes de prémix ({{partChair27}} chair, {{partPonte27}} pondeuse, {{partPorc27}} porcin). Les prix 2028 et 2029 suivent la hausse annuelle retenue ({{hausse28}} puis {{hausse29}}). Le CA, la marge brute et l’aliment FEED sont la somme exacte des trois gammes (contrôles Previsions lignes 84 et 91). Repères du fichier des dépôts 2026 : prix réalisés de 29 062 FCFA (chair), 25 080 FCFA (pondeuse) et 28 486 FCFA (porcin) le sac, marges réalisées de 28,7 %, 30,6 % et 28,9 % sur coût. Prix et taux à valider avec la direction FEED ; ils se modifient dans le simulateur et dans l’onglet Hypotheses (lignes 59 et 65 à 77).' },
    { h2: 'Taux de marge et gain réel de SOLEVO par intrant' },
    T(['Intrant', 'Marge sur coût', 'Taux de marque', 'Gain SOLEVO / ha', 'Gain 2027 (M FCFA)'], [
      ['Semences', '{{mSem}}', '{{marqueSem}}', '{{mbHaSem}}', '{{mb27Sem}}'], ['NPK', '{{mNpk}}', '{{marqueNpk}}', '{{mbHaNpk}}', '{{mb27Npk}}'],
      ['Urée', '{{mUree}}', '{{marqueUree}}', '{{mbHaUree}}', '{{mb27Uree}}'], ['Herbicide', '{{mHerb}}', '{{marqueHerb}}', '{{mbHaHerb}}', '{{mb27Herb}}'],
      ['Insecticide', '{{mIns}}', '{{marqueIns}}', '{{mbHaIns}}', '{{mb27Ins}}'], ['Total panier', '{{margeSeed}}', '{{margeSeedCA}}', '{{mbHa}}', '{{mbSeed27}} (≈ {{mbSeed27E}})']], [1.5, 1.1, 1.1, 1.2, 1.2]),
    { p: 'Le gain réel de SOLEVO sur les intrants est la marge brute : {{mbHa}} FCFA par hectare couvert, soit {{mbHaT}} FCFA par tonne de maïs livrée et {{mbSeed27}} M (≈ {{mbSeed27E}}) FCFA (≈ {{mbSeed27E}}) en 2027, avant charges du programme. La marge moyenne pondérée du panier est de {{margeSeed}} sur coût ({{margeSeedCA}} du prix de vente). Les taux par intrant sont des hypothèses à valider avec la direction SEED ; ils se modifient dans le simulateur et dans l’onglet Hypotheses (lignes 60 à 64).' },
    { p: 'Ces doses et prix sont des hypothèses de chiffrage, pas une prescription agronomique. Les produits, doses, homologations et conditions locales seront validés par l’équipe agronomique et des devis fournisseurs.' },
    T(['Quantité commercialisée'].concat(Y), [
      row3('Semences en tonnes', 'semences'), row3('NPK en tonnes', 'npk'), row3('Urée en tonnes', 'uree'), row3('Herbicide en litres', 'herb'), row3('Insecticide en litres', 'insect')], [3, 1, 1, 1]),
    { h2: 'Économie ramenée à une tonne de maïs livré' },
    { p: 'Le CA intrants est de {{caSeedT}} FCFA par tonne de maïs livré ({{panier}} × {{couv}} ÷ {{tHa}}). Avec une marge moyenne pondérée de {{margeSeed}} sur coût, la marge brute intrants est de {{mbSeedT}} FCFA/t. Le CA FEED associé est de {{caFeedT}} FCFA/t et la marge brute FEED de {{mbFeedT}} FCFA/t. Le CA combiné atteint {{caT}} FCFA/t et la marge brute {{mbT}} FCFA/t, avant coûts du programme.' },
  ];

  const s6 = [
    { h1: '6 Organisation opérationnelle et qualité' },
    { h2: 'Un cycle contractuel en six étapes' },
    { bullets: ['Qualifier les besoins acheteurs et leurs spécifications.', 'Identifier les producteurs et estimer les volumes mobilisables.', 'Valider les offres intrants et engagements commerciaux.', 'Suivre cultures et prévisions de récolte.', 'Organiser contrôle, pesée, stockage et livraison.', 'Rapprocher factures, paiements et résultats par lot.'] },
    { h2: 'Maîtriser la qualité avant de fixer le prix' },
    { p: 'Chaque acheteur valide une fiche comprenant humidité maximale, impuretés, grains endommagés, risques mycotoxines, conditionnement, méthode d’échantillonnage, laboratoire si nécessaire et règles de rejet ou de décote. Chaque lot est identifié par producteur ou coopérative, lieu de collecte, campagne, poids, résultats de contrôle, entrée et sortie du stockage et destinataire. Une contre-analyse et une procédure de litige sont prévues.' },
    { h2: 'Stockage et transport externalisés au départ' },
    { p: 'Sélectionner des opérateurs avec capacités vérifiables, conditions de conservation, assurance appropriée et tarifs rendus. La fiche transaction désigne le propriétaire du lot, le porteur des risques et le payeur de chaque coût. Le poste variable historique de {{histVarU27}} FCFA/t n’est pas un coût de transport du maïs : il est réaffecté à {{partMkt}} au marketing et à la communication.' },
    { h2: 'Paiement et crédit' },
    { p: 'Aucun crédit intrants ou engagement d’achat automatique n’est présumé. La finance valide limites de crédit, délais, garanties et suspension en cas de retard. Distinguer les créances clients FEED et SEED des paiements du maïs entre vendeur et acheteur. Toute dérogation au portage direct nécessite une nouvelle analyse financière et contractuelle.' },
  ];

  const s7 = [
    { h1: '7 Plateforme IT et marketing' },
    { p: 'L’équipe IT de SOLEVO Côte d’Ivoire fournit la plateforme. Aucune enveloppe de développement externe n’est ajoutée. Cela ne signifie pas que les ressources IT internes, les licences, la maintenance ou l’hébergement ont un coût économique nul ; leur allocation doit être confirmée avec l’IT et la finance.' },
    { p: 'Premier périmètre : profils producteurs et acheteurs, surfaces et prévisions, offres de lots, besoins d’achat, fiches transaction, contrôles qualité, livraisons, échéances et tableau de bord. Recette métier avant déploiement, droits par rôle, historique des modifications, collecte mobile simple et procédure de secours. Aucun paiement intégré n’est requis au démarrage.' },
    { h2: 'Réaffectation budgétaire demandée' },
    T(['Poste historique (M FCFA)'].concat(Y), [
      row3('Frais fixes de plateforme', 'histFixe'), row3('Frais variables (FCFA/t × t de maïs)', 'variables'), row3('Enveloppe recalculée selon le volume', 'hist'),
      row3('{{partMkt}} marketing et communication', 'mkt'), row3('{{partSolde}} solde budgété à affecter', 'solde')], [3, 1, 1, 1]),
    { p: 'Les frais historiques de plateforme du fichier opérationnel sont recalculés selon le volume ({{histFixe27}} M fixes + {{mais27}} t × {{histVarU27}} FCFA), puis réaffectés sans double compte. Le solde de {{partSolde}} reste intégralement budgété par prudence ; son utilisation doit être validée avant engagement. Aucune deuxième enveloppe de développement externe n’est ajoutée.' },
    { h2: 'Plan marketing mesurable' },
    T(['Action 2027', 'M FCFA'], [
      ['Démonstrations et journées terrain', '{{mktA1}}'], ['Rencontres acheteurs et mobilisation commerciale', '{{mktA2}}'], ['Communication ciblée par zone', '{{mktA3}}'],
      ['Supports imprimés et contenus', '{{mktA4}}'], ['Animation coopératives et formation plateforme', '{{mktA5}}'], ['Mesure et ajustements', '{{mktA6}}'], ['Total', '{{mkt27_1}}']], [4, 1]),
    { p: 'Mesurer contacts qualifiés, commandes payées, réachat, coût d’acquisition et marge après coût commercial. Débloquer les dépenses par campagne après validation des devis et des résultats. Les fonctions terrain, qualité et logistique devront être rapprochées du solde de {{solde27_1}} M et des ressources existantes avant validation.' },
  ];

  const s8 = [
    { h1: '8 Gouvernance et pilotage commercial' },
    T(['Fonction', 'Responsabilité', 'Preuve de réalisation'], [
      ['Direction sponsor', 'Arbitrage périmètre et ressources', 'Budget et délégations signés'],
      ['Responsable projet', 'Coordination et suivi des objectifs', 'Tableau mensuel et décisions'],
      ['Équipe FEED', 'Prospection et ventes prémix', 'Commandes et encaissements'],
      ['Équipe SEED', 'Producteurs et intrants', 'Parcelles suivies et ventes'],
      ['Finance et crédit', 'Marge, BFR, risques et recouvrement', 'Situation clients et cash'],
      ['IT SOLEVO-CI', 'Plateforme et support', 'Recette et journal incidents'],
      ['Qualité et logistique', 'Conformité et livraison', 'Résultats qualité et preuves de réception']], [1.4, 2, 2]),
    { h2: 'Entonnoir de prospection' },
    { p: 'Les {{prod27}} producteurs et {{chair27}} fermes chair 2027 sont des équivalents de dimensionnement, pas des clients identifiés. Avec un taux de conversion de 50 % (hypothèse d’organisation), il faut qualifier au moins {{prospects}} producteurs potentiels et {{fermesProsp}} fermes équivalentes. Identifier séparément nouveaux clients, clients existants et ventes supplémentaires : une vente reclassée dans le projet ne crée pas automatiquement de gain additionnel.' },
    { h2: 'Indicateurs prioritaires' },
    { p: 'Tonnes de prémix facturées et encaissées, tonnes de maïs livrées et acceptées, taux de rejet, hectares contractualisés, rendement utilisable, adoption intrants, marge brute par produit, retards de paiement, BFR, coût marketing par commande payée et part des ventes réellement additionnelles.' },
  ];

  const s9 = [
    { h1: '9 Compte de résultat prévisionnel' },
    { p: 'Montants en millions FCFA, hors taxes par convention de modèle. Prix constants ; croissance des volumes seule pour le CA. Les frais historiques sont reclassés sans double compte : {{partMkt}} au marketing et à la communication, {{partSolde}} budgétés avec affectation à valider.' },
    T(['Compte de résultat en M FCFA'].concat(Y), [
      row3('CA FEED', 'caFeed'), row3('CA SEED', 'caSeed'), row3('CA total SOLEVO du programme', 'ca'), row3('Achats marchandises totaux', 'ach'), row3('Marge brute totale', 'mb'),
      row3('Coûts fixes décaissables', 'fixes'), row3('Frais variables (dont {{partMkt}} marketing)', 'variables'), row3('Charges exploitation décaissables', 'charges'),
      row3('Contribution avant risque clients', 'contrib'), row3('Pertes sur créances', 'pertes'), row3('Excédent après risque clients', 'exced'), row3('Amortissements', 'amort'),
      row3('Résultat avant financement et impôt', 'res')], [3, 1, 1, 1]),
    { h2: 'Lecture des marges' },
    { p: '{{txtBaseFeed}} Les intrants sont modélisés avec une marge sur coût de {{margeSeed}}, soit une marge sur CA de {{margeSeedCA}}.' },
    { h2: 'Limites du résultat présenté' },
    { p: 'Une charge de risque clients de {{pertesPct}} du CA est prévue. Les matériels sont amortis sur {{dureeAmort}} ans. Le financement, l’impôt et les effets de TVA ne sont pas chiffrés. Le résultat avant financement et impôt ne doit pas être présenté comme bénéfice net. La somme des résultats atteint {{sumRes}} M FCFA sur trois ans ; elle ne correspond pas à la trésorerie disponible.' },
  ];

  const s10 = [
    { h1: '10 Trésorerie et financement' },
    { p: 'Le BFR est calculé sur 365 jours : créances FEED à {{jCliF}} jours, créances SEED à {{jCliS}} jours, stocks FEED à {{jStF}} jours d’achats, stocks SEED à {{jStS}} jours, fournisseurs à {{jFour}} jours d’achats. Il s’agit de soldes normatifs, non d’un pic mensuel.' },
    T(['Besoins et flux en M FCFA'].concat(Y), [
      row3('Créances FEED normatives', 'crF'), row3('Créances SEED normatives', 'crS'), row3('Stocks FEED normatifs', 'stF'), row3('Stocks SEED normatifs', 'stS'),
      row3('Dettes fournisseurs normatives', 'four'), row3('BFR normatif de fin de période', 'bfr'), row3('Variation du BFR', 'varBfr'), row3('Investissements matériels', 'capex'),
      row3('Excédent après risque clients', 'exced'), row3('Flux avant financement et impôt', 'flux')], [3, 1, 1, 1]),
    { p: '{{txtFlux}} La base suppose l’absence de BFR initial affecté au projet ; toute réutilisation de stocks, lignes fournisseurs ou créances existantes exige un rapprochement.' },
    { h2: 'Enveloppe indicative de ressources' },
    T(['Capacité cible en M FCFA'].concat(Y), [
      row3('BFR majoré pour saisonnalité', 'bfrMaj'), row3('Coussin de trésorerie', 'coussin'), row3('Investissements de l’année', 'capex'), row3('Enveloppe de lancement ou capacité cible', 'env')], [3, 1, 1, 1]),
    { p: 'La capacité cible applique {{coefSais}} fois le BFR normatif puis ajoute le capex de l’année et {{coussinH}} M de coussin. Les {{env27}} M de 2027 sont une enveloppe de prudence, pas une demande de prêt calculée au mois. Les capacités 2028 et 2029 sont brutes et ne s’additionnent pas. Impôts, frais financiers, effets de TVA et dépenses de lancement 2026 nécessitent une analyse complémentaire.' },
  ];

  const s11 = [
    { h1: '11 Rentabilité et résistance du modèle' },
    { h2: 'Seuil de rentabilité du programme' },
    { p: 'Avec la structure de coûts 2027, le seuil ressort à {{seuil27}} tonnes de prémix, sous réserve que les ventes d’intrants suivent proportionnellement et que prix, marges et coûts unitaires restent constants. Le calcul exclut financement et impôt.' },
    { h2: 'Mesurer le gain réellement créé pour SOLEVO' },
    { p: 'Pour établir le gain additionnel, soustraire les marges qui auraient déjà été réalisées sans projet et ne retenir que les coûts véritablement nouveaux. À coûts du programme maintenus, il faut qu’environ {{fracAdd27}} de la marge brute 2027 soit réellement additionnelle pour couvrir charges, risque clients et amortissements.' },
    T(['Variation isolée en 2027', 'Effet indicatif'], [
      ['Prix FEED −5 %, coût d’achat inchangé', 'CA −{{sensPrixCA}} M ; résultat −{{sensPrix}} M après réduction de la charge clients.'],
      ['Couverture intrants 60 % au lieu de {{couv}}', 'CA SEED −{{sensCouvCA}} M ; résultat −{{sensCouv}} M, charges fixes maintenues.'],
      ['Rendement brut 3 t/ha au lieu de {{rdt}}', 'Surfaces portées à environ {{sensRdtHa}} ha.'],
      ['Délai clients SEED +30 jours', 'BFR supplémentaire d’environ {{sensDelai}} M.'],
      ['Risque clients 3 % au lieu de {{pertesPct}}', 'Résultat −{{sensRisk}} M.']], [2, 3]),
    { p: 'Ces tests sont des variations isolées, non un scénario combiné.', style: 'note' },
  ];

  const s12 = [
    { h1: '12 Risques et feuille de route' },
    T(['Risque', 'Mesure concrète', 'Responsable proposé'], [
      ['Récolte insuffisante ou lots non conformes', 'Réserve de surfaces, sources alternatives, contrôles avant expédition.', 'SEED et qualité'],
      ['Prix ou transport défavorable', 'Prix rendus comparables, devis par corridor, validation avant commande.', 'Commerce et logistique'],
      ['Défaut de paiement', 'Limites de crédit, acomptes si négociés, relance et suspension.', 'Finance'],
      ['Faible adoption intrants', 'Tests de packs, démonstrations et suivi des commandes payées.', 'SEED et marketing'],
      ['Double compte des gains', 'Rapprochement historique clients ; séparation maïs, intrants, prémix.', 'Contrôle de gestion'],
      ['Retard IT ou données inexactes', 'Recette, responsable de données et registre de secours.', 'IT et métier']], [1.6, 2.6, 1.2]),
    { h2: 'Calendrier de mise en œuvre' },
    T(['Période', 'Livrable prioritaire', 'Critère de passage'], [
      ['13–19 nov. 2026', 'Validation CODIR, supports SELAB, équipe nommée.', 'Messages approuvés.'],
      ['20–22 nov. 2026', 'Lancement au SELAB SHOW, Parc des sports d’Abidjan.', 'Contacts qualifiés et rendez-vous.'],
      ['T1 2027', 'Budget signé, recette IT, prospects qualifiés, calendrier par zone.', '{{preQual}} t de besoins préqualifiés.'],
      ['T2–T3 2027', 'Surfaces et packs contractualisés ; collecte et livraisons pilotes.', 'Qualité acceptée et paiements documentés.'],
      ['T4 2027', 'Bilan campagne, marge et trésorerie ; décision 2028.', 'Écarts expliqués et ressources approuvées.'],
      ['2028', 'Déploiement vers {{premix28}} t de prémix.', 'Qualité et recouvrement maîtrisés.'],
      ['2029', 'Déploiement vers {{premix29}} t et consolidation nationale.', 'Capacité logistique et financière confirmée.']], [1.1, 2.6, 1.8]),
  ];

  const s13 = [
    { h1: '13 Hypothèses à valider et utilisation des fichiers' },
    T(['Donnée ou décision', 'Validation attendue'], [
      ['Objectifs annuels et base de marge', 'Direction et finance : {{premix27}} t en 2027, croissance {{croiss28}} / {{croiss29}}, sens du taux de {{margeFeed}}.'],
      ['Prix et marges intrants', 'Tarifs SOLEVO, références produits et coûts d’achat rendus (panier {{panier}} FCFA/ha).'],
      ['Rendements et surfaces', 'SEED : {{rdt}} t/ha, {{util}} utilisable, {{aff}} affecté, {{couv}} de couverture, {{surf}} ha par producteur.'],
      ['Plateforme IT et marketing', 'IT et finance : enveloppe {{hist27}} M dont {{mkt27}} M au marketing ; solde {{solde27}} M à affecter ; coûts internes à confirmer.'],
      ['BFR et financement', 'Délais réels, taxes, banque, lignes et calendrier mensuel.'],
      ['Gain additionnel', 'Historique ventes et marges des clients participants.'],
      ['Contrats et données', 'Revue juridique et procédures internes avant signature.']], [1.6, 3.4]),
    { h2: 'Utilisation du modèle Excel' },
    { p: 'Hypotheses contient les cellules bleues modifiables : B5 pour l’objectif prémix 2027, C52 et D52 pour la croissance 2028 et 2029. Previsions calcule volumes, intrants et résultat ; Tresorerie le BFR et les ressources ; Suivi sert à saisir les réalisations ; Gains acteurs reçoit en B3 le prix bord champ de référence P ; Controles vérifie la cohérence ({{ctrl27}} contrôles OK en 2027). Les documents Word, PDF et PowerPoint sont des synthèses figées à régénérer après modification.' },
    { h2: 'Sources et méthode' },
    { bullets: ['[1] FIRCA, Filière maïs, https://firca.ci/filieres-agricoles/mais/ — source de contexte national.', '[2] Gouvernement de Côte d’Ivoire, Bilan 2011–2025 — production de maïs 2024.', '[3] Données du porteur : conversion prémix, prix du sac, taux de marge, incorporation du maïs, partage de valeur, fourniture IT, budget IT et marketing. Autres paramètres : hypothèses de planification à confirmer.'] },
  ];

  const s14_17 = [
    { h1: '14 Termes de référence du lancement au SELAB' },
    { p: SELAB + ' Les dates et le lieu proviennent du porteur du projet. Le lancement présente le dispositif et ouvre la mobilisation pour 2027. Il ne présume ni recette IT terminée ni contrats, financements ou signatures déjà acquis.' },
    T(['Période', 'Activités proposées', 'Livrables'], [
      ['13–19 novembre', 'Validation CODIR, supports, équipe et formulaire', 'Messages approuvés et permanences nominatives'],
      ['20 novembre', 'Présentation du projet et accueil des prospects', 'Fiches acteurs et demandes identifiées'],
      ['21 novembre', 'Entretiens FEED et SEED et démonstrations', 'Besoins et offres qualifiés, rendez-vous'],
      ['22 novembre', 'Synthèse et programmation des relances', 'Liste des contacts et responsables'],
      ['23–30 novembre', 'Qualification et suivi commercial', 'Plan de rendez-vous et propositions personnalisées']], [1.2, 2.2, 2.2]),
    { p: 'Indicateurs : contacts uniques par segment, besoins mensuels de maïs, surfaces déclarées et rendez-vous tenus. Les dépenses du salon engagées en 2026 relèvent d’un budget préalable distinct.' },
    { h1: '15 Cahier opérationnel de la plateforme IT' },
    T(['Module', 'Champs ou preuve attendue'], [
      ['Acteurs', 'Identifiant unique, type, représentant, contacts et autorisations'], ['Producteurs', 'Parcelles, surface, campagne, prévisions et visites'],
      ['Acheteurs', 'Besoins mensuels, spécifications, lieu et paiement'], ['Lots', 'Propriétaire, site, poids, qualité, statut, réservations et disponibilité'],
      ['Transactions', 'Vendeur, acheteur, prix, taxes, frais, livraison et signatures'], ['Suivi', 'Réception, écarts, factures, échéances et incidents']], [1.3, 4]),
    { p: 'Recette métier : tester un dossier producteur, une demande acheteur, une réservation et sa clôture ; vérifier qu’un lot réservé ne peut être engagé deux fois et que les modifications laissent une trace. Le métier approuve les données ; l’IT gère accès, sécurité, sauvegarde et support.' },
    { h1: '16 Fiches terrain et maîtrise des lots' },
    T(['Fiche', 'Données minimales'], [
      ['Producteur ou coopérative', 'Nom légal, mandat, sites, surfaces, campagne, débouchés'], ['Acheteur', 'Activité, espèces, volumes par mois, qualité attendue et livraison'],
      ['Lot', 'Code unique, origine, propriétaire, poids net, stockage, résultats et statut'], ['Transaction', 'Signataires, prix ou règle de fixation, quantité, coûts, taxes et échéances'],
      ['Réception', 'Date, poids brut, tare, poids net, réserves et acceptation'], ['Incident', 'Lot, faits, preuves, action conservatoire, décision et responsable']], [1.6, 3.6]),
    { p: 'Disponible à la vente = stock vérifié conforme moins quantités réservées, bloquées ou déjà vendues. Ne pas confondre prévision de récolte et stock physique. Les semences traitées restent séparées du maïs destiné à l’alimentation.' },
    { h1: '17 Contrôle de gestion et décisions de déploiement' },
    T(['Rythme', 'Examen', 'Décision'], [
      ['Hebdomadaire en campagne', 'Prévisions, lots, livraisons et incidents', 'Réaffectation des moyens'],
      ['Mensuel', 'Ventes, marges, marketing, impayés et BFR', 'Dépenses autorisées et limites de crédit'],
      ['Trimestriel', 'Rentabilité des corridors et ventes additionnelles', 'Maintien, ouverture ou suspension'],
      ['Fin de campagne', 'Résultats et écarts documentés', 'Validation ou révision de la cible suivante']], [1.4, 2.4, 2]),
    { h2: 'Cohérence documentaire' },
    { p: 'Le présent dossier, le business plan, les modèles Excel et les présentations sont générés à partir du même scénario : {{scenario}}. Référence 2027 : {{premix27}} t de prémix, {{mais27}} t de maïs, {{haTerrain27}} ha minimum, {{prod27}} producteurs, {{ca27}} M (≈ {{ca27E}}) de CA et {{res27}} M (≈ {{res27E}}) de résultat avant financement et impôt. Les gains de maïs des partenaires restent séparés du revenu SOLEVO.' },
  ];

  const bpBody = [].concat(s1, s2, s3, s4, sObj, s5, s6, s7, s8, s9, s10, s11, s12, s13);

  const docs = [
    { id: 'pn', folder: '06_Dossier_et_notes', file: 'SISSE_KABA_Projet_National_Complet', title: 'Dossier national et business plan 2027 à 2029', subtitle: 'SISSÊ~KABA • Une initiative SOLEVO Côte d’Ivoire', header: 'PROJET NATIONAL 2027–2029', blocks: [].concat(decision, bpBody, s14_17) },
    { id: 'bp', folder: '03_Business_plan_et_modeles', file: 'SISSE_KABA_Business_Plan_2027_2029', title: 'Business plan national 2027 à 2029', subtitle: 'SISSÊ~KABA • Une initiative SOLEVO Côte d’Ivoire', header: 'PLAN 2027–2029', blocks: [].concat(decision, bpBody) },
    { id: 'ne', folder: '06_Dossier_et_notes', file: 'SISSE_KABA_Note_Explicative', title: 'Note explicative des objectifs et des calculs', subtitle: 'SISSÊ~KABA • SOLEVO Côte d’Ivoire', header: 'NOTE EXPLICATIVE', blocks: [
      { p: SELAB }, { p: 'Scénario : {{scenario}}.', style: 'accent' },
      { h2: 'Du prémix au besoin en maïs' },
      { p: 'Nombre de sacs = tonnes de prémix × 1 000 ÷ {{sacKg}}. Aliment fini = sacs de chaque gamme × 20 kg ÷ taux d’incorporation (chair {{inclChair}}, pondeuse {{inclPonte}}, porcin {{inclPorc}}), soit {{alimSacMoy}} t par sac en moyenne. Maïs à livrer = aliment fini × {{txMais}}. Pour {{premix27}} t de prémix : {{sacs27}} sacs, {{aliment27}} t d’aliment et {{mais27}} t de maïs. Prix moyen pondéré du sac : {{prixSac}} FCFA (prémix chair {{prixChair}} FCFA, pondeuse {{prixPonte}} FCFA, porcin {{prixPorc}} FCFA ; mix {{partChair27}} / {{partPonte27}} / {{partPorc27}}), soit {{caFeed27}} M (≈ {{caFeed27E}}) FCFA (≈ {{caFeed27E}}) de CA FEED.' },
      { h2: 'Prix et marges du prémix : chair, pondeuse et porcin' },
      T(['Prémix', 'Part des sacs', 'Incorporation', 'Prix du sac 2027', 'Marge ({{baseFeed}})', 'Taux de marque', 'Gain / sac', 'CA 2027 (M FCFA)', 'Marge brute 2027 (M FCFA)'], [
      ['Chair', '{{partChair27}}', '{{inclChair}}', '{{prixChair}}', '{{mChair}}', '{{marqueChair}}', '{{gainSacChair}}', '{{caChair27}} (≈ {{caChair27E}})', '{{mbChair27}} (≈ {{mbChair27E}})'],
      ['Pondeuse', '{{partPonte27}}', '{{inclPonte}}', '{{prixPonte}}', '{{mPonte}}', '{{marquePonte}}', '{{gainSacPonte}}', '{{caPonte27}} (≈ {{caPonte27E}})', '{{mbPonte27}} (≈ {{mbPonte27E}})'],
      ['Porcin', '{{partPorc27}}', '{{inclPorc}}', '{{prixPorc}}', '{{mPorc}}', '{{marquePorc}}', '{{gainSacPorc}}', '{{caPorc27}} (≈ {{caPorc27E}})', '{{mbPorc27}} (≈ {{mbPorc27E}})'],
      ['Moyenne pondérée', '100 %', '', '{{prixSac}}', '{{margeFeedP}}', '{{marqueFeed}}', '', '{{caFeed27}} (≈ {{caFeed27E}})', '{{mbFeed27}} (≈ {{mbFeed27E}})']], [1.3, 0.8, 0.9, 0.9, 1, 0.9, 0.8, 1, 1.1]),
    T(['Prix du sac (FCFA)', '2027', '2028', '2029'], [
      ['Prémix chair', '{{prixChair27}}', '{{prixChair28}}', '{{prixChair29}}'], ['Prémix pondeuse', '{{prixPonte27}}', '{{prixPonte28}}', '{{prixPonte29}}'],
      ['Prémix porcin', '{{prixPorc27}}', '{{prixPorc28}}', '{{prixPorc29}}'], ['Prix moyen pondéré', '{{prixSac27}}', '{{prixSac28}}', '{{prixSac29}}']], [2, 1, 1, 1]),
    { p: 'Le prix moyen du sac, la marge FEED et l’aliment produit par sac sont calculés à partir des prix, des taux de marge et des taux d’incorporation propres aux prémix chair, pondeuse et porcin, pondérés par le mix des ventes de prémix ({{partChair27}} chair, {{partPonte27}} pondeuse, {{partPorc27}} porcin). Les prix 2028 et 2029 suivent la hausse annuelle retenue ({{hausse28}} puis {{hausse29}}). Le CA, la marge brute et l’aliment FEED sont la somme exacte des trois gammes (contrôles Previsions lignes 84 et 91). Repères du fichier des dépôts 2026 : prix réalisés de 29 062 FCFA (chair), 25 080 FCFA (pondeuse) et 28 486 FCFA (porcin) le sac, marges réalisées de 28,7 %, 30,6 % et 28,9 % sur coût. Prix et taux à valider avec la direction FEED ; ils se modifient dans le simulateur et dans l’onglet Hypotheses (lignes 59 et 65 à 77).' },
      { p: 'Trajectoire : {{premix27}} t en 2027, {{premix28}} t en 2028 et {{premix29}} t en 2029 ({{txtCroissance}}).' },
      { h2: 'Des besoins aux producteurs' },
      { p: 'Hectares = tonnes de maïs ÷ ({{rdt}} t/ha × {{util}} utilisable × {{aff}} affecté au programme). Pour 2027 : {{ha27}} ha calculés, soit au moins {{haTerrain27}} ha terrain et {{prod27}} producteurs de {{surf}} ha arrondis au supérieur. Hectares couverts commercialement = hectares × {{couv}}, soit {{haPanier227}} ha de panier intrants.' },
      { h2: 'Des tonnes d’aliment aux élevages et au marché' },
      { p: 'Portefeuille mixte : aliment chair = sacs × {{partChair27}} × 20 kg ÷ {{inclChair}} = {{alimChair27}} t ; cheptel chair = aliment chair × 1 000 ÷ ({{kgPoulet}} kg × {{cycles}} cycles) = {{placesMix27}} places, soit {{chairMix27}} élevages de {{placesFerme}} places. Aliment pondeuses = sacs × {{partPonte27}} × 20 kg ÷ {{inclPonte}} = {{alimPonte27}} t ; pondeuses = aliment × 1 000 ÷ ({{pondJour}} g × 365 jours) = {{pondMix27}}, soit {{ponteMix27}} élevages de {{pondFerme}} têtes. Aliment porcs = sacs × {{partPorc27}} × 20 kg ÷ {{inclPorc}} = {{alimPorc27}} t ; porcs = aliment × 1 000 ÷ {{kgPorc}} kg = {{porcs27}}, soit {{porcMix27}} élevages de {{porcsFerme}} porcs par an. Total : {{eleveursMix27}} éleveurs.' },
      { p: 'Part de marché prémix = prémix du programme ÷ marché national ({{premix27}} ÷ {{mPremix27}} t = {{pdmP27}}). Part de marché aliment fini = aliment associé ÷ marché national ({{aliment27}} ÷ {{mAliment27}} t = {{pdmA27}}). Part totale prémix = (programme + ventes actuelles hors programme de {{ventesExist27}} t) ÷ marché = {{pdmPTot27}}. Valeurs de marché confirmées par le porteur le 13/11/2026, évolutives et à actualiser à chaque revue.' },
      { h2: 'Panier de chiffrage et marge' },
      { p: 'Panier par hectare : semences {{doseSem}} kg à {{prixSem}} FCFA ; NPK {{doseNpk}} kg à {{prixNpk}} FCFA ; urée {{doseUree}} kg à {{prixUree}} FCFA ; herbicide {{doseHerb}} L à {{prixHerb}} FCFA ; insecticide {{doseIns}} L à {{prixIns}} FCFA. Total {{panier}} FCFA/ha. Doses et tarifs simulés, à valider.' },
      { p: 'CA SEED = {{haPanier227}} × {{panier}} = {{caSeed27}} M (≈ {{caSeed27E}}) FCFA (≈ {{caSeed27E}}). Chaque intrant a son taux de marge sur coût (semences {{mSem}}, NPK {{mNpk}}, urée {{mUree}}, herbicide {{mHerb}}, insecticide {{mIns}}) : achats = somme des CA par intrant ÷ (1 + taux) ; marge SEED = {{mbSeed27}} M (≈ {{mbSeed27E}}), soit {{mbHa}} FCFA par hectare et une marge moyenne pondérée de {{margeSeed}}. {{txtBaseFeed}} Total marge brute = {{mb27}} M (≈ {{mb27E}}) FCFA (≈ {{mb27E}}).' },
      { h2: 'Coûts, résultat et suivi dans Excel' },
      { p: 'Charges d’exploitation = {{histFixe27}} M fixes + {{mais27}} t × {{histVarU27}} FCFA = {{charges27}} M. Marketing et communication = {{partMkt}} × {{hist27}} M = {{mkt27}} M. Le solde de {{solde27}} M reste budgété avec affectation à valider. Aucune enveloppe IT externe distincte n’est ajoutée.' },
      { p: 'Résultat avant financement et impôt = marge brute {{mb27}} − charges {{charges27}} − risque clients {{pertes27}} − amortissements {{amort27}} = {{res27}} M (≈ {{res27E}}) FCFA (≈ {{res27E}}). Le risque clients correspond à {{pertesPct}} du CA de {{ca27}} M (≈ {{ca27E}}). BFR normatif 2027 : {{bfr27}} M ; enveloppe indicative de ressources : {{env27}} M.' },
      T(['Valeurs par tonne de maïs livré', 'FCFA par tonne'], [['CA FEED', '{{caFeedT}}'], ['CA SEED', '{{caSeedT}}'], ['Marge brute FEED', '{{mbFeedT}}'], ['Marge brute SEED', '{{mbSeedT}}'], ['CA combiné', '{{caT}}'], ['Marge brute combinée', '{{mbT}}']], [3, 1.4]),
      { h2: 'Mode opératoire' },
      { p: 'Dans Hypotheses, modifier le prémix en B5 pour 2027 et la croissance en C52 (2028) et D52 (2029). Les volumes, ventes, marges et besoins de trésorerie se recalculent. Suivi reçoit le réalisé ; Gains acteurs reçoit le prix bord champ de référence P en B3 ; Controles vérifie la cohérence des formules.' },
      { p: 'Partage du prix du maïs (P = prix bord champ) : producteur 115 % de P au lieu de 100 % (+15 %), éleveur 135 % de P au lieu de 160 % (−15,6 %), transport 15 % et entrepôt 5 % inchangés, majoration intermédiaire de 40 % supprimée. Aucun montant de maïs n’est ajouté au CA SOLEVO.' },
    ] },
    { id: 'ns', folder: '06_Dossier_et_notes', file: 'SISSE_KABA_Note_Synthese', title: 'Note de synthèse du projet SISSÊ~KABA', subtitle: 'SISSÊ~KABA • SOLEVO Côte d’Ivoire', header: 'NOTE DE SYNTHÈSE', blocks: [
      { p: SELAB }, { p: 'Scénario : {{scenario}}.', style: 'accent' },
      { h2: 'Décision et objectifs' },
      { p: 'Le dispositif relie les portefeuilles FEED et SEED pour organiser les besoins de maïs, les surfaces et les ventes d’intrants. La direction est invitée à confirmer le sponsor, le responsable projet, les objectifs, le budget et les ressources de trésorerie.' },
      T(['Objectif'].concat(Y), [row3('Prémix en t', 'premix'), row3('Maïs en t', 'mais'), row3('Surface minimum en ha', 'haTerrain'), row3('Producteurs de {{surf}} ha', 'prod'), row3('Élevages chair de {{placesFerme}} places', 'chair'), row3('CA du programme en M FCFA', 'ca'), row3('Résultat avant financement et impôt en M', 'res')], [3, 1, 1, 1]),
      { p: 'Hypothèses : rendement {{rdt}} t/ha, utilisable {{util}}, affectation {{aff}}, couverture intrants {{couv}}. Les {{chair27}} élevages chair sont un équivalent alternatif aux {{ponte27}} élevages de {{pondFerme}} pondeuses.' },
      { h2: 'Objectifs techniques et part de marché' },
      T(['Objectif technique'].concat(Y), [row3('Hectares à mobiliser', 'haTerrain'), row3('Maïs à livrer (t)', 'mais'), row3('Producteurs de {{surf}} ha', 'prod'), row3('Aliment fini produit (t)', 'aliment'),
        row3('Cheptel chair à nourrir ({{partChair27}} des sacs)', 'placesMix'), row3('Éleveurs de chair ({{placesFerme}} places)', 'chairMix'), row3('Pondeuses à nourrir ({{partPonte27}} des sacs)', 'pondMix'), row3('Éleveurs de pondeuses ({{pondFerme}} têtes)', 'ponteMix'), row3('Porcs nourris par an ({{partPorc27}} des sacs)', 'porcs'), row3('Éleveurs de porcs ({{porcsFerme}} porcs/an)', 'porcMix'), row3('Total des éleveurs', 'eleveursMix'),
        row3('Part de marché prémix du programme (marché {{mPremix27}} t)', 'pdmP'), row3('Part de marché totale SOLEVO — prémix', 'pdmPTot'), row3('Part de marché aliment fini (marché {{mAliment27}} t)', 'pdmA')], [3, 1, 1, 1]),
      { h2: 'Plateforme, budget et mobilisation' },
      { p: 'La plateforme provient de l’IT SOLEVO-CI. Les frais historiques recalculés totalisent {{hist27}} M FCFA en 2027 ({{histFixe27}} M fixes et {{variables27}} M variables). Le reclassement de {{partMkt}} donne {{mkt27}} M de marketing et communication ({{mkt28}} M en 2028, {{mkt29}} M en 2029). Le solde de {{solde27}} M reste budgété avec affectation à valider.' },
      T(['Indicateur financier 2027', 'M FCFA'], [['Marge brute FEED et SEED', '{{mb27}} (≈ {{mb27E}})'], ['Charges exploitation décaissables', '{{charges27}}'], ['Risque clients', '{{pertes27}}'], ['Amortissements', '{{amort27}}'], ['Résultat avant financement et impôt', '{{res27}} (≈ {{res27E}})'], ['BFR normatif', '{{bfr27}}'], ['Enveloppe indicative de lancement', '{{env27}}']], [3, 1.4]),
      { p: 'Distinguer résultat, BFR et trésorerie : les capacités annuelles ne sont pas des besoins nouveaux à additionner. Financement, impôt, TVA et dépenses 2026 restent à chiffrer. Le résultat du programme ne démontre pas un gain additionnel sans historique du portefeuille.' },
      { h2: 'Suite du SELAB' },
      { p: 'Avant le 20 novembre : messages et équipe validés. Pendant les trois jours : présenter FEED et SEED, enregistrer les acteurs et prendre des rendez-vous. Du 23 au 30 novembre : dédoublonner les contacts, qualifier les besoins et nommer les responsables de relance. En 2027 : engager les campagnes réellement contractualisées.' },
    ] },
    { id: 'pc', folder: '05_Canvas_et_canevas', file: 'SISSE_KABA_Plan_Canevas', title: 'Plan canevas de réalisation du projet', subtitle: 'SISSÊ~KABA • SOLEVO Côte d’Ivoire', header: 'PLAN CANEVAS', blocks: [
      { p: SELAB }, { p: 'Scénario : {{scenario}}.', style: 'accent' },
      { h2: 'Finalité et périmètre' },
      { p: 'Programme national maïs, intrants et nutrition animale porté par FEED et SEED. Lancement en novembre 2026, déploiement économique de janvier 2027 à décembre 2029. Transactions directes de maïs, sans portage automatique des stocks ou du financement par SOLEVO.' },
      T(['Lot de travail', 'Livrable', 'Responsable proposé'], [
        ['Cadrage CODIR', 'Budget, rôles, délégations et objectifs', 'Direction et finance'], ['Lancement SELAB', 'Supports et registre de contacts', 'Marketing, FEED et SEED'],
        ['Plateforme', 'Recette, droits et traçabilité', 'IT et responsable métier'], ['Production', 'Surfaces et plans de campagne', 'SEED et coopératives'],
        ['Marché et lots', 'Commandes et lots contrôlés', 'FEED, qualité et logistique'], ['Paiement et pilotage', 'Encaissements et tableau mensuel', 'Finance et responsable projet']], [1.4, 2.2, 1.8]),
      { h2: 'Jalons et validation' },
      T(['Jalon', 'Critère vérifiable'], [
        ['Avant le salon', 'Message validé, équipe nommée, formulaire et supports disponibles'], ['Fin novembre 2026', 'Contacts uniques, responsables et rendez-vous de suivi'],
        ['T1 2027', 'Demande préqualifiée de {{preQual}} t et budget mensuel approuvé'], ['Avant chaque collecte', 'Lots, qualité, prix et paiement contractualisés'],
        ['Fin 2027', 'Bilan {{premix27}} t de prémix, {{mais27}} t de maïs et résultats réels'], ['2028 et 2029', 'Extension conditionnelle vers {{premix28}} t puis {{premix29}} t de prémix']], [1.5, 3.5]),
      { h2: 'Ressources et budget de travail' },
      { p: '2027 : {{charges27}} M FCFA de charges décaissables, dont marketing et communication {{mkt27}} M et solde à affecter {{solde27}} M. Plateforme fournie par l’IT SOLEVO-CI. Capex matériels {{capex27}} M, BFR normatif {{bfr27}} M, enveloppe indicative de lancement {{env27}} M.' },
      { h2: 'Tableau de bord et arbitrages' },
      { p: 'Revue mensuelle des ventes, marges, lots acceptés, impayés, BFR et dépenses marketing. Revue trimestrielle du déploiement territorial. Suspendre un engagement sans qualité conforme, acheteur qualifié ou ressources autorisées.' },
    ] },
    { id: 'bmc', folder: '05_Canvas_et_canevas', file: 'SISSE_KABA_Business_Model_Canvas', title: 'Business Model Canvas de SISSÊ~KABA', subtitle: 'SISSÊ~KABA • SOLEVO Côte d’Ivoire', header: 'BUSINESS MODEL CANVAS', landscape: true, canvas: {
      partners: ['Producteurs, coopératives, éleveurs et industriels du réseau.', 'Fournisseurs de prémix et d’intrants agricoles.', 'Stockeurs, transporteurs et laboratoires de contrôle.', 'Organismes d’appui, financeurs et assureurs à mobiliser.'],
      activities: ['Qualifier la demande FEED et les besoins en maïs.', 'Accompagner la production et commercialiser les intrants.', 'Vérifier les lots et rapprocher offre et demande.', 'Coordonner contrats, livraisons et règlements.'],
      resources: ['Équipes FEED et SEED et leurs portefeuilles clients.', 'Prémix et intrants disponibles.', 'Plateforme IT SOLEVO-CI : parcelles, lots, besoins.', 'Contrôle qualité, logistique et trésorerie.'],
      value: ['Producteurs : débouchés organisés, intrants adaptés, accompagnement.', 'Éleveurs et moulins : lots identifiés, approvisionnement planifié, offre prémix.', 'Prix en % du prix bord champ P : producteur 100 → 115 ; éleveur 160 → 135.', '+15 % pour le producteur ; −15,6 % sur le maïs pour l’éleveur ; majoration intermédiaire de 40 % supprimée.'],
      relations: ['Référent technique et commercial.', 'Contrats cadres et fiches de transaction.', 'Information sur lots, prix et livraisons.', 'Suivi des engagements et paiements.'],
      channels: ['Équipes terrain FEED et SEED.', 'Réseau commercial SOLEVO-CI.', 'Plateforme fournie par l’IT SOLEVO-CI.', 'Lancement SELAB SHOW 20–22 nov. 2026.'],
      segments: ['Éleveurs et fabricants d’aliments à la ferme.', 'Fabricants industriels (prospects, sans engagement).', 'Producteurs et coopératives de maïs.', 'Cible 2027 : {{prod27}} producteurs de {{surf}} ha et {{chair27}} élevages chair équivalents.'],
      costs: ['Charges 2027 : {{charges27}} M FCFA, dont {{mkt27_1}} M marketing et {{solde27_1}} M à affecter.', 'Aucun développement externe ajouté.', 'Risque clients {{pertes27}} M ; amortissements {{amort27}} M.', 'BFR normatif {{bfr27}} M ; enveloppe indicative {{env27}} M.'],
      revenues: ['FEED 2027 : {{premix27}} t, {{sacs27}} sacs à {{prixSac}} FCFA, CA {{caFeed27}} M (≈ {{caFeed27E}}).', 'SEED 2027 : intrants, CA {{caSeed27}} M (≈ {{caSeed27E}}).', 'CA total {{ca27}} M (≈ {{ca27E}}) ; marge brute {{mb27}} M (≈ {{mb27E}}) ; résultat avant financement et impôt {{res27}} M (≈ {{res27E}}).', 'Aucun CA de maïs ou d’aliment fini ajouté.'],
      footer: 'Scénario : {{scenario}}. Hypothèses : {{rdt}} t/ha, utilisable {{util}}, affectation {{aff}}, couverture intrants {{couv}}. Chiffres simulés à valider ; gains partenaires conditionnels et séparés des revenus SOLEVO.',
    } },
  ];

  root.SKDOC = { docs };
})(typeof window !== 'undefined' ? window : globalThis);
