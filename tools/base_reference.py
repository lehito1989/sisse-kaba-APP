#!/usr/bin/env python3
"""SISSÊ~KABA – sauvegarde de secours dans le cloud.
Construit l'Excel « Base de référence » (tables T_, A_valider, R_) et le récapitulatif des prix
des éleveurs qui fabriquent leur aliment, à partir des fiches de la base de l'artefact.
Usage : python3 base_reference.py prospects.json --out DOSSIER [--jours 7]
prospects.json : liste JSON des fiches (champ « data » de chaque document, ou fiches directes)."""
import json, re, sys, os, argparse, datetime, unicodedata, statistics
from openpyxl import Workbook
from openpyxl.styles import Font, PatternFill, Alignment

HERE = os.path.dirname(os.path.abspath(__file__))
APP = open(os.path.join(HERE, '..', 'app.js'), encoding='utf8').read()

def js_array(name):
    m = re.search(r'var ' + name + r' = (\[.*?\]);', APP, re.S)
    t = m.group(1).replace("'", '"')
    return json.loads(t)

GEO = js_array('GEO_CI')
DEP = js_array('DEPOTS_GEO')
VEILLE = [['mais', 'Maïs', 'FCFA/kg'], ['soja', 'Soja (tourteau)', 'FCFA/kg'], ['son', 'Son de blé', 'FCFA/kg'], ['coq', 'Coquillage', 'FCFA/kg'], ['huile', 'Huile rouge', 'FCFA/litre'], ['pxChair', 'Prémix chair', 'FCFA/sac'], ['pxPonte', 'Prémix ponte', 'FCFA/sac'], ['pxPorc', 'CMV Porc MG2MIX', 'FCFA/sac'], ['plaq', 'Plaquette de 30 œufs (vente)', 'FCFA/plaquette'], ['poulet', 'Poulet de chair (vente)', 'FCFA/poulet'], ['porcVif', 'Porc vif (vente)', 'FCFA/kg vif']]

def key(x):
    x = unicodedata.normalize('NFD', str(x or '').lower()); x = ''.join(c for c in x if unicodedata.category(c) != 'Mn')
    return re.sub(r'[^a-z0-9]+', ' ', x.replace('’', ' ').replace("'", ' ')).strip()

def geo(loc):
    k = key(loc)
    if not k: return None
    for i, g in enumerate(GEO):
        if key(g[0]) == k: return i, g
    best = None
    for i, g in enumerate(GEO):
        gk = key(g[0])
        if (' ' + gk + ' ') in (' ' + k + ' ') and (not best or len(gk) > len(key(best[1][0]))): best = (i, g)
    return best

def waNum(t):
    d = re.sub(r'\D', '', str(t or ''))
    if d.startswith('00'): d = d[2:]
    if len(d) == 10: d = '225' + d
    return d

is_elev = lambda r: bool(re.search(r'leveur|Fabricant', r.get('profil') or r.get('public') or ''))
is_prod = lambda r: bool(re.search(r'[Pp]roducteur', r.get('profil') or r.get('public') or ''))
val_of = lambda r: r.get('valid') or 'À valider'
num = lambda x: float(x) if isinstance(x, (int, float)) else (float(str(x).replace(',', '.')) if re.match(r'^\s*\d+([.,]\d+)?\s*$', str(x or '')) else 0.0)

def checks(r, L):
    pb = []
    if not (r.get('profil') or r.get('public')): pb.append('Profil manquant')
    if len(str(r.get('nom') or '').strip()) < 3: pb.append('Nom incomplet')
    if not re.match(r'^225\d{10}$', waNum(r.get('tel'))): pb.append('Téléphone à vérifier')
    if not r.get('localite'): pb.append('Localité manquante')
    elif not geo(r.get('localite')): pb.append('Localité hors référentiel')
    t = waNum(r.get('tel'))
    if t and any(x is not r and waNum(x.get('tel')) == t for x in L): pb.append('Doublon possible')
    if r.get('maisCtrl') == 'À vérifier': pb.append('Besoin maïs incohérent')
    if not r.get('consent'): pb.append('Consentement non coché')
    return pb

HEAD = ['ID', 'Date', 'Code profil', 'Profil', 'Nom', 'Téléphone', 'E-mail', 'Code localité', 'Localité', 'Région', 'Code dépôt conseillé', 'Dépôt conseillé', 'Distance dépôt (km)', 'Poulets de chair', 'Pondeuses', 'Porcs / an', 'Aliment / an (t)', 'Maïs déclaré / an (t)', 'Classe maïs', 'Surface maïs (ha)', 'Maïs produit / an (t)', 'Coopérative', 'ATE', 'Statut suivi', 'Inscrit au projet', 'Validation', 'Validé le', 'Validé par', 'Source', 'Consentement']
dep_code = lambda n: next(('DEP%02d' % (i + 1) for i, d in enumerate(DEP) if d[0] == n), '')

