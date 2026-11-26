// Teoria compartilhada: acordes, progressões e grafia dos tons.
// Usado pelo backing track (backing-track.html) e pelo campo harmônico (campo-harmonico.html).
window.Harmony = (() => {
  const mod = (n, m) => ((n % m) + m) % m;

  const MAJOR = [0, 2, 4, 5, 7, 9, 11];
  const ROMAN = ['I', 'II', 'III', 'IV', 'V', 'VI', 'VII'];
  const SHARP = ['C', 'C♯', 'D', 'D♯', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'A♯', 'B'];
  const FLAT = ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'G♭', 'G', 'A♭', 'A', 'B♭', 'B'];
  // Grafia usual da tônica em cada modo (D♭ maior, mas C♯ menor...)
  const ROOT_LABELS = {
    major: ['C', 'D♭', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'A♭', 'A', 'B♭', 'B'],
    minor: ['C', 'C♯', 'D', 'E♭', 'E', 'F', 'F♯', 'G', 'G♯', 'A', 'B♭', 'B'],
  };
  // Tons naturais que usam bemóis: F maior; Dm, Gm, Cm, Fm
  const FLAT_NATURALS = { major: [5], minor: [0, 2, 5, 7] };
  const MODES = [{ id: 'major', name: 'Maior' }, { id: 'minor', name: 'Menor' }];

  const QUALITIES = {
    maj: { iv: [0, 4, 7], suffix: '' },
    min: { iv: [0, 3, 7], suffix: 'm' },
    dom7: { iv: [0, 4, 7, 10], suffix: '7' },
    min7: { iv: [0, 3, 7, 10], suffix: 'm7' },
    maj7: { iv: [0, 4, 7, 11], suffix: '7M' },
  };

  // Graus em algarismos romanos: maiúsculo = maior, minúsculo = menor
  function parseChord(tok) {
    const [, acc, rn, ext = ''] = tok.match(/^(b?)(VII|VI|IV|V|III|II|I)(maj7|7)?$/i);
    const upper = rn === rn.toUpperCase();
    const quality = upper ? (ext === '7' ? 'dom7' : ext === 'maj7' ? 'maj7' : 'maj') : (ext === '7' ? 'min7' : 'min');
    const degree = ROMAN.indexOf(rn.toUpperCase()); // 0–6: dá a letra do acorde no tom
    return {
      degree,
      semi: mod(MAJOR[degree] - (acc ? 1 : 0), 12),
      quality,
      roman: (acc ? '♭' : '') + rn + (ext === 'maj7' ? '7M' : ext),
    };
  }

  const P = (id, name, tag, chords, style, scales, fixed = false) => ({ id, name, tag, chords: chords.split(' ').map(parseChord), style, scales, fixed });
  const PROGRESSIONS = {
    major: [
      P('pop', 'I–V–vi–IV', 'Pop', 'I V vi IV', 'ballad', ['pent-maj', 'major']),
      P('rock', 'I–IV–I–V', 'Rock', 'I IV I V', 'rock', ['pent-maj', 'major']),
      P('fifties', 'I–vi–IV–V', 'Anos 50', 'I vi IV V', 'ballad', ['pent-maj', 'major']),
      P('mixo', 'I–♭VII–IV–I', 'Rock clássico', 'I bVII IV I', 'rock', ['mixolydian', 'pent-maj']),
      P('blues', 'Blues 12 compassos', 'Blues', 'I7 IV7 I7 I7 IV7 IV7 I7 I7 V7 IV7 I7 V7', 'shuffle', ['pent-min', 'blues', 'pent-maj'], true),
      P('jazz', 'ii–V–I', 'Jazz', 'ii7 V7 Imaj7 Imaj7', 'ballad', ['major', 'pent-maj']),
      P('vamp', 'I–IV', 'Vamp', 'I IV', 'rock', ['pent-maj', 'mixolydian']),
    ],
    minor: [
      P('epic', 'i–♭VI–♭III–♭VII', 'Épico', 'i bVI bIII bVII', 'ballad', ['pent-min', 'minor']),
      P('minrock', 'i–♭VI–♭VII–i', 'Rock', 'i bVI bVII i', 'rock', ['pent-min', 'minor']),
      P('andaluz', 'i–♭VII–♭VI–V', 'Andaluza', 'i bVII bVI V', 'rock', ['harm-minor', 'pent-min']),
      P('mblues', 'Blues menor', 'Blues', 'i7 iv7 i7 i7 iv7 iv7 i7 i7 bVI7 V7 i7 V7', 'shuffle', ['pent-min', 'blues'], true),
      P('dorian', 'i–IV', 'Dórico', 'i7 IV7', 'rock', ['dorian', 'pent-min']),
      P('vampmin', 'i–iv', 'Vamp', 'i iv', 'ballad', ['pent-min', 'minor']),
    ],
  };
  const SCALE_NAMES = {
    'pent-maj': 'Pentatônica maior', 'pent-min': 'Pentatônica menor', blues: 'Blues', major: 'Maior', minor: 'Menor natural',
    mixolydian: 'Mixolídio', dorian: 'Dórico', 'harm-minor': 'Menor harmônica',
  };

  // Acorde fechado em volta do D4, na região que o piano gravado cobre.
  // quality: nome em QUALITIES ou a lista de intervalos (ex.: [0, 3, 6, 10])
  function voicing(pc, quality) {
    const iv = Array.isArray(quality) ? quality : QUALITIES[quality].iv;
    let best = null;
    for (const base of [48, 60]) {
      let notes = iv.map((i) => base + pc + i);
      for (let inv = 0; inv < notes.length; inv++) {
        const avg = notes.reduce((a, b) => a + b, 0) / notes.length;
        const score = Math.abs(avg - 62);
        if (!best || score < best.score) best = { notes: [...notes], score };
        notes = [...notes.slice(1), notes[0] + 12];
      }
    }
    return best.notes;
  }

  return { MAJOR, ROMAN, SHARP, FLAT, ROOT_LABELS, FLAT_NATURALS, MODES, QUALITIES, parseChord, PROGRESSIONS, SCALE_NAMES, voicing };
})();
