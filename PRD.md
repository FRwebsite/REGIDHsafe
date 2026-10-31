# PRD - REGIDHsafe
Versi: 1.1 | Tanggal: 24 Oktober 2026 | Status: Disetujui

## 1. Informasi Umum
- Nama webapp: `REGIDHsafe` [USER]
- Tujuan: Webapp keuangan pribadi dan produktivitas bersama untuk Fadhil dan Regyna, mencakup kantong pribadi masing-masing dengan pembatasan bulanan, tombol tambah transaksi di tengah nav bar (+), grafik evaluasi belanja individu, rekap bulanan yang dapat diunduh, catatan bersama, serta daftar tugas kuliah ber-thumbnail gradien. Dilengkapi data awal transaksi manual pengguna. [USER]
- Mode deploy: B (GitHub Pages + Web App Apps Script JSON fetch) [USER]
- Folder keluaran: `d:\02 - Hasil AI\AntiGravity IDE\Rsafe`
- Link exec Apps Script: `https://script.google.com/macros/s/AKfycbwgmLcsGpkHQUrCvgaU0bCvZVNSJ6voNqiWsoYTgx3Y6_vbQCPXGm-hDinNGSIoUq9NzA/exec` [USER]

## 2. Teks Literal (wajib dipakai persis)
| Lokasi | Teks persis |
|---|---|
| Nama webapp | `REGIDHsafe` |
| Profil Pengguna | `Fadhil`, `Regyna` |
| Pilihan Profil Login | `Login sebagai Fadhil`, `Login sebagai Regyna` |
| Filter Transaksi | `Semua`, `Pemasukan`, `Pengeluaran` |
| Nominal Cepat | `5k`, `10k`, `25k`, `50k`, `75k`, `100k`, `200k` |
| Fitur Utama | `Kantong Pribadi`, `Grafik Pribadi`, `Catatan Bersama`, `List Tugas Kuliah` |
| Form Tugas Kuliah | `Tambah Tugas`, `nama matkul`, `keterangan tugas` |
| Pop-up setup.gs baris akhir | `By - Fadhil` |

Label fungsional standar: `Simpan`, `Batal`, `Hapus`, `Cari`, `Tambah`, `Edit`, `Tutup`, `Download`. [ASUMSI-TEKNIS]

Aturan Ikon: Hindari emoticon/emoji sama sekali. Semua representasi visual wajib menggunakan icon SVG yang bersih dan elegan. [USER]

## 3. Pengguna & Hak Akses
- Model Autentikasi: `Profile-Based Login` (Login Berbasis Profil) tanpa sistem PIN dan tanpa password. Pengguna cukup memilih/mengklik foto atau nama profil (`Fadhil` atau `Regyna`) untuk langsung masuk ke sesi akun. [USER]
- Peran & Hak Akses:
  1. `Fadhil`:
     - Hak akses penuh atas `Kantong Pribadi Fadhil` (mencatat, mengubah, menghapus, melihat transaksi, grafik evaluasi, saldo kartu ATM digital, batas bulanan, rekap bulanan).
     - DILARANG melihat atau mengelola `Kantong Pribadi Regyna`. [USER]
     - Mengakses dan mengedit `Catatan Bersama` (terhubung bersama Regyna). [USER]
     - Mengakses dan mengelola `List Tugas kuliah` (terhubung bersama). [USER]
  2. `Regyna`:
     - Hak akses penuh atas `Kantong Pribadi Regyna` (mencatat, mengubah, menghapus, melihat transaksi, grafik evaluasi, saldo kartu ATM digital, batas bulanan, rekap bulanan).
     - DILARANG melihat atau mengelola `Kantong Pribadi Fadhil`. [USER]
     - Mengakses dan mengedit `Catatan Bersama` (terhubung bersama Fadhil). [USER]
     - Mengakses dan mengelola `List Tugas kuliah` (terhubung bersama). [USER]
  3. `Ganti Profil`: Tersedia tombol navigasi cepat untuk beralih profil atau keluar kembali ke layar pemilihan profil `REGIDHsafe`. [ASUMSI-TEKNIS]

