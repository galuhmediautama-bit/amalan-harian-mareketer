# 📚 PANDUAN LENGKAP DEPLOY KE FIREBASE HOSTING

## 🎯 Tujuan
Deploy aplikasi Marketer Berkah ke Firebase Hosting menggunakan GitHub Actions secara otomatis.

---

## 📋 LANGKAH 1: AKTIFKAN FIREBASE HOSTING (WAJIB!)

### 1.1 Buka Firebase Console
1. Buka browser (Chrome/Firefox/Edge)
2. Kunjungi: **https://console.firebase.google.com/**
3. Login dengan akun Google yang sama dengan project Firebase

### 1.2 Pilih Project
1. Di halaman utama Firebase Console, cari project: **"aplikasi-amalan-harian"**
2. Klik project tersebut untuk masuk

### 1.3 Aktifkan Hosting
1. Di sidebar kiri, cari menu **"Hosting"** (ikon globe 🌐)
2. Klik **"Hosting"**
3. Jika muncul tombol **"Get started"** atau **"Add hosting"**, klik tombol tersebut
4. Jika sudah ada, skip ke langkah berikutnya

### 1.4 Setup Hosting (Wizard)
1. Pilih **"Web"** (ikon `</>`)
2. Klik **"Next"** atau **"Continue"**
3. Ikuti wizard sampai selesai
4. **PENTING:** Jangan deploy dulu, cukup setup hosting-nya saja
5. Setelah selesai, akan muncul URL default seperti:
   - `https://aplikasi-amalan-harian.web.app`
   - `https://aplikasi-amalan-harian.firebaseapp.com`

### 1.5 Verifikasi Hosting Aktif
- Pastikan di halaman Hosting tidak ada error
- Status harus menunjukkan hosting sudah aktif (meskipun belum ada deploy)

---

## 📋 LANGKAH 2: GENERATE FIREBASE SERVICE ACCOUNT KEY

### 2.1 Buka Service Accounts
1. Di Firebase Console, klik ikon **Settings** (gear ⚙️) di sidebar kiri
2. Pilih **"Project settings"**
3. Buka tab **"Service accounts"** (di bagian atas)

### 2.2 Generate Private Key
1. Scroll ke bawah, cari bagian **"Firebase Admin SDK"**
2. Pastikan **"Node.js"** sudah dipilih
3. Klik tombol **"Generate new private key"**
4. Akan muncul popup peringatan, klik **"Generate key"**
5. File JSON akan otomatis ter-download

### 2.3 Simpan File JSON
1. File akan ter-download dengan nama seperti: `aplikasi-amalan-harian-firebase-adminsdk-xxxxx-xxxxxxxxxx.json`
2. **JANGAN HAPUS FILE INI** - ini adalah kunci akses penting
3. Buka file dengan text editor (Notepad/VS Code)
4. **Copy SELURUH isi file** (Ctrl+A, Ctrl+C)
5. Isi file akan terlihat seperti:
   ```json
   {
     "type": "service_account",
     "project_id": "aplikasi-amalan-harian",
     "private_key_id": "...",
     "private_key": "-----BEGIN PRIVATE KEY-----\n...\n-----END PRIVATE KEY-----\n",
     "client_email": "...",
     ...
   }
   ```

---

## 📋 LANGKAH 3: SETUP GITHUB SECRETS

### 3.1 Buka GitHub Repository
1. Buka: **https://github.com/galuhmediautama-bit/amalan-harian-mareketer**
2. Pastikan sudah login ke GitHub

### 3.2 Buka Settings
1. Klik tab **"Settings"** (di bagian atas repository)
2. Di sidebar kiri, cari **"Secrets and variables"**
3. Klik **"Actions"** (di bawah "Secrets and variables")

### 3.3 Tambahkan Secret: FIREBASE_SERVICE_ACCOUNT

