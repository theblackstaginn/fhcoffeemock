/* ===========================
   FARMHOUSE MOCK — SERVICE WORKER
   Cache-first for static assets.
   =========================== */

const CACHE = "fh-mock-v1";

const ASSETS = [
  "./",
  "index.html",
  "styles.css",
  "app.js",
  "manifest.webmanifest",
  "favicon.PNG",
  "icon-192.PNG",
  "icon-512.PNG",
  "coffee-bg.jpg",
  "bg-mobile.jpg",
  "sf-hero.jpg",
  "hours-panel.PNG",
  "menu.jpg",
  "counter.jpg",
  "r-s-coffee.jpg"
];

self.addEventListener("install", (evt) => {
  evt.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (evt) => {
  evt.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.map((k) => (k === CACHE ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (evt) => {
  const req = evt.request;
  if(req.method !== "GET") return;

  evt.respondWith(
    caches.match(req).then((cached) => {
      if(cached) return cached;

      return fetch(req).then((res) => {
        const copy = res.clone();
        caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
        return res;
      }).catch(() => caches.match("index.html"));
    })
  );
});
