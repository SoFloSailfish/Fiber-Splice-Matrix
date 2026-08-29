// Fiber Splice Matrix — Service Worker
// Caches the app shell + CDN libraries so the tool runs fully offline
// after the first successful load. Bump CACHE_VERSION to force an update.

const CACHE_VERSION = "splice-matrix-v1";

// Everything needed to run with no network. The three unpkg URLs are the
// React / ReactDOM / Babel libraries the app loads; caching them here is what
// makes the CDN-based build work offline in the field.
const ASSETS = [
  "./",
  "./index.html",
  "./manifest.webmanifest",
  "https://unpkg.com/react@18/umd/react.production.min.js",
  "https://unpkg.com/react-dom@18/umd/react-dom.production.min.js",
  "https://unpkg.com/@babel/standalone/babel.min.js",
];

// Install: pre-cache the app shell and libraries.
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_VERSION).then((cache) =>
      // Fetch each with no-cors fallback so a cross-origin CDN response still caches.
      Promise.all(
        ASSETS.map((url) =>
          fetch(url, { mode: "no-cors" })
            .then((res) => cache.put(url, res))
            .catch((err) => console.warn("Precache miss:", url, err))
        )
      )
    )
  );
  self.skipWaiting();
});

// Activate: drop old caches when the version changes.
self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) =>
      Promise.all(keys.filter((k) => k !== CACHE_VERSION).map((k) => caches.delete(k)))
    )
  );
  self.clients.claim();
});

// Fetch: cache-first. Serve from cache when present (offline-friendly),
// otherwise hit the network and stash a copy for next time.
self.addEventListener("fetch", (event) => {
  if (event.request.method !== "GET") return;
  event.respondWith(
    caches.match(event.request).then((cached) => {
      if (cached) return cached;
      return fetch(event.request)
        .then((res) => {
          const copy = res.clone();
          caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy)).catch(() => {});
          return res;
        })
        .catch(() => {
          // Offline and not cached: for navigations, fall back to the app shell.
          if (event.request.mode === "navigate") return caches.match("./index.html");
        });
    })
  );
});
