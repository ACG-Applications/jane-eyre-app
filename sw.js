const CACHE_NAME = 'jane-eyre-v1';
const ASSETS = [
    '/jane-eyre-app/',
    '/jane-eyre-app/index.html',
    '/jane-eyre-app/css/style.css',
    '/jane-eyre-app/js/app.js',
    '/jane-eyre-app/js/sw-register.js',
    '/jane-eyre-app/data/lessons.json',
    '/jane-eyre-app/manifest.json',
    '/jane-eyre-app/assets/icons/favicon.ico',
    '/jane-eyre-app/assets/icons/icon-72x72.png',
    '/jane-eyre-app/assets/icons/icon-96x96.png',
    '/jane-eyre-app/assets/icons/icon-128x128.png',
    '/jane-eyre-app/assets/icons/icon-144x144.png',
    '/jane-eyre-app/assets/icons/icon-152x152.png',
    '/jane-eyre-app/assets/icons/icon-192x192.png',
    '/jane-eyre-app/assets/icons/icon-384x384.png',
    '/jane-eyre-app/assets/icons/icon-512x512.png'
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
                if (cachedResponse) {
                    return cachedResponse;
                }
                return fetch(event.request)
                    .then(response => {
                        if (event.request.url.includes('.mp4')) {
                            return response;
                        }
                        return caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, response.clone());
                                return response;
                            });
                    });
            })
    );
});