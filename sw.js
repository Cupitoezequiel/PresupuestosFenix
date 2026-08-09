const CACHE_NAME = 'fenix-v1';
const ASSETS = [
  '/',
  '/index.html',
  '/manifest.json',
  '/css/app.css',
  '/js/app.js',
  '/js/format.js',
  '/js/storage.js',
  '/js/formulario.js',
  '/js/preview.js',
  '/js/historial.js',
  '/js/pdf.js',
  '/js/lib/jspdf.umd.min.js',
  '/js/lib/html2canvas.min.js',
  '/img/FenixBanner.png',
  '/img/FenixIcono.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(cached => cached || fetch(event.request))
  );
});
