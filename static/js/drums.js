// Bateria acústica com samples (Karoryfer Samples, CC0; veja /audio/drums/README.md).
// Os arquivos só são baixados na primeira vez que alguém toca. Se falharem, quem
// usa este módulo continua com o som sintetizado.
window.Drums = (() => {
  const NAMES = ['kick', 'snare', 'hat', 'hat-tight', 'crash', 'ride'];
  const buffers = new Map();
  let loading = null;

  async function loadOne(ctx, name) {
    const res = await fetch(`/audio/drums/${name}.wav`);
    if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
    const data = await res.arrayBuffer();
    // Safari antigo só tem a versão com callbacks
    return new Promise((ok, fail) => ctx.decodeAudioData(data, ok, fail));
  }

  // Resolve true quando tudo carregou; false se algo falhou (aí vale o som sintetizado)
  function load(ctx) {
    loading ||= Promise.all(NAMES.map(async (n) => buffers.set(n, await loadOne(ctx, n))))
      .then(() => true)
      .catch((err) => {
        console.warn('Bateria: samples indisponíveis, usando som sintetizado.', err);
        loading = null; // tenta de novo no próximo play
        return false;
      });
    return loading;
  }

  const ready = () => buffers.size === NAMES.length;

  // Toca uma peça em t (relógio do AudioContext). vel 0–1.
  function play(ctx, dest, name, t, vel = 1) {
    // só com o kit completo: nada de misturar sample com som sintetizado
    if (!ready()) return false;
    const buf = buffers.get(name);
    const src = ctx.createBufferSource();
    src.buffer = buf;
    // pequenas variações para não soar como uma metralhadora
    src.playbackRate.value = 1 + (Math.random() - 0.5) * 0.03;
    const g = ctx.createGain();
    g.gain.value = vel * (0.94 + Math.random() * 0.12);
    src.connect(g).connect(dest);
    src.start(t);
    return true;
  }

  return { load, ready, play };
})();
