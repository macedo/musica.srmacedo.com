// Piano de cauda com samples (Steinway B da VCSL, CC0; veja /audio/piano/README.md).
// Uma nota gravada a cada tom inteiro, de F♯3 (54) a C5 (72), que cobre os acordes do
// backing track. O release imita o abafador descendo quando a tecla é solta.
window.Piano = Sampler.instrument({
  label: 'Piano',
  dir: '/audio/piano',
  notes: [54, 56, 58, 60, 62, 64, 66, 68, 70, 72],
  release: 0.28,
  // o piano gravado está um pouco acima de A = 440 Hz; medido nota a nota
  tune: { 54: 8, 56: 3, 58: 16, 60: 7, 62: 3, 64: 4, 66: 10, 68: 6, 70: 5, 72: 11 },
});
