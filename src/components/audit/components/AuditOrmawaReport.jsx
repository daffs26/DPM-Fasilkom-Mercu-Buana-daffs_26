import React from 'react';

export default function AuditOrmawaReport({ ormawas, prokers, currentUser }) {
  const isDpm = currentUser?.ormawaId === 'dpm';
  const displayedOrmawas = isDpm 
    ? ormawas 
    : ormawas.filter(o => o.id === currentUser?.ormawaId);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between pb-4 border-b border-slate-100">
        <div>
          <h3 className="font-bold text-slate-900 text-sm">
            {isDpm ? 'Rapor Kinerja & Akreditasi Ormawa Fasilkom' : `Rapor Kinerja & Akreditasi: ${displayedOrmawas[0]?.shortName || 'Ormawa'}`}
          </h3>
          <p className="text-xs text-slate-600 mt-0.5">
            {isDpm 
              ? 'Akumulasi performa ormawa berdasarkan seluruh audit kegiatan periode berjalan'
              : `Akumulasi performa internal ${displayedOrmawas[0]?.name || 'Ormawa'} berdasarkan seluruh audit kegiatan periode berjalan`}
          </p>
        </div>
      </div>

      <div className={`grid gap-4 sm:gap-5 mt-5 ${isDpm ? 'grid-cols-1 md:grid-cols-2 lg:grid-cols-4' : 'grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 max-w-2xl'}`}>
        {ormawas.map((o) => {
          const oProkers = prokers.filter(p => p.ormawaId === o.id);
          const auditedProkers = oProkers.filter(p => p.lpj?.auditScore);
          const avgScore = auditedProkers.length > 0
            ? Math.round(auditedProkers.reduce((acc, p) => acc + p.lpj.auditScore, 0) / auditedProkers.length)
            : null;
          const predikat = avgScore !== null
            ? (avgScore >= 85 ? 'Predikat A' : avgScore >= 70 ? 'Predikat B' : 'Predikat C')
            : 'Belum Dievaluasi';

          const dadakanProposals = oProkers.filter(p => p.proposal?.isDadakan).length;
          const hasOverdue = oProkers.some(p => p.status === 'lpj_overdue');

          return (
            <div 
              key={o.id}
              className={`p-5 rounded-3xl border flex flex-col justify-between h-full transition-all duration-200 hover:shadow-soft ${
                hasOverdue 
                  ? 'border-rose-200 bg-rose-50/30' 
                  : 'border-slate-200/90 bg-white hover:border-blue-200 shadow-2xs'
              }`}
            >
              {/* 1. Header: Logo & Status Badge */}
              <div>
                <div className="flex items-center justify-between gap-2 mb-3.5">
                  <div className="w-10 h-10 p-1.5 rounded-2xl bg-slate-50 border border-slate-200/80 shadow-2xs flex items-center justify-center shrink-0">
                    <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                  </div>
                  <span className={`text-[10px] font-bold px-2.5 py-0.5 rounded-full border shrink-0 ${
                    hasOverdue 
                      ? 'bg-rose-50 text-rose-700 border-rose-200' 
                      : auditedProkers.length > 0
                      ? 'bg-emerald-50 text-emerald-700 border-emerald-200'
                      : 'bg-slate-50 text-slate-600 border-slate-200'
                  }`}>
                    {hasOverdue ? 'Evaluasi Khusus' : predikat}
                  </span>
                </div>

                {/* 2. Nama Ormawa & Tipe */}
                <div className="min-h-[46px] flex flex-col justify-start">
                  <h4 className="font-extrabold text-slate-900 text-xs sm:text-[13px] leading-snug truncate" title={o.name}>
                    {o.name}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-0.5 leading-snug line-clamp-2" title={o.type}>
                    {o.type}
                  </p>
                </div>

                {/* 3. Daftar Metrik Penilaian */}
                <div className="mt-4 pt-3.5 border-t border-slate-100 space-y-2.5 text-xs">
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Skor Rata-rata</span>
                    <span className="font-bold text-slate-900 text-xs sm:text-[13px]">
                      {avgScore !== null ? `${avgScore} / 100` : '—'}
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Total Proker</span>
                    <span className="font-bold text-slate-800 text-[11px] sm:text-xs">
                      {oProkers.length} kegiatan
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Pengajuan Terlambat</span>
                    <span className={`font-bold text-[11px] sm:text-xs ${dadakanProposals > 0 ? 'text-rose-600' : 'text-slate-800'}`}>
                      {dadakanProposals} berkas
                    </span>
                  </div>
                  <div className="flex items-center justify-between gap-2">
                    <span className="text-[11px] font-medium text-slate-500">Status LPJ</span>
                    <span className={`text-[11px] font-bold ${
                      hasOverdue 
                        ? 'text-rose-600' 
                        : oProkers.length > 0 
                        ? 'text-emerald-600' 
                        : 'text-slate-500'
                    }`}>
                      {hasOverdue ? 'Melampaui Waktu' : oProkers.length > 0 ? 'Tertib' : 'Belum Ada Kegiatan'}
                    </span>
                  </div>
                </div>
              </div>

              {/* 4. Footer: Penanggung Jawab / Ketua Ormawa */}
              <div className="mt-4 pt-3 border-t border-slate-100 flex items-center justify-center gap-1.5 text-center px-1">
                <span className="text-[10px] text-slate-400 font-medium shrink-0">Ketua:</span>
                <span className="text-[10.5px] font-semibold text-slate-700 leading-snug" title={o.ketua}>
                  {o.ketua}
                </span>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
