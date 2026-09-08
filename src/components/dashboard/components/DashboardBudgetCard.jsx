import React from 'react';
import { Card } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { formatRupiah } from '../../../utils/formatters';

export default function DashboardBudgetCard({
  totalSerapan,
  totalPagu,
  serapanPercent,
  ormawas
}) {
  return (
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
            {formatRupiah(totalSerapan)}
          </h4>
          <p className="text-[11px] text-slate-500 mt-0.5">
            dari total anggaran {formatRupiah(totalPagu)}
          </p>

          {/* Progress Bar (Royal Blue) */}
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
                  <div className="w-2 h-2 rounded-full shrink-0" style={{ backgroundColor: o.color?.primary || '#2563EB' }} />
                  <span className="font-semibold text-slate-700 text-[11px]">{o.shortName}</span>
                </div>
                <div className="text-right font-medium text-slate-600 text-[11px]">
                  <span>{formatRupiah(o.serapanAnggaran)}</span>
                  <span className="text-[10px] text-slate-400 ml-1.5">({pct}%)</span>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-3 border-t border-slate-100 mt-4 text-center">
        <span className="text-[10px] text-slate-500 font-medium">
          Bukti nota &amp; kwitansi fisik diverifikasi pada saat audit LPJ.
        </span>
      </div>
    </Card>
  );
}
