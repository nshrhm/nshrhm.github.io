// Generated as sw.js by make build. Do not edit the generated copy.
const CACHE_PREFIX = 'yufuin-bbq-shiori-';
const CACHE_NAME = CACHE_PREFIX + '3a9b83956ab33b02';
const CORE_ASSETS = [
  "./",
  "./index.html",
  "./links.html",
  "./print.html",
  "./styles.css",
  "./data.js",
  "./views.js",
  "./app.js",
  "./manifest.webmanifest",
  "./assets/icons/apple-touch-icon.png",
  "./assets/icons/favicon-16.png",
  "./assets/icons/favicon-32.png",
  "./assets/icons/favicon.ico",
  "./assets/icons/favicon.svg",
  "./assets/icons/icon-192.png",
  "./assets/icons/icon-512.png",
  "./assets/icons/maskable-512.png",
  "./assets/icons/yufuin.svg",
  "./assets/illust/bbq.svg",
  "./assets/illust/family.svg",
  "./assets/illust/map.svg",
  "./assets/illust/onsen.svg",
  "./assets/illust/yufu-mountain.svg",
  "./assets/photos/kinrin.jpg",
  "./assets/photos/sagiridai.jpg",
  "./assets/photos/town.jpg",
  "./assets/photos/yufudake.jpg",
  "./assets/qrcode/qr-aeon-map.png",
  "./assets/qrcode/qr-amber-map.png",
  "./assets/qrcode/qr-kinrin-map.png",
  "./assets/qrcode/qr-nexco.png",
  "./assets/qrcode/qr-yufuin-info.png"
];
const scopeURL = new URL('./', self.location.href);

self.addEventListener('install', event => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    await cache.addAll(CORE_ASSETS.map(url => new Request(new URL(url, scopeURL), {cache:'reload'})));
    // v2 has no update UI: migrate it once after the complete new bundle is saved.
    if (await caches.has(CACHE_PREFIX + 'v2')) await self.skipWaiting();
  })());
});
self.addEventListener('message', event => {
  if (event.data?.type === 'ACTIVATE_UPDATE') event.waitUntil(self.skipWaiting());
});
self.addEventListener('activate', event => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    const legacy = keys.includes(CACHE_PREFIX + 'v2');
    await Promise.all(keys.filter(key => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME).map(key => caches.delete(key)));
    await self.clients.claim();
    if (legacy) {
      const clients = await self.clients.matchAll({type:'window'});
      clients.filter(client => {
        const url = new URL(client.url);
        return url.origin === scopeURL.origin && url.pathname.startsWith(scopeURL.pathname);
      // Navigation fetches need activation to finish; never await them here.
      }).forEach(client => { client.navigate(client.url).catch(() => {}); });
    }
  })());
});
self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);
  if (event.request.method !== 'GET' || url.origin !== scopeURL.origin || !url.pathname.startsWith(scopeURL.pathname)) return;
  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(event.request, {ignoreSearch:true});
    if (cached) return cached;
    try { return await fetch(event.request); }
    catch {
      if (event.request.mode === 'navigate') return (await cache.match(new URL('index.html',scopeURL))) || Response.error();
      return Response.error();
    }
  })());
});
