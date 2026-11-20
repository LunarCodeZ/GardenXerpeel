# Digital Garden

Sistem informasi taman untuk KOKULIKULER. Data tanaman disimpan di satu database, ditampilkan melalui halaman publik, dan dibuka pengunjung dengan memindai QR Code di dekat tanaman.

Aplikasi ini adalah MVP yang mencakup katalog publik, halaman detail berbasis slug, login admin, dashboard, CRUD tanaman, unggah foto, status draft/terbit, serta unduhan QR SVG/PNG.

## Stack

- React 19 + Vite
- Express 5
- SQLite melalui driver bawaan Node (`node:sqlite`)
- Sesi server-side, hash kata sandi scrypt, token CSRF
- Sharp untuk validasi dan optimasi foto
- QRCode untuk membuat QR dari URL publik tanaman

SQLite dipilih karena proyek berjalan di satu server kecil. Database ini tetap database bersama di sisi server, bukan penyimpanan browser. Untuk beberapa instance server, pindahkan data ke database dan object storage terpisah.

## Menjalankan secara lokal

Prasyarat: Node.js 24 atau lebih baru.

```bash
npm install
cp .env.example .env
npm run admin:create -- --email admin@contoh.id --password "kata-sandi-panjang" --name "Admin Taman"
npm run dev
```

Buka `http://localhost:5173`. API berjalan di `http://127.0.0.1:3001` dan di-proxy oleh Vite.

Pada PowerShell, gunakan `Copy-Item .env.example .env` sebagai ganti `cp`.

Lima tanaman awal (`krokot`, `lili-paris`, `asoka`, `rumput-jepang`, `pandan`) dibuat sebagai **draft** tanpa klaim botani. Isi dan verifikasi konten melalui dashboard sebelum menerbitkan.

## Perintah

| Perintah | Fungsi |
| --- | --- |
| `npm run dev` | Menjalankan API dan Vite untuk pengembangan |
| `npm run build` | Membuat frontend produksi di `dist/` |
| `npm start` | Menjalankan server produksi |
| `npm run admin:create` | Membuat atau memperbarui akun admin |
| `npm run backup` | Membuat salinan database di `backups/` |
| `npm test` | Tes API (Node test runner + supertest) |
| `npm run test:e2e` | Build lalu menjalankan tes browser Playwright |

Tes browser membutuhkan Chromium Playwright:

```bash
npx playwright install chromium
```

## Halaman

Publik:

- `/` — katalog tanaman yang sudah terbit
- `/plants/:slug` — detail tanaman
- `/uploads/:file` — foto tanaman; foto draft hanya dapat diakses admin

Admin:

- `/admin` — login
- `/admin/overview` — ringkasan dan tanaman terbaru
- `/admin/plants` — pencarian, edit, hapus
- `/admin/plants/new` — tambah tanaman
- `/admin/plants/:id/edit` — edit, unggah foto, simpan draft/terbitkan
- `/admin/qr` — pratinjau dan unduh QR

## Aturan data dan keamanan

- Hanya tanaman berstatus `published` yang tampil di API publik dan katalog.
- Slug bersifat permanen setelah tanaman dibuat agar QR yang sudah dicetak tidak rusak. Jika suatu saat slug harus berubah, tambahkan mekanisme redirect sebelum mengubah data lama.
- Publikasi memerlukan konfirmasi verifikasi admin dan konten wajib yang lengkap.
- Kata sandi disimpan sebagai hash scrypt. Sesi memakai cookie `HttpOnly`, `SameSite=Strict`, dan `Secure` saat produksi.
- Semua penulisan admin memerlukan sesi, token CSRF, dan origin yang sesuai.
- Login dibatasi laju percobaannya.
- Unggah foto dibatasi 5 MB, divalidasi berdasarkan isi file, lalu diubah ke WebP.
- Foto tanaman draft tidak dapat diakses tanpa sesi admin.

## Penyimpanan dan backup

Secara default data disimpan di `./data`:

```text
data/
  garden.db
  garden.db-wal
  garden.db-shm
  uploads/
```

Buat backup konsisten dengan:

```bash
npm run backup
```

Salinan dibuat dengan `VACUUM INTO` di `./backups`. Untuk memulihkan, hentikan server, ganti `data/garden.db` dengan file backup, lalu jalankan server kembali. Simpan folder `data/uploads` bersama backup database.

## Deployment ke Render.com (Direkomendasikan)

Render.com menyediakan server Node.js yang berjalan terus-menerus dengan **Persistent Disk** sehingga database SQLite dan foto upload tidak akan pernah hilang atau reset.

### Langkah-langkah deploy ke Render

1. **Push kode ke GitHub** (kalau belum):
   ```bash
   git add .
   git commit -m "Siap deploy ke Render"
   git push
   ```

