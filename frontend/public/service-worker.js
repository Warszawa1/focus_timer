const CACHE_NAME = 'focus-timer-v1';

addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        return cache.addAll([
          '/',
          '/index.html',
          '/static/js/bundle.js',
          '/icon-192x192.png',
          '/icon-512x512.png'
        ]);
      })
  );
});

addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request)
      .then((response) => response || fetch(event.request))
  );
});

self.addEventListener('activate', (event) => {
    event.waitUntil(
      Promise.all([
        // Clear old caches
        caches.keys().then(cacheNames => {
          return Promise.all(
            cacheNames.map(cacheName => caches.delete(cacheName))
          );
        }),
        // Clear registration
        self.registration.unregister()
      ])
    );
  });