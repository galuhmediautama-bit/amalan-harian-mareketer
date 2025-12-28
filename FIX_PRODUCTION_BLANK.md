# 🔧 Fix: Blank Putih di Production Setelah Login

## Masalah
Setelah login di production (Vercel), halaman menjadi blank putih.

## Kemungkinan Penyebab

1. **Environment Variables tidak ter-set di Vercel**
   - `VITE_SUPABASE_URL` tidak ada
   - `VITE_SUPABASE_ANON_KEY` tidak ada

2. **Error JavaScript yang tidak ter-handle**
   - Error di `onAuthChange`
   - Error di `getUserData`
   - Error di Supabase client initialization

3. **Build issue**
   - Code splitting error
   - Missing dependencies

## Solusi

### 1. ✅ Tambahkan Error Boundary
- File `components/ErrorBoundary.tsx` sudah dibuat
- Error boundary akan catch semua error dan tampilkan pesan user-friendly

### 2. ✅ Perbaiki Error Handling
- Tambah try-catch di `onAuthChange`
- Tambah fallback values untuk Supabase config
- Improve error logging

### 3. ⚠️ **PENTING: Set Environment Variables di Vercel**

Buka Vercel Dashboard → Project → Settings → Environment Variables

Tambahkan:
```
VITE_SUPABASE_URL = https://ojmicttywrqeflqjmqfm.supabase.co
VITE_SUPABASE_ANON_KEY = sb_publishable_HzNq1XczyC627BynN6UXjw_10Vb-Yg9
```

**PENTING:**
- Centang **Production**, **Preview**, dan **Development**
- Setelah menambahkan, **redeploy** aplikasi

### 4. Verifikasi Build

```bash
npm run build
```

Pastikan build berhasil tanpa error.

### 5. Test di Local Production Build

```bash
npm run build
npm run preview
```

Buka `http://localhost:4173` dan test login.

## Debugging Steps

### 1. Cek Browser Console
1. Buka production URL
2. Tekan F12 untuk buka DevTools
3. Cek tab **Console** untuk error
4. Cek tab **Network** untuk failed requests

### 2. Cek Vercel Logs
1. Buka Vercel Dashboard
2. Pilih project
3. Klik tab **Logs**
4. Cari error saat build atau runtime

### 3. Cek Environment Variables
1. Buka Vercel Dashboard → Settings → Environment Variables
2. Pastikan `VITE_SUPABASE_URL` dan `VITE_SUPABASE_ANON_KEY` ada
3. Pastikan ter-centang untuk **Production**

## Setelah Fix

1. ✅ Commit perubahan
2. ✅ Push ke GitHub
3. ✅ Vercel akan auto-deploy
4. ✅ Test login di production
5. ✅ Cek browser console untuk error

## Jika Masih Blank

1. **Clear browser cache** (Ctrl+Shift+R)
2. **Test di incognito mode**
3. **Cek Vercel build logs** untuk error
4. **Cek Supabase dashboard** untuk API errors
5. **Test dengan user baru** (mungkin ada issue dengan data existing)

---

**Setelah set environment variables di Vercel dan redeploy, masalah seharusnya teratasi!**


