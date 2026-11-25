// Bateria acústica com samples (Karoryfer Samples, CC0; veja /audio/drums/README.md).
window.Drums = (() => {
  const kit = Sampler.kit('Bateria', '/audio/drums', ['kick', 'snare', 'hat', 'hat-tight', 'crash', 'ride']);

  // Toca uma peça em t (relógio do AudioContext). vel 0–1. false = sem sample.
  function play(ctx, dest, name, t, vel = 1) {
    const buf = kit.get(name);
    if (!buf) return false;
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

  return { load: kit.load, ready: kit.ready, play };
})();
