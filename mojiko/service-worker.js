const CACHE_PREFIX = 'mojiko-ganryujima-shiori-';
const CACHE_NAME = CACHE_PREFIX + '2026-11-13-v2';
const APP_SHELL = [
  './', './index.html', './plans.html', './map.html', './restaurants.html', './story.html', './links.html', './offline.html',
  './assets/css/style.css', './assets/js/app.js', './assets/img/retro-wave.svg', './assets/img/map-illustration.svg', './assets/img/curry-pudding.svg', './assets/img/ferry-island.svg',
  './assets/icons/icon-192.png', './assets/icons/icon-512.png', './manifest.webmanifest', './mojiko-ganryujima-daytrip.ics'
];
self.addEventListener('install', event => {
  event.waitUntil(caches.open(CACHE_NAME).then(cache => cache.addAll(APP_SHELL)).then(() => self.skipWaiting()));
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const oldKeys = (await caches.keys()).filter(k => k.startsWith(CACHE_PREFIX) && k !== CACHE_NAME);
    await Promise.all(oldKeys.map(k => caches.delete(k)));
    await self.clients.claim();
    // The former app has no update handler. Refresh its open pages once so that
    // an old, weekday-incompatible itinerary does not remain on screen.
    if (oldKeys.length) {
      const windows = await self.clients.matchAll({type: 'window'});
      // Navigation waits for activation to finish, so do not await it here.
      windows.filter(c => c.url.startsWith(self.registration.scope)).forEach(c => { c.navigate(c.url).catch(() => {}); });
    }
  })());
});
self.addEventListener('fetch', event => {
  const req = event.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== location.origin || !url.href.startsWith(self.registration.scope)) return;
  const cached = async () => (await caches.open(CACHE_NAME)).match(req, {ignoreSearch: true});
  const save = async res => {
    if (res.ok) await (await caches.open(CACHE_NAME)).put(req, res.clone());
    return res;
  };
  if (req.mode === 'navigate') {
    event.respondWith(fetch(req).then(save).catch(async () => (await cached()) || (await caches.open(CACHE_NAME)).match('./offline.html')));
    return;
  }
  event.respondWith(cached().then(res => res || fetch(req).then(save)).catch(() => Response.error()));
});
