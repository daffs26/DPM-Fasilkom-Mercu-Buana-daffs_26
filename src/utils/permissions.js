import { useState, useEffect } from 'react';

/**
 * Wewenang & Hak Akses Berdasarkan Komisi DPM FASILKOM & Civitas Akademik
 * Sesuai Regulasi Tata Kelola Parlemen Kampus AUDITMAWA DPM FASILKOM UMB
 */

export const DPM_ROLES = {
  KETUA: 'ketua',
  WAKIL: 'wakil',
  SEKRETARIS: 'sekretaris',
  BENDAHARA: 'bendahara',
  KOMISI_PENGAWASAN: 'komisi_pengawasan',
  KOMISI_KEUANGAN: 'komisi_keuangan',
  KOMISI_KOMINFO: 'komisi_kominfo',
  KOMISI_ADVOKASI: 'komisi_advokasi',
  CIVITAS: 'civitas',
};

export const DPM_ROLE_CONFIG = {
  ketua: {
    label: 'Ketua DPM',
    komisi: 'Pimpinan Parlemen',
    description: 'Akses penuh seluruh fitur & modifikasi proker, anggaran, serta wewenang cetak & terbitkan surat peringatan (SP).',
    badgeClass: 'bg-slate-900 text-white border-slate-700',
    shortBadge: 'bg-slate-900 text-amber-400',
    canDeleteProker: true,
  },
  wakil: {
    label: 'Wakil Ketua DPM',
    komisi: 'Pimpinan Parlemen',
    description: 'Akses penuh seluruh fitur & modifikasi proker, anggaran, serta wewenang cetak & terbitkan surat peringatan (SP).',
    badgeClass: 'bg-slate-800 text-white border-slate-700',
    shortBadge: 'bg-slate-800 text-amber-400',
    canDeleteProker: true,
  },
  sekretaris: {
    label: 'Sekretaris DPM',
    komisi: 'Kesekretariatan',
    description: 'Akses seluruh fitur administrasi surat/proker (tidak memiliki wewenang cetak SP atau kelola anggaran).',
    badgeClass: 'bg-emerald-950 text-emerald-200 border-emerald-800',
    shortBadge: 'bg-emerald-100 text-emerald-800',
    canDeleteProker: false,
  },
  sekre: {
    label: 'Sekretaris DPM',
    komisi: 'Kesekretariatan',
    description: 'Akses seluruh fitur administrasi surat/proker (tidak memiliki wewenang cetak SP atau kelola anggaran).',
    badgeClass: 'bg-emerald-950 text-emerald-200 border-emerald-800',
    shortBadge: 'bg-emerald-100 text-emerald-800',
    canDeleteProker: false,
  },
  bendahara: {
    label: 'Bendahara DPM',
    komisi: 'Kebendaharaan Internal',
    description: 'Khusus mengelola keuangan & transaksi internal DPM.',
    badgeClass: 'bg-amber-950 text-amber-200 border-amber-800',
    shortBadge: 'bg-amber-100 text-amber-800',
    canDeleteProker: false,
  },
  komisi_pengawasan: {
    label: 'Komisi Pengawasan',
    komisi: 'Komisi I (Pengawasan)',
    description: 'Wewenang pengawasan proker, penambahan & audit LPJ proker (tidak dapat mencetak SP atau menghapus proker).',
    badgeClass: 'bg-blue-950 text-blue-200 border-blue-800',
    shortBadge: 'bg-blue-100 text-blue-800',
    canDeleteProker: false,
  },
  komisi_keuangan: {
    label: 'Komisi Keuangan',
    komisi: 'Komisi II (Anggaran)',
    description: 'Wewenang alokasi pagu anggaran dan transaksi keuangan seluruh ormawa.',
    badgeClass: 'bg-indigo-950 text-indigo-200 border-indigo-800',
    shortBadge: 'bg-indigo-100 text-indigo-800',
    canDeleteProker: false,
  },
  komisi_kominfo: {
    label: 'Komisi Kominfo',
    komisi: 'Komisi III (Kominfo & Media)',
    description: 'Pengelolaan publikasi & media partner (read-only untuk proker dan anggaran).',
    badgeClass: 'bg-purple-950 text-purple-200 border-purple-800',
    shortBadge: 'bg-purple-100 text-purple-800',
    canDeleteProker: false,
  },
  komisi_advokasi: {
    label: 'Komisi Advokasi',
    komisi: 'Komisi IV (Aspirasi & Advokasi)',
    description: 'Penjaringan aspirasi & advokasi kebijakan (read-only untuk proker dan anggaran).',
    badgeClass: 'bg-teal-950 text-teal-200 border-teal-800',
    shortBadge: 'bg-teal-100 text-teal-800',
    canDeleteProker: false,
  },
  civitas: {
    label: 'Civitas Akademik UMB',
    komisi: 'Akses Publik / Pelihat',
    description: 'Akses transparansi publik melihat proker, anggaran, kalender, dan kinerja ormawa.',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    shortBadge: 'bg-slate-100 text-slate-700',
    canDeleteProker: false,
  },
  guest: {
    label: 'Civitas Akademik UMB',
    komisi: 'Akses Publik / Pelihat',
    description: 'Akses transparansi publik melihat proker, anggaran, kalender, dan kinerja ormawa.',
    badgeClass: 'bg-slate-100 text-slate-800 border-slate-300',
    shortBadge: 'bg-slate-100 text-slate-700',
    canDeleteProker: false,
  }
};

/**
 * Mendapatkan konfigurasi role
 */
export function getRoleConfig(role) {
  const cleanRole = (role || '').toLowerCase().trim();
  return DPM_ROLE_CONFIG[cleanRole] || DPM_ROLE_CONFIG.civitas;
}

