# Deploy Otomatis dengan GitHub Actions

Setup ini akan membuat aplikasi otomatis ter-deploy ke Firebase Hosting setiap kali Anda push code ke GitHub.

## Langkah-langkah Setup

### 1. Push Code ke GitHub

Jika belum ada repository GitHub:

```bash
# Inisialisasi git (jika belum)
git init

# Tambahkan semua file
git add .

# Commit
git commit -m "Initial commit"

# Buat repository baru di GitHub, lalu:
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git branch -M main
git push -u origin main
```

### 2. Generate Firebase Service Account Key

1. Buka [Firebase Console](https://console.firebase.google.com/)
2. Pilih project: **aplikasi-amalan-harian**
3. Klik ikon **Settings** (gear) → **Project settings**
4. Buka tab **Service accounts**
5. Klik **Generate new private key**
6. Download file JSON (simpan dengan aman, ini adalah kunci akses)

### 3. Setup GitHub Secrets

1. Buka repository GitHub Anda
2. Klik **Settings** → **Secrets and variables** → **Actions**
3. Klik **New repository secret**
4. Tambahkan secrets berikut:

#### a. Firebase Service Account
- **Name:** `FIREBASE_SERVICE_ACCOUNT`
- **Value:** Copy **seluruh isi** file JSON yang didownload (bukan path file, tapi isi JSON-nya)

#### b. Environment Variables Firebase
Tambahkan semua environment variables dari `.env.local`:

- **Name:** `VITE_FIREBASE_API_KEY`
- **Value:** (dari .env.local)

- **Name:** `VITE_FIREBASE_AUTH_DOMAIN`
- **Value:** (dari .env.local)

- **Name:** `VITE_FIREBASE_PROJECT_ID`
- **Value:** (dari .env.local)

- **Name:** `VITE_FIREBASE_STORAGE_BUCKET`
- **Value:** (dari .env.local)

- **Name:** `VITE_FIREBASE_MESSAGING_SENDER_ID`
- **Value:** (dari .env.local)

- **Name:** `VITE_FIREBASE_APP_ID`
- **Value:** (dari .env.local)

### 4. Deploy Otomatis

Setelah setup selesai:

1. **Push code ke GitHub** (jika belum)
2. GitHub Actions akan otomatis:
   - Build aplikasi
   - Deploy ke Firebase Hosting
3. Cek status di tab **Actions** di GitHub
4. Setelah deploy selesai, aplikasi akan live di:
   - `https://aplikasi-amalan-harian.web.app`
   - `https://aplikasi-amalan-harian.firebaseapp.com`

### 5. Deploy Manual (Opsional)

Jika ingin deploy manual tanpa push code:

1. Buka tab **Actions** di GitHub
2. Pilih workflow **Deploy to Firebase Hosting**
3. Klik **Run workflow**
4. Pilih branch (main/master)
5. Klik **Run workflow**

## Troubleshooting

### Error: Firebase Service Account not found
- Pastikan secret `FIREBASE_SERVICE_ACCOUNT` sudah ditambahkan dengan benar
- Pastikan isi JSON lengkap (copy seluruh isi file)

### Error: Build failed
- Cek apakah semua environment variables sudah ditambahkan di GitHub Secrets
- Pastikan nama secret sesuai dengan yang ada di workflow file

### Deploy tidak otomatis
- Pastikan branch yang digunakan adalah `main` atau `master`
- Cek tab **Actions** untuk melihat log error

## File yang Sudah Dibuat

- `.github/workflows/deploy.yml` - Workflow untuk deploy otomatis
- `firebase.json` - Konfigurasi Firebase Hosting
- `.firebaserc` - Project ID configuration

## Catatan Penting

- **Jangan commit file `.env.local`** ke GitHub (sudah ada di .gitignore)
- **Firebase Service Account Key** adalah kunci akses penting, jangan share ke publik
- Setiap push ke branch `main` akan trigger deploy otomatis

