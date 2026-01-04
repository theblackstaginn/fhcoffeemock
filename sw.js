/* Farmhouse Mock — service worker (offline) */
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

  "sf-hero.jpg",
  "coffee-bg.jpg",
  "bg-mobile.jpg",

  "hours-panel.PNG",
  "counter.jpg",
  "r-s-coffee.jpg",

  "icon-instagram.svg",
  "icon-facebook.svg",
  "icon-tiktok.svg"
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
  evt.respondWith(
    caches.match(evt.request).then((cached) => cached || fetch(evt.request))
  );
});