## 4. Menu & Fitur

### Menu 1: Kantong Pribadi
- Tujuan: Mengelola saldo, kartu digital ATM, mencatat arus kas (pemasukan/pengeluaran), memantau batas pengeluaran bulanan, dan mengunduh rekap bulanan. [USER]
- Aksesibilitas: Khusus profil aktif (Fadhil hanya melihat datanya, Regyna hanya melihat datanya). [USER]
- Isi halaman:
  1. **Tampilan Kartu ATM Digital**:
     - Format kartu perbankan modern bernuansa biru toska gradient (menyerupai referensi `media_1792809900068.png` & `media_1792809855752.jpg`).
     - Menampilkan nama pemilik kartu (`Fadhil` / `Regyna`), saldo total saat ini, nomor kartu format digital (`**** 1214`), status/tanggal periode, dan tombol SVG toggle lihat/sembunyikan saldo.
     - Indikator persentase perubahan atau pengeluaran terhadap pembatasan bulanan.
  2. **Pembatasan Pengeluaran Bulanan**:
     - Indikator bar kemajuan (progress bar) pengeluaran bulan berjalan terhadap batas maksimal pengeluaran yang ditetapkan.
     - Peringatan visual halus jika pengeluaran telah mendekati atau melebihi limit.
     - Tombol / modal pengaturan limit bulanan.
  3. **Tombol Cepat Catat Transaksi**:
     - Pilihan jenis: `Pemasukan` atau `Pengeluaran`.
     - Pilihan Nominal Otomatis (Chips button): `5k` (5.000), `10k` (10.000), `25k` (25.000), `50k` (50.000), `75k` (75.000), `100k` (100.000), `200k` (200.000), serta input nominal kustom.
     - Input kategori pengeluaran/pemasukan (mis. jajan kopi, belanja online, transportasi, uang saku, dll.).
     - Input catatan/keterangan & tanggal transaksi.
  4. **Riwayat & Filter Transaksi**:
     - Filter penglihatan: Tab segment `Semua`, `Pemasukan`, `Pengeluaran`. [USER]
     - Daftar kartu transaksi interaktif dengan ikon SVG, kategori, tanggal, dan nilai (warna hijau toska untuk pemasukan, merah lembut untuk pengeluaran).
  5. **Fitur Rekap Bulanan & Download**:
     - Pemilihan periode bulan & tahun.
     - Ringkasan total pemasukan, total pengeluaran, sisa saldo, dan sisa limit bulanan.
     - Tombol `Download`: Mengekspor data rekap bulanan transaksi aktif ke file CSV/format unduhan yang rapi. [USER]
- Aksi: `Tambah`, `Edit`, `Hapus`, `Filter`, `Download`, `Simpan`, `Batal`.
- Validasi: Nominal wajib lebih dari 0, jenis transaksi wajib dipilih, kategori wajib diisi.

### Menu 2: Grafik Pribadi
- Tujuan: Mengevaluasi kebiasaan belanja individu secara mendalam (misal: apakah Fadhil terlalu banyak jajan kopi atau Regyna terlalu banyak belanja online). [USER]
- Aksesibilitas: Khusus profil aktif (hanya menganalisis data milik profil yang sedang login). [USER]
- Isi halaman:
  1. **Grafik Komposisi Pengeluaran per Kategori**:
     - Donut Chart / Pie Chart interaktif (menggunakan SVG Chart tanpa dependency berat) yang memetakan persentase pengeluaran kategori terbesar.
  2. **Tren Pengeluaran vs Pemasukan**:
     - Bar chart / Line chart perbandingan arus kas harian/mingguan dalam bulan terpilih.
  3. **Kartu Analisis Kebiasaan**:
     - Kartu insight otomatis yang menyorot kategori pengeluaran paling dominan (mis. "Pengeluaran Terbesar Bulan Ini: Jajan Kopi" untuk Fadhil atau "Belanja Online" untuk Regyna) beserta persentase dari total pengeluaran.
- Aksi: Filter rentang bulan/tahun, interaksi tooltip grafik.

