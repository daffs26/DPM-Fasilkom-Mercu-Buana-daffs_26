/**
 * Data Struktur Organisasi DPM FASILKOM Universitas Mercu Buana
 * Periode 2025/2026
 * 
 * Berdasarkan Tupoksi Resmi DPM FASILKOM:
 * - Ketua Umum & Wakil Ketua Umum
 * - Sekretaris DPM (Administrasi, Notulen, Persuratan, Arsip)
 * - Bendahara DPM (Keuangan, Arus Kas, Bukti Transaksi, Laporan Keuangan)
 * - Komisi Pengawasan (Monitoring Proker Ormawa, Evaluasi Kegiatan/Kebijakan, LPJ, Rekomendasi)
 * - Komisi Keuangan (Kajian RAB, Pengawasan Anggaran, Verifikasi LPJ Keuangan, Transparansi)
 * - Komisi Advokasi (Penjaringan Aspirasi, Identifikasi Masalah Mahasiswa, Pengawalan Dekanat)
 * - Komisi Kominfo (Publikasi, Dokumentasi, Penyebaran Informasi, Komunikasi Mahasiswa)
 */

export const structuralCategories = [
  { key: 'all', label: 'Semua Anggota' },
  { key: 'exec', label: 'Pimpinan Utama' },
  { key: 'admin', label: 'Sekretariat & Bendahara' },
  { key: 'keuangan', label: 'Komisi Keuangan' },
  { key: 'pengawasan', label: 'Komisi Pengawasan' },
  { key: 'kominfo', label: 'Komisi Kominfo' },
  { key: 'advokasi', label: 'Komisi Advokasi' },
];

