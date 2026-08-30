// Fiber Splice Matrix — Service Worker
// Caches the app shell + CDN libraries so the tool runs fully offline
// after the first successful load. Bump CACHE_VERSION to force an update.

const CACHE_VERSION = "splice-matrix-v2";

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
      // Use a normal (CORS) request. unpkg sends proper CORS headers, so we get
      // a real, readable response we can cache — NOT an opaque one. Opaque
      // (no-cors) responses cache an empty/uninspectable body, which is what
      // caused React to silently fail to attach on cold/offline starts
      // ("React is not defined"). Only cache genuinely OK responses.
      Promise.all(
        ASSETS.map((url) =>
          fetch(url, { mode: "cors", credentials: "omit" })
            .then((res) => {
              if (res && res.ok) return cache.put(url, res);
              console.warn("Precache skipped (bad response):", url, res && res.status);
            })
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
          // Only cache real, successful responses. Never cache opaque
          // (type === "opaque") or error responses — a cached broken copy
          // of React/Babel would break every future offline launch.
          if (res && res.ok && res.type !== "opaque") {
            const copy = res.clone();
            caches.open(CACHE_VERSION).then((cache) => cache.put(event.request, copy)).catch(() => {});
          }
          return res;
        })
        .catch(() => {
          // Offline and not cached: for navigations, fall back to the app shell.
          if (event.request.mode === "navigate") return caches.match("./index.html");
        });
    })
  );
});
