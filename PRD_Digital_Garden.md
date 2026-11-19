# PRD --- Digital Garden: Plant Information & QR Dashboard

**Versi:** 1.0\
**Tanggal:** 19 November 2026\
**Status:** Draft untuk pengembangan\
**Nama proyek:** Digital Garden

------------------------------------------------------------------------

## 1. Ringkasan Proyek

Digital Garden adalah sistem informasi taman yang menyimpan data tanaman
dalam satu database dan menampilkannya melalui halaman web yang dapat
dibuka menggunakan QR Code.

Setiap tanaman memiliki QR Code tersendiri. Pengunjung cukup memindai QR
Code untuk membuka halaman informasi tanaman, tanpa perlu memasang
aplikasi. Informasi yang ditampilkan berasal dari database sehingga
admin dapat memperbarui konten melalui dashboard tanpa mengubah halaman
satu per satu.

Google Sites digunakan sebagai portal utama proyek. Portal tersebut
mengarahkan pengguna ke halaman informasi taman dan dashboard admin.
Aplikasi web khusus menangani database, halaman detail tanaman, dan
pengelolaan QR Code.

### Tanaman yang dikelola

1.  Krokot
2.  Lili Paris
3.  Asoka
4.  Rumput Jepang
5.  Pandan

> Nama tanaman, nama ilmiah, deskripsi, dan informasi perawatan harus
> diverifikasi sebelum dipublikasikan. Konten awal dapat diisi sebagai
> draft.

------------------------------------------------------------------------

## 2. Latar Belakang dan Masalah

Informasi tanaman di taman perlu disajikan secara praktis dan mudah
diperbarui. Jika informasi hanya dicetak pada papan, perubahan data
mengharuskan papan diganti. Jika informasi tersebar di banyak dokumen,
pengelola akan kesulitan menjaga konsistensi.

Digital Garden menyelesaikan masalah tersebut dengan: - Menyimpan
informasi semua tanaman dalam satu database. - Menyediakan QR Code unik
untuk setiap tanaman. - Menampilkan informasi tanaman melalui halaman
web publik. - Menyediakan dashboard admin untuk menambah, mengubah,
menghapus, dan menerbitkan data. - Memisahkan portal proyek, halaman
publik, dan dashboard pengelolaan.

------------------------------------------------------------------------

## 3. Tujuan Produk

### Tujuan utama

-   Pengunjung dapat memperoleh informasi tanaman dengan memindai QR
    Code.
-   Admin dapat mengelola seluruh informasi tanaman dari satu dashboard.
-   Setiap QR Code selalu mengarah ke halaman tanaman yang sesuai.
-   Informasi dapat diperbarui tanpa mencetak ulang QR Code selama URL
    tanaman tidak berubah.

### Indikator keberhasilan

-   Semua tanaman yang terdaftar memiliki halaman detail dan QR Code.
-   QR Code dapat dipindai dari perangkat Android dan iOS.
-   Perubahan data di dashboard tampil pada halaman publik setelah
    disimpan dan diterbitkan.
-   Pengunjung dapat membuka halaman informasi tanpa login.
-   Admin dapat mengelola data tanpa mengedit database secara manual.

------------------------------------------------------------------------

## 4. Target Pengguna dan Hak Akses

  -----------------------------------------------------------------------
  Peran                   Kebutuhan               Hak akses
  ----------------------- ----------------------- -----------------------
  Pengunjung              Membaca informasi       Melihat halaman publik
                          tanaman                 

  Admin                   Mengelola konten dan QR Login, melihat
                                                  dashboard, CRUD
                                                  tanaman, mengelola
                                                  publikasi dan QR

  Super Admin (opsional)  Mengelola akses admin   Semua hak admin dan
                                                  pengelolaan akun
  -----------------------------------------------------------------------

Untuk MVP, cukup sediakan satu jenis akun admin. Pengunjung tidak perlu
membuat akun.

------------------------------------------------------------------------

## 5. Ruang Lingkup

### 5.1 Fitur MVP --- wajib

