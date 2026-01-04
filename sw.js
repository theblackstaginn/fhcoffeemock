/* FARMHOUSE MOCK — OFFLINE SW
   Cache core files + images in root
*/

const CACHE = "fhcoffee-mock-v1";

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

  "instagram.PNG",
  "facebook.PNG",
  "tiktok.PNG"
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(ASSETS)).then(() => self.skipWaiting())
  );
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.map(k => (k === CACHE ? null : caches.delete(k))))
    ).then(() => self.clients.claim())
  );
});

self.addEventListener("fetch", (event) => {
  const req = event.request;
  event.respondWith(
    caches.match(req).then((hit) => hit || fetch(req).then((res) => {
      const copy = res.clone();
      caches.open(CACHE).then((cache) => cache.put(req, copy)).catch(() => {});
      return res;
    }).catch(() => caches.match("index.html")))
  );
});