# 🔧 Troubleshooting GitHub Actions Deploy

## Workflow Gagal? Ikuti Langkah Ini:

### 1. Cek Log Error di GitHub Actions

1. Buka: https://github.com/galuhmediautama-bit/amalan-harian-mareketer/actions
2. Klik workflow run yang gagal (yang ada tanda X merah)
3. Klik job "build_and_deploy"
4. Lihat step mana yang gagal:
   - ❌ **Build failed** → Environment variables belum di-setup
   - ❌ **Deploy to Firebase failed** → Firebase Service Account belum di-setup

### 2. Setup GitHub Secrets (WAJIB!)

Buka: https://github.com/galuhmediautama-bit/amalan-harian-mareketer/settings/secrets/actions

#### A. Firebase Service Account (PENTING!)

1. Generate Service Account Key:
   - Buka: https://console.firebase.google.com/project/aplikasi-amalan-harian/settings/serviceaccounts/adminsdk
   - Klik **"Generate new private key"**
   - Download file JSON

2. Tambahkan Secret:
   - Name: `FIREBASE_SERVICE_ACCOUNT`
   - Value: **Copy SELURUH isi file JSON** (bukan path file!)
   - Format harus seperti ini:
     ```json
     {
       "type": "service_account",
       "project_id": "aplikasi-amalan-harian",
       ...
     }
     ```

#### B. Environment Variables (WAJIB untuk Build!)

Tambahkan semua secrets berikut:

| Name | Value (dari .env.local) |
|------|------------------------|
| `VITE_FIREBASE_API_KEY` | `AIzaSyATxyvm6ofdBXUXo0OLxYsAMjSBxLo4cl4` |
| `VITE_FIREBASE_AUTH_DOMAIN` | `aplikasi-amalan-harian.firebaseapp.com` |
| `VITE_FIREBASE_PROJECT_ID` | `aplikasi-amalan-harian` |
| `VITE_FIREBASE_STORAGE_BUCKET` | `aplikasi-amalan-harian.firebasestorage.app` |
| `VITE_FIREBASE_MESSAGING_SENDER_ID` | `127881407758` |
| `VITE_FIREBASE_APP_ID` | `1:127881407758:web:64c33d8e4ab5be709bfb5f` |

### 3. Setelah Setup Secrets, Re-run Workflow

1. Buka tab **Actions**
2. Pilih workflow **"Deploy to Firebase Hosting"**
3. Klik **"Run workflow"** → **"Run workflow"**

### 4. Error Umum & Solusi

#### ❌ Error: "Secret not found"
**Solusi:** Pastikan semua secrets sudah ditambahkan dengan nama yang tepat (case-sensitive!)

#### ❌ Error: "Build failed - VITE_FIREBASE_API_KEY is undefined"
**Solusi:** Pastikan semua environment variables sudah ditambahkan di GitHub Secrets

#### ❌ Error: "Firebase authentication failed"
**Solusi:** 
- Pastikan `FIREBASE_SERVICE_ACCOUNT` sudah ditambahkan
- Pastikan isi JSON lengkap (copy seluruh isi file, bukan path)
- Pastikan project ID di JSON sesuai dengan project Firebase

#### ❌ Error: "Project not found"
**Solusi:** Pastikan project ID di `.firebaserc` sesuai dengan project di Firebase Console

### 5. Verifikasi Setup

Setelah semua secrets ditambahkan, workflow akan:
1. ✅ Checkout code
2. ✅ Setup Node.js
3. ✅ Install dependencies
4. ✅ Build aplikasi (dengan environment variables)
5. ✅ Deploy ke Firebase Hosting

### 6. Cek Status Deploy

Setelah deploy berhasil:
- URL: https://aplikasi-amalan-harian.web.app
- Atau: https://aplikasi-amalan-harian.firebaseapp.com

---

**💡 Tips:**
- Setelah menambahkan secrets, **re-run workflow** untuk trigger deploy ulang
- Setiap push ke branch `main` akan otomatis trigger deploy
- Cek tab **Actions** untuk melihat progress real-time

