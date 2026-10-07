// Data Awal AUDITMAWA DPM FASILKOM UNIVERSITAS MERCU BUANA
// Sesuai Instruksi: Tanpa Data Dummy Angka/Skor/Proker, Bersih untuk Digunakan Secara Nyata
// Serta Menggunakan Terminologi Formal Legislatif Kampus

export const INITIAL_ORMAWA = [
  {
    id: 'dpm',
    name: 'DPM UMB',
    fullName: 'Dewan Perwakilan Mahasiswa Fakultas Ilmu Komputer',
    shortName: 'DPM',
    type: 'Lembaga Legislatif Fasilkom',
    logo: '/logos/logo-dpm.png',
    pdhColorName: 'Hitam (DPM)',
    paguAnggaran: 0,
    serapanAnggaran: 0,
    ketua: 'Nama Ketua',
    instagram: 'dpmfasilkom.umb',
    color: {
      primary: '#090D16', // Hitam Resmi DPM
      accent: '#D97706',
      badgeBg: 'bg-slate-900 text-white border-slate-700',
      tagBg: 'bg-slate-900 text-white',
      borderActive: 'border-slate-900',
      ring: 'ring-slate-900',
      border: 'border-slate-800',
      bgLight: 'bg-slate-100 text-slate-900',
    }
  },
  {
    id: 'bem',
    name: 'BEM FASILKOM UMB',
    fullName: 'Badan Eksekutif Mahasiswa Fakultas Ilmu Komputer',
    shortName: 'BEM',
    type: 'Lembaga Eksekutif Fasilkom',
    logo: '/logos/logo-bem.png',
    pdhColorName: 'Biru Muda (BEM)',
    paguAnggaran: 0,
    serapanAnggaran: 0,
    ketua: 'Nama Ketua',
    instagram: 'bemfasilkom.umb',
    color: {
      primary: '#0284C7', // Biru Muda Resmi BEM
      accent: '#38BDF8',
      badgeBg: 'bg-sky-100 text-sky-800 border-sky-200',
      tagBg: 'bg-sky-500 text-white',
      borderActive: 'border-sky-500',
      ring: 'ring-sky-400',
      border: 'border-sky-300',
      bgLight: 'bg-sky-50 text-sky-800',
    }
  },
  {
    id: 'himti',
    name: 'HIMTI UMB',
    fullName: 'Himpunan Mahasiswa Teknik Informatika',
    shortName: 'HIMTI',
    type: 'Lembaga Eksekutif Teknik Informatika',
    logo: '/logos/logo-himti.png',
    pdhColorName: 'Biru Dongker (HiMTI)',
    paguAnggaran: 0,
    serapanAnggaran: 0,
    ketua: 'Nama Ketua',
    instagram: 'himti.umb',
    color: {
      primary: '#172554', // Biru Dongker Resmi HiMTI
      accent: '#1E3A8A',
      badgeBg: 'bg-[#172554] text-blue-100 border-blue-900',
      tagBg: 'bg-[#172554] text-white',
      borderActive: 'border-blue-950',
      ring: 'ring-blue-900',
      border: 'border-blue-900',
      bgLight: 'bg-blue-50 text-blue-950',
    }
  },
  {
    id: 'himsisfo',
    name: 'HIMSISFO UMB',
    fullName: 'Himpunan Mahasiswa Sistem Informasi',
    shortName: 'HIMSISFO',
    type: 'Lembaga Eksekutif Sistem Informasi',
    logo: '/logos/logo-himsisfo.png',
    pdhColorName: 'Krem (HIMSISFO)',
    paguAnggaran: 0,
    serapanAnggaran: 0,
    ketua: 'Nama Ketua',
    instagram: 'himsisfo_umb',
    color: {
      primary: '#9A7B56', // Krem PDH Himsisfo
      accent: '#C7B198',
      badgeBg: 'bg-[#FBF9F5] text-[#785E43] border-[#E8DEC8]',
      tagBg: 'bg-[#9A7B56] text-white',
      borderActive: 'border-[#9A7B56]',
      ring: 'ring-[#9A7B56]',
      border: 'border-[#E8DEC8]',
      bgLight: 'bg-[#FBF9F5] text-[#785E43]',
    }
  }
];

// Data Kosong Bersih Tanpa Dummy
export const INITIAL_PROKER = [];

export const INITIAL_SP = [];

export const INITIAL_ACTIVITY_LOGS = [];

export const INITIAL_BUDGET_TRANSACTIONS = [];

export const INITIAL_USERS = [
  {
    id: 'user-dpm-ketua',
    name: 'Muhammad Daffa Aulia Syahrul',
    nim: '41822010001',
    ormawaId: 'dpm',
    role: 'ketua',
    username: 'ketua',
    password: '123',
    status: 'approved',
    lastLogin: '27 September 2026'
  },
  {
    id: 'user-dpm-admin',
    name: 'Muhammad Daffa Aulia Syahrul (Admin)',
    nim: '41822010000',
    ormawaId: 'dpm',
    role: 'ketua',
    username: 'admin',
    password: '123',
    status: 'approved',
    lastLogin: '27 September 2026'
  },
  {
    id: 'user-dpm-wakil',
    name: 'Ahmad Raihan',
    nim: '41822010002',
    ormawaId: 'dpm',
    role: 'wakil',
    username: 'wakil',
    password: '123',
    status: 'approved',
    lastLogin: '28 September 2026'
  },
  {
    id: 'user-dpm-sekretaris',
    name: 'Nabila Azzahra',
    nim: '41822010003',
    ormawaId: 'dpm',
    role: 'sekretaris',
    username: 'sekretaris',
    password: '123',
    status: 'approved',
    lastLogin: '01 Oktober 2026'
  },
  {
    id: 'user-dpm-bendahara',
    name: 'Siti Nurhaliza',
    nim: '41822010004',
    ormawaId: 'dpm',
    role: 'bendahara',
    username: 'bendahara',
    password: '123',
    status: 'approved',
    lastLogin: '05 Oktober 2026'
  },
  {
    id: 'user-dpm-pengawasan',
    name: 'Bintang Perkasa',
    nim: '41822010005',
    ormawaId: 'dpm',
    role: 'komisi_pengawasan',
    username: 'pengawasan',
    password: '123',
    status: 'approved',
    lastLogin: '03 Oktober 2026'
  },
  {
    id: 'user-dpm-keuangan',
    name: 'Fikri Haikal',
    nim: '41822010006',
    ormawaId: 'dpm',
    role: 'komisi_keuangan',
    username: 'keuangan',
    password: '123',
    status: 'approved',
    lastLogin: '04 Oktober 2026'
  },
  {
    id: 'user-dpm-kominfo',
    name: 'Salma Putri',
    nim: '41822010007',
    ormawaId: 'dpm',
    role: 'komisi_kominfo',
    username: 'kominfo',
    password: '123',
    status: 'approved',
    lastLogin: '06 Oktober 2026'
  },
  {
    id: 'user-dpm-advokasi',
    name: 'Dimas Wicaksono',
    nim: '41822010008',
    ormawaId: 'dpm',
    role: 'komisi_advokasi',
    username: 'advokasi',
    password: '123',
    status: 'approved',
    lastLogin: '02 Oktober 2026'
  }
];
