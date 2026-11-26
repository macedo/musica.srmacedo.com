// Detecção da frequência fundamental pelo algoritmo YIN (de Cheveigné e Kawahara, 2002).
// Usado pelo afinador. Funciona bem com corda dedilhada, que tem harmônicos fortes:
// procura o período que melhor repete o sinal, em vez do pico mais alto do espectro.
window.Pitch = (() => {
  let d = new Float32Array(0);

  // buf: amostras (Float32Array), sr: taxa de amostragem.
  // Devolve { freq, clarity, rms } ou null quando não há nota clara.
  function detect(buf, sr, { minHz = 55, maxHz = 1200, threshold = 0.15, minRms = 0.002 } = {}) {
    const minLag = Math.max(2, Math.floor(sr / maxHz));
    const maxLag = Math.ceil(sr / minHz);
    // janela de ~45 ms: cobre dois períodos da nota mais grave sem pesar demais na CPU
    const W = Math.min(buf.length - maxLag - 2, Math.round(sr * 0.045));
    if (W < maxLag) throw new Error('buffer curto demais para a nota mais grave');

    let energy = 0;
    for (let i = 0; i < W; i++) energy += buf[i] * buf[i];
    const rms = Math.sqrt(energy / W);
    if (rms < minRms) return { freq: null, clarity: 0, rms };

    if (d.length < maxLag + 2) d = new Float32Array(maxLag + 2);
    // função diferença: quanto o sinal muda quando deslocado de tau amostras
    for (let tau = 1; tau <= maxLag + 1; tau++) {
      let s = 0;
      for (let i = 0; i < W; i++) {
        const v = buf[i] - buf[i + tau];
        s += v * v;
      }
      d[tau] = s;
    }
    // normalização pela média acumulada (evita escolher tau = 0 e oitavas acima)
    d[0] = 1;
    let sum = 0;
    for (let tau = 1; tau <= maxLag + 1; tau++) {
      sum += d[tau];
      d[tau] = sum ? (d[tau] * tau) / sum : 1;
    }

    // primeiro vale abaixo do limiar
    let tau = -1;
    for (let t = minLag; t <= maxLag; t++) {
      if (d[t] < threshold) {
        while (t + 1 <= maxLag && d[t + 1] < d[t]) t++;
        tau = t;
        break;
      }
    }
    if (tau < 0) return { freq: null, clarity: 0, rms };

    // interpolação parabólica para precisão abaixo de uma amostra
    const a = d[tau - 1], b = d[tau], c = d[tau + 1];
    const den = a - 2 * b + c;
    const shift = den > 0 ? (0.5 * (a - c)) / den : 0;
    return { freq: sr / (tau + shift), clarity: 1 - b, rms };
  }

  return { detect };
})();
