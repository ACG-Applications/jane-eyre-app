const CACHE_NAME = 'jane-eyre-v1';
const ASSETS = [
    '/',
    '/index.html',
    '/css/style.css',
    '/js/app.js',
    '/js/sw-register.js',
    '/data/lessons.json',
    '/manifest.json',
    '/assets/icons/favicon.ico',
    '/assets/icons/icon-72x72.png',
    '/assets/icons/icon-96x96.png',
    '/assets/icons/icon-128x128.png',
    '/assets/icons/icon-144x144.png',
    '/assets/icons/icon-152x152.png',
    '/assets/icons/icon-192x192.png',
    '/assets/icons/icon-384x384.png',
    '/assets/icons/icon-512x512.png'
];

// Install event - cache all assets
self.addEventListener('install', event => {
    event.waitUntil(
        caches.open(CACHE_NAME)
            .then(cache => {
                console.log('Caching assets...');
                return cache.addAll(ASSETS);
            })
            .then(() => self.skipWaiting())
    );
});

// Activate event - clean old caches
self.addEventListener('activate', event => {
    event.waitUntil(
        caches.keys().then(keys => {
            return Promise.all(
                keys.filter(key => key !== CACHE_NAME)
                    .map(key => caches.delete(key))
            );
        })
    );
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', event => {
    event.respondWith(
        caches.match(event.request)
            .then(cachedResponse => {
                // Return cached version if available
                if (cachedResponse) {
                    return cachedResponse;
                }
                // Otherwise fetch from network
                return fetch(event.request)
                    .then(response => {
                        // Don't cache video files (too large)
                        if (event.request.url.includes('.mp4')) {
                            return response;
                        }
                        // Cache other assets for future offline use
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, response.clone());
                                return response;
                            });
                    });
            })
    );
});