1. Klik tombol **"New repository secret"** (di kanan atas)
2. Di form yang muncul:
   - **Name:** Ketik: `FIREBASE_SERVICE_ACCOUNT`
   - **Secret:** Paste **SELURUH isi file JSON** yang sudah di-copy (dari Langkah 2.3)
3. **PENTING:** 
   - Paste **SELURUH isi JSON**, bukan path file
   - Harus dimulai dengan `{` dan diakhiri dengan `}`
   - Tidak boleh ada karakter tambahan
4. Klik **"Add secret"**

### 3.4 Tambahkan Secret: VITE_FIREBASE_API_KEY

1. Klik **"New repository secret"** lagi
2. Di form:
   - **Name:** `VITE_FIREBASE_API_KEY`
   - **Secret:** `AIzaSyATxyvm6ofdBXUXo0OLxYsAMjSBxLo4cl4`
3. Klik **"Add secret"**

### 3.5 Tambahkan Secret: VITE_FIREBASE_AUTH_DOMAIN

1. Klik **"New repository secret"**
2. Di form:
   - **Name:** `VITE_FIREBASE_AUTH_DOMAIN`
   - **Secret:** `aplikasi-amalan-harian.firebaseapp.com`
3. Klik **"Add secret"**

### 3.6 Tambahkan Secret: VITE_FIREBASE_PROJECT_ID

1. Klik **"New repository secret"**
2. Di form:
   - **Name:** `VITE_FIREBASE_PROJECT_ID`
   - **Secret:** `aplikasi-amalan-harian`
3. Klik **"Add secret"**

### 3.7 Tambahkan Secret: VITE_FIREBASE_STORAGE_BUCKET

1. Klik **"New repository secret"**
2. Di form:
   - **Name:** `VITE_FIREBASE_STORAGE_BUCKET`
   - **Secret:** `aplikasi-amalan-harian.firebasestorage.app`
3. Klik **"Add secret"**

### 3.8 Tambahkan Secret: VITE_FIREBASE_MESSAGING_SENDER_ID

1. Klik **"New repository secret"**
2. Di form:
   - **Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - **Secret:** `127881407758`
3. Klik **"Add secret"**

### 3.9 Tambahkan Secret: VITE_FIREBASE_APP_ID

1. Klik **"New repository secret"**
2. Di form:
   - **Name:** `VITE_FIREBASE_APP_ID`
   - **Secret:** `1:127881407758:web:64c33d8e4ab5be709bfb5f`
3. Klik **"Add secret"**

### 3.10 Verifikasi Semua Secrets

