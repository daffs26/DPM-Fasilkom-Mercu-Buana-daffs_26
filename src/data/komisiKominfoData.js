// Data preset realistis operasional media dan publikasi Komisi Kominfo DPM
export const DEFAULT_CONTENT_SCHEDULES = [
  {
    id: 'konten-1',
    title: 'Info Parlemen: Hasil Sidang Paripurna I DPM',
    platform: 'Instagram Feed & Story',
    publishDate: '08 Okt 2026',
    status: 'Proses Review',
    pic: 'Salma Putri (Kominfo)',
    copywriting: 'Transparansi penuh pengesahan agenda kerja parlemen mahasiswa semester ganjil.',
    tags: ['#ParlemenFasilkom', '#DPMUMB']
  },
  {
    id: 'konten-2',
    title: 'Publikasi Hasil Audit Serapan Pagu Ormawa Triwulan I',
    platform: 'Instagram Carousel & Website',
    publishDate: '12 Okt 2026',
    status: 'Drafting',
    pic: 'Tim Media Kominfo',
    copywriting: 'Infografis ringkas capaian akuntabilitas anggaran BEM, HIMTI, dan HIMSISFO.',
    tags: ['#AuditMawa', '#TransparansiKampus']
  },
  {
    id: 'konten-3',
    title: 'Hari Kesaktian Pancasila & Nilai Integritas Mahasiswa',
    platform: 'Instagram Story & Poster',
    publishDate: '01 Okt 2026',
    status: 'Tayang',
    pic: 'Desain Grafis Kominfo',
    copywriting: 'Peringatan momentum persatuan dan integritas mahasiswa teknologi masa kini.',
    tags: ['#HariBesarNasional']
  }
];

export const DEFAULT_DESIGN_TASKS = [
  {
    id: 'ds-1',
    title: 'Desain Feed Infografis Alur Pengajuan Anggaran',
    format: 'Figma',
    designer: 'Salma Putri',
    progress: 85,
    status: 'Revisi Minor',
    deadline: '09 Okt 2026',
    linkFigma: 'https://figma.com/file/dpm-media-hub'
  },
  {
    id: 'ds-2',
    title: 'Banner Website & Thumbnail Artikel Audit LPJ',
    format: 'Adobe Photoshop',
    designer: 'Kreatif Kominfo',
    progress: 100,
    status: 'Selesai & ACC',
    deadline: '04 Okt 2026',
    linkFigma: 'https://figma.com/file/dpm-web-assets'
  },
  {
    id: 'ds-3',
    title: 'Template Instagram Story Notifikasi Surat Peringatan (SP)',
    format: 'Canva',
    designer: 'Tim Desain',
    progress: 40,
    status: 'Pengerjaan',
    deadline: '15 Okt 2026',
    linkFigma: 'https://canva.com/design/dpm-sp-story'
  }
];

export const DEFAULT_MEDIA_PARTNER_NOTES = [
  {
    id: 'mp-1',
    eventTitle: 'Seminar Nasional AI Innovation Summit (BEM)',
    eventDate: '03 Okt 2026',
    location: 'Auditorium Tower UMB',
    repsAttended: 'Salma Putri, Dimas (DPM)',
    role: 'Official Media Partner & Tim Peliput',
    coverageNote: 'Tim Kominfo DPM hadir tepat waktu pukul 08:30 WIB. Meliput live story pembukaan dekanat dan sesi keynote speaker. Bahan dokumentasi telah diarsipkan.',
    documentationLink: 'https://drive.google.com/drive/folders/dpm-liputan-bem-ai',
    verified: true,
    mediaFiles: [
      {
        id: 'mf-1',
        name: 'dokumentasi-pembukaan-dekanat.jpg',
        sizeStr: '2.4 MB',
        sizeBytes: 2.4 * 1024 * 1024,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=800&auto=format&fit=crop&q=80'
      },
      {
        id: 'mf-2',
        name: 'highlight-sesi-keynote.jpg',
        sizeStr: '1.8 MB',
        sizeBytes: 1.8 * 1024 * 1024,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80'
      }
    ]
  },
  {
    id: 'mp-2',
    eventTitle: 'Tech Workshop Cyber Security Fundamental (HIMTI)',
    eventDate: '27 Sep 2026',
    location: 'Lab Komputer 402 Kampus Meruya',
    repsAttended: 'Tim Dokumentasi Kominfo DPM',
    role: 'Media Partner & Publikasi Silang',
    coverageNote: 'Menayangkan 2x story feed sebelum acara dan rekap feed dokumentasi pasca acara. Kehadiran fisik terkonfirmasi di lembar absensi panitia pelaksana.',
    documentationLink: 'https://drive.google.com/drive/folders/dpm-liputan-himti-cyber',
    verified: true,
    mediaFiles: [
      {
        id: 'mf-3',
        name: 'suasana-workshop-lab402.jpg',
        sizeStr: '3.1 MB',
        sizeBytes: 3.1 * 1024 * 1024,
        type: 'image',
        url: 'https://images.unsplash.com/photo-1531482615713-2afd69097998?w=800&auto=format&fit=crop&q=80'
      }
    ]
  }
];
