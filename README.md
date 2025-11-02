# 🎬 Movie Explorer — Movie Database Explorer

Sebuah antarmuka pencarian dan eksplorasi film ringan yang memanfaatkan OMDb API untuk menampilkan poster, informasi film, dan rekomendasi. Dirancang agar cepat, responsif, dan mudah dikembangkan.

**Status:** Development / Demo ready

---

## ✨ Ringkasan Singkat

- **Nama Aplikasi** : Movie Explorer
- **Teknologi**     : React (Vite), HTML, CSS
- **Data Provider** : OMDb API (https://www.omdbapi.com)

---

## Fitur Utama

- Pencarian film berdasarkan judul
- Tampilan kartu film dengan poster, judul, dan tahun rilis
- Loading state & handling error sederhana
- Modal detail film (preview lebih lengkap)
- Responsive layout (desktop & mobile)

---

## Demo Lokal

1. Pastikan Node.js & npm terpasang.
2. Instal dependensi dan jalankan dev server:

```powershell
npm install
npm run dev
```

3. Buka browser ke alamat yang ditampilkan (contoh: http://localhost:5173)

---

## Deploy / Live (Vercel)

Anda bisa mendeploy aplikasi ini ke Vercel secara cepat. Contoh link deploy (ganti dengan link live Anda):

https://movie-explorer-yourname.vercel.app

Jika Anda sudah memiliki deployment, silakan ganti URL di atas dengan link live proyek Anda.

---

## Screenshot

Masukkan screenshot aplikasi Anda ke file `screenshot.png` di root proyek atau folder `public/`.

Contoh penempatan gambar di README (gunakan relative path):

![Movie Explorer Preview](./screenshot.png)

> Jika ingin, saya bisa menambahkan screenshot ke repo jika Anda upload gambar ke path yang diinginkan.

---

## Identitas

- **Nama:** Nadia Anatashiva
- **NIM:** 123140060
- **Keperluan:** UTS Pemrograman Web

---

## Struktur Singkat Proyek

- `src/` — kode React (komponen, gaya)
- `public/` — aset statis (poster placeholder, favicon, screenshot)
- `package.json` — skrip dan dependensi

---

## Variabel Lingkungan (Opsional)

Jika menggunakan API key OMDb secara lokal, tambahkan file `.env` dengan:

```
VITE_OMDB_API_KEY=your_api_key_here
```

---

## Tips Deploy & Improvement

- Untuk tampilan profesional, tambahkan badge Vercel pada README setelah deployment.
- Pertimbangkan menambahkan screenshot mobile dan desktop (2 gambar) agar reviewer melihat responsivitas.