Pastikan ada **7 secrets** total:
- ✅ `FIREBASE_SERVICE_ACCOUNT`
- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_AUTH_DOMAIN`
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `VITE_FIREBASE_STORAGE_BUCKET`
- ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `VITE_FIREBASE_APP_ID`

---

## 📋 LANGKAH 4: TRIGGER DEPLOY

### 4.1 Buka GitHub Actions
1. Di repository GitHub, klik tab **"Actions"** (di bagian atas)
2. Pastikan workflow **"Deploy to Firebase Hosting"** terlihat

### 4.2 Run Workflow Manual
1. Di halaman Actions, cari workflow **"Deploy to Firebase Hosting"**
2. Klik workflow tersebut
3. Klik tombol **"Run workflow"** (di kanan atas)
4. Pastikan branch **"main"** terpilih
5. Klik **"Run workflow"** (tombol hijau)

### 4.3 Monitor Progress
1. Setelah klik "Run workflow", akan muncul workflow run baru
2. Klik workflow run tersebut untuk melihat progress
3. Klik job **"build_and_deploy"** untuk melihat detail
4. Monitor setiap step:
   - ✅ **Checkout code** - Harus sukses
   - ✅ **Setup Node.js** - Harus sukses
   - ✅ **Verify secrets are set** - Harus sukses
   - ✅ **Install dependencies** - Harus sukses
   - ✅ **Build** - Harus sukses
   - ✅ **Verify build output** - Harus sukses
   - ✅ **Setup Google Cloud SDK** - Harus sukses
   - ✅ **Setup Firebase CLI** - Harus sukses
   - ✅ **Authenticate Firebase** - Harus sukses
   - ✅ **Deploy to Firebase Hosting** - Harus sukses

### 4.4 Cek Hasil
1. Jika semua step sukses (✅ hijau), deploy berhasil!
2. Buka URL aplikasi:
   - **https://aplikasi-amalan-harian.web.app**
   - **https://aplikasi-amalan-harian.firebaseapp.com**
3. Aplikasi harus sudah bisa diakses

---

## 🔍 TROUBLESHOOTING

### ❌ Error: "FIREBASE_SERVICE_ACCOUNT is not set"
**Penyebab:** Secret belum ditambahkan atau nama salah
**Solusi:**
1. Buka Settings → Secrets → Actions
2. Pastikan ada secret dengan nama **exact**: `FIREBASE_SERVICE_ACCOUNT`
3. Pastikan isi JSON lengkap (mulai dengan `{` dan diakhiri `}`)

### ❌ Error: "Build failed - VITE_FIREBASE_API_KEY is undefined"
**Penyebab:** Environment variable belum ditambahkan
**Solusi:**
1. Pastikan semua 6 environment variables sudah ditambahkan
2. Pastikan nama secret **exact** sesuai (case-sensitive)
3. Re-run workflow setelah menambahkan

### ❌ Error: "Failed to authenticate, have you run firebase login?"
**Penyebab:** Service Account JSON tidak valid atau Hosting belum aktif
**Solusi:**
1. Pastikan Firebase Hosting sudah aktif (Langkah 1)
2. Pastikan Service Account JSON lengkap dan valid
3. Generate ulang Service Account Key jika perlu

### ❌ Error: "Site Not Found" di Firebase
**Penyebab:** Hosting belum diaktifkan atau deploy belum berhasil
**Solusi:**
1. Pastikan Hosting sudah aktif (Langkah 1)
2. Pastikan workflow deploy berhasil (semua step hijau)
3. Tunggu 1-2 menit setelah deploy untuk propagasi DNS

### ❌ Error: "Project not found"
**Penyebab:** Project ID tidak sesuai
**Solusi:**
1. Pastikan project ID di Firebase Console adalah `aplikasi-amalan-harian`
2. Pastikan Service Account JSON memiliki `project_id: "aplikasi-amalan-harian"`

---

## ✅ CHECKLIST FINAL

Sebelum deploy, pastikan:

- [ ] Firebase Hosting sudah aktif di Console
- [ ] Service Account Key sudah di-generate dan di-download
- [ ] `FIREBASE_SERVICE_ACCOUNT` secret sudah ditambahkan (isi JSON lengkap)
- [ ] Semua 6 environment variables sudah ditambahkan
- [ ] Semua nama secret **exact** sesuai (case-sensitive, tidak ada typo)
- [ ] Workflow sudah di-run dan semua step sukses
- [ ] Aplikasi bisa diakses di URL Firebase

---

## 🎉 SETELAH DEPLOY BERHASIL

### Deploy Otomatis
- Setiap kali push code ke branch `main`, deploy akan otomatis berjalan
- Cek tab **Actions** untuk melihat status deploy

### Update Aplikasi
1. Edit code di local
2. Commit dan push ke GitHub:
   ```bash
   git add .
   git commit -m "Update aplikasi"
   git push
   ```
3. Deploy akan otomatis berjalan
4. Tunggu 1-2 menit, aplikasi akan ter-update

### Cek Log Deploy
- Buka tab **Actions** di GitHub
- Klik workflow run terbaru
- Lihat log untuk troubleshooting jika ada masalah

---

## 📞 BUTUH BANTUAN?

Jika masih ada masalah:
1. Screenshot error dari GitHub Actions
2. Cek log detail di step yang gagal
3. Pastikan semua checklist sudah dilakukan
4. Verifikasi semua secrets sudah benar

---

**Selamat! Aplikasi Anda sekarang sudah online! 🚀**


