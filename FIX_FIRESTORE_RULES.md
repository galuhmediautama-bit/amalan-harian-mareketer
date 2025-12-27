# 🔧 FIX: Firestore Security Rules - Missing Permissions

## Masalah
Error: `Missing or insufficient permissions` saat mengakses Firestore.

## Solusi: Update Firestore Security Rules

### Langkah 1: Buka Firestore Rules
1. Buka: **https://console.firebase.google.com/project/aplikasi-amalan-harian/firestore/rules**
2. Atau:
   - Buka Firebase Console
   - Pilih project: **aplikasi-amalan-harian**
   - Klik **Firestore Database** di sidebar
   - Klik tab **Rules** (di bagian atas)

### Langkah 2: Update Rules
Ganti seluruh isi rules dengan kode berikut:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Collection untuk marketer_berkah
    match /marketer_berkah/{userId} {
      // Hanya user yang sudah login yang bisa akses
      // Dan hanya bisa akses data miliknya sendiri
      allow read, write: if request.auth != null && request.auth.uid == userId;
    }
  }
}
```

### Langkah 3: Publish Rules
1. Setelah paste rules di atas
2. Klik tombol **"Publish"** (di kanan atas)
3. Tunggu sampai muncul notifikasi "Rules published successfully"

### Langkah 4: Verifikasi
1. Refresh aplikasi di browser
2. Login dengan akun yang sudah dibuat
3. Error "Missing or insufficient permissions" seharusnya sudah hilang

---

## Penjelasan Rules

Rules di atas berarti:
- ✅ User yang sudah login (`request.auth != null`) bisa akses
- ✅ User hanya bisa akses data miliknya sendiri (`request.auth.uid == userId`)
- ✅ User bisa read (baca) dan write (tulis) data miliknya

---

## Troubleshooting

### Masih Error Setelah Update Rules?
1. Pastikan sudah klik **"Publish"** (bukan hanya save)
2. Tunggu 10-30 detik untuk propagasi rules
3. Hard refresh browser (Ctrl+F5)
4. Logout dan login lagi di aplikasi

### Rules Tidak Bisa Di-Publish?
- Pastikan format JSON valid (tidak ada typo)
- Pastikan menggunakan `rules_version = '2';`
- Pastikan semua kurung kurawal `{}` sudah ditutup

---

**Setelah rules di-publish, aplikasi akan bisa mengakses Firestore dengan benar! ✅**

