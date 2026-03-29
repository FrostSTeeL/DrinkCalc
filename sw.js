// Change this version number every time you update your website (e.g., v2, v3, v4)
const CACHE_NAME = 'drinkcalc-cache-v1'; 

const urlsToCache = [
  '/DrinkCalc/',
  '/DrinkCalc/index.html',
  // Add other files here like your CSS, JS, and icon images
];

// 1. Install and Cache files
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache);
      })
  );
  self.skipWaiting(); // Forces the waiting service worker to become the active service worker
});

// 2. Activate and Clean up old caches
self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName); // Deletes the old v1 cache when v2 takes over
          }
        })
      );
    })
  );
  self.clients.claim(); // Take control of all pages immediately
});

// 3. Serve files from cache, fallback to network
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => {
        return response || fetch(event.request);
      })
  );
});
