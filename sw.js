/* Smiling Rocks Order Status — minimal service worker (makes the app installable).
   It only caches the app shell; live data always comes from the dashboard. */
var CACHE = 'sr-shell-v1';
var SHELL = ['./', './index.html', './manifest.json', './icon-192.png', './icon-512.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); })); self.skipWaiting(); });
self.addEventListener('activate', function (e) {
  e.waitUntil(caches.keys().then(function (k) { return Promise.all(k.filter(function (x) { return x !== CACHE; }).map(function (x) { return caches.delete(x); })); }));
  self.clients.claim();
});
self.addEventListener('fetch', function (e) {
  var u = new URL(e.request.url);
  if (u.origin !== location.origin) return;                       // never touch Google / dashboard traffic
  e.respondWith(fetch(e.request).catch(function () { return caches.match(e.request); }));
});
