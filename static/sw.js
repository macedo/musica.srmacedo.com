const CACHE_NAME = "srmacedo-musica-v4";
const ASSETS = [
  "/",
  "/index.html",
  "/escalas.html",
  "/metronomo.html",
  "/backing-track.html",
  "/css/application.css?v=1aebe6b0",
  "/css/base.css?v=584ccd30",
  "/css/backing-track.css?v=2def0003",
  "/css/metronomo.css?v=788d041d",
  "/css/escalas.css?v=4b7b37b3",
  "/js/drums.js?v=8a1e2096",
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
