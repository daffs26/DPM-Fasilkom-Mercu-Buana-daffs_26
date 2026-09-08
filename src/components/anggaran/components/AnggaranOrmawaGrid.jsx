import React from 'react';
import { Settings2 } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';

export default function AnggaranOrmawaGrid({ filteredOrmawas, onOpenSetPagu }) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
      <div className="flex items-center justify-between pb-3 border-b border-slate-100">
        <div>
          <h3 className="font-extrabold text-slate-900 text-sm">
            Alokasi &amp; Serapan Anggaran Ormawa
          </h3>
          <p className="text-xs text-slate-500 mt-0.5">
            Rincian alokasi dana resmi per ormawa beserta tingkat serapan kas berjalan
          </p>
        </div>
        <button
          type="button"
          onClick={onOpenSetPagu}
          className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer"
        >
          <Settings2 className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">Ubah Anggaran</span>
        </button>
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {filteredOrmawas.map(o => {
          const pagu = o.paguAnggaran || 0;
          const serapan = o.serapanAnggaran || 0;
          const sisa = Math.max(0, pagu - serapan);
          const percent = pagu > 0 ? Math.round((serapan / pagu) * 100) : 0;

          let statusBadge = { label: 'Aman', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
          if (percent > 100) {
            statusBadge = { label: 'Over-Budget', color: 'bg-red-50 text-red-700 border-red-300' };
          } else if (percent >= 85) {
            statusBadge = { label: 'Kritis', color: 'bg-amber-50 text-amber-700 border-amber-200' };
          } else if (percent >= 50) {
            statusBadge = { label: 'Optimal', color: 'bg-blue-50 text-blue-700 border-blue-200' };
          }

          return (
            <div 
              key={`pagu-card-${o.id}`}
              className="p-4 rounded-2xl border border-slate-200/80 bg-slate-50/50 hover:bg-slate-50 transition flex flex-col justify-between space-y-3"
            >
              {/* Header Kartu */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 shrink-0 flex items-center justify-center shadow-2xs">
                    <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-900 truncate">{o.shortName}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{o.type}</p>
                  </div>
                </div>
                <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border shrink-0 ${statusBadge.color}`}>
                  {statusBadge.label}
                </span>
              </div>

              {/* Angka Finansial */}
              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[11px] text-slate-500">Alokasi Anggaran:</span>
                  <span className="font-extrabold text-slate-900 text-xs">
                    {formatRupiah(pagu)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[11px] text-slate-500">Dana Terserap:</span>
                  <span className="font-bold text-amber-700 text-xs">
                    {formatRupiah(serapan)}
                  </span>
                </div>
                <div className="flex justify-between items-baseline text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500">Sisa Anggaran:</span>
                  <span className="font-extrabold text-emerald-700 text-xs">
                    {formatRupiah(sisa)}
                  </span>
                </div>
              </div>

              {/* Progress Bar Serapan */}
              <div>
                <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-1">
                  <span>Serapan Anggaran</span>
                  <span>{percent}%</span>
                </div>
                <div className="w-full h-2 bg-slate-200 rounded-full overflow-hidden">
                  <div 
                    className={`h-full rounded-full transition-all duration-300 ${
                      percent > 100 ? 'bg-red-500' : percent >= 85 ? 'bg-amber-500' : 'bg-blue-600'
                    }`}
                    style={{ width: `${Math.min(100, percent)}%` }}
                  />
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
