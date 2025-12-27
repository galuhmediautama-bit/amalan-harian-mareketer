<div align="center">
<img width="1200" height="475" alt="GHBanner" src="https://github.com/user-attachments/assets/0aa67016-6eaf-458a-adb2-6e31a0763ed6" />
</div>

# Marketer Berkah - Habit Tracker App

Aplikasi habit tracker untuk marketer dengan integrasi Firebase untuk penyimpanan data cloud dan real-time sync.

## Fitur

- ✅ Tracking amalan harian dengan sistem poin
- ✅ Real-time sync dengan Firebase Firestore
- ✅ Authentication untuk akses internal
- ✅ Grafik performa amalan
- ✅ Mode emergency untuk kondisi darurat
- ✅ Responsive design (mobile & desktop)

## Setup & Installation

### Prerequisites

- Node.js (v18 atau lebih baru)
- Akun Firebase (gratis)

### 1. Install Dependencies

```bash
npm install
```

### 2. Setup Firebase

1. **Buat Project Firebase:**
   - Buka [Firebase Console](https://console.firebase.google.com/)
   - Klik "Add project" atau pilih project yang sudah ada
   - Ikuti wizard setup

2. **Enable Authentication:**
   - Di Firebase Console, buka **Authentication** > **Sign-in method**
   - Enable **Email/Password** provider

3. **Setup Firestore Database:**
   - Buka **Firestore Database** di Firebase Console
   - Klik "Create database"
   - Pilih **Start in test mode** (untuk development)
   - Pilih lokasi database (pilih yang terdekat)

4. **Dapatkan Firebase Config:**
   - Di Firebase Console, buka **Project Settings** (ikon gear)
   - Scroll ke bawah ke bagian "Your apps"
   - Klik ikon **Web** (`</>`) untuk menambahkan web app
   - Beri nama app (misal: "Marketer Berkah")
   - Copy config yang muncul

5. **Setup Environment Variables:**
   - Copy file `.env.example` menjadi `.env.local`
   - Isi dengan Firebase config yang sudah didapat:
   ```env
   VITE_FIREBASE_API_KEY=your-api-key-here
   VITE_FIREBASE_AUTH_DOMAIN=your-project-id.firebaseapp.com
   VITE_FIREBASE_PROJECT_ID=your-project-id
   VITE_FIREBASE_STORAGE_BUCKET=your-project-id.appspot.com
   VITE_FIREBASE_MESSAGING_SENDER_ID=your-messaging-sender-id
   VITE_FIREBASE_APP_ID=your-app-id
   ```

### 3. Run Development Server

```bash
npm run dev
```

Aplikasi akan berjalan di `http://localhost:3000`

### 4. Login Pertama Kali

- Buka aplikasi di browser
- Klik "Daftar" untuk membuat akun baru (untuk internal use)
- Masukkan email dan password (minimal 6 karakter)
- Setelah login, data akan otomatis tersimpan ke Firebase

## Firebase Security Rules (Penting!)

Setelah setup, pastikan update Firestore Security Rules untuk keamanan:

1. Buka **Firestore Database** > **Rules** di Firebase Console
2. Update rules menjadi:

```javascript
rules_version = '2';
service cloud.firestore {
  match /databases/{database}/documents {
    // Hanya user yang sudah login yang bisa akses
    match /marketer_berkah/{document} {
      allow read, write: if request.auth != null;
    }
  }
}
```

3. Klik **Publish**

## Build for Production

```bash
npm run build
```

File hasil build ada di folder `dist/`

## Deploy ke Vercel

1. Push code ke GitHub
2. Import project ke [Vercel](https://vercel.com)
3. Tambahkan environment variables di Vercel dashboard
4. Deploy!

## Struktur Data Firebase

Data disimpan di Firestore dengan struktur:
```
marketer_berkah/
  └── user_data/
      ├── currentDate: string
      ├── progress: {
      │     "2024-01-01": {
      │       date: string
      │       completedHabitIds: string[]
      │       muhasabah: {
      │         jujur: boolean
      │         followUp: boolean
      │         hakOrang: boolean
      │         dosaDigital: boolean
      │       }
      │     }
      │   }
      └── updatedAt: timestamp
```

## Migration dari LocalStorage

Aplikasi akan otomatis migrasi data dari localStorage ke Firestore saat pertama kali login. Data lama tetap tersimpan di localStorage sebagai backup.

## Troubleshooting

**Error: "Firebase: Error (auth/configuration-not-found)"**
- Pastikan semua environment variables sudah diisi dengan benar
- Restart dev server setelah menambahkan `.env.local`

**Error: "Permission denied"**
- Pastikan Firestore Security Rules sudah diupdate
- Pastikan user sudah login

**Data tidak tersimpan**
- Check console browser untuk error
- Pastikan koneksi internet aktif
- Check Firebase Console > Firestore untuk melihat data

## Tech Stack

- React 19
- TypeScript
- Vite
- Firebase (Auth + Firestore)
- Tailwind CSS
- Recharts
- Lucide React Icons
