# Samples de piano

Notas do piano de cauda **Steinway B** da [VCSL — Versilian Community Sample Library](https://github.com/sgossner/VCSL)
(`Chordophones/Zithers/Grand Piano, Steinway B/Sus`, microfone próximo), distribuída
sob **CC0 1.0** (domínio público, sem exigência de crédito). O crédito aqui é por
cortesia.

Intensidade média (`vl3`), primeira repetição (`rr1`), uma nota a cada tom inteiro.
Os arquivos têm o número MIDI da nota (C4 = 60):

| Arquivo  | Nota | Original                                |
|----------|------|-----------------------------------------|
| `54.wav` | F♯3  | `JHPiano_Sus_Close_F#3_vl3_rr1.wav`     |
| `56.wav` | G♯3  | `JHPiano_Sus_Close_G#3_vl3_rr1.wav`     |
| `58.wav` | A♯3  | `JHPiano_Sus_Close_A#3_vl3_rr1.wav`     |
| `60.wav` | C4   | `JHPiano_Sus_Close_C4_vl3_rr1.wav`      |
| `62.wav` | D4   | `JHPiano_Sus_Close_D4_vl3_rr1.wav`      |
| `64.wav` | E4   | `JHPiano_Sus_Close_E4_vl3_rr1.wav`      |
| `66.wav` | F♯4  | `JHPiano_Sus_Close_F#4_vl3_rr1.wav`     |
| `68.wav` | G♯4  | `JHPiano_Sus_Close_G#4_vl3_rr1.wav`     |
| `70.wav` | A♯4  | `JHPiano_Sus_Close_A#4_vl3_rr1.wav`     |
| `72.wav` | C5   | `JHPiano_Sus_Close_C5_vl3_rr1.wav`      |

Processamento: mixados em mono, cortados a partir do ataque, 3 s com fade-out cosseno,
filtro passa-baixas (FIR, 10 kHz) e reamostragem para 22,05 kHz. O volume do primeiro
meio segundo foi igualado entre as notas (a gravação original do A♯3 é ~6 dB mais
baixa que as vizinhas), com pico máximo de -0,5 dBFS. WAV 16-bit mono.

A gravação está entre 2 e 16 cents acima de A = 440 Hz; `js/piano.js` corrige isso ao tocar.