def row(r):
    g = geo(r.get('localite'))
    code = 'LOC%03d' % (g[0] + 1) if g else ''
    prof = 'EP' if is_elev(r) and is_prod(r) else 'PR' if is_prod(r) else 'EL' if is_elev(r) else 'AU'
    t = waNum(r.get('tel'))
    return [r.get('id'), r.get('date'), prof, r.get('public') or r.get('profil') or '', r.get('nom') or '', '+' + t if t else '', r.get('email') or '', code, g[1][0] if g else (r.get('localite') or ''), r.get('region') or (g[1][1] if g else ''),
            dep_code(r.get('depotConseil')), r.get('depotConseil') or '', r.get('depotKm', ''), num(r.get('chair')), num(r.get('pondeuse')), num(r.get('porc')), round(num(r.get('alimAn') or r.get('aliment')), 1), round(num(r.get('maisDecl') or r.get('mais')), 1),
            r.get('maisClasse') or '', num(r.get('surface')), round(num(r.get('maisP')), 1), r.get('coop') or r.get('org') or '', r.get('ate') or '', r.get('statut') or '', r.get('inscription') or '', val_of(r), r.get('validLe') or '', r.get('validPar') or '', r.get('source') or '', 'Oui' if r.get('consent') else 'Non']

def sheet(wb, name, head, rows, first=False):
    ws = wb.active if first else wb.create_sheet(name); ws.title = name
    ws.append(head)
    for c in ws[1]: c.font = Font(bold=True, color='FFFFFF'); c.fill = PatternFill('solid', fgColor='37A028'); c.alignment = Alignment(wrap_text=True, vertical='top')
    for r in rows: ws.append(r)
    ws.freeze_panes = 'A2'
    for i, h in enumerate(head, 1): ws.column_dimensions[ws.cell(1, i).column_letter].width = max(10, min(40, len(str(h)) + 4))

def prix(L, jours):
    lim = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None) - datetime.timedelta(days=jours) if jours else None
    F = [r for r in L if is_elev(r) and re.search(r'fabrique|deux', r.get('fabrique') or '', re.I) and any(num(v) > 0 for v in (r.get('veille') or {}).values())
         and (not lim or str(r.get('at') or '') >= lim.isoformat())]
    loc = {}
    for r in F:
        g = geo(r.get('localite')); loc.setdefault(g[1][0] if g else (r.get('localite') or '—'), []).append(r)
    K = [v for v in VEILLE if any(num((r.get('veille') or {}).get(v[0])) > 0 for r in F)]
    def st(A, k):
        x = [num((r.get('veille') or {}).get(k)) for r in A]; x = [v for v in x if v > 0]
        return (statistics.mean(x), len(x), min(x), max(x)) if x else None
    fmt = lambda v: '{:,.0f}'.format(v).replace(',', ' ')
    if not F: return F, '<p>Aucune veille des prix déclarée par des éleveurs fabricants sur la période.</p>', []
    h = ['<div style="font-family:Arial,sans-serif;font-size:13px"><p><b>%d</b> éleveur(s) qui fabriquent leur aliment ont déclaré leurs prix%s, dans <b>%d</b> localité(s). Moyennes en FCFA (nombre de réponses).</p>' % (len(F), ' sur les %d derniers jours' % jours if jours else '', len(loc)),
         '<table cellpadding="6" border="1" style="border-collapse:collapse"><tr style="background:#37A028;color:#fff"><th>Localité</th><th>Éleveurs</th>' + ''.join('<th>%s<br><small>%s</small></th>' % (l, u) for _, l, u in K) + '</tr>']
    rows = []
    for n, A in sorted(loc.items(), key=lambda x: -len(x[1])):
        cells = [st(A, k) for k, _, _ in K]
        h.append('<tr><td><b>%s</b></td><td>%d</td>%s</tr>' % (n, len(A), ''.join('<td>%s</td>' % (fmt(c[0]) + (' <small>(%d)</small>' % c[1] if c[1] > 1 else '') if c else '—') for c in cells)))
        rows.append([n, len(A)] + [round(c[0]) if c else '' for c in cells])
    tot = [st(F, k) for k, _, _ in K]
    h.append('<tr style="background:#E6F6E3;font-weight:bold"><td>Ensemble</td><td>%d</td>%s</tr></table>' % (len(F), ''.join('<td>%s<br><small>min %s • max %s</small></td>' % (fmt(c[0]), fmt(c[2]), fmt(c[3])) if c else '<td>—</td>' for c in tot)))
    h.append('<p style="color:#5b6476;font-size:12px">Prix déclarés par les visiteurs (non vérifiés). Données internes SOLEVO Côte d’Ivoire.</p></div>')
    rows.append(['Ensemble', len(F)] + [round(c[0]) if c else '' for c in tot])
    return F, ''.join(h), [['Localité', 'Éleveurs'] + ['%s (%s)' % (l, u) for _, l, u in K]] + rows

