# Setup Fitur Evaluasi Bersama (Together Feature)

## Database Setup

### 1. Jalankan SQL Schema

Buka Supabase Dashboard → SQL Editor dan jalankan semua query dari `supabase-schema.sql`. File ini sudah termasuk:

- Table `partnerships` untuk menyimpan hubungan partner
- Table `messages` untuk menyimpan pesan motivasi
- RLS (Row Level Security) policies untuk keamanan
- Function `get_partner_progress` untuk akses data partner
- Triggers untuk auto-update timestamps

### 2. Verifikasi Tables

Pastikan tables berikut sudah dibuat:
- ✅ `partnerships`
- ✅ `messages`

### 3. Verifikasi RLS Policies

Pastikan RLS sudah diaktifkan dan policies sudah dibuat untuk:
- ✅ `partnerships` (view, insert, update)
- ✅ `messages` (view, insert, update)
- ✅ `user_progress` (policy baru untuk partner access)

## Cara Menggunakan

### Invite Partner

1. Buka tab **"Bersama"** di aplikasi
2. Klik tombol **"+ Invite Partner"**
3. Masukkan **User ID** partner (UUID)
   - Untuk mendapatkan User ID: Buka browser console setelah login, ketik `(await supabase.auth.getUser()).data.user.id`
4. Klik **"Kirim Undangan"**

### Terima Undangan

1. Jika ada undangan masuk, akan muncul di section **"Partner Saya"**
2. Klik **"Terima"** untuk menerima undangan
3. Setelah diterima, partnership aktif dan bisa saling melihat progress

### Saling Melihat Progress

- Progress hari ini akan ditampilkan di section **"Perbandingan Progress"**
- Progress minggu ini (rata-rata) juga akan ditampilkan
- Data update secara real-time

### Mengirim Pesan Motivasi

1. Scroll ke section **"Pesan & Motivasi"**
2. Ketik pesan di input field
3. Klik **"Kirim"** atau tekan **Enter**
4. Pesan akan muncul secara real-time

## Testing

### Test dengan 2 User

1. **User 1**: Login dan dapatkan User ID
2. **User 2**: Login dan dapatkan User ID
3. **User 1**: Invite User 2 dengan User ID User 2
4. **User 2**: Terima undangan dari User 1
5. **Kedua user**: Sekarang bisa saling melihat progress dan mengirim pesan

### Verifikasi Real-time

1. User 1 update progress (check habit)
2. User 2 refresh atau tunggu beberapa detik
3. Progress User 1 akan muncul di comparison view User 2

## Troubleshooting

### Error: "Partnership not found or not accepted"
- Pastikan partnership sudah diterima (status = 'accepted')
- Pastikan User ID yang digunakan benar

### Error: "Cannot view partner progress"
- Pastikan RLS policy sudah dibuat di Supabase
- Jalankan query di `supabase-schema.sql` untuk membuat policy

### Pesan tidak muncul
- Pastikan partnership sudah accepted
- Check console untuk error messages
- Pastikan real-time subscription aktif

## Next Steps (Optional)

1. **Email Invitation**: Ganti invite by User ID dengan email
2. **Profile Pictures**: Tambahkan avatar untuk partner
3. **Notifications**: Notifikasi saat ada undangan atau pesan baru
4. **Streak Comparison**: Tampilkan streak comparison
5. **Leaderboard**: Ranking berdasarkan total points

