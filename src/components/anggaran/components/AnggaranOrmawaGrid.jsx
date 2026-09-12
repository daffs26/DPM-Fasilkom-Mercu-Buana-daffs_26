import React from 'react';
import { Settings2, ArrowDownLeft, ArrowUpRight, Check } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';

export default function AnggaranOrmawaGrid({ 
  filteredOrmawas, 
  onOpenSetPagu,
  selectedOrmawaFilter,
  setSelectedOrmawaFilter,
  onOpenAddTransaction
}) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden">
      <div className="flex flex-col sm:flex-row sm:items-center justify-between pb-3 border-b border-slate-100 gap-2">
        <div>
          <div className="flex items-center gap-2">
            <h3 className="font-extrabold text-slate-900 text-sm">
              Alokasi &amp; Serapan Anggaran Ormawa
            </h3>
            {selectedOrmawaFilter !== 'all' && (
              <button
                type="button"
                onClick={() => setSelectedOrmawaFilter('all')}
                className="text-[10px] font-bold text-blue-600 bg-blue-50 hover:bg-blue-100 px-2 py-0.5 rounded-full border border-blue-200/60 transition cursor-pointer"
                title="Tampilkan semua ormawa"
              >
                Reset Pilihan ×
              </button>
            )}
          </div>
          <p className="text-xs text-slate-500 mt-0.5">
            Klik pada salah satu kartu ormawa untuk mengelola pencatatan kas masuk &amp; keluar
          </p>
        </div>
        {onOpenSetPagu && (
          <button
            type="button"
            onClick={onOpenSetPagu}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1 cursor-pointer self-start sm:self-center"
          >
            <Settings2 className="w-3.5 h-3.5" />
            <span>Ubah Anggaran</span>
          </button>
        )}
      </div>

      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 mt-4">
        {filteredOrmawas.map(o => {
          const isSelected = selectedOrmawaFilter === o.id;
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
              onClick={() => setSelectedOrmawaFilter && setSelectedOrmawaFilter(isSelected ? 'all' : o.id)}
              className={`p-4 rounded-2xl border transition-all duration-200 flex flex-col justify-between space-y-3 cursor-pointer group ${
                isSelected 
                  ? 'border-blue-500 ring-2 ring-blue-500/20 bg-blue-50/20 shadow-md' 
                  : 'border-slate-200/80 bg-slate-50/50 hover:bg-white hover:border-blue-300 hover:shadow-xs'
              }`}
              title={`Klik untuk memilih ${o.shortName}`}
            >
              {/* Header Kartu */}
              <div className="flex items-center justify-between gap-2">
                <div className="flex items-center gap-2 min-w-0">
                  <div className="w-8 h-8 rounded-xl bg-white border border-slate-200 p-1 shrink-0 flex items-center justify-center shadow-2xs group-hover:scale-105 transition">
                    <img src={o.logo} alt={o.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0">
                    <h4 className="font-extrabold text-xs text-slate-900 truncate flex items-center gap-1">
                      <span>{o.shortName}</span>
                      {isSelected && <Check className="w-3 h-3 text-blue-600 shrink-0" />}
                    </h4>
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

              {/* 2 Tombol Terpisah Muncul Ketika Ormawa Dipilih */}
              {isSelected && onOpenAddTransaction && (
                <div 
                  className="pt-2.5 mt-1 border-t border-blue-200/60 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onOpenAddTransaction('pemasukan', o.id)}
                    className="flex-1 min-w-0 h-8 px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/90 font-bold text-[10.5px] transition flex items-center justify-center gap-1 shadow-2xs active:scale-95 cursor-pointer whitespace-nowrap"
                    title={`Catat Pemasukan Kas ${o.shortName}`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="whitespace-nowrap leading-none">+ Pemasukan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAddTransaction('pengeluaran', o.id)}
                    className="flex-1 min-w-0 h-8 px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[10.5px] shadow-xs transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
                    title={`Catat Pengeluaran Kas ${o.shortName}`}
                  >
                    <ArrowUpRight className="w-3.5 h-3.5 text-blue-100 shrink-0" />
                    <span className="whitespace-nowrap leading-none">+ Pengeluaran</span>
                  </button>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
