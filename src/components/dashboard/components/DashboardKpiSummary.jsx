import React from 'react';
import { Card } from '@/components/ui/card';
import { 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle 
} from 'lucide-react';

export default function DashboardKpiSummary({
  avgScore,
  predikatAudit,
  onTimePercentage,
  pendingProposal,
  filteredProkers,
  completedProkers,
  totalProkers,
  overdueLPJ,
  activeSPCount
}) {
  return (
    <>
      {/* 1A. TOP HERO KPI CARDS KHUSUS MOBILE (< lg) — (2x2 Grid) */}
      <div className="lg:hidden grid grid-cols-2 gap-3">
        {/* Mobile Card 1: Skor Audit Ormawa */}
        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center justify-between min-h-[135px]">
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
        </div>

        {/* Mobile Card 2: Review Proposal DPM */}
        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center justify-between min-h-[135px]">
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
        </div>

        {/* Mobile Card 3: LPJ Terverifikasi */}
        <div className="p-3.5 rounded-2xl border border-slate-200/90 bg-white shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center justify-between min-h-[135px]">
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
        </div>

        {/* Mobile Card 4: Keterlambatan LPJ */}
        <div className={`p-3.5 rounded-2xl border shadow-2xs hover:shadow-xs transition flex flex-col items-center text-center justify-between min-h-[135px] ${
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
        </div>
      </div>

      {/* 1B. TOP HERO KPI CARDS DESKTOP (lg:grid) */}
      <div className="hidden lg:grid grid-cols-4 gap-4">
        {/* Card 1: Skor Audit Ormawa */}
        <Card className="rounded-3xl p-5 border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Skor Audit Ormawa
            </span>
            <div className="w-8 h-8 rounded-xl bg-blue-50 text-blue-600 border border-blue-100 flex items-center justify-center">
              <ShieldCheck className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {avgScore !== null ? avgScore : '—'}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              {avgScore !== null ? '/ 100 Poin' : 'Belum Dievaluasi'}
            </span>
          </div>
        </Card>

        {/* Card 2: Proposal Menunggu Review DPM */}
        <Card className="rounded-3xl p-5 border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Review Proposal DPM
            </span>
            <div className="w-8 h-8 rounded-xl bg-amber-50 text-amber-600 border border-amber-100 flex items-center justify-center">
              <FileText className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {pendingProposal}
            </h3>
            <span className="text-xs text-slate-500 font-medium">butuh review</span>
          </div>
        </Card>

        {/* Card 3: Proker Selesai & LPJ Disetujui */}
        <Card className="rounded-3xl p-5 border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              LPJ Terverifikasi Sah
            </span>
            <div className="w-8 h-8 rounded-xl bg-emerald-50 text-emerald-600 border border-emerald-100 flex items-center justify-center">
              <CheckCircle2 className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <h3 className="text-3xl font-black text-slate-900 tracking-tight">
              {completedProkers}
            </h3>
            <span className="text-xs text-slate-500 font-medium">
              dari {totalProkers} proker
            </span>
          </div>
        </Card>

        {/* Card 4: Keterlambatan LPJ (SLA Breach) */}
        <Card className={`rounded-3xl p-5 shadow-soft flex flex-col justify-between ${
          overdueLPJ > 0 ? 'border-rose-200 bg-rose-50/10' : 'border-slate-200/80'
        }`}>
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Keterlambatan LPJ
            </span>
            <div className={`w-8 h-8 rounded-xl flex items-center justify-center border ${
              overdueLPJ > 0 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-rose-50 text-rose-600 border-rose-100'
            }`}>
              <AlertTriangle className="w-4 h-4 stroke-[2]" />
            </div>
          </div>

          <div className="mt-3 flex items-baseline gap-2">
            <h3 className={`text-3xl font-black tracking-tight ${overdueLPJ > 0 ? 'text-rose-600' : 'text-slate-900'}`}>
              {overdueLPJ}
            </h3>
            <span className={`text-xs font-medium ${overdueLPJ > 0 ? 'text-rose-600 font-bold' : 'text-slate-500'}`}>
              {overdueLPJ > 0 ? 'melampaui batas H+14' : 'nihil pelanggaran'}
            </span>
          </div>
        </Card>
      </div>
    </>
  );
}