-   Portal utama melalui Google Sites.
-   Halaman publik daftar tanaman.
-   Halaman detail setiap tanaman.
-   Database terpusat.
-   Login admin.
-   Dashboard ringkasan.
-   CRUD data tanaman.
-   Upload foto tanaman.
-   Generate dan unduh QR Code.
-   Status publikasi: draft atau published.
-   Desain responsif untuk ponsel dan desktop.

### 5.2 Fitur lanjutan --- opsional

-   Banyak akun admin dan pengaturan peran.
-   Riwayat perubahan konten.
-   Statistik jumlah pemindaian QR per tanaman.
-   Pencarian dan filter tanaman.
-   Kategori tanaman dan label lokasi taman.
-   Galeri beberapa foto per tanaman.
-   Ekspor data tanaman ke CSV/PDF.

Fitur opsional tidak boleh menghambat penyelesaian MVP.

### 5.3 Di luar ruang lingkup

-   Aplikasi Android/iOS native.
-   Sistem pembayaran atau transaksi.
-   Forum atau komentar pengunjung.
-   Pengenalan tanaman otomatis menggunakan AI.
-   Pelacakan lokasi pengunjung secara personal.

------------------------------------------------------------------------

## 6. Arsitektur Sistem

### 6.1 Gambaran arsitektur

``` text
                    PENGUNJUNG
                         |
                    Scan QR Code
                         |
                         v
              Halaman Publik Tanaman
                         |
                         v
                  Backend / API
                         |
                         v
                    Database
                         ^
                         |
                 Dashboard Admin
                         |
                CRUD + Upload Foto
                         |
                         v
                  Backend / API

                 GOOGLE SITES
                Portal Utama
                 /         \
        Halaman Publik   Login Admin
```

### 6.2 Komponen

  -----------------------------------------------------------------------
  Komponen                            Fungsi
  ----------------------------------- -----------------------------------
  Google Sites                        Portal utama berisi pengantar
                                      proyek, cara menggunakan QR, dan
                                      tautan ke aplikasi

  Frontend web                        Menampilkan halaman publik dan
                                      dashboard admin

  Backend/API                         Validasi, autentikasi, proses CRUD,
                                      dan penyedia data

  Database                            Menyimpan data tanaman, akun admin,
                                      dan metadata QR

  File storage                        Menyimpan foto tanaman

  QR generator                        Membuat QR dari URL halaman detail
                                      tanaman
  -----------------------------------------------------------------------

### 6.3 Rekomendasi teknologi

Teknologi dapat disesuaikan dengan kemampuan tim. Rekomendasi awal:

  Bagian             Teknologi
  ------------------ ---------------------------------------------------
  Portal             Google Sites
  Frontend           React + Vite
  Backend            Laravel REST API
  Database           MySQL
  Penyimpanan foto   Laravel public storage atau object storage
  QR Code            Library QR Code pada backend atau frontend
  Deployment         Hosting frontend dan backend yang mendukung HTTPS

Jika ingin deployment yang lebih sederhana, tim dapat menggunakan satu
aplikasi Laravel dengan Blade. Jangan membangun dua frontend terpisah
jika tidak diperlukan.

------------------------------------------------------------------------

## 7. Struktur Data Database

### 7.1 Tabel `plants`

  Kolom               Tipe                Keterangan
  ------------------- ------------------- ---------------------------
  id                  BIGINT / UUID       Primary key
  slug                VARCHAR             URL unik, contoh `krokot`
  name                VARCHAR             Nama tanaman
  scientific_name     VARCHAR, nullable   Nama ilmiah
  short_description   TEXT                Ringkasan singkat
  description         LONGTEXT            Penjelasan lengkap
  characteristics     JSON / TEXT         Ciri-ciri tanaman
  benefits            JSON / TEXT         Manfaat atau kegunaan
  care_guide          JSON / TEXT         Panduan perawatan
  habitat             TEXT, nullable      Lingkungan tumbuh
  image_path          VARCHAR, nullable   Lokasi foto utama
  location_label      VARCHAR, nullable   Lokasi tanaman di taman
  qr_url              VARCHAR, nullable   URL tujuan QR
  status              ENUM                `draft` atau `published`
  created_at          TIMESTAMP           Waktu dibuat
  updated_at          TIMESTAMP           Waktu diperbarui

