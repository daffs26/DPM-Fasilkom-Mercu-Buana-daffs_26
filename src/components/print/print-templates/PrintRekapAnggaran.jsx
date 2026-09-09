import React from 'react';

export default function PrintRekapAnggaran({ documentData }) {
  return (
    <div className="mt-4 sm:mt-6 space-y-5 text-xs leading-relaxed">
      <div className="text-center my-3 sm:my-4">
        <h3 className="font-extrabold text-xs sm:text-sm uppercase tracking-wider underline text-slate-900">
          LAPORAN REKAPITULASI PENGAWASAN ANGGARAN &amp; LPJ ORMAWA
        </h3>
        <p className="text-[10px] sm:text-[11px] font-mono mt-1 text-slate-700 font-bold">
          Nomor: REKAP.ANGGARAN/DPM-FASILKOM/UMB/{new Date().getFullYear()}
        </p>
      </div>

      {/* Meta Dokumen */}
      <div className="p-3 bg-slate-50 border border-slate-200 rounded-xl grid grid-cols-1 sm:grid-cols-2 gap-2 text-[11px]">
        <div>
          <p>Tanggal Laporan: <strong>{documentData.date}</strong></p>
          <p>Tahun Akademik: <strong>2026/2027</strong></p>
        </div>
        <div className="text-left sm:text-right">
          <p>Sifat: <strong>DOKUMEN LPJ &amp; AKUNTABILITAS RESMI</strong></p>
          <p>Cakupan Entitas: <strong>{documentData.filter?.toUpperCase() === 'ALL' ? 'SELURUH ORMAWA FASILKOM' : documentData.filter?.toUpperCase()}</strong></p>
        </div>
      </div>

      {/* Seksi 1: 4 Indikator Finansial Utama */}
      <div>
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2">
          I. Ringkasan Eksekutif Keuangan Fakultas
        </h4>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-center">
          <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
            <span className="text-[10px] text-slate-600 block uppercase font-bold">Total Pagu Alokasi</span>
            <span className="font-black text-xs sm:text-sm text-slate-900 block mt-0.5">
              Rp {(documentData.totalPaguFakultas || 0).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
            <span className="text-[10px] text-slate-600 block uppercase font-bold">Total RAB Proker</span>
            <span className="font-black text-xs sm:text-sm text-blue-900 block mt-0.5">
              Rp {(documentData.totalRabTerencana || 0).toLocaleString('id-ID')}
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
            <span className="text-[10px] text-slate-600 block uppercase font-bold">Total Realisasi Kas</span>
            <span className="font-black text-xs sm:text-sm text-amber-900 block mt-0.5">
              Rp {(documentData.totalRealisasiAktual || 0).toLocaleString('id-ID')}
            </span>
            <span className="text-[9px] text-amber-700 font-bold block">
              Serapan: {documentData.persentaseSerapanFakultas || 0}%
            </span>
          </div>
          <div className="p-2.5 bg-slate-50 border border-slate-300 rounded-xl">
            <span className="text-[10px] text-slate-600 block uppercase font-bold">Sisa Saldo Kas</span>
            <span className="font-black text-xs sm:text-sm text-emerald-900 block mt-0.5">
              Rp {(documentData.sisaSaldoFakultas || 0).toLocaleString('id-ID')}
            </span>
          </div>
        </div>
      </div>

      {/* Seksi 2: Tabel Rekapitulasi Alokasi & Serapan per Ormawa */}
      <div>
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2">
          II. Rekapitulasi Alokasi &amp; Serapan Kas per Ormawa
        </h4>
        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full border-collapse text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="px-2.5 py-1.5 text-center w-8 border-r border-slate-300">No</th>
                <th className="px-3 py-1.5 text-left border-r border-slate-300">Nama Organisasi Mahasiswa</th>
                <th className="px-3 py-1.5 text-right border-r border-slate-300">Pagu Anggaran</th>
                <th className="px-3 py-1.5 text-right border-r border-slate-300">Realisasi Kas</th>
                <th className="px-3 py-1.5 text-right border-r border-slate-300">Sisa Saldo</th>
                <th className="px-2 py-1.5 text-center border-r border-slate-300 w-16">Serapan</th>
                <th className="px-2.5 py-1.5 text-center">Status</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(documentData.ormawas || []).map((o, idx) => {
                const pagu = o.paguAnggaran || 0;
                const serapan = o.serapanAnggaran || 0;
                const sisa = Math.max(0, pagu - serapan);
                const pct = pagu > 0 ? Math.round((serapan / pagu) * 100) : 0;
                return (
                  <tr key={`print-ormawa-${o.id}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-2.5 py-1.5 text-center border-r border-slate-300">{idx + 1}</td>
                    <td className="px-3 py-1.5 font-bold text-slate-900 border-r border-slate-300">
                      {o.name} <span className="text-[10px] text-slate-500 font-normal">({o.type})</span>
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono border-r border-slate-300">
                      Rp {pagu.toLocaleString('id-ID')}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono font-bold text-amber-900 border-r border-slate-300">
                      Rp {serapan.toLocaleString('id-ID')}
                    </td>
                    <td className="px-3 py-1.5 text-right font-mono font-bold text-emerald-900 border-r border-slate-300">
                      Rp {sisa.toLocaleString('id-ID')}
                    </td>
                    <td className="px-2 py-1.5 text-center font-bold border-r border-slate-300">{pct}%</td>
                    <td className="px-2.5 py-1.5 text-center font-semibold text-[10px]">
                      {pct >= 80 ? 'Terserap Optimal' : pct > 0 ? 'Berjalan Normal' : 'Belum Serapan'}
                    </td>
                  </tr>
                );
              })}
            </tbody>
            <tfoot>
              <tr className="bg-slate-100 font-black border-t-2 border-slate-300 text-slate-900">
                <td colSpan={2} className="px-3 py-2 text-center border-r border-slate-300">TOTAL FAKULTAS</td>
                <td className="px-3 py-2 text-right font-mono border-r border-slate-300">
                  Rp {(documentData.totalPaguFakultas || 0).toLocaleString('id-ID')}
                </td>
                <td className="px-3 py-2 text-right font-mono border-r border-slate-300 text-amber-900">
                  Rp {(documentData.totalRealisasiAktual || 0).toLocaleString('id-ID')}
                </td>
                <td className="px-3 py-2 text-right font-mono border-r border-slate-300 text-emerald-900">
                  Rp {(documentData.sisaSaldoFakultas || 0).toLocaleString('id-ID')}
                </td>
                <td className="px-2 py-2 text-center border-r border-slate-300">{documentData.persentaseSerapanFakultas || 0}%</td>
                <td className="px-2.5 py-2 text-center text-[10px]">Laporan Sah</td>
              </tr>
            </tfoot>
          </table>
        </div>
      </div>

      {/* Seksi 3: Matriks Anggaran Program Kerja */}
      <div>
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2">
          III. Matriks Anggaran Program Kerja Mahasiswa
        </h4>
        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full border-collapse text-[10px] sm:text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="px-2 py-1.5 text-center w-8 border-r border-slate-300">No</th>
                <th className="px-2.5 py-1.5 text-left border-r border-slate-300">Program Kerja</th>
                <th className="px-2 py-1.5 text-center border-r border-slate-300 w-16">Ormawa</th>
                <th className="px-2 py-1.5 text-center border-r border-slate-300 w-20">Tanggal</th>
                <th className="px-2.5 py-1.5 text-right border-r border-slate-300">RAB (Rp)</th>
                <th className="px-2.5 py-1.5 text-right border-r border-slate-300">Kas Cair (Rp)</th>
                <th className="px-2.5 py-1.5 text-right border-r border-slate-300">Selisih (Rp)</th>
                <th className="px-2 py-1.5 text-center">Status LPJ / Audit</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(documentData.prokers || []).length === 0 ? (
                <tr>
                  <td colSpan={8} className="px-3 py-3 text-center text-slate-400 italic">
                    Tidak ada program kerja terdaftar
                  </td>
                </tr>
              ) : (
                (documentData.prokers || []).map((p, idx) => {
                  const rab = p.rab || 0;
                  const realisasi = p.realisasiDana || 0;
                  const selisih = rab - realisasi;
                  return (
                    <tr key={`print-proker-${p.id}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                      <td className="px-2 py-1.5 text-center border-r border-slate-300">{idx + 1}</td>
                      <td className="px-2.5 py-1.5 font-bold text-slate-900 border-r border-slate-300">
                        {p.title}
                        <span className="block text-[9px] text-slate-500 font-normal">PJ: {p.pic || '-'}</span>
                      </td>
                      <td className="px-2 py-1.5 text-center font-bold border-r border-slate-300 uppercase">
                        {p.ormawaId}
                      </td>
                      <td className="px-2 py-1.5 text-center border-r border-slate-300 font-mono text-[9px]">
                        {p.startDate}
                      </td>
                      <td className="px-2.5 py-1.5 text-right font-mono border-r border-slate-300">
                        {rab.toLocaleString('id-ID')}
                      </td>
                      <td className="px-2.5 py-1.5 text-right font-mono font-bold text-amber-900 border-r border-slate-300">
                        {realisasi.toLocaleString('id-ID')}
                      </td>
                      <td className="px-2.5 py-1.5 text-right font-mono font-bold text-emerald-900 border-r border-slate-300">
                        {Math.max(0, selisih).toLocaleString('id-ID')}
                      </td>
                      <td className="px-2 py-1.5 text-center font-semibold text-[9px]">
                        {p.status === 'completed' 
                          ? `Selesai (${p.lpj?.auditScore || 90}/100)` 
                          : p.status === 'proposal_approved' 
                          ? 'Proposal ACC' 
                          : p.status === 'proposal_revisi'
                          ? 'Perlu Revisi'
                          : 'Draft / Proses'}
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Seksi 4: Buku Kas & Riwayat Pencairan Kas */}
      <div>
        <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wide mb-2">
          IV. Riwayat Buku Kas &amp; Transaksi Pencairan Dana
        </h4>
        <div className="overflow-x-auto border border-slate-300 rounded-xl">
          <table className="w-full border-collapse text-[10px] sm:text-[11px]">
            <thead>
              <tr className="bg-slate-100 text-slate-800 font-bold border-b border-slate-300">
                <th className="px-2 py-1.5 text-center w-8 border-r border-slate-300">No</th>
                <th className="px-2.5 py-1.5 text-center border-r border-slate-300 w-24">Tanggal</th>
                <th className="px-2 py-1.5 text-center border-r border-slate-300 w-20">Ormawa</th>
                <th className="px-2.5 py-1.5 text-left border-r border-slate-300 w-32">Kategori</th>
                <th className="px-3 py-1.5 text-right border-r border-slate-300 w-28">Nominal</th>
                <th className="px-3 py-1.5 text-left">Keterangan / Keperluan</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-slate-200">
              {(documentData.transactions || []).length === 0 ? (
                <tr>
                  <td colSpan={6} className="px-3 py-3 text-center text-slate-400 italic">
                    Belum ada catatan transaksi pencairan kas
                  </td>
                </tr>
              ) : (
                (documentData.transactions || []).map((t, idx) => (
                  <tr key={`print-trans-${t.id || idx}`} className={idx % 2 === 0 ? 'bg-white' : 'bg-slate-50/50'}>
                    <td className="px-2 py-1.5 text-center border-r border-slate-300">{idx + 1}</td>
                    <td className="px-2.5 py-1.5 text-center font-mono border-r border-slate-300">{t.date}</td>
                    <td className="px-2.5 py-1.5 text-center font-bold uppercase border-r border-slate-300">{t.ormawaId}</td>
                    <td className="px-2.5 py-1.5 font-medium border-r border-slate-300">{t.type}</td>
                    <td className="px-3 py-1.5 text-right font-mono font-bold text-slate-900 border-r border-slate-300">
                      Rp {(t.amount || 0).toLocaleString('id-ID')}
                    </td>
                    <td className="px-3 py-1.5 text-slate-700">{t.note || '-'}</td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pengesahan 3 Pihak Resmi */}
      <div className="pt-6 sm:pt-8 grid grid-cols-3 gap-4 text-center">
        <div>
          <p className="font-semibold text-slate-700 text-[10px] sm:text-xs">Perwakilan Eksekutif,</p>
          <p className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase">BEM / HIMPUNAN</p>
          <div className="h-14 sm:h-16"></div>
          <p className="font-bold underline text-slate-900 text-[10px] sm:text-xs">Rafi Pratama</p>
          <p className="text-[9px] text-slate-600 font-medium">Ketua BEM FASILKOM UMB</p>
        </div>

        <div>
          <p className="font-semibold text-slate-700 text-[10px] sm:text-xs">Komisi Anggaran &amp; Pengawas,</p>
          <p className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase">DPM FASILKOM UMB</p>
          <div className="h-14 sm:h-16"></div>
          <p className="font-bold underline text-slate-900 text-[10px] sm:text-xs">Komisi Pengawas Anggaran</p>
          <p className="text-[9px] text-slate-600 font-medium">DPM FASILKOM UMB</p>
        </div>

        <div>
          <p className="font-semibold text-slate-700 text-[10px] sm:text-xs">Mengetahui &amp; Mengesahkan,</p>
          <p className="font-bold text-slate-900 text-[10px] sm:text-xs uppercase">KETUA DPM FASILKOM</p>
          <div className="h-14 sm:h-16"></div>
          <p className="font-bold underline text-slate-900 text-[10px] sm:text-xs">
            {documentData.signer || 'Muhammad Daffa Aulia Syahrul'}
          </p>
          <p className="text-[9px] text-slate-600 font-bold uppercase tracking-wider">
            Ketua DPM FASILKOM UMB
          </p>
        </div>
      </div>
    </div>
  );
}