/**
 * 1. Modifikasi Proker:
 * Tambah proker, edit rundown, panitia, RAB, dokumentasi.
 * Wewenang: Ketua, Wakil, Sekretaris, Komisi Pengawasan.
 */
export function canModifyProker(role) {
  const r = (role || '').toLowerCase().trim();
  return ['ketua', 'wakil', 'sekretaris', 'sekre', 'komisi_pengawasan'].includes(r);
}

/**
 * 2. Hapus Proker:
 * HANYA Ketua & Wakil Ketua DPM.
 * Komisi Pengawasan dan role lainnya TIDAK BISA menghapus proker.
 */
export function canDeleteProker(role) {
  const r = (role || '').toLowerCase().trim();
  return ['ketua', 'wakil'].includes(r);
}

/**
 * 3. Audit Proker & Nilai LPJ:
 * Wewenang: Ketua, Wakil, Sekretaris, Komisi Pengawasan.
 */
export function canAuditProker(role) {
  const r = (role || '').toLowerCase().trim();
  return ['ketua', 'wakil', 'sekretaris', 'sekre', 'komisi_pengawasan'].includes(r);
}

/**
 * 4. Atur Anggaran Semua Ormawa (Set pagu, alokasi, transaksi ormawa):
 * Wewenang: Ketua, Wakil, Komisi Keuangan.
 * Sekretaris & Bendahara tidak bisa atur anggaran ormawa lain.
 */
export function canManageOrmawaBudget(role) {
  const r = (role || '').toLowerCase().trim();
  return ['ketua', 'wakil', 'komisi_keuangan'].includes(r);
}

/**
 * 5. Atur Anggaran Internal DPM (Tambah transaksi DPM internal):
 * Wewenang: Ketua, Wakil, Komisi Keuangan, DAN Bendahara DPM.
 */
export function canManageInternalBudget(role) {
  const r = (role || '').toLowerCase().trim();
  return ['ketua', 'wakil', 'komisi_keuangan', 'bendahara'].includes(r);
}

/**
 * 6. Kelola Transaksi Anggaran Berdasarkan Target Ormawa:
 */
export function canAddTransaction(role, targetOrmawaId) {
  if (targetOrmawaId === 'dpm') {
    return canManageInternalBudget(role);
  }
  return canManageOrmawaBudget(role);
}

/**
 * 7. Cetak Surat Peringatan (SP):
 * Wewenang Khusus: HANYA Ketua dan Wakil Ketua DPM.
 */
export function canPrintSP(role, ormawaId) {
  const r = (role || '').toLowerCase().trim();
  const isDpm = !ormawaId || ormawaId === 'dpm';
  return isDpm && ['ketua', 'wakil'].includes(r);
}

/**
 * 8. Terbitkan & Selesaikan Surat Peringatan (SP):
 * Wewenang Khusus: HANYA Ketua dan Wakil Ketua DPM.
 */
export function canManageSP(role, ormawaId) {
  const r = (role || '').toLowerCase().trim();
  const isDpm = !ormawaId || ormawaId === 'dpm';
  return isDpm && ['ketua', 'wakil'].includes(r);
}

/**
 * 8. Kelola Template Dokumen Legislatif:
 * Wewenang: Ketua, Wakil, Sekretaris.
 */
export function canManageTemplates(role) {
  const r = (role || '').toLowerCase().trim();
  return ['ketua', 'wakil', 'sekretaris', 'sekre'].includes(r);
}

/**
 * 9. Cek apakah role bersifat Viewer / Pelihat (Civitas / Tamu):
 */
export function isViewerOnly(role) {
  const r = (role || '').toLowerCase().trim();
  return !r || r === 'civitas' || r === 'guest';
}

/**
 * 10. Cek apakah role merupakan Pimpinan Tertinggi DPM (Ketua / Wakil):
 */
export function isLeaderDPM(role) {
  const r = (role || '').toLowerCase().trim();
  return ['ketua', 'wakil'].includes(r);
}

/**
 * 11. Deteksi apakah sedang membuka web di perangkat HP / Mobile:
 */
export function isMobileDevice() {
  if (typeof window === 'undefined') return false;
  return window.innerWidth < 1024 || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
}

/**
 * 12. Hook reaktif deteksi layar mobile / HP:
 */
export function useIsMobile(breakpoint = 1024) {
  const [isMobile, setIsMobile] = useState(() => isMobileDevice());

  useEffect(() => {
    const handleResize = () => {
      const match = window.innerWidth < breakpoint || /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent);
      setIsMobile(match);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, [breakpoint]);

  return isMobile;
}

/**
 * 13. Mendapatkan path navigasi direct khusus per-komisi di HP:
 * KECUALI Ketua dan Wakil Ketua Umum DPM (tetap ke Dashboard).
 */
export function getMobileDirectPathForRole(role) {
  const r = (role || '').toLowerCase().trim();
  // Pengecualian mutlak untuk Ketua dan Wakil Ketua Umum
  if (['ketua', 'wakil'].includes(r)) {
    return null;
  }
  
  switch (r) {
    case 'komisi_kominfo':
    case 'kominfo':
      return '/komisi/kominfo';
    case 'komisi_keuangan':
    case 'keuangan':
      return '/komisi/keuangan';
    case 'komisi_advokasi':
    case 'advokasi':
      return '/komisi/advokasi';
    case 'bendahara':
    case 'komisi_bendahara':
      return '/komisi/bendahara';
    case 'komisi_pengawasan':
    case 'pengawasan':
      return '/audit';
    default:
      return null;
  }
}
