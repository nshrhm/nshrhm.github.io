// 配布データや画面を更新したら v1 を v2 などに変更する。
const prefix = `harbor-walk:${self.registration.scope}:`;
const version = `${prefix}v1`;
const files = [
  "./", "./index.html", "./styles.css", "./app.js", "./data.js",
  "./manifest.json", "./icon-192.png", "./icon-512.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(caches.open(version).then((cache) => cache.addAll(files)));
});

self.addEventListener("activate", (event) => {
  event.waitUntil(caches.keys().then((keys) => Promise.all(
    keys.filter((key) => key.startsWith(prefix) && key !== version)
      .map((key) => caches.delete(key)),
  )).then(() => self.clients.claim()));
});

self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET" || !event.request.url.startsWith(self.registration.scope)) return;
  event.respondWith(caches.open(version).then((cache) => cache.match(event.request, {ignoreSearch: event.request.mode === "navigate"}))
    .then((response) => response || fetch(event.request)));
});
