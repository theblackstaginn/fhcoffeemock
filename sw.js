/* Farmhouse Mock — simple offline cache */
const CACHE_NAME = "fhcoffee-mock-v3";
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
  "counter.jpg",
  "r-s-coffee.jpg",
  "instagram.png",
  "facebook.png",
  "tiktok.png"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k !== CACHE_NAME ? caches.delete(k) : Promise.resolve())))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then(cached => cached || fetch(req).then(res => {
      const copy = res.clone();
      caches.open(CACHE_NAME).then(cache => cache.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => cached))
  );
});