### Menu 3: Catatan Bersama
- Tujuan: Wadah catatan bersama yang saling terhubung secara real-time antara Fadhil dan Regyna. [USER]
- Aksesibilitas: Dapat dilihat, ditambah, disunting, dan dihapus oleh kedua profil (`Fadhil` dan `Regyna`). [USER]
- Isi halaman:
  1. Daftar catatan dalam tata letak kartu masonry / grid responsif.
  2. Setiap kartu catatan memuat: judul catatan, isi catatan, nama pembuat/pengubah terakhir (`Fadhil` / `Regyna`), serta cap waktu (timestamp).
  3. Form pembuatan / penyuntingan catatan bersama dengan tombol label standar `Simpan`, `Batal`, `Hapus`.
  4. Fitur pencarian catatan (`Cari`).
- Aksi: `Tambah`, `Edit`, `Hapus`, `Cari`, `Simpan`, `Batal`.
- Validasi: Judul dan isi catatan wajib diisi.

### Menu 4: List Tugas Kuliah
- Tujuan: Manajemen tugas kuliah bersama Fadhil & Regyna dengan visualisasi kartu modern dan thumbnail foto kustom bergradien. [USER]
- Aksesibilitas: Terhubung untuk kedua pengguna. [USER]
- Isi halaman:
  1. **Tombol Aksi**: `Tambah Tugas`. [USER]
  2. **Form Tambah / Edit Tugas**:
     - Input `nama matkul` (kategori custom mata kuliah). [USER]
     - Input `keterangan tugas` (deskripsi & tenggat waktu/deadline). [USER]
     - Unggah foto dari galeri perangkat: foto diproses langsung menjadi thumbnail dengan overlay efek gradient biru toska estetis. [USER]
     - Status tugas: Belum Selesai / Selesai.
  3. **Tampilan Kartu Tugas**:
     - Kartu tugas dengan thumbnail gambar bergradien toska pada bagian atas/background.
     - Badge mata kuliah (`nama matkul`).
     - Teks `keterangan tugas`.
     - Tombol centang selesai (SVG check) dan tombol `Edit` / `Hapus`.
- Aksi: `Tambah Tugas`, `Edit`, `Hapus`, `Cari`, `Simpan`, `Batal`.
- Validasi: `nama matkul` dan `keterangan tugas` wajib diisi.

## 5. Database (setup.gs)

Struktur tabel Google Spreadsheet untuk REGIDHsafe:

### Sheet 1: `Transaksi_Fadhil`
| Kolom | Tipe | Wajib | Keterangan |
|---|---|---|---|
| id | id | Ya | UUID / Timestamp unik transaksi |
| tanggal | date | Ya | Format YYYY-MM-DD |
| jenis | text | Ya | `Pemasukan` / `Pengeluaran` |
| kategori | text | Ya | Misal: Jajan Kopi, Makan, Kuliah, dll. |
| nominal | number | Ya | Angka numerik rupiah |
| keterangan | text | Tidak | Catatan tambahan |
| created_at | datetime | Ya | Waktu pencatatan |

### Sheet 2: `Transaksi_Regyna`
| Kolom | Tipe | Wajib | Keterangan |
|---|---|---|---|
| id | id | Ya | UUID / Timestamp unik transaksi |
| tanggal | date | Ya | Format YYYY-MM-DD |
| jenis | text | Ya | `Pemasukan` / `Pengeluaran` |
| kategori | text | Ya | Misal: Belanja Online, Skincare, Kuliah, dll. |
| nominal | number | Ya | Angka numerik rupiah |
| keterangan | text | Tidak | Catatan tambahan |
| created_at | datetime | Ya | Waktu pencatatan |

### Sheet 3: `Batas_Bulanan`
| Kolom | Tipe | Wajib | Keterangan |
|---|---|---|---|
| profil | text | Ya | `Fadhil` atau `Regyna` |
| periode_bulan | text | Ya | Format YYYY-MM |
| limit_nominal | number | Ya | Batas maksimal pengeluaran |
| updated_at | datetime | Ya | Waktu pembaruan limit |

