# IOTWatch - Monitoring Suhu Realtime (Modul 6 PPB)

**Kelompok 04 - Praktikum Pemrograman Perangkat Bergerak**

Aplikasi *mobile* berbasis React Native (Expo) untuk memantau suhu sensor secara *real-time* menggunakan protokol MQTT, dilengkapi dengan fitur kontrol batas ambang (threshold) dan manajemen pengguna.

## 📱 Fitur Utama

Sesuai dengan ketentuan tugas Modul 6, aplikasi ini memiliki fitur-fitur berikut:

  * **Sistem Login & Autentikasi**:
      * Login menggunakan Email/Password via **Supabase Auth**.
      * **Guest Mode**: Akses terbatas tanpa login (hanya bisa melihat monitoring).
      * Proteksi Route (API & Halaman): Pengguna tamu tidak dapat mengakses halaman Control/Profile.
  * **Real-time Monitoring**:
      * Menampilkan data suhu langsung dari broker MQTT (`broker.emqx.io`).
      * Indikator status koneksi MQTT.
  * **Riwayat & Pagination**:
      * Menampilkan riwayat peringatan suhu dalam tabel.
      * Fitur **Pagination** (Berikutnya/Sebelumnya) untuk navigasi data yang efisien.
  * **Kontrol Ambang Batas (Control)**:
      * Mengatur nilai *threshold* suhu pemicu peringatan.
      * Hanya dapat diakses oleh pengguna yang login.
  * **Profil Pengguna**:
      * Menampilkan informasi akun dan tombol Logout.
  * **UX/UI Modern**:
      * **Custom Splash Screen** saat aplikasi dibuka.
      * **Gesture Navigation**: Perpindahan antar tab dengan *swipe* (menggeser layar).

## 🛠️ Teknologi yang Digunakan

  * **Frontend**: React Native, Expo, React Navigation.
  * **Backend**: Node.js, Express.js.
  * **Database & Auth**: Supabase (PostgreSQL).
  * **IoT Protocol**: MQTT (Library `mqtt.js`).
  * **Komunikasi**: REST API (Backend) & WebSocket (MQTT).

## 📂 Struktur Direktori

```
├── app/                 # Source code aplikasi mobile (Expo)
│   ├── src/
│   │   ├── context/     # Auth Context
│   │   ├── screens/     # Halaman (Monitoring, Control, Profile, Login)
│   │   ├── services/    # API & Supabase services
│   │   └── hooks/       # Custom hooks (useMqttSensor)
├── backend/             # REST API Server
│   ├── src/
│   │   ├── controllers/ # Logika bisnis
│   │   ├── models/      # Akses database Supabase
│   │   └── routes/      # Definisi endpoint API
├── sensor-simulator/    # Script simulasi sensor MQTT
└── firewall/            # Script utilitas firewall (Windows)
```

## 🚀 Cara Menjalankan Proyek

### 1\. Persiapan Environment (Supabase)

Pastikan Anda memiliki proyek Supabase dan jalankan query SQL berikut di *SQL Editor* Supabase Anda (file: `supabase/schema.sql`):

```sql
create table if not exists public.sensor_readings (...);
create table if not exists public.threshold_settings (...);
```

### 2\. Menjalankan Backend

Masuk ke folder backend, install dependensi, dan jalankan server. Pastikan file `.env` sudah dikonfigurasi.

```bash
cd backend
npm install
# Buat file .env berisi: SUPABASE_URL, SUPABASE_SERVICE_ROLE_KEY, PORT=5050
npm run dev
```

*Server akan berjalan di port 5050.*

### 3\. Menjalankan Sensor Simulator

Simulator ini akan mengirim data suhu palsu ke MQTT broker.

```bash
cd sensor-simulator
npm install
# Sesuaikan BACKEND_BASE_URL di index.js jika perlu
npm start
```

*Simulator mempublish topik: `ppb/kel04/iot/temperature`.*

### 4\. Menjalankan Aplikasi Mobile (App)

Konfigurasi IP Backend di `app/app.json` pada bagian `extra.backendUrl` (Ganti IP sesuai IP laptop/jaringan lokal Anda).

```bash
cd app
npm install
# Buat file .env berisi: EXPO_PUBLIC_SUPABASE_URL, EXPO_PUBLIC_SUPABASE_ANON_KEY
npx expo start
```

Scan QR code menggunakan aplikasi **Expo Go** di Android/iOS.

-----

*Dibuat untuk memenuhi Tugas Akhir Praktikum Modul 6 PPB 2024/2025.*
