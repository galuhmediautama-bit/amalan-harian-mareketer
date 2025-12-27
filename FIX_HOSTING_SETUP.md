# 🔧 FIX: Hosting Balik Lagi ke "Get Started"

## Masalah
Setelah setup hosting, setiap reload malah balik lagi ke halaman "Get started". Ini berarti hosting belum benar-benar ter-setup.

## Solusi: Setup Hosting dengan Deploy Pertama

### Langkah 1: Setup Hosting di Console (Jika Belum)

1. Buka: https://console.firebase.google.com/project/aplikasi-amalan-harian/hosting
2. Klik **"Get started"**
3. Pilih **"Web"** (`</>`)
4. Ikuti wizard:
   - Klik **"Next"** atau **"Continue"**
   - Pilih lokasi hosting (pilih yang terdekat)
   - Klik **"Continue"** atau **"Finish"**

### Langkah 2: Deploy Pertama Kali (PENTING!)

Hosting harus di-deploy minimal sekali agar benar-benar aktif. Ada 2 cara:

#### Opsi A: Deploy Manual via Terminal (Cepat)

1. Di terminal lokal, pastikan sudah login:
   ```bash
   firebase login
   ```

2. Build aplikasi:
   ```bash
   npm run build
   ```

3. Deploy:
   ```bash
   firebase deploy --only hosting
   ```

4. Setelah deploy sukses, hosting akan benar-benar aktif

#### Opsi B: Deploy via GitHub Actions (Setelah Setup Secrets)

1. Pastikan semua secrets sudah di-setup (lihat PANDUAN_LENGKAP_DEPLOY.md)
2. Run workflow di GitHub Actions
3. Setelah deploy sukses, hosting akan aktif

### Langkah 3: Verifikasi Hosting Aktif

Setelah deploy pertama sukses:

1. Buka: https://console.firebase.google.com/project/aplikasi-amalan-harian/hosting
2. **TIDAK BOLEH** muncul tombol "Get started" lagi
3. Harus muncul:
   - URL hosting (https://aplikasi-amalan-harian.web.app)
   - Status "Live" atau "Active"
   - List deployment

### Langkah 4: Cek Aplikasi

1. Buka: https://aplikasi-amalan-harian.web.app
2. Aplikasi harus bisa diakses (bukan "Site Not Found")

---

## Kenapa Ini Terjadi?

Firebase Hosting perlu **deploy pertama** untuk benar-benar aktif. Hanya setup wizard saja tidak cukup - harus ada file yang di-deploy.

Setelah deploy pertama sukses, hosting akan tetap aktif meskipun di-reload.

---

## Troubleshooting

### Masih Muncul "Get Started" Setelah Deploy?

1. Tunggu 1-2 menit untuk propagasi
2. Hard refresh browser (Ctrl+F5)
3. Cek apakah deploy benar-benar sukses di GitHub Actions
4. Cek Firebase Console → Hosting → Deployments (harus ada deployment)

### Deploy Gagal dengan Error Authentication?

1. Pastikan `FIREBASE_SERVICE_ACCOUNT` secret sudah benar (isi JSON lengkap)
2. Pastikan Service Account memiliki permission untuk Hosting
3. Generate ulang Service Account Key jika perlu

---

**Setelah deploy pertama sukses, hosting akan tetap aktif! ✅**

