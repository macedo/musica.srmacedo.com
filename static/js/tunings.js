// Afinações da guitarra, da 6ª corda (grave) para a 1ª: nota MIDI de cada corda solta e nome.
// Usado pelas escalas (escalas.html) e pelo afinador (afinador.html).
window.TUNINGS = [
  { id: 'std', name: 'Afinação padrão (E A D G B E)', open: [40, 45, 50, 55, 59, 64], names: 'E A D G B E' },
  { id: 'eb', name: 'Meio tom abaixo (E♭)', open: [39, 44, 49, 54, 58, 63], names: 'E♭ A♭ D♭ G♭ B♭ E♭' },
  { id: 'dropd', name: 'Drop D (D A D G B E)', open: [38, 45, 50, 55, 59, 64], names: 'D A D G B E' },
  { id: 'd', name: 'Um tom abaixo (D G C F A D)', open: [38, 43, 48, 53, 57, 62], names: 'D G C F A D' },
  { id: 'dropc', name: 'Drop C (C G C F A D)', open: [36, 43, 48, 53, 57, 62], names: 'C G C F A D' },
  { id: 'dadgad', name: 'DADGAD', open: [38, 45, 50, 55, 57, 62], names: 'D A D G A D' },
  { id: 'openg', name: 'Open G (D G D G B D)', open: [38, 43, 50, 55, 59, 62], names: 'D G D G B D' },
  { id: 'opend', name: 'Open D (D A D F♯ A D)', open: [38, 45, 50, 54, 57, 62], names: 'D A D F♯ A D' },
].map((t) => ({ ...t, names: t.names.split(' ') }));
