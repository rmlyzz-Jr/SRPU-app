# Aplikasi Rekap Ikan (PWA) - PT. Rafasya Putra Ustanto

Tampilan (front-end) di GitHub Pages, data & AI tetap di Google Apps Script + Spreadsheet.

```
index.html      <- salin dari project Apps Script + 4 baris di <head> (lihat index-head.txt)
pwa.js          <- jembatan ke Apps Script + daftar service worker
sw.js           <- service worker (cache tampilan)
manifest.json   <- manifest PWA
icons/          <- ikon aplikasi
apps-script/    <- file untuk Apps Script (bukan untuk GitHub Pages)
```

## A. Siapkan Apps Script (sekali)
1. Tambah file baru **Gateway.gs** (isi dari `apps-script/Gateway.gs`).
2. Di `Code.gs`, ubah awal `doPost` sesuai `apps-script/doPost-patch.txt`.
3. (Disarankan) Project Settings > Script Properties > tambah `APP_TOKEN` = kode rahasia.
4. Deploy > **Manage deployments** > ikon pensil > Version: **New version** > Deploy.
   Pastikan *Execute as: Me* dan *Who has access: **Anyone***. URL `/exec` tidak berubah.

## B. Upload ke GitHub
1. Buat repo baru (mis. `rekap-ikan`), upload semua file di folder ini kecuali `apps-script/`, `index-head.txt`.
2. Settings > Pages > Source: *Deploy from a branch* > `main` / `(root)` > Save.
3. Buka `https://USERNAME.github.io/rekap-ikan/`.

## C. Pasang di HP / komputer
Chrome/Edge: menu > **Instal aplikasi** / **Tambahkan ke layar utama**. Safari iOS: Bagikan > **Tambah ke Layar Utama**.

## Catatan
- Setiap mengubah `index.html` atau `pwa.js`, naikkan `VERSI` di `sw.js` (mis. `rekap-ikan-v2`) supaya HP mengambil versi baru.
- Mode offline hanya menampilkan tampilan; simpan/baca data tetap butuh internet.
- Ganti ikon di `icons/` dengan logo perusahaan (192x192, 512x512, dan versi maskable 512x512).
- Lupa/ganti kode akses di satu perangkat: buka konsol browser, ketik `gantiKodeAkses()`.
