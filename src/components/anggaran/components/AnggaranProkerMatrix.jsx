import React from 'react';
import { FileSpreadsheet, ChevronDown, ChevronUp } from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';

export default function AnggaranProkerMatrix({
  filteredProkers,
  ormawas,
  collapsedCards,
  toggleCollapse
}) {
  if (filteredProkers.length === 0) {
    return (
      <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-slate-200/80 p-6">
        <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h4 className="text-xs font-bold text-slate-800">Belum Ada Program Kerja Terdaftar</h4>
        <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
          Daftarkan program kerja terlebih dahulu untuk melihat perbandingan alokasi RAB dan realisasi dana.
        </p>
      </div>
    );
  }

  return (
    <>
      {/* Tampilan Mobile: Card Vertikal Anti-Overflow (0 Scroll Horizontal) */}
      <div className="lg:hidden space-y-3">
        {filteredProkers.map((p) => {
          const ormawa = ormawas.find(o => o.id === p.ormawaId);
          const rab = p.rab || 0;
          const realisasi = p.realisasiDana || 0;
          const selisih = rab - realisasi;
          const isDefisit = selisih < 0;
          const percent = rab > 0 ? Math.round((realisasi / rab) * 100) : 0;
          const isCollapsed = collapsedCards[p.id];

          return (
            <div 
              key={`mob-proker-budget-${p.id}`}
              className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-2.5 w-full max-w-full overflow-hidden"
            >
              <div 
                onClick={() => toggleCollapse(p.id)}
                className="flex items-start justify-between gap-2 cursor-pointer select-none"
              >
                <div className="flex items-center gap-2.5 min-w-0 flex-1">
                  <div className="w-8 h-8 rounded-xl bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                    <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <h4 className="font-bold text-xs text-slate-900 leading-snug truncate">{p.title}</h4>
                    <p className="text-[10px] text-slate-500 truncate">{ormawa?.shortName} • PIC: {p.pic}</p>
                  </div>
                </div>

                <div className="flex items-center gap-1.5 shrink-0">
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${
                    isDefisit 
                      ? 'bg-red-50 text-red-700 border-red-200' 
                      : percent === 100 
                      ? 'bg-blue-50 text-blue-700 border-blue-200' 
                      : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                  }`}>
                    {isDefisit ? 'Defisit' : percent === 100 ? '100% Sesuai' : 'Efisien'}
                  </span>
                  <button
                    type="button"
                    className="p-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/60"
                  >
                    {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs animate-in fade-in-50 duration-150">
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">Alokasi RAB:</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {formatRupiah(rab)}
                      </span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">Realisasi Kas:</span>
                      <span className="font-extrabold text-slate-900 text-xs">
                        {formatRupiah(realisasi)}
                      </span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">
                        {isDefisit ? 'Kekurangan / Defisit:' : 'Sisa Dana Hemat:'}
                      </span>
                      <span className={`font-extrabold text-xs ${isDefisit ? 'text-red-600' : 'text-emerald-600'}`}>
                        {formatRupiah(Math.abs(selisih))}
                      </span>
                    </div>
                  </div>

                  {/* Progress bar per proker */}
                  <div className="px-1">
                    <div className="flex justify-between text-[10px] font-bold text-slate-600 mb-0.5">
                      <span>Serapan Realisasi:</span>
                      <span>{percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div 
                        className={`h-full rounded-full ${isDefisit ? 'bg-red-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      {/* Tampilan Desktop: Tabel Komprehensif */}
      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-slate-200 text-[10px] font-extrabold text-slate-500 uppercase tracking-wider bg-slate-50/50">
              <th className="py-2.5 px-3">Program Kerja &amp; Ormawa</th>
              <th className="py-2.5 px-3 text-right">Alokasi RAB Awal</th>
              <th className="py-2.5 px-3 text-right">Realisasi Dana</th>
              <th className="py-2.5 px-3 text-right">Selisih / Efisiensi</th>
              <th className="py-2.5 px-3 text-center">Persentase</th>
              <th className="py-2.5 px-3 text-center">Status Audit</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProkers.map((p) => {
              const ormawa = ormawas.find(o => o.id === p.ormawaId);
              const rab = p.rab || 0;
              const realisasi = p.realisasiDana || 0;
              const selisih = rab - realisasi;
              const isDefisit = selisih < 0;
              const percent = rab > 0 ? Math.round((realisasi / rab) * 100) : 0;

              return (
                <tr key={`desk-proker-budget-${p.id}`} className="hover:bg-slate-50/60 transition">
                  <td className="py-3 px-3">
                    <div className="flex items-center gap-2.5">
                      <div className="w-7 h-7 rounded-lg bg-slate-50 border border-slate-200 p-0.5 shrink-0 flex items-center justify-center">
                        <img src={ormawa?.logo} alt={ormawa?.name} className="w-full h-full object-contain" />
                      </div>
                      <div className="min-w-0">
                        <span className="font-bold text-slate-900 block truncate">{p.title}</span>
                        <span className="text-[10px] text-slate-500">{ormawa?.shortName} • PIC: {p.pic}</span>
                      </div>
                    </div>
                  </td>

                  <td className="py-3 px-3 text-right font-extrabold text-slate-800">
                    {formatRupiah(rab)}
                  </td>

                  <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                    {formatRupiah(realisasi)}
                  </td>

                  <td className="py-3 px-3 text-right">
                    <span className={`font-bold ${isDefisit ? 'text-red-600' : 'text-emerald-600'}`}>
                      {isDefisit ? '- ' : '+ '}{formatRupiah(Math.abs(selisih))}
                    </span>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className="font-bold text-xs text-slate-700">{percent}%</span>
                    <div className="w-16 h-1.5 bg-slate-200 rounded-full mx-auto mt-1 overflow-hidden">
                      <div 
                        className={`h-full ${isDefisit ? 'bg-red-500' : 'bg-blue-600'}`}
                        style={{ width: `${Math.min(100, percent)}%` }}
                      />
                    </div>
                  </td>

                  <td className="py-3 px-3 text-center">
                    <span className={`text-[10px] font-extrabold px-2.5 py-0.5 rounded-full border ${
                      isDefisit 
                        ? 'bg-red-50 text-red-700 border-red-200' 
                        : percent === 100 
                        ? 'bg-blue-50 text-blue-700 border-blue-200' 
                        : 'bg-emerald-50 text-emerald-700 border-emerald-200'
                    }`}>
                      {isDefisit ? 'Defisit' : percent === 100 ? 'Sesuai Anggaran' : 'Efisien'}
                    </span>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </>
  );
}
