const CACHE = 'escape-halloween-v4';
const CORE = ['./', 'index.html', 'data.js', 'art.js', 'manifest.json', 'icon-192.png', 'icon-512.png', 'logo.jpg', 'img/cole-calabazas.jpg', 'img/cole-brujas.jpg', 'img/cole-cementerio.jpg', 'fonts/creepster-latin-400-normal.woff2', 'fonts/henny-penny-latin-400-normal.woff2', 'fonts/fredoka-latin-400-normal.woff2', 'fonts/fredoka-latin-500-normal.woff2', 'fonts/fredoka-latin-600-normal.woff2', 'fonts/fredoka-latin-700-normal.woff2'];
self.addEventListener('install', e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(CORE)).then(() => self.skipWaiting())); });
self.addEventListener('activate', e => { e.waitUntil(caches.keys().then(ks => Promise.all(ks.filter(k => k !== CACHE).map(k => caches.delete(k)))).then(() => self.clients.claim())); });
self.addEventListener('fetch', e => {
  if (e.request.method !== 'GET') return;
  e.respondWith(caches.match(e.request).then(hit => {
    const net = fetch(e.request).then(res => {
      if (res && (res.ok || res.type === 'opaque')) { const cp = res.clone(); caches.open(CACHE).then(c => c.put(e.request, cp)); }
      return res;
    }).catch(() => hit);
    return hit || net;
  }));
});
