/* SISSÊ~KABA — génération des fichiers (PPTX, XLSX, DOCX, PDF) pour le scénario courant. */
(function (root) {
  'use strict';
  const enc = (s) => String(s).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
  function fill(text, S) {
    return String(text).replace(/\{\{(\w+)\}\}/g, (m, k) => (k in S ? S[k] : m));
  }
  function fillXml(xml, S) {
    return xml.replace(/\{\{(\w+)\}\}/g, (m, k) => (k in S ? enc(S[k]) : m));
  }

  /* ---------- PowerPoint ---------- */
  async function pptx(JSZip, buf, S) {
    const zip = await JSZip.loadAsync(buf);
    const names = Object.keys(zip.files).filter((n) => /^ppt\/(slides|notesSlides|charts)\/[^/]+\.xml$/.test(n));
    for (const n of names) {
      const x = await zip.file(n).async('string');
      if (x.includes('{{')) zip.file(n, fillXml(x, S));
    }
    const core = zip.file('docProps/core.xml');
    if (core) {
      let c = await core.async('string');
      c = c.replace(/<dc:title>[\s\S]*?<\/dc:title>/, '').replace('</cp:coreProperties>', `<dc:title>SISSÊ~KABA — ${enc(S.scenario)}</dc:title></cp:coreProperties>`);
      zip.file('docProps/core.xml', c);
    }
    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  }

  /* ---------- Excel ---------- */
  async function xlsx(JSZip, SKX, buf, overrides) {
    const zip = await JSZip.loadAsync(buf);
    const wb = await SKX.loadWorkbook(zip);
    const ov = {};
    for (const k in overrides) { const sh = k.split('!')[0]; if (wb.sheets[sh]) ov[k] = overrides[k]; }
    const vals = SKX.evaluate(wb, ov);
    SKX.writeBack(wb, vals, ov);
    return { bytes: await zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' }), values: vals };
  }

  async function xlsxStrings(JSZip, buf, S) {
    const zip = await JSZip.loadAsync(buf);
    for (const n of Object.keys(zip.files)) {
      if (!/^xl\/(worksheets\/[^/]+|sharedStrings)\.xml$/.test(n)) continue;
      const x = await zip.file(n).async('string');
      if (x.includes('{{')) zip.file(n, fillXml(x, S));
    }
    return zip.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  }

  /* ---------- Word ---------- */
  function docx(D, doc, S, images) {
    const { Document, Paragraph, TextRun, Table, TableRow, TableCell, WidthType, AlignmentType, HeadingLevel, ImageRun,
      Header, Footer, PageNumber, ShadingType, BorderStyle, PageOrientation, TableLayoutType } = D;
    const F = 'Arial';
    const GREEN = '37A028', NAVY = '002060', BLUE = '0B5FA1';
    const run = (t, o) => new TextRun(Object.assign({ text: fill(t, S), font: F, size: 21 }, o || {}));
    const children = [];
    const landscape = !!doc.landscape;
    const pageW = landscape ? 15840 : 11906, pageH = landscape ? 11906 : 16838, margin = 1000;
    const contentW = pageW - 2 * margin;
    const logos = [];
    if (images.solevo) logos.push(new ImageRun({ type: 'jpg', data: images.solevo, transformation: { width: 184, height: 68 }, altText: { name: 'SOLEVO', title: 'Logo SOLEVO', description: 'Logo SOLEVO Côte d’Ivoire' } }));
    if (images.solevo && images.sisse) logos.push(new TextRun({ text: '      ', font: F }));
    if (images.sisse) logos.push(new ImageRun({ type: 'jpg', data: images.sisse, transformation: { width: 180, height: 90 }, altText: { name: 'SISSE KABA', title: 'Logo SISSÊ~KABA', description: 'Logo SISSÊ~KABA' } }));
    if (logos.length) children.push(new Paragraph({ children: logos }));
    children.push(new Paragraph({ spacing: { before: 120, after: 60 }, children: [run(doc.title, { size: 36, bold: true, color: NAVY })] }));
    children.push(new Paragraph({ spacing: { after: 120 }, children: [run(doc.subtitle + ' • Version du {{date}}', { size: 20, color: BLUE })] }));
    const border = { style: BorderStyle.SINGLE, size: 4, color: 'BFBFBF' };
    const borders = { top: border, bottom: border, left: border, right: border };
    function table(t, width) {
      const ws = t.w || t.head.map(() => 1); const tot = ws.reduce((a, b) => a + b, 0);
      const cw = ws.map((w) => Math.floor(width * w / tot));
      const mk = (txt, i, head, alt, strong) => new TableCell({
        width: { size: cw[i], type: WidthType.DXA }, borders,
        shading: head ? { fill: GREEN, type: ShadingType.CLEAR, color: 'auto' } : alt ? { fill: 'F2F2F2', type: ShadingType.CLEAR, color: 'auto' } : undefined,
        margins: { top: 50, bottom: 50, left: 90, right: 90 },
        children: [new Paragraph({ alignment: i > 0 && !head && txt.length < 22 ? AlignmentType.RIGHT : AlignmentType.LEFT, children: [run(txt, { size: 18, bold: head || strong, color: head ? 'FFFFFF' : strong ? NAVY : '000000' })] })],
      });
      const strongRe = /^(Total|CA du programme|CA total|Résultat|Enveloppe|BFR normatif|Prix payé|Marge brute totale)/;
      const rows = [new TableRow({ tableHeader: true, children: t.head.map((h, i) => mk(h, i, true)) })]
        .concat(t.rows.map((r, ri) => new TableRow({ children: r.map((c, i) => mk(c, i, false, ri % 2 === 1, strongRe.test(fill(r[0], S)))) })));
      return new Table({ width: { size: width, type: WidthType.DXA }, columnWidths: cw, layout: TableLayoutType.FIXED, rows });
    }
    if (doc.canvas) {
      const c = doc.canvas;
      const box = (title, items, span) => new TableCell({
        columnSpan: span || 1, borders: { top: { style: BorderStyle.SINGLE, size: 8, color: NAVY }, bottom: { style: BorderStyle.SINGLE, size: 8, color: NAVY }, left: { style: BorderStyle.SINGLE, size: 8, color: NAVY }, right: { style: BorderStyle.SINGLE, size: 8, color: NAVY } },
        margins: { top: 80, bottom: 80, left: 100, right: 100 },
        children: [new Paragraph({ spacing: { after: 60 }, children: [run(title, { bold: true, color: GREEN, size: 19 })] })].concat(items.map((t) => new Paragraph({ spacing: { after: 40 }, children: [run('• ' + t, { size: 16 })] }))),
      });
      const cw = Math.floor(contentW / 5);
      const tbl = new Table({ width: { size: contentW, type: WidthType.DXA }, columnWidths: [cw, cw, cw, cw, cw], layout: TableLayoutType.FIXED, rows: [
        new TableRow({ children: [box('8 Partenaires clés', c.partners), box('7 Activités clés', c.activities), box('2 Proposition de valeur', c.value), box('4 Relations clients', c.relations), box('1 Segments de clients', c.segments)] }),
        new TableRow({ children: [box('6 Ressources clés', c.resources, 2), box('3 Canaux', c.channels, 3)] }),
        new TableRow({ children: [box('9 Structure de coûts', c.costs, 2), box('5 Sources de revenus', c.revenues, 3)] }),
      ] });
      children.push(tbl);
      children.push(new Paragraph({ spacing: { before: 120 }, children: [run(c.footer, { size: 16, italics: true, color: '595959' })] }));
    }
    for (const b of doc.blocks || []) {
      if (b.h1) children.push(new Paragraph({ heading: HeadingLevel.HEADING_1, spacing: { before: 280, after: 120 }, children: [run(b.h1, { size: 28, bold: true, color: NAVY })] }));
      else if (b.h2) children.push(new Paragraph({ heading: HeadingLevel.HEADING_2, spacing: { before: 200, after: 80 }, children: [run(b.h2, { size: 23, bold: true, color: GREEN })] }));
      else if (b.p) children.push(new Paragraph({ spacing: { after: 120, line: 276 }, alignment: AlignmentType.JUSTIFIED, children: [run(b.p, b.style === 'accent' ? { bold: true, color: BLUE } : b.style === 'note' ? { italics: true, size: 18, color: '595959' } : {})] }));
      else if (b.bullets) b.bullets.forEach((t) => children.push(new Paragraph({ bullet: { level: 0 }, spacing: { after: 60 }, children: [run(t)] })));
      else if (b.table) { children.push(table(b.table, contentW)); children.push(new Paragraph({ spacing: { after: 100 }, children: [] })); }
    }
    const hdr = [];
    if (images.solevo) hdr.push(new ImageRun({ type: 'jpg', data: images.solevo, transformation: { width: 184, height: 68 }, altText: { name: 'SOLEVO', title: 'Logo SOLEVO', description: 'Logo SOLEVO' } }));
    hdr.push(run('    SOLEVO CÔTE D’IVOIRE   |   SISSÊ~KABA   |   ' + doc.header, { size: 14, color: '808080' }));
    const header = new Header({ children: [new Paragraph({ children: hdr })] });
    const footer = new Footer({ children: [new Paragraph({ alignment: AlignmentType.LEFT, children: [run('Version de travail pour validation • {{date}} • {{scenario}}    ', { size: 14, color: '808080' }), new TextRun({ children: [PageNumber.CURRENT], font: F, size: 14, color: '808080' })] })] });
    return new Document({
      creator: 'SOLEVO Côte d’Ivoire — SISSÊ~KABA', title: fill(doc.title, S), description: fill('{{scenario}}', S),
      styles: { default: { document: { run: { font: F, size: 21 } } } },
      sections: [{ properties: { page: { size: { width: pageW, height: pageH, orientation: landscape ? PageOrientation.LANDSCAPE : PageOrientation.PORTRAIT }, margin: { top: margin, bottom: margin, left: margin, right: margin } } }, headers: { default: header }, footers: { default: footer }, children }],
    });
  }

  /* ---------- PDF (pdfmake) ---------- */
  function pdfDoc(doc, S, images) {
    const GREEN = '#37A028', NAVY = '#002060', BLUE = '#0B5FA1';
    const content = [];
    content.push({ columns: [images.solevoBig ? { image: images.solevoBig, width: 138 } : '', images.sisseUrl ? { image: images.sisseUrl, width: 130 } : ''], columnGap: 30, margin: [0, 0, 0, 6] });
    content.push({ text: fill(doc.title, S), fontSize: 18, bold: true, color: NAVY, margin: [0, 4, 0, 2] });
    content.push({ text: fill(doc.subtitle + ' • Version du {{date}}', S), fontSize: 10, color: BLUE, margin: [0, 0, 0, 8] });
    const strongRe = /^(Total|CA du programme|CA total|Résultat|Enveloppe|BFR normatif|Prix payé|Marge brute totale)/;
    function tbl(t) {
      const ws = t.w || t.head.map(() => 1);
      const tot = ws.reduce((a, b) => a + b, 0);
      return {
        table: { headerRows: 1, widths: ws.map((w) => (w / tot * 100).toFixed(2) + '%'),
          body: [t.head.map((h) => ({ text: fill(h, S), bold: true, color: 'white', fillColor: GREEN, fontSize: 8.5 }))]
            .concat(t.rows.map((r, ri) => r.map((c, i) => {
              const txt = fill(c, S); const strong = strongRe.test(fill(r[0], S));
              return { text: txt, fontSize: 8.5, bold: strong, color: strong ? NAVY : 'black', alignment: i > 0 && txt.length < 22 ? 'right' : 'left', fillColor: ri % 2 ? '#F2F2F2' : null };
            }))) },
        layout: { hLineColor: '#BFBFBF', vLineColor: '#BFBFBF', hLineWidth: () => 0.5, vLineWidth: () => 0.5, paddingTop: () => 2, paddingBottom: () => 2 },
        margin: [0, 2, 0, 8],
      };
    }
    if (doc.canvas) {
      const c = doc.canvas;
      const box = (t, items, span) => ({ colSpan: span || 1, stack: [{ text: t, bold: true, color: GREEN, fontSize: 9, margin: [0, 0, 0, 3] }].concat(items.map((x) => ({ text: '• ' + fill(x, S), fontSize: 7.5, margin: [0, 0, 0, 2] }))) });
      content.push({ table: { widths: ['20%', '20%', '20%', '20%', '20%'], heights: [150, 78, 92], body: [
        [box('8 Partenaires clés', c.partners), box('7 Activités clés', c.activities), box('2 Proposition de valeur', c.value), box('4 Relations clients', c.relations), box('1 Segments de clients', c.segments)],
        [box('6 Ressources clés', c.resources, 2), {}, box('3 Canaux', c.channels, 3), {}, {}],
        [box('9 Structure de coûts', c.costs, 2), {}, box('5 Sources de revenus', c.revenues, 3), {}, {}]] },
        layout: { hLineColor: NAVY, vLineColor: NAVY, hLineWidth: () => 1, vLineWidth: () => 1 } });
      content.push({ text: fill(c.footer, S), fontSize: 7.5, italics: true, color: '#595959', margin: [0, 6, 0, 0] });
    }
    for (const b of doc.blocks || []) {
      if (b.h1) content.push({ text: fill(b.h1, S), fontSize: 13, bold: true, color: NAVY, margin: [0, 10, 0, 4] });
      else if (b.h2) content.push({ text: fill(b.h2, S), fontSize: 11, bold: true, color: GREEN, margin: [0, 6, 0, 3] });
      else if (b.p) content.push({ text: fill(b.p, S), fontSize: b.style === 'note' ? 8 : 9.5, bold: b.style === 'accent', italics: b.style === 'note', color: b.style === 'accent' ? BLUE : 'black', alignment: 'justify', margin: [0, 0, 0, 5], lineHeight: 1.15 });
      else if (b.bullets) content.push({ ul: b.bullets.map((t) => fill(t, S)), fontSize: 9.5, margin: [0, 0, 0, 5] });
      else if (b.table) content.push(tbl(b.table));
    }
    return {
      pageSize: 'A4', pageOrientation: doc.landscape ? 'landscape' : 'portrait', pageMargins: [40, 90, 40, 40], content,
      defaultStyle: { font: 'Roboto' },
      info: { title: fill(doc.title, S), author: 'SOLEVO Côte d’Ivoire', subject: fill('{{scenario}}', S) },
      header: () => ({ columns: [images.solevoSmall ? { image: images.solevoSmall, width: 138, height: 51 } : '', { text: fill('SOLEVO CÔTE D’IVOIRE   |   SISSÊ~KABA   |   ' + doc.header, S), fontSize: 7, color: '#808080', margin: [12, 22, 0, 0] }], margin: [32, 29, 40, 0] }),
      footer: (p, n) => ({ columns: [{ text: fill('Version de travail pour validation • {{date}} • {{scenario}}', S), fontSize: 7, color: '#808080' }, { text: p + ' / ' + n, alignment: 'right', fontSize: 7, color: '#808080' }], margin: [40, 10, 40, 0] }),
    };
  }


  /* Schéma des flux de données (SVG partagé : simulateur et PDF) */
  function flowSvg(F, S, dark) {
    const W = 1200, H = 620, cw = W / 3, rh = H / 3, bw = cw * 0.8, bh = rh * 0.7;
    const col = dark ? { box: 'rgba(255,255,255,0.10)', stroke: '#9BBB59', h: '#FFFFFF', s: '#C8D4E8', e: '#E8F0FA', line: '#37A028', cen: '#37A028' }
      : { box: '#F4F7FB', stroke: '#0B5FA1', h: '#002060', s: '#595959', e: '#0B5FA1', line: '#37A028', cen: '#002060' };
    const pos = (r, c) => [c * cw + (cw - bw) / 2, r * rh + (rh - bh) / 2];
    const [cx, cy] = pos(1, 1); const mx = cx + bw / 2, my = cy + bh / 2;
    const edge = (px, py, qx, qy, hw, hh) => { const dx = qx - px, dy = qy - py; const t = Math.min(dx ? hw / Math.abs(dx) : 9e9, dy ? hh / Math.abs(dy) : 9e9); return [px + dx * t, py + dy * t]; };
    const esc = (t) => String(t).replace(/&/g, '&amp;').replace(/</g, '&lt;');
    let g = `<defs><marker id="ah" viewBox="0 0 10 10" refX="9" refY="5" markerWidth="7" markerHeight="7" orient="auto-start-reverse"><path d="M0,0 L10,5 L0,10 z" fill="${col.line}"/></marker></defs>`;
    let boxes = '';
    for (const n of F.nodes) {
      const [bx, by] = pos(n.r, n.c); const nx = bx + bw / 2, ny = by + bh / 2;
      const [sx, sy] = edge(nx, ny, mx, my, bw / 2 + 4, bh / 2 + 4); const [ex, ey] = edge(mx, my, nx, ny, bw / 2 + 12, bh / 2 + 12);
      g += `<line x1="${sx.toFixed(1)}" y1="${sy.toFixed(1)}" x2="${ex.toFixed(1)}" y2="${ey.toFixed(1)}" stroke="${col.line}" stroke-width="3" marker-start="url(#ah)" marker-end="url(#ah)"/>`;
      boxes += `<rect x="${bx}" y="${by}" width="${bw}" height="${bh}" rx="14" fill="${col.box}" stroke="${col.stroke}" stroke-width="1.5"/>`
        + `<text x="${nx}" y="${by + 40}" text-anchor="middle" font-size="22" font-weight="700" fill="${col.h}" font-family="Roboto, Arial, sans-serif">${esc(fill(n.h, S))}</text>`
        + `<text x="${nx}" y="${by + 66}" text-anchor="middle" font-size="15" fill="${col.s}" font-family="Roboto, Arial, sans-serif">${esc(n.s)}</text>`
        + `<text x="${nx}" y="${by + 96}" text-anchor="middle" font-size="16" fill="${col.e}" font-family="Roboto, Arial, sans-serif">${esc(n.e)}</text>`;
    }
    boxes += `<rect x="${cx - 8}" y="${cy - 8}" width="${bw + 16}" height="${bh + 16}" rx="18" fill="${col.cen}"/>`
      + `<text x="${mx}" y="${my - 4}" text-anchor="middle" font-size="25" font-weight="700" fill="#FFFFFF" font-family="Roboto, Arial, sans-serif">${esc(F.center)}</text>`
      + `<text x="${mx}" y="${my + 26}" text-anchor="middle" font-size="15" fill="#E8F0FA" font-family="Roboto, Arial, sans-serif">API • base centrale • journal d’audit</text>`;
    return `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 ${W} ${H}" width="${W}" height="${H}">${g}${boxes}</svg>`;
  }



  /* Roboto (PDF) n’a pas la flèche → : on la remplace par « à » dans tous les textes */
  function deArrow(o) {
    if (typeof o === 'string') return o.indexOf('→') < 0 ? o : o.replace(/\s*→\s*/g, ' à ');
    if (Array.isArray(o)) return o.map(deArrow);
    if (o && typeof o === 'object') { for (const k in o) if (k !== 'svg' && k !== 'image' && typeof o[k] !== 'function') o[k] = deArrow(o[k]); }
    return o;
  }

  /* Fiche A5 recto-verso pour le stand (visiteur éleveur ou producteur), construite depuis la présentation courte */
  function pdfFlyer(deck, S, images) {
    const GREEN = '#37A028', NAVY = '#002060', BLUE = '#0B5FA1';
    const W = 420, H = 595;
    const cv = deck.slides[0]; const kp = deck.slides[1]; const fig = deck.slides[2]; const st = deck.slides.find((x) => (x.blocks || []).some((b) => b.k === 'steps'));
    const qr = deck.slides.find((x) => (x.blocks || []).some((b) => b.k === 'qr')).blocks[0];
    const TH = { eleveur: ['#04210F', '#1E6B14'], producteur: ['#00143D', '#1E6B14'] }[cv.theme] || ['#00143D', '#0B4F8F'];
    const F = (t) => fill(t, S);
    const box = (v, l) => ({ table: { widths: ['*'], body: [[{ stack: [{ text: F(v), fontSize: 15, bold: true, color: BLUE, alignment: 'center' }, { text: F(l), fontSize: 7.5, color: '#595959', alignment: 'center', margin: [0, 2, 0, 0] }], fillColor: '#F4F7FB', margin: [4, 6, 4, 6] }]] }, layout: { hLineWidth: (i) => (i === 0 ? 2 : 0), vLineWidth: () => 0, hLineColor: GREEN } });
    const c = [];
    // ---------- recto ----------
    c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: W, h: 250, linearGradient: TH }, { type: 'polyline', closePath: true, points: [{ x: 0, y: 236 }, { x: 300, y: 236 }, { x: 288, y: 250 }, { x: 0, y: 250 }], color: GREEN }], absolutePosition: { x: 0, y: 0 } });
    c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 214, h: 46, r: 6, color: 'white' }], absolutePosition: { x: 24, y: 22 } });
    c.push({ image: images.solevoBig, height: 32, absolutePosition: { x: 32, y: 29 } });
    if (images.sisse || images.sisseUrl) c.push({ image: images.sisse || images.sisseUrl, height: 32, absolutePosition: { x: 148, y: 29 } });
    c.push({ text: F(cv.tag).toUpperCase(), fontSize: 7.5, bold: true, color: 'white', absolutePosition: { x: 26, y: 84 } });
    if (images.qrVideo) {
      c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 70, h: 80, r: 6, color: 'white' }], absolutePosition: { x: W - 24 - 70, y: 12 } });
      c.push({ image: images.qrVideo, width: 60, absolutePosition: { x: W - 24 - 65, y: 15 } });
      c.push({ text: 'VOIR LA VIDÉO', fontSize: 6.5, bold: true, color: NAVY, alignment: 'center', absolutePosition: { x: W - 24 - 70, y: 79 }, width: 70 });
    }
    c.push({ text: F(cv.title), fontSize: 28, bold: true, color: 'white', absolutePosition: { x: 24, y: 100 }, width: 370 });
    c.push({ text: F(cv.sub), fontSize: 11, color: '#E8F0FA', absolutePosition: { x: 24, y: cv.slogan ? 158 : 172 }, width: 370 });
    if (cv.slogan) {
      c.push({ text: F(cv.slogan), fontSize: 14, bold: true, color: '#B5E07A', absolutePosition: { x: 24, y: 196 }, width: 370 });
      c.push({ text: F(cv.sloganSub || ''), fontSize: 8.5, bold: true, color: 'white', absolutePosition: { x: 24, y: 215 }, width: 370 });
    }
    c.push({ columns: cv.figs.map((f) => box(f.v, f.l)), columnGap: 8, absolutePosition: { x: 24, y: 266 }, width: W - 48 });
    const qy = cv.rule ? 374 : 350;
    if (cv.rule) {
      c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: W - 48, h: 38, r: 5, color: GREEN }], absolutePosition: { x: 24, y: 324 } });
      c.push({ stack: [{ text: F(cv.rule), bold: true, fontSize: 12 }, { text: F(cv.ruleSub || ''), fontSize: 7.5, margin: [0, 1, 0, 0] }], color: 'white', absolutePosition: { x: 34, y: 329 }, width: W - 68 });
    }
    if (images.qr) c.push({ image: images.qr, width: 150, absolutePosition: { x: 24, y: qy } });
    c.push({ stack: [{ text: F(qr.h), fontSize: 15, bold: true, color: NAVY }, { text: F(qr.t), fontSize: 8.5, color: '#595959', margin: [0, 3, 0, 10] }]
      .concat(qr.lines.map((l) => ({ text: [{ text: F(l.v) + '\n', bold: true, fontSize: 11.5, color: BLUE }, { text: F(l.l), fontSize: 7.5, color: '#595959' }], margin: [0, 0, 0, 7] }))), absolutePosition: { x: 190, y: qy + 10 }, width: 210 });
    c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: W, h: 40, color: '#000B22' }], absolutePosition: { x: 0, y: H - 40 } });
    c.push({ text: [{ text: 'SOLEVO Côte d’Ivoire', bold: true }, '   •   SELAB SHOW, 20–22 novembre 2026   •   Parc des sports d’Abidjan'], fontSize: 7.5, color: 'white', absolutePosition: { x: 24, y: H - 26 } });
    // ---------- verso ----------
    c.push({ text: F(kp.title), fontSize: 15, bold: true, color: NAVY, pageBreak: 'before', margin: [0, 0, 0, 2] });
    c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 50, h: 3, color: GREEN }], margin: [0, 0, 0, 8] });
    c.push({ columns: kp.blocks[0].items.map((it) => box(it.v, it.l)), columnGap: 8, margin: [0, 0, 0, 12] });
    c.push({ text: F(fig.title), fontSize: 13, bold: true, color: NAVY });
    c.push({ text: F(fig.sub || ''), fontSize: 8, color: BLUE, margin: [0, 1, 0, 6] });
    for (const b of fig.blocks) {
      if (b.k === 'table') {
        const ws = b.w || b.head.map(() => 1); const tot = ws.reduce((a, x) => a + x, 0);
        c.push({ table: { headerRows: 1, widths: ws.map((x) => (x / tot * 100).toFixed(1) + '%'), body: [b.head.map((h) => ({ text: F(h), bold: true, color: 'white', fillColor: GREEN, fontSize: 7.5 }))].concat(b.rows.map((r, ri) => r.map((x, i) => ({ text: F(x), fontSize: 7.5, alignment: i ? 'center' : 'left', fillColor: ri % 2 ? '#F2F2F2' : null })))) }, layout: { hLineColor: '#BFBFBF', vLineColor: '#BFBFBF', hLineWidth: () => 0.5, vLineWidth: () => 0.5 }, margin: [0, 0, 0, 10] });
      } else if (b.k === 'kpis') c.push({ columns: b.items.map((it) => box(it.v, it.l)), columnGap: 8, margin: [0, 0, 0, 8] });
    }
    c.push({ text: F(st.title), fontSize: 13, bold: true, color: NAVY, margin: [0, 6, 0, 6] });
    c.push({ table: { widths: [18, '*'], body: st.blocks[0].items.map((it, i) => [{ text: String(i + 1), color: 'white', bold: true, fillColor: GREEN, alignment: 'center', fontSize: 10 }, { text: [{ text: F(it.h) + ' : ', bold: true, color: NAVY }, F(it.t)], fontSize: 8.5 }]) }, layout: { hLineColor: 'white', vLineColor: 'white', hLineWidth: () => 3, vLineWidth: () => 0, paddingTop: () => 3, paddingBottom: () => 3 }, margin: [0, 0, 0, 10] });
    c.push({ text: 'Gains et économies attendus si les conditions du programme sont réunies ; ils ne sont pas garantis. Chiffres du scénario « ' + F('{{scenario}}') + ' », prix du maïs illustratif ' + F('{{P}}') + ' FCFA/kg.', fontSize: 6.5, color: '#808080', margin: [0, 0, 0, 6] });
    c.push({ text: F(qr.sign) + ' • WhatsApp +225 07 10 47 14 02 • elvis.lehito@solevogroup.com', fontSize: 7.5, bold: true, color: NAVY });
    return { pageSize: 'A5', pageOrientation: 'portrait', pageMargins: [24, 24, 24, 30], content: c, defaultStyle: { font: 'Roboto' },
      info: { title: 'Fiche stand SOLEVO — ' + deck.menu, author: 'SOLEVO Côte d’Ivoire', subject: F('{{scenario}}') },
      footer: (p) => (p === 2 ? { text: 'SISSÊ~KABA • ' + deck.menu + ' • ' + F('{{date}}'), fontSize: 6.5, color: '#808080', margin: [24, 10, 24, 0] } : '') };
  }



  /* Classeur Excel simple (une feuille, en-tête en gras sur fond vert) */
  async function xlsxTable(JSZip, sheet, head, rows, widths) { return xlsxBook(JSZip, [{ name: sheet, head, rows, widths }]); }
  /* Classeur Excel à plusieurs feuilles (en-tête en gras sur fond vert, volet figé, filtres) */
  async function xlsxBook(JSZip, sheets) {
    const esc = (t) => String(t == null ? '' : t).replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;').replace(/"/g, '&quot;');
    const col = (i) => { let s = ''; i++; while (i) { const m = (i - 1) % 26; s = String.fromCharCode(65 + m) + s; i = Math.floor((i - 1) / 26); } return s; };
    const cell = (v, r, c, st) => (typeof v === 'number' && isFinite(v)) ? `<c r="${col(c)}${r}"${st ? ` s="${st}"` : ''}><v>${v}</v></c>` : `<c r="${col(c)}${r}" t="inlineStr"${st ? ` s="${st}"` : ''}><is><t xml:space="preserve">${esc(v)}</t></is></c>`;
    const used = new Set();
    const nm = (n) => { let x = String(n).replace(/[\\/?*[\]:]/g, ' ').slice(0, 31) || 'Feuille'; let k = 2; while (used.has(x)) x = x.slice(0, 28) + ' ' + k++; used.add(x); return x; };
    const z = new JSZip();
    z.file('[Content_Types].xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Types xmlns="http://schemas.openxmlformats.org/package/2006/content-types"><Default Extension="rels" ContentType="application/vnd.openxmlformats-package.relationships+xml"/><Default Extension="xml" ContentType="application/xml"/><Override PartName="/xl/workbook.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.sheet.main+xml"/>' + sheets.map((_, i) => `<Override PartName="/xl/worksheets/sheet${i + 1}.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.worksheet+xml"/>`).join('') + '<Override PartName="/xl/styles.xml" ContentType="application/vnd.openxmlformats-officedocument.spreadsheetml.styles+xml"/></Types>');
    z.file('_rels/.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships"><Relationship Id="rId1" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/officeDocument" Target="xl/workbook.xml"/></Relationships>');
    z.file('xl/workbook.xml', `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><workbook xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main" xmlns:r="http://schemas.openxmlformats.org/officeDocument/2006/relationships"><sheets>${sheets.map((sh, i) => `<sheet name="${esc(nm(sh.name))}" sheetId="${i + 1}" r:id="rId${i + 1}"/>`).join('')}</sheets></workbook>`);
    z.file('xl/_rels/workbook.xml.rels', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><Relationships xmlns="http://schemas.openxmlformats.org/package/2006/relationships">' + sheets.map((_, i) => `<Relationship Id="rId${i + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/worksheet" Target="worksheets/sheet${i + 1}.xml"/>`).join('') + `<Relationship Id="rId${sheets.length + 1}" Type="http://schemas.openxmlformats.org/officeDocument/2006/relationships/styles" Target="styles.xml"/></Relationships>`);
    z.file('xl/styles.xml', '<?xml version="1.0" encoding="UTF-8" standalone="yes"?><styleSheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><fonts count="2"><font><sz val="11"/><name val="Calibri"/></font><font><b/><sz val="11"/><color rgb="FFFFFFFF"/><name val="Calibri"/></font></fonts><fills count="3"><fill><patternFill patternType="none"/></fill><fill><patternFill patternType="gray125"/></fill><fill><patternFill patternType="solid"><fgColor rgb="FF37A028"/></patternFill></fill></fills><borders count="1"><border/></borders><cellStyleXfs count="1"><xf/></cellStyleXfs><cellXfs count="2"><xf/><xf fontId="1" fillId="2" applyFont="1" applyFill="1"/></cellXfs><cellStyles count="1"><cellStyle name="Normal" xfId="0" builtinId="0"/></cellStyles></styleSheet>');
    sheets.forEach((sh, i) => {
      const head = sh.head, rows = sh.rows || [];
      const data = [head].concat(rows).map((r, k) => `<row r="${k + 1}">${r.map((v, c) => cell(v, k + 1, c, k === 0 ? 1 : 0)).join('')}</row>`).join('');
      const cols = `<cols>${head.map((_, c) => `<col min="${c + 1}" max="${c + 1}" width="${(sh.widths && sh.widths[c]) || 16}" customWidth="1"/>`).join('')}</cols>`;
      z.file(`xl/worksheets/sheet${i + 1}.xml`, `<?xml version="1.0" encoding="UTF-8" standalone="yes"?><worksheet xmlns="http://schemas.openxmlformats.org/spreadsheetml/2006/main"><sheetViews><sheetView workbookViewId="0"${i === 0 ? ' tabSelected="1"' : ''}><pane ySplit="1" topLeftCell="A2" activePane="bottomLeft" state="frozen"/></sheetView></sheetViews>${cols}<sheetData>${data}</sheetData>${rows.length ? `<autoFilter ref="A1:${col(head.length - 1)}${rows.length + 1}"/>` : ''}</worksheet>`);
    });
    return z.generateAsync({ type: 'uint8array', compression: 'DEFLATE' });
  }

  /* Kakémono 85 × 200 cm (recto agrandi), QR code vectoriel */
  function pdfKakemono(deck, S, images) {
    const mm = 2.8346, W = 850 * mm, H = 2000 * mm, GREEN = '#37A028', NAVY = '#002060', BLUE = '#0B5FA1';
    const cv = deck.slides[0];
    const qr = deck.slides.find((x) => (x.blocks || []).some((b) => b.k === 'qr')).blocks[0];
    const TH = { eleveur: ['#04210F', '#1E6B14'], producteur: ['#00143D', '#1E6B14'] }[cv.theme] || ['#00143D', '#0B4F8F'];
    const F = (t) => fill(t, S);
    const c = [];
    const P = (x, y) => ({ x: x * mm, y: y * mm });
    c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: W, h: 720 * mm, linearGradient: TH },
      { type: 'ellipse', x: 760 * mm, y: 60 * mm, r1: 260 * mm, r2: 260 * mm, lineColor: '#9BBB59', lineWidth: 6 },
      { type: 'polyline', closePath: true, points: [P(0, 690), P(620, 690), P(590, 740), P(0, 740)], color: GREEN },
      { type: 'polyline', closePath: true, points: [P(0, 748), P(470, 748), P(462, 762), P(0, 762)], color: '#9BBB59' },
      { type: 'rect', x: 0, y: 1880 * mm, w: W, h: 120 * mm, color: '#000B22' }], absolutePosition: { x: 0, y: 0 } });
    c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 640 * mm, h: 150 * mm, r: 18 * mm, color: 'white' }], absolutePosition: P(60, 60) });
    c.push({ image: images.solevoBig, height: 110 * mm, absolutePosition: P(90, 80) });
    if (images.sisse || images.sisseUrl) c.push({ image: images.sisse || images.sisseUrl, height: 110 * mm, absolutePosition: P(400, 80) });
    c.push({ text: F(cv.tag).toUpperCase(), fontSize: 64, bold: true, color: 'white', characterSpacing: 4, absolutePosition: P(60, 260) });
    c.push({ text: F(cv.title), fontSize: 230, bold: true, color: 'white', lineHeight: 0.95, absolutePosition: P(60, 320), width: 740 * mm });
    c.push({ text: F(cv.sub), fontSize: 92, color: '#E8F0FA', absolutePosition: P(60, 545), width: 730 * mm });
    if (cv.slogan) {
      c.push({ text: F(cv.sloganSub || ''), fontSize: 70, bold: true, color: '#B5E07A', absolutePosition: P(60, 632), width: 780 * mm });
      c.push({ text: F(cv.slogan), fontSize: 112, bold: true, color: 'white', absolutePosition: P(36, 697), width: 640 * mm });
    }
    const fs = cv.rule ? 132 : 150, fh = cv.rule ? 118 : 130;
    cv.figs.forEach((f, i) => {
      const y = (cv.rule ? 790 : 800) + i * fs;
      c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 730 * mm, h: fh * mm, color: '#F4F7FB' }, { type: 'rect', x: 0, y: 0, w: 14 * mm, h: fh * mm, color: GREEN }], absolutePosition: P(60, y) });
      c.push({ text: F(f.v), fontSize: cv.rule ? 160 : 175, bold: true, color: BLUE, absolutePosition: P(100, y + 10), width: 680 * mm });
      c.push({ text: F(f.l), fontSize: 64, color: '#595959', absolutePosition: P(100, y + (cv.rule ? 76 : 85)), width: 680 * mm });
    });
    if (cv.rule) {
      c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 730 * mm, h: 92 * mm, r: 10 * mm, color: GREEN }], absolutePosition: P(60, 1190) });
      c.push({ text: F(cv.rule), fontSize: 96, bold: true, color: 'white', alignment: 'center', absolutePosition: P(60, 1200), width: 730 * mm });
      c.push({ text: F(cv.ruleSub || ''), fontSize: 56, color: 'white', alignment: 'center', absolutePosition: P(60, 1248), width: 730 * mm });
    }
    // QR vectoriel
    const M = images.qrMatrix || []; const n = M.length;
    if (n) {
      const size = cv.rule ? 390 : 430, q = 4, cell = size / (n + 2 * q), x0 = (850 - size) / 2, y0 = cv.rule ? 1318 : 1260;
      const rects = [{ type: 'rect', x: 0, y: 0, w: size * mm, h: size * mm, color: 'white' }];
      M.forEach((row, r) => { let c0 = -1; for (let k = 0; k <= n; k++) { const on = row[k] === '1'; if (on && c0 < 0) c0 = k; if (!on && c0 >= 0) { rects.push({ type: 'rect', x: (q + c0) * cell * mm, y: (q + r) * cell * mm, w: (k - c0) * cell * mm + 0.3, h: cell * mm + 0.3, color: 'black' }); c0 = -1; } } });
      c.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: (size + 40) * mm, h: (size + 40) * mm, r: 16 * mm, color: GREEN }], absolutePosition: P(x0 - 20, y0 - 20) });
      c.push({ canvas: rects, absolutePosition: P(x0, y0) });
    }
    c.push({ text: F(qr.h), fontSize: 130, bold: true, color: NAVY, alignment: 'center', absolutePosition: P(0, 1720), width: W });
    c.push({ text: F(qr.lines[0].v) + '   •   ' + F(qr.lines[2].v), fontSize: 66, bold: true, color: BLUE, alignment: 'center', absolutePosition: P(0, 1800), width: W });
    c.push({ text: [{ text: 'SOLEVO Côte d’Ivoire', bold: true }, '   •   FEED & SEED   •   SELAB SHOW 2026'], fontSize: 70, color: 'white', alignment: 'center', absolutePosition: P(0, 1920), width: W });
    return { pageSize: { width: W, height: H }, pageMargins: [0, 0, 0, 0], content: c, defaultStyle: { font: 'Roboto' },
      info: { title: 'Kakémono 85 × 200 cm — ' + deck.menu, author: 'SOLEVO Côte d’Ivoire', subject: F('{{scenario}}') } };
  }

  /* PDF des présentations : une page par diapositive, commentaires orateur inclus */
  function pdfDeck(deck, S, images, opts) {
    const GREEN = '#37A028', NAVY = '#002060', BLUE = '#0B5FA1';
    const W = 842, H = 595; // A4 paysage
    const pages = [];
    deck.slides.filter((sd) => !sd.temo || S['temo' + sd.temo + 'Ok']).forEach((sd, idx) => {
      const pg = [];
      const brk = idx > 0 ? 'before' : undefined;
      if (sd.type === 'cover') {
        const TH = { eleveur: ['#062A14', '#1E6B14'], producteur: ['#00143D', '#1E6B14'], selab: ['#00143D', '#0B4F8F'], codir: ['#000F2E', '#002060'], it: ['#00143D', '#0B5FA1'] }[sd.theme] || ['#00143D', '#0B4F8F'];
        pg.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: W, h: H, linearGradient: TH }, { type: 'ellipse', x: 760, y: 40, r1: 190, r2: 190, lineColor: '#1A3A75', lineWidth: 1.5 },
          { type: 'polyline', closePath: true, points: [{ x: 0, y: 470 }, { x: 520, y: 470 }, { x: 495, y: 496 }, { x: 0, y: 496 }], color: GREEN },
          { type: 'rect', x: 0, y: 545, w: W, h: 50, color: '#000B22' }], absolutePosition: { x: 0, y: 0 }, pageBreak: brk });
        pg.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 250, h: 58, r: 8, color: 'white' }], absolutePosition: { x: 40, y: 36 } });
        pg.push({ image: images.solevoBig, height: 42, absolutePosition: { x: 52, y: 44 } });
        if (images.sisse || images.sisseUrl) pg.push({ image: images.sisse || images.sisseUrl, height: 42, absolutePosition: { x: 190, y: 44 } });
        pg.push({ text: fill(sd.tag, S).toUpperCase(), fontSize: 8.5, bold: true, color: 'white', absolutePosition: { x: 44, y: 110 } });
        pg.push({ text: fill(sd.title, S), fontSize: 40, bold: true, color: 'white', absolutePosition: { x: 40, y: 130 }, width: 500 });
        pg.push({ text: fill(sd.sub, S), fontSize: 15, color: '#DCE6F5', absolutePosition: { x: 40, y: 230 }, width: 480 });
        pg.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 80, h: 4, color: GREEN }], absolutePosition: { x: 40, y: 300 } });
        const meta = [['PUBLIC', sd.aud], ['DATE', '{{dateLong}}'], ['SCÉNARIO', '{{scenario}}'], ['PRÉSENTÉ PAR', (sd.pres || '') + '\n' + (sd.presSub || '')]];
        meta.forEach(([k, v], i) => pg.push({ stack: [{ text: k, fontSize: 7, bold: true, color: '#9FB4D6' }, { text: fill(v, S).replace('\\n', '\n'), fontSize: 9.5, bold: true, color: 'white' }], absolutePosition: { x: 40 + (i % 2) * 250, y: 318 + Math.floor(i / 2) * 48 }, width: 240 }));
        sd.figs.forEach((f, i) => {
          pg.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: 230, h: 78, color: '#1A3A75' }, { type: 'rect', x: 0, y: 0, w: 5, h: 78, color: GREEN }], absolutePosition: { x: 580, y: 110 + i * 95 } });
          pg.push({ text: fill(f.v, S), fontSize: 22, bold: true, color: 'white', absolutePosition: { x: 595, y: 120 + i * 95 } });
          pg.push({ text: fill(f.l, S), fontSize: 9, color: '#DCE6F5', absolutePosition: { x: 595, y: 154 + i * 95 }, width: 205 });
        });
        pg.push({ text: [{ text: 'SOLEVO Côte d’Ivoire', bold: true }, '     FEED & SEED     ' + fill(sd.band, S)], fontSize: 8.5, color: 'white', absolutePosition: { x: 40, y: 563 } });
      } else if (sd.type === 'title') {
        pg.push({ image: images.solevoBig, width: 330, absolutePosition: { x: 130, y: 60 }, pageBreak: brk });
        pg.push({ text: fill(sd.title, S), fontSize: 36, color: GREEN, absolutePosition: { x: 100, y: 228 } });
        pg.push({ text: fill(sd.sub, S), fontSize: 26, bold: true, color: '#9BBB59', absolutePosition: { x: 100, y: 276 } });
        pg.push({ text: fill(sd.date, S), fontSize: 20, color: BLUE, absolutePosition: { x: 100, y: 316 } });
      } else if (sd.type === 'section') {
        pg.push({ canvas: [{ type: 'rect', x: 0, y: 0, w: W, h: 340, color: '#001C38' }], absolutePosition: { x: 0, y: 0 }, pageBreak: brk });
        pg.push({ image: images.solevoWhite, width: 90, absolutePosition: { x: 85, y: 150 } });
        pg.push({ text: fill(sd.title, S), fontSize: 28, bold: true, color: 'white', absolutePosition: { x: 85, y: 225 } });
      } else if (sd.type === 'agenda') {
        pg.push({ image: images.solevoSmall, width: 138, height: 51, absolutePosition: { x: 32, y: 29 }, pageBreak: brk });
        pg.push({ text: 'Agenda', fontSize: 28, bold: true, color: '#42AC34', margin: [180, 10, 0, 16] });
        pg.push({ ol: sd.items.map((x) => fill(x, S)), fontSize: 13, margin: [200, 0, 0, 0], lineHeight: 1.5 });
      } else {
        pg.push({ columns: [{ image: images.solevoSmall, width: 138, height: 51 }, { stack: [{ text: fill(sd.title, S), fontSize: 15, bold: true }, sd.sub ? { text: fill(sd.sub, S), fontSize: 9.5, color: BLUE, margin: [0, 2, 0, 0] } : ''], margin: [14, 4, 0, 0] }], margin: [0, 0, 0, 10], pageBreak: brk });
        const bl = sd.blocks || [];
        const render = (b) => {
          if (b.k === 'table') {
            const ws = b.w || b.head.map(() => 1); const tot = ws.reduce((a, c) => a + c, 0);
            return { table: { headerRows: 1, widths: ws.map((w) => (w / tot * 100).toFixed(2) + '%'), body: [b.head.map((h) => ({ text: fill(h, S), bold: true, color: 'white', fillColor: GREEN, fontSize: 9 }))].concat(b.rows.map((r, ri) => r.map((c, i) => ({ text: fill(c, S), fontSize: 9, alignment: i > 0 && fill(c, S).length < 22 ? 'center' : 'left', fillColor: ri % 2 ? '#F2F2F2' : null })))) }, layout: { hLineColor: '#BFBFBF', vLineColor: '#BFBFBF', hLineWidth: () => 0.5, vLineWidth: () => 0.5 } };
          }
          if (b.k === 'kpis') return { columns: b.items.map((it) => ({ stack: [{ canvas: [{ type: 'rect', x: 0, y: 0, w: 230, h: 3, color: GREEN }] }, { text: fill(it.v, S), fontSize: 22, bold: true, color: BLUE, alignment: 'center', margin: [0, 8, 0, 4] }, { text: fill(it.l, S), fontSize: 9.5, color: '#595959', alignment: 'center' }], fillColor: '#F4F7FB' })), columnGap: 12, margin: [0, 0, 0, 8] };
          if (b.k === 'cols') return { columns: b.items.map((it) => ({ stack: [{ canvas: [{ type: 'rect', x: 0, y: 0, w: 240, h: 3, color: GREEN }] }, { text: fill(it.h, S), fontSize: 12, bold: true, color: NAVY, margin: [0, 6, 0, 4] }, { ul: it.l.map((x) => fill(x, S)), fontSize: 10 }] })), columnGap: 14 };
          if (b.k === 'steps') return { columns: b.items.map((it, i) => ({ stack: [{ text: String(i + 1), fontSize: 14, bold: true, color: 'white', background: GREEN, alignment: 'center', width: 22 }, { text: fill(it.h, S), fontSize: 11.5, bold: true, color: NAVY, margin: [0, 6, 0, 3] }, { text: fill(it.t, S), fontSize: 9.5 }] })), columnGap: 12 };
          if (b.k === 'qr') return { columns: [{ width: 210, stack: [images.qr ? { image: images.qr, width: 190 } : '', { text: fill(b.h, S), bold: true, color: NAVY, fontSize: 12, alignment: 'center', margin: [0, 6, 0, 2] }, { text: fill(b.t, S), fontSize: 8.5, color: '#595959', alignment: 'center' }] },
            { stack: b.lines.map((l) => ({ stack: [{ text: fill(l.v, S), fontSize: 20, bold: true, color: BLUE }, { text: fill(l.l, S), fontSize: 9.5, color: '#595959', margin: [0, 0, 0, 14] }] })).concat([{ text: fill(b.sign, S), bold: true, color: NAVY, fontSize: 10.5, margin: [0, 8, 0, 0] }]), margin: [20, 10, 0, 0] }] };
          if (b.k === 'quote') return { columns: [{ width: '64%', stack: [{ text: '“', fontSize: 60, bold: true, color: GREEN, lineHeight: 0.6 }, { text: fill(b.q, S), fontSize: 15, color: NAVY, italics: true, margin: [10, 0, 0, 12] }, { text: fill(b.n, S), bold: true, fontSize: 11.5, margin: [10, 0, 0, 0] }, { text: fill(b.p, S), fontSize: 9.5, color: '#595959', margin: [10, 0, 0, 0] }] },
            { width: '36%', table: { widths: ['*'], body: [[{ stack: [b.who && images['temo' + b.who] ? { image: images['temo' + b.who], width: 90, alignment: 'center', margin: [0, 14, 0, 0] } : '', { text: fill(b.v, S), fontSize: 26, bold: true, color: 'white', alignment: 'center', margin: [0, 26, 0, 6] }, { text: fill(b.l, S), fontSize: 10, color: '#DCE6F5', alignment: 'center', margin: [0, 0, 0, 26] }], fillColor: NAVY }]] }, layout: 'noBorders' }], columnGap: 16 };
          if (b.k === 'flow') return { svg: flowSvg(SKD.FLOW, S, false), width: 760 };
          if (b.k === 'cards') return { columns: b.items.map((it) => ({ stack: [it.n ? { text: it.n, fontSize: 16, bold: true, color: GREEN } : '', { text: fill(it.h, S), fontSize: 11.5, bold: true, color: NAVY, margin: [0, 2, 0, 4] }, { text: fill(it.t, S), fontSize: 10 }] })), columnGap: 14 };
          if (b.k === 'chart') {
            const nums = b.series.map((s) => s.vals.map((v) => parseFloat(fill(v, S)) || 0));
            const stack = b.type === 'stack';
            const totals = b.cats.map((_, i) => stack ? nums.reduce((a, s) => a + s[i], 0) : Math.max(...nums.map((s) => s[i])));
            const max = Math.max(...totals, 1);
            const cols = ['#0B5FA1', '#37A028', '#9BBB59', '#A6A6A6'];
            const ch = 150, cw = 260, gw = cw / b.cats.length;
            const shapes = []; const labels = [];
            b.cats.forEach((cat, i) => {
              let base = 0;
              nums.forEach((s, si) => {
                const v = s[i]; const hh = v / max * ch;
                const bw = stack ? gw * 0.5 : gw * 0.7 / nums.length;
                const x = i * gw + (stack ? gw * 0.25 : gw * 0.15 + si * bw);
                const y = stack ? ch - base - hh : ch - hh;
                shapes.push({ type: 'rect', x, y, w: bw, h: Math.max(hh, 0.5), color: cols[si % 4] });
                if (stack) base += hh;
              });
            });
            return { stack: [{ text: fill(b.title, S), bold: true, color: NAVY, fontSize: 10, margin: [0, 0, 0, 4] }, { canvas: shapes }, { columns: b.cats.map((c, i) => ({ text: c + '\n' + SKV.fr(totals[i], totals[i] < 100 ? 1 : 0), fontSize: 8, alignment: 'center', width: gw })), margin: [0, 2, 0, 0] }, b.series.length > 1 ? { text: b.series.map((s, si) => '■ ' + s.name).join('   '), fontSize: 7.5, color: '#595959', margin: [0, 3, 0, 0] } : ''] };
          }
          return '';
        };
        if (bl.length === 1) pg.push(render(bl[0]));
        else if (bl.length === 2 && bl[0].k === 'kpis' && bl[1].k === 'kpis') { pg.push(render(bl[0])); pg.push({ text: ' ', fontSize: 6 }); pg.push(render(bl[1])); }
        else if (bl.length === 2 && bl[0].k === 'kpis') { pg.push(render(bl[0])); pg.push({ text: ' ', fontSize: 4 }); pg.push(render(bl[1])); }
        else if (bl.length === 2) pg.push({ columns: [Object.assign({ width: '58%' }, { stack: [render(bl[0])] }), { width: '42%', stack: [render(bl[1])] }], columnGap: 16 });
        if (sd.comments) {
          pg.push({ text: 'Commentaires', color: 'white', bold: true, fontSize: 9.5, background: NAVY, margin: [0, 12, 0, 0] });
          pg.push({ table: { widths: ['*'], body: [[{ ul: sd.comments.map((c) => fill(c, S)), fontSize: 9.5 }]] }, layout: { hLineColor: NAVY, vLineColor: NAVY } });
        }
      }
      if (sd.notes && !(opts && opts.noNotes)) {
        pg.push({ text: 'Commentaires orateur — diapositive ' + (idx + 1), fontSize: 8.5, bold: true, color: GREEN, margin: [0, 14, 0, 2], pageBreak: (sd.type === 'title' || sd.type === 'section') ? undefined : undefined, absolutePosition: (sd.type === 'title' || sd.type === 'section') ? { x: 40, y: 360 } : undefined, pageBreak: sd.type === 'cover' ? 'before' : undefined });
        pg.push({ text: fill(sd.notes, S), fontSize: 8, color: '#333333', lineHeight: 1.1, absolutePosition: (sd.type === 'title' || sd.type === 'section') ? { x: 40, y: 376 } : undefined });
      }
      pages.push(...pg);
    });
    return { pageSize: 'A4', pageOrientation: 'landscape', pageMargins: [36, 30, 36, 30], content: pages, defaultStyle: { font: 'Roboto' },
      info: { title: fill(deck.name, S), subject: fill('{{scenario}}', S), author: 'SOLEVO Côte d’Ivoire' },
      footer: (p, n) => ({ columns: [{ text: fill('SISSÊ~KABA • ' + deck.name + ' • {{scenario}} • {{date}}', S), fontSize: 6.5, color: '#808080' }, { text: String(p), alignment: 'right', fontSize: 7, color: '#0B5FA1' }], margin: [36, 8, 36, 0] }) };
  }

  root.SKG = { fill, fillXml, pptx, xlsx, xlsxStrings, docx, pdfDoc: (...a) => deArrow(pdfDoc(...a)), pdfDeck: (...a) => deArrow(pdfDeck(...a)), flowSvg, pdfFlyer: (...a) => deArrow(pdfFlyer(...a)), pdfKakemono: (...a) => deArrow(pdfKakemono(...a)), xlsxTable, xlsxBook };
})(typeof window !== 'undefined' ? window : globalThis);
