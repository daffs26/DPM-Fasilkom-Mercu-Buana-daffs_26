import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { Card } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Table, TableHeader, TableBody, TableHead, TableRow, TableCell } from '@/components/ui/table';
import { 
  Clock,
  RotateCcw, 
  ShieldCheck, 
  FileText, 
  CheckCircle2, 
  AlertTriangle, 
  Layers, 
  ArrowRight 
} from 'lucide-react';
import { formatRupiah, formatDateIndo } from '@/utils/formatters';
import { TamuGuideCard } from '@/components/tamu/TamuComponents';

function ProposalBadge({ proposal }) {
  if (proposal?.reviewStatus === 'approved') {
    return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">✓ ACC DPM</span>;
  }
  if (proposal?.reviewStatus === 'revisi') {
    return <span className="inline-flex items-center gap-1 bg-amber-50 text-amber-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-amber-200/60">Perlu Revisi</span>;
  }
  if (proposal?.isDadakan) {
    return <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-red-200/60">⚠️ Terlambat (&lt; H-14)</span>;
  }
  if (proposal?.fileName) {
    return <span className="inline-flex items-center gap-1 bg-blue-50 text-blue-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-blue-200/60">Menunggu Review</span>;
  }
  return <span className="text-slate-400 text-[10px] italic">Belum Ada Berkas</span>;
}

function LpjBadge({ status, lpj }) {
  if (status === 'completed') {
    return <span className="inline-flex items-center gap-1 bg-emerald-50 text-emerald-700 text-[10px] font-bold px-2 py-0.5 rounded-full border border-emerald-200/60">✓ Selesai ({lpj?.auditScore})</span>;
  }
  if (status === 'lpj_overdue') {
    return <span className="inline-flex items-center gap-1 bg-red-50 text-red-700 text-[10px] font-extrabold px-2 py-0.5 rounded-full border border-red-300 animate-pulse">🔴 Keterlambatan LPJ</span>;
  }
  return <span className="text-slate-500 text-[10px]">Deadline: {lpj?.deadlineDate || '-'}</span>;
}

