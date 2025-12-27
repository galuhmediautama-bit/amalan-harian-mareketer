# 🚀 Quick Setup GitHub Actions Deploy

## Langkah Cepat (5 Menit)

### 1. Buat Repository GitHub
- Buat repository baru di https://github.com/new
- Jangan centang "Initialize with README"

### 2. Push Code ke GitHub

```bash
git init
git add .
git commit -m "Initial commit"
git branch -M main
git remote add origin https://github.com/USERNAME/REPO_NAME.git
git push -u origin main
```

### 3. Generate Firebase Service Account
1. Buka: https://console.firebase.google.com/project/aplikasi-amalan-harian/settings/serviceaccounts/adminsdk
2. Klik **Generate new private key**
3. Download file JSON

### 4. Setup GitHub Secrets
1. Buka repository → **Settings** → **Secrets and variables** → **Actions**
2. Tambahkan secret:
   - **Name:** `FIREBASE_SERVICE_ACCOUNT`
   - **Value:** Copy **seluruh isi** file JSON yang didownload

3. Tambahkan environment variables (dari `.env.local`):
   - `VITE_FIREBASE_API_KEY`
   - `VITE_FIREBASE_AUTH_DOMAIN`
   - `VITE_FIREBASE_PROJECT_ID`
   - `VITE_FIREBASE_STORAGE_BUCKET`
   - `VITE_FIREBASE_MESSAGING_SENDER_ID`
   - `VITE_FIREBASE_APP_ID`

### 5. Deploy Otomatis! ✅
- Push code akan otomatis trigger deploy
- Atau manual: **Actions** → **Deploy to Firebase Hosting** → **Run workflow**

**URL Aplikasi:**
- https://aplikasi-amalan-harian.web.app
- https://aplikasi-amalan-harian.firebaseapp.com

---

📖 Detail lengkap: Lihat `GITHUB_DEPLOY.md`

