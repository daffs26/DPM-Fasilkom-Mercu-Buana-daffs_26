import writeXlsxFile from 'write-excel-file/browser';

// Desain Styling Baku DPM FASILKOM UMB
const BORDER_STYLE = {
  borderColor: '#CBD5E1',
  borderStyle: 'thin'
};

const HEADER_NAVY = {
  fontWeight: 'bold',
  color: '#FFFFFF',
  backgroundColor: '#0F172A', // Hitam Navy Resmi DPM
  align: 'center',
  alignVertical: 'center',
  ...BORDER_STYLE
};

const HEADER_SLATE = {
  fontWeight: 'bold',
  color: '#0F172A',
  backgroundColor: '#F1F5F9',
  align: 'center',
  alignVertical: 'center',
  ...BORDER_STYLE
};

const CELL_TEXT = {
  type: String,
  alignVertical: 'center',
  ...BORDER_STYLE
};

const CELL_CENTER = {
  type: String,
  align: 'center',
  alignVertical: 'center',
  ...BORDER_STYLE
};

const CELL_CURRENCY = {
  type: Number,
  format: 'Rp #,##0',
  align: 'right',
  alignVertical: 'center',
  ...BORDER_STYLE
};

const CELL_PERCENT = {
  type: Number,
  format: '0%',
  align: 'center',
  alignVertical: 'center',
  ...BORDER_STYLE
};

/**
 * Ekspor data keuangan & program kerja ke file Excel resmi (.xlsx)
 * dengan kop surat, multi-sheet, format Rupiah, dan lembar pengesahan.
 */