const DashboardScorecard = React.memo(function DashboardScorecard({
  isDpm = true,
  isGuest = false,
  selectedOrmawaFilter,
  setSelectedOrmawaFilter,
  ormawas,
  prokers
}) {
  const canViewAll = isDpm || isGuest;
  const isFiltered = selectedOrmawaFilter !== 'all';
  const activeOrmawa = isFiltered ? ormawas?.find(o => o.id === selectedOrmawaFilter) : null;

  return (
    <Card className="rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-start gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Indeks Kinerja Ormawa</h3>
            {isFiltered && activeOrmawa && (
              <span className="text-[10px] font-extrabold text-blue-700 bg-blue-100/70 border border-blue-200 px-2 py-0.5 rounded-full">
                Filter: {activeOrmawa.shortName}
              </span>
            )}
          </div>
        </div>

        <div className="flex items-center gap-2 self-start sm:self-auto shrink-0">
          {canViewAll && isFiltered && (
            <button
              type="button"
              onClick={() => setSelectedOrmawaFilter('all')}
              className="text-xs font-bold text-slate-600 hover:text-blue-700 bg-slate-100 hover:bg-blue-50 border border-slate-200/80 hover:border-blue-200 px-2.5 py-1 rounded-xl transition flex items-center gap-1.5 cursor-pointer shadow-2xs"
              title="Tampilkan data seluruh ormawa"
            >
              <RotateCcw className="w-3 h-3 text-slate-500" />
              <span>Semua Ormawa</span>
            </button>
          )}
          <p className="text-[10px] font-extrabold text-blue-600 bg-blue-50 border border-blue-100/80 px-2.5 py-1 rounded-full">
            Periode 2026/2027
          </p>
        </div>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 my-1">
        {ormawas.map((o) => {
          const oProkers = prokers.filter(p => p.ormawaId === o.id);
          const oAudited = oProkers.filter(p => p.lpj?.auditScore);
          const oScore = oAudited.length > 0 
            ? Math.round(oAudited.reduce((acc, p) => acc + p.lpj.auditScore, 0) / oAudited.length)
            : null;
          const hasOverdue = oProkers.some(p => p.status === 'lpj_overdue');
          const isSelected = selectedOrmawaFilter === o.id;

          return (
            <div 
              key={o.id}
              onClick={() => canViewAll && setSelectedOrmawaFilter(isSelected ? 'all' : o.id)}
              className={`p-3.5 sm:p-4 rounded-2xl border transition-all duration-200 flex flex-col items-center text-center justify-between min-h-[160px] relative group ${
                canViewAll ? 'cursor-pointer hover:shadow-xs' : 'cursor-default'
              } ${
                isSelected 
                  ? 'border-blue-500 bg-blue-50/40 ring-2 ring-blue-500/20 shadow-xs' 
                  : hasOverdue 
                  ? 'border-rose-200 bg-rose-50/20 hover:border-rose-300' 
                  : 'border-slate-200/80 bg-slate-50/40 hover:bg-white hover:border-blue-300'
              }`}
              title={canViewAll ? (isSelected ? 'Klik untuk reset filter' : `Klik untuk filter ${o.shortName}`) : o.name}
            >
              {isSelected && <span className="absolute top-2.5 right-2.5 w-2 h-2 rounded-full bg-blue-600 ring-4 ring-blue-100" />}
              <div className={`w-11 h-11 p-1 rounded-xl bg-white border shadow-2xs flex items-center justify-center mb-1 group-hover:scale-105 transition ${
                isSelected ? 'border-blue-200 shadow-blue-100' : 'border-slate-200/80'
              }`}>
                <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
              </div>

              <div>
                <h4 className={`font-extrabold text-xs transition ${isSelected ? 'text-blue-700' : 'text-slate-900 group-hover:text-blue-600'}`}>
                  {o.shortName}
                </h4>
              </div>

              <div className="my-1">
                <span className={`text-xl sm:text-2xl font-black tracking-tight ${isSelected ? 'text-blue-900' : 'text-slate-900'}`}>
                  {oScore !== null ? oScore : '-'}
                </span>
                {oScore !== null && <span className="text-[10px] text-slate-400 font-bold block">/100</span>}
              </div>

              <span className={`text-[8.5px] sm:text-[9px] px-2 sm:px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider shrink-0 max-w-full truncate block ${
                hasOverdue 
                  ? 'bg-rose-100 text-rose-700' 
                  : oScore !== null 
                  ? (oScore >= 85 ? 'bg-emerald-100 text-emerald-800' : 'bg-blue-100 text-blue-800')
                  : isSelected
                  ? 'bg-blue-100 text-blue-700 font-extrabold'
                  : 'bg-slate-100 text-slate-500'
              }`}>
                {hasOverdue 
                  ? 'Terlambat LPJ' 
                  : oScore !== null 
                  ? (oScore >= 85 ? 'Predikat A' : oScore >= 70 ? 'Predikat B' : 'Predikat C')
                  : isSelected ? 'Aktif' : 'Belum Dievaluasi'}
              </span>
            </div>
          );
        })}
      </div>
    </Card>
  );
});

