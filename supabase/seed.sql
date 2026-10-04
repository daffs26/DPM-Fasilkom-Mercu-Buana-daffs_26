-- 1. Periode Kepengurusan
insert into public.academic_periods (id, name, is_active, start_date, end_date)
values
  ('2025/2026', 'Periode 2025/2026', true, '2025-09-01', '2026-08-31'),
  ('2026/2027', 'Periode 2026/2027', false, '2026-09-01', '2027-08-31')
on conflict (id) do update set
  is_active = excluded.is_active;

-- 2. Data Ormawa Fasilkom UMB
insert into public.ormawa (
  id, name, full_name, short_name, type, logo_url, pdh_color_name,
  ketua, instagram, pagu_anggaran, serapan_anggaran, color_config
)
values
  (
    'dpm',
    'DPM UMB',
    'Dewan Perwakilan Mahasiswa Fakultas Ilmu Komputer',
    'DPM',
    'Lembaga Legislatif Fasilkom',
    '/logos/logo-dpm.png',
    'Hitam (DPM)',
    'Muhammad Daffa Aulia Syahrul',
    'dpmfasilkom.umb',
    0,
    0,
    '{
      "primary": "#090D16",
      "accent": "#D97706",
      "badgeBg": "bg-slate-900 text-white border-slate-700",
      "tagBg": "bg-slate-900 text-white",
      "borderActive": "border-slate-900",
      "ring": "ring-slate-900",
      "border": "border-slate-800",
      "bgLight": "bg-slate-100 text-slate-900"
    }'::jsonb
  ),
  (
    'bem',
    'BEM FASILKOM UMB',
    'Badan Eksekutif Mahasiswa Fakultas Ilmu Komputer',
    'BEM',
    'Lembaga Eksekutif Fasilkom',
    '/logos/logo-bem.png',
    'Biru Muda (BEM)',
    'Rafi Pratama',
    'bemfasilkom.umb',
    0,
    0,
    '{
      "primary": "#0284C7",
      "accent": "#38BDF8",
      "badgeBg": "bg-sky-100 text-sky-800 border-sky-200",
      "tagBg": "bg-sky-500 text-white",
      "borderActive": "border-sky-500",
      "ring": "ring-sky-400",
      "border": "border-sky-300",
      "bgLight": "bg-sky-50 text-sky-800"
    }'::jsonb
  ),
  (
    'himti',
    'HIMTI UMB',
    'Himpunan Mahasiswa Teknik Informatika',
    'HIMTI',
    'Lembaga Eksekutif Teknik Informatika',
    '/logos/logo-himti.png',
    'Biru Dongker (HiMTI)',
    'Aldi Renaldi',
    'himti.umb',
    0,
    0,
    '{
      "primary": "#172554",
      "accent": "#1E3A8A",
      "badgeBg": "bg-[#172554] text-blue-100 border-blue-900",
      "tagBg": "bg-[#172554] text-white",
      "borderActive": "border-blue-950",
      "ring": "ring-blue-900",
      "border": "border-blue-900",
      "bgLight": "bg-blue-50 text-blue-950"
    }'::jsonb
  ),
  (
    'himsisfo',
    'HIMSISFO UMB',
    'Himpunan Mahasiswa Sistem Informasi',
    'HIMSISFO',
    'Lembaga Eksekutif Sistem Informasi',
    '/logos/logo-himsisfo.png',
    'Krem (HIMSISFO)',
    'Fadlan Maulana',
    'himsisfo_umb',
    0,
    0,
    '{
      "primary": "#9A7B56",
      "accent": "#C7B198",
      "badgeBg": "bg-[#FBF9F5] text-[#785E43] border-[#E8DEC8]",
      "tagBg": "bg-[#9A7B56] text-white",
      "borderActive": "border-[#9A7B56]",
      "ring": "ring-[#9A7B56]",
      "border": "border-[#E8DEC8]",
      "bgLight": "bg-[#FBF9F5] text-[#785E43]"
    }'::jsonb
  )
on conflict (id) do update set
  name = excluded.name,
  full_name = excluded.full_name,
  ketua = excluded.ketua,
  color_config = excluded.color_config;