def main():
    ap = argparse.ArgumentParser(); ap.add_argument('src'); ap.add_argument('--out', default='.'); ap.add_argument('--jours', type=int, default=7); a = ap.parse_args()
    raw = json.load(open(a.src, encoding='utf8'))
    L = [dict(x.get('data') or {}, id=x.get('id') or (x.get('data') or {}).get('id')) if isinstance(x, dict) and 'data' in x else x for x in raw]
    L = [r for r in L if r and not r.get('test')]
    V = [r for r in L if val_of(r) == 'Validé']; P = [r for r in L if val_of(r) != 'Validé']
    day = datetime.datetime.now(datetime.timezone.utc).replace(tzinfo=None).strftime('%Y-%m-%d'); os.makedirs(a.out, exist_ok=True)
    wb = Workbook()
    sheet(wb, 'LISEZMOI', ['Rubrique', 'Contenu'], [['Base', 'SISSÊ~KABA • inscriptions des visiteurs (sauvegarde de secours dans le cloud)'], ['Extraction', '%s • %d fiche(s), dont %d validée(s) et %d à valider ou à corriger' % (day, len(L), len(V), len(P))],
          ['Clés', 'ID = identifiant de la fiche ; Code localité → R_Localites ; Code dépôt → R_Depots ; Code profil → R_Profils'], ['Confidentialité', 'Données personnelles : usage interne SOLEVO Côte d’Ivoire']], first=True)
    sheet(wb, 'T_Inscrits_valides', HEAD, [row(r) for r in V]); sheet(wb, 'T_Eleveurs', HEAD, [row(r) for r in V if is_elev(r)]); sheet(wb, 'T_Producteurs', HEAD, [row(r) for r in V if is_prod(r)])
    sheet(wb, 'A_valider', ['Contrôles automatiques'] + HEAD, [[' • '.join(checks(r, L)) or 'Conforme'] + row(r) for r in P])
    sheet(wb, 'R_Localites', ['Code localité', 'Localité', 'Région ou district', 'Latitude', 'Longitude'], [['LOC%03d' % (i + 1)] + g for i, g in enumerate(GEO)])
    sheet(wb, 'R_Depots', ['Code dépôt', 'Dépôt FEED', 'Statut', 'Latitude', 'Longitude'], [['DEP%02d' % (i + 1), d[0], 'Actif' if d[3] else 'En installation', d[1], d[2]] for i, d in enumerate(DEP)])
    sheet(wb, 'R_Profils', ['Code profil', 'Profil'], [['EL', 'Éleveur'], ['PR', 'Producteur'], ['EP', 'Éleveur et producteur'], ['AU', 'Autre']])
    sheet(wb, 'R_Classes_mais', ['Classe', 'Maïs déclaré / an', 'Traitement'], [['A', '≥ 100 t', 'Prioritaire P1, suivi KAM'], ['B', '25 à 100 t', 'Suivi ATE'], ['C', '< 25 t', 'Suivi groupé']])
    F, html, prows = prix(L, a.jours)
    if prows: sheet(wb, 'Veille_prix_%dj' % a.jours if a.jours else 'Veille_prix', prows[0], prows[1:])
    x = os.path.join(a.out, 'SISSE_KABA_Base_reference_inscriptions_%s.xlsx' % day); wb.save(x)
    open(os.path.join(a.out, 'recap_prix.html'), 'w', encoding='utf8').write(html)
    print(json.dumps({'xlsx': x, 'fiches': len(L), 'validees': len(V), 'a_traiter': len(P), 'eleveurs_fabricants_avec_prix': len(F), 'recap_prix_html': os.path.join(a.out, 'recap_prix.html'), 'date': day}, ensure_ascii=False))

if __name__ == '__main__': main()
