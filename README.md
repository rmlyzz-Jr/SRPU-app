# Aplikasi Rekap Ikan - PT. Rafasya Putra Ustanto

Aplikasi web (Google Apps Script + Google Sheets) untuk mencatat penjualan ikan: input batch, rekap & cetak per pembeli,
rekap bongkaran, master data, baca gambar catatan dengan AI, dan update harga dari gambar.

Aplikasi: https://script.google.com/macros/s/AKfycbwHNcKER1E60VV6r3ydJM0xemX4Ek6DFAeK_ejNFCckrwh10pWf09Hv3sJmjhxMrg3i/exec

## File
- `Code.gs` - backend utama (simpan, update, hapus, master data, menu Sheet)
- `GeminiUpload.gs` - baca gambar dengan AI, kuota token, update harga
- `index.html` - tampilan aplikasi (nama harus persis `index`)
- `appsscript.json` - manifest Apps Script

## Pemasangan
1. Buat project Google Apps Script, salin isi ketiga file di atas (nama file sama).
2. Script Properties: isi `AI_API_KEY` (opsional `AI_BASE_URL`, `AI_MODEL`).
3. Deploy sebagai Web App.

Catatan: `AI_API_KEY` tidak disimpan di kode/GitHub. Biarkan repo ini **Private** karena `SPREADSHEET_ID` ada di `Code.gs`.