function DashboardKpiSummary({
  avgScore,
  pendingProposal,
  completedProkers,
  totalProkers,
  overdueLPJ,
  activeOrmawa
}) {
  const ormawaName = activeOrmawa?.shortName || '';
  const cards = [
    {
      id: 'audit-score',
      title: ormawaName ? `Skor Audit ${ormawaName}` : 'Skor Audit Ormawa',
      mobileTitle: 'Skor Audit',
      mobileSubtitle: ormawaName ? `Kepatuhan ${ormawaName}` : 'Kepatuhan Ormawa',
      value: avgScore !== null ? avgScore : '-',
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
      iconBox: overdueLPJ > 0 ? 'bg-rose-100 text-rose-700 border-rose-200' : 'bg-rose-50 text-rose-600 border-rose-100/80',
      borderBg: overdueLPJ > 0 ? 'border-rose-200 bg-rose-50/20' : 'border-slate-200/90 bg-white',
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
          <div key={card.id} className={`p-3.5 sm:p-4 lg:p-5 rounded-2xl lg:rounded-3xl border shadow-2xs hover:shadow-xs transition flex flex-col justify-between min-h-[135px] lg:min-h-0 ${card.borderBg}`}>
            <div className="flex flex-col items-center text-center lg:flex-row lg:items-center lg:justify-between lg:text-left">
              <span className="hidden lg:inline-block text-[11px] font-bold text-slate-500 uppercase tracking-wider">{card.title}</span>
              <div className={`w-9 h-9 lg:w-8 lg:h-8 rounded-xl border shadow-2xs flex items-center justify-center mb-1 lg:mb-0 shrink-0 ${card.iconBox}`}>
                <Icon className="w-4 h-4 stroke-[2.2] lg:stroke-[2]" />
              </div>
              <div className="lg:hidden">
                <h4 className={`font-extrabold text-xs leading-tight ${card.titleColor || 'text-slate-900'}`}>{card.mobileTitle}</h4>
                <p className="text-[10px] text-slate-400 font-medium mt-0.5">{card.mobileSubtitle}</p>
              </div>
            </div>

            <div className="my-1 lg:my-0 lg:mt-3 flex flex-col items-center text-center lg:flex-row lg:items-baseline lg:text-left lg:gap-2">
              <span className={`text-xl sm:text-2xl lg:text-3xl font-black tracking-tight ${card.valueColor}`}>{card.value}</span>
              <span className={`text-[9.5px] sm:text-[10.5px] lg:text-xs block lg:inline font-medium leading-tight max-w-full truncate sm:whitespace-normal ${card.unitColor}`}>
                {card.unit}
              </span>
            </div>
          </div>
        );
      })}
    </div>
  );
}