### Sheet 4: `Catatan_Bersama`
| Kolom | Tipe | Wajib | Keterangan |
|---|---|---|---|
| id | id | Ya | UUID unik catatan |
| judul | text | Ya | Judul catatan |
| isi | longtext | Ya | Konten catatan |
| penulis | text | Ya | `Fadhil` atau `Regyna` |
| updated_at | datetime | Ya | Waktu update terakhir |

### Sheet 5: `Tugas_Kuliah`
| Kolom | Tipe | Wajib | Keterangan |
|---|---|---|---|
| id | id | Ya | UUID unik tugas |
| nama_matkul | text | Ya | Nama mata kuliah (kategori kustom) |
| keterangan_tugas | longtext | Ya | Keterangan dan detail instruksi tugas |
| deadline | date | Tidak | Tanggal tenggat pengumpulan |
| foto_thumbnail | longtext | Tidak | Base64 data image thumbnail terkompresi |
| status | text | Ya | `Belum Selesai` / `Selesai` |
| created_by | text | Ya | `Fadhil` atau `Regyna` |
| created_at | datetime | Ya | Waktu pembuatan |

Data awal (seed): Mengimpor data catatan manual transaksi aktual yang dilampirkan user:
- `Transaksi_Fadhil`: 20 transaksi riil periode Oktober 2026 (Joki tugas web cms, Sangu, Jastip, Dana Bisnis saat Ini, Isi Dompet, Joki + Print, Makan + Minum, Joki Laprak Adit, Kebutuhan Diri Bensin, Kopi Jajan/Kopken/Ngopi, Richesee Double Chicken + Lava, Dompet, Sangu + Joki CMS).
- `Transaksi_Regyna`: 6 transaksi riil periode Oktober 2026 (Uang jajan, Lainnya hshs/shshhs/udang keduuu, Makan Pribadi shshhdhd/geprek matahhh). [USER]

## 6. Alur & Aturan Bisnis (code.gs)
1. **Pemisahan Data Privasi (Strict Isolation)**:
   - Backend memverifikasi parameter profil yang dikirimkan.
   - Panggilan data keuangan Fadhil HANYA membaca dan menulis ke sheet `Transaksi_Fadhil`.
   - Panggilan data keuangan Regyna HANYA membaca dan menulis ke sheet `Transaksi_Regyna`.
   - Tidak ada kebocoran data transaksi pribadi antar profil.
2. **Kalkulasi Saldo & Pembatasan**:
   - Saldo kartu = Total Pemasukan kumulatif - Total Pengeluaran kumulatif.
   - Pengeluaran Bulan Ini = Jumlah pengeluaran pada bulan aktif berjalan.
   - Persentase Limit = (Pengeluaran Bulan Ini / Limit Bulanan) * 100%.
3. **Penyimpanan Foto Thumbnail Tugas**:
   - Foto dari galeri dikonversi di sisi client (frontend) ke resolusi optimal (kompresi canvas base64) sebelum dikirim ke backend, menjaga kecepatan loading dan batasan payload Apps Script.
4. **Respon API Bersih**:
   - Seluruh endpoint fungsi mengembalikan object terstruktur `{ status: 'success'|'error', data: ..., message: ... }`.

## 7. Desain (index.html)
Sumber: Gambar referensi (`media_1792809855752.jpg`, `media_1792809900068.png`, `media_1792810027961.png`) dan instruksi user.

