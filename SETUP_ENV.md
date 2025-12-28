# 🔐 Setup Environment Variables

## 📋 Local Development

1. **Copy template file:**
   ```bash
   cp .env.example .env.local
   ```

2. **Edit `.env.local`** dan isi dengan nilai yang benar:
   ```env
   VITE_SUPABASE_URL=https://ojmicttywrqeflqjmqfm.supabase.co
   VITE_SUPABASE_ANON_KEY=eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbWljdHR5d3JxZWZscWptcWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDU1OTksImV4cCI6MjA4MjQyMTU5OX0.kLAlHqaPub0fixy3cAs8hNj5NAtT9BU44Hs_FUW8Rw4
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

## ☁️ Vercel Deployment

1. **Buka Vercel Dashboard** → https://vercel.com/dashboard
2. **Pilih project** → **Settings** → **Environment Variables**
3. **Tambahkan:**
   - `VITE_SUPABASE_URL` = `https://ojmicttywrqeflqjmqfm.supabase.co`
   - `VITE_SUPABASE_ANON_KEY` = `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbWljdHR5d3JxZWZscWptcWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDU1OTksImV4cCI6MjA4MjQyMTU5OX0.kLAlHqaPub0fixy3cAs8hNj5NAtT9BU44Hs_FUW8Rw4`
4. **Redeploy** project

## 🔒 GitHub Secrets (untuk GitHub Actions)

Jika ingin menggunakan GitHub Actions untuk deploy:

1. **Buka GitHub Repository** → **Settings** → **Secrets and variables** → **Actions**
2. **Klik "New repository secret"**
3. **Tambahkan secrets:**
   - Name: `VITE_SUPABASE_URL`
     Value: `https://ojmicttywrqeflqjmqeflqjmqfm.supabase.co`
   - Name: `VITE_SUPABASE_ANON_KEY`
     Value: `eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6Im9qbWljdHR5d3JxZWZscWptcWZtIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NjY4NDU1OTksImV4cCI6MjA4MjQyMTU5OX0.kLAlHqaPub0fixy3cAs8hNj5NAtT9BU44Hs_FUW8Rw4`

## ⚠️ PENTING

- ✅ **`.env.example`** → Boleh di-commit (template saja)
- ❌ **`.env.local`** → JANGAN di-commit (sudah di `.gitignore`)
- 🔒 **GitHub Secrets** → Untuk GitHub Actions (jika digunakan)


