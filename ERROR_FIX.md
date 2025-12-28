# 🔧 Fix: npx failed with exit code 1

## Penyebab Error

Error `The process '/opt/hostedtoolcache/node/18.20.8/x64/bin/npx' failed with exit code 1` biasanya terjadi karena:

1. **Build gagal** - Environment variables tidak ter-set dengan benar
2. **npm ci gagal** - Ada masalah dengan dependencies
3. **Firebase action gagal** - Service Account tidak valid atau Hosting belum aktif

## Solusi

### 1. Pastikan Semua Secrets Sudah Di-Setup

Buka: https://github.com/galuhmediautama-bit/amalan-harian-mareketer/settings/secrets/actions

**Wajib ada 7 secrets:**
- ✅ `FIREBASE_SERVICE_ACCOUNT` (isi JSON lengkap)
- ✅ `VITE_FIREBASE_API_KEY`
- ✅ `VITE_FIREBASE_AUTH_DOMAIN`
- ✅ `VITE_FIREBASE_PROJECT_ID`
- ✅ `VITE_FIREBASE_STORAGE_BUCKET`
- ✅ `VITE_FIREBASE_MESSAGING_SENDER_ID`
- ✅ `VITE_FIREBASE_APP_ID`

### 2. Pastikan Firebase Hosting Sudah Aktif

1. Buka: https://console.firebase.google.com/project/aplikasi-amalan-harian/hosting
2. Jika belum aktif, klik **"Get started"** dan setup hosting
3. **PENTING:** Hosting harus diaktifkan minimal sekali sebelum deploy bisa jalan

### 3. Cek Log Error Detail

1. Buka workflow run yang gagal
2. Klik step yang gagal (biasanya "Build" atau "Deploy to Firebase")
3. Lihat log error lengkap di bagian bawah

### 4. Workflow Sudah Diperbaiki

Workflow sudah diperbaiki dengan:
- ✅ Verifikasi secrets sebelum build
- ✅ Verifikasi build output
- ✅ Error handling yang lebih baik

**Langkah selanjutnya:**
1. Commit dan push perubahan workflow yang sudah diperbaiki
2. Re-run workflow
3. Cek log untuk melihat step mana yang gagal

## Debug Steps

Jika masih gagal, cek:

1. **Build Step:**
   - Apakah environment variables ter-load?
   - Apakah `dist/` folder terbuat?
   - Apakah ada error di log build?

2. **Deploy Step:**
   - Apakah Firebase Service Account valid?
   - Apakah Hosting sudah aktif?
   - Apakah project ID benar?

## Alternatif: Deploy Manual (Testing)

Untuk test apakah masalahnya di GitHub Actions atau setup:

```bash
# Di local
npm run build
firebase deploy --only hosting
```

Jika deploy manual berhasil, berarti masalahnya di GitHub Actions setup.


