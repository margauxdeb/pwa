self.addEventListener('install', function(e) {
  e.waitUntil(
    caches.open('tinyPWA').then(function(cache) {
      return cache.addAll([
        '/',
        '/index.html'
      ]);
    })
  );
});

self.addEventListener('fetch', function(event) {
  console.log(event.request.url);
  event.respondWith(
    fetch(event.request).then(function(response) {
      caches.open("tinyPWA").then(function(cache) {
        cache.match(event.request).then(function() {
          cache.put(event.request, response.clone());
          console.log("cache updated");
        });
      });
      console.log("Response from network");
      return response.clone();
    }).catch(function() {
      return caches.match(event.request).then(function(response) {
        if (response) {
          console.log("Response from cache");
          return response;
        } else {
          fetch(event.request.clone());
        }
      });
    })
  )
});

self.addEventListener('activate', function(event) {
  event.waitUntil(
    caches.keys().then(function(cacheNames) {
      return Promise.all(
        cacheNames.filter(function(cacheName) {
          return "tinyPWAV1" !== cacheName
        }).map(function(cacheName) {
          return caches.delete(cacheName);
        })
      );
    })
  );
});