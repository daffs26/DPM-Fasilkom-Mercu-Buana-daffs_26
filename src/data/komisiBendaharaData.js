// Data preset realistis pembukuan keuangan DPM berbasis Program Kerja (Proker)
export const DEFAULT_PROKER_FINANCE = [
  {
    id: 'proker-sidang-umum',
    title: 'Sidang Umum Mahasiswa Fasilkom UMB',
    period: '18 - 20 September 2026',
    pic: 'Siti Nurhaliza (Bendahara DPM) & Presidium',
    rabTarget: 5500000,
    status: 'Selesai LPJ',
    statusVariant: 'success',
    description: 'Forum musyawarah tertinggi mahasiswa Fasilkom untuk evaluasi kinerja kelembagaan, amandemen tata tertib, dan suksesi kepemimpinan.',
    transactions: [
      {
        id: 'tx-su-in-1',
        date: '05 Sep 2026',
        type: 'pemasukan',
        category: 'Dana Kemahasiswaan Fakultas',
        nominal: 3500000,
        receiptNumber: 'KW-FAK-081',
        description: 'Pencairan termin 1 dari alokasi pagu Dekanat Fasilkom untuk operasional sidang akbar.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-in-2',
        date: '12 Sep 2026',
        type: 'pemasukan',
        category: 'Sponsorship Mitra',
        nominal: 1200000,
        receiptNumber: 'KW-SPN-014',
        description: 'Kemitraan paket konsumsi makan siang dan air mineral botol 15 karton.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-in-3',
        date: '15 Sep 2026',
        type: 'pemasukan',
        category: 'Iuran Pimpinan Parlemen',
        nominal: 800000,
        receiptNumber: 'KW-INT-029',
        description: 'Iuran sukarela pimpinan dan fungsionaris dewan untuk cadangan tak terduga.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-1',
        date: '17 Sep 2026',
        type: 'pengeluaran',
        category: 'Konsumsi & Logistik Makanan',
        nominal: 2450000,
        receiptNumber: 'NOTA-KTR-441',
        description: 'Konsumsi nasi kotak & snack box peserta sidang pleno, presidium, dan saksi 3 hari.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-2',
        date: '16 Sep 2026',
        type: 'pengeluaran',
        category: 'Percetakan & Palu Sidang',
        nominal: 850000,
        receiptNumber: 'NOTA-PRN-092',
        description: 'Pengadaan 2 set palu kayu sidang berlogo dewan dan cetak 40 buku draf konsideran.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-3',
        date: '17 Sep 2026',
        type: 'pengeluaran',
        category: 'Sewa Sound & Mic Delegate',
        nominal: 700000,
        receiptNumber: 'NOTA-SND-115',
        description: 'Sewa 4 unit mic delegate meja presidium dan sound system pendukung aula kampus.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-4',
        date: '18 Sep 2026',
        type: 'pengeluaran',
        category: 'Publikasi & Banner Panggung',
        nominal: 350000,
        receiptNumber: 'NOTA-ADV-302',
        description: 'Cetak backdrop panggung aula 6x3 meter dan standing banner selamat datang.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-su-out-5',
        date: '18 Sep 2026',
        type: 'pengeluaran',
        category: 'ATK & Kesekretariatan',
        nominal: 220000,
        receiptNumber: 'NOTA-ATK-208',
        description: 'Map berkas hasil ketetapan sidang pleno, kertas HVS SPJ, dan tinta stempel garuda.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  },
  {
    id: 'proker-raker-pleno',
    title: 'Rapat Kerja Parlemen & Pleno Pengawasan Triwulan I',
    period: '02 - 03 Oktober 2026',
    pic: 'Siti Nurhaliza (Bendahara DPM)',
    rabTarget: 2000000,
    status: 'Selesai LPJ',
    statusVariant: 'success',
    description: 'Rapat koordinasi komisi DPM untuk penetapan matriks audit ormawa, evaluasi kinerja bulanan, dan tata tertib dewan.',
    transactions: [
      {
        id: 'tx-rk-in-1',
        date: '28 Sep 2026',
        type: 'pemasukan',
        category: 'Kas Operasional Parlemen',
        nominal: 1500000,
        receiptNumber: 'KW-KAS-012',
        description: 'Alokasi kas internal dewan untuk operasional sidang komisi pengawasan.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rk-in-2',
        date: '30 Sep 2026',
        type: 'pemasukan',
        category: 'Subsidi Kesekretariatan Dekanat',
        nominal: 500000,
        receiptNumber: 'KW-FAK-095',
        description: 'Bantuan operasional berkas evaluasi triwulan kemahasiswaan fakultas.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rk-out-1',
        date: '02 Okt 2026',
        type: 'pengeluaran',
        category: 'Konsumsi Rapat Pleno',
        nominal: 650000,
        receiptNumber: 'NOTA-SNK-103',
        description: 'Snack box pembuka, kopi, dan makan siang anggota dewan 4 komisi (24 orang).',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rk-out-2',
        date: '01 Okt 2026',
        type: 'pengeluaran',
        category: 'Penggandaan Berkas Matriks',
        nominal: 275000,
        receiptNumber: 'NOTA-FCP-554',
        description: 'Fotokopi dan jilid spiral matriks audit proker BEM, HIMTI, HIMSISFO, dan DPM.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rk-out-3',
        date: '02 Okt 2026',
        type: 'pengeluaran',
        category: 'ATK & Flipchart Rapat',
        nominal: 180000,
        receiptNumber: 'NOTA-ATK-771',
        description: 'Buku ekspedisi sidang, spidol whiteboard, dan sticky notes brainstorming komisi.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  },
  {
    id: 'proker-hearing-audiensi',
    title: 'Hearing & Audiensi Aspirasi Terbuka Mahasiswa Fasilkom',
    period: '24 Oktober 2026 (Mendatang)',
    pic: 'Ahmad Fauzan (Ketua Komisi IV) & Siti Nurhaliza',
    rabTarget: 1800000,
    status: 'Sedang Berjalan',
    statusVariant: 'info',
    description: 'Forum audiensi tatap muka terbuka antara mahasiswa Fasilkom dengan Dekanat & Pimpinan Ormawa guna menyampaikan advokasi fasilitas dan kurikulum.',
    transactions: [
      {
        id: 'tx-hr-in-1',
        date: '03 Okt 2026',
        type: 'pemasukan',
        category: 'Dana Kemahasiswaan Fakultas',
        nominal: 1000000,
        receiptNumber: 'KW-FAK-112',
        description: 'Pencairan termin awal untuk persiapan logistik, sound, dan publikasi hearing akbar.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-hr-in-2',
        date: '05 Okt 2026',
        type: 'pemasukan',
        category: 'Sponsorship Media Partner',
        nominal: 500000,
        receiptNumber: 'KW-SPN-089',
        description: 'Kerjasama sponsorship platform edukasi teknologi pendukung acara.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-hr-out-1',
        date: '04 Okt 2026',
        type: 'pengeluaran',
        category: 'Poster & Standing Banner Mading',
        nominal: 240000,
        receiptNumber: 'NOTA-PRT-819',
        description: 'Cetak poster fisik A3 dan standing banner promosi hearing di mading Menara Mercu Buana.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-hr-out-2',
        date: '05 Okt 2026',
        type: 'pengeluaran',
        category: 'Kotak & Lembar Suara Aspirasi',
        nominal: 120000,
        receiptNumber: 'NOTA-ATK-902',
        description: 'Pengadaan 3 drop box aspirasi fisik di lobby fakultas dan kertas form advokasi.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  },
  {
    id: 'proker-lklm',
    title: 'Latihan Kepemimpinan Legislatif Mahasiswa (LKLM) 2026',
    period: '14 - 15 November 2026',
    pic: 'Siti Nurhaliza (Bendahara DPM) & Panitia',
    rabTarget: 4000000,
    status: 'Perencanaan',
    statusVariant: 'warning',
    description: 'Kaderisasi dan pelatihan teknik persidangan, legal drafting perundang-undangan mahasiswa, serta audit bagi calon fungsionaris dewan.',
    transactions: [
      {
        id: 'tx-lk-in-1',
        date: '06 Okt 2026',
        type: 'pemasukan',
        category: 'Alokasi Kas Awal Parlemen',
        nominal: 1000000,
        receiptNumber: 'KW-INT-099',
        description: 'Alokasi kas dewan untuk uang muka sewa tempat dan modul materi kepemimpinan.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-lk-out-1',
        date: '06 Okt 2026',
        type: 'pengeluaran',
        category: 'Uang Muka Ruang Auditorium',
        nominal: 500000,
        receiptNumber: 'NOTA-DP-001',
        description: 'Uang muka pemesanan ruang auditorium kampus dan sound system pelatihan legislatif.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  },
  {
    id: 'proker-kas-rutin',
    title: 'Kas Operasional Rutin & Kesekretariatan (Non-Proker)',
    period: 'Periode Berjalan 2026/2027',
    pic: 'Siti Nurhaliza (Bendahara DPM)',
    rabTarget: 2500000,
    status: 'Rutin Berjalan',
    statusVariant: 'neutral',
    description: 'Pos kas harian internal untuk iuran wajib anggota dewan, belanja ATK kantor parlemen, dan konsumsi rapat koordinasi mingguan.',
    transactions: [
      {
        id: 'tx-rt-in-1',
        date: '04 Okt 2026',
        type: 'pemasukan',
        category: 'Iuran Wajib Anggota DPM',
        nominal: 1200000,
        receiptNumber: 'KW-IUR-001',
        description: 'Iuran wajib kas internal pengurus parlemen DPM periode ganjil (24 anggota @Rp 50.000).',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rt-out-1',
        date: '28 Sep 2026',
        type: 'pengeluaran',
        category: 'ATK Kesekretariatan Parlemen',
        nominal: 185000,
        receiptNumber: 'NOTA-ATK-019',
        description: 'Pembelian map arsip parlemen, tinta stempel resmi dewan, dan kertas berkas SPJ.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      },
      {
        id: 'tx-rt-out-2',
        date: '02 Okt 2026',
        type: 'pengeluaran',
        category: 'Konsumsi Rapat Mingguan',
        nominal: 150000,
        receiptNumber: 'NOTA-MKN-088',
        description: 'Konsumsi snack rapat koordinasi pimpinan dan kesekretariatan dewan.',
        recordedBy: 'Siti Nurhaliza (Bendahara)'
      }
    ]
  }
];
