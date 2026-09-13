# 🏛️ Panduan Arsitektur Komponen & Pelokasian File AUDITMAWA

Dokumentasi ini menjelaskan struktur direktori komponen per fitur, aturan penamaan file yang natural dan mudah dimengerti, serta pembeda tegas antara fitur **User Ormawa (DPM, BEM, HIMSI, HIMTI)** dan **Tamu Publik** di platform **AUDITMAWA DPM FASILKOM UMB**.

---

## 📁 Struktur Direktori Utama

```
src/components/
├── proker/                          # [FITUR: PROGRAM KERJA]
│   ├── ProkerView.jsx               # Halaman utama pemantauan proker
│   └── components/
│       ├── DetailProkerModal.jsx    # Modal rincian proker & multi-tab
│       ├── TambahProkerModal.jsx    # (Khusus Eksekutif) Form pengajuan proker baru
│       ├── AjukanHapusProkerModal.jsx # (Khusus Eksekutif) Pengajuan permohonan batal proker
│       ├── UploadRevisiModal.jsx    # (Khusus Eksekutif) Unggah revisi berkas proposal
│       ├── ReviewProposalModal.jsx  # (Khusus DPM) Review & persetujuan proposal
│       ├── KelolaHapusProkerModal.jsx # (Khusus DPM) ACC/Tolak permohonan hapus proker
│       └── detail-tabs/             # Tab Ringkasan, RAB, Rundown, Panitia, LPJ, PreviewKwitansi
│
├── anggaran/                        # [FITUR: ANGGARAN & KAS]
│   ├── AnggaranView.jsx             # Halaman transparansi serapan anggaran
│   └── components/
│       ├── AturPaguModal.jsx        # (Khusus DPM) Pengaturan pagu anggaran tahunan
│       ├── TambahTransaksiModal.jsx # (Khusus Bendahara) Input realisasi belanja kas
│       ├── KpiAnggaran.jsx          # Kartu ringkasan pagu & serapan
│       ├── GridOrmawa.jsx           # Kartu serapan per ormawa
│       ├── MatrixProker.jsx         # Matriks pembiayaan per proker
│       ├── TabelTransaksi.jsx       # Riwayat mutasi belanja
│       └── PreviewBuktiModal.jsx    # Pratinjau foto kuitansi/nota belanja
│
├── audit/                           # [FITUR: AUDIT & PENILAIAN LPJ]
│   ├── AuditView.jsx                # Halaman rapor & skor kepatuhan ormawa
│   └── components/
│       ├── AuditLpjModal.jsx        # (Khusus DPM) Form skoring & penilaian LPJ
│       ├── LaporanAudit.jsx         # Laporan akreditasi & kepatuhan ormawa
│       ├── StandarParameter.jsx     # Panduan parameter penilaian resmi DPM
│       └── TabelAuditProker.jsx     # Tabel daftar audit per kegiatan
│
├── berkas/                          # [FITUR: TRANSPARANSI BERKAS]
│   ├── BerkasView.jsx               # Halaman arsip transparansi dokumen publik
│   └── components/
│       └── UploadBerkasModal.jsx    # (Khusus Ormawa) Unggah dokumen pengawasan
│
├── sp/                              # [FITUR: SURAT PERINGATAN (Eksklusif Ormawa)]
│   ├── SuratPeringatanView.jsx      # Halaman riwayat & penanganan SP
│   └── components/
│       ├── TerbitkanSPModal.jsx     # (Khusus DPM) Penerbitan SP resmi (SP 1, 2, 3)
│       ├── ReviewKlarifikasiModal.jsx # (Khusus DPM) Tinjau klarifikasi SP dari ormawa
│       └── KlarifikasiSPModal.jsx   # (Khusus Eksekutif) Form tanggapan & klarifikasi SP
│
├── template/                        # [FITUR: TEMPLATE DOKUMEN (Eksklusif Ormawa)]
│   ├── TemplateDokumenView.jsx      # Katalog master dokumen resmi fakultas
│   └── components/
│       ├── UploadTemplateModal.jsx  # (Khusus Ormawa) Unggah master template baru
│       └── PreviewTemplateModal.jsx # Pratinjau isi dokumen template
│
├── dashboard/                       # [FITUR: DASHBOARD EKSEKUTIF]
│   ├── DashboardView.jsx            # Halaman ikhtisar pengawasan & KPI
│   └── components/                  # KpiSummary, Scorecard, BudgetCard, ProkerTable, ActivityFeed
│
├── kalender/                        # [FITUR: KALENDER KEGIATAN]
│   ├── KalenderView.jsx             # Halaman kalender proker & hari libur nasional
│   └── components/                  # KalenderGrid, KalenderSidebar
│
├── history/                         # [FITUR: LOG AKTIVITAS]
│   └── HistoryView.jsx              # Riwayat aksi penambahan & penghapusan proker
│
├── layout/                          # [KOMPONEN NAVIGASI PLATFORM]
│   ├── Header.jsx                   # Header atas & profil
│   ├── Sidebar.jsx                  # Sidebar menu navigasi role-based
│   └── components/                  # ProfileModal
│
├── print/                           # [CETAK LAPORAN RESMI]
│   ├── PrintDocModal.jsx            # Modal generator print preview
│   └── templates/                   # CetakBeritaAcaraAudit, CetakRekapAnggaran, CetakRundown, CetakSuratPeringatan
│
├── auth/                            # [AUTENTIKASI & AKSES MASUK]
│   ├── LoginView.jsx                # Form login Ormawa & 1-klik Tamu Publik
│   └── RegisterView.jsx             # Form pendaftaran akun pengurus baru
│
├── tamu/                            # 🛡️ [KHUSUS TAMU PUBLIK & TRANSPARANSI]
│   ├── TamuGuideCard.jsx            # Kartu panduan informasi transparansi publik
│   ├── TamuGuard.jsx                # Utilitas guard pembatas aksi mutasi interaktif
│   └── TamuPrivacyNotice.jsx        # Keterangan perlindungan sensor nomor WA & NIM
│
└── ui/                              # [DESIGN SYSTEM PRIMITIVES]
    └── button, dialog, card, badge, input, skeleton, table, dropdown-select, dll.
```

