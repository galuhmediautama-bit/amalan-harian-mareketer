# 🔐 Konfigurasi Environment Variables

## 📝 Nilai yang Digunakan

### Supabase Configuration

```env
VITE_SUPABASE_URL=https://ojmicttywrqeflqjmqfm.supabase.co
VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbWljdHR5d3JxZWZscWptcWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDU1OTksImV4cCI6MjA4MjQyMTU5OX0.kLAlHqaPub0fixy3cAs8hNj5NAtT9BU44Hs_FUW8Rw4
```

## 🚀 Setup

### Local Development
1. Buat file `.env.local` di root project
2. Copy nilai di atas ke `.env.local`
3. Restart dev server: `npm run dev`

### Vercel Production
1. Buka Vercel Dashboard → Settings → Environment Variables
2. Tambahkan kedua variabel di atas
3. Redeploy project

## 📌 Catatan
- File `.env.local` sudah di-ignore oleh `.gitignore` (tidak akan ter-commit)
- Nilai di atas adalah untuk production dan boleh di-commit ke GitHub (anon key aman untuk public)

