# ⚡ Quick Start - Deploy ke Vercel

Panduan cepat deploy aplikasi ke Vercel dalam 5 menit!

---

## 🚀 Langkah Cepat

### 1. Login ke Vercel
- Buka: **https://vercel.com**
- Login dengan **GitHub**

### 2. Import Project
- Klik **"Add New..."** → **"Project"**
- Pilih repository: **galuhmediautama-bit/amalan-harian-mareketer**
- Klik **"Import"**

### 3. Setup Environment Variables
Tambahkan 2 environment variables ini:

```
VITE_SUPABASE_URL = https://ojmicttywrqeflqjmqfm.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_HzNq1XczyC627BynN6UXjw_10Vb-Yg9
```

**Cara:**
1. Scroll ke **"Environment Variables"**
2. Klik **"Add"**
3. Masukkan Name dan Value
4. Centang **Production**, **Preview**, **Development**
5. Klik **"Save"**

### 4. Deploy!
- Klik **"Deploy"**
- Tunggu 1-3 menit
- **Selesai!** 🎉

---

## ✅ Checklist

Sebelum deploy, pastikan:
- [ ] ✅ Supabase database sudah setup (jalankan `supabase-schema.sql`)
- [ ] ✅ Environment variables sudah di-set di Vercel
- [ ] ✅ Build lokal berhasil (`npm run build`)

---

## 🔄 Update Aplikasi

Setelah setup pertama:
1. Push code ke GitHub
2. Vercel otomatis deploy
3. Selesai!

---

## 📖 Panduan Lengkap

Lihat **`DEPLOY_VERCEL.md`** untuk panduan lengkap dengan troubleshooting.

---

**Selamat! Aplikasi Anda sudah online! 🚀**


