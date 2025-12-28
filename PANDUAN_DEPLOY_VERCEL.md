# 🚀 Panduan Deploy ke Vercel

Vercel lebih mudah dan cepat dibanding Firebase Hosting!

## 📋 Langkah-langkah Setup

### 1. Buat Akun Vercel (Jika Belum)

1. Buka: **https://vercel.com**
2. Klik **"Sign Up"**
3. Login dengan **GitHub** (pilih akun yang sama dengan repository)

### 2. Import Project dari GitHub

1. Setelah login, klik **"Add New..."** → **"Project"**
2. Pilih repository: **galuhmediautama-bit/amalan-harian-mareketer**
3. Klik **"Import"**

### 3. Configure Project

1. **Framework Preset:** Pilih **"Vite"** (otomatis terdeteksi)
2. **Root Directory:** `./` (default)
3. **Build Command:** `npm run build` (sudah otomatis)
4. **Output Directory:** `dist` (sudah otomatis)
5. **Install Command:** `npm install` (sudah otomatis)

### 4. Setup Environment Variables

Di halaman setup project, scroll ke **"Environment Variables"**:

Tambahkan semua environment variables dari Firebase:

| Name | Value |
|------|-------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyATxyvm6ofdBXUXo0OLxYsAMjSBxLo4cl4` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `aplikasi-amalan-harian.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `aplikasi-amalan-harian` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `aplikasi-amalan-harian.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `127881407758` |
| `VITE_FIREBASE_APP_ID` | `1:127881407758:web:64c33d8e4ab5be709bfb5f` |

### 5. Deploy!

1. Klik **"Deploy"**
2. Tunggu sampai deploy selesai (1-2 menit)
3. Setelah selesai, akan muncul URL seperti:
   - `https://amalan-harian-mareketer.vercel.app`
   - Atau custom domain jika sudah setup

---

## 🔄 Deploy Otomatis dengan GitHub Actions (Opsional)

Jika ingin deploy otomatis via GitHub Actions:

### 1. Dapatkan Vercel Tokens

1. Buka: **https://vercel.com/account/tokens**
2. Klik **"Create Token"**
3. Beri nama: `GitHub Actions Deploy`
4. Copy token yang muncul (simpan dengan aman!)

### 2. Dapatkan Org ID dan Project ID

1. Buka project di Vercel
2. Klik **Settings** → **General**
3. Copy **"Organization ID"** dan **"Project ID"**

### 3. Tambahkan GitHub Secrets

Buka: **https://github.com/galuhmediautama-bit/amalan-harian-mareketer/settings/secrets/actions**

Tambahkan 3 secrets:

1. **Name:** `VERCEL_TOKEN`  
   **Value:** Token dari langkah 1

2. **Name:** `VERCEL_ORG_ID`  
   **Value:** Organization ID dari langkah 2

3. **Name:** `VERCEL_PROJECT_ID`  
   **Value:** Project ID dari langkah 2

### 4. Aktifkan Workflow

1. Buka tab **Actions** di GitHub
2. Workflow **"Deploy to Vercel"** akan otomatis berjalan setelah push
3. Atau klik **"Run workflow"** untuk deploy manual

---

## ✅ Keuntungan Vercel

- ✅ **Lebih mudah** - Tidak perlu setup service account
- ✅ **Lebih cepat** - Deploy dalam hitungan detik
- ✅ **Auto HTTPS** - SSL otomatis
- ✅ **CDN Global** - Performa cepat di seluruh dunia
- ✅ **Preview Deployments** - Setiap PR dapat preview URL
- ✅ **Analytics** - Built-in analytics
- ✅ **Custom Domain** - Mudah setup custom domain

---

## 🔄 Update Aplikasi

Setelah setup pertama:

1. **Via Vercel Dashboard:**
   - Push code ke GitHub
   - Vercel otomatis detect dan deploy

2. **Via GitHub Actions:**
   - Push code ke GitHub
   - Workflow otomatis deploy ke Vercel

---

## 📝 Catatan

- **Firebase masih digunakan** untuk:
  - Authentication (login)
  - Firestore Database (penyimpanan data)
- **Vercel hanya untuk hosting** (menyajikan aplikasi)
- Environment variables harus sama di Vercel dan GitHub Secrets

---

**Setelah deploy pertama, aplikasi akan live di Vercel! 🎉**


