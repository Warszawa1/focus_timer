const CACHE_NAME = 'focus-timer-v1';
const ASSETS_TO_CACHE = [
    '/',
    '/index.html',
    '/static/js/main.bundle.js',
    '/manifest.json',
    '/icon-192x192.png',
    '/icon-512x512.png',
    '/focus-chime.mp3',
    '/break-chime.mp3',
    '/complete.mp3'
  ];

// Install service worker
self.addEventListener('install', (event) => {
    event.waitUntil(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.addAll(ASSETS_TO_CACHE);
      })
    );
  });


// Fetch resources
self.addEventListener('fetch', (event) => {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          // Return cached version or fetch new
          return response || fetch(event.request);
        })
    );
  });
  
  // Clean old caches
  self.addEventListener('activate', (event) => {
    event.waitUntil(
      caches.keys().then((cacheNames) => {
        return Promise.all(
          cacheNames
            .filter((name) => name !== CACHE_NAME)
            .map((name) => caches.delete(name))
        );
      })
    );
  });