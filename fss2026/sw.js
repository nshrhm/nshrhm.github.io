const CACHE_PREFIX = 'fss2026-offline-';
// Bump this version after changing published assets, then regenerate offline-assets.json.
const CACHE_NAME = `${CACHE_PREFIX}v2`;
const ASSET_MANIFEST_URL = new URL('./offline-assets.json', self.location.href);
const OFFLINE_URL = new URL('./index.html', self.location.href).href;

async function loadAssetList() {
  const response = await fetch(ASSET_MANIFEST_URL, { cache: 'no-store' });
  if (!response.ok) {
    throw new Error(`Offline asset manifest returned ${response.status}`);
  }

  const assets = await response.json();
  if (!Array.isArray(assets) || assets.some((asset) => typeof asset !== 'string')) {
    throw new TypeError('Offline asset manifest must be an array of paths');
  }

  return assets.map((asset) => new URL(asset, self.location.href).href);
}

self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    const assets = await loadAssetList();
    await cache.addAll(assets);
    await self.skipWaiting();
  })());
});

self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys
      .filter((key) => key.startsWith(CACHE_PREFIX) && key !== CACHE_NAME)
      .map((key) => caches.delete(key)));
    await self.clients.claim();
  })());
});

async function rangeResponse(request, cachedResponse) {
  const range = request.headers.get('range');
  const match = /^bytes=(\d*)-(\d*)$/.exec(range || '');
  if (!match) {
    return cachedResponse;
  }

  const body = await cachedResponse.arrayBuffer();
  const size = body.byteLength;
  let start;
  let end;

  if (match[1] === '') {
    const suffixLength = Number(match[2]);
    start = Math.max(size - suffixLength, 0);
    end = size - 1;
  } else {
    start = Number(match[1]);
    end = match[2] === '' ? size - 1 : Math.min(Number(match[2]), size - 1);
  }

  if (!Number.isFinite(start) || !Number.isFinite(end) || start > end || start >= size) {
    return new Response(null, {
      status: 416,
      headers: { 'Content-Range': `bytes */${size}` },
    });
  }

  const headers = new Headers(cachedResponse.headers);
  headers.set('Accept-Ranges', 'bytes');
  headers.set('Content-Length', String(end - start + 1));
  headers.set('Content-Range', `bytes ${start}-${end}/${size}`);

  return new Response(body.slice(start, end + 1), {
    status: 206,
    statusText: 'Partial Content',
    headers,
  });
}

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') {
    return;
  }

  const url = new URL(request.url);
  const scopePath = new URL(self.registration.scope).pathname;
  if (url.origin !== self.location.origin || !url.pathname.startsWith(scopePath)) {
    return;
  }

  event.respondWith((async () => {
    const cache = await caches.open(CACHE_NAME);
    const cached = await cache.match(request, { ignoreSearch: request.mode === 'navigate' });

    if (cached) {
      return request.headers.has('range')
        ? rangeResponse(request, cached)
        : cached;
    }

    try {
      const response = await fetch(request);
      if (response.ok && response.status === 200) {
        await cache.put(request, response.clone());
      }
      return response;
    } catch (error) {
      if (request.mode === 'navigate') {
        const fallback = await cache.match(OFFLINE_URL);
        if (fallback) {
          return fallback;
        }
      }
      throw error;
    }
  })());
});