- **Tema & Warna Dasar (Biru Toska Modern)**:
  - Mode: Gelap Mewah (Dark Teal / Cyber Turquoise Slate) dengan kontras tinggi dan aksen toska elegan.
  - `--bg-main`: `#0c181c` (Deep dark toska night)
  - `--bg-surface`: `#13252c` (Slate toska container)
  - `--bg-card`: `#183039` (Kartu elevasi toska gelap)
  - `--primary-toska`: `#14b8a6` (Vibrant cyan/toska)
  - `--primary-glow`: `#2dd4bf` (Bright turquoise highlight)
  - `--primary-dark`: `#0f766e` (Deep teal)
  - `--accent-gradient`: `linear-gradient(135deg, #0d9488 0%, #14b8a6 50%, #06b6d4 100%)`
  - `--card-atm-gradient`: `linear-gradient(135deg, #0f4c5c 0%, #0d9488 60%, #14b8a6 100%)`
  - `--border-subtle`: `rgba(45, 212, 191, 0.18)`
  - `--border-active`: `rgba(45, 212, 191, 0.45)`
  - `--text-main`: `#f0fdfa` (Crisp clean white-cyan)
  - `--text-muted`: `#94a3b8` (Muted slate)
  - `--danger`: `#f43f5e` (Soft crimson untuk pengeluaran/hapus)
  - `--success`: `#10b981` (Emerald untuk pemasukan/selesai)

- **Tipografi**:
  - Google Font: `Plus Jakarta Sans` / `Outfit` dengan fallback `system-ui, sans-serif`.
  - Hirarki teks jelas, proporsional, dan angka saldo tampil bold terstruktur (tabular numbers).

- **Struktur Tampilan & Nav Bar Slide dengan Tombol Tambah di Tengah (+)**:
  - **Floating Dock Navigation Bar**:
    - Bilah navigasi melengkung di bagian bawah layar dengan floating dock modern.
    - **Tombol Tambah Transaksi di Tengah Nav Bar**: Tombol circular floating besar di bagian tengah bilah dengan logo `(+)` bergradien toska cerah, efek glow toska, dan animasi tekan interaktif untuk membuka modal cepat catat transaksi. [USER]
    - Item Navigasi:
      1. `Kantong` (Ikon Dompet/Kartu SVG)
      2. `Grafik` (Ikon Chart Analytics SVG)
      3. `(+) Tambah` (Tombol Tambah Transaksi di Tengah Nav Bar) [USER]
      4. `Catatan` (Ikon Dokumen/Notebook SVG)
      5. `Tugas` (Ikon Task Checklist SVG)
  - **Tampilan Multi-Device yang Lebih Kaya & Bervariasi**:
    - **Widget Ringkasan Finansial**: 4 kartu ringkasan cepat (Total Pemasukan, Total Pengeluaran, Arus Kas Bersih, dan Sisa Batas Bulanan).
    - **Tampilan Desktop / Laptop**: Layout multi-kolom responsif (Grid 2/3 kolom: Kolom kartu ATM + Quick Actions di kiri, Kolom riwayat transaksi & grafik visual di kanan) agar tidak kosong dan nyaman digunakan di layar besar.
    - **Pencarian Cepat & Filter Transaksi**: Fitur filter `Semua`, `Pemasukan`, `Pengeluaran`, serta input pencarian transaksi.

- **Komponen Kartu Saldo ATM Digital (Mengacu Gambar ke-2 `media_1792809900068.png`)**:
  - Rasio kartu debit/kredit perbankan dengan sudut melengkung (`border-radius: 20px`), background gradasi toska metalik, pola chip kartu SVG, nomor kartu samar berformat `**** 1214`, nama pemilik (`Fadhil` / `Regyna`), serta tombol aksi terintegrasi bergaya modern.

- **Nominal Cepat (Quick Amount Chips)**:
  - Tombol-tombol chip berjejer rapi: `5k`, `10k`, `25k`, `50k`, `75k`, `100k`, `200k`. Saat salah satu diklik, nominal otomatis terisi ke input transaksi dengan feedback getaran visual halus.

- **Thumbnail Tugas dengan Efek Gradient**:
  - Foto tugas kuliah diberi lapisan gradasi toska transparan ke gelap (`linear-gradient(to top, rgba(12, 24, 28, 0.95), transparent)`), memastikan teks judul dan mata kuliah di atasnya selalu terbaca tajam dan estetik.