### 7.2 Tabel `admins`

  Kolom        Tipe            Keterangan
  ------------ --------------- -----------------------------
  id           BIGINT / UUID   Primary key
  name         VARCHAR         Nama admin
  email        VARCHAR         Email login, unik
  password     VARCHAR         Password yang sudah di-hash
  created_at   TIMESTAMP       Waktu dibuat
  updated_at   TIMESTAMP       Waktu diperbarui

### 7.3 Tabel opsional `qr_scans`

  Kolom         Tipe                Keterangan
  ------------- ------------------- --------------------------------
  id            BIGINT / UUID       Primary key
  plant_id      BIGINT / UUID       Relasi ke tanaman
  scanned_at    TIMESTAMP           Waktu pemindaian
  device_type   VARCHAR, nullable   Kategori perangkat secara umum

Catatan privasi: statistik pemindaian bersifat opsional. Jangan
menyimpan alamat IP atau data pribadi pengunjung jika tidak benar-benar
diperlukan.

### 7.4 Relasi data

-   Satu tanaman mempunyai satu slug unik.
-   Satu tanaman mempunyai satu URL detail publik.
-   Satu tanaman mempunyai satu QR Code aktif yang mengarah ke URL
    detail tersebut.
-   Satu tanaman dapat mempunyai banyak catatan pemindaian jika fitur
    statistik diaktifkan.
-   Admin mengelola banyak data tanaman.

------------------------------------------------------------------------

## 8. Detail Fitur

### 8.1 Portal Google Sites

Portal menjadi pintu masuk proyek Digital Garden.

Konten: - Nama dan pengantar Digital Garden. - Tujuan proyek. - Petunjuk
scan QR Code. - Daftar atau tautan menuju halaman tanaman. - Tautan
login admin. - Dokumentasi dan foto kegiatan taman.

Google Sites bukan tempat penyimpanan utama data tanaman. Data tetap
dikelola melalui aplikasi dan database.

### 8.2 Halaman publik

URL contoh:

``` text
https://domain-kamu.com/plants/krokot
https://domain-kamu.com/plants/lili-paris
https://domain-kamu.com/plants/asoka
```

Isi halaman: - Foto tanaman. - Nama tanaman. - Nama ilmiah (jika sudah
diverifikasi). - Deskripsi singkat. - Penjelasan atau karakteristik. -
Manfaat atau kegunaan. - Panduan perawatan. - Lokasi tanaman (jika
tersedia). - Tombol kembali ke daftar tanaman.

Ketentuan: - Tidak perlu login. - Hanya data berstatus `published` yang
dapat dilihat publik. - Jika slug tidak ditemukan, tampilkan halaman 404
yang informatif. - Halaman harus nyaman dibaca melalui ponsel.

### 8.3 Login admin

-   Admin login menggunakan email dan password.
-   Password disimpan dalam bentuk hash, bukan teks biasa.
-   Halaman dashboard hanya dapat diakses setelah autentikasi.
-   Sediakan tombol logout.
-   Batasi akses endpoint pengelolaan hanya untuk admin.

### 8.4 Dashboard admin

Ringkasan dashboard: - Total tanaman. - Jumlah tanaman published. -
Jumlah tanaman draft. - Aksi cepat tambah tanaman. - Daftar tanaman
terbaru.

Menu dashboard: 1. Overview 2. Data Tanaman 3. QR Code 4. Pengaturan
akun (opsional)

### 8.5 Manajemen tanaman

Admin dapat: - Melihat daftar tanaman. - Mencari tanaman berdasarkan
nama. - Menambah tanaman. - Mengedit informasi tanaman. - Mengunggah
atau mengganti foto. - Menyimpan sebagai draft. - Menerbitkan atau
membatalkan publikasi. - Menghapus tanaman dengan konfirmasi.

