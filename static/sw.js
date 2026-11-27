const CACHE_NAME = "srmacedo-musica-v9";
const ASSETS = [
  "/",
  "/index.html",
  "/escalas.html",
  "/metronomo.html",
  "/backing-track.html",
  "/afinador.html",
  "/campo-harmonico.html",
  "/css/application.css?v=1aebe6b0",
  "/css/base.css?v=584ccd30",
  "/css/backing-track.css?v=2def0003",
  "/css/metronomo.css?v=788d041d",
  "/css/escalas.css?v=4b7b37b3",
  "/css/campo-harmonico.css?v=4833acf5",
  "/js/chord-shapes.js?v=cafd7b98",
  "/js/harmony.js?v=d676d04e",
  "/css/afinador.css?v=5b630ee6",
  "/js/tunings.js?v=cd5975f3",
  "/js/pitch.js?v=c35c068d",
  "/js/sampler.js?v=d17a215b",
  "/js/bass.js?v=6f05d30e",
  "/audio/bass/28.wav",
  "/audio/bass/31.wav",
  "/audio/bass/34.wav",
  "/audio/bass/37.wav",
  "/audio/bass/40.wav",
  "/audio/bass/43.wav",
  "/audio/bass/46.wav",
  "/audio/bass/49.wav",
  "/audio/bass/52.wav",
  "/js/piano.js?v=b868dad0",
  "/audio/piano/54.wav",
  "/audio/piano/56.wav",
  "/audio/piano/58.wav",
  "/audio/piano/60.wav",
  "/audio/piano/62.wav",
  "/audio/piano/64.wav",
  "/audio/piano/66.wav",
  "/audio/piano/68.wav",
  "/audio/piano/70.wav",
  "/audio/piano/72.wav",
  "/js/drums.js?v=feb2f285",
  "/audio/drums/kick.wav",
  "/audio/drums/snare.wav",
  "/audio/drums/hat.wav",
  "/audio/drums/hat-tight.wav",
  "/audio/drums/crash.wav",
  "/audio/drums/ride.wav",
  "/js/common.js?v=9a1c26f3",
  "/images/icon.png"
]

self.addEventListener("install", (e) => {
  e.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener("fetch", (e) => {
  e.respondWith(
    fetch(e.request).catch(() => caches.match(e.request))
  );
});