export const structuralMembers = [
  // ── LEVEL 1: KETUA UMUM ─────────────────────────────────────────────
  {
    id: 'ketum',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Ketua Umum DPM FASILKOM',
    tier: 'pimpinan',
    category: 'exec',
    unit: 'Pimpinan Utama',
    badgeText: 'Pimpinan Utama',
    badgeColor: 'bg-blue-600 text-white border-blue-400/40',
    watermark: 'LEADERSHIP',
    cardGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Ketua Umum bertanggung jawab memimpin DPM FASILKOM secara menyeluruh, menetapkan arah kebijakan parlemen, dan memegang tanggung jawab tertinggi lembaga.',
    tupoksi: [
      'Memegang mandat kepemimpinan tertinggi dan tanggung jawab umum DPM FASILKOM UMB.',
      'Mengoordinasikan perumusan kebijakan legislasi, pengawasan, penganggaran, dan advokasi ormawa.',
      'Mewakili DPM FASILKOM dalam forum resmi pimpinan Dekanat, Rektorat, maupun Kongres Mahasiswa.',
      'Mengesahkan Surat Keputusan (SK) hasil audit LPJ, Surat Peringatan (SP), dan alokasi Pagu Anggaran.',
      'Memastikan seluruh komisi dan organ kesekretariatan/kebendaharaan bekerja secara sinergis dan terukur.'
    ],
    fokusInti: 'Memimpin lembaga legislatif mahasiswa dengan integritas, transparansi, dan akuntabilitas penuh demi kemajuan Fasilkom UMB.',
    motto: 'Transparansi berintegritas untuk kemajuan sinergis seluruh lembaga mahasiswa Fasilkom.'
  },

  // ── LEVEL 2: WAKIL KETUA UMUM ───────────────────────────────────────
  {
    id: 'waketum',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Wakil Ketua Umum DPM FASILKOM',
    tier: 'pimpinan',
    category: 'exec',
    unit: 'Pimpinan Utama',
    badgeText: 'Pimpinan Utama',
    badgeColor: 'bg-blue-600 text-white border-blue-400/40',
    watermark: 'EXECUTIVE',
    cardGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Wakil Ketua Umum mendampingi Ketua Umum dalam koordinasi lintas komisi, pengawalan program kerja, dan menjamin kelancaran fungsi eksekutif internal.',
    tupoksi: [
      'Membantu Ketua Umum dalam mengoordinasikan pelaksanaan operasional seluruh komisi, sekretariat, dan bendahara.',
      'Bertindak sebagai pelaksana tugas Ketua Umum bilamana berhalangan hadir dalam sidang pleno atau audiensi.',
      'Memantau sinkronisasi timeline kegiatan ormawa dengan kalender akademik fakultas.',
      'Mengawasi efektivitas alur kerja internal dan penyelesaian kendala teknis lintas komisi.'
    ],
    fokusInti: 'Menjaga soliditas operasional internal dan memastikan fungsi pengawasan serta pelayanan DPM berjalan tanpa hambatan.',
    motto: 'Aksi nyata dalam mengawal tata kelola organisasi yang adaptif dan akuntabel.'
  },

  // ── LEVEL 3: SEKRETARIS DPM (SETARA) ────────────────────────────────
  {
    id: 'sekretaris',
    name: 'Nama',
    nim: '-',
    prodi: 'Sistem Informasi',
    role: 'Sekretaris DPM',
    tier: 'pelaksana',
    category: 'admin',
    unit: 'Kesekretariatan',
    badgeText: 'Sekretaris DPM',
    badgeColor: 'bg-blue-600 text-white border-blue-400/40',
    watermark: 'SECRETARIAT',
    cardGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Sekretaris bertanggung jawab terhadap administrasi, dokumentasi, dan pengelolaan surat-menyurat organisasi.',
    tupoksi: [
      'Membuat surat resmi dan undangan kelembagaan.',
      'Menyusun notulen rapat sidang pleno, dengar pendapat, dan rapat koordinasi.',
      'Mengelola arsip dan dokumen organisasi secara tertib dan digital.',
      'Menyusun jadwal rapat dan agenda kegiatan rutin DPM.',
      'Membantu menyusun laporan administrasi kelembagaan DPM FASILKOM.'
    ],
    fokusInti: 'Menjamin ketertiban arsip, legalitas korespondensi, dan kelancaran sirkulasi administrasi organisasi DPM.',
    motto: 'Ketertiban arsip adalah fondasi utama keterbukaan informasi dan akuntabilitas publik.'
  },

  // ── LEVEL 3: BENDAHARA DPM (SETARA) ─────────────────────────────────
  {
    id: 'bendahara',
    name: 'Nama',
    nim: '-',
    prodi: 'Sistem Informasi',
    role: 'Bendahara DPM',
    tier: 'pelaksana',
    category: 'admin',
    unit: 'Kebendaharaan',
    badgeText: 'Bendahara DPM',
    badgeColor: 'bg-blue-600 text-white border-blue-400/40',
    watermark: 'TREASURY',
    cardGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Bendahara bertanggung jawab mengelola keuangan organisasi secara tertib, transparan, dan dapat dipertanggungjawabkan.',
    tupoksi: [
      'Mengelola pemasukan dan pengeluaran kas operasional internal organisasi.',
      'Menyusun dan mengamati rencana anggaran keuangan.',
      'Membuat laporan keuangan berkala untuk dipertanggungjawabkan.',
      'Mengawasi penggunaan dana program kerja internal dewan perwakilan.',
      'Menyimpan bukti transaksi, faktur, nota belanja, dan dokumen keuangan resmi.'
    ],
    fokusInti: 'Memastikan pengelolaan kas dan aset finansial internal DPM berjalan secara transparan, akurat, dan tertib audit.',
    motto: 'Disiplin finansial melahirkan kepercayaan publik yang berkesinambungan.'
  },

  // ── LEVEL 3: KOMISI KEUANGAN (SETARA) ────────────────────────────────
  {
    id: 'keu-lead',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Kepala Komisi Keuangan',
    tier: 'pelaksana',
    category: 'keuangan',
    unit: 'Komisi Keuangan',
    isLead: true,
    badgeText: 'Kepala Komisi Keuangan',
    badgeColor: 'bg-blue-600 text-white border-blue-400/40',
    watermark: 'FINANCE',
    cardGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Komisi Keuangan fokus pada pengkajian dan pengawasan aspek keuangan organisasi kemahasiswaan sesuai dengan kewenangan yang diberikan kepada DPM.',
    tupoksi: [
      'Mengkaji rencana anggaran kegiatan (RAB) setiap proposal ormawa.',
      'Memantau penggunaan anggaran organisasi mahasiswa agar tidak terjadi defisit.',
      'Menelaah laporan pertanggungjawaban keuangan (LPJ) beserta keabsahan bukti bayar.',
      'Mengarahkan penggunaan dana ormawa agar sesuai dengan peraturan perundang-undangan ormawa.',
      'Memberikan rekomendasi tertulis terkait transparansi dan akuntabilitas keuangan ormawa.'
    ],
    fokusInti: 'Komisi Keuangan membantu memastikan pengelolaan anggaran organisasi mahasiswa dilakukan secara tertib dan dapat dipertanggungjawabkan.',
    motto: 'Anggaran mahasiswa harus dialokasikan secara rasional untuk program yang berdampak nyata.'
  },
  {
    id: 'keu-member-1',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Anggota Komisi Keuangan',
    tier: 'pelaksana',
    category: 'keuangan',
    unit: 'Komisi Keuangan',
    isLead: false,
    badgeText: 'Anggota Komisi Keuangan',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    watermark: 'FINANCE',
    cardGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Melaksanakan verifikasi faktur, nota belanja, dan sinkronisasi matematis pengeluaran dana kegiatan ormawa.',
    tupoksi: [
      'Mengkaji rencana anggaran kegiatan (RAB) pada tahap pengajuan proposal.',
      'Memeriksa bukti transfer, faktur toko, dan kwitansi sah pada LPJ ormawa.',
      'Menyusun draft berita acara telaah keuangan pasca-kegiatan ormawa.'
    ],
    fokusInti: 'Mendukung pemeriksaan akuntansi dan kelengkapan bukti fisik penggunaan dana kegiatan ormawa.',
    motto: 'Presisi numerik menjamin kejujuran dalam setiap laporan pertanggungjawaban.'
  },
  {
    id: 'keu-member-2',
    name: 'Nama',
    nim: '-',
    prodi: 'Sistem Informasi',
    role: 'Anggota Komisi Keuangan',
    tier: 'pelaksana',
    category: 'keuangan',
    unit: 'Komisi Keuangan',
    isLead: false,
    badgeText: 'Anggota Komisi Keuangan',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    watermark: 'FINANCE',
    cardGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Membantu pemantauan serapan pagu anggaran dan rekonsiliasi sisa dana ormawa di sistem AUDITMAWA.',
    tupoksi: [
      'Memantau kepatuhan batasan pagu anggaran tiap ormawa (BEM, HIMTI, HIMSISFO).',
      'Memverifikasi pos biaya konsumsi, pengadaan banner, dan honorarium narasumber.',
      'Memberikan rekomendasi teknis perbaikan administrasi keuangan kepada ormawa.'
    ],
    fokusInti: 'Mengawal kepatuhan penyerapan anggaran agar efisien dan bebas dari markup pengeluaran.',
    motto: 'Efisiensi dan akuntabilitas adalah standar mutlak anggaran kemahasiswaan.'
  },

  // ── LEVEL 3: KOMISI PENGAWASAN (SETARA) ──────────────────────────────
  {
    id: 'was-lead',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Kepala Komisi Pengawasan',
    tier: 'pelaksana',
    category: 'pengawasan',
    unit: 'Komisi Pengawasan',
    isLead: true,
    badgeText: 'Kepala Komisi Pengawasan',
    badgeColor: 'bg-blue-600 text-white border-blue-400/40',
    watermark: 'AUDIT',
    cardGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1506794778202-cad84cf45f1d?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Komisi Pengawasan bertugas melakukan pemantauan dan evaluasi terhadap pelaksanaan program kerja serta kebijakan organisasi kemahasiswaan yang berada dalam cakupan kewenangan DPM.',
    tupoksi: [
      'Memantau pelaksanaan program kerja organisasi mahasiswa (BEM, HIMTI, HIMSISFO).',
      'Melakukan evaluasi terhadap kegiatan dan kepatuhan kebijakan ormawa.',
      'Meminta laporan pertanggungjawaban (LPJ) sesuai mekanisme yang berlaku (SLA H+14).',
      'Memberikan masukan, catatan kritis, dan rekomendasi perbaikan mutu kegiatan.',
      'Menerbitkan notifikasi teguran dan rekomendasi Surat Peringatan (SP) atas pelanggaran fatal.'
    ],
    fokusInti: 'Komisi Pengawasan memastikan seluruh program kerja ormawa terlaksana sesuai standar mutu, tepat waktu, dan berorientasi pada kemanfaatan mahasiswa.',
    motto: 'Pengawasan yang konstruktif melahirkan eksekusi program kerja yang berkualitas unggul.'
  },
  {
    id: 'was-member-1',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Anggota Komisi Pengawasan',
    tier: 'pelaksana',
    category: 'pengawasan',
    unit: 'Komisi Pengawasan',
    isLead: false,
    badgeText: 'Anggota Komisi Pengawasan',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    watermark: 'AUDIT',
    cardGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1522075469751-3a6694fb2f61?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Melakukan pemantauan langsung di lapangan (on-site audit) pada hari pelaksanaan kegiatan ormawa.',
    tupoksi: [
      'Memantau pelaksanaan rundown acara lapangan agar sesuai dengan proposal.',
      'Menilai ketertiban protokol kepanitiaan dan kesiapan sarana kegiatan.',
      'Menyusun lembar observasi pengawasan langsung untuk bahan evaluasi DPM.'
    ],
    fokusInti: 'Mewujudkan pengawasan faktual di lapangan demi menjaga integritas pelaksanaan acara ormawa.',
    motto: 'Hadir langsung di lapangan memastikan laporan di atas kertas sesuai fakta realita.'
  },
  {
    id: 'was-member-2',
    name: 'Nama',
    nim: '-',
    prodi: 'Sistem Informasi',
    role: 'Anggota Komisi Pengawasan',
    tier: 'pelaksana',
    category: 'pengawasan',
    unit: 'Komisi Pengawasan',
    isLead: false,
    badgeText: 'Anggota Komisi Pengawasan',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    watermark: 'AUDIT',
    cardGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Mengawasi ketepatan waktu pengumpulan berkas LPJ dan scoring 5 pilar mutu di sistem AUDITMAWA.',
    tupoksi: [
      'Meminta dan memverifikasi tenggat waktu penyerahan LPJ pasca acara selesai.',
      'Membantu pengisian parameter audit: Kelengkapan Bukti, Ketepatan Waktu, dan Output Sasaran.',
      'Menyiapkan draft masukan tertulis untuk sidang komisi pengawasan.'
    ],
    fokusInti: 'Menjaga kedisiplinan pelaporan ormawa demi terciptanya budaya tertib hukum dan waktu.',
    motto: 'Menjaga kepatuhan aturan demi martabat dan profesionalisme lembaga kemahasiswaan.'
  },

  // ── LEVEL 3: KOMISI KOMINFO (SETARA) ─────────────────────────────────
  {
    id: 'kom-lead',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Kepala Komisi Kominfo',
    tier: 'pelaksana',
    category: 'kominfo',
    unit: 'Komisi Kominfo',
    isLead: true,
    badgeText: 'Kepala Komisi Kominfo',
    badgeColor: 'bg-blue-600 text-white border-blue-400/40',
    watermark: 'MEDIA',
    cardGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1501196354995-cbb51c65aaea?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Komisi Kominfo bertanggung jawab terhadap penyebaran informasi, komunikasi organisasi, dan publikasi kegiatan DPM.',
    tupoksi: [
      'Menyampaikan informasi kegiatan DPM kepada seluruh mahasiswa FASILKOM.',
      'Mengelola media komunikasi resmi dan publikasi organisasi (Portal Web AUDITMAWA & Instagram).',
      'Mendokumentasikan seluruh kegiatan, sidang pleno, hearing, dan audiensi resmi DPM.',
      'Membantu menyebarkan hasil rapat atau informasi penting yang dapat dipublikasikan ke publik.',
      'Menjaga komunikasi dan relasi positif yang terbuka antara DPM dan mahasiswa.'
    ],
    fokusInti: 'Komisi Kominfo memastikan informasi mengenai DPM dapat tersampaikan dengan jelas, tepat, dan mudah diakses mahasiswa.',
    motto: 'Komunikasi yang transparan adalah jembatan kepercayaan antara mahasiswa dan parlemen.'
  },
  {
    id: 'kom-member-1',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Anggota Komisi Kominfo',
    tier: 'pelaksana',
    category: 'kominfo',
    unit: 'Komisi Kominfo',
    isLead: false,
    badgeText: 'Anggota Komisi Kominfo',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    watermark: 'CREATIVE',
    cardGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1492562080023-ab3db95bfbce?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Bertanggung jawab atas desain grafis, visual infografis audit, dan identitas media publikasi DPM.',
    tupoksi: [
      'Merancang visual infografis pengumuman dan hasil audit kinerja ormawa.',
      'Mendokumentasikan foto dan video agenda persidangan serta kegiatan DPM.',
      'Menjaga estetika dan konsistensi branding media sosial resmi DPM FASILKOM.'
    ],
    fokusInti: 'Mengemas informasi resmi parlemen menjadi sajian visual yang informatif, menarik, dan mudah dipahami.',
    motto: 'Visual yang jelas menyampaikan pesan regulasi yang tegas dan bersahabat.'
  },
  {
    id: 'kom-member-2',
    name: 'Nama',
    nim: '-',
    prodi: 'Sistem Informasi',
    role: 'Anggota Komisi Kominfo',
    tier: 'pelaksana',
    category: 'kominfo',
    unit: 'Komisi Kominfo',
    isLead: false,
    badgeText: 'Anggota Komisi Kominfo',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    watermark: 'MEDIA',
    cardGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Bertanggung jawab atas pengelolaan konten tulisan, siaran pers, dan interaksi komunikasi mahasiswa.',
    tupoksi: [
      'Menulis naskah rilis pers, rekap berita sidang, dan pengumuman resmi kelembagaan.',
      'Mengelola saluran tanya jawab dan direct message mahasiswa di media sosial DPM.',
      'Menjembatani alur komunikasi aspirasi yang masuk melalui kanal media online.'
    ],
    fokusInti: 'Memastikan pesan dan siaran informasi parlemen mahasiswa tersampaikan secara humanis dan responsif.',
    motto: 'Menghadirkan informasi parlemen yang ramah, cepat, dan mudah diakses oleh mahasiswa.'
  },

  // ── LEVEL 3: KOMISI ADVOKASI (SETARA) ────────────────────────────────
  {
    id: 'adv-lead',
    name: 'Nama',
    nim: '-',
    prodi: 'Sistem Informasi',
    role: 'Kepala Komisi Advokasi',
    tier: 'pelaksana',
    category: 'advokasi',
    unit: 'Komisi Advokasi',
    isLead: true,
    badgeText: 'Kepala Komisi Advokasi',
    badgeColor: 'bg-blue-600 text-white border-blue-400/40',
    watermark: 'ADVOCACY',
    cardGradient: 'from-blue-950 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Komisi Advokasi fokus pada penerimaan, penyaluran, dan pengawalan aspirasi mahasiswa.',
    tupoksi: [
      'Menampung keluhan, kritik, dan saran konstruktif dari seluruh mahasiswa FASILKOM.',
      'Mengidentifikasi permasalahan yang dihadapi mahasiswa terkait akademik, fasilitas, dan biaya kuliah.',
      'Menyalurkan aspirasi secara formal kepada pihak yang berwenang (Dekanat / Rektorat).',
      'Mengawal tindak lanjut penyelesaian aspirasi mahasiswa hingga tuntas.',
      'Memberikan informasi transparan kepada mahasiswa mengenai proses penanganan aspirasi.'
    ],
    fokusInti: 'Komisi Advokasi menjadi penghubung antara mahasiswa dan pihak terkait dalam memperjuangkan aspirasi serta kepentingan mahasiswa.',
    motto: 'Suara mahasiswa adalah amanah tertinggi yang pantang untuk dikompromikan.'
  },
  {
    id: 'adv-member-1',
    name: 'Nama',
    nim: '-',
    prodi: 'Teknik Informatika',
    role: 'Anggota Komisi Advokasi',
    tier: 'pelaksana',
    category: 'advokasi',
    unit: 'Komisi Advokasi',
    isLead: false,
    badgeText: 'Anggota Komisi Advokasi',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    watermark: 'ADVOCACY',
    cardGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Membantu penjaringan aspirasi mahasiswa melalui survei berkala dan kotak aduan aspirasi online.',
    tupoksi: [
      'Menampung keluhan dan saran mahasiswa melalui formulir aspirasi.',
      'Merekap dan mengelompokkan data aduan fasilitas lab, wifi, dan ruang kelas.',
      'Membantu menyusun laporan berkala penyerapan aspirasi mahasiswa.'
    ],
    fokusInti: 'Mengumpulkan data empiris permasalahan mahasiswa agar advokasi memiliki bukti kuat di hadapan dekanat.',
    motto: 'Setiap aspirasi mahasiswa layak didengar dan diperjuangkan hingga tuntas.'
  },
  {
    id: 'adv-member-2',
    name: 'Nama',
    nim: '-',
    prodi: 'Sistem Informasi',
    role: 'Anggota Komisi Advokasi',
    tier: 'pelaksana',
    category: 'advokasi',
    unit: 'Komisi Advokasi',
    isLead: false,
    badgeText: 'Anggota Komisi Advokasi',
    badgeColor: 'bg-blue-50 text-blue-700 border-blue-200/80',
    watermark: 'ADVOCACY',
    cardGradient: 'from-blue-950/80 via-slate-900 to-slate-950',
    image: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?auto=format&fit=crop&w=600&q=80',
    email: '',
    linkedin: '',
    instagram: '',
    deskripsi: 'Mendampingi audiensi hearing dekanat dan memantau status penyelesaian aduan mahasiswa.',
    tupoksi: [
      'Menyiapkan dokumen bahan audiensi advokasi dengan pimpinan dekanat.',
      'Mengawal tindak lanjut perbaikan sarana perkuliahan yang telah disepakati.',
      'Menyusun infografis update status penyelesaian masalah mahasiswa.'
    ],
    fokusInti: 'Memastikan tidak ada aduan mahasiswa yang terhenti tanpa kejelasan progres dan solusi konkret.',
    motto: 'Advokasi berbasis data dan fakta menghasilkan solusi yang bermartabat.'
  }
];

