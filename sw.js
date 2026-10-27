/* Umang Kakkad Portfolio - Service Worker */
/* Enables offline error handling, PWA installation, and caching so the site can display custom offline UI */

const CACHE_NAME = 'umang-portfolio-v2';
const ASSETS_TO_CACHE = [
  './',
  './index.html',
  './manifest.webmanifest',
  './manifest.json',
  './favicon.ico',
  './assets/icons/icon-192.png',
  './assets/icons/icon-512.png',
  './assets/icons/icon-maskable.png',
  './assets/icons/apple-touch-icon.png',
  './assets/icons/icon.svg',
  './admin/login.html',
  './admin/dashboard.html'
];

// Install: Cache critical navigation pages
self.addEventListener('install', (event) => {
  self.skipWaiting();
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(ASSETS_TO_CACHE).catch((err) => {
        console.warn('SW pre-cache warning:', err);
      });
    })
  );
});

// Activate: Clean up any old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((keys) => {
      return Promise.all(
        keys.map((key) => {
          if (key !== CACHE_NAME) {
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch: Network First for HTML navigation, fallback to cache when offline
self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET') return;

  const url = new URL(event.request.url);

  // HTML page navigation (e.g. index.html, dashboard.html)
  if (event.request.mode === 'navigate' || (event.request.headers.get('accept') && event.request.headers.get('accept').includes('text/html'))) {
    event.respondWith(
      fetch(event.request)
        .then((networkResponse) => {
          if (networkResponse && networkResponse.status === 200) {
            const clone = networkResponse.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return networkResponse;
        })
        .catch(() => {
          // If offline, serve cached page so our custom offline error screen renders
          return caches.match(event.request).then((cached) => {
            if (cached) return cached;
            return caches.match('./index.html') || caches.match('./');
          });
        })
    );
    return;
  }

  // Same-origin static assets: Network first, cache fallback
  if (url.origin === self.location.origin) {
    event.respondWith(
      fetch(event.request)
        .then((response) => {
          if (response && response.status === 200) {
            const clone = response.clone();
            caches.open(CACHE_NAME).then((cache) => cache.put(event.request, clone));
          }
          return response;
        })
        .catch(() => caches.match(event.request))
    );
  }
});