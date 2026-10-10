// Generated as sw.js by make build. Do not edit the generated copy.
const CACHE_PREFIX = 'yufuin-bbq-shiori-';
const CACHE_NAME = CACHE_PREFIX + '__VERSION__';
const CORE_ASSETS = __CORE_ASSETS__;
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