// ── MATRIKS WEWENANG & TUPOKSI RESMI KOMISI DPM ───────────────────────
export const structuralRoleMatrix = [
  {
    id: 'pimpinan',
    role: 'Ketua & Wakil Ketua Umum',
    group: 'bph',
    tag: 'Pimpinan Utama',
    deskripsi: 'Memegang mandat kepemimpinan tertinggi dan menetapkan arah kebijakan strategis dewan.',
    responsibilities: [
      'Menetapkan garis besar haluan kebijakan parlemen DPM FASILKOM UMB.',
      'Mengesahkan SK hasil audit LPJ, alokasi pagu anggaran, dan produk regulasi.',
      'Memimpin koordinasi kelembagaan dengan Dekanat, Rektorat, dan Ormawa.'
    ]
  },
  {
    id: 'sekretaris',
    role: 'Sekretaris DPM',
    group: 'bph',
    tag: 'Kesekretariatan',
    deskripsi: 'Mengelola tata administrasi umum, legalitas korespondensi, dan kearsipan kelembagaan.',
    responsibilities: [
      'Mengelola persuratan resmi, undangan kelembagaan, dan berkas legalitas.',
      'Menyusun notulen resmi sidang pleno, rapat koordinasi, dan agenda dewan.',
      'Mengarsipkan seluruh dokumen organisasi dan laporan pertanggungjawaban.'
    ]
  },
  {
    id: 'bendahara',
    role: 'Bendahara DPM',
    group: 'bph',
    tag: 'Kebendaharaan',
    deskripsi: 'Mengelola arus kas operasional, rencana anggaran, dan akuntabilitas belanja internal.',
    responsibilities: [
      'Mengelola pencatatan arus kas operasional dan pembukuan internal dewan.',
      'Menyusun rencana anggaran belanja dan laporan keuangan berkala.',
      'Mengarsipkan bukti transaksi, faktur belanja, dan dokumentasi audit kas.'
    ]
  },
  {
    id: 'pengawasan',
    role: 'Komisi Pengawasan',
    group: 'komisi',
    tag: 'Monitoring Proker',
    deskripsi: 'Memantau dan mengevaluasi kepatuhan pelaksanaan program kerja ormawa Fasilkom.',
    responsibilities: [
      'Memantau pelaksanaan program kerja seluruh ormawa (BEM, HIMTI, HIMSISFO).',
      'Mengevaluasi kepatuhan kegiatan ormawa terhadap standar dan linimasa.',
      'Memeriksa laporan pertanggungjawaban (LPJ) dan menerbitkan rekomendasi perbaikan.'
    ]
  },
  {
    id: 'keuangan',
    role: 'Komisi Keuangan',
    group: 'komisi',
    tag: 'Penganggaran & Audit',
    deskripsi: 'Mengkaji kelayakan anggaran kegiatan dan mengaudit akuntabilitas finansial ormawa.',
    responsibilities: [
      'Menelaah dan mengkaji Rencana Anggaran Biaya (RAB) kegiatan ormawa.',
      'Mengawasi realisasi penyerapan dana kampus dan kesesuaian kwitansi belanja.',
      'Memverifikasi bukti transaksi pada laporan pertanggungjawaban keuangan.'
    ]
  },
  {
    id: 'advokasi',
    role: 'Komisi Advokasi',
    group: 'komisi',
    tag: 'Aspirasi Mahasiswa',
    deskripsi: 'Menjaring keluhan, mengkaji isu kampus, dan mengawal aspirasi mahasiswa ke pihak dekanat.',
    responsibilities: [
      'Menampung kritik, saran, dan keluhan mahasiswa FASILKOM UMB.',
      'Mengkaji isu strategis fasilitas, akademik, dan pelayanan perkuliahan.',
      'Mengawal audiensi bersama pihak Dekanat hingga tercapai solusi nyata.'
    ]
  },
  {
    id: 'kominfo',
    role: 'Komisi Kominfo',
    group: 'komisi',
    tag: 'Komunikasi & Publikasi',
    deskripsi: 'Mengelola publikasi kebijakan, media komunikasi, dan penyebaran informasi parlemen.',
    responsibilities: [
      'Mempublikasikan informasi kegiatan, hasil rapat, dan kebijakan DPM.',
      'Mengelola media sosial, portal resmi, dan kanal komunikasi mahasiswa.',
      'Mendokumentasikan arsip media dan dokumentasi kegiatan secara sistematis.'
    ]
  }
];
