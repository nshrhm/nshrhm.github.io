const CACHE_NAME = 'yufuin-bbq-shiori-v1';
const CORE_ASSETS = [
  './',
  './index.html',
  './links.html',
  './print.html',
  './styles.css',
  './data.js',
  './app.js',
  './manifest.webmanifest',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/illust/yufu-mountain.svg',
  './assets/illust/bbq.svg',
  './assets/illust/onsen.svg',
  './assets/illust/family.svg',
  './assets/illust/map.svg',
  './assets/qrcode/qr-amber-map.png',
  './assets/qrcode/qr-aeon-map.png',
  './assets/qrcode/qr-nexco.png',
  './assets/qrcode/qr-yufuin-info.png',
  './assets/qrcode/qr-kinrin-map.png'
];

self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(CORE_ASSETS)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys => Promise.all(keys.filter(key => key !== CACHE_NAME).map(key => caches.delete(key)))).then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response && response.ok && new URL(event.request.url).origin === self.location.origin) {
          const copy = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
        }
        return response;
      }).catch(() => caches.match('./index.html'));
    })
  );
});
