const CACHE_NAME = 'miyazaki-takachiho-shiori-v1';
const ASSETS = [
  './', './index.html', './links.html', './styles.css', './app.js', './manifest.webmanifest',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png',
  './assets/illustrations/hero.svg', './assets/illustrations/ocean.svg', './assets/illustrations/moai.svg',
  './assets/illustrations/udo.svg', './assets/illustrations/gorge.svg', './assets/illustrations/train.svg',
  './assets/illustrations/cave.svg', './assets/illustrations/castle.svg', './assets/illustrations/car.svg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.map(key => key === CACHE_NAME ? null : caches.delete(key)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  if (event.request.method !== 'GET') return;
  event.respondWith(caches.match(event.request).then(cached => cached || fetch(event.request).then(response => {
    const copy = response.clone();
    caches.open(CACHE_NAME).then(cache => cache.put(event.request, copy));
    return response;
  }).catch(() => caches.match('./index.html'))));
});
