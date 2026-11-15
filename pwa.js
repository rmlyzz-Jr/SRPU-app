/* pwa.js - jembatan GitHub Pages <-> Google Apps Script + pendaftaran PWA.
   Menggantikan google.script.run (yang hanya ada di dalam Apps Script) dengan fetch ke Web App /exec.
   Muat file ini PALING ATAS di <head> index.html, sebelum script lain. */
(function () {
  'use strict';
  var API_URL = 'https://script.google.com/macros/s/AKfycbwHNcKER1E60VV6r3ydJM0xemX4Ek6DFAeK_ejNFCckrwh10pWf09Hv3sJmjhxMrg3i/exec';
  var KUNCI_TOKEN = 'rekapikan_kode_akses';

  function simpanToken(t) { try { localStorage.setItem(KUNCI_TOKEN, t); } catch (e) {} }
  function ambilToken() { try { return localStorage.getItem(KUNCI_TOKEN) || ''; } catch (e) { return ''; } }

  async function rpc(fn, args) {
    for (var coba = 0; coba < 2; coba++) {
      var resp, j;
      try {
        resp = await fetch(API_URL, {
          method: 'POST',
          headers: { 'Content-Type': 'text/plain;charset=utf-8' },   // "simple request": tanpa preflight CORS
          body: JSON.stringify({ __rpc: true, fn: fn, args: args || [], token: ambilToken() }),
          redirect: 'follow'
        });
        j = await resp.json();
      } catch (e) {
        throw new Error('Tidak bisa terhubung ke server. Periksa internet, dan pastikan deployment Web App diset "Anyone". (' + (e.message || e) + ')');
      }
      if (j && j.__error) {
        if (/^AKSES_DITOLAK/.test(j.__error) && coba === 0) {
          var t = prompt('Masukkan kode akses aplikasi:');
          if (t === null) throw new Error('Kode akses dibatalkan.');
          simpanToken(t.trim());
          continue;
        }
        throw new Error(j.__error);
      }
      return j ? j.result : null;
    }
  }

  // Tiruan google.script.run: .withSuccessHandler(f).withFailureHandler(g).namaFungsi(...args)
  function Runner(ok, gagal) {
    return new Proxy({}, {
      get: function (_, nama) {
        if (nama === 'withSuccessHandler') return function (f) { return Runner(f, gagal); };
        if (nama === 'withFailureHandler') return function (g) { return Runner(ok, g); };
        if (typeof nama !== 'string') return undefined;
        return function () {
          var args = Array.prototype.slice.call(arguments);
          rpc(nama, args).then(function (r) { if (ok) ok(r); }).catch(function (e) { if (gagal) gagal(e); else console.error(e); });
        };
      }
    });
  }
  window.google = { script: { run: Runner(null, null) } };

  // Tombol bantu: ganti kode akses dari konsol -> gantiKodeAkses()
  window.gantiKodeAkses = function () { var t = prompt('Kode akses baru:'); if (t !== null) simpanToken(t.trim()); };

  // Service worker (PWA)
  if ('serviceWorker' in navigator) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('sw.js').catch(function (e) { console.warn('SW gagal:', e); });
    });
  }
})();
