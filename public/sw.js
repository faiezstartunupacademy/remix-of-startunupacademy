/* StartUp Academy Plus — Service Worker
 * Strategy: NetworkFirst for HTML, StaleWhileRevalidate for static assets,
 * CacheFirst for fonts/images. Never caches API calls or Supabase requests.
 */
const VERSION = "v1.0.0";
const HTML_CACHE = `sap-html-${VERSION}`;
const STATIC_CACHE = `sap-static-${VERSION}`;
const IMG_CACHE = `sap-img-${VERSION}`;

self.addEventListener("install", (e) => {
  self.skipWaiting();
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(keys.filter(k => !k.endsWith(VERSION)).map(k => caches.delete(k)));
    await self.clients.claim();
  })());
});

const isApi = (url) =>
  url.hostname.endsWith("supabase.co") ||
  url.pathname.startsWith("/api/") ||
  url.pathname.startsWith("/functions/v1/");

self.addEventListener("fetch", (event) => {
  const req = event.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  if (isApi(url)) return; // Never intercept API
  if (url.origin !== self.location.origin && !/\.(png|jpg|jpeg|svg|gif|webp|woff2?)$/i.test(url.pathname)) return;

  // HTML navigations: network-first
  if (req.mode === "navigate") {
    event.respondWith((async () => {
      try {
        const fresh = await fetch(req);
        const cache = await caches.open(HTML_CACHE);
        cache.put(req, fresh.clone());
        return fresh;
      } catch {
        const cached = await caches.match(req);
        return cached || caches.match("/");
      }
    })());
    return;
  }

  // Images: cache-first
  if (req.destination === "image") {
    event.respondWith((async () => {
      const cached = await caches.match(req);
      if (cached) return cached;
      try {
        const res = await fetch(req);
        const cache = await caches.open(IMG_CACHE);
        cache.put(req, res.clone());
        return res;
      } catch {
        return cached || Response.error();
      }
    })());
    return;
  }

  // Static assets: stale-while-revalidate
  event.respondWith((async () => {
    const cached = await caches.match(req);
    const fetchPromise = fetch(req).then(res => {
      const cache = caches.open(STATIC_CACHE);
      cache.then(c => c.put(req, res.clone()));
      return res;
    }).catch(() => cached);
    return cached || fetchPromise;
  })());
});

// Push notifications (in-app for now; reserved for future VAPID setup)
self.addEventListener("push", (event) => {
  if (!event.data) return;
  try {
    const data = event.data.json();
    event.waitUntil(self.registration.showNotification(data.title || "StartUp Academy Plus", {
      body: data.body || "",
      icon: "/icons/icon-192.png",
      badge: "/icons/icon-192.png",
      data: data.url || "/",
    }));
  } catch {}
});

self.addEventListener("notificationclick", (event) => {
  event.notification.close();
  const url = event.notification.data || "/";
  event.waitUntil(self.clients.openWindow(url));
});