export async function exportFinancialWorkbook({
  totalPaguFakultas = 0,
  totalRabTerencana = 0,
  totalRealisasiAktual = 0,
  sisaSaldoFakultas = 0,
  persentaseSerapanFakultas = 0,
  ormawas = [],
  prokers = [],
  transactions = [],
  selectedFilter = 'all',
  currentUserName = 'Muhammad Daffa Aulia Syahrul'
}) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  const filterText = selectedFilter === 'all' 
    ? 'Seluruh Lembaga Ormawa Fasilkom' 
    : selectedFilter.toUpperCase();

  // =========================================================================
  // SHEET 1: ALOKASI & REKAPITULASI ANGGARAN
  // =========================================================================
  const sheet1 = [
    // Header Kop Surat DPM FASILKOM UMB
    [
      { value: 'DEWAN PERWAKILAN MAHASISWA FAKULTAS ILMU KOMPUTER (DPM FASILKOM)', fontWeight: 'bold', fontSize: 13, color: '#0F172A', span: 8 }
    ],
    [
      { value: 'UNIVERSITAS MERCU BUANA — LAPORAN REKAPITULASI PENGAWASAN ANGGARAN & LPJ ORMAWA', fontWeight: 'bold', fontSize: 11, color: '#475569', span: 8 }
    ],
    [
      { value: `Tanggal Dokumen: ${today}  |  Tahun Akademik: 2026/2027  |  Entitas: ${filterText}`, fontSize: 9, color: '#64748B', span: 8 }
    ],
    [], // Blank

    // Seksi I: Ringkasan Eksekutif Keuangan Fakultas
    [
      { value: 'I. RINGKASAN EKSEKUTIF KEUANGAN FAKULTAS', fontWeight: 'bold', fontSize: 11, color: '#0F172A', span: 4 }
    ],
    [
      { value: 'Indikator Keuangan', ...HEADER_SLATE, align: 'left', span: 2 },
      null,
      { value: 'Jumlah / Nominal (Rp)', ...HEADER_SLATE, align: 'right' },
      { value: 'Keterangan Evaluasi DPM', ...HEADER_SLATE, align: 'left' }
    ],
    [
      { value: 'Total Pagu Alokasi Anggaran Fakultas', ...CELL_TEXT, fontWeight: 'bold', span: 2 },
      null,
      { value: totalPaguFakultas, ...CELL_CURRENCY, fontWeight: 'bold' },
      { value: 'Batas pagu alokasi dana resmi dari Dekanat untuk 4 ormawa', ...CELL_TEXT }
    ],
    [
      { value: 'Total Usulan Anggaran (RAB Proker)', ...CELL_TEXT, span: 2 },
      null,
      { value: totalRabTerencana, ...CELL_CURRENCY },
      { value: 'Akumulasi RAB usulan dari seluruh proposal proker', ...CELL_TEXT }
    ],
    [
      { value: 'Total Realisasi Kas Terserap (Cair)', ...CELL_TEXT, fontWeight: 'bold', span: 2 },
      null,
      { value: totalRealisasiAktual, ...CELL_CURRENCY, fontWeight: 'bold', color: '#B45309' },
      { value: `Tingkat serapan kas fakultas berjalan sebesar ${persentaseSerapanFakultas}%`, ...CELL_TEXT }
    ],
    [
      { value: 'Sisa Saldo Kas Fakultas', ...CELL_TEXT, fontWeight: 'bold', span: 2 },
      null,
      { value: sisaSaldoFakultas, ...CELL_CURRENCY, fontWeight: 'bold', color: '#047857' },
      { value: 'Saldo kas tersedia aman untuk alokasi proker berikutnya', ...CELL_TEXT }
    ],
    [], // Blank

    // Seksi II: Tabel Rekapitulasi Alokasi & Serapan per Ormawa
    [
      { value: 'II. REKAPITULASI ALOKASI & SERAPAN ANGGARAN PER LEMBAGA ORMAWA', fontWeight: 'bold', fontSize: 11, color: '#0F172A', span: 8 }
    ],
    [
      { value: 'No', ...HEADER_NAVY },
      { value: 'Nama Lembaga Ormawa', ...HEADER_NAVY, align: 'left' },
      { value: 'Tingkat Organisasi', ...HEADER_NAVY },
      { value: 'Pagu Anggaran (Rp)', ...HEADER_NAVY },
      { value: 'Realisasi Kas (Rp)', ...HEADER_NAVY },
      { value: 'Sisa Saldo (Rp)', ...HEADER_NAVY },
      { value: 'Serapan (%)', ...HEADER_NAVY },
      { value: 'Status Evaluasi', ...HEADER_NAVY }
    ]
  ];

  // Baris per Ormawa
  ormawas.forEach((o, idx) => {
    const pagu = o.paguAnggaran || 0;
    const serapan = o.serapanAnggaran || 0;
    const sisa = Math.max(0, pagu - serapan);
    const pct = pagu > 0 ? (serapan / pagu) : 0;
    const isOptimal = pct >= 0.8;
    const isNormal = pct > 0 && pct < 0.8;

    sheet1.push([
      { value: idx + 1, type: Number, ...CELL_CENTER },
      { value: o.name, ...CELL_TEXT, fontWeight: 'bold' },
      { value: o.type || 'Ormawa', ...CELL_CENTER },
      { value: pagu, ...CELL_CURRENCY },
      { value: serapan, ...CELL_CURRENCY, fontWeight: 'bold', color: '#B45309' },
      { value: sisa, ...CELL_CURRENCY, fontWeight: 'bold', color: '#047857' },
      { value: pct, ...CELL_PERCENT, fontWeight: 'bold' },
      { 
        value: isOptimal ? 'Terserap Optimal' : isNormal ? 'Berjalan Normal' : 'Belum Serapan', 
        ...CELL_CENTER, 
        color: isOptimal ? '#047857' : isNormal ? '#B45309' : '#64748B' 
      }
    ]);
  });

  // Baris Total Sheet 1
  sheet1.push([
    { value: 'TOTAL KESELURUHAN FAKULTAS', fontWeight: 'bold', align: 'center', backgroundColor: '#F1F5F9', span: 3, ...BORDER_STYLE },
    null,
    null,
    { value: totalPaguFakultas, ...CELL_CURRENCY, fontWeight: 'bold', backgroundColor: '#F1F5F9' },
    { value: totalRealisasiAktual, ...CELL_CURRENCY, fontWeight: 'bold', backgroundColor: '#F1F5F9', color: '#B45309' },
    { value: sisaSaldoFakultas, ...CELL_CURRENCY, fontWeight: 'bold', backgroundColor: '#F1F5F9', color: '#047857' },
    { value: totalPaguFakultas > 0 ? (totalRealisasiAktual / totalPaguFakultas) : 0, ...CELL_PERCENT, fontWeight: 'bold', backgroundColor: '#F1F5F9' },
    { value: 'Laporan Sah DPM', fontWeight: 'bold', align: 'center', backgroundColor: '#F1F5F9', color: '#047857', ...BORDER_STYLE }
  ]);

  // Lembar Pengesahan Tanda Tangan
  sheet1.push(
    [], [],
    [
      { value: 'Perwakilan Lembaga Eksekutif,', align: 'center', span: 2 },
      null,
      { value: 'Komisi Pengawas Anggaran,', align: 'center', span: 3 },
      null,
      null,
      { value: 'Mengetahui & Mengesahkan,', align: 'center', span: 3 }
    ],
    [
      { value: 'BEM / HIMPUNAN', fontWeight: 'bold', align: 'center', span: 2 },
      null,
      { value: 'DPM FASILKOM UMB', fontWeight: 'bold', align: 'center', span: 3 },
      null,
      null,
      { value: 'KETUA DPM FASILKOM UMB', fontWeight: 'bold', align: 'center', span: 3 }
    ],
    [], [], [], // Signature height space
    [
      { value: 'Rafi Pratama', fontWeight: 'bold', align: 'center', span: 2 },
      null,
      { value: 'Komisi Pengawas Anggaran', fontWeight: 'bold', align: 'center', span: 3 },
      null,
      null,
      { value: currentUserName || 'Muhammad Daffa Aulia Syahrul', fontWeight: 'bold', align: 'center', span: 3 }
    ],
    [
      { value: 'Ketua BEM FASILKOM UMB', fontSize: 9, color: '#64748B', align: 'center', span: 2 },
      null,
      { value: 'DPM FASILKOM UMB', fontSize: 9, color: '#64748B', align: 'center', span: 3 },
      null,
      null,
      { value: 'Ketua DPM FASILKOM UMB', fontSize: 9, color: '#64748B', align: 'center', span: 3 }
    ]
  );

  const columnsSheet1 = [
    { width: 6 },  // No
    { width: 34 }, // Ormawa
    { width: 22 }, // Tingkat
    { width: 22 }, // Pagu
    { width: 22 }, // Serapan
    { width: 22 }, // Sisa Saldo
    { width: 14 }, // %
    { width: 20 }  // Status
  ];

  // =========================================================================
  // SHEET 2: MATRIKS PROGRAM KERJA & REALISASI ANGGARAN
  // =========================================================================
  const sheet2 = [
    [
      { value: 'MATRIKS PROGRAM KERJA & REALISASI ANGGARAN MAHASISWA', fontWeight: 'bold', fontSize: 13, color: '#0F172A', span: 12 }
    ],
    [
      { value: `Dewan Perwakilan Mahasiswa Fasilkom UMB  |  Tanggal Cetak: ${today}`, fontSize: 9, color: '#64748B', span: 12 }
    ],
    [],
    [
      { value: 'No', ...HEADER_NAVY },
      { value: 'Nama Program Kerja', ...HEADER_NAVY, align: 'left' },
      { value: 'Ormawa', ...HEADER_NAVY },
      { value: 'Divisi', ...HEADER_NAVY },
      { value: 'Jadwal Acara', ...HEADER_NAVY },
      { value: 'PJ / Ketua Pelaksana', ...HEADER_NAVY },
      { value: 'Target Peserta', ...HEADER_NAVY },
      { value: 'Realisasi Peserta', ...HEADER_NAVY },
      { value: 'RAB Usulan (Rp)', ...HEADER_NAVY },
      { value: 'Kas Dicairkan (Rp)', ...HEADER_NAVY },
      { value: 'Selisih / Sisa (Rp)', ...HEADER_NAVY },
      { value: 'Status LPJ / Audit', ...HEADER_NAVY }
    ]
  ];

  if (prokers.length === 0) {
    sheet2.push([
      { value: 'Belum ada program kerja yang terdaftar di sistem', align: 'center', color: '#64748B', span: 12, ...BORDER_STYLE }
    ]);
  } else {
    prokers.forEach((p, idx) => {
      const ormawaName = ormawas.find(o => o.id === p.ormawaId)?.shortName || p.ormawaId?.toUpperCase();
      const rab = p.rab || 0;
      const realisasi = p.realisasiDana || 0;
      const selisih = Math.max(0, rab - realisasi);
      const lpjStatus = p.status === 'completed'
        ? `Lulus (${p.lpj?.auditScore || 90}/100)`
        : p.status === 'proposal_approved'
        ? 'Proposal ACC'
        : p.status === 'proposal_revisi'
        ? 'Perlu Revisi'
        : 'Menunggu Review';

      sheet2.push([
        { value: idx + 1, type: Number, ...CELL_CENTER },
        { value: p.title, ...CELL_TEXT, fontWeight: 'bold' },
        { value: ormawaName, ...CELL_CENTER, fontWeight: 'bold' },
        { value: p.divisi || 'Umum', ...CELL_CENTER },
        { value: p.startDate || '-', ...CELL_CENTER },
        { value: p.pic || '-', ...CELL_TEXT },
        { value: p.targetPeserta || 0, type: Number, ...CELL_CENTER },
        { value: p.realisasiPeserta || 0, type: Number, ...CELL_CENTER },
        { value: rab, ...CELL_CURRENCY },
        { value: realisasi, ...CELL_CURRENCY, fontWeight: 'bold', color: '#B45309' },
        { value: selisih, ...CELL_CURRENCY, fontWeight: 'bold', color: '#047857' },
        { value: lpjStatus, ...CELL_CENTER }
      ]);
    });

    // Baris Total Sheet 2
    sheet2.push([
      { value: 'TOTAL PROGRAM KERJA', fontWeight: 'bold', align: 'center', backgroundColor: '#F1F5F9', span: 8, ...BORDER_STYLE },
      null, null, null, null, null, null, null,
      { value: totalRabTerencana, ...CELL_CURRENCY, fontWeight: 'bold', backgroundColor: '#F1F5F9' },
      { value: totalRealisasiAktual, ...CELL_CURRENCY, fontWeight: 'bold', backgroundColor: '#F1F5F9', color: '#B45309' },
      { value: Math.max(0, totalRabTerencana - totalRealisasiAktual), ...CELL_CURRENCY, fontWeight: 'bold', backgroundColor: '#F1F5F9', color: '#047857' },
      { value: 'Akumulasi Sah', align: 'center', fontWeight: 'bold', backgroundColor: '#F1F5F9', ...BORDER_STYLE }
    ]);
  }

  const columnsSheet2 = [
    { width: 6 },  // No
    { width: 34 }, // Title
    { width: 12 }, // Ormawa
    { width: 18 }, // Divisi
    { width: 15 }, // Jadwal
    { width: 22 }, // PIC
    { width: 14 }, // Target
    { width: 14 }, // Realisasi
    { width: 20 }, // RAB
    { width: 20 }, // Kas Cair
    { width: 20 }, // Selisih
    { width: 18 }  // Status LPJ
  ];

  // =========================================================================
  // SHEET 3: BUKU KAS & RIWAYAT TRANSAKSI PENCAIRAN
  // =========================================================================
  const sheet3 = [
    [
      { value: 'BUKU KAS & CATATAN TRANSAKSI PENCAIRAN DANA MAHASISWA', fontWeight: 'bold', fontSize: 13, color: '#0F172A', span: 7 }
    ],
    [
      { value: `Dewan Perwakilan Mahasiswa Fasilkom UMB  |  Tanggal Cetak: ${today}`, fontSize: 9, color: '#64748B', span: 7 }
    ],
    [],
    [
      { value: 'No', ...HEADER_NAVY },
      { value: 'Tanggal Pencairan', ...HEADER_NAVY },
      { value: 'Ormawa', ...HEADER_NAVY },
      { value: 'Kategori Transaksi', ...HEADER_NAVY },
      { value: 'Nominal Pencairan (Rp)', ...HEADER_NAVY },
      { value: 'Keterangan / Keperluan Dana', ...HEADER_NAVY, align: 'left' },
      { value: 'Status Bukti Lampiran', ...HEADER_NAVY }
    ]
  ];

  if (transactions.length === 0) {
    sheet3.push([
      { value: 'Belum ada transaksi pencairan dana kas yang tercatat', align: 'center', color: '#64748B', span: 7, ...BORDER_STYLE }
    ]);
  } else {
    let totalKasTransaksi = 0;
    transactions.forEach((t, idx) => {
      const ormawaName = ormawas.find(o => o.id === t.ormawaId)?.shortName || t.ormawaId?.toUpperCase();
      const amount = Number(t.amount) || 0;
      totalKasTransaksi += amount;

      sheet3.push([
        { value: idx + 1, type: Number, ...CELL_CENTER },
        { value: t.date || '-', ...CELL_CENTER },
        { value: ormawaName, ...CELL_CENTER, fontWeight: 'bold' },
        { value: t.type || 'Pencairan', ...CELL_CENTER },
        { value: amount, ...CELL_CURRENCY, fontWeight: 'bold', color: '#0F172A' },
        { value: t.note || '-', ...CELL_TEXT },
        { value: t.receiptUrl ? 'Ada Bukti Nota Sah' : 'Tanpa Nota', ...CELL_CENTER, color: t.receiptUrl ? '#047857' : '#64748B' }
      ]);
    });

    // Baris Total Sheet 3
    sheet3.push([
      { value: 'TOTAL KAS CAIR TERCATAT', fontWeight: 'bold', align: 'center', backgroundColor: '#F1F5F9', span: 4, ...BORDER_STYLE },
      null, null, null,
      { value: totalKasTransaksi, ...CELL_CURRENCY, fontWeight: 'bold', backgroundColor: '#F1F5F9', color: '#B45309' },
      { value: 'Total Buku Kas Pengawasan', span: 2, align: 'center', fontWeight: 'bold', backgroundColor: '#F1F5F9', ...BORDER_STYLE }
    ]);
  }

  const columnsSheet3 = [
    { width: 6 },  // No
    { width: 16 }, // Tanggal
    { width: 14 }, // Ormawa
    { width: 22 }, // Kategori
    { width: 22 }, // Nominal
    { width: 38 }, // Keterangan
    { width: 20 }  // Status Bukti
  ];

  // Eksekusi Download File .xlsx Multi-Sheet via writeXlsxFile
  const safeDate = new Date().toISOString().split('T')[0];
  const fileName = `Rekap_Anggaran_DPM_Fasilkom_${safeDate}.xlsx`;

  await writeXlsxFile([
    {
      name: 'Ringkasan & Alokasi',
      data: sheet1,
      columns: columnsSheet1
    },
    {
      name: 'Matriks Program Kerja',
      data: sheet2,
      columns: columnsSheet2
    },
    {
      name: 'Buku Kas & Transaksi',
      data: sheet3,
      columns: columnsSheet3
    }
  ]).toFile(fileName);

  return fileName;
}