2. **Buat akun di [render.com](https://render.com)** lalu klik **New → Web Service**.

3. **Hubungkan repositori GitHub** kamu dan pilih repo ini.

4. Render akan otomatis membaca file `render.yaml`. Pastikan pengaturan berikut:
   - **Build Command**: `npm ci && npm run build`
   - **Start Command**: `node server/index.js`
   - **Plan**: Free (atau Starter untuk Persistent Disk)

5. **Tambahkan Persistent Disk** di tab *Disks* pada service:
   - **Mount Path**: `/var/data`
   - **Size**: 1 GB (cukup untuk MVP)

   > ⚠️ **Penting:** Free plan Render tidak menyertakan Persistent Disk. Persistent Disk tersedia mulai paket **Starter ($7/bulan)**. Tanpa disk ini, data tetap akan reset setiap deploy. Alternatif gratis: gunakan **Railway.app** (lihat di bawah).

6. **Atur Environment Variables** di dashboard Render (tab *Environment*):

   | Variabel | Nilai |
   |---|---|
   | `NODE_ENV` | `production` |
   | `HOST` | `0.0.0.0` |
   | `PORT` | `3001` |
   | `TRUST_PROXY` | `1` |
   | `DATA_DIR` | `/var/data` |
   | `APP_URL` | `https://nama-service-kamu.onrender.com` |
   | `SESSION_SECRET` | *(generate random string panjang)* |
   | `ADMIN_EMAIL` | `email-admin@contoh.id` |
   | `ADMIN_PASSWORD` | `kata-sandi-panjang-min-8-karakter` |

7. Klik **Deploy**. Render akan build dan menjalankan aplikasi otomatis.

8. Setelah deploy selesai, buka URL Render kamu dan **uji**: login, unggah foto, terbitkan tanaman, lalu cek apakah foto muncul dan data tidak hilang setelah beberapa menit.

9. Buat QR dari URL Render produksi. **Jangan cetak QR dari `localhost`**.

---

## Deployment ke Railway.app (Alternatif Gratis)

Railway menyediakan Persistent Volumes gratis (dengan batasan storage).

1. Daftar di [railway.app](https://railway.app) dan buat **New Project → Deploy from GitHub repo**.
2. Tambahkan **Volume** dan mount ke `/var/data`.
3. Atur environment variables yang sama seperti tabel di atas (ganti `APP_URL` dengan URL Railway-mu).
4. Railway otomatis mendeteksi Node.js dan menjalankan `npm start`.

---

## Deployment ke VPS (Paling Fleksibel)

Jika kamu punya VPS (DigitalOcean, Linode, IDCloudHost, dsb.):

1. Buat `.env` produksi:

   ```dotenv
   NODE_ENV=production
   PORT=3001
   HOST=127.0.0.1
   APP_URL=https://domain-kamu.example
   DATA_DIR=/var/lib/digital-garden
   TRUST_PROXY=1
   SESSION_SECRET=ganti-dengan-kunci-acak-panjang
   ```

2. Build dan jalankan:

   ```bash
   npm ci --omit=dev
   npm run build
   npm start
   ```

3. Gunakan **PM2** agar server tetap berjalan setelah reboot:

   ```bash
   npm install -g pm2
   pm2 start "node server/index.js" --name digital-garden
   pm2 save
   pm2 startup
   ```

4. Arahkan reverse proxy (Nginx/Caddy) ke `127.0.0.1:3001` dan aktifkan HTTPS.

5. Jadwalkan backup:

   ```bash
   npm run backup
   ```

`APP_URL` menentukan isi QR. Jika domain berubah setelah QR dicetak, QR lama tidak akan berfungsi. Gunakan domain final sebelum mencetak.

## Portal Google Sites

Google Sites adalah pintu masuk proyek, bukan database utama. Buat halaman portal yang berisi:

- Nama dan pengantar Digital Garden.
- Tujuan dan dokumentasi kegiatan taman.
- Petunjuk memindai QR.
- Tautan ke katalog publik (`https://domain-kamu.example/`).
- Tautan ke login admin (`https://domain-kamu.example/admin`).
- Foto kegiatan dan dokumentasi lain.

Akun Google Sites, domain, dan hosting belum disediakan di repositori ini, sehingga publikasi portal dan deployment publik masih merupakan langkah di luar kode.

## Checklist sebelum QR dicetak

- [ ] Nama tanaman dan nama ilmiah sudah diverifikasi.
- [ ] Deskripsi, karakteristik, manfaat, dan perawatan sudah ditinjau.
- [ ] Foto benar-benar mewakili tanaman dan sudah diunggah.
- [ ] Status tanaman sudah `Terbit`.
- [ ] `APP_URL` memakai domain HTTPS final.
- [ ] QR diunduh dari halaman `/admin/qr` dan diuji pindai di Android serta iOS.
- [ ] Hasil cetak cukup besar, kontras, dan memiliki ruang kosong di sekeliling QR.
- [ ] URL halaman tanaman terbuka tanpa login.

## Batasan MVP

- Satu jenis akun admin.
- Belum ada statistik pemindaian, riwayat edit, ekspor CSV/PDF, atau multi-admin.
- Belum ada redirect otomatis jika slug berubah; slug sengaja dibuat permanen.
- SQLite dan penyimpanan foto lokal cocok untuk satu server. Skala multi-instance memerlukan migrasi database dan object storage.
- Konten botani awal harus diverifikasi manusia; aplikasi tidak memverifikasi kebenaran informasi tanaman.
