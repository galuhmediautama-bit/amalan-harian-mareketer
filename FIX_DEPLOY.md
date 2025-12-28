# 🔴 MASALAH: Workflow Gagal & Site Not Found

## ⚠️ PENTING: Firebase Hosting Harus Diaktifkan Dulu!

Dari error "Site Not Found", kemungkinan besar **Firebase Hosting belum diaktifkan** di Firebase Console.

## Langkah Perbaikan (URUTAN PENTING!)

### 1. ✅ Aktifkan Firebase Hosting di Console (WAJIB!)

1. Buka: https://console.firebase.google.com/project/aplikasi-amalan-harian/hosting
2. Klik **"Get started"** atau **"Add hosting"**
3. Pilih **"Web"** (ikon `</>`)
4. Ikuti wizard setup:
   - Klik **"Next"** sampai selesai
   - **JANGAN** deploy dulu, cukup setup hosting-nya saja
5. Setelah hosting aktif, akan muncul URL default

**Catatan:** Hosting harus diaktifkan minimal sekali sebelum GitHub Actions bisa deploy!

### 2. ✅ Verifikasi GitHub Secrets

Buka: https://github.com/galuhmediautama-bit/amalan-harian-mareketer/settings/secrets/actions

Pastikan ada **7 secrets** berikut:

#### A. Firebase Service Account
- ✅ `FIREBASE_SERVICE_ACCOUNT` 
  - Harus berisi **seluruh isi JSON** dari Service Account Key
  - Bukan path file, tapi isi JSON-nya!
  - Format: `{"type":"service_account","project_id":"aplikasi-amalan-harian",...}`

#### B. Environment Variables (6 secrets)
- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_AUTH_DOMAIN`
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `VITE_FIREBASE_STORAGE_BUCKET`
- ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `VITE_FIREBASE_APP_ID`

### 3. ✅ Cek Log Error Spesifik

Untuk melihat error yang sebenarnya:

1. Buka: https://github.com/galuhmediautama-bit/amalan-harian-mareketer/actions
2. Klik workflow run yang gagal (yang ada X merah)
3. Klik job **"build_and_deploy"**
4. Lihat step mana yang gagal:
   - **"Build"** gagal → Environment variables belum benar
   - **"Deploy to Firebase"** gagal → Firebase Service Account atau Hosting belum aktif

### 4. ✅ Re-run Workflow Setelah Perbaikan

Setelah hosting diaktifkan dan secrets sudah benar:

1. Buka tab **Actions**
2. Pilih workflow **"Deploy to Firebase Hosting"**
3. Klik **"Run workflow"** → **"Run workflow"**

## Checklist Perbaikan

- [ ] Firebase Hosting sudah diaktifkan di Console
- [ ] `FIREBASE_SERVICE_ACCOUNT` secret sudah ditambahkan (isi JSON lengkap)
- [ ] Semua 6 environment variables sudah ditambahkan
- [ ] Sudah re-run workflow setelah perbaikan
- [ ] Cek log error untuk melihat masalah spesifik

## Error Umum & Solusi

### ❌ "Site Not Found" di Firebase
**Penyebab:** Firebase Hosting belum diaktifkan
**Solusi:** Ikuti langkah 1 di atas untuk mengaktifkan hosting

### ❌ "Firebase authentication failed"
**Penyebab:** Service Account JSON tidak lengkap atau salah format
**Solusi:** 
- Pastikan copy **seluruh isi** file JSON
- Pastikan tidak ada karakter tambahan
- Pastikan project_id di JSON sesuai

### ❌ "Build failed - VITE_FIREBASE_API_KEY is undefined"
**Penyebab:** Environment variable belum ditambahkan
**Solusi:** Pastikan semua 6 environment variables sudah ditambahkan di GitHub Secrets

### ❌ "Project not found"
**Penyebab:** Project ID tidak sesuai
**Solusi:** Pastikan project ID di `.firebaserc` adalah `aplikasi-amalan-harian`

## Setelah Semua Benar

Setelah hosting aktif dan secrets benar, workflow akan:
1. ✅ Checkout code
2. ✅ Setup Node.js  
3. ✅ Install dependencies
4. ✅ Build aplikasi
5. ✅ Deploy ke Firebase Hosting

Aplikasi akan live di:
- https://aplikasi-amalan-harian.web.app
- https://aplikasi-amalan-harian.firebaseapp.com

---

**💡 TIP:** Jika masih gagal setelah semua langkah di atas, screenshot log error dari GitHub Actions dan share untuk diagnosa lebih lanjut.


