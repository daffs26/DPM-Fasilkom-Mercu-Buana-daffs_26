import React from 'react';
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
  const cards = [
    {
      id: 'audit-score',
      title: 'Skor Audit Ormawa',
      mobileTitle: 'Skor Audit',
      mobileSubtitle: 'Kepatuhan Ormawa',
      value: avgScore !== null ? avgScore : '—',
      unit: avgScore !== null ? '/ 100 Poin' : 'Belum Dievaluasi',
      icon: ShieldCheck,
      iconBox: 'bg-blue-50 text-blue-600 border-blue-100/80',
      borderBg: 'border-slate-200/90 bg-white',
      valueColor: 'text-slate-900',
      unitColor: 'text-slate-400 lg:text-slate-500'
    },
    {
      id: 'review-proposal',
      title: 'Review Proposal DPM',
      mobileTitle: 'Review Proposal',
      mobileSubtitle: 'Batas Waktu H-14',
      value: pendingProposal,
      unit: 'butuh review DPM',
      icon: FileText,
      iconBox: 'bg-amber-50 text-amber-600 border-amber-100/80',
      borderBg: 'border-slate-200/90 bg-white',
      valueColor: 'text-slate-900',
      unitColor: 'text-slate-400 lg:text-slate-500'
    },
    {
      id: 'lpj-verified',
      title: 'LPJ Terverifikasi Sah',
      mobileTitle: 'LPJ Terverifikasi',
      mobileSubtitle: 'Capaian Proker',
      value: completedProkers,
      unit: `dari ${totalProkers} proker`,
      icon: CheckCircle2,
      iconBox: 'bg-emerald-50 text-emerald-600 border-emerald-100/80',
      borderBg: 'border-slate-200/90 bg-white',
      valueColor: 'text-slate-900',
      unitColor: 'text-slate-400 lg:text-slate-500'
    },
    {
      id: 'lpj-overdue',
      title: 'Keterlambatan LPJ',
      mobileTitle: 'Keterlambatan LPJ',
      mobileSubtitle: 'Batas Waktu H+14',
      value: overdueLPJ,
      unit: overdueLPJ > 0 ? 'Melampaui Batas H+14' : 'Nihil Keterlambatan',
      icon: AlertTriangle,
      iconBox: overdueLPJ > 0 
        ? 'bg-rose-100 text-rose-700 border-rose-200' 
        : 'bg-rose-50 text-rose-600 border-rose-100/80',
      borderBg: overdueLPJ > 0 
        ? 'border-rose-200 bg-rose-50/20' 
        : 'border-slate-200/90 bg-white',
      valueColor: overdueLPJ > 0 ? 'text-rose-600' : 'text-slate-900',
      unitColor: overdueLPJ > 0 ? 'text-rose-600 font-bold' : 'text-slate-400 lg:text-slate-500',
      titleColor: overdueLPJ > 0 ? 'text-rose-900' : 'text-slate-900'
    }
  ];

  return (
    <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4">
      {cards.map((card) => {
        const Icon = card.icon;
        return (
          <div
            key={card.id}
            className={`p-3.5 sm:p-4 lg:p-5 rounded-2xl lg:rounded-3xl border shadow-2xs hover:shadow-xs transition flex flex-col justify-between min-h-[135px] lg:min-h-0 ${card.borderBg}`}
          >
            {/* Top row / header */}
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
              {/* Desktop Title */}
              <span className="hidden lg:inline-block text-[11px] font-bold text-slate-500 uppercase tracking-wider">
                {card.title}
              </span>

              {/* Mobile Icon */}
              <div className={`w-9 h-9 lg:w-8 lg:h-8 rounded-xl border shadow-2xs flex items-center justify-center mb-1 lg:mb-0 shrink-0 ${card.iconBox}`}>
                <Icon className="w-4 h-4 stroke-[2.2] lg:stroke-[2]" />
              </div>

              {/* Mobile Title + Subtitle */}
              <div className="lg:hidden">
                <h4 className={`font-extrabold text-xs leading-tight ${card.titleColor || 'text-slate-900'}`}>
                  {card.mobileTitle}
                </h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">
                  {card.mobileSubtitle}
                </p>
              </div>
            </div>

            {/* Bottom row / value */}
            <div className="my-1 lg:my-0 lg:mt-3 flex flex-col items-center text-center lg:flex-row lg:items-baseline lg:text-left lg:gap-2">
              <span className={`text-2xl lg:text-3xl font-black tracking-tight ${card.valueColor}`}>
                {card.value}
              </span>
              <span className={`text-[10px] lg:text-xs block lg:inline font-medium ${card.unitColor}`}>
                {card.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}
