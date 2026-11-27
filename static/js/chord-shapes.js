// Formas de acorde na guitarra (afinação padrão) e o desenho delas em SVG.
// As formas móveis (de E, de A e de D) são transpostas para qualquer fundamental;
// as abertas mais comuns entram primeiro quando existem.
window.ChordShapes = (() => {
  const mod = (n, m) => ((n % m) + m) % m;
  const OPEN_PC = [4, 9, 2, 7, 11, 4]; // E A D G B E, da 6ª para a 1ª corda
  const X = null;                      // corda abafada

  // Casas relativas à fundamental, da 6ª para a 1ª corda. Chaves = sufixo da cifra.
  const MOVABLE = [
    // barre: sufixos em que o dedo 1 faz pestana na casa da fundamental, da corda dela até a 1ª
    { id: 'E', name: 'forma de E', rootString: 6, rootPc: 4, barre: ['', 'm', '7', 'm7'], shapes: {
      '': [0, 2, 2, 1, 0, 0], m: [0, 2, 2, 0, 0, 0], 7: [0, 2, 0, 1, 0, 0], m7: [0, 2, 0, 0, 0, 0],
      '7M': [0, X, 1, 1, 0, X], 'm7(♭5)': [0, X, 0, 0, -1, X], '°': [0, 1, 2, 0, X, X],
    } },
    { id: 'A', name: 'forma de A', rootString: 5, rootPc: 9, barre: ['', 'm', '7', 'm7', '7M'], shapes: {
      '': [X, 0, 2, 2, 2, 0], m: [X, 0, 2, 2, 1, 0], 7: [X, 0, 2, 0, 2, 0], m7: [X, 0, 2, 0, 1, 0],
      '7M': [X, 0, 2, 1, 2, 0], 'm7(♭5)': [X, 0, 1, 0, 1, X], '°': [X, 0, 1, 2, 1, X],
    } },
    { id: 'D', name: 'forma de D', rootString: 4, rootPc: 2, barre: [], shapes: {
      '': [X, X, 0, 2, 3, 2], m: [X, X, 0, 2, 3, 1], 7: [X, X, 0, 2, 1, 2], m7: [X, X, 0, 2, 1, 1],
      '7M': [X, X, 0, 2, 2, 2], 'm7(♭5)': [X, X, 0, 1, 1, 1], '°': [X, X, 0, 1, 3, 1],
    } },
  ];

  // Abertas que não saem das formas móveis com a fundamental na casa 0
  const OPEN = {
    '0:': [X, 3, 2, 0, 1, 0], '7:': [3, 2, 0, 0, 0, 3],
    '0:7': [X, 3, 2, 3, 1, 0], '7:7': [3, 2, 0, 0, 0, 1], '11:7': [X, 2, 1, 2, 0, 2],
    '0:7M': [X, 3, 2, 0, 0, 0], '5:7M': [X, X, 3, 2, 1, 0], '7:7M': [3, X, 0, 0, 0, 2],
  };

  const INTERVALS = { 0: '1', 1: '♭9', 2: '9', 3: '♭3', 4: '3', 5: '4', 6: '♭5', 7: '5', 8: '♯5', 9: '6', 10: '♭7', 11: '7' };

  // Todas as formas conhecidas para a fundamental pc e o sufixo da cifra ('' maior, 'm', '7'…)
  function shapes(pc, suffix) {
    const out = [];
    const seen = new Set();
    const add = (frets, desc, barre = null) => {
      const key = frets.join();
      if (seen.has(key)) return;
      seen.add(key);
      out.push({ frets, desc, barre });
    };
    const open = OPEN[`${mod(pc, 12)}:${suffix}`];
    if (open) add(open, 'Aberto');
    for (const m of MOVABLE) {
      const rel = m.shapes[suffix];
      if (!rel) continue;
      let r = mod(pc - m.rootPc, 12);
      if (rel.some((o) => o !== X && r + o < 0)) r += 12;
      const frets = rel.map((o) => (o === X ? X : r + o));
      const barre = r > 0 && m.barre.includes(suffix)
        ? { fret: r, from: 6 - m.rootString, to: frets[5] === r ? 5 : frets.lastIndexOf(r) }
        : null;
      const desc = r === 0 ? 'Aberto' : `${barre ? 'Pestana' : 'Fundamental'} na ${r}ª casa · ${m.name}`;
      add(frets, desc, barre);
    }
    // da posição mais baixa para a mais alta
    const pos = (s) => Math.min(...s.frets.filter((f) => f !== X && f > 0), 99) - (s.frets.includes(0) ? 0.5 : 0);
    return out.sort((a, b) => pos(a) - pos(b));
  }

  // Desenho: cordas na vertical (6ª à esquerda), casas na horizontal
  // barre: { fret, from, to } com as cordas de 0 (6ª) a 5 (1ª)
  function svg(frets, rootPc, { lefty = false, barre = null } = {}) {
    const W = 150, top = 34, left = 26, gap = 20, fretH = 26, rows = 5;
    const played = frets.filter((f) => f !== X && f > 0);
    const max = Math.max(...played, 0);
    const base = max <= 4 ? 1 : Math.min(...played);
    const x = (s) => left + (lefty ? 5 - s : s) * gap;
    let g = '';
    // casas e cordas
    for (let r = 0; r <= rows; r++) g += `<line class="fret" x1="${left}" x2="${left + 5 * gap}" y1="${top + r * fretH}" y2="${top + r * fretH}"/>`;
    for (let s = 0; s < 6; s++) g += `<line class="string" x1="${x(s)}" x2="${x(s)}" y1="${top}" y2="${top + rows * fretH}"/>`;
    if (base === 1) g += `<rect class="nut" x="${left - 2}" y="${top - 5}" width="${5 * gap + 4}" height="6" rx="2"/>`;
    else g += `<text class="pos" x="${left - 10}" y="${top + fretH / 2}">${base}</text>`;
    if (barre) {
      const a = Math.min(x(barre.from), x(barre.to)), b = Math.max(x(barre.from), x(barre.to));
      g += `<rect class="barre" x="${a - 9}" y="${top + (barre.fret - base + 0.5) * fretH - 9}" width="${b - a + 18}" height="18" rx="9"/>`;
    }
    frets.forEach((f, s) => {
      if (f === X) { g += `<text class="mute" x="${x(s)}" y="${top - 13}">×</text>`; return; }
      const pc = mod(OPEN_PC[s] + f, 12);
      const iv = INTERVALS[mod(pc - rootPc, 12)];
      const cls = iv === '1' ? 'dot root' : 'dot';
      if (f === 0) {
        g += `<circle class="open ${iv === '1' ? 'root' : ''}" cx="${x(s)}" cy="${top - 14}" r="6"/>`;
        return;
      }
      const cy = top + (f - base + 0.5) * fretH;
      g += `<circle class="${cls}" cx="${x(s)}" cy="${cy}" r="9"/><text class="iv" x="${x(s)}" y="${cy}">${iv}</text>`;
    });
    // intervalo das cordas soltas, embaixo
    frets.forEach((f, s) => {
      if (f === X) return;
      const pc = mod(OPEN_PC[s] + f, 12);
      if (f === 0) g += `<text class="open-iv" x="${x(s)}" y="${top + rows * fretH + 14}">${INTERVALS[mod(pc - rootPc, 12)]}</text>`;
    });
    return `<svg class="chord-diagram" viewBox="0 0 ${W} ${top + rows * fretH + 22}" role="img">${g}</svg>`;
  }

  // Notas soando, da corda mais grave para a mais aguda (MIDI), para tocar a forma
  const OPEN_MIDI = [40, 45, 50, 55, 59, 64];
  const midis = (frets) => frets.flatMap((f, s) => (f === X ? [] : [OPEN_MIDI[s] + f]));

  return { shapes, svg, midis, OPEN_PC };
})();