function DashboardProkerTable({ filteredProkers, ormawas, onOpenAddProker, onReviewProposal, onAuditLPJ }) {
  const currentUser = useStore(state => state.currentUser);
  const isGuest = currentUser?.role === 'guest';

  return (
    <Card className="rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft">
      <div className="flex items-center justify-between pb-3.5 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">Status Pengawasan Program Kerja</h3>
        </div>
      </div>

      <div className="hidden lg:block mt-3.5 overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow className="border-b border-slate-100">
              <TableHead className="pb-3 whitespace-nowrap">Ormawa &amp; Kegiatan</TableHead>
              <TableHead className="pb-3 whitespace-nowrap">Jadwal Acara</TableHead>
              <TableHead className="pb-3 whitespace-nowrap">Status Proposal</TableHead>
              <TableHead className="pb-3 whitespace-nowrap">Status LPJ (H+14)</TableHead>
              <TableHead className="pb-3 text-right whitespace-nowrap">{isGuest ? 'Dokumen' : 'Aksi DPM'}</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredProkers.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="py-12 text-center">
                  <div className="flex flex-col items-center justify-center">
                    <div className="w-12 h-12 rounded-full bg-blue-50 text-blue-600 ring-8 ring-blue-50/50 flex items-center justify-center mb-3">
                      <Layers className="w-6 h-6 stroke-[1.8]" />
                    </div>
                    <h4 className="text-sm font-extrabold text-slate-900">Belum Ada Program Kerja</h4>
                    {!isGuest && (
                      <Button onClick={onOpenAddProker} className="mt-3" size="sm">
                        + Tambah Proker Baru
                      </Button>
                    )}
                  </div>
                </TableCell>
              </TableRow>
            ) : (
              filteredProkers.slice(0, 5).map((p) => {
                const ormawa = ormawas.find(o => o.id === p.ormawaId);
                return (
                  <TableRow key={p.id}>
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
                    <TableCell className="py-3 pr-3 text-slate-600 font-medium text-[11px] whitespace-nowrap">{formatDateIndo(p.startDate)}</TableCell>
                    <TableCell className="py-3 pr-3"><ProposalBadge proposal={p.proposal} /></TableCell>
                    <TableCell className="py-3 pr-3"><LpjBadge status={p.status} lpj={p.lpj} /></TableCell>
                    <TableCell className="py-3 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {p.proposal?.fileName && (
                          <Button variant="outline" size="sm" onClick={() => onReviewProposal(p)} className="h-7 px-2.5 text-[11px]">
                            {isGuest ? 'Proposal' : 'Review'}
                          </Button>
                        )}
                        {p.lpj?.fileName && (
                          <Button size="sm" onClick={() => onAuditLPJ(p)} className="h-7 px-2.5 text-[11px]">
                            {isGuest ? 'Lihat LPJ' : 'Audit'}
                          </Button>
                        )}
                      </div>
                    </TableCell>
                  </TableRow>
                );
              })
            )}
          </TableBody>
        </Table>
      </div>

      <div className="lg:hidden mt-3.5 space-y-3">
        {filteredProkers.length === 0 ? (
          <div className="py-8 text-center bg-slate-50/50 rounded-2xl border border-slate-200/80 p-4">
            <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 ring-6 ring-blue-50/50 flex items-center justify-center mx-auto mb-2">
              <Layers className="w-5 h-5 stroke-[1.8]" />
            </div>
            <h4 className="text-xs font-bold text-slate-800">Belum Ada Program Kerja</h4>
            <p className="text-[11px] text-slate-400 max-w-xs mx-auto mt-0.5">Daftarkan kegiatan baru atau ganti filter ormawa.</p>
          </div>
        ) : (
          filteredProkers.slice(0, 5).map((p) => {
            const ormawa = ormawas.find(o => o.id === p.ormawaId);
            return (
              <div key={`mob-proker-${p.id}`} className="p-3.5 rounded-2xl border border-slate-200/80 bg-slate-50/40 space-y-3">
                <div className="flex items-start gap-2.5">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-0.5 shrink-0 flex items-center justify-center mt-0.5">
                    <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2">{p.title}</h4>
                    <p className="text-[10px] text-slate-500 mt-0.5">{ormawa?.shortName} • PIC: {p.pic}</p>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-2 pt-2 border-t border-slate-200/60 text-xs">
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">Proposal:</span>
                    <ProposalBadge proposal={p.proposal} />
                  </div>
                  <div>
                    <span className="text-[10px] text-slate-400 block mb-0.5">LPJ (H+14):</span>
                    <LpjBadge status={p.status} lpj={p.lpj} />
                  </div>
                </div>

                <div className="pt-2 border-t border-slate-200/60 flex items-center justify-end gap-2">
                  {p.proposal?.fileName && (
                    <button
                      type="button"
                      onClick={() => onReviewProposal(p)}
                      className="flex-1 h-9 min-h-[38px] px-3 rounded-xl border border-slate-300 bg-white hover:bg-slate-100 text-slate-700 text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs"
                    >
                      {isGuest ? 'Lihat Proposal' : 'Review Proposal'}
                    </button>
                  )}
                  {p.lpj?.fileName && (
                    <button
                      type="button"
                      onClick={() => onAuditLPJ(p)}
                      className="flex-1 h-9 min-h-[38px] px-3 rounded-xl bg-slate-900 hover:bg-slate-800 text-white text-xs font-bold transition flex items-center justify-center cursor-pointer shadow-2xs"
                    >
                      {isGuest ? 'Lihat Lembar LPJ' : 'Audit LPJ'}
                    </button>
                  )}
                </div>
              </div>
            );
          })
        )}
      </div>
    </Card>
  );
}

