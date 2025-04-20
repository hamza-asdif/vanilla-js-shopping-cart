const CACHE_NAME = "shopping-cart-v1";
const ASSETS_TO_CACHE = [
  "/",
  "/index.html",
  "/cart.html",
  "/favorites.html",
  "/product-page.html",
  "/search.html",
  "/css/style.css",
  "/css/cart.css",
  "/css/header.css",
  "/css/favorites.css",
  "/css/search.css",
  "/css/product-page.css",
  "/css/responsive-style.css",
  "/js/mydata.js",
  "/js/generals.js",
  "/js/cart.js",
  "/js/favorites.js",
  "/js/script.js",
  "/js/search.js",
  "/js/ProductPage.js",
  "/images/logo.png",
  "/images/slide.png",
];

// Install Service Worker
self.addEventListener("install", (event) => {
  event.waitUntil(
    caches
      .open(CACHE_NAME)
      .then((cache) => {
        console.log("Opened cache");
        return cache.addAll(ASSETS_TO_CACHE);
      })
      .catch((error) => {
        console.error("Cache installation failed:", error);
      })
  );
});

// Fetch Strategy - Cache First with Network Fallback
self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches
      .match(event.request)
      .then((response) => {
        // Cache hit - return response
        if (response) {
          return response;
        }

        // Clone the request because it can only be used once
        const fetchRequest = event.request.clone();

        return fetch(fetchRequest).then((response) => {
          // Check if response is valid
          if (
            !response ||
            response.status !== 200 ||
            response.type !== "basic"
          ) {
            return response;
          }

          // Clone the response because it can only be used once
          const responseToCache = response.clone();

          caches.open(CACHE_NAME).then((cache) => {
            // Don't cache POST requests
            if (event.request.method !== "POST") {
              cache.put(event.request, responseToCache);
            }
          });

          return response;
        });
      })
      .catch(() => {
        // Network failed, try to return offline page
        if (event.request.mode === "navigate") {
          return caches.match("/offline.html");
        }
      })
  );
});

// Clean up old caches
self.addEventListener("activate", (event) => {
  const cacheWhitelist = [CACHE_NAME];

  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (!cacheWhitelist.includes(cacheName)) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});
