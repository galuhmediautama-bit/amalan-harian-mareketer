# 🚨 PENTING: Setup Tabel Partnerships di Supabase

## Masalah Saat Ini
Error: `Could not find the table 'public.partnerships' in the schema cache`

**Ini terjadi karena tabel `partnerships` belum dibuat di database Supabase Anda.**

---

## ✅ SOLUSI - Ikuti Langkah Ini:

### Langkah 1: Buka Supabase Dashboard
1. Buka browser dan login ke: **https://supabase.com/dashboard**
2. Pilih project Anda (yang URL-nya: `ojmicttywrqeflqjmqfm.supabase.co`)

### Langkah 2: Buka SQL Editor
1. Di sidebar kiri, klik **"SQL Editor"** (ikon database dengan kode)
2. Atau langsung buka: https://supabase.com/dashboard/project/[PROJECT_ID]/sql/new

### Langkah 3: Copy & Paste SQL Schema
1. Buka file **`supabase-schema.sql`** di project Anda
2. **Copy SEMUA isi file** (dari baris 1 sampai akhir)
3. **Paste** ke SQL Editor di Supabase
4. Klik tombol **"Run"** (atau tekan `Ctrl+Enter` / `Cmd+Enter`)

### Langkah 4: Verifikasi
1. Setelah berhasil, cek di menu **"Table Editor"** (sidebar kiri)
2. Pastikan ada tabel:
   - ✅ `partnerships`
   - ✅ `messages`
   - ✅ `user_progress` (seharusnya sudah ada)

### Langkah 5: Refresh Browser
1. Refresh halaman aplikasi Anda (`Ctrl+Shift+R` atau `Cmd+Shift+R`)
2. Error seharusnya sudah hilang!

---

## 📋 SQL Schema yang Perlu Dijalankan

File yang perlu dijalankan: **`supabase-schema.sql`**

Isinya termasuk:
- Tabel `partnerships` (untuk relasi partner)
- Tabel `messages` (untuk pesan motivasi)
- RLS Policies (untuk keamanan)
- Indexes (untuk performa)
- Functions (untuk get partner progress)

**✅ Schema sudah diupdate untuk aman dijalankan ulang!**
- Menggunakan `DROP POLICY IF EXISTS` sebelum membuat policy baru
- Menggunakan `DROP TRIGGER IF EXISTS` sebelum membuat trigger baru
- Menggunakan `CREATE TABLE IF NOT EXISTS` untuk tabel
- Menggunakan `CREATE OR REPLACE FUNCTION` untuk function

---

## ⚠️ Jika Ada Error Saat Menjalankan SQL:

### Error: "relation already exists"
- **Ini NORMAL!** Schema menggunakan `CREATE TABLE IF NOT EXISTS`
- Lanjutkan saja, tidak masalah

### Error: "function already exists"
- **Ini juga NORMAL!** Schema menggunakan `CREATE OR REPLACE FUNCTION`
- Lanjutkan saja

### Error: "policy already exists"
- **SUDAH DIPERBAIKI!** Schema sekarang menggunakan `DROP POLICY IF EXISTS` sebelum membuat policy
- Silakan jalankan ulang SQL schema

### Error: "trigger already exists"
- **SUDAH DIPERBAIKI!** Schema sekarang menggunakan `DROP TRIGGER IF EXISTS` sebelum membuat trigger
- Silakan jalankan ulang SQL schema

---

## 🎯 Setelah Setup Berhasil:

1. ✅ Error 404 akan hilang
2. ✅ Fitur "Together" akan berfungsi
3. ✅ Bisa invite partner
4. ✅ Bisa kirim pesan motivasi
5. ✅ Bisa lihat progress partner

---

## 💡 Tips:

- **Jangan lupa refresh browser** setelah setup!
- Jika masih error, cek di Supabase Dashboard → Table Editor → pastikan tabel `partnerships` ada
- Jika tabel sudah ada tapi masih error, coba **clear cache browser** atau **restart dev server**
- **Schema sekarang aman untuk dijalankan ulang** - tidak akan error meskipun sudah pernah dijalankan sebelumnya

---

**Silakan jalankan SQL schema sekarang, lalu refresh browser!** 🚀