-- 3. Bank Template Dokumen Resmi
insert into public.document_templates (
  id, title, category, category_slug, format, file_size, download_count,
  periode, is_official, author, description, tags, fields, content_preview, file_url
)
values
  (
    'tpl-dispensasi-panitia',
    'Surat Izin Dispensasi Kuliah Panitia Kegiatan',
    'Perizinan & Dispensasi',
    'dispensasi',
    'DOCX',
    '148 KB',
    42,
    '2025/2026',
    true,
    'DPM FASILKOM UMB',
    'Format baku permohonan dispensasi perkuliahan resmi dari ormawa pelaksana ke Dekanat dan para Dosen Pengampu mata kuliah.',
    '["Dispensasi", "Perkuliahan", "Panitia Proker", "Dekanat"]'::jsonb,
    '["[Nama Ormawa]", "[Nomor Surat]", "[Nama Kegiatan / Proker]", "[Hari & Tanggal Pelaksanaan]", "[Waktu Kegiatan]", "[Daftar Nama Mahasiswa, NIM & Mata Kuliah]", "[Nama & Tanda Tangan Ketua Pelaksana]", "[Nama & Tanda Tangan Ketua Ormawa]", "[Mengetahui Ketua DPM FASILKOM]"]'::jsonb,
    'DEWAN PERWAKILAN MAHASISWA\nFAKULTAS ILMU KOMPUTER - UNIVERSITAS MERCU BUANA\nSekretariat: Gedung Kuliah Terpadu Lt. 3, Jl. Meruya Selatan No. 1, Kembangan, Jakarta Barat\n\nPerihal: Permohonan Dispensasi Perkuliahan Panitia Kegiatan\n...',
    null
  ),
  (
    'tpl-sidang-umum',
    'Dokumen & Tata Tertib Sidang Umum',
    'Persidangan Ormawa',
    'persidangan',
    'DOCX',
    '320 KB',
    29,
    '2025/2026',
    true,
    'Komisi Legislasi DPM FASILKOM',
    'Paket draf konstitusi persidangan: Tata Tertib Sidang Pleno, Agenda Acara, Konsideran Draf Ketetapan, dan Berita Acara Pengesahan LPJ.',
    '["Sidang Umum", "Tata Tertib", "Presidium", "Ketetapan", "Pleno"]'::jsonb,
    '["[Nama Ormawa / Forum]", "[Periode Kepengurusan]", "[Pasal Kuorum Persidangan]", "[Mekanisme Interupsi & Pengambilan Keputusan]", "[Draf Ketetapan Konsideran Sidang]", "[Tanda Tangan Presidium Sidang I, II, III]"]'::jsonb,
    'DRAFT TATA TERTIB PERSIDANGAN\nSIDANG UMUM MAHASISWA [NAMA_ORMAWA]\nFAKULTAS ILMU KOMPUTER - UNIVERSITAS MERCU BUANA\n...',
    null
  ),
  (
    'tpl-proposal-sponsor',
    'Surat Pengantar & Proposal Sponsorship Ormawa',
    'Sponsorship & Kemitraan',
    'sponsorship',
    'DOCX',
    '410 KB',
    68,
    '2025/2026',
    true,
    'Biro Kemitraan DPM & BEM',
    'Struktur proposal sponsor profesional mencakup surat permohonan kerjasama, profil ormawa, paket benefit kontraprestasi (Platinum, Gold, Silver), dan lembar MoU.',
    '["Sponsor", "Partnership", "Kontraprestasi", "RAB", "MoU"]'::jsonb,
    '["[Nama Perusahaan / Pimpinan Brand]", "[Nama Program Kerja]", "[Deskripsi & Dampak Kegiatan]", "[Target Audiens / Jumlah Mahasiswa]", "[Paket Kemitraan (Platinum, Gold, Silver, In-Kind)]", "[Informasi Rekening Resmi Ormawa]", "[Contact Person Tim Sponsorship]"]'::jsonb,
    'SURAT PENGANTAR KERJASAMA SPONSORSHIP\nNomor: [NOMOR_SURAT]/SPON/[ORMAWA]/FASILKOM-UMB/2026\n...',
    null
  ),
  (
    'tpl-peminjaman-ruangan',
    'Surat & Formulir Izin Peminjaman Ruangan',
    'Sarana & Peminjaman Ruangan',
    'ruangan',
    'DOCX',
    '165 KB',
    54,
    '2026/2027',
    true,
    'Bagian Sarana Prasarana Fasilkom',
    'Surat resmi permohonan penggunaan fasilitas kampus: Aula Gedung Kuliah Terpadu, Ruang Sidang, Laboratorium Komputer, Sound System, dan Proyektor.',
    '["Ruangan", "Lab Komputer", "Aula", "Peminjaman Fasilitas", "Sarpras"]'::jsonb,
    '["[Nama Fasilitas / Ruangan / Lab]", "[Nama Program Kerja]", "[Tanggal & Jam Penggunaan]", "[Daftar Alat Tambahan (Mic, Kabel LAN, Kursi)]", "[Penanggung Jawab Fasilitas]", "[Mengetahui Wakil Dekan / Ka. Bag. Umum]"]'::jsonb,
    'SURAT PERMOHONAN PEMINJAMAN RUANGAN & FASILITAS KAMPUS\nNomor: [NOMOR_SURAT]/SARPRAS/[ORMAWA]/FASILKOM-UMB/2026\n...',
    null
  ),
  (
    'tpl-lpj-standar-dpm',
    'Format Laporan Pertanggungjawaban (LPJ) Ormawa',
    'LPJ & Keuangan',
    'lpj',
    'DOCX',
    '480 KB',
    76,
    '2025/2026',
    true,
    'Komisi Audit Keuangan DPM FASILKOM',
    'Format baku LPJ kegiatan wajib memenuhi standar audit DPM: Laporan Realisasi Acara, Buku Kas Umum, Rekonsiliasi Kuitansi Resmi, dan Evaluasi Kendala.',
    '["LPJ", "Audit DPM", "Laporan Keuangan", "Kuitansi", "Akuntabilitas"]'::jsonb,
    '["[Pendahuluan & Latar Belakang]", "[Realisasi Susunan Acara & Waktu]", "[Tabel Realisasi Anggaran vs Anggaran RAB]", "[Lampiran Bukti Pengeluaran & Nota Bermaterai]", "[Dokumentasi Visual Kegiatan]", "[Tanda Tangan Bendahara, Ketua, & Auditor DPM]"]'::jsonb,
    'STANDAR LAPORAN PERTANGGUNGJAWABAN (LPJ)\nPROGRAM KERJA ORMAWA FASILKOM UNIVERSITAS MERCU BUANA\nPEDOMAN AUDIT KOMISI II DEWAN PERWAKILAN MAHASISWA\n...',
    null
  )
on conflict (id) do nothing;
