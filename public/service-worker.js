// Tender Mitra Service Worker
const CACHE_NAME = 'tender-mitra-v1';

// Assets to cache immediately on install
const STATIC_CACHE_URLS = [
    '/',
    '/index.html',
    '/manifest.json',
    '/static/css/main.css',
    '/static/js/main.js',
    '/static/media/logo.png',
    '/icons/icon-192x192.png',
    '/icons/icon-512x512.png'
];

// API responses to cache
const API_CACHE_URLS = [
    '/api/tenders',
    '/api/categories'
];

// Install event
self.addEventListener('install', event => {
    console.log('[Service Worker] Installing Service Worker...');
    event.waitUntil(
        caches.open(CACHE_NAME)
        .then(cache => {
            console.log('[Service Worker] Pre-caching important assets');
            return cache.addAll(STATIC_CACHE_URLS);
        })
        .then(() => {
            console.log('[Service Worker] Successfully pre-cached important assets');
            return self.skipWaiting();
        })
        .catch(error => console.error('[Service Worker] Pre-caching failed:', error))
    );
});

// Activate event
self.addEventListener('activate', event => {
    console.log('[Service Worker] Activating Service Worker...');
    // Clean up old caches
    event.waitUntil(
        caches.keys()
        .then(keyList => {
            return Promise.all(keyList.map(key => {
                if (key !== CACHE_NAME) {
                    console.log('[Service Worker] Removing old cache:', key);
                    return caches.delete(key);
                }
            }));
        })
        .then(() => {
            console.log('[Service Worker] Claiming clients for version:', CACHE_NAME);
            return self.clients.claim();
        })
    );
});

// Helper function to determine if a request is an API call
const isApiRequest = url => {
    return url.pathname.startsWith('/api/');
};

// Helper function to determine if a request should be cached
const shouldCache = url => {
    // Don't cache auth requests
    if (url.pathname.startsWith('/api/auth')) return false;

    // Don't cache POST/PUT/DELETE requests
    if (request.method !== 'GET') return false;

    // Cache API requests specified in API_CACHE_URLS
    if (isApiRequest(url)) {
        return API_CACHE_URLS.some(endpoint => url.pathname.includes(endpoint));
    }

    // Cache static assets and HTML pages by default
    return true;
};

// Fetch event with network-first strategy for API, cache-first for static assets
self.addEventListener('fetch', event => {
    const url = new URL(event.request.url);

    // Skip cross-origin requests
    if (url.origin !== self.location.origin) return;

    // Skip non-GET requests
    if (event.request.method !== 'GET') return;

    // Network-first strategy for API requests
    if (isApiRequest(url)) {
        event.respondWith(
            fetch(event.request)
            .then(response => {
                // Clone the response before using it
                const responseToCache = response.clone();

                // Only cache successful responses that should be cached
                if (response.ok && shouldCache(url)) {
                    caches.open(CACHE_NAME)
                        .then(cache => {
                            cache.put(event.request, responseToCache);
                            console.log('[Service Worker] Cached new API response:', url.pathname);
                        });
                }

                return response;
            })
            .catch(error => {
                console.log('[Service Worker] Network request failed, getting from cache:', url.pathname);
                return caches.match(event.request);
            })
        );
        return;
    }

    // Cache-first strategy for static assets and HTML pages
    event.respondWith(
        caches.match(event.request)
        .then(cachedResponse => {
            if (cachedResponse) {
                console.log('[Service Worker] Serving from cache:', url.pathname);
                return cachedResponse;
            }

            return fetch(event.request)
                .then(response => {
                    // Clone the response before using it
                    const responseToCache = response.clone();

                    // Only cache successful responses
                    if (response.ok) {
                        caches.open(CACHE_NAME)
                            .then(cache => {
                                cache.put(event.request, responseToCache);
                                console.log('[Service Worker] Cached new response:', url.pathname);
                            });
                    }

                    return response;
                })
                .catch(error => {
                    console.error('[Service Worker] Fetch failed:', error);

                    // For HTML navigation requests, return the offline page
                    if (event.request.headers.get('accept').includes('text/html')) {
                        return caches.match('/offline.html');
                    }

                    return new Response('Network error', { status: 408, headers: { 'Content-Type': 'text/plain' } });
                });
        })
    );
});