---

## 🛡️ Matriks Hak Akses (RBAC Matrix)

| Fitur / Modul | Tamu (Publik) | BEM / HiMTI / HIMSISFO | DPM FASILKOM | Lokasi File |
| :--- | :---: | :---: | :---: | :--- |
| **Dashboard** | ✅ Hanya Baca | ✅ Interaktif | ✅ Interaktif | `src/components/dashboard/` |
| **Daftar Proker** | ✅ Hanya Baca | ✅ Kelola Ormawa | ✅ Evaluasi / Pantau | `src/components/proker/` |
| **Tambah Proker** | ❌ Dilarang | ✅ Pengajuan | ❌ (Hanya Evaluasi) | `proker/components/TambahProkerModal.jsx` |
| **Review & ACC Proposal** | ❌ Dilarang | ❌ | ✅ Hak Penuh | `proker/components/ReviewProposalModal.jsx` |
| **Revisi Proposal** | ❌ Dilarang | ✅ Unggah Revisi | ❌ | `proker/components/UploadRevisiModal.jsx` |
| **Hapus / Batal Proker** | ❌ Dilarang | ⚠️ Ajukan Izin | ✅ Persetujuan DPM | `proker/components/AjukanHapusProkerModal.jsx` & `KelolaHapusProkerModal.jsx` |
| **Transparansi Anggaran** | ✅ Hanya Baca | ✅ Bendahara Ormawa | ✅ Hak Penuh | `src/components/anggaran/` |
| **Atur Pagu Anggaran** | ❌ Dilarang | ❌ | ✅ Hak Penuh DPM | `anggaran/components/AturPaguModal.jsx` |
| **Catat Transaksi Belanja**| ❌ Dilarang | ✅ Bendahara Ormawa | ❌ (Hanya Audit) | `anggaran/components/TambahTransaksiModal.jsx` |
| **Audit & Skor LPJ** | ✅ Hanya Baca | ❌ | ✅ Penilai Resmi | `audit/components/AuditLpjModal.jsx` |
| **Transparansi Berkas** | ✅ Hanya Baca | ✅ Arsip Ormawa | ✅ Hak Penuh | `src/components/berkas/` |
| **Upload Berkas Baru** | ❌ Dilarang | ✅ Unggah Berkas | ✅ Unggah Berkas | `berkas/components/UploadBerkasModal.jsx` |
| **Template Dokumen** | ❌ Ditutup | ✅ Unduh Format | ✅ Kelola Master | `src/components/template/` |
| **Surat Peringatan (SP)** | ❌ Ditutup | ⚠️ Respon Klarifikasi | ✅ Terbitkan & Evaluasi | `src/components/sp/` |
| **Kalender Kegiatan** | ✅ Hanya Baca | ✅ Jadwal Ormawa | ✅ Pantau Jadwal | `src/components/kalender/` |
| **Cetak Dokumen Resmi** | ❌ | ✅ Cetak Bukti/Rundown | ✅ Berita Acara & SP | `src/components/print/` |
| **Panduan & Guard Tamu** | ✅ Aktif | ❌ | ❌ | `src/components/tamu/` |
