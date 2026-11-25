// Carrega conjuntos de samples (WAV) sob demanda e toca instrumentos com afinação.
// Usado pela bateria (drums.js), pelo baixo (bass.js) e pelo piano (piano.js).
window.Sampler = (() => {
  function kit(label, dir, names) {
    const buffers = new Map();
    let loading = null;

    async function loadOne(ctx, name) {
      const res = await fetch(`${dir}/${name}.wav`);
      if (!res.ok) throw new Error(`${name}: HTTP ${res.status}`);
      const data = await res.arrayBuffer();
      // Safari antigo só tem a versão com callbacks
      return new Promise((ok, fail) => ctx.decodeAudioData(data, ok, fail));
    }

    // Resolve true quando tudo carregou; false se algo falhou (aí vale o som sintetizado)
    function load(ctx) {
      loading ||= Promise.all(names.map(async (n) => buffers.set(String(n), await loadOne(ctx, n))))
        .then(() => true)
        .catch((err) => {
          console.warn(`${label}: samples indisponíveis, usando som sintetizado.`, err);
          loading = null; // tenta de novo no próximo play
          return false;
        });
      return loading;
    }

    // Só com o conjunto completo: nada de misturar sample com som sintetizado
    const ready = () => buffers.size === names.length;
    const get = (name) => (ready() ? buffers.get(String(name)) : null);

    return { load, ready, get };
  }

  // Instrumento com notas: uma gravação a cada poucos semitons (arquivos <midi>.wav);
  // as notas do meio saem da gravação mais próxima, mudando a velocidade de reprodução.
  // release: segundos para abafar a nota depois da duração pedida.
  // tune: desvio medido de cada gravação, em cents (+ = aguda), corrigido ao tocar.
  function instrument({ label, dir, notes, release, tune = {} }) {
    const k = kit(label, dir, notes);
    const low = notes[0];
    const high = notes[notes.length - 1];

    // Toca a nota MIDI em t, por dur segundos. false = sem sample (use o sintetizado).
    function play(ctx, dest, midi, t, dur, vel = 1) {
      let m = midi;
      while (m < low - 1) m += 12; // fora da extensão gravada: muda de oitava
      while (m > high + 1) m -= 12;
      const base = notes.reduce((a, b) => (Math.abs(b - m) < Math.abs(a - m) ? b : a));
      const buf = k.get(base);
      if (!buf) return false;
      const src = ctx.createBufferSource();
      src.buffer = buf;
      src.playbackRate.value = 2 ** ((m - base) / 12 - (tune[base] || 0) / 1200);
      const g = ctx.createGain();
      const peak = vel * (0.95 + Math.random() * 0.1);
      const end = t + Math.min(dur, buf.duration / src.playbackRate.value - 0.05);
      g.gain.setValueAtTime(peak, t);
      g.gain.setValueAtTime(peak, end);
      g.gain.exponentialRampToValueAtTime(0.0001, end + release);
      src.connect(g).connect(dest);
      src.start(t);
      src.stop(end + release + 0.05);
      return true;
    }

    return { load: k.load, ready: k.ready, play };
  }

  return { kit, instrument };
})();
