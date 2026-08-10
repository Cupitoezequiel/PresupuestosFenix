const CACHE_NAME = 'fenix-v2';
const BASE = new URL('.', self.registration.scope).pathname;
const ASSETS = [
  '',
  'index.html',
  'manifest.json',
  'css/app.css',
  'js/app.js',
  'js/format.js',
  'js/storage.js',
  'js/formulario.js',
  'js/preview.js',
  'js/historial.js',
  'js/pdf.js',
  'js/lib/jspdf.umd.min.js',
  'js/lib/html2canvas.min.js',
  'img/FenixBanner.png',
  'img/FenixIcono.png',
].map(p => BASE + p);

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
  if (event.request.method !== 'GET') return;
  // Red primero: si hay conexión, siempre trae la versión más nueva y
  // actualiza la caché. Si falla (sin conexión), usa lo último cacheado.
  event.respondWith(
    fetch(event.request)
      .then(response => {
        if (response.ok) {
          const copia = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copia));
        }
        return response;
      })
      .catch(() => caches.match(event.request))
  );
});
