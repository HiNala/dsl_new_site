// Minimal service worker to avoid 404s on /sw.js
self.addEventListener('install', () => self.skipWaiting());
self.addEventListener('activate', (event) => {
  event.waitUntil(self.clients.claim());
});
self.addEventListener('fetch', () => {
  // No-op: this SW doesn't intercept requests
});