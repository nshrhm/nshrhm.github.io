const CACHE = 'akizuki-shiori-v1';
const ASSETS = [
  './','./index.html','./links.html','./manifest.webmanifest',
  './assets/css/styles.css','./assets/js/app.js',
  './assets/icons/icon-192.png','./assets/icons/icon-512.png',
  './assets/images/hero-meganebashi.jpg','./assets/images/photo-kuro-mon.jpg','./assets/images/photo-nagayamon.jpg',
  './assets/images/photo-sakura.jpg','./assets/images/photo-notori-river.jpg',
  './assets/images/route-illustration.svg','./assets/images/mushi-zouni.svg','./assets/images/history-scroll.svg'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim()));
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  event.respondWith(caches.match(req).then(cached => cached || fetch(req).then(res => {
    const copy = res.clone();
    if (new URL(req.url).origin === location.origin) caches.open(CACHE).then(cache => cache.put(req, copy));
    return res;
  }).catch(() => caches.match('./index.html'))));
});
