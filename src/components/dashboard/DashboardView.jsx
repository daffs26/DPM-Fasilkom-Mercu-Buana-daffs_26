import React from 'react';
import { useStore } from '../../store/useStore';
import { Card, CardHeader, CardTitle, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { 
  CheckCircle2, 
  Clock, 
  AlertTriangle, 
  FileText, 
  TrendingUp, 
  ShieldCheck, 
  AlertOctagon, 
  Layers
} from 'lucide-react';

export default function DashboardView({ onOpenAddProker, onReviewProposal, onAuditLPJ }) {
  const { 
    ormawas, 
    prokers, 
    selectedOrmawaFilter, 
    setSelectedOrmawaFilter,
    activityLogs, 
    suratPeringatan 
  } = useStore();

  // Filter proker berdasarkan ormawa yang aktif
  const filteredProkers = selectedOrmawaFilter === 'all'
    ? prokers
    : prokers.filter(p => p.ormawaId === selectedOrmawaFilter);

  // Metrik Kalkulasi
  const totalProkers = filteredProkers.length;
  const pendingProposal = filteredProkers.filter(p => p.status === 'proposal_pending').length;
  const completedProkers = filteredProkers.filter(p => p.status === 'completed').length;
  const overdueLPJ = filteredProkers.filter(p => p.status === 'lpj_overdue').length;
  const activeSPCount = suratPeringatan.filter(s => s.status === 'active').length;

  // Hitung Skor Rata-rata Kepatuhan (Tanpa Nilai Dummy)
  const prokersWithAudit = filteredProkers.filter(p => p.lpj?.auditScore);
  const avgScore = prokersWithAudit.length > 0
    ? Math.round(prokersWithAudit.reduce((acc, p) => {
        const val = typeof p.lpj.auditScore === 'number' ? p.lpj.auditScore : parseInt(p.lpj.auditScore, 10);
        return acc + (isNaN(val) ? 0 : val);
      }, 0) / prokersWithAudit.length)
    : null;
  const predikatAudit = avgScore !== null
    ? (avgScore >= 85 ? 'Predikat A' : avgScore >= 70 ? 'Predikat B' : 'Predikat C')
    : 'Belum Dievaluasi';

  // Hitung Kepatuhan SLA Waktu
  const totalWithProposal = filteredProkers.filter(p => p.proposal?.fileName).length;
  const onTimeProposalCount = filteredProkers.filter(p => p.proposal?.fileName && !p.proposal.isDadakan).length;
  const onTimePercentage = totalWithProposal > 0 ? Math.round((onTimeProposalCount / totalWithProposal) * 100) : null;

  // Hitung Serapan Anggaran
  const activeOrmawa = selectedOrmawaFilter === 'all' ? null : ormawas.find(o => o.id === selectedOrmawaFilter);
  const totalPagu = activeOrmawa 
    ? activeOrmawa.paguAnggaran 
    : ormawas.reduce((acc, o) => acc + o.paguAnggaran, 0);
  const totalSerapan = activeOrmawa 
    ? activeOrmawa.serapanAnggaran 
    : ormawas.reduce((acc, o) => acc + o.serapanAnggaran, 0);
  const serapanPercent = totalPagu > 0 ? Math.round((totalSerapan / totalPagu) * 100) : 0;

  // Metrik Khusus Ormawa Terpilih untuk Scorecard Fokus (Opsi B)
  const activeOrmawaProkers = activeOrmawa ? prokers.filter(p => p.ormawaId === activeOrmawa.id) : [];
  const activeOrmawaAudited = activeOrmawaProkers.filter(p => p.lpj?.auditScore);
  const activeOrmawaScore = activeOrmawaAudited.length > 0 
    ? Math.round(activeOrmawaAudited.reduce((acc, p) => {
        const val = typeof p.lpj.auditScore === 'number' ? p.lpj.auditScore : parseInt(p.lpj.auditScore, 10);
        return acc + (isNaN(val) ? 0 : val);
      }, 0) / activeOrmawaAudited.length)
    : null;
  const activeOrmawaPredikat = activeOrmawaScore !== null
    ? (activeOrmawaScore >= 85 ? 'Predikat A (Sangat Baik)' : activeOrmawaScore >= 70 ? 'Predikat B (Baik)' : 'Predikat C (Cukup)')
    : 'Belum Dievaluasi';

  const activeOrmawaWithProposal = activeOrmawaProkers.filter(p => p.proposal?.fileName);
  const activeOrmawaOnTimeProposal = activeOrmawaWithProposal.filter(p => !p.proposal?.isDadakan).length;
  const activeOrmawaProposalSlaPercent = activeOrmawaWithProposal.length > 0 
    ? Math.round((activeOrmawaOnTimeProposal / activeOrmawaWithProposal.length) * 100) 
    : null;

  const activeOrmawaOverdueLPJ = activeOrmawaProkers.filter(p => p.status === 'lpj_overdue').length;
  const activeOrmawaSPs = activeOrmawa ? suratPeringatan.filter(s => s.ormawaId === activeOrmawa.id && s.status === 'active') : [];

  return (
    <div className="space-y-6">
      {/* 1A. TOP HERO KPI CARDS KHUSUS MOBILE (< lg) — Bergaya Indeks Kinerja Ormawa Fasilkom (2x2 Grid) */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        {/* Mobile Card 1: Skor Audit Ormawa */}
        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center justify-between min-h-[165px]">
          <div className="w-9 h-9 rounded-xl bg-blue-50 text-blue-600 border border-blue-100/80 shadow-2xs flex items-center justify-center mb-1">
            <ShieldCheck className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 leading-tight">Skor Audit</h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Kepatuhan Ormawa</p>
          </div>
          <div className="my-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {avgScore !== null ? avgScore : '—'}
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">
              {avgScore !== null ? '/ 100 Poin' : 'Belum Dievaluasi'}
            </span>
          </div>
          <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${
            avgScore !== null ? (avgScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800') : 'bg-slate-100 text-slate-500'
          }`}>
            {onTimePercentage !== null ? `${onTimePercentage}% Tepat Waktu` : predikatAudit}
          </span>
        </div>

        {/* Mobile Card 2: Review Proposal DPM */}
        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center justify-between min-h-[165px]">
          <div className="w-9 h-9 rounded-xl bg-amber-50 text-amber-600 border border-amber-100/80 shadow-2xs flex items-center justify-center mb-1">
            <FileText className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 leading-tight">Review Proposal</h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Batas Waktu H-14</p>
          </div>
          <div className="my-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {pendingProposal}
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">
              butuh review DPM
            </span>
          </div>
          <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${
            filteredProkers.filter(p => p.proposal?.isDadakan).length > 0 ? 'bg-amber-100 text-amber-800' : 'bg-slate-100 text-slate-600'
          }`}>
            {filteredProkers.filter(p => p.proposal?.isDadakan).length > 0 
              ? `${filteredProkers.filter(p => p.proposal?.isDadakan).length} Terlambat` 
              : 'Tepat Waktu'}
          </span>
        </div>

        {/* Mobile Card 3: LPJ Terverifikasi */}
        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center justify-between min-h-[165px]">
          <div className="w-9 h-9 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100/80 shadow-2xs flex items-center justify-center mb-1">
            <CheckCircle2 className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h4 className="font-extrabold text-xs text-slate-900 leading-tight">LPJ Terverifikasi</h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Capaian Proker</p>
          </div>
          <div className="my-1">
            <span className="text-2xl font-black text-slate-900 tracking-tight">
              {completedProkers}
            </span>
            <span className="text-[10px] text-slate-400 block font-medium">
              dari {totalProkers} proker
            </span>
          </div>
          <span className="text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 whitespace-nowrap bg-emerald-100 text-emerald-800">
            {totalProkers > 0 ? Math.round((completedProkers / totalProkers) * 100) : 0}% Selesai
          </span>
        </div>

        {/* Mobile Card 4: Keterlambatan LPJ */}
        <div className={`p-3.5 rounded-2xl border shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center justify-between min-h-[165px] ${
          overdueLPJ > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/90 bg-white'
        }`}>
          <div className={`w-9 h-9 rounded-xl border shadow-2xs flex items-center justify-center mb-1 ${
            overdueLPJ > 0 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-rose-50 text-rose-600 border-rose-100/80'
          }`}>
            <AlertTriangle className="w-4 h-4 stroke-[2.2]" />
          </div>
          <div>
            <h4 className={`font-extrabold text-xs leading-tight ${overdueLPJ > 0 ? 'text-rose-900' : 'text-slate-900'}`}>
              Keterlambatan LPJ
            </h4>
            <p className="text-[10px] text-slate-400 font-medium mt-0.5">Batas Waktu H+14</p>
          </div>
          <div className="my-1">
            <span className={`text-2xl font-black tracking-tight ${overdueLPJ > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueLPJ}
            </span>
            <span className={`text-[10px] block font-medium ${overdueLPJ > 0 ? 'text-rose-600 font-bold' : 'text-slate-400'}`}>
              {overdueLPJ > 0 ? 'Melampaui Batas' : 'Nihil Keterlambatan'}
            </span>
          </div>
          <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 whitespace-nowrap ${
            overdueLPJ > 0 ? 'bg-rose-100 text-rose-700' : 'bg-slate-100 text-slate-600'
          }`}>
            {overdueLPJ > 0 ? `${overdueLPJ} Terlambat` : `${activeSPCount} SP Aktif`}
          </span>
        </div>
      </div>

      {/* 1B. TOP HERO KPI CARDS DESKTOP (lg:grid) — 100% UNTOUCHED */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {/* Card 1: Skor Audit Ormawa */}
        <Card className="rounded-3xl p-5 border-slate-200/80 shadow-soft flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Skor Audit Ormawa
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {avgScore !== null ? avgScore : '—'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {avgScore !== null ? '/ 100 Poin' : 'Belum Dievaluasi'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
            <span className="text-slate-500 text-[11px]">Kepatuhan SLA</span>
            <span className="text-blue-600 font-bold text-[11px] flex items-center gap-1">
              {onTimePercentage !== null ? (
                <>
                  <TrendingUp className="w-3.5 h-3.5 text-blue-600" /> {onTimePercentage}% Tepat Waktu
                </>
              ) : (
                <span className="text-slate-400 font-normal">{predikatAudit}</span>
              )}
            </span>
          </div>
        </Card>

        {/* Card 2: Proposal Menunggu Review DPM */}
        <Card className="rounded-3xl p-5 border-slate-200/80 shadow-soft flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Review Proposal DPM
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <FileText className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {pendingProposal}
            </h3>
            <span className="text-xs text-slate-500 font-medium">butuh review</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
            <span className="text-slate-500 text-[11px]">Batas Waktu: H-14</span>
            <span className="text-amber-700 font-bold text-[11px]">
              {filteredProkers.filter(p => p.proposal?.isDadakan).length} Terlambat (&lt;H-14)
            </span>
          </div>
        </Card>

        {/* Card 3: Proker Sukses & LPJ ACC */}
        <Card className="rounded-3xl p-5 border-slate-200/80 shadow-soft flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              LPJ Terverifikasi
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {completedProkers}
            </h3>
            <span className="text-xs text-slate-500 font-medium">dari {totalProkers} proker</span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
            <span className="text-slate-500 text-[11px]">Capaian Proker</span>
            <span className="text-emerald-700 font-bold text-[11px]">
              {totalProkers > 0 ? Math.round((completedProkers / totalProkers) * 100) : 0}% Selesai
            </span>
          </div>
        </Card>

        {/* Card 4: Keterlambatan LPJ */}
        <Card className="rounded-3xl p-5 border-slate-200/80 shadow-soft flex flex-col justify-between min-h-[160px]">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Keterlambatan LPJ
            </span>
            <div className="w-8 h-8 rounded-xl bg-rose-50 text-rose-600 border border-rose-100 flex items-center justify-center">
              <AlertTriangle className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="my-2 flex items-baseline gap-2">
            <h3 className={`text-3xl font-black tracking-tight ${overdueLPJ > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueLPJ}
            </h3>
            <span className={`text-xs font-bold ${overdueLPJ > 0 ? 'text-rose-600' : 'text-slate-500'}`}>
              {overdueLPJ > 0 ? 'Melampaui Batas Waktu' : 'Nihil Keterlambatan'}
            </span>
          </div>

          <div className="flex items-center justify-between text-xs pt-2.5 border-t border-slate-100">
            <span className="text-slate-500 text-[11px]">Surat Peringatan</span>
            <span className="text-rose-600 font-bold text-[11px]">
              {activeSPCount} SP Diterbitkan
            </span>
          </div>
        </Card>
      </div>

      {/* 2. MIDDLE ROW: SCORECARD ORMAWA & SERAPAN ANGGARAN (Shadcn UI Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Scorecard Ormawa Fasilkom (2 Kolom) - Dinamis Berdasarkan Filter Ormawa */}
        <Card className="lg:col-span-2 rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-between">
          {selectedOrmawaFilter === 'all' ? (
            <>
              {/* TAMPILAN 1: OVERVIEW 4 ORMAWA (Saat Filter Semua Ormawa Aktif) */}
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

              {/* 4 Ormawa Cards - Klik card untuk langsung fokus ke ormawa */}
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
                  <span><strong>Standar Batas Waktu:</strong> Proposal minimal <strong>≥ H-14</strong> • LPJ maksimal <strong>≤ H+14</strong></span>
                </div>
                <span className="text-slate-500 text-[10px] font-semibold hidden sm:inline">
                  Klik kartu ormawa untuk fokus
                </span>
              </div>
            </>
          ) : (
            /* TAMPILAN 2: SPOTLIGHT KHUSUS ORMAWA TERPILIH (Opsi B) */
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

        {/* Transparansi Dana Kemahasiswaan (1 Kolom) */}
        <Card className="rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between gap-2 pb-3.5 border-b border-slate-100">
              <div className="min-w-0 flex-1">
                <h3 className="font-extrabold text-slate-900 text-[13px] sm:text-sm leading-tight">Serapan Dana Kemahasiswaan</h3>
                <p className="text-[11px] text-slate-500 mt-0.5">Alokasi Anggaran Fakultas 2026</p>
              </div>
              <Badge variant="secondary" className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-full border border-blue-200/60 shrink-0 whitespace-nowrap">
                {serapanPercent}% Terserap
              </Badge>
            </div>

            {/* Total Value */}
            <div className="my-4">
              <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">
                TOTAL REALISASI DANA
              </span>
              <h4 className="text-2xl font-black text-slate-900 tracking-tight mt-0.5">
                Rp {totalSerapan.toLocaleString('id-ID')}
              </h4>
              <p className="text-[11px] text-slate-500 mt-0.5">
                dari total anggaran Rp {totalPagu.toLocaleString('id-ID')}
              </p>

              {/* Progress Bar (Royal Blue - Visual Hierarchy) */}
              <div className="w-full bg-slate-100 h-2 rounded-full overflow-hidden mt-3">
                <div 
                  className="bg-blue-600 h-full rounded-full transition-all duration-500"
                  style={{ width: `${Math.min(serapanPercent, 100)}%` }}
                />
              </div>
            </div>

            {/* Ormawa Breakdown */}
            <div className="space-y-2 pt-1">
              {ormawas.map(o => {
                const pct = o.paguAnggaran > 0 ? Math.round((o.serapanAnggaran / o.paguAnggaran) * 100) : 0;
                return (
                  <div key={o.id} className="flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: o.color.primary }} />
                      <span className="font-semibold text-slate-700 text-[11px]">{o.shortName}</span>
                    </div>
                    <div className="text-right font-medium text-slate-600 text-[11px]">
                      <span>Rp {o.serapanAnggaran.toLocaleString('id-ID')}</span>
                      <span className="text-[10px] text-slate-400 ml-1.5">({pct}%)</span>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              Bukti nota & kwitansi fisik diverifikasi pada saat audit LPJ.
            </span>
          </div>
        </Card>
      </div>

      {/* 3. BOTTOM SECTION: TABEL PROKER TERKINI & LIVE AUDIT FEED (Shadcn UI Table & Card) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Tabel Pengawasan Proker Terkini (2 Kolom) */}
        <Card className="lg:col-span-2 rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft">
          <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
            <div>
              <h3 className="font-extrabold text-slate-900 text-sm">
                Status Pengawasan Program Kerja
              </h3>
              <p className="text-[11px] text-slate-500 mt-0.5">
                Monitoring berkas proposal, inspeksi hari-H, dan audit LPJ
              </p>
            </div>
            <button
              onClick={onOpenAddProker}
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
            >
              <span>+ Proker Baru</span>
            </button>
          </div>

          {/* 1. DESKTOP SHADCN UI TABLE (hidden on mobile, visible on lg+) — 100% UNTOUCHED */}
          <div className="hidden lg:block mt-3.5 overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow className="border-b border-slate-100">
                  <TableHead className="pb-3 whitespace-nowrap">Ormawa & Kegiatan</TableHead>
                  <TableHead className="pb-3 whitespace-nowrap">Jadwal Acara</TableHead>
                  <TableHead className="pb-3 whitespace-nowrap">Status Proposal</TableHead>
                  <TableHead className="pb-3 whitespace-nowrap">Status LPJ (H+14)</TableHead>
                  <TableHead className="pb-3 text-right whitespace-nowrap">Aksi DPM</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProkers.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="py-12 text-center">
                      {/* Slide 4 Feedback Concentric Circles */}
                      <div className="flex flex-col items-center justify-center">
                        <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mb-3">
                          <Layers className="w-6 h-6 stroke-[1.8]" />
                        </div>
                        <h4 className="text-sm font-extrabold text-slate-900">Belum Ada Program Kerja</h4>
                        <p className="text-xs text-slate-500 max-w-sm mx-auto mt-1 font-normal">
                          Daftarkan kegiatan baru atau ganti filter ormawa untuk melihat status monitoring berkas.
                        </p>
                        <Button
                          onClick={onOpenAddProker}
                          className="mt-3"
                          size="sm"
                        >
                          + Tambah Proker Baru
                        </Button>
                      </div>
                    </TableCell>
                  </TableRow>
                ) : (
                  filteredProkers.slice(0, 5).map((p) => {
                    const ormawa = ormawas.find(o => o.id === p.ormawaId);
                    return (
                      <TableRow key={p.id}>
                        {/* Ormawa & Judul */}
                        <TableCell className="py-3 pr-3">
                          <div className="flex items-center gap-2.5">
                            <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                              <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                            </div>
                            <div>
                              <p className="font-bold text-slate-900 text-xs line-clamp-1">{p.title}</p>
                              <p className="text-[10px] text-slate-500">{ormawa?.shortName} • PIC: {p.pic}</p>
                            </div>
                          </div>
                        </TableCell>

                        {/* Jadwal */}
                        <TableCell className="py-3 pr-3 text-slate-600 font-medium text-[11px]">
                          {p.startDate}
                        </TableCell>

                        {/* Status Proposal */}
                        <TableCell className="py-3 pr-3">
                          {p.proposal?.reviewStatus === 'approved' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                              ✓ ACC DPM
                            </span>
                          ) : p.proposal?.reviewStatus === 'revisi' ? (
                            <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                              Perlu Revisi
                            </span>
                          ) : p.proposal?.isDadakan ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200/60">
                              ⚠️ Terlambat (&lt; H-14)
                            </span>
                          ) : p.proposal?.fileName ? (
                            <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200/60">
                              Menunggu Review
                            </span>
                          ) : (
                            <span className="text-slate-400 text-[10px] italic">Belum Ada Berkas</span>
                          )}
                        </TableCell>

                        {/* Status LPJ */}
                        <TableCell className="py-3 pr-3">
                          {p.status === 'completed' ? (
                            <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                              ✓ Selesai ({p.lpj?.auditScore})
                            </span>
                          ) : p.status === 'lpj_overdue' ? (
                            <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-300 animate-pulse">
                              🔴 Keterlambatan LPJ
                            </span>
                          ) : (
                            <span className="text-slate-500 text-[10px]">
                              Deadline: {p.lpj?.deadlineDate || '-'}
                            </span>
                          )}
                        </TableCell>

                        {/* Aksi DPM */}
                        <TableCell className="py-3 text-right">
                          <div className="flex items-center justify-end gap-1.5">
                            {p.proposal?.fileName && (
                              <Button
                                variant="outline"
                                size="sm"
                                onClick={() => onReviewProposal(p)}
                                className="h-7 px-2.5 text-[11px]"
                              >
                                Review
                              </Button>
                            )}
                            <Button
                              variant="default"
                              size="sm"
                              onClick={() => onAuditLPJ(p)}
                              className="h-7 px-2.5 text-[11px]"
                            >
                              Audit
                            </Button>
                          </div>
                        </TableCell>
                      </TableRow>
                    );
                  })
                )}
              </TableBody>
            </Table>
          </div>

          {/* 2. MOBILE PROKER CARD LIST (< lg) — 1 Layout HP Pas Tanpa Perlu Digeser */}
          <div className="lg:hidden mt-3.5 space-y-3">
            {filteredProkers.length === 0 ? (
              <div className="py-8 text-center bg-slate-50/60 rounded-2xl border border-slate-200/80 p-4">
                <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 ring-6 ring-blue-50/50 flex items-center justify-center mx-auto mb-2">
                  <Layers className="w-5 h-5 stroke-[1.8]" />
                </div>
                <h4 className="text-xs font-bold text-slate-900">Belum Ada Program Kerja</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-xs mx-auto">
                  Daftarkan kegiatan baru atau ganti filter ormawa.
                </p>
                <Button onClick={onOpenAddProker} className="mt-3 text-xs" size="sm">
                  + Tambah Proker Baru
                </Button>
              </div>
            ) : (
              filteredProkers.slice(0, 5).map((p) => {
                const ormawa = ormawas.find(o => o.id === p.ormawaId);
                return (
                  <div
                    key={p.id}
                    className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-2.5"
                  >
                    {/* Header: Logo + Ormawa + Tanggal Acara */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2">
                        <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                          <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                        </div>
                        <span className="font-extrabold text-xs text-slate-900">{ormawa?.shortName}</span>
                      </div>
                      <span className="text-[11px] text-slate-500 font-semibold">{p.startDate}</span>
                    </div>

                    {/* Judul Proker & PIC */}
                    <div>
                      <h4 className="font-bold text-xs text-slate-900 leading-snug">{p.title}</h4>
                      <p className="text-[10px] text-slate-500 mt-0.5">
                        PIC: <strong className="text-slate-700">{p.pic}</strong> • Divisi: {p.divisi}
                      </p>
                    </div>

                    {/* Status Badges */}
                    <div className="flex items-center gap-1.5 flex-wrap pt-1 border-t border-slate-100">
                      {p.proposal?.reviewStatus === 'approved' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                          ✓ Proposal ACC
                        </span>
                      ) : p.proposal?.reviewStatus === 'revisi' ? (
                        <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">
                          Perlu Revisi
                        </span>
                      ) : p.proposal?.isDadakan ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200/60">
                          ⚠️ Terlambat (&lt; H-14)
                        </span>
                      ) : p.proposal?.fileName ? (
                        <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200/60">
                          Menunggu Review
                        </span>
                      ) : (
                        <span className="text-slate-400 text-[10px] italic">Belum Ada Proposal</span>
                      )}

                      {p.status === 'completed' ? (
                        <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">
                          ✓ LPJ Selesai ({p.lpj?.auditScore})
                        </span>
                      ) : p.status === 'lpj_overdue' ? (
                        <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-300">
                          🔴 LPJ Terlambat
                        </span>
                      ) : (
                        <span className="text-slate-500 text-[10px] bg-slate-50 px-2 py-0.5 rounded-full border border-slate-200">
                          Deadline: {p.lpj?.deadlineDate || '-'}
                        </span>
                      )}
                    </div>

                    {/* Action Buttons */}
                    <div className="flex items-center gap-2 pt-1">
                      {p.proposal?.fileName && (
                        <Button
                          variant="outline"
                          size="sm"
                          onClick={() => onReviewProposal(p)}
                          className="flex-1 h-8 text-xs font-semibold rounded-xl"
                        >
                          Review Proposal
                        </Button>
                      )}
                      <Button
                        variant="default"
                        size="sm"
                        onClick={() => onAuditLPJ(p)}
                        className="flex-1 h-8 text-xs font-semibold rounded-xl"
                      >
                        Audit LPJ
                      </Button>
                    </div>
                  </div>
                );
              })
            )}
          </div>
        </Card>

        {/* Live Activity Feed (1 Kolom) */}
        <Card className="rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
              <h3 className="font-extrabold text-slate-900 text-sm">Aktivitas & Log Audit</h3>
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
            </div>

            <div className="mt-4 space-y-3.5">
              {activityLogs.length === 0 ? (
                <div className="py-12 text-center">
                  {/* Slide 4 Feedback Concentric Circles */}
                  <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mx-auto mb-3">
                    <Clock className="w-6 h-6 stroke-[1.8]" />
                  </div>
                  <h4 className="text-sm font-extrabold text-slate-900">Belum Ada Aktivitas</h4>
                  <p className="text-xs text-slate-500 max-w-xs mx-auto mt-1 font-normal">
                    Seluruh pencatatan review proposal dan audit LPJ ormawa akan terekam secara otomatis di sini.
                  </p>
                </div>
              ) : (
                activityLogs.slice(0, 5).map((log) => {
                  const ormawa = ormawas.find(o => o.id === log.ormawaId);
                  const isDeleted = log.type === 'proker_deleted';
                  const isAdded = log.type === 'proker_added';
                  return (
                    <div key={log.id} className="flex items-start gap-2.5 text-xs">
                      <div className="w-7 h-7 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center mt-0.5">
                        <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="overflow-hidden flex-1">
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <p className="font-bold text-slate-900 text-xs line-clamp-1">{log.title}</p>
                          {isDeleted && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-rose-50 text-rose-600 border border-rose-200 rounded-md">
                              Dihapus
                            </span>
                          )}
                          {isAdded && (
                            <span className="text-[9px] font-extrabold px-1.5 py-0.2 bg-emerald-50 text-emerald-600 border border-emerald-200 rounded-md">
                              Dibuat
                            </span>
                          )}
                        </div>
                        <p className="text-[11px] text-slate-500 line-clamp-2 mt-0.5">{log.description}</p>
                        <span className="text-[10px] text-slate-400 mt-1 block">{log.timestamp}</span>
                      </div>
                    </div>
                  );
                })
              )}
            </div>
          </div>

          <div className="pt-3 border-t border-slate-100 mt-4 text-center">
            <span className="text-[10px] text-slate-500 font-medium">
              Semua aksi DPM & ormawa tercatat secara permanen.
            </span>
          </div>
        </Card>
      </div>
    </div>
  );
}
