# Setup Partnerships Table di Supabase

## Masalah
Error: `Could not find the table 'public.partnerships' in the schema cache`

## Solusi
Jalankan SQL schema untuk membuat tabel `partnerships` dan `messages` di Supabase.

## Langkah-langkah:

1. **Buka Supabase Dashboard**
   - Login ke https://supabase.com/dashboard
   - Pilih project Anda

2. **Buka SQL Editor**
   - Klik menu "SQL Editor" di sidebar kiri
   - Atau buka: https://supabase.com/dashboard/project/[PROJECT_ID]/sql/new

3. **Jalankan SQL Schema**
   - Copy semua isi dari file `supabase-schema.sql`
   - Paste ke SQL Editor
   - Klik tombol "Run" atau tekan `Ctrl+Enter` (Windows) / `Cmd+Enter` (Mac)

4. **Verifikasi**
   - Setelah berhasil, cek di menu "Table Editor"
   - Pastikan ada tabel:
     - `partnerships`
     - `messages`

## Catatan Penting:
- Pastikan tabel `user_progress` sudah ada sebelumnya (dari setup awal)
- Jika ada error tentang tabel yang sudah ada, itu normal - schema menggunakan `CREATE TABLE IF NOT EXISTS`
- Pastikan semua policy RLS (Row Level Security) terbuat dengan benar

## Jika Masih Ada Error:
1. Cek apakah semua tabel terbuat dengan benar
2. Pastikan RLS policies sudah aktif
3. Refresh browser dan coba lagi

