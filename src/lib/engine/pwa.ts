/**
 * PWA Builder
 * Converts websites into Progressive Web Apps
 */

export interface PWAConfig {
  name: string;
  shortName: string;
  description: string;
  themeColor: string;
  backgroundColor: string;
  display: 'standalone' | 'fullscreen' | 'minimal-ui' | 'browser';
  orientation: 'any' | 'portrait' | 'landscape';
  startUrl: string;
  icons: Array<{ src: string; sizes: string; type: string }>;
  pushNotifications: boolean;
  offlineSupport: boolean;
  cacheStrategy: 'network-first' | 'cache-first' | 'stale-while-revalidate';
}

export function generateManifest(config: PWAConfig): string {
  return JSON.stringify({
    name: config.name,
    short_name: config.shortName,
    description: config.description,
    theme_color: config.themeColor,
    background_color: config.backgroundColor,
    display: config.display,
    orientation: config.orientation,
    start_url: config.startUrl,
    scope: '/',
    icons: config.icons.length > 0 ? config.icons : [
      { src: '/icons/icon-192x192.png', sizes: '192x192', type: 'image/png' },
      { src: '/icons/icon-512x512.png', sizes: '512x512', type: 'image/png' },
    ],
  }, null, 2);
}

export function generateServiceWorker(config: PWAConfig): string {
  const cacheName = `${config.shortName.toLowerCase().replace(/\s+/g, '-')}-v1`;

  return `// Service Worker for ${config.name}
const CACHE_NAME = '${cacheName}';
const urlsToCache = [
  '/',
  '/offline.html',
  '/styles.css',
  '/scripts.js',
];

// Install event - cache essential resources
self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
      .then(() => self.skipWaiting())
  );
});

// Activate event - clean old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames
          .filter((name) => name !== CACHE_NAME)
          .map((name) => caches.delete(name))
      );
    }).then(() => self.clients.claim())
  );
});

// Fetch event - ${config.cacheStrategy} strategy
self.addEventListener('fetch', (event) => {
  ${config.cacheStrategy === 'cache-first' ? `
  event.respondWith(
    caches.match(event.request).then((response) => {
      if (response) return response;
      return fetch(event.request).then((fetchResponse) => {
        if (fetchResponse.ok) {
          const responseClone = fetchResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return fetchResponse;
      });
    }).catch(() => {
      if (event.request.destination === 'document') {
        return caches.match('/offline.html');
      }
    })
  );` : config.cacheStrategy === 'network-first' ? `
  event.respondWith(
    fetch(event.request)
      .then((response) => {
        if (response.ok) {
          const responseClone = response.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return response;
      })
      .catch(() => caches.match(event.request).then((response) => {
        return response || caches.match('/offline.html');
      }))
  );` : `
  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      const fetchPromise = fetch(event.request).then((networkResponse) => {
        if (networkResponse.ok) {
          const responseClone = networkResponse.clone();
          caches.open(CACHE_NAME).then((cache) => cache.put(event.request, responseClone));
        }
        return networkResponse;
      });
      return cachedResponse || fetchPromise;
    })
  );`}
});

${config.pushNotifications ? `
// Push notification support
self.addEventListener('push', (event) => {
  const data = event.data ? event.data.json() : {};
  const options = {
    body: data.body || 'New notification',
    icon: '/icons/icon-192x192.png',
    badge: '/icons/badge-72x72.png',
    data: { url: data.url || '/' },
    actions: data.actions || [],
  };
  event.waitUntil(
    self.registration.showNotification(data.title || '${config.name}', options)
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const url = event.notification.data.url;
  event.waitUntil(
    clients.matchAll({ type: 'window' }).then((windowClients) => {
      for (const client of windowClients) {
        if (client.url === url && 'focus' in client) return client.focus();
      }
      if (clients.openWindow) return clients.openWindow(url);
    })
  );
});` : ''}
`;
}

export function generateOfflinePage(config: PWAConfig): string {
  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Offline - ${config.name}</title>
  <style>
    body {
      font-family: system-ui, -apple-system, sans-serif;
      display: flex; align-items: center; justify-content: center;
      min-height: 100vh; margin: 0; background: ${config.backgroundColor};
      color: #333; text-align: center; padding: 20px;
    }
    .container { max-width: 400px; }
    h1 { color: ${config.themeColor}; font-size: 24px; margin-bottom: 8px; }
    p { color: #666; font-size: 16px; line-height: 1.5; }
    button {
      margin-top: 20px; padding: 12px 24px; background: ${config.themeColor};
      color: white; border: none; border-radius: 8px; font-size: 16px;
      cursor: pointer;
    }
  </style>
</head>
<body>
  <div class="container">
    <h1>You're Offline</h1>
    <p>It looks like you've lost your internet connection. Please check your connection and try again.</p>
    <button onclick="window.location.reload()">Try Again</button>
  </div>
</body>
</html>`;
}
