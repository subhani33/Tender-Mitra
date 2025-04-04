// Service Worker for Tender Opulence Hub
const CACHE_NAME = 'tender-opulence-cache-v1';

// Assets to cache on install
const PRECACHE_ASSETS = [
    '/',
    '/index.html',
    '/preload.js',
    '/textures/black-marble.jpg',
    '/textures/gold-veins.png',
    '/images/highway-project.jpg',
    '/images/hospital-equipment.jpg'
];

// Install event - Precache critical assets
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then((cache) => {
            console.log('Opened cache');
            return cache.addAll(PRECACHE_ASSETS);
        })
        .then(() => self.skipWaiting()) // Activate immediately
    );
});

// Activate event - Clean up old caches
self.addEventListener('activate', (event) => {
    const currentCaches = [CACHE_NAME];
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (!currentCaches.includes(cacheName)) {
                        console.log('Deleting old cache:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        }).then(() => self.clients.claim()) // Take control of all clients
    );
});

// Fetch event - Network-first strategy with fallback to cache
self.addEventListener('fetch', (event) => {
    // Skip non-GET requests and browser extensions
    if (
        event.request.method !== 'GET' ||
        !event.request.url.startsWith(self.location.origin) ||
        event.request.url.includes('/api/')
    ) {
        return;
    }

    // HTML pages - Network first, then cache
    if (event.request.headers.get('accept') ? .includes('text/html')) {
        event.respondWith(
            fetch(event.request)
            .then((response) => {
                // Clone the response
                const responseToCache = response.clone();

                // Update cache
                caches.open(CACHE_NAME)
                    .then((cache) => {
                        cache.put(event.request, responseToCache);
                    });

                return response;
            })
            .catch(() => {
                // If network fails, try cache
                return caches.match(event.request)
                    .then((cachedResponse) => {
                        if (cachedResponse) {
                            return cachedResponse;
                        }
                        // Fallback for HTML when offline
                        return caches.match('/index.html');
                    });
            })
        );
        return;
    }

    // Images, CSS, JS, etc. - Cache first, then network
    if (
        event.request.url.match(/\.(jpe?g|png|gif|svg|css|js|woff2?)$/) ||
        event.request.headers.get('accept') ? .includes('image')
    ) {
        event.respondWith(
            caches.match(event.request)
            .then((cachedResponse) => {
                // Return cached response if available
                if (cachedResponse) {
                    // Still fetch from network to update cache in background
                    fetch(event.request)
                        .then((response) => {
                            caches.open(CACHE_NAME)
                                .then((cache) => {
                                    cache.put(event.request, response.clone());
                                });
                        })
                        .catch((err) => console.log('Failed to refresh cache:', err));

                    return cachedResponse;
                }

                // If not in cache, fetch from network
                return fetch(event.request)
                    .then((response) => {
                        // Clone the response
                        const responseToCache = response.clone();

                        // Update cache
                        caches.open(CACHE_NAME)
                            .then((cache) => {
                                cache.put(event.request, responseToCache);
                            });

                        return response;
                    });
            })
        );
        return;
    }

    // Default fallback for other resources - Network with cache fallback
    event.respondWith(
        fetch(event.request)
        .then((response) => {
            // Don't cache if not successful
            if (!response || response.status !== 200 || response.type !== 'basic') {
                return response;
            }

            // Clone the response
            const responseToCache = response.clone();

            // Update cache
            caches.open(CACHE_NAME)
                .then((cache) => {
                    cache.put(event.request, responseToCache);
                });

            return response;
        })
        .catch(() => {
            return caches.match(event.request);
        })
    );
});

// Handle skip waiting message from client
self.addEventListener('message', (event) => {
    if (event.data && event.data.type === 'SKIP_WAITING') {
        self.skipWaiting();
    }
});