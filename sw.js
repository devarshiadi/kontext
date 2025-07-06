// This is a basic service worker file.
// It's required for the PWA 'install' functionality.

self.addEventListener('install', (event) => {
    console.log('Service Worker: Installing...');
    // You could pre-cache assets here if needed.
});

self.addEventListener('activate', (event) => {
    console.log('Service Worker: Activating...');
});

self.addEventListener('fetch', (event) => {
    // For now, we are just passing the request through to the network.
    // This is a "network-first" or "network-only" strategy.
    event.respondWith(fetch(event.request));
});