Validasi: - Nama tanaman wajib diisi. - Slug harus unik. - Format file
foto dibatasi ke format gambar yang didukung. - Ukuran file dibatasi
sesuai konfigurasi server. - Data yang belum lengkap dapat disimpan
sebagai draft.

### 8.6 QR Code

-   Sistem membuat QR Code berdasarkan URL publik tanaman.
-   Setiap tanaman memiliki QR Code sendiri.
-   Admin dapat melihat preview QR.
-   Admin dapat mengunduh QR dalam format PNG atau SVG.
-   QR dapat dicetak untuk ditempel di dekat tanaman.
-   QR harus tetap berfungsi ketika deskripsi atau foto tanaman
    diperbarui.

**Aturan penting:** QR mengarah ke URL berbasis slug yang stabil, bukan
URL file gambar atau URL sementara. Jika konten berubah, URL halaman
tetap sama. Jika slug perlu diganti, sistem sebaiknya menyediakan
redirect dari URL lama.

------------------------------------------------------------------------

## 9. Alur Pengguna

### 9.1 Alur pengunjung

1.  Pengunjung datang ke area tanaman.
2.  Pengunjung memindai QR Code.
3.  Browser membuka URL tanaman.
4.  Frontend meminta data tanaman ke backend.
5.  Backend mengambil data berstatus published dari database.
6.  Halaman menampilkan informasi tanaman.
7.  Pengunjung membaca informasi dan dapat kembali ke daftar tanaman.

### 9.2 Alur admin

1.  Admin membuka portal atau URL dashboard.
2.  Admin login.
3.  Sistem memvalidasi akun.
4.  Admin masuk ke dashboard.
5.  Admin memilih menu Data Tanaman.
6.  Admin menambah atau mengubah informasi.
7.  Admin menyimpan data sebagai draft atau published.
8.  Backend memvalidasi dan menyimpan data ke database.
9.  Halaman publik menampilkan data terbaru jika statusnya published.
10. Admin membuka menu QR Code dan mengunduh QR jika diperlukan.

### 9.3 Alur pembuatan QR

``` text
Admin membuat data tanaman
          |
          v
Sistem membuat slug unik
          |
          v
Sistem membentuk URL detail
          |
          v
QR Code dibuat dari URL
          |
          v
Admin preview dan unduh QR
          |
          v
QR dicetak dan dipasang
```

------------------------------------------------------------------------

## 10. Rancangan Halaman

### 10.1 Halaman publik

**Daftar tanaman** - Header Digital Garden. - Hero section singkat. -
Search atau filter sederhana. - Kartu tanaman berisi foto, nama, dan
ringkasan. - Footer.

**Detail tanaman** - Foto utama. - Nama dan nama ilmiah. - Deskripsi. -
Bagian karakteristik. - Bagian manfaat. - Bagian panduan perawatan. -
Informasi lokasi jika tersedia.

### 10.2 Dashboard admin

**Login** - Form email. - Form password. - Tombol login. - Pesan error
jika autentikasi gagal.

**Overview** - Sidebar navigasi. - Header dashboard. - Kartu
statistik. - Tabel tanaman terbaru.

**Data Tanaman** - Tabel nama, slug, status, tanggal update, dan aksi. -
Search. - Tombol tambah tanaman. - Aksi edit, preview, QR, dan hapus.

**Form Tanaman** - Nama. - Slug. - Nama ilmiah. - Deskripsi singkat. -
Deskripsi lengkap. - Karakteristik. - Manfaat. - Panduan perawatan. -
Lokasi. - Foto. - Status publikasi. - Tombol simpan draft dan publish.

**QR Code** - Daftar tanaman. - Preview QR. - URL tujuan. - Tombol
unduh. - Petunjuk cetak.

------------------------------------------------------------------------

## 11. Desain UI/UX

Arah visual: bersih, natural, ringan, dan mudah digunakan.

### Prinsip desain

