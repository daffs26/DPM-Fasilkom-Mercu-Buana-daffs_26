# 🏛️ Panduan Arsitektur Komponen & Pelokasian File AUDITMAWA

Dokumentasi ini menjelaskan struktur direktori komponen per fitur, aturan penamaan file yang ringkas, serta pembeda tegas antara fitur **User Ormawa (DPM, BEM, HIMSI, HIMTI)** dan **Tamu Publik** di platform **AUDITMAWA DPM FASILKOM UMB**.

---

## 📁 Struktur Direktori Terpadu (Konsolidasi Hibrida)

Setiap folder fitur mengonsolidasikan sub-komponen tampilan langsung ke dalam file halaman utamanya (`*View.jsx`), sedangkan modal independen diletakkan langsung di dalam folder fitur tanpa folder `components/` bersarang yang redundan.

```
src/components/
├── proker/                          # [FITUR: PROGRAM KERJA]
│   ├── ProkerView.jsx               # Halaman utama pemantauan proker & kartu statistik
│   ├── DetailProkerModal.jsx        # Modal rincian proker (termasuk preview kuitansi)
│   ├── TambahProkerModal.jsx        # (Khusus Eksekutif) Form pengajuan proker baru
│   ├── UploadRevisiModal.jsx        # (Khusus Eksekutif) Unggah revisi berkas proposal
│   ├── ReviewProposalModal.jsx      # (Khusus DPM) Review & persetujuan proposal
│   ├── ProkerHapusModal.jsx         # Konsolidasi: Pengajuan & Verifikasi DPM hapus proker
│   └── detail-tabs/                 # Tab Ringkasan, RAB, Rundown, Panitia, LPJ, Dokumentasi
│
├── anggaran/                        # [FITUR: ANGGARAN & KAS]
│   ├── AnggaranView.jsx             # Halaman serapan, KPI, matriks belanja & tabel transaksi
│   ├── AturPaguModal.jsx            # (Khusus DPM) Pengaturan pagu anggaran tahunan
│   └── TambahTransaksiModal.jsx     # (Khusus Bendahara) Input realisasi belanja kas
│
├── audit/                           # [FITUR: AUDIT & PENILAIAN LPJ]
│   ├── AuditView.jsx                # Halaman rapor akreditasi, parameter mutu & tabel audit
│   └── AuditLpjModal.jsx            # (Khusus DPM) Form skoring & penilaian LPJ
│
├── berkas/                          # [FITUR: TRANSPARANSI BERKAS]
│   ├── BerkasView.jsx               # Halaman arsip transparansi dokumen publik
│   └── UploadBerkasModal.jsx        # (Khusus Ormawa) Unggah dokumen pengawasan
│
├── sp/                              # [FITUR: SURAT PERINGATAN (Eksklusif Ormawa)]
│   ├── SuratPeringatanView.jsx      # Halaman riwayat & penanganan SP
│   └── SuratPeringatanModals.jsx    # Konsolidasi modal SP: Terbitkan, Review, Klarifikasi
│
├── template/                        # [FITUR: TEMPLATE DOKUMEN (Eksklusif Ormawa)]
│   ├── TemplateDokumenView.jsx      # Katalog master dokumen resmi fakultas
│   ├── UploadTemplateModal.jsx      # (Khusus Ormawa) Unggah master template baru
│   └── PreviewTemplateModal.jsx     # Pratinjau isi dokumen template
│
├── dashboard/                       # [FITUR: DASHBOARD EKSEKUTIF]
│   └── DashboardView.jsx            # Halaman ikhtisar pengawasan, KPI, skor & ringkasan anggaran
│
├── kalender/                        # [FITUR: KALENDER KEGIATAN]
│   └── KalenderView.jsx             # Halaman kalender proker & hari libur nasional resmi SKB
│
├── history/                         # [FITUR: LOG AKTIVITAS]
│   └── HistoryView.jsx              # Riwayat aksi penambahan & penghapusan proker
│
├── layout/                          # [KOMPONEN NAVIGASI PLATFORM]
│   ├── Header.jsx                   # Header atas & filter ormawa terpadu
│   ├── Sidebar.jsx                  # Sidebar menu navigasi role-based
│   └── ProfileModal.jsx             # Modal informasi profil & akun pengguna
│
├── print/                           # [CETAK LAPORAN RESMI]
│   ├── PrintDocModal.jsx            # Modal generator print preview
│   └── PrintTemplates.jsx           # Konsolidasi: CetakBeritaAcara, RekapAnggaran, Rundown, SP
│
├── auth/                            # [AUTENTIKASI & AKSES MASUK]
│   ├── LoginView.jsx                # Form login Ormawa & 1-klik Tamu Publik
│   └── RegisterView.jsx             # Form pendaftaran akun pengurus baru
│
├── tamu/                            # 🛡️ [KHUSUS TAMU PUBLIK & TRANSPARANSI]
│   └── TamuComponents.jsx           # Konsolidasi: TamuGuard, TamuGuideCard, TamuPrivacyNotice
│
└── ui/                              # [DESIGN SYSTEM PRIMITIVES]
    └── skeleton.jsx (dengan page skeletons), button, dialog, card, badge, input, table, dll.
```

