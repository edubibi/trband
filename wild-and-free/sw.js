const CACHE_NAME = 'wf-press-v1.1';
const ASSETS = [
  './',
  './index.html',
  './manifest.json',
  './icon-512.png',
  './wild_and_free_background_1774609305871.png',
  './assets/wild_and_free_preview.mp3',
  './assets/promo_poster.png'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
  );
});

self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