/**
 * Ekspor data ke format CSV yang dirapihkan dengan UTF-8 BOM
 */
export function exportFormattedCSV({
  totalPaguFakultas = 0,
  totalRabTerencana = 0,
  totalRealisasiAktual = 0,
  sisaSaldoFakultas = 0,
  persentaseSerapanFakultas = 0,
  ormawas = [],
  prokers = [],
  transactions = [],
  selectedFilter = 'all'
}) {
  const today = new Date().toLocaleDateString('id-ID', {
    day: 'numeric',
    month: 'long',
    year: 'numeric'
  });

  let csv = '\uFEFF'; // UTF-8 BOM

  csv += '========================================================================================\r\n';
  csv += 'DEWAN PERWAKILAN MAHASISWA FAKULTAS ILMU KOMPUTER (DPM FASILKOM) UNIVERSITAS MERCU BUANA\r\n';
  csv += 'LAPORAN REKAPITULASI PENGAWASAN ANGGARAN & LPJ SEMESTER\r\n';
  csv += `Tanggal Ekspor : ${today}\r\n`;
  csv += `Tahun Akademik : 2026/2027\r\n`;
  csv += `Cakupan Data   : ${selectedFilter === 'all' ? 'Seluruh Ormawa Fasilkom' : selectedFilter.toUpperCase()}\r\n`;
  csv += '========================================================================================\r\n\r\n';

  // 1. Ringkasan Eksekutif Keuangan
  csv += '=== I. RINGKASAN EKSEKUTIF KEUANGAN FAKULTAS ===\r\n';
  csv += 'Parameter Keuangan;Nominal (Rp);Keterangan / Catatan\r\n';
  csv += `Total Pagu Anggaran Fakultas;${totalPaguFakultas};Batas alokasi dana resmi 4 lembaga ormawa\r\n`;
  csv += `Total Usulan RAB Proker;${totalRabTerencana};Akumulasi estimasi kebutuhan anggaran dari proposal\r\n`;
  csv += `Total Realisasi Kas Cair;${totalRealisasiAktual};Dana kas yang telah dicairkan (${persentaseSerapanFakultas}%)\r\n`;
  csv += `Sisa Saldo Kas Fakultas;${sisaSaldoFakultas};Dana kas yang masih tersedia\r\n`;
  csv += `Rasio Serapan Kas;${persentaseSerapanFakultas}%;Tingkat efektivitas serapan anggaran\r\n\r\n`;

  // 2. Rekap Alokasi & Serapan per Ormawa
  csv += '=== II. REKAPITULASI ALOKASI & SERAPAN ANGGARAN PER ORMAWA ===\r\n';
  csv += 'No;Nama Lembaga Ormawa;Tingkat Organisasi;Pagu Anggaran (Rp);Realisasi Kas (Rp);Sisa Saldo (Rp);Persentase Serapan (%);Status Kepatuhan\r\n';
  ormawas.forEach((o, idx) => {
    const pagu = o.paguAnggaran || 0;
    const serapan = o.serapanAnggaran || 0;
    const sisa = Math.max(0, pagu - serapan);
    const pct = pagu > 0 ? Math.round((serapan / pagu) * 100) : 0;
    const status = pct >= 80 ? 'Terserap Optimal' : pct > 0 ? 'Berjalan Normal' : 'Belum Serapan';
    csv += `${idx + 1};"${o.name}";"${o.type}";${pagu};${serapan};${sisa};${pct}%;"${status}"\r\n`;
  });
  csv += `Total;Total Seluruh Ormawa Terpilih;-;${totalPaguFakultas};${totalRealisasiAktual};${sisaSaldoFakultas};${persentaseSerapanFakultas}%;Laporan Sah\r\n\r\n`;

  // 3. Matriks Program Kerja Mahasiswa
  csv += '=== III. MATRIKS PROGRAM KERJA & REALISASI ANGGARAN ===\r\n';
  csv += 'No;Nama Program Kerja;Lembaga Penyelenggara;Divisi;Tanggal Mulai;Tanggal Selesai;Ketua Pelaksana / PJ;Target Peserta;Realisasi Peserta;RAB Diajukan (Rp);Kas Dicairkan (Rp);Efisiensi / Sisa (Rp);Status Proker;Status Audit LPJ\r\n';
  if (prokers.length === 0) {
    csv += '-;Belum ada program kerja terdaftar;-;-;-;-;-;-;-;0;0;0;-;-\r\n';
  } else {
    prokers.forEach((p, idx) => {
      const ormawaName = ormawas.find(o => o.id === p.ormawaId)?.name || p.ormawaId?.toUpperCase();
      const rab = p.rab || 0;
      const realisasi = p.realisasiDana || 0;
      const selisih = rab - realisasi;
      const auditInfo = p.lpj?.auditScore ? `Lulus Audit (${p.lpj.auditScore}/100)` : p.lpj?.fileName ? 'LPJ Terlampir' : 'Belum LPJ';
      csv += `${idx + 1};"${p.title.replace(/"/g, '""')}";"${ormawaName}";"${p.divisi || '-'}";${p.startDate};${p.endDate || p.startDate};"${p.pic || '-'}";${p.targetPeserta || 0};${p.realisasiPeserta || 0};${rab};${realisasi};${Math.max(0, selisih)};"${p.status}";"${auditInfo}"\r\n`;
    });
  }
  csv += '\r\n';

  // 4. Riwayat Buku Kas & Pencairan
  csv += '=== IV. BUKU KAS & RIWAYAT TRANSAKSI PENCAIRAN ===\r\n';
  csv += 'No;Tanggal Pencairan;Lembaga Ormawa;Kategori Transaksi;Nominal Dicairkan (Rp);Keterangan Pengeluaran;Lampiran Bukti\r\n';
  if (transactions.length === 0) {
    csv += '-;Belum ada transaksi pencairan dana kas;-;-;0;-;-\r\n';
  } else {
    transactions.forEach((t, idx) => {
      const ormawaName = ormawas.find(o => o.id === t.ormawaId)?.name || t.ormawaId?.toUpperCase();
      const bukti = t.receiptUrl ? 'Ada Bukti Nota' : 'Tanpa Lampiran';
      csv += `${idx + 1};${t.date};"${ormawaName}";"${t.type}";${t.amount || 0};"${(t.note || '-').replace(/"/g, '""')}";"${bukti}"\r\n`;
    });
  }

  const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' });
  const url = URL.createObjectURL(blob);
  const link = document.createElement('a');
  const safeDate = new Date().toISOString().split('T')[0];
  link.setAttribute('href', url);
  link.setAttribute('download', `Rekap_Anggaran_DPM_Fasilkom_${safeDate}.csv`);
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
  URL.revokeObjectURL(url);
}
