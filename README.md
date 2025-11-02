# 🎬 Movie Explorer: Advanced Search & Filtering App
**Status Pengembangan:** *Initial Setup & Component Structure Completed*

Aplikasi ini adalah implementasi *search and filtering* yang meniru fungsionalitas pencarian lanjutan pada platform streaming atau katalog film. Dibangun menggunakan React JS, proyek ini fokus pada pengelolaan *input* dan *state* kompleks.

---

## ✨ Fitur Utama (Berdasarkan Tampilan)

* **Pencarian Lanjutan (Advanced Filtering):** Memungkinkan pengguna mencari film berdasarkan beberapa kriteria sekaligus:
    * **Judul Film**
    * **Tahun Rilis**
    * **Tipe** (Movie, TV Show, dll.)
    * **Minimum Rating** (Menggunakan *range slider*)
* **Loading State:** Menampilkan indikator `Mencari film...` saat data sedang diproses.

---

## 🛠️ Detail Implementasi Teknis

Meskipun tampilan fokus pada *filtering*, struktur kode di balik layar harus mencakup konsep fundamental React berikut:

| Konsep React | Implementasi | Fungsi |
| :--- | :--- | :--- |
| **State Management** | `useState` | Mengelola nilai dari setiap input form (`judul`, `tahun`, `tipe`, `rating`). |
| **Complex State** | Objek State | Semua nilai filter dikelola dalam **satu objek state** tunggal (`searchParams`) untuk kemudahan reset. |
| **Event Handling** | `onChange` | Mengupdate state secara *real-time* saat *slider* atau *input* teks diubah. |
| **Conditional Rendering** | `loading` | Menampilkan "Mencari film..." hanya saat proses pencarian aktif. |
| **Component Composition** | `FilterForm` | Komponen untuk menampung seluruh logika form dan filtering. |

---

## 🚀 Instalasi dan Menjalankan Proyek

### 1. Kloning Repositori
```bash
git clone [https://github.com/](https://github.com/)[username_anda]/movie-explorer-repo.git
cd movie-explorer-repo