import React, { useState } from 'react';
import { 
  Award, 
  Clock, 
  Users, 
  Coins, 
  FileCheck, 
  Target, 
  ChevronDown, 
  ChevronUp, 
  Sparkles 
} from 'lucide-react';

const AUDIT_PARAMETERS = [
  {
    no: '01',
    title: 'Kedisiplinan Rundown',
    bobot: '20 Poin',
    pct: '20%',
    desc: 'Acara dibuka & ditutup tepat waktu; rundown terlaksana tertib di lapangan.',
    icon: Clock,
    iconColor: 'text-amber-600',
    iconBg: 'bg-amber-50 border-amber-200'
  },
  {
    no: '02',
    title: 'Capaian Target Peserta',
    bobot: '20 Poin',
    pct: '20%',
    desc: 'Kehadiran peserta mencapai minimal 80%–100% dari target kuota proposal.',
    icon: Users,
    iconColor: 'text-blue-600',
    iconBg: 'bg-blue-50 border-blue-200'
  },
  {
    no: '03',
    title: 'Efisiensi Anggaran',
    bobot: '20 Poin',
    pct: '20%',
    desc: 'Pengeluaran sesuai RAB, tidak defisit tak terduga, dan bukti nota sah terlampir.',
    icon: Coins,
    iconColor: 'text-emerald-600',
    iconBg: 'bg-emerald-50 border-emerald-200'
  },
  {
    no: '04',
    title: 'Kepatuhan SLA Berkas',
    bobot: '20 Poin',
    pct: '20%',
    desc: 'Proposal masuk ≥ H-14 dan berkas LPJ diserahkan selambatnya ≤ H+14.',
    icon: FileCheck,
    iconColor: 'text-indigo-600',
    iconBg: 'bg-indigo-50 border-indigo-200'
  },
  {
    no: '05',
    title: 'Mutu Output Acara',
    bobot: '20 Poin',
    pct: '20%',
    desc: 'Hasil kegiatan tercapai secara nyata sesuai visi & tupoksi ormawa.',
    icon: Target,
    iconColor: 'text-rose-600',
    iconBg: 'bg-rose-50 border-rose-200'
  }
];

export default function AuditParameterStandards() {
  const [isExpanded, setIsExpanded] = useState(true);

  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden transition-all duration-300">
      {/* Header Bar */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-3">
        <div className="flex items-center gap-3">
          <div className="w-9 h-9 rounded-2xl bg-amber-50 text-amber-600 flex items-center justify-center shrink-0 shadow-2xs">
            <Award className="w-5 h-5" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">
                Matriks Parameter Audit Keberhasilan Proker
              </h3>
              <span className="hidden sm:inline-flex text-[10px] font-extrabold text-blue-700 bg-blue-50 border border-blue-200 px-2 py-0.5 rounded-full">
                5 Pilar Mutu
              </span>
            </div>
            <p className="text-[11px] text-slate-500 mt-0.5 leading-snug">
              Standar baku evaluasi akuntabilitas & kelayakan LPJ (Skor 0–100 Poin)
            </p>
          </div>
        </div>

        {/* Action Controls: Tag Regulasi & Tombol Toggle Ringkas */}
        <div className="flex items-center gap-2 self-end sm:self-auto shrink-0">
          <span className="text-[10px] font-extrabold text-slate-700 bg-slate-100 border border-slate-200 px-2.5 py-1 rounded-xl">
            Regulasi DPM 2026/2027
          </span>
          <button
            type="button"
            onClick={() => setIsExpanded(!isExpanded)}
            className="flex items-center gap-1.5 px-3 py-1 bg-slate-50 hover:bg-slate-100 text-slate-700 hover:text-slate-900 border border-slate-200/80 rounded-xl text-xs font-bold transition shadow-2xs cursor-pointer"
            title={isExpanded ? 'Ringkas Tampilan Parameter' : 'Tampilkan Detail 5 Parameter'}
          >
            {isExpanded ? (
              <>
                <ChevronUp className="w-3.5 h-3.5 text-slate-500" />
                <span>Ringkas</span>
              </>
            ) : (
              <>
                <ChevronDown className="w-3.5 h-3.5 text-slate-500" />
                <span>Detail</span>
              </>
            )}
          </button>
        </div>
      </div>

      {/* State A: Tampilan Ringkas (Compact Pill Row) Saat Collapsed */}
      {!isExpanded ? (
        <div className="pt-3.5 flex flex-wrap items-center justify-between gap-2 text-xs">
          <div className="flex flex-wrap items-center gap-2">
            {AUDIT_PARAMETERS.map((param) => {
              const Icon = param.icon;
              return (
                <div 
                  key={param.no}
                  className="flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-slate-50 border border-slate-200/80 text-slate-700 text-[11px] font-bold shadow-2xs"
                >
                  <Icon className={`w-3.5 h-3.5 ${param.iconColor}`} />
                  <span>{param.title}</span>
                  <span className="text-[9px] px-1 py-0.2 bg-white border border-slate-200 rounded font-mono text-slate-500">
                    20p
                  </span>
                </div>
              );
            })}
          </div>
          <div className="text-[11px] font-extrabold text-slate-800 bg-amber-50/80 border border-amber-200 px-2.5 py-1 rounded-xl flex items-center gap-1">
            <Sparkles className="w-3.5 h-3.5 text-amber-600" />
            <span>Total: 100 Poin</span>
          </div>
        </div>
      ) : (
        /* State B: Tampilan Detail (5 Polished Interactive Cards) */
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3 pt-4">
          {AUDIT_PARAMETERS.map((param) => {
            const Icon = param.icon;
            return (
              <div 
                key={param.no} 
                className="p-3.5 bg-slate-50/70 hover:bg-white rounded-2xl border border-slate-200/80 hover:border-blue-200 flex flex-col justify-between transition-all duration-200 hover:shadow-2xs group"
              >
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <div className={`w-7 h-7 rounded-xl flex items-center justify-center border ${param.iconBg} ${param.iconColor} shadow-2xs`}>
                      <Icon className="w-3.5 h-3.5" />
                    </div>
                    <span className="text-[10px] font-extrabold bg-white border border-slate-200 text-slate-800 px-2 py-0.5 rounded-full shadow-2xs">
                      {param.bobot}
                    </span>
                  </div>
                  <h4 className="font-extrabold text-slate-900 text-xs mb-1 group-hover:text-blue-600 transition">
                    {param.title}
                  </h4>
                  <p className="text-[11px] text-slate-600 leading-relaxed">
                    {param.desc}
                  </p>
                </div>
                <div className="pt-2 mt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400 font-mono">
                  <span>Pilar #{param.no}</span>
                  <span className="font-bold text-slate-600">Bobot {param.pct}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
