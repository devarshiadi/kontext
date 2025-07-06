// A unique name for our cache
const CACHE_NAME = 'fullscreen-app-cache-v1';

// The list of files that make up our "app shell"
const urlsToCache = [
  '/',
  '/index.html',
  '/style.css',
  '/script.js',
  '/icons/icon-192.png',
  '/icons/icon-512.png'
];

// The install event - fired when the service worker is first installed.
self.addEventListener('install', event => {
  console.log('Service Worker: Installing...');
  // We wait until the cache is populated.
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('Service Worker: Caching app shell');
        return cache.addAll(urlsToCache);
      })
  );
});

// The fetch event - fired for every network request.
self.addEventListener('fetch', event => {
  // We use a "cache-first" strategy.
  event.respondWith(
    // Try to find a match in the cache.
    caches.match(event.request)
      .then(response => {
        // If a cached version is found, return it.
        if (response) {
          return response;
        }
        // If not, fetch the resource from the network.
        return fetch(event.request);
      })
  );
});