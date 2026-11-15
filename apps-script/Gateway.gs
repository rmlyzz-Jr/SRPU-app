// ==================== Gateway.gs ====================
// File BARU di project Apps Script (Tambah file > Script, nama: Gateway).
// Dipakai oleh versi GitHub Pages / PWA: index.html di GitHub memanggil fungsi server lewat fetch,
// dan semuanya masuk lewat doPost -> rpcGateway_ ini. Hanya fungsi di daftar putih yang bisa dipanggil.
//
// OPSIONAL tapi disarankan (Web App harus "Anyone", jadi tanpa ini siapa pun yang tahu URL /exec bisa membaca data):
//   Project Settings > Script Properties > tambah  APP_TOKEN = (kode rahasia pilihan Anda)
//   Aplikasi akan meminta kode ini sekali di tiap perangkat. Kosongkan/hapus property bila tidak ingin pakai kode.

function rpcDaftarFungsi_() {
  return {
    getSemuaData: getSemuaData,
    clientAction: clientAction,
    bacaGambarNota: bacaGambarNota,
    cekTransaksiTerlewat: cekTransaksiTerlewat,
    cekKuotaAI: cekKuotaAI,
    ambilEjaanIkan: ambilEjaanIkan,
    simpanEjaanIkan: simpanEjaanIkan,
    ambilHistoriTokenAI: ambilHistoriTokenAI,
    bacaGambarHarga: bacaGambarHarga,
    terapkanHargaIkan: terapkanHargaIkan,
    ambilModelAI: ambilModelAI,
    simpanModelAI: simpanModelAI
  };
}

function rpcKeluar_(obj) {
  return ContentService.createTextOutput(JSON.stringify(obj)).setMimeType(ContentService.MimeType.JSON);
}

function rpcGateway_(req) {
  try {
    const token = PropertiesService.getScriptProperties().getProperty('APP_TOKEN');
    if (token && String(req.token || '') !== String(token)) {
      return rpcKeluar_({ __error: 'AKSES_DITOLAK: kode akses salah atau belum diisi.' });
    }
    const fn = String(req.fn || '');
    const daftar = rpcDaftarFungsi_();
    if (!Object.prototype.hasOwnProperty.call(daftar, fn)) {
      return rpcKeluar_({ __error: 'Fungsi tidak dikenal: ' + fn });
    }
    const hasil = daftar[fn].apply(null, Array.isArray(req.args) ? req.args : []);
    return rpcKeluar_({ result: hasil === undefined ? null : hasil });
  } catch (e) {
    return rpcKeluar_({ __error: (e && e.message) ? e.message : String(e) });
  }
}
