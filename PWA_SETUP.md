# 📱 Progressive Web App (PWA) Setup

Aplikasi ini sudah dikonfigurasi sebagai **Progressive Web App (PWA)** yang bisa diinstall seperti aplikasi native!

## ✨ Fitur PWA

1. **Installable** - Bisa diinstall ke home screen (mobile & desktop)
2. **Offline Support** - Bisa digunakan offline dengan Service Worker
3. **Fast Loading** - Cache resources untuk loading cepat
4. **App-like Experience** - Fullscreen, no browser UI

## 🚀 Cara Install

### Mobile (Android/iOS):

1. **Buka aplikasi di browser** (Chrome/Safari)
2. **Klik menu** (3 dots) → **"Add to Home Screen"** atau **"Install App"**
3. **Konfirmasi** install
4. **Icon akan muncul** di home screen
5. **Buka dari icon** → Aplikasi akan terbuka seperti app native!

### Desktop (Chrome/Edge):

1. **Buka aplikasi di browser**
2. **Klik icon install** di address bar (biasanya muncul otomatis)
3. Atau: **Menu** → **"Install Amalan Berkah"**
4. **Konfirmasi** install
5. **Aplikasi akan terbuka** di window terpisah (seperti desktop app)

## 📋 Requirements

### Icons (PENTING!)

Anda perlu membuat 2 icon file:

1. **`public/icon-192.png`** - 192x192 pixels
2. **`public/icon-512.png`** - 512x512 pixels

**Cara membuat icon:**
- Gunakan logo aplikasi
- Format: PNG dengan transparansi
- Ukuran: 192x192 dan 512x512 pixels
- Bisa menggunakan tools online: https://realfavicongenerator.net/

### Atau generate placeholder:

```bash
# Install ImageMagick atau gunakan online tool
# Buat icon sederhana dulu untuk testing
```

## 🔧 Konfigurasi

### Manifest (`public/manifest.json`):
- ✅ Nama aplikasi
- ✅ Theme color
- ✅ Display mode (standalone)
- ✅ Icons
- ✅ Shortcuts

### Service Worker (`public/sw.js`):
- ✅ Cache static files
- ✅ Offline support
- ✅ Background sync
- ✅ Push notifications (optional)

### Vite PWA Plugin:
- ✅ Auto-register service worker
- ✅ Auto-update
- ✅ Cache strategy untuk Supabase API

## 🧪 Test PWA

1. **Build aplikasi:**
   ```bash
   npm run build
   ```

2. **Preview production build:**
   ```bash
   npm run preview
   ```

3. **Test di browser:**
   - Buka DevTools → Application tab
   - Cek "Service Workers" → harus terdaftar
   - Cek "Manifest" → harus valid
   - Cek "Lighthouse" → run PWA audit

## 📱 Test Install

### Chrome DevTools:
1. **F12** → **Application** tab
2. **Manifest** → Cek semua field
3. **Service Workers** → Harus "activated and running"
4. **Lighthouse** → Run audit → PWA score harus > 90

### Mobile Test:
1. **Buka di mobile browser**
2. **Scroll ke bawah** → Harus muncul banner "Add to Home Screen"
3. **Atau** → Menu → "Add to Home Screen"
4. **Install** → Buka dari home screen

## ⚠️ Troubleshooting

### Service Worker tidak terdaftar:
- Pastikan build production (`npm run build`)
- Pastikan HTTPS (atau localhost)
- Clear cache browser

### Icon tidak muncul:
- Pastikan file `icon-192.png` dan `icon-512.png` ada di `public/`
- Pastikan path di manifest.json benar
- Reload hard (Ctrl+Shift+R)

### Install prompt tidak muncul:
- Pastikan semua requirements terpenuhi
- Cek di DevTools → Application → Manifest
- Pastikan service worker aktif

## 🎯 Next Steps

1. **Buat icon** (192x192 dan 512x512)
2. **Test install** di mobile & desktop
3. **Customize manifest** (nama, warna, dll)
4. **Test offline** functionality
5. **Deploy** ke production

---

**Aplikasi sekarang sudah siap sebagai PWA!** 🎉

