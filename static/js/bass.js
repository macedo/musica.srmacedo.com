// Baixo elétrico com samples (Karoryfer "Black And Blue Basses", CC0; veja /audio/bass/README.md).
// Uma nota gravada a cada 3 semitons, de E1 (28) a E3 (52). O release curto imita a
// mão do baixista abafando a corda.
window.Bass = Sampler.instrument({
  label: 'Baixo',
  dir: '/audio/bass',
  notes: [28, 31, 34, 37, 40, 43, 46, 49, 52],
  release: 0.07,
  // desvio de afinação medido em cada gravação
  tune: { 28: 3, 31: 3, 34: 4, 37: 1, 40: 1, 43: -7, 46: 0, 49: -4, 52: -7 },
});
