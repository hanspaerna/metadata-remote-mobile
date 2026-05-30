/*
 * Metadata Remote - Service Worker
 * Network-first strategy: always tries the network, falls back to cache.
 * Static assets are pre-cached on install for offline shell support.
 */

const CACHE_NAME = 'mdrm-v1';

const STATIC_ASSETS = [
  '/',
  '/static/css/main.css',
  '/static/js/app.js',
  '/static/js/api.js',
  '/static/js/state.js',
  '/static/js/audio/player.js',
  '/static/js/files/manager.js',
  '/static/js/history/manager.js',
  '/static/js/metadata/album-art.js',
  '/static/js/metadata/editor.js',
  '/static/js/metadata/field-edit-modal.js',
  '/static/js/metadata/inference.js',
  '/static/js/metadata/transition-controller.js',
  '/static/js/navigation/focus-manager.js',
  '/static/js/navigation/keyboard-utils.js',
  '/static/js/navigation/keyboard.js',
  '/static/js/navigation/router.js',
  '/static/js/navigation/state-machine.js',
  '/static/js/navigation/tree.js',
  '/static/js/navigation/contexts/form-navigation.js',
  '/static/js/navigation/contexts/header-navigation.js',
  '/static/js/navigation/contexts/list-navigation.js',
  '/static/js/navigation/contexts/pane-navigation.js',
  '/static/js/ui/button-status.js',
  '/static/js/ui/filter-sort.js',
  '/static/js/ui/mobile-nav.js',
  '/static/js/ui/pane-resize.js',
  '/static/js/ui/theme-toggle.js',
  '/static/js/ui/utilities.js',
  '/static/mdrm-logo-dark-theme.png',
  '/static/mdrm-logo-light-theme.png',
  '/static/favicon.ico',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(STATIC_ASSETS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys()
      .then(keys => Promise.all(
        keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', event => {
  const url = new URL(event.request.url);

  // Only handle same-origin GET requests
  if (event.request.method !== 'GET' || url.origin !== self.location.origin) {
    return;
  }

  // API/data endpoints: network-only (never cache dynamic data)
  if (
    url.pathname.startsWith('/tree') ||
    url.pathname.startsWith('/files') ||
    url.pathname.startsWith('/metadata') ||
    url.pathname.startsWith('/history') ||
    url.pathname.startsWith('/stream') ||
    url.pathname.startsWith('/infer') ||
    url.pathname === '/health'
  ) {
    return;
  }

  // Static assets: cache-first
  event.respondWith(
    caches.match(event.request).then(cached => {
      if (cached) return cached;
      return fetch(event.request).then(response => {
        if (response.ok) {
          const clone = response.clone();
          caches.open(CACHE_NAME).then(cache => cache.put(event.request, clone));
        }
        return response;
      });
    })
  );
});
