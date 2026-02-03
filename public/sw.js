const CACHE_NAME = 'project-me-v1';

self.addEventListener('install', (event) => {
  self.skipWaiting();
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.filter((name) => name !== CACHE_NAME).map((name) => caches.delete(name))
      );
    })
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Skip non-http requests
  if (!url.protocol.startsWith('http')) return;

  // Cache First for Assets (images, fonts, css/js)
  if (url.pathname.match(/\.(png|jpg|jpeg|svg|woff2?|css|js)$/) || url.pathname.includes('/assets/')) {
    event.respondWith(
      caches.open(CACHE_NAME).then((cache) => {
        return cache.match(event.request).then((response) => {
          return response || fetch(event.request).then((networkResponse) => {
            cache.put(event.request, networkResponse.clone());
            return networkResponse;
          });
        });
      })
    );
    return;
  }

  // Network First for HTML and others
  event.respondWith(
    fetch(event.request).then((networkResponse) => {
      const clone = networkResponse.clone();
      caches.open(CACHE_NAME).then((cache) => {
        cache.put(event.request, clone);
      });
      return networkResponse;
    }).catch(() => {
      return caches.match(event.request);
    })
  );
});
