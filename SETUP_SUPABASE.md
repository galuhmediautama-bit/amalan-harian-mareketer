# 🚀 Setup Supabase untuk Marketer Berkah

## Langkah-langkah Setup

### 1. Buat Database Table

1. Buka Supabase Dashboard: https://supabase.com/dashboard/project/ojmicttywrqeflqjmqfm
2. Klik **"SQL Editor"** di sidebar
3. Klik **"New query"**
4. Copy dan paste isi file `supabase-schema.sql`
5. Klik **"Run"** (atau Ctrl+Enter)
6. Pastikan tidak ada error

### 2. Enable Authentication

1. Di Supabase Dashboard, klik **"Authentication"** di sidebar
2. Klik **"Providers"**
3. Pastikan **"Email"** sudah enabled
4. **PENTING: Disable Email Confirmation** (untuk development/testing):
   - Klik **"Authentication"** → **"Settings"** (atau **"Email Templates"**)
   - Scroll ke **"Email Auth"** section
   - **Uncheck** atau **disable** "Enable email confirmations"
   - Ini memungkinkan user langsung login setelah sign up tanpa perlu konfirmasi email
   - **Catatan:** Untuk production, sebaiknya enable email confirmation untuk keamanan

### 3. Setup Row Level Security (RLS)

RLS sudah di-setup otomatis dari SQL schema, tapi pastikan:

1. Buka **"Table Editor"** → **"user_progress"**
2. Klik **"Policies"** tab
3. Pastikan ada 4 policies:
   - Users can view own progress
   - Users can insert own progress
   - Users can update own progress
   - Users can delete own progress

### 4. Test Aplikasi

1. Build aplikasi: `npm run build`
2. Test di local: `npm run dev`
3. Coba daftar dan login
4. Data akan tersimpan di Supabase

---

## Struktur Database

### Table: `user_progress`

| Column | Type | Description |
|--------|------|-------------|
| `id` | BIGSERIAL | Primary key |
| `user_id` | UUID | Foreign key ke auth.users |
| `current_date_value` | TEXT | Tanggal terakhir diakses |
| `progress` | JSONB | Data progress harian |
| `updated_at` | TIMESTAMPTZ | Timestamp update |
| `created_at` | TIMESTAMPTZ | Timestamp create |

### Format `progress` JSONB:
```json
{
  "2024-12-27": {
    "date": "2024-12-27",
    "completedHabitIds": ["habit1", "habit2"],
    "muhasabah": {
      "jujur": true,
      "followUp": true,
      "hakOrang": true,
      "dosaDigital": false
    }
  }
}
```

---

## Keuntungan Supabase

✅ **Real-time** - Data update otomatis  
✅ **Secure** - Row Level Security (RLS)  
✅ **Scalable** - PostgreSQL yang powerful  
✅ **Free Tier** - 500MB database, 2GB bandwidth  
✅ **Authentication** - Built-in auth system  

---

## Troubleshooting

### Error: "relation user_progress does not exist"
**Solusi:** Pastikan sudah run SQL schema di SQL Editor

### Error: "permission denied"
**Solusi:** Pastikan RLS policies sudah dibuat dan user sudah login

### Error: "new row violates row-level security policy"
**Solusi:** Pastikan user sudah authenticated dan policies sudah benar

### Loading terus setelah sign up/login
**Solusi:** 
1. Pastikan email confirmation sudah di-disable (lihat langkah 2 di atas)
2. Cek browser console untuk error messages
3. Pastikan Supabase URL dan API key sudah benar
4. Refresh halaman dan coba lagi

### Error: "Sign up successful but user confirmation may be required"
**Solusi:** Disable email confirmation di Authentication Settings (lihat langkah 2 di atas)

---

**Setelah setup selesai, aplikasi akan menggunakan Supabase untuk database! 🎉**