## 8. Responsif & Presisi di Semua Device
- Desain mobile-first presisi dari lebar layar 320px (smartphone kompak), 375px-430px (iPhone & Android modern), 768px-1024px (iPad/Tablet), hingga 1366px-1920px+ (Laptop dan Monitor Desktop).
- Tanpa overflow horizontal yang tidak disengaja (`overflow-x: hidden`).
- Area sentuh (touch targets) minimum 44px x 44px untuk kemudahan navigasi di ponsel.
- Dukungan safe area inset untuk perangkat berponi/gesture bar (`env(safe-area-inset-bottom)`).

## 9. Tampilan Spreadsheet
- Spreadsheet dikonfigurasi secara profesional dan otomatis oleh `setup.gs`:
  - Baris header diberi warna latar toska gelap (`#0f766e`), teks putih tebal, dan perataan tengah.
  - Baris header dibekukan (freeze row 1).
  - Kolom diformat sesuai tipe datanya (kolom nominal dalam format mata uang IDR/angka, tanggal dalam format date).
  - Filter otomatis terpasang pada baris header seluruh sheet.
  - Lebar kolom diatur autofit dengan padding proporsional.
  - Tab disusun berurutan: `Transaksi_Fadhil`, `Transaksi_Regyna`, `Batas_Bulanan`, `Catatan_Bersama`, `Tugas_Kuliah`.
  - Sheet bawaan kosong (`Sheet1`) dihapus secara otomatis.

## 10. Pop-up setup.gs
Ketika fungsi inisialisasi `setup.gs` dijalankan dari spreadsheet, sistem akan memunculkan dialog Alert/Pop-up konfirmasi ringkasan pembuatan database dengan baris terakhir persis:
```text
By - Fadhil
```

## 11. Mode GitHub Pages (hanya jika mode B)
- Jika pengguna memilih deploy via GitHub Pages:
  - Backend `code.gs` melayani request melalui `doGet(e)` dan `doPost(e)` mengembalikan format `ContentService.createTextOutput(JSON.stringify(result)).setMimeType(ContentService.MimeType.JSON)`.
  - Header penanganan CORS disiapkan secara lengkap.
  - Frontend `index.html` dapat berjalan sebagai static hosting di GitHub Pages dan berkomunikasi secara asinkron menggunakan `fetch` ke URL Web App Apps Script.

## 12. Di Luar Cakupan
- Sistem login dengan password, PIN, atau autentikasi OAuth Google (user secara eksplisit meminta cukup Profile-Based Login tanpa PIN/password).
- Penggabungan transaksi pribadi Fadhil dan Regyna (kedua kantong terisolasi ketat).
- Emoticon / emoji teks (digantikan oleh SVG icons murni).
- Integrasi Payment Gateway perbankan nyata.

## 13. Pertanyaan Terbuka
- `[BELUM-DITENTUKAN]`: Apakah mode deploy yang ingin digunakan adalah **Mode A** (Frontend langsung di Google Apps Script via link exec Web App) atau **Mode B** (Frontend di GitHub Pages dan memanggil Apps Script backend)?
  *(Default yang disiapkan adalah Mode A yang juga siap beralih ke Mode B).*

## 14. Riwayat Revisi
| Versi | Tanggal | Perubahan (TAMBAH/UBAH/HAPUS) | File terdampak |
|---|---|---|---|
| 1.0 | 24 Oktober 2026 | Dokumen awal spesifikasi REGIDHsafe sesuai instruksi user dan analisis gambar referensi 1, 2, dan 3. | code.gs, setup.gs, index.html |
| 1.1 | 24 Oktober 2026 | TAMBAH: Tombol tambah transaksi (+) di tengah nav bar, widget ringkasan statistik, tata letak multi-device responsif kaya variasi, dan impor data catatan manual 26 transaksi riil Fadhil & Regyna ke database seed dan mock data. | setup.gs, index.html, code.gs |
| 1.2 | 31 Oktober 2026 | UBAH: Desain & layout modal Tambah Transaksi mengikuti visual bottom-sheet baru (drag handle, toggle Pengeluaran/Pemasukan 'Tiga ketukan, selesai.', display nominal besar Rp, quick chips, grid kartu kategori dengan ikon lingkaran & badge centang aktif, keypad angka interaktif, tombol simpan lebar) dengan tema dark toska website. | index.html |

