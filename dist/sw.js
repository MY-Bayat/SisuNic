const CACHE_NAME = 'sisunic-v9';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json',
  '/icon-512.png',
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => {
        console.log('Opened cache');
        return cache.addAll(urlsToCache);
      })
  );
});

self.addEventListener('fetch', (event) => {
  if (event.request.method !== 'GET' || event.request.url.includes("generativelanguage.googleapis.com")) {
    return;
  }

  event.respondWith(
    caches.match(event.request)
      .then((cachedResponse) => {
        const fetchPromise = fetch(event.request).then(
          (networkResponse) => {
            const cacheable = networkResponse.clone();
             caches.open(CACHE_NAME).then((cache) => {
                // We only cache basic responses to avoid caching errors from extensions or other sources
                if (cacheable.type === 'basic') {
                    cache.put(event.request, cacheable);
                }
            });
            return networkResponse;
          }
        ).catch(err => {
            console.error('Fetch failed; returning offline page instead.', err);
             // If the network fails, and there's no cache, you might want to return a fallback page.
             // For now, we just re-throw the error if there was no cached response.
             if(!cachedResponse) throw err;
        });

        return cachedResponse || fetchPromise;
      })
  );
});

self.addEventListener('activate', (event) => {
  const cacheWhitelist = [CACHE_NAME];
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheWhitelist.indexOf(cacheName) === -1) {
            console.log('Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});