-   Warna utama terinspirasi dari taman: hijau, putih, dan warna netral.
-   Dashboard menggunakan layout sidebar dan area konten utama.
-   Halaman publik mengutamakan foto dan keterbacaan informasi.
-   Ukuran teks nyaman dibaca di ponsel.
-   Tombol aksi utama terlihat jelas.
-   Hindari animasi berat dan elemen dekoratif berlebihan.

### Responsivitas

-   Mobile-first untuk halaman QR karena mayoritas pengunjung membuka
    melalui ponsel.
-   Dashboard tetap dapat digunakan di layar tablet dan desktop.
-   Tabel dashboard dapat berubah menjadi card/list pada layar kecil.

------------------------------------------------------------------------

## 12. API Endpoint (Rancangan)

Contoh endpoint REST API:

  Method   Endpoint                      Akses    Fungsi
  -------- ----------------------------- -------- --------------------------
  POST     `/api/login`                  Publik   Login admin
  POST     `/api/logout`                 Admin    Logout
  GET      `/api/plants`                 Publik   Daftar tanaman published
  GET      `/api/plants/{slug}`          Publik   Detail tanaman
  GET      `/api/admin/plants`           Admin    Semua data tanaman
  POST     `/api/admin/plants`           Admin    Tambah tanaman
  PUT      `/api/admin/plants/{id}`      Admin    Update tanaman
  DELETE   `/api/admin/plants/{id}`      Admin    Hapus tanaman
  GET      `/api/admin/plants/{id}/qr`   Admin    Preview atau generate QR
  GET      `/api/admin/dashboard`        Admin    Data ringkasan dashboard

Catatan: - Endpoint admin wajib dilindungi autentikasi dan otorisasi. -
Endpoint publik tidak boleh membocorkan data draft. - Validasi dilakukan
di backend, bukan hanya di frontend. - Format respons API dibuat
konsisten, misalnya JSON dengan `data`, `message`, dan `errors`.

------------------------------------------------------------------------

## 13. Kebutuhan Non-Fungsional

### Performa

-   Halaman detail harus ringan dan cepat dibuka melalui jaringan
    seluler.
-   Foto dioptimalkan dan menggunakan ukuran yang sesuai.
-   Gunakan pagination untuk daftar tanaman jika data bertambah banyak.

### Keamanan

-   Gunakan HTTPS.
-   Password wajib di-hash.
-   Validasi dan sanitasi input.
-   Lindungi route dan endpoint admin.
-   Validasi tipe serta ukuran file upload.
-   Jangan menyimpan secret atau kredensial di repository publik.
-   Lakukan backup database secara berkala.

### Ketersediaan dan kompatibilitas

-   Halaman publik dapat dibuka melalui browser modern.
-   QR Code dapat dipindai menggunakan kamera ponsel.
-   URL QR harus menggunakan domain HTTPS yang dapat diakses publik
    setelah deployment.

### SEO dan aksesibilitas

-   Setiap tanaman memiliki judul halaman yang sesuai.
-   Foto memiliki alt text.
-   Kontras teks dan latar belakang memadai.
-   Struktur heading tersusun dengan benar.

------------------------------------------------------------------------

## 14. Konten Awal Tanaman

Sediakan lima record awal di database dengan status draft sampai
informasi diverifikasi.

  -----------------------------------------------------------------------
  Tanaman                 Slug awal               Konten yang perlu
                                                  disiapkan
  ----------------------- ----------------------- -----------------------
  Krokot                  `krokot`                Foto, nama ilmiah,
                                                  deskripsi, ciri,
                                                  manfaat, perawatan

  Lili Paris              `lili-paris`            Foto, nama ilmiah,
                                                  deskripsi, ciri,
                                                  manfaat, perawatan

  Asoka                   `asoka`                 Foto, nama ilmiah,
                                                  deskripsi, ciri,
                                                  manfaat, perawatan

  Rumput Jepang           `rumput-jepang`         Foto, nama ilmiah,
                                                  deskripsi, ciri,
                                                  manfaat, perawatan

  Pandan                  `pandan`                Foto, nama ilmiah,
                                                  deskripsi, ciri,
                                                  manfaat, perawatan
  -----------------------------------------------------------------------