---

## 🛡️ Matriks Hak Akses (RBAC Matrix)

| Fitur / Modul | Tamu (Publik) | BEM / HiMTI / HIMSISFO | DPM FASILKOM | Lokasi File |
| :--- | :---: | :---: | :---: | :--- |
| **Dashboard** | ✅ Hanya Baca | ✅ Interaktif | ✅ Interaktif | `src/components/dashboard/DashboardView.jsx` |
| **Daftar Proker** | ✅ Hanya Baca | ✅ Kelola Ormawa | ✅ Evaluasi / Pantau | `src/components/proker/ProkerView.jsx` |
| **Tambah Proker** | ❌ Dilarang | ✅ Pengajuan | ❌ (Hanya Evaluasi) | `src/components/proker/TambahProkerModal.jsx` |
| **Review & ACC Proposal** | ❌ Dilarang | ❌ | ✅ Hak Penuh | `src/components/proker/ReviewProposalModal.jsx` |
| **Revisi Proposal** | ❌ Dilarang | ✅ Unggah Revisi | ❌ | `src/components/proker/UploadRevisiModal.jsx` |
| **Hapus / Batal Proker** | ❌ Dilarang | ⚠️ Ajukan Izin | ✅ Persetujuan DPM | `src/components/proker/AjukanHapusProkerModal.jsx` & `KelolaHapusProkerModal.jsx` |
| **Transparansi Anggaran** | ✅ Hanya Baca | ✅ Bendahara Ormawa | ✅ Hak Penuh | `src/components/anggaran/AnggaranView.jsx` |
| **Atur Pagu Anggaran** | ❌ Dilarang | ❌ | ✅ Hak Penuh DPM | `src/components/anggaran/AturPaguModal.jsx` |
| **Catat Transaksi Belanja**| ❌ Dilarang | ✅ Bendahara Ormawa | ❌ (Hanya Audit) | `src/components/anggaran/TambahTransaksiModal.jsx` |
| **Audit & Skor LPJ** | ✅ Hanya Baca | ❌ | ✅ Penilai Resmi | `src/components/audit/AuditLpjModal.jsx` |
| **Transparansi Berkas** | ✅ Hanya Baca | ✅ Arsip Ormawa | ✅ Hak Penuh | `src/components/berkas/BerkasView.jsx` |
| **Upload Berkas Baru** | ❌ Dilarang | ✅ Unggah Berkas | ✅ Unggah Berkas | `src/components/berkas/UploadBerkasModal.jsx` |
| **Template Dokumen** | ❌ Ditutup | ✅ Unduh Format | ✅ Kelola Master | `src/components/template/TemplateDokumenView.jsx` |
| **Surat Peringatan (SP)** | ❌ Ditutup | ⚠️ Respon Klarifikasi | ✅ Terbitkan & Evaluasi | `src/components/sp/SuratPeringatanView.jsx` |
| **Kalender Kegiatan** | ✅ Hanya Baca | ✅ Jadwal Ormawa | ✅ Pantau Jadwal | `src/components/kalender/KalenderView.jsx` |
| **Cetak Dokumen Resmi** | ❌ | ✅ Cetak Bukti/Rundown | ✅ Berita Acara & SP | `src/components/print/PrintDocModal.jsx` |
| **Panduan & Guard Tamu** | ✅ Aktif | ❌ | ❌ | `src/components/tamu/` |
