/**
 * Shared utility formatters and status badge resolvers
 * for AUDITMAWA DPM FASILKOM UMB
 */

export function formatRupiah(num) {
  if (num === null || num === undefined || isNaN(num)) return 'Rp 0';
  return new Intl.NumberFormat('id-ID', {
    style: 'currency',
    currency: 'IDR',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0
  }).format(num);
}

export function formatNumber(num) {
  if (num === null || num === undefined || isNaN(num)) return '0';
  return new Intl.NumberFormat('id-ID').format(num);
}

export function formatDateIndo(dateStr, options = { day: 'numeric', month: 'long', year: 'numeric' }) {
  if (!dateStr) return '-';
  const d = new Date(dateStr);
  if (isNaN(d.getTime())) return dateStr;
  return d.toLocaleDateString('id-ID', options);
}

export function formatShortDate(dateStr) {
  return formatDateIndo(dateStr, { day: 'numeric', month: 'short', year: 'numeric' });
}

export function getOrmawaMetadata(ormawaId) {
  const map = {
    dpm: {
      name: 'DPM FASILKOM',
      shortName: 'DPM',
      type: 'Badan Legislatif Mahasiswa',
      category: 'Legislatif',
      color: 'blue',
      badgeClass: 'bg-blue-50 text-blue-700 border-blue-200',
      tagClass: 'bg-blue-100 text-blue-700'
    },
    bem: {
      name: 'BEM FASILKOM',
      shortName: 'BEM',
      type: 'Badan Eksekutif Mahasiswa',
      category: 'Eksekutif',
      color: 'emerald',
      badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200',
      tagClass: 'bg-emerald-100 text-emerald-700'
    },
    himti: {
      name: 'HIMTI FASILKOM',
      shortName: 'HIMTI',
      type: 'Himpunan Teknik Informatika',
      category: 'Himpunan Jurusan',
      color: 'purple',
      badgeClass: 'bg-purple-50 text-purple-700 border-purple-200',
      tagClass: 'bg-purple-100 text-purple-700'
    },
    himsisfo: {
      name: 'HIMSISFO FASILKOM',
      shortName: 'HIMSISFO',
      type: 'Himpunan Sistem Informasi',
      category: 'Himpunan Jurusan',
      color: 'amber',
      badgeClass: 'bg-amber-50 text-amber-700 border-amber-200',
      tagClass: 'bg-amber-100 text-amber-700'
    }
  };
  return map[ormawaId?.toLowerCase()] || {
    name: (ormawaId || 'Ormawa').toUpperCase(),
    shortName: (ormawaId || 'Ormawa').toUpperCase(),
    type: 'Organisasi Mahasiswa',
    category: 'Organisasi',
    color: 'slate',
    badgeClass: 'bg-slate-50 text-slate-700 border-slate-200',
    tagClass: 'bg-slate-100 text-slate-700'
  };
}

export function getStatusBadge(status) {
  switch (status) {
    case 'completed':
      return { label: 'Selesai & LPJ Disetujui', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'lpj_pending':
      return { label: 'LPJ Sedang Direview', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'lpj_overdue':
      return { label: 'LPJ Terlambat / Overdue', color: 'bg-red-50 text-red-700 border-red-200' };
    case 'proposal_pending':
      return { label: 'Proposal Menunggu Review', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'proposal_approved':
      return { label: 'Proposal Disetujui', color: 'bg-teal-50 text-teal-700 border-teal-200' };
    case 'in_progress':
      return { label: 'Sedang Berlangsung', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'draft':
    default:
      return { label: 'Draf Proker', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
}

export function getTransactionTypeBadge(type) {
  switch (type) {
    case 'termin1':
      return { label: 'Dana Awal (70%)', color: 'bg-blue-50 text-blue-700 border-blue-200' };
    case 'termin2':
      return { label: 'Pelunasan (30%)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'operasional':
      return { label: 'Operasional Kas', color: 'bg-purple-50 text-purple-700 border-purple-200' };
    case 'konsumsi_logistik':
      return { label: 'Logistik & Konsumsi', color: 'bg-indigo-50 text-indigo-700 border-indigo-200' };
    case 'sponsorship':
      return { label: 'Dana Sponsor', color: 'bg-amber-50 text-amber-700 border-amber-200' };
    case 'pendaftaran':
      return { label: 'Uang Pendaftaran', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'iuran':
      return { label: 'Kas Masuk / Iuran', color: 'bg-teal-50 text-teal-700 border-teal-200' };
    case 'subsidi':
      return { label: 'Subsidi / Hibah', color: 'bg-cyan-50 text-cyan-700 border-cyan-200' };
    case 'pemasukan_lain':
      return { label: 'Pemasukan Lain', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    case 'lainnya':
    default:
      return { label: 'Pengeluaran Lain', color: 'bg-slate-100 text-slate-700 border-slate-200' };
  }
}
