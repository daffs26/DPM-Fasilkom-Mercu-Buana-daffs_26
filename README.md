## Dashboard DPM FASILKOM UNIVERSITAS MERCU BUANA

**Sistem Informasi Pengawasan, Akuntabilitas, dan Transparansi Ormawa**  
Dewan Perwakilan Mahasiswa Fakultas Ilmu Komputer (DPM FASILKOM) — Universitas Mercu Buana.

SIWASMA adalah platform web modern berbasis React dan Vite yang dirancang untuk mendigitalkan proses pengawasan legislatif mahasiswa, pengelolaan berkas, audit proposal & LPJ, transparansi alokasi anggaran, serta pencatatan jejak riwayat program kerja 4 Organisasi Mahasiswa Fasilkom UMB:
1. **DPM FASILKOM UMB** (Dewan Perwakilan Mahasiswa)
2. **BEM FASILKOM UMB** (Badan Eksekutif Mahasiswa)
3. **HiMTI - UMB** (Himpunan Mahasiswa Teknik Informatika)
4. **HIMSISFO** (Himpunan Mahasiswa Sistem Informasi)

---

## 🚀 Fitur Utama

- **Dashboard:** Ringkasan KPI Fakultas, SLA penyerahan berkas, pemantauan status proposal & LPJ, serta live activity feed audit.
- **Monitoring Program Kerja:** Katalog program kerja dengan pelacakan timeline H-14 / H+14, detail proker, unduh/cetak berita acara, dan fitur penghapusan proker dengan konfirmasi alert.
- **Histori Proker:** Halaman audit jejak digital pencatatan riwayat penambahan dan penghapusan proker secara transparan dengan filter status dan pencarian terintegrasi.
- **Pengelolaan & Alokasi Anggaran:** Visualisasi realisasi serapan anggaran, batas alokasi pagu tiap ormawa, pencatatan transaksi kas/termin, dan filter entitas ormawa.
- **Transparansi Berkas:** Manajemen dokumen terpusat (Proposal, LPJ, Surat Perizinan, dan Berkas Lainnya) dengan pratinjau dokumen dan pengunggahan berkas baru.
- **Template Dokumen DPM:** Koleksi template resmi legislatif (Proposal, LPJ, SP, RAB, Surat Undangan/Izin) yang siap disalin teksnya atau diunduh.
- **Audit & Penilaian Skor Ormawa:** Instrumen evaluasi kinerja berbasis 5 parameter audit DPM dengan kalkulasi skor otomatis.
- **Kalender Kegiatan Terpadu:** Visualisasi kalender akademik interaktif dengan integrasi hari libur nasional Indonesia dan penanda jadwal proker ormawa.
- **Surat Peringatan (SP):** Penerbitan Surat Peringatan (SP-1, SP-2, SP-3) resmi legislatif untuk ormawa yang melanggar ketentuan deadline LPJ.

---

## 🛠️ Teknologi yang Digunakan

- **Frontend Core:** [React 19](https://react.dev/), [Vite](https://vitejs.dev/)
- **Styling:** [Tailwind CSS](https://tailwindcss.com/), Vanilla CSS utilities
- **Komponen UI & Animasi:** [Radix UI](https://www.radix-ui.com/), [Lucide React Icons](https://lucide.dev/), Canvas Confetti
- **State Management:** [Zustand](https://github.com/pmndrs/zustand) dengan persistence middleware
- **Build Tool:** Vite Bundler & Oxlint

---

## 💻 Panduan Menjalankan Aplikasi

### 1. Prasyarat
Pastikan telah menginstal [Node.js](https://nodejs.org/) (versi 18 ke atas) dan `npm`.

### 2. Instalasi Dependensi
```bash
npm install
```

### 3. Menjalankan Server Pengembangan Lokal
```bash
npm run dev
```
Akses aplikasi melalui peramban web di `http://localhost:5173`.

### 4. Membangun untuk Produksi (Build)
```bash
npm run build
```
Hasil kompilasi produksi siap di-deploy dan tersimpan di folder `dist/`.

---

## 👥 Hak Cipta & Pengembang

Dikembangkan untuk **DPM FASILKOM Universitas Mercu Buana**.  
Koordinator / Pengembang: **Muhammad Daffa Aulia Syahrul** (DPM FASILKOM UMB).
