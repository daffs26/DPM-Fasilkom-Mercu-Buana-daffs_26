import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon,
  Clock
} from 'lucide-react';

const DashboardScorecard = React.memo(function DashboardScorecard({
  isDpm = true,
  isGuest = false,
  selectedOrmawaFilter,
  setSelectedOrmawaFilter,
  ormawas,
  prokers,
  activeOrmawa,
  activeOrmawaScore,
  activeOrmawaPredikat,
  activeOrmawaProposalSlaPercent,
  activeOrmawaWithProposal,
  activeOrmawaOverdueLPJ,
  activeOrmawaSPs,
  activeOrmawaProkers
}) {
  const canViewAll = isDpm || isGuest;
  const currentOrmawa = activeOrmawa || ormawas?.find(o => o.id === selectedOrmawaFilter) || ormawas?.[0];

  return (
    <Card className="lg:col-span-2 rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-start gap-4">
      {selectedOrmawaFilter === 'all' && canViewAll ? (
        <>
          {/* TAMPILAN 1: OVERVIEW 4 ORMAWA (DPM & TAMU PUBLIK) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">
                Indeks Kinerja Ormawa (Scorecard)
              </h3>
              <p className="text-[11px] text-slate-400 mt-0.5">
                Evaluasi kedisiplinan dan kepatuhan SLA kegiatan
              </p>
            </div>
            <p className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100/80 px-2.5 py-1 rounded-full shrink-0 self-start sm:self-auto">
              Periode 2026/2027
            </p>
          </div>

          {/* 4 Ormawa Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-1">
            {ormawas.map((o) => {
              const oProkers = prokers.filter(p => p.ormawaId === o.id);
              const oAudited = oProkers.filter(p => p.lpj?.auditScore);
              const oScore = oAudited.length > 0 
                ? Math.round(oAudited.reduce((acc, p) => acc + p.lpj.auditScore, 0) / oAudited.length)
                : null;
              const hasOverdue = oProkers.some(p => p.status === 'lpj_overdue');

              return (
                <div 
                  key={o.id}
                  onClick={() => setSelectedOrmawaFilter(o.id)}
                  className={`p-3.5 rounded-2xl border transition-all duration-200 hover:shadow-xs cursor-pointer flex flex-col items-center text-center justify-between min-h-[156px] group ${
                    hasOverdue ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-blue-300'
                  }`}
                  title={`Klik untuk detail ${o.shortName}`}
                >
                  <div className="w-10 h-10 p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center mb-1 group-hover:scale-105 transition">
                    <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition">{o.shortName}</h4>
                  </div>

                  <div className="my-1">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {oScore !== null ? oScore : '—'}
                    </span>
                    {oScore !== null && (
                      <span className="text-[10px] text-slate-400 font-bold block">/100</span>
                    )}
                  </div>

                  <span className={`text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 max-w-full truncate block ${
                    hasOverdue 
                      ? 'bg-rose-100 text-rose-700' 
                      : oScore !== null 
                      ? (oScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800')
                      : 'bg-slate-100 text-slate-500'
                  }`}>
                    {hasOverdue 
                      ? 'Terlambat LPJ' 
                      : oScore !== null 
                      ? (oScore >= 85 ? 'Predikat A' : oScore >= 70 ? 'Predikat B' : 'Predikat C')
                      : 'Belum Dievaluasi'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Baris bawah SLA minimalis */}
          <div className="p-3 bg-slate-50/80 rounded-2xl border border-slate-200/80 flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs">
            <div className="flex items-center gap-2 min-w-0">
              <Clock className="w-3.5 h-3.5 text-blue-600 shrink-0" />
              <p className="text-[11px] text-slate-600 truncate">
                <span className="font-bold text-slate-800">Ketentuan SLA:</span> Proposal <span className="font-bold text-slate-900">≥ H-14</span> • LPJ <span className="font-bold text-slate-900">≤ H+14</span>
              </p>
            </div>
            <span className="text-[10px] font-semibold text-slate-400 shrink-0">
              Klik ormawa untuk spotlight
            </span>
          </div>
        </>
      ) : (
        /* TAMPILAN 2: SPOTLIGHT KHUSUS ORMAWA TERPILIH (MINIMALIS & ELEGAN) */
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-9 h-9 p-1 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0 overflow-hidden">
                {currentOrmawa?.logo ? (
                  <img 
                    src={currentOrmawa.logo} 
                    alt={currentOrmawa.name || 'Logo Ormawa'} 
                    className="w-full h-full object-contain"
                    onError={(e) => {
                      e.currentTarget.style.display = 'none';
                    }}
                  />
                ) : null}
              </div>
              <div className="min-w-0">
                <h3 className="font-extrabold text-slate-900 text-sm tracking-tight truncate">
                  Indeks Kinerja: {currentOrmawa?.shortName || 'Ormawa'}
                </h3>
                <p className="text-[11px] text-slate-400 font-medium truncate">
                  {currentOrmawa?.name || 'Organisasi Mahasiswa'} • Periode 2026/2027
                </p>
              </div>
            </div>

            {/* Tombol kembali ke overview 4 ormawa untuk DPM & Tamu Publik */}
            {canViewAll && (
              <button
                type="button"
                onClick={() => setSelectedOrmawaFilter('all')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/80 hover:bg-blue-100 border border-blue-200/60 px-3 py-1.5 rounded-xl transition flex items-center gap-1 cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs"
              >
                <span>&larr; Semua Ormawa</span>
              </button>
            )}
          </div>

          {/* Grid Komparatif Khusus Ormawa Terpilih */}
          <div className="grid grid-cols-1 md:grid-cols-12 gap-3 sm:gap-4 flex-1 items-stretch">
            {/* Kolom Kiri: Spotlight Skor & Predikat */}
            <div className="md:col-span-5 p-5 sm:p-6 rounded-2xl bg-gradient-to-br from-slate-50 via-white to-blue-50/40 border border-slate-200/90 flex flex-col items-center justify-between text-center shadow-2xs">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                Skor Audit Kinerja
              </span>
              <div className="my-auto py-3">
                <div className="flex items-baseline justify-center gap-1">
                  <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                    {activeOrmawaScore !== null ? activeOrmawaScore : '—'}
                  </span>
                  {activeOrmawaScore !== null && (
                    <span className="text-sm font-bold text-slate-400">/100</span>
                  )}
                </div>
                <span className="text-[11px] text-slate-400 font-medium block mt-1">
                  {activeOrmawaScore !== null ? 'Poin Kepatuhan' : 'Belum Ada Evaluasi'}
                </span>
              </div>
              <span className={`text-[11px] px-3.5 py-1 rounded-full font-extrabold uppercase tracking-wide shadow-2xs ${
                activeOrmawaScore !== null 
                  ? (activeOrmawaScore >= 85 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200/60' : 'bg-blue-100 text-blue-800 border border-blue-200/60')
                  : 'bg-slate-100 text-slate-600 border border-slate-200/80'
              }`}>
                {activeOrmawaPredikat}
              </span>
            </div>

            {/* Kolom Kanan: 3 Pilar Kepatuhan & Kedisiplinan */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-3">
              {/* Pilar 1: SLA Proposal */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">SLA Proposal</span>
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center shrink-0">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div className="my-auto py-2">
                  <div className="text-xl font-black text-slate-900">
                    {activeOrmawaProposalSlaPercent !== null ? `${activeOrmawaProposalSlaPercent}%` : '—'}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium truncate">
                  {activeOrmawaWithProposal.length > 0 
                    ? `${activeOrmawaWithProposal.length} Berkas Diajukan`
                    : 'Belum Ada Berkas'}
                </span>
              </div>

              {/* Pilar 2: Kedisiplinan LPJ */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Disiplin LPJ</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    activeOrmawaOverdueLPJ > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {activeOrmawaOverdueLPJ > 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <div className="my-auto py-2">
                  <div className={`text-xl font-black ${activeOrmawaOverdueLPJ > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeOrmawaOverdueLPJ > 0 ? `${activeOrmawaOverdueLPJ} Terlambat` : 'Disiplin'}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium truncate">
                  {activeOrmawaProkers.filter(p => p.status === 'completed').length > 0
                    ? `${activeOrmawaProkers.filter(p => p.status === 'completed').length} LPJ Diverifikasi`
                    : 'Kepatuhan 100%'}
                </span>
              </div>

              {/* Pilar 3: Sanksi SP */}
              <div className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-slate-300 transition-all duration-200 shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider">Sanksi SP</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center shrink-0 ${
                    activeOrmawaSPs.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {activeOrmawaSPs.length > 0 ? <AlertOctagon className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <div className="my-auto py-2">
                  <div className={`text-xl font-black ${activeOrmawaSPs.length > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
                    {activeOrmawaSPs.length > 0 ? `${activeOrmawaSPs.length} SP Aktif` : '0 SP'}
                  </div>
                </div>
                <span className="text-[11px] text-slate-500 font-medium truncate">
                  {activeOrmawaSPs.length > 0 ? 'Ada Teguran DPM' : 'Bebas Pelanggaran'}
                </span>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
});

export default DashboardScorecard;