function DashboardBudgetCard({ totalSerapan, totalPagu, serapanPercent, ormawas }) {
  return (
    <Card className="rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 pb-3.5 border-b border-slate-100 text-left">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm sm:text-base leading-tight text-left">Serapan Dana Kemahasiswaan</h3>
          <p className="text-[11px] text-slate-500 mt-0.5 text-left">Alokasi Anggaran Fakultas 2026</p>
        </div>
        <div className="flex items-center gap-2 text-xs font-semibold text-slate-600 bg-slate-50 px-3 py-1.5 rounded-xl border border-slate-200/60 self-start sm:self-auto">
          <span>Realisasi Total: <strong className="text-blue-600">{formatRupiah(totalSerapan)}</strong></span>
          <span className="text-slate-300">•</span>
          <span className="text-slate-500 font-bold">{serapanPercent}%</span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 my-5 items-stretch">
        <div className="lg:col-span-4 p-4 sm:p-5 rounded-2xl bg-slate-50/70 border border-slate-200/80 flex flex-col justify-between">
          <div>
            <span className="text-[10px] text-slate-400 font-extrabold uppercase tracking-wider block">TOTAL REALISASI DANA</span>
            <h4 className="text-2xl sm:text-3xl font-black text-slate-900 tracking-tight mt-1">{formatRupiah(totalSerapan)}</h4>
            <p className="text-[11px] text-slate-500 mt-0.5">dari total alokasi anggaran {formatRupiah(totalPagu)}</p>
          </div>

          <div className="mt-4">
            <div className="w-full bg-slate-200/80 h-2.5 rounded-full overflow-hidden">
              <div 
                className="bg-blue-600 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.min(serapanPercent, 100)}%` }} 
              />
            </div>
            <div className="flex justify-between items-center text-[10px] font-bold text-slate-400 mt-1.5">
              <span>0%</span>
              <span className="text-blue-600 font-extrabold">{serapanPercent}% Terserap</span>
              <span>100%</span>
            </div>
          </div>
        </div>

        <div className="lg:col-span-8 grid grid-cols-1 sm:grid-cols-2 gap-3">
          {ormawas.map((o) => {
            const pct = o.paguAnggaran > 0 ? Math.round((o.serapanAnggaran / o.paguAnggaran) * 100) : 0;
            return (
              <div 
                key={o.id} 
                className="p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:border-slate-300 transition-all flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-xs mb-2">
                  <div className="flex items-center gap-2">
                    <div className="w-2.5 h-2.5 rounded-full shrink-0" style={{ backgroundColor: o.color?.primary || '#2563EB' }} />
                    <span className="font-extrabold text-slate-800 text-xs">{o.name || o.shortName}</span>
                  </div>
                  <span className="text-[10px] font-black text-slate-700 bg-slate-100 px-2 py-0.5 rounded-md">
                    {pct}%
                  </span>
                </div>

                <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mb-2.5">
                  <div 
                    className="h-full rounded-full transition-all duration-500" 
                    style={{ width: `${Math.min(pct, 100)}%`, backgroundColor: o.color?.primary || '#2563EB' }} 
                  />
                </div>

                <div className="flex items-center justify-between text-[11px] text-slate-500">
                  <span>Realisasi Dana</span>
                  <strong className="text-slate-800 font-bold">{formatRupiah(o.serapanAnggaran)}</strong>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 flex items-center justify-between text-[11px] text-slate-400">
        <span>Berdasarkan pencatatan kas riil ormawa</span>
      </div>
    </Card>
  );
}

function DashboardActivityFeed({ activityLogs = [], ormawas = [] }) {
  const navigate = useNavigate();
  const setActiveTab = useStore((state) => state.setActiveTab);

  const handleOpenHistory = () => {
    setActiveTab('history');
    navigate('/history');
  };

  const getLogMeta = (log) => {
    if (log.type === 'proker_deleted') return { badgeText: 'Dihapus', badgeClass: 'bg-rose-50 text-rose-700 border-rose-200' };
    if (log.type === 'proker_added') return { badgeText: 'Dibuat', badgeClass: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
    if (log.title?.toLowerCase().includes('audit')) return { badgeText: 'Audit Selesai', badgeClass: 'bg-blue-50 text-blue-700 border-blue-200' };
    if (log.title?.toLowerCase().includes('revisi') || log.type?.includes('revisi')) return { badgeText: 'Revisi', badgeClass: 'bg-amber-50 text-amber-800 border-amber-200' };
    return { badgeText: 'Log Audit', badgeClass: 'bg-slate-100 text-slate-700 border-slate-200' };
  };

  const recentLogs = activityLogs.slice(0, 3);

  return (
    <Card className="rounded-3xl p-5 sm:p-6 border-slate-200/80 shadow-soft flex flex-col justify-start gap-4">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3.5 border-b border-slate-100 gap-2">
        <div className="flex items-center gap-2">
          <h3 className="font-extrabold text-slate-900 text-sm tracking-tight">Aktivitas &amp; Log Audit Terkini</h3>
          <div className="flex items-center gap-1.5 px-2 py-0.5 rounded-full bg-emerald-50 border border-emerald-200/80 text-emerald-700 text-[10px] font-bold">
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse" />
            <span>Live Feed</span>
          </div>
        </div>

        <button
          type="button"
          onClick={handleOpenHistory}
          className="text-xs font-bold text-blue-600 hover:text-blue-800 bg-blue-50/70 hover:bg-blue-100/70 border border-blue-200/60 px-3 py-2 rounded-xl transition flex items-center gap-1.5 cursor-pointer self-start sm:self-auto shrink-0 shadow-2xs min-h-[38px]"
          title="Buka halaman Histori Proker lengkap"
        >
          <span>Histori Lengkap</span>
          <ArrowRight className="w-3.5 h-3.5 text-blue-600" />
        </button>
      </div>

      {recentLogs.length === 0 ? (
        <div className="py-8 text-center flex flex-col items-center justify-center bg-slate-50/50 rounded-2xl border border-dashed border-slate-200">
          <div className="w-10 h-10 rounded-full bg-blue-50 text-blue-600 flex items-center justify-center mb-2">
            <Clock className="w-5 h-5 stroke-[1.8]" />
          </div>
          <h4 className="text-xs font-extrabold text-slate-900">Belum Ada Catatan Log</h4>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5">
          {recentLogs.map((log) => {
            const ormawa = ormawas.find((o) => o.id === log.ormawaId);
            const meta = getLogMeta(log);

            return (
              <div
                key={log.id}
                className="p-4 rounded-2xl bg-slate-50/50 hover:bg-white border border-slate-200/80 hover:border-blue-200/80 hover:shadow-xs transition-all duration-200 flex flex-col justify-between group"
              >
                <div>
                  <div className="flex items-center justify-between gap-2 mb-2.5">
                    <div className="flex items-center gap-2 min-w-0">
                      <div className="w-7 h-7 rounded-xl bg-white border border-slate-200 shadow-2xs p-1 shrink-0 flex items-center justify-center overflow-hidden">
                        {ormawa?.logo ? (
                          <img
                            src={ormawa.logo}
                            alt={ormawa.name || 'Ormawa'}
                            className="w-full h-full object-contain"
                            onError={(e) => { e.currentTarget.style.display = 'none'; }}
                          />
                        ) : (
                          <span className="text-[10px] font-black text-slate-600 uppercase">
                            {ormawa?.shortName?.slice(0, 2) || 'OR'}
                          </span>
                        )}
                      </div>
                      <span className="font-extrabold text-xs text-slate-800 truncate">
                        {ormawa?.shortName || 'Ormawa'}
                      </span>
                    </div>

                    <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border shrink-0 uppercase tracking-wide ${meta.badgeClass}`}>
                      {meta.badgeText}
                    </span>
                  </div>

                  <h4 className="font-bold text-slate-900 text-xs leading-snug line-clamp-2 group-hover:text-blue-600 transition">
                    {log.title}
                  </h4>
                  <p className="text-[11px] text-slate-500 mt-1 line-clamp-2 leading-relaxed">
                    {log.description}
                  </p>
                </div>

                <div className="pt-2.5 mt-2.5 border-t border-slate-200/60 flex items-center justify-between text-[10px] text-slate-400">
                  <div className="flex items-center gap-1">
                    <Clock className="w-3.5 h-3.5 text-slate-400" />
                    <span>{log.timestamp}</span>
                  </div>
                  <span className="font-semibold text-slate-600 truncate max-w-[110px]">{log.actor}</span>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </Card>
  );
}

export default function DashboardView({ onOpenAddProker, onReviewProposal, onAuditLPJ }) {
  const { 
    ormawas, 
    prokers, 
    selectedOrmawaFilter, 
    setSelectedOrmawaFilter, 
    activityLogs, 
    currentUser 
  } = useStore(useShallow(state => ({ 
    ormawas: state.ormawas, 
    prokers: state.prokers, 
    selectedOrmawaFilter: state.selectedOrmawaFilter, 
    setSelectedOrmawaFilter: state.setSelectedOrmawaFilter, 
    activityLogs: state.activityLogs, 
    currentUser: state.currentUser 
  })));

  const isGuest = currentUser?.role === 'guest';
  const isDpm = currentUser?.ormawaId === 'dpm' && !isGuest;
  const effectiveOrmawaFilter = (isDpm || isGuest) ? selectedOrmawaFilter : (currentUser?.ormawaId || 'bem');

  const filteredProkers = effectiveOrmawaFilter === 'all'
    ? prokers
    : prokers.filter(p => p.ormawaId === effectiveOrmawaFilter);

  const totalProkers = filteredProkers.length;
  const pendingProposal = filteredProkers.filter(p => p.status === 'proposal_pending').length;
  const completedProkers = filteredProkers.filter(p => p.status === 'completed').length;
  const overdueLPJ = filteredProkers.filter(p => p.status === 'lpj_overdue').length;

  const prokersWithAudit = filteredProkers.filter(p => p.lpj?.auditScore);
  const avgScore = prokersWithAudit.length > 0
    ? Math.round(prokersWithAudit.reduce((acc, p) => {
        const val = typeof p.lpj.auditScore === 'number' ? p.lpj.auditScore : parseInt(p.lpj.auditScore, 10);
        return acc + (isNaN(val) ? 0 : val);
      }, 0) / prokersWithAudit.length)
    : null;

  const activeOrmawa = effectiveOrmawaFilter === 'all' ? null : ormawas.find(o => o.id === effectiveOrmawaFilter);
  const totalPagu = activeOrmawa ? activeOrmawa.paguAnggaran : ormawas.reduce((acc, o) => acc + o.paguAnggaran, 0);
  const totalSerapan = activeOrmawa ? activeOrmawa.serapanAnggaran : ormawas.reduce((acc, o) => acc + o.serapanAnggaran, 0);
  const serapanPercent = totalPagu > 0 ? Math.round((totalSerapan / totalPagu) * 100) : 0;

  return (
    <div className="space-y-6">
      {isGuest && <TamuGuideCard />}

      <DashboardScorecard
        isDpm={isDpm}
        isGuest={isGuest}
        selectedOrmawaFilter={effectiveOrmawaFilter}
        setSelectedOrmawaFilter={setSelectedOrmawaFilter}
        ormawas={ormawas}
        prokers={prokers}
      />

      {effectiveOrmawaFilter !== 'all' && (
        <div className="animate-in fade-in-50 duration-200">
          <DashboardKpiSummary
            avgScore={avgScore}
            pendingProposal={pendingProposal}
            completedProkers={completedProkers}
            totalProkers={totalProkers}
            overdueLPJ={overdueLPJ}
            activeOrmawa={activeOrmawa}
          />
        </div>
      )}

      {/* 1. Card Serapan Dana Kemahasiswaan (Horizontal Full-Width) */}
      <DashboardBudgetCard
        totalSerapan={totalSerapan}
        totalPagu={totalPagu}
        serapanPercent={serapanPercent}
        ormawas={ormawas}
      />

      {/* 2. Card Status Pengawasan Program Kerja (Horizontal Full-Width) */}
      <DashboardProkerTable
        filteredProkers={filteredProkers}
        ormawas={ormawas}
        onOpenAddProker={onOpenAddProker}
        onReviewProposal={onReviewProposal}
        onAuditLPJ={onAuditLPJ}
      />

      <DashboardActivityFeed activityLogs={activityLogs} ormawas={ormawas} />
    </div>
  );
}
