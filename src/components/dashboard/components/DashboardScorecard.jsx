import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  AlertOctagon 
} from 'lucide-react';

const DashboardScorecard = React.memo(function DashboardScorecard({
  isDpm = true,
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
  return (
    <Card className="lg:col-span-2 rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-between">
      {selectedOrmawaFilter === 'all' && isDpm ? (
        <>
          {/* TAMPILAN 1: OVERVIEW 4 ORMAWA (HANYA DPM) */}
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm tracking-normal">
                Indeks Kinerja Ormawa Fasilkom (Scorecard)
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Evaluasi kedisiplinan rundown, kepatuhan SLA berkas, dan output kegiatan
              </p>
            </div>
            <p className="text-[10px] font-extrabold text-blue-600 bg-slate-100 px-2.5 py-1 rounded-full shrink-0">
              Periode 2026/2027
            </p>
          </div>

          {/* 4 Ormawa Cards */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3.5 my-5">
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
                  className={`p-4 rounded-2xl border transition-all duration-200 hover:shadow-xs cursor-pointer flex flex-col items-center text-center justify-between min-h-[172px] group ${
                    hasOverdue ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/90 bg-slate-50/40 hover:bg-white hover:border-blue-300'
                  }`}
                  title={`Klik untuk melihat detail kinerja khusus ${o.shortName}`}
                >
                  <div className="w-11 h-11 p-1 rounded-xl bg-white border border-slate-200/80 shadow-2xs flex items-center justify-center mb-1 group-hover:scale-105 transition">
                    <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                  </div>
                  <div>
                    <h4 className="font-extrabold text-xs text-slate-900 group-hover:text-blue-600 transition">{o.shortName}</h4>
                    <p className="text-[10px] text-slate-400 font-medium truncate max-w-[100px]">{o.name}</p>
                  </div>

                  <div className="my-1.5">
                    <span className="text-2xl font-black text-slate-900 tracking-tight">
                      {oScore !== null ? oScore : '—'}
                    </span>
                    <span className="text-[10px] text-slate-400 block font-medium">
                      {oScore !== null ? '/ 100 Poin' : 'Belum Dievaluasi'}
                    </span>
                  </div>

                  <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${
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
                      : 'Belum Ada Data'}
                  </span>
                </div>
              );
            })}
          </div>

          {/* Baris bawah: Peringatan SLA DPM */}
          <div className="p-3 bg-slate-50 rounded-2xl border border-slate-200/80 flex items-center justify-between text-xs">
            <div className="flex items-center gap-2 text-slate-700 text-[11px]">
              <span className="w-2 h-2 rounded-full bg-blue-600 shrink-0"></span>
              <span><strong>Standar Batas Waktu:</strong> Proposal minimal <strong>14 hari sebelum acara (H-14)</strong> • LPJ maksimal <strong>14 hari setelah acara (H+14)</strong></span>
            </div>
            <span className="text-slate-500 text-[10px] font-semibold hidden sm:inline">
              Klik kartu ormawa untuk fokus
            </span>
          </div>
        </>
      ) : (
        /* TAMPILAN 2: SPOTLIGHT KHUSUS ORMAWA SENDIRI (ORMAWA) ATAU ORMAWA TERPILIH (DPM) */
        <>
          <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-10 h-10 p-1 rounded-xl bg-white border border-slate-200 shadow-2xs flex items-center justify-center shrink-0">
                <img src={activeOrmawa?.logo} alt={activeOrmawa?.name} className="w-full h-full object-contain" />
              </div>
              <div className="min-w-0">
                <div className="flex items-center gap-2 flex-wrap">
                  <h3 className="font-extrabold text-slate-900 text-sm tracking-normal">
                    Indeks Kinerja: {activeOrmawa?.shortName}
                  </h3>
                </div>
                <p className="text-[11px] text-slate-500 mt-0.5 truncate">
                  {activeOrmawa?.name} • Evaluasi Kepatuhan Periode 2026/2027
                </p>
              </div>
            </div>

            {/* Tombol kembali ke overview 4 ormawa khusus untuk DPM */}
            {isDpm && (
              <button
                type="button"
                onClick={() => setSelectedOrmawaFilter('all')}
                className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50 hover:bg-blue-100 border border-blue-200/80 px-3 py-1.5 rounded-xl transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0"
              >
                <span>&larr; Semua Ormawa</span>
              </button>
            )}
          </div>

          {/* Grid Komparatif Khusus Ormawa Terpilih */}
          <div className="my-5 grid grid-cols-1 md:grid-cols-12 gap-4">
            {/* Kolom Kiri: Spotlight Skor & Predikat */}
            <div className="md:col-span-5 p-4 sm:p-5 rounded-2xl bg-gradient-to-br from-slate-50 to-blue-50/40 border border-blue-100 flex flex-col justify-between items-center text-center">
              <span className="text-[10px] font-extrabold text-slate-400 uppercase tracking-wider">
                SKOR AKHIR AUDIT DPM
              </span>
              <div className="my-2">
                <span className="text-4xl sm:text-5xl font-black text-slate-900 tracking-tight">
                  {activeOrmawaScore !== null ? activeOrmawaScore : '—'}
                </span>
                <span className="text-xs text-slate-400 block font-semibold mt-1">
                  {activeOrmawaScore !== null ? 'dari 100 Poin Kepatuhan' : 'Belum Dievaluasi'}
                </span>
              </div>
              <span className={`text-xs px-3.5 py-1 rounded-full font-extrabold tracking-wide uppercase shadow-2xs ${
                activeOrmawaScore !== null 
                  ? (activeOrmawaScore >= 85 ? 'bg-emerald-100 text-emerald-800 border border-emerald-200' : 'bg-blue-100 text-blue-800 border border-blue-200')
                  : 'bg-slate-100 text-slate-600 border border-slate-200'
              }`}>
                {activeOrmawaPredikat}
              </span>
            </div>

            {/* Kolom Kanan: 3 Pilar Kepatuhan & Kedisiplinan */}
            <div className="md:col-span-7 grid grid-cols-1 sm:grid-cols-3 gap-2.5">
              {/* Pilar 1: Kepatuhan Proposal SLA H-14 */}
              <div className="p-3 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">SLA Proposal</span>
                  <div className="w-6 h-6 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
                    <FileText className="w-3.5 h-3.5" />
                  </div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">
                    {activeOrmawaProposalSlaPercent !== null ? `${activeOrmawaProposalSlaPercent}%` : '—'}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">
                    {activeOrmawaProposalSlaPercent !== null ? 'Tepat Waktu (≥ H-14)' : 'Belum Ada Proposal'}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-400 font-medium">
                  {activeOrmawaWithProposal.length} Berkas Diajukan
                </div>
              </div>

              {/* Pilar 2: Ketepatan LPJ SLA H+14 */}
              <div className="p-3 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Kedisiplinan LPJ</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    activeOrmawaOverdueLPJ > 0 ? 'bg-rose-50 text-rose-600' : 'bg-emerald-50 text-emerald-600'
                  }`}>
                    {activeOrmawaOverdueLPJ > 0 ? <AlertTriangle className="w-3.5 h-3.5" /> : <CheckCircle2 className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">
                    {activeOrmawaOverdueLPJ > 0 ? `${activeOrmawaOverdueLPJ} Terlambat` : 'Nihil'}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">
                    {activeOrmawaOverdueLPJ > 0 ? 'Melewati H+14' : 'Kepatuhan 100% Disiplin'}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-400 font-medium">
                  {activeOrmawaProkers.filter(p => p.status === 'completed').length} LPJ Diverifikasi
                </div>
              </div>

              {/* Pilar 3: Status Sanksi / SP */}
              <div className="p-3 rounded-2xl border border-slate-200/90 bg-white shadow-2xs flex flex-col justify-between">
                <div className="flex items-center justify-between mb-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase">Sanksi DPM</span>
                  <div className={`w-6 h-6 rounded-lg flex items-center justify-center ${
                    activeOrmawaSPs.length > 0 ? 'bg-rose-50 text-rose-600' : 'bg-blue-50 text-blue-600'
                  }`}>
                    {activeOrmawaSPs.length > 0 ? <AlertOctagon className="w-3.5 h-3.5" /> : <ShieldCheck className="w-3.5 h-3.5" />}
                  </div>
                </div>
                <div>
                  <div className="text-base font-black text-slate-900">
                    {activeOrmawaSPs.length > 0 ? `${activeOrmawaSPs.length} SP Aktif` : '0 SP'}
                  </div>
                  <p className="text-[10px] text-slate-500 font-medium mt-0.5 leading-snug">
                    {activeOrmawaSPs.length > 0 ? 'Ada Teguran DPM' : 'Bebas Pelanggaran'}
                  </p>
                </div>
                <div className="mt-2 pt-2 border-t border-slate-100 text-[9px] text-slate-400 font-medium">
                  Status Pengawasan Bersih
                </div>
              </div>
            </div>
          </div>
        </>
      )}
    </Card>
  );
});

export default DashboardScorecard;