// Background sync for offline submissions
self.addEventListener('sync', event => {
    console.log('[Service Worker] Sync event triggered:', event.tag);

    if (event.tag === 'submit-bid') {
        event.waitUntil(
            syncBids()
            .then(() => console.log('[Service Worker] Background sync completed'))
            .catch(error => console.error('[Service Worker] Background sync failed:', error))
        );
    }

    if (event.tag === 'update-saved-tenders') {
        event.waitUntil(
            syncSavedTenders()
            .then(() => console.log('[Service Worker] Saved tenders sync completed'))
            .catch(error => console.error('[Service Worker] Saved tenders sync failed:', error))
        );
    }
});

// Helper function to sync pending bids
function syncBids() {
    return idb.open('tender-mitra-store', 1)
        .then(db => {
            const tx = db.transaction('pending-bids', 'readonly');
            return tx.objectStore('pending-bids').getAll();
        })
        .then(pendingBids => {
            return Promise.all(pendingBids.map(bid => {
                return fetch('/api/bids', {
                        method: 'POST',
                        headers: {
                            'Content-Type': 'application/json',
                            'Accept': 'application/json'
                        },
                        body: JSON.stringify(bid)
                    })
                    .then(response => {
                        if (response.ok) {
                            // Remove successfully synced bid from IndexedDB
                            return idb.open('tender-mitra-store', 1)
                                .then(db => {
                                    const tx = db.transaction('pending-bids', 'readwrite');
                                    tx.objectStore('pending-bids').delete(bid.id);
                                    return tx.complete;
                                });
                        }
                    });
            }));
        });
}

// Helper function to sync saved tenders
function syncSavedTenders() {
    return idb.open('tender-mitra-store', 1)
        .then(db => {
            const tx = db.transaction('saved-tenders', 'readonly');
            return tx.objectStore('saved-tenders').getAll();
        })
        .then(savedTenders => {
            return fetch('/api/saved-tenders', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                    'Accept': 'application/json'
                },
                body: JSON.stringify({ tenders: savedTenders })
            });
        });
}

// Push notification event
self.addEventListener('push', event => {
    console.log('[Service Worker] Push notification received:', event);

    let notification = {
        title: 'Tender Mitra Update',
        body: 'You have new updates in your account.',
        icon: '/icons/icon-192x192.png',
        badge: '/icons/notification-badge.png',
        data: {
            url: '/'
        }
    };

    // Try to parse the data from the push event
    if (event.data) {
        try {
            notification = {...notification, ...JSON.parse(event.data.text()) };
        } catch (e) {
            console.error('[Service Worker] Error parsing push data:', e);
        }
    }

    event.waitUntil(
        self.registration.showNotification(notification.title, {
            body: notification.body,
            icon: notification.icon,
            badge: notification.badge,
            vibrate: [100, 50, 100],
            data: notification.data
        })
    );
});

// Notification click event
self.addEventListener('notificationclick', event => {
    console.log('[Service Worker] Notification click event:', event);

    event.notification.close();

    // Get the URL from the notification data or use the default
    const urlToOpen = (event.notification.data && event.notification.data.url) || '/';

    event.waitUntil(
        clients.matchAll({ type: 'window' })
        .then(windowClients => {
            // Check if there is already a window open
            for (const client of windowClients) {
                if (client.url === urlToOpen && 'focus' in client) {
                    return client.focus();
                }
            }

            // If no window is open, open a new one
            if (clients.openWindow) {
                return clients.openWindow(urlToOpen);
            }
        })
    );
});