**Standar konten:** gunakan bahasa Indonesia yang singkat, informatif,
dan mudah dipahami pengunjung. Hindari klaim manfaat kesehatan atau
kegunaan yang belum memiliki sumber tepercaya. Pastikan identifikasi
tanaman benar karena nama lokal dapat berbeda antarwilayah.

------------------------------------------------------------------------

## 15. Acceptance Criteria

Fitur dianggap selesai jika memenuhi kriteria berikut:

### Portal dan halaman publik

-   [ ] Google Sites dapat dibuka dan memiliki tautan menuju aplikasi.
-   [ ] Daftar tanaman menampilkan data dari database.
-   [ ] Halaman detail menampilkan data berdasarkan slug.
-   [ ] Halaman publik tidak menampilkan tanaman berstatus draft.
-   [ ] Halaman nyaman dibuka melalui ponsel.

### Dashboard

-   [ ] Admin dapat login dan logout.
-   [ ] Pengguna yang belum login tidak dapat mengakses dashboard.
-   [ ] Admin dapat menambah, melihat, mengedit, dan menghapus tanaman.
-   [ ] Admin dapat mengunggah foto.
-   [ ] Admin dapat mengatur status draft dan published.
-   [ ] Data yang disimpan muncul sesuai status publikasinya.

### QR Code

-   [ ] Setiap tanaman published memiliki QR Code.
-   [ ] QR mengarah ke halaman detail tanaman yang benar.
-   [ ] QR dapat diunduh dan dicetak.
-   [ ] QR tetap berfungsi setelah konten tanaman diperbarui.

### Database dan keamanan

-   [ ] Data tersimpan secara permanen di database.
-   [ ] Slug tidak boleh duplikat.
-   [ ] Password admin tidak disimpan dalam bentuk teks biasa.
-   [ ] Endpoint admin dilindungi.
-   [ ] Data draft tidak dapat diakses melalui endpoint publik.

------------------------------------------------------------------------

## 16. Workflow Pengembangan

### Tahap 1 --- Persiapan

1.  Tetapkan nama proyek dan domain.
2.  Tentukan stack final.
3.  Siapkan repository Git.
4.  Siapkan desain awal halaman publik dan dashboard.
5.  Kumpulkan foto dan sumber informasi lima tanaman.

**Output:** repository, rancangan UI, dan daftar konten.

### Tahap 2 --- Database dan backend

1.  Buat database.
2.  Buat migration tabel `plants` dan `admins`.
3.  Buat autentikasi admin.
4.  Buat API CRUD tanaman.
5.  Buat endpoint publik daftar dan detail tanaman.
6.  Tambahkan upload foto dan validasi.
7.  Uji akses publik versus admin.

**Output:** backend dan database berfungsi.

### Tahap 3 --- Frontend publik

1.  Buat halaman daftar tanaman.
2.  Buat halaman detail tanaman.
3.  Hubungkan frontend ke API.
4.  Buat loading, empty, dan error state.
5.  Pastikan layout mobile-first.

**Output:** halaman tanaman dapat dibuka dari URL.

### Tahap 4 --- Dashboard admin

1.  Buat halaman login.
2.  Buat layout dashboard.
3.  Buat overview dan statistik dasar.
4.  Buat tabel data tanaman.
5.  Buat form tambah/edit.
6.  Hubungkan seluruh aksi ke API.
7.  Tambahkan konfirmasi sebelum penghapusan.

**Output:** admin dapat mengelola data dari dashboard.

### Tahap 5 --- QR Code

1.  Buat generator QR dari URL detail.
2.  Tampilkan preview QR di dashboard.
3.  Sediakan unduhan PNG/SVG.
4.  Cetak contoh QR.
5.  Uji scan dari beberapa ponsel.

**Output:** QR setiap tanaman berfungsi.

