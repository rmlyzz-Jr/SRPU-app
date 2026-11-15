# Rekap Ikan PWA — PT. Rafasya Putra Ustanto

Pembungkus **PWA** (Progressive Web App) untuk Aplikasi Rekap Ikan yang berjalan di Google Apps Script.
Dengan ini aplikasi bisa **diinstal ke layar utama HP / laptop** seperti aplikasi biasa (layar penuh, ikon sendiri).

> Data dan logika tetap di Google Apps Script + Google Sheets. Repo ini hanya "cangkang" yang menampilkan web app tersebut.

## Isi repo

```
├── README.md
├── index.html       # halaman utama (memuat web app Apps Script dalam layar penuh)
├── manifest.json    # identitas PWA (nama, warna, ikon)
├── sw.js            # service worker (cache cangkang, mendukung instal)
├── .gitignore
└── icon/
    ├── icon-192.png
    ├── icon-512.png
    ├── icon-maskable-512.png
    └── apple-touch-icon.png
```

## LANGKAH 1 — Izinkan Apps Script ditampilkan di dalam PWA (WAJIB)

Secara bawaan Apps Script melarang halamannya dibuka di dalam `iframe`. Di **Code.gs**, ubah fungsi `doGet` menjadi:

```javascript
function doGet(e) {
  if (e && e.parameter && e.parameter.api === '1') return ambilSemuaDataJson();
  return HtmlService.createHtmlOutputFromFile('index')
    .setTitle('Aplikasi Rekap Ikan - PT Rafasya Putra Ustanto')
    .setXFrameOptionsMode(HtmlService.XFrameOptionsMode.ALLOWALL);
}
```

Lalu **Deploy → Manage deployments → ikon pensil → Version: New version → Deploy**.
Alamat `/exec` tetap sama.

Pastikan deployment: *Execute as: Me*, *Who has access: Anyone* (atau sesuai kebutuhan).

## LANGKAH 2 — Upload ke GitHub

1. Buat repository baru di GitHub, mis. `rekap-ikan-pwa` (Public).
2. Upload semua file & folder `icon` di atas ke root repository (Add file → Upload files).
3. Commit.

## LANGKAH 3 — Aktifkan GitHub Pages

1. Repository → **Settings → Pages**.
2. *Source*: **Deploy from a branch**, branch **main**, folder **/ (root)**, lalu **Save**.
3. Tunggu ±1 menit. Alamat PWA: `https://USERNAME.github.io/rekap-ikan-pwa/`

## LANGKAH 4 — Instal di perangkat

- **Android (Chrome):** buka alamat di atas → menu ⋮ → **Instal aplikasi** / *Tambahkan ke layar utama*.
- **iPhone (Safari):** Bagikan → **Tambah ke Layar Utama**.
- **Laptop (Chrome/Edge):** ikon instal di ujung kanan kolom alamat.

## Mengganti alamat Apps Script

Kalau membuat deployment baru dengan alamat `/exec` berbeda, ubah satu baris ini di `index.html`:

```javascript
var APP_URL = 'https://script.google.com/macros/s/.../exec';
```

## Mengganti ikon dengan logo perusahaan

Ganti keempat file di folder `icon/` dengan logo sendiri (nama file & ukuran sama):

| File | Ukuran |
|---|---|
| `icon-192.png` | 192 × 192 |
| `icon-512.png` | 512 × 512 |
| `icon-maskable-512.png` | 512 × 512 (logo di dalam area tengah ±80%, latar penuh) |
| `apple-touch-icon.png` | 180 × 180 |

Setelah mengubah file apa pun, naikkan nomor `VERSI` di `sw.js` (mis. `rekap-ikan-v2`) agar cache lama diganti.

## Catatan

- Aplikasi **butuh internet** (data ada di Google Sheets). Saat offline, hanya layar pembuka yang muncul.
- Login Google / izin akses tetap mengikuti pengaturan deployment Apps Script.
- Fitur tempel gambar (Ctrl+V) dan upload kamera berjalan di dalam iframe; bila ada yang tidak berfungsi di mode terinstal, gunakan tombol **Buka langsung**.
