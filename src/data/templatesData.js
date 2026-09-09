// Data Awal Bank Template Dokumen Resmi DPM & Ormawa FASILKOM UMB

export const INITIAL_TEMPLATES = [
  {
    id: 'tpl-dispensasi-panitia',
    title: 'Surat Izin Dispensasi Kuliah Panitia Kegiatan',
    category: 'Perizinan & Dispensasi',
    categorySlug: 'dispensasi',
    format: 'DOCX',
    fileSize: '148 KB',
    downloadCount: 42,
    updatedAt: '2026-08-15',
    isOfficial: true,
    isCustom: false,
    author: 'DPM FASILKOM UMB',
    description: 'Format baku permohonan dispensasi perkuliahan resmi dari ormawa pelaksana ke Dekanat dan para Dosen Pengampu mata kuliah.',
    tags: ['Dispensasi', 'Perkuliahan', 'Panitia Proker', 'Dekanat'],
    fields: [
      '[Nama Ormawa]',
      '[Nomor Surat]',
      '[Nama Kegiatan / Proker]',
      '[Hari & Tanggal Pelaksanaan]',
      '[Waktu Kegiatan]',
      '[Daftar Nama Mahasiswa, NIM & Mata Kuliah]',
      '[Nama & Tanda Tangan Ketua Pelaksana]',
      '[Nama & Tanda Tangan Ketua Ormawa]',
      '[Mengetahui Ketua DPM FASILKOM]'
    ],
    contentPreview: `DEWAN PERWAKILAN MAHASISWA
FAKULTAS ILMU KOMPUTER - UNIVERSITAS MERCU BUANA
Sekretariat: Gedung Kuliah Terpadu Lt. 3, Jl. Meruya Selatan No. 1, Kembangan, Jakarta Barat

Nomor     : [NOMOR_SURAT]/EXT/PAN-[ORMAWA]/FASILKOM-UMB/[BULAN_ROMAWI]/2026
Lampiran  : 1 (Satu) Berkas Daftar Panitia
Perihal   : Permohonan Dispensasi Perkuliahan Panitia Kegiatan

Kepada Yth.
Bapak/Ibu Dosen Pengampu Mata Kuliah
Fakultas Ilmu Komputer - Universitas Mercu Buana
Di Tempat

Dengan hormat,
Sehubungan dengan diselenggarakannya program kerja [NAMA_PROGRAM_KERJA] oleh [NAMA_ORMAWA] Fakultas Ilmu Komputer Universitas Mercu Buana yang akan dilaksanakan pada:

Hari, Tanggal : [HARI_TANGGAL_KEGIATAN]
Waktu         : [WAKTU_KEGIATAN] WIB s.d. Selesai
Tempat        : [LOKASI_KEGIATAN]

Maka bersama surat ini, kami memohon kesediaan Bapak/Ibu Dosen untuk dapat memberikan dispensasi (izin tidak menghadiri perkuliahan/praktikum) kepada mahasiswa/i Fakultas Ilmu Komputer yang bertugas sebagai panitia pelaksana kegiatan tersebut (daftar terlampir).

Demikian surat permohonan dispensasi ini kami sampaikan. Atas perhatian, dukungan, dan kerja sama Bapak/Ibu Dosen, kami mengucapkan terima kasih.

Hormat kami,
Panitia Pelaksana [NAMA_PROGRAM_KERJA]

Ketua Pelaksana,                         Ketua [NAMA_ORMAWA],
[NAMA_KETUA_PELAKSANA]                   [NAMA_KETUA_ORMAWA]
NIM. [NIM_KETUA_PELAKSANA]               NIM. [NIM_KETUA_ORMAWA]

Mengetahui dan Menyetujui,
Ketua Dewan Perwakilan Mahasiswa (DPM) FASILKOM UMB,

Muhammad Daffa Aulia Syahrul
NIM. 41824010013`
  },
  {
    id: 'tpl-sidang-umum',
    title: 'Dokumen & Tata Tertib Sidang Umum',
    category: 'Persidangan',
    categorySlug: 'persidangan',
    format: 'DOCX',
    fileSize: '320 KB',
    downloadCount: 29,
    updatedAt: '2026-07-20',
    isOfficial: true,
    isCustom: false,
    author: 'Komisi Legislasi DPM FASILKOM',
    description: 'Paket draf konstitusi persidangan: Tata Tertib Sidang Pleno, Agenda Acara, Konsideran Draf Ketetapan, dan Berita Acara Pengesahan LPJ.',
    tags: ['Sidang Umum', 'Tata Tertib', 'Presidium', 'Ketetapan', 'Pleno'],
    fields: [
      '[Nama Ormawa / Forum]',
      '[Periode Kepengurusan]',
      '[Pasal Kuorum Persidangan]',
      '[Mekanisme Interupsi & Pengambilan Keputusan]',
      '[Draf Ketetapan Konsideran Sidang]',
      '[Tanda Tangan Presidium Sidang I, II, III]'
    ],
    contentPreview: `DRAFT TATA TERTIB PERSIDANGAN
SIDANG UMUM MAHASISWA [NAMA_ORMAWA]
FAKULTAS ILMU KOMPUTER - UNIVERSITAS MERCU BUANA
PERIODE [PERIODE_KEPENGURUSAN]

BAB I: NAMA, WAKTU, DAN TEMPAT
Pasal 1: Persidangan ini bernama Sidang Umum [NAMA_ORMAWA] Fasilkom UMB.
Pasal 2: Sidang Umum dilaksanakan pada [HARI_TANGGAL] bertempat di [LOKASI_PERSIDANGAN].

BAB II: KEDUDUKAN DAN WEWENANG
Pasal 3: Sidang Umum memegang kekuasaan legislatif dan evaluasi tertinggi di lingkungan [NAMA_ORMAWA].
Pasal 4: Wewenang persidangan meliputi:
1. Menilai dan mengesahkan Laporan Pertanggungjawaban (LPJ) pengurus.
2. Membahas dan menetapkan Anggaran Dasar / Anggaran Rumah Tangga (AD/ART) serta Garis Besar Haluan Organisasi (GBHO).
3. Memilih dan menetapkan pimpinan kepengurusan untuk periode berikutnya.

BAB III: PESERTA DAN HAK SUARA
Pasal 5: Peserta sidang terdiri dari Peserta Penuh dan Peserta Peninjau.
Pasal 6: Hak Peserta Penuh meliputi hak bicara dan hak suara; Peserta Peninjau memiliki hak bicara.

BAB IV: PENGAMBILAN KEPUTUSAN
Pasal 7: Keputusan diambil berdasarkan asas musyawarah untuk mufakat; apabila tidak tercapai mufakat, dilakukan lobbying atau pemungutan suara (voting).

Ditetapkan di : Jakarta Barat
Pada tanggal  : [TANGGAL_PENETAPAN]
Pukul         : [WAKTU_PENETAPAN] WIB

PRESIDIUM SIDANG TETAP:
Presidium I (Ketua)       : [NAMA_PRESIDIUM_1] (NIM. [NIM_1])
Presidium II (Sekretaris) : [NAMA_PRESIDIUM_2] (NIM. [NIM_2])
Presidium III (Anggota)   : [NAMA_PRESIDIUM_3] (NIM. [NIM_3])`
  },
  {
    id: 'tpl-proposal-sponsor',
    title: 'Surat Pengantar & Proposal Sponsorship Ormawa',
    category: 'Sponsorship & Kemitraan',
    categorySlug: 'sponsorship',
    format: 'DOCX',
    fileSize: '410 KB',
    downloadCount: 68,
    updatedAt: '2026-08-01',
    isOfficial: true,
    isCustom: false,
    author: 'Biro Kemitraan DPM & BEM',
    description: 'Struktur proposal sponsor profesional mencakup surat permohonan kerjasama, profil ormawa, paket benefit kontraprestasi (Platinum, Gold, Silver), dan lembar MoU.',
    tags: ['Sponsor', 'Partnership', 'Kontraprestasi', 'RAB', 'MoU'],
    fields: [
      '[Nama Perusahaan / Pimpinan Brand]',
      '[Nama Program Kerja]',
      '[Deskripsi & Dampak Kegiatan]',
      '[Target Audiens / Jumlah Mahasiswa]',
      '[Paket Kemitraan (Platinum, Gold, Silver, In-Kind)]',
      '[Informasi Rekening Resmi Ormawa]',
      '[Contact Person Tim Sponsorship]'
    ],
    contentPreview: `SURAT PENGANTAR KERJASAMA SPONSORSHIP
Nomor: [NOMOR_SURAT]/SPON/[ORMAWA]/FASILKOM-UMB/2026

Kepada Yth.
Pimpinan / Corporate Relations Manager
[NAMA_PERUSAHAAN_PARTNER]
Di Tempat

Dengan hormat,
Fakultas Ilmu Komputer Universitas Mercu Buana senantiasa berkomitmen mendorong inovasi teknologi dan kepemimpinan generasi muda. Melalui surat ini, kami dari [NAMA_ORMAWA] bermaksud mengajukan penawaran kemitraan strategis dalam kegiatan:

"[NAMA_PROGRAM_KERJA]"
Tema: [TEMA_PROGRAM_KERJA]
Tanggal Pelaksanaan : [TANGGAL_PELAKSANAAN]
Target Peserta      : [TARGET_PESERTA] Mahasiswa & Praktisi IT Jabodetabek

Melalui kolaborasi ini, [NAMA_PERUSAHAAN_PARTNER] akan memperoleh eksposur branding eksklusif, akses interaksi langsung dengan talenta teknologi muda, serta ruang promosi produk/layanan pada seluruh kanal publikasi kami.

Rincian paket benefit, rencana anggaran, dan kontrak kerja sama terangkum dalam lampiran proposal ini.

Atas perhatian dan kerja sama yang terjalin, kami mengucapkan terima kasih.

Hormat kami,
[NAMA_ORMAWA] FASILKOM UNIVERSITAS MERCU BUANA

Ketua Pelaksana Proker,                  Koordinator Sponsorship,
[NAMA_KETUA_PELAKSANA]                   [NAMA_KOORDINATOR_SPONSOR]
NIM. [NIM_KETUA]                         NIM. [NIM_SPONSOR]`
  },
  {
    id: 'tpl-peminjaman-ruangan',
    title: 'Surat & Formulir Izin Peminjaman Ruangan',
    category: 'Sarana & Peminjaman Ruangan',
    categorySlug: 'ruangan',
    format: 'DOCX',
    fileSize: '165 KB',
    downloadCount: 54,
    updatedAt: '2026-08-10',
    isOfficial: true,
    isCustom: false,
    author: 'Bagian Sarana Prasarana Fasilkom',
    description: 'Surat resmi permohonan penggunaan fasilitas kampus: Aula Gedung Kuliah Terpadu, Ruang Sidang, Laboratorium Komputer, Sound System, dan Proyektor.',
    tags: ['Ruangan', 'Lab Komputer', 'Aula', 'Peminjaman Fasilitas', 'Sarpras'],
    fields: [
      '[Nama Fasilitas / Ruangan / Lab]',
      '[Nama Program Kerja]',
      '[Tanggal & Jam Penggunaan]',
      '[Daftar Alat Tambahan (Mic, Kabel LAN, Kursi)]',
      '[Penanggung Jawab Fasilitas]',
      '[Mengetahui Wakil Dekan / Ka. Bag. Umum]'
    ],
    contentPreview: `SURAT PERMOHONAN PEMINJAMAN RUANGAN & FASILITAS KAMPUS
Nomor: [NOMOR_SURAT]/SARPRAS/[ORMAWA]/FASILKOM-UMB/2026

Kepada Yth.
Kepala Bagian Umum & Rumah Tangga Kampus Meruya /
Dekanat Fakultas Ilmu Komputer Universitas Mercu Buana
Di Tempat

Dengan hormat,
Dalam rangka menunjang kelancaran program kerja mahasiswa Fakultas Ilmu Komputer UMB yang bertajuk:
"[NAMA_PROGRAM_KERJA]"

Kami selaku panitia pelaksana mengajukan permohonan peminjaman sarana dan fasilitas kampus dengan rincian sebagai berikut:

1. Ruangan yang dipinjam : [NAMA_RUANGAN_LAB_AULA]
2. Hari / Tanggal        : [HARI_TANGGAL_PEMINJAMAN]
3. Waktu Penggunaan      : [JAM_MULAI] s.d. [JAM_SELESAI] WIB
4. Estimasi Pengguna     : [ESTIMASI_ORANG] Orang
5. Fasilitas Pendukung   : [SOUND_SYSTEM / PROYEKTOR / KABEL_EXTENSION / AC]

Panitia pelaksana bertanggung jawab penuh atas kebersihan, ketertiban, dan pemeliharaan fasilitas selama dan sesudah acara berlangsung.

Demikian permohonan ini kami sampaikan. Atas izin dan dukungannya, kami ucapkan terima kasih.

Hormat kami,
Penanggung Jawab Lapangan,               Ketua Pelaksana,
[NAMA_PJ_LAPANGAN]                       [NAMA_KETUA_PELAKSANA]
NIM. [NIM_PJ]                            NIM. [NIM_KETUA]

Menyetujui,
Kepala Subbagian Umum & Sarpras Kampus Meruya UMB
(......................................................)`
  },
  {
    id: 'tpl-lpj-standar-dpm',
    title: 'Format Laporan Pertanggung jawaban (LPJ) Ormawa',
    category: 'LPJ & Keuangan',
    categorySlug: 'lpj',
    format: 'DOCX',
    fileSize: '480 KB',
    downloadCount: 76,
    updatedAt: '2026-08-25',
    isOfficial: true,
    isCustom: false,
    author: 'Komisi Audit Keuangan DPM FASILKOM',
    description: 'Format baku LPJ kegiatan wajib memenuhi standar audit DPM: Laporan Realisasi Acara, Buku Kas Umum, Rekonsiliasi Kuitansi Resmi, dan Evaluasi Kendala.',
    tags: ['LPJ', 'Audit DPM', 'Laporan Keuangan', 'Kuitansi', 'Akuntabilitas'],
    fields: [
      '[Pendahuluan & Latar Belakang]',
      '[Realisasi Susunan Acara & Waktu]',
      '[Tabel Realisasi Anggaran vs Anggaran RAB]',
      '[Lampiran Bukti Pengeluaran & Nota Bermaterai]',
      '[Dokumentasi Visual Kegiatan]',
      '[Tanda Tangan Bendahara, Ketua, & Auditor DPM]'
    ],
    contentPreview: `STANDAR LAPORAN PERTANGGUNGJAWABAN (LPJ)
PROGRAM KERJA ORMAWA FASILKOM UNIVERSITAS MERCU BUANA
PEDOMAN AUDIT KOMISI II DEWAN PERWAKILAN MAHASISWA

SISTEMATIKA LAPORAN:
BAB I: PENDAHULUAN
- Latar Belakang Proker
- Maksud dan Tujuan Kegiatan
- Landasan Pelaksanaan (SK Kepengurusan / Kalender Terpadu DPM)

BAB II: LAPORAN REALISASI KEGIATAN
- Waktu dan Tempat Pelaksanaan
- Susunan Kepanitiaan (Realisasi Kehadiran)
- Rangkaian Acara (Rundown Aktual)
- Target dan Realisasi Jumlah Peserta (Data Presensi Mahasiswa)

BAB III: LAPORAN PERTANGGUNGJAWABAN KEUANGAN
- Rekapitulasi Sumber Penerimaan (Dana Fakultas, Sponsor, Tiket/Pendaftaran)
- Buku Kas Pengeluaran (Berdasarkan Divisi Acara, Konsumsi, Logistik, Publikasi)
- Tabel Perbandingan RAB Rencana vs Realisasi Anggaran Aktual
- Sisa Saldo Akhir Kas Proker

BAB IV: EVALUASI, KENDALA, DAN REKOMENDASI
- Evaluasi Teknis Masing-Masing Divisi
- Kendala Lapangan yang Dihadapi
- Saran Perbaikan untuk Kepengurusan Periode Berikutnya

BAB V: PENUTUP DAN PENGESAHAN
Lembar Tanda Tangan:
1. Bendahara Pelaksana Kegiatan
2. Ketua Pelaksana Kegiatan
3. Ketua Ormawa Penyelenggara
4. Ketua Komisi Audit Keuangan DPM FASILKOM UMB

LAMPIRAN WAJIB:
- Seluruh Bukti Pembayaran / Nota Asli
- Dokumentasi Foto & Publikasi Kegiatan
- Form Penilaian Angket Kepuasan Audiens`
  },
  {
    id: 'tpl-undangan-pemateri',
    title: 'Surat Undangan Pemateri / Narasumber & Juri',
    category: 'Perizinan & Dispensasi',
    categorySlug: 'dispensasi',
    format: 'DOCX',
    fileSize: '155 KB',
    downloadCount: 38,
    updatedAt: '2026-08-18',
    isOfficial: true,
    isCustom: false,
    author: 'DPM & BEM FASILKOM',
    description: 'Template surat resmi mengundang dosen, pakar industri, praktisi startup, atau alumni sebagai pembicara seminar, pemateri workshop, atau juri kompetisi.',
    tags: ['Undangan', 'Pemateri', 'Narasumber', 'Juri', 'Workshop'],
    fields: [
      '[Nama Lengkap & Gelar Narasumber]',
      '[Instansi / Perusahaan Narasumber]',
      '[Topik / Judul Materi yang Dibawakan]',
      '[Hari, Tanggal & Jam Sesi Materi]',
      '[Platform (Luring di Kampus / Daring via Zoom)]',
      '[Term of Reference (ToR) Terlampir]'
    ],
    contentPreview: `SURAT UNDANGAN NARASUMBER / PEMATERI KEGIATAN
Nomor: [NOMOR_SURAT]/UND/PAN-[ORMAWA]/FASILKOM-UMB/2026

Kepada Yth.
[NAMA_LENGKAP_GELAR_NARASUMBER]
[JABATAN_INSTANSI_NARASUMBER]
Di Tempat

Dengan hormat,
Dalam rangka meningkatkan kompetensi dan wawasan mahasiswa di bidang teknologi informasi terkini, [NAMA_ORMAWA] Fakultas Ilmu Komputer Universitas Mercu Buana menyelenggarakan kegiatan:

Seminar & Workshop: "[NAMA_PROGRAM_KERJA]"
Tema: "[TEMA_KEGIATAN]"

Sehubungan dengan keahlian dan rekam jejak Bapak/Ibu di bidang tersebut, kami bermaksud mengundang Bapak/Ibu untuk hadir sebagai Narasumber / Pemateri dalam sesi utama kegiatan yang akan diselenggarakan pada:

Hari, Tanggal : [HARI_TANGGAL_SEMINAR]
Waktu         : [WAKTU_PELAKSANAAN] WIB
Tempat        : [LOKASI_AULA_KAMPUS_ATAU_ZOOM]
Topik Materi  : "[TOPIK_MATERI_YANG_DIMINTA]"

Kerangka Acuan Kerja (Term of Reference / ToR) terlampir bersama surat ini sebagai panduan teknis pemaparan materi.

Besar harapan kami Bapak/Ibu berkenan menerima undangan ini. Atas kesediaan dan kerjasamanya, kami haturkan terima kasih.

Hormat kami,
Panitia Pelaksana [NAMA_PROGRAM_KERJA]

Ketua Pelaksana,                         Koordinator Divisi Acara,
[NAMA_KETUA_PELAKSANA]                   [NAMA_KOORDINATOR_ACARA]
NIM. [NIM_KETUA]                         NIM. [NIM_ACARA]`
  }
];

export const TEMPLATE_CATEGORIES = [
  { id: 'all', label: 'Semua Template', icon: 'Files' },
  { id: 'dispensasi', label: 'Surat Izin & Dispensasi', icon: 'FileText' },
  { id: 'persidangan', label: 'Persidangan Ormawa', icon: 'Scale' },
  { id: 'sponsorship', label: 'Sponsorship & Kemitraan', icon: 'Handshake' },
  { id: 'ruangan', label: 'Sarana & Peminjaman Ruangan', icon: 'Building' },
  { id: 'lpj', label: 'LPJ & Keuangan', icon: 'FileSpreadsheet' }
];