### Tahap 6 --- Google Sites dan deployment

1.  Deploy frontend dan backend.
2.  Konfigurasikan database production.
3.  Aktifkan HTTPS.
4.  Masukkan tautan aplikasi ke Google Sites.
5.  Uji semua URL publik.
6.  Generate QR menggunakan domain production.
7.  Cetak dan pasang QR di area taman.

**Output:** sistem dapat digunakan secara nyata.

### Tahap 7 --- Pengujian akhir

1.  Uji CRUD tanaman.
2.  Uji login dan pembatasan akses.
3.  Uji draft dan published.
4.  Uji upload foto.
5.  Uji QR dan URL.
6.  Uji tampilan ponsel.
7.  Perbaiki bug dan dokumentasikan cara penggunaan.

**Output:** MVP siap dipresentasikan dan digunakan.

------------------------------------------------------------------------

## 17. Risiko dan Mitigasi

  -----------------------------------------------------------------------
  Risiko                  Dampak                  Mitigasi
  ----------------------- ----------------------- -----------------------
  URL berubah setelah QR  QR tidak dapat          Gunakan slug stabil dan
  dicetak                 digunakan               redirect jika slug
                                                  berubah

  Informasi tanaman       Informasi publik tidak  Verifikasi konten dan
  keliru                  akurat                  nama ilmiah sebelum
                                                  publish

  Foto terlalu besar      Halaman lambat          Kompres dan batasi
                                                  ukuran upload

  Dashboard diakses pihak Data dapat diubah       Autentikasi, otorisasi,
  lain                                            dan HTTPS

  Hosting atau database   QR tidak dapat membuka  Pilih layanan stabil
  tidak tersedia          informasi               dan lakukan backup

  QR dicetak buram atau   Kamera sulit memindai   Uji hasil cetak dan
  terlalu kecil                                   sisakan quiet zone di
                                                  sekitar QR
  -----------------------------------------------------------------------

------------------------------------------------------------------------

## 18. Prioritas Pengerjaan

  -----------------------------------------------------------------------
  Prioritas                           Fitur
  ----------------------------------- -----------------------------------
  P0 --- Wajib                        Database tanaman, halaman detail,
                                      dashboard login, CRUD, QR Code

  P1 --- Penting                      Portal Google Sites, upload foto,
                                      status draft/published, desain
                                      responsif

  P2 --- Tambahan                     Statistik scan, multi-admin,
                                      riwayat edit, ekspor data
  -----------------------------------------------------------------------

Urutan pengerjaan disarankan mengikuti dependensi: database dan API →
halaman publik → dashboard → QR → deployment.

------------------------------------------------------------------------

## 19. Definisi Selesai (Definition of Done)

Proyek dinyatakan selesai apabila: 1. Lima jenis tanaman sudah memiliki
data yang telah diverifikasi. 2. Admin dapat mengelola data melalui
dashboard. 3. Pengunjung dapat melihat informasi tanpa login. 4. Setiap
tanaman memiliki QR Code yang mengarah ke halaman yang benar. 5. Google
Sites berfungsi sebagai portal proyek. 6. Sistem sudah diuji pada ponsel
dan desktop. 7. Dokumentasi instalasi, deployment, dan penggunaan admin
tersedia.

------------------------------------------------------------------------

## 20. Catatan Keputusan Produk

-   Google Sites berfungsi sebagai portal, bukan database utama.
-   Data tanaman disimpan terpusat dalam database aplikasi.
-   QR Code berisi URL halaman detail tanaman, bukan seluruh teks
    penjelasan.
-   Dashboard menjadi satu-satunya tempat utama untuk mengelola konten.
-   Konten yang diperbarui di dashboard akan digunakan oleh halaman QR
    secara otomatis.
-   Visualisasi taman dibuat ringan terlebih dahulu; fokus MVP adalah
    informasi tanaman dan alur QR.
-   Dokumentasi dan foto kegiatan dapat ditautkan dari Google Sites
    maupun disimpan pada penyimpanan aplikasi sesuai kebutuhan.
