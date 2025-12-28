# 📱 Cara Build APK untuk Android

## 📋 Prerequisites

1. **Java Development Kit (JDK) 17 atau lebih baru**
   - Download: https://adoptium.net/
   - Install dan set `JAVA_HOME` environment variable

2. **Android Studio**
   - Download: https://developer.android.com/studio
   - Install Android SDK (API Level 33+)
   - Set `ANDROID_HOME` environment variable

3. **Gradle** (biasanya sudah included dengan Android Studio)

## 🚀 Langkah Build APK

### 1. Build Web App
```bash
npm run build
```

### 2. Sync dengan Capacitor
```bash
npm run cap:sync
```
Atau gunakan script yang sudah disediakan:
```bash
npm run cap:build
```

### 3. Buka di Android Studio
```bash
npm run cap:android
```
Atau manual:
```bash
npx cap open android
```

### 4. Build APK di Android Studio

1. **Buka Android Studio** (akan terbuka otomatis setelah `cap:android`)

2. **Tunggu Gradle sync** selesai (biasanya beberapa menit pertama kali)

3. **Build APK:**
   - Klik menu **Build** → **Build Bundle(s) / APK(s)** → **Build APK(s)**
   - Atau: **Build** → **Generate Signed Bundle / APK** (untuk release)

4. **Lokasi APK:**
   - Debug APK: `android/app/build/outputs/apk/debug/app-debug.apk`
   - Release APK: `android/app/build/outputs/apk/release/app-release.apk` (setelah signing)

## 🔐 Build Release APK (Signed)

### 1. Generate Keystore
```bash
keytool -genkey -v -keystore amalan-berkah.keystore -alias amalan-berkah -keyalg RSA -keysize 2048 -validity 10000
```

### 2. Di Android Studio:
1. **Build** → **Generate Signed Bundle / APK**
2. Pilih **APK**
3. Pilih keystore file yang sudah dibuat
4. Isi password dan alias
5. Klik **Next** → **Finish**

### 3. APK Release akan ada di:
`android/app/build/outputs/apk/release/app-release.apk`

## 📝 Scripts yang Tersedia

| Script | Deskripsi |
|-------|-----------|
| `npm run cap:sync` | Build web app dan sync ke Android |
| `npm run cap:build` | Build + sync + copy (full process) |
| `npm run cap:android` | Buka project di Android Studio |

## ⚠️ Troubleshooting

### Error: JAVA_HOME not set
```bash
# Windows
set JAVA_HOME=C:\Program Files\Java\jdk-17

# Linux/Mac
export JAVA_HOME=/usr/lib/jvm/java-17-openjdk
```

### Error: ANDROID_HOME not set
```bash
# Windows
set ANDROID_HOME=C:\Users\YourName\AppData\Local\Android\Sdk

# Linux/Mac
export ANDROID_HOME=$HOME/Android/Sdk
```

### Gradle Build Failed
- Pastikan Android SDK sudah terinstall di Android Studio
- Pastikan internet connection aktif (untuk download dependencies)
- Coba **File** → **Invalidate Caches / Restart** di Android Studio

## 📦 File yang Di-ignore

Folder `android/` sudah ditambahkan ke `.gitignore` karena:
- File besar (Gradle cache, build artifacts)
- Berisi konfigurasi lokal
- Bisa di-generate ulang dengan `npx cap add android`

## 🎯 Quick Start

```bash
# 1. Build web app
npm run build

# 2. Sync ke Android
npm run cap:sync

# 3. Buka Android Studio
npm run cap:android

# 4. Di Android Studio: Build → Build APK(s)
```

## 📱 Install APK ke Device

1. **Enable Developer Options** di Android device:
   - Settings → About Phone → Tap "Build Number" 7x

2. **Enable USB Debugging:**
   - Settings → Developer Options → USB Debugging (ON)

3. **Connect device via USB** atau transfer APK file via:
   - Email
   - Google Drive
   - USB file transfer
   - ADB: `adb install app-debug.apk`

---

**Selamat! APK sudah siap untuk diinstall di Android device!** 🎉

