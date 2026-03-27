const CACHE_NAME = 'study-planner-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/offline.html',
  '/assets/index.css',
  '/assets/index.js'
];

const EXTERNAL_CACHE_NAME = 'external-resources-v1';

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // Handle external educational resources
  if (isEducationalResource(url)) {
    event.respondWith(
      caches.match(event.request)
        .then((response) => {
          if (response) {
            return response;
          }

          return fetch(event.request).then((response) => {
            // Cache successful responses
            if (response.status === 200) {
              const responseClone = response.clone();
              caches.open(EXTERNAL_CACHE_NAME)
                .then((cache) => cache.put(event.request, responseClone));
            }
            return response;
          }).catch(() => {
            // Return offline fallback for educational content
            return caches.match('/offline.html') || new Response(
              '<h1>Content Unavailable Offline</h1><p>This educational resource is not available offline. Please connect to the internet to access it.</p>',
              { headers: { 'Content-Type': 'text/html' } }
            );
          });
        })
    );
  } else {
    // Handle regular app requests
    event.respondWith(
      caches.match(event.request)
        .then((response) => response || fetch(event.request))
    );
  }
});

function isEducationalResource(url) {
  // Check if the URL is from known educational domains
  const educationalDomains = [
    'khanacademy.org',
    'byjus.com',
    'vedantu.com',
    'ncert.nic.in',
    'w3schools.com',
    'scratch.mit.edu'
  ];

  return educationalDomains.some(domain => url.hostname.includes(domain));
}

// Clean up old caches
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cacheName) => {
          if (cacheName !== CACHE_NAME && cacheName !== EXTERNAL_CACHE_NAME) {
            return caches.delete(cacheName);
          }
        })
      );
    })
  );
});