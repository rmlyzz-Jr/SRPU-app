// Service worker Aplikasi Rekap Ikan. Naikkan VERSI setiap kali index.html / pwa.js diubah.
const VERSI = 'rekap-ikan-v1';
const SHELL = ['./', './index.html', './pwa.js', './manifest.json', './icons/icon-192.png', './icons/icon-512.png'];

self.addEventListener('install', e => {
  e.waitUntil(caches.open(VERSI).then(c => c.addAll(SHELL)).then(() => self.skipWaiting()));
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(ks => Promise.all(ks.filter(k => k !== VERSI).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', e => {
  const req = e.request;
  if (req.method !== 'GET') return;                       // simpan/ubah data (POST) tidak pernah di-cache
  const url = new URL(req.url);
  if (/(^|\.)google\.com$|googleusercontent\.com$/.test(url.hostname) && !/fonts\./.test(url.hostname)) return; // API Apps Script selalu langsung ke server

  if (req.mode === 'navigate') {                           // halaman: utamakan versi terbaru, cadangan dari cache
    e.respondWith(
      fetch(req).then(res => { const salin = res.clone(); caches.open(VERSI).then(c => c.put('./index.html', salin)); return res; })
        .catch(() => caches.match('./index.html'))
    );
    return;
  }
  // aset lain (CSS/JS/font/logo): tampilkan dari cache, perbarui di belakang layar
  e.respondWith(
    caches.match(req).then(ada => {
      const ambil = fetch(req).then(res => {
        if (res && (res.ok || res.type === 'opaque')) { const salin = res.clone(); caches.open(VERSI).then(c => c.put(req, salin)); }
        return res;
      }).catch(() => ada);
      return ada || ambil;
    })
  );
});
