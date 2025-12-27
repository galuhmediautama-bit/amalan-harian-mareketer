# Cara Deploy ke Firebase Hosting

## Quick Deploy (Setelah Login Pertama Kali)

Setelah login pertama kali, cukup jalankan:

```bash
npm run deploy
```

Atau:

```bash
npm run build
firebase deploy --only hosting
```

## Login Pertama Kali (WAJIB)

Firebase login memerlukan autentikasi di browser. Jalankan di terminal:

```bash
firebase login
```

Browser akan terbuka, pilih akun Google yang sama dengan Firebase Console.

## URL Setelah Deploy

Setelah deploy berhasil, aplikasi akan tersedia di:
- `https://aplikasi-amalan-harian.web.app`
- `https://aplikasi-amalan-harian.firebaseapp.com`

## Troubleshooting

### Error: Failed to authenticate
- Pastikan sudah menjalankan `firebase login`
- Pastikan menggunakan akun Google yang sama dengan Firebase Console

### Error: Project not found
- Pastikan project ID di `.firebaserc` sesuai dengan project di Firebase Console
- Project ID saat ini: `aplikasi-amalan-harian`

### Build berhasil tapi deploy gagal
- Pastikan Firestore Database sudah dibuat di Firebase Console
- Pastikan Firebase Hosting sudah diaktifkan di Firebase Console

