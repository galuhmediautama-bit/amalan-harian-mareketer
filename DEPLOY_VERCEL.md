# 🚀 Panduan Deploy ke Vercel - Lengkap

Panduan lengkap untuk deploy aplikasi **Amalan Marketer Berkah** ke Vercel.

---

## 📋 Prasyarat

1. ✅ Akun GitHub (sudah punya repository)
2. ✅ Akun Vercel (gratis)
3. ✅ Supabase sudah setup (database, tables, RLS policies)
4. ✅ Environment variables Supabase sudah siap

---

## 🔧 Langkah 1: Setup Vercel Project

### 1.1. Buat Akun Vercel (Jika Belum)

1. Buka: **https://vercel.com**
2. Klik **"Sign Up"**
3. Login dengan **GitHub** (pilih akun yang sama dengan repository)

### 1.2. Import Project dari GitHub

1. Setelah login, klik **"Add New..."** → **"Project"**
2. Pilih repository: **galuhmediautama-bit/amalan-harian-mareketer**
3. Klik **"Import"**

### 1.3. Configure Project

Vercel akan otomatis detect Vite. Pastikan:

- **Framework Preset:** `Vite` ✅
- **Root Directory:** `./` (default) ✅
- **Build Command:** `npm run build` ✅
- **Output Directory:** `dist` ✅
- **Install Command:** `npm install` ✅

**File `vercel.json` sudah ada dan sudah dikonfigurasi dengan benar!**

---

## 🔐 Langkah 2: Setup Environment Variables

**PENTING:** Environment variables harus di-set di Vercel agar aplikasi bisa connect ke Supabase!

### 2.1. Tambahkan Environment Variables

Di halaman setup project, scroll ke **"Environment Variables"** dan tambahkan:

| Name | Value | Description |
|------|-------|-------------|
| `VITE_SUPABASE_URL` | `https://ojmicttywrqeflqjmqfm.supabase.co` | Supabase Project URL |
| `VITE_SUPABASE_ANON_KEY` | `sb_publishable_HzNq1XczyC627BynN6UXjw_10Vb-Yg9` | Supabase Anon Key (Public) |

**Cara menambahkan:**
1. Klik **"Add"** di Environment Variables
2. Masukkan **Name** dan **Value**
3. Pilih **Environment:** `Production`, `Preview`, dan `Development` (centang semua)
4. Klik **"Save"**

### 2.2. Environment Variables Lainnya (Opsional)

Jika ada environment variables lain (misalnya untuk Gemini API), tambahkan juga:

| Name | Value | Description |
|------|-------|-------------|
| `GEMINI_API_KEY` | `your-gemini-api-key` | Untuk fitur AI (jika ada) |

---

## 🚀 Langkah 3: Deploy!

### 3.1. Deploy Pertama

1. Setelah setup environment variables, klik **"Deploy"**
2. Tunggu sampai deploy selesai (1-3 menit)
3. Setelah selesai, akan muncul URL seperti:
   - `https://amalan-harian-mareketer.vercel.app`
   - Atau custom domain jika sudah setup

### 3.2. Verifikasi Deploy

1. Buka URL yang diberikan Vercel
2. Pastikan aplikasi bisa diakses
3. Test login/signup
4. Test fitur-fitur utama

---

## 🔄 Langkah 4: Auto Deploy (Otomatis)

Setelah setup pertama, Vercel akan **otomatis deploy** setiap kali Anda:

1. **Push ke GitHub:**
   ```bash
   git add .
   git commit -m "Update aplikasi"
   git push origin main
   ```

2. **Vercel akan otomatis:**
   - Detect perubahan
   - Build aplikasi
   - Deploy ke production
   - Memberikan preview URL untuk setiap commit

---

## 📝 Langkah 5: Setup Custom Domain (Opsional)

### 5.1. Tambahkan Domain

1. Buka project di Vercel Dashboard
2. Klik **Settings** → **Domains**
3. Klik **"Add Domain"**
4. Masukkan domain Anda (misalnya: `amalan.marketerberkah.com`)
5. Ikuti instruksi untuk setup DNS

### 5.2. Setup DNS

Tambahkan record DNS di provider domain Anda:

| Type | Name | Value |
|------|------|-------|
| `CNAME` | `@` atau `www` | `cname.vercel-dns.com` |

Atau gunakan **A Record** jika Vercel memberikan IP address.

---

## ✅ Checklist Sebelum Deploy

Sebelum deploy, pastikan:

- [ ] ✅ File `vercel.json` sudah ada dan benar
- [ ] ✅ Environment variables Supabase sudah di-set di Vercel
- [ ] ✅ Database Supabase sudah setup (tables, RLS policies)
- [ ] ✅ Build lokal berhasil (`npm run build`)
- [ ] ✅ Tidak ada error di console
- [ ] ✅ Aplikasi bisa diakses di localhost

---

## 🔍 Troubleshooting

### Error: "Environment variable not found"

**Solusi:**
1. Pastikan environment variables sudah di-set di Vercel
2. Pastikan nama variable dimulai dengan `VITE_` untuk Vite
3. Redeploy setelah menambahkan environment variables

### Error: "Build failed"

**Solusi:**
1. Cek build lokal: `npm run build`
2. Pastikan semua dependencies terinstall: `npm install`
3. Cek error di Vercel build logs

### Error: "Cannot connect to Supabase"

**Solusi:**
1. Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` sudah benar
2. Pastikan Supabase project masih aktif
3. Cek RLS policies di Supabase

### Aplikasi Blank/Error

**Solusi:**
1. Cek browser console untuk error
2. Pastikan environment variables sudah di-set
3. Cek network tab untuk request yang gagal
4. Redeploy aplikasi

---

## 📊 Monitoring & Analytics

### Vercel Analytics (Opsional)

1. Buka project di Vercel Dashboard
2. Klik **Analytics** tab
3. Enable **Web Analytics** (gratis untuk hobby plan)
4. Lihat traffic, performance, dan user behavior

---

## 🔄 Update Aplikasi

Setelah setup pertama, untuk update aplikasi:

1. **Edit code di local**
2. **Commit dan push ke GitHub:**
   ```bash
   git add .
   git commit -m "Update: deskripsi perubahan"
   git push origin main
   ```
3. **Vercel otomatis deploy** (tunggu 1-3 menit)
4. **Aplikasi langsung update** di production

---

## 🎯 Keuntungan Vercel

- ✅ **Deploy cepat** - Hanya 1-3 menit
- ✅ **Auto HTTPS** - SSL otomatis
- ✅ **CDN Global** - Performa cepat di seluruh dunia
- ✅ **Preview Deployments** - Setiap commit dapat preview URL
- ✅ **Auto Deploy** - Otomatis deploy dari GitHub
- ✅ **Analytics** - Built-in analytics (opsional)
- ✅ **Custom Domain** - Mudah setup custom domain
- ✅ **Gratis** - Hobby plan gratis untuk personal projects

---

## 📞 Support

Jika ada masalah:

1. Cek **Vercel Build Logs** di dashboard
2. Cek **Browser Console** untuk error
3. Cek **Supabase Dashboard** untuk database issues
4. Lihat dokumentasi Vercel: https://vercel.com/docs

---

## 🎉 Selesai!

Setelah deploy berhasil, aplikasi Anda akan live di Vercel!

**URL Production:** `https://[project-name].vercel.app`

**Selamat! Aplikasi Anda sudah online! 🚀**


