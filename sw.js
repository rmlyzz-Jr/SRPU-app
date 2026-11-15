// Service worker: menyimpan "cangkang" PWA (halaman, ikon, manifest) agar bisa dibuka cepat/instal.
// Data aplikasi (Apps Script) selalu diambil langsung dari internet, tidak di-cache.
// Naikkan nomor VERSI setiap kali file di repo ini diubah supaya cache lama diganti.
const VERSI = 'rekap-ikan-v1';
const CANGKANG = [
  './',
  './index.html',
  './manifest.json',
  './icon/icon-192.png',
  './icon/icon-512.png',
  './icon/icon-maskable-512.png',
  './icon/apple-touch-icon.png'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(VERSI).then(function (c) { return c.addAll(CANGKANG); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (nama) {
      return Promise.all(nama.filter(function (n) { return n !== VERSI; }).map(function (n) { return caches.delete(n); }));
    }).then(function () { return self.clients.claim(); })
  );
});

self.addEventListener('fetch', function (e) {
  const req = e.request;
  if (req.method !== 'GET') return;
  const url = new URL(req.url);
  if (url.origin !== self.location.origin) return;   // Google Apps Script & CDN: langsung ke jaringan

  // Halaman: jaringan dulu, cadangan dari cache bila offline
  if (req.mode === 'navigate') {
    e.respondWith(
      fetch(req).then(function (res) {
        const salinan = res.clone();
        caches.open(VERSI).then(function (c) { c.put('./index.html', salinan); });
        return res;
      }).catch(function () { return caches.match('./index.html'); })
    );
    return;
  }

  // File statis: cache dulu, perbarui di latar belakang
  e.respondWith(
    caches.match(req).then(function (cache) {
      const ambil = fetch(req).then(function (res) {
        if (res && res.ok) { const s = res.clone(); caches.open(VERSI).then(function (c) { c.put(req, s); }); }
        return res;
      }).catch(function () { return cache; });
      return cache || ambil;
    })
  );
});
