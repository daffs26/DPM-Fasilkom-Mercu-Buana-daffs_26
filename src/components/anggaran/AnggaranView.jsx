import React, { useState, useMemo } from 'react';
import { useStore } from '@/store/useStore';
import { useShallow } from 'zustand/react/shallow';
import { 
  Wallet, 
  Settings2, 
  FileSpreadsheet, 
  Printer, 
  Download,
  Loader2,
  ArrowDownLeft,
  ArrowUpRight,
  Coins,
  ArrowDownRight,
  Scale,
  Check,
  ChevronDown,
  ChevronUp,
  Receipt,
  FileImage,
  Eye,
  Trash2,
  ExternalLink
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription, 
  DialogFooter 
} from '@/components/ui/dialog';
import { exportFinancialWorkbook, exportFormattedCSV } from '@/utils/exportExcel';
import { formatRupiah, getTransactionTypeBadge } from '@/utils/formatters';

const ORMAWA_DISPLAY_NAMES = {
  dpm: 'DPM Fasilkom',
  bem: 'BEM Fasilkom',
  himti: 'HIMTI',
  himsisfo: 'HIMSISFO'
};

function KpiCard({ title, value, subtitle, icon: Icon, iconBg, iconColor, percent, progressColor }) {
  return (
    <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
      <div className="flex items-center justify-between mb-2">
        <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">{title}</span>
        <div className={`w-7 h-7 rounded-xl flex items-center justify-center ${iconBg} ${iconColor}`}>
          <Icon className="w-3.5 h-3.5" />
        </div>
      </div>
      <div>
        <div className="flex items-baseline gap-2">
          <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">{value}</h3>
          {percent !== undefined && (
            <span className={`text-[10px] font-bold px-1.5 py-0.2 rounded-md ${iconBg} ${iconColor}`}>
              {percent}
            </span>
          )}
        </div>
        {percent !== undefined && (
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div className={`h-full rounded-full transition-all duration-500 ${progressColor}`} style={{ width: `${Math.min(100, parseInt(percent, 10) || 0)}%` }} />
          </div>
        )}
        <p className="text-[10px] text-slate-500 mt-1">{subtitle}</p>
      </div>
    </div>
  );
}

function AnggaranKpiCards({
  totalPaguFakultas,
  totalRabTerencana,
  totalRealisasiAktual,
  sisaSaldoFakultas,
  persentaseSerapanFakultas,
  selectedOrmawaFilter = 'all',
  activeOrmawaObj = null
}) {
  if (selectedOrmawaFilter !== 'all' && activeOrmawaObj) {
    const paguOrmawa = activeOrmawaObj.paguAnggaran || 0;
    const serapanOrmawa = activeOrmawaObj.serapanAnggaran || 0;
    const sisaOrmawa = Math.max(0, paguOrmawa - serapanOrmawa);
    const persenSerap = paguOrmawa > 0 ? Math.min(100, Math.round((serapanOrmawa / paguOrmawa) * 100)) : 0;
    const persenSisa = Math.max(0, 100 - persenSerap);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in duration-200">
        <KpiCard
          title={`Total Alokasi (${activeOrmawaObj.shortName})`}
          value={formatRupiah(paguOrmawa)}
          subtitle="Pagu anggaran ormawa"
          icon={Coins}
          iconBg="bg-emerald-50"
          iconColor="text-emerald-600"
        />
        <KpiCard
          title={`Sisa Saldo (${activeOrmawaObj.shortName})`}
          value={formatRupiah(sisaOrmawa)}
          subtitle="Saldo kas siap digunakan"
          icon={Scale}
          iconBg="bg-indigo-50"
          iconColor="text-indigo-600"
          percent={`${persenSisa}% Sisa`}
          progressColor="bg-indigo-500"
        />
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
      <KpiCard
        title="Total Alokasi Anggaran"
        value={formatRupiah(totalPaguFakultas)}
        subtitle="Total pagu 4 ormawa"
        icon={Coins}
        iconBg="bg-emerald-50"
        iconColor="text-emerald-600"
      />
      <KpiCard
        title="RAB Proker Diajukan"
        value={formatRupiah(totalRabTerencana)}
        subtitle="Akumulasi usulan proposal"
        icon={FileSpreadsheet}
        iconBg="bg-blue-50"
        iconColor="text-blue-600"
      />
      <KpiCard
        title="Realisasi Dana Cair"
        value={formatRupiah(totalRealisasiAktual)}
        subtitle="Total dana terserap"
        icon={ArrowDownRight}
        iconBg="bg-amber-50"
        iconColor="text-amber-600"
        percent={`${persentaseSerapanFakultas}%`}
        progressColor="bg-amber-500"
      />
      <KpiCard
        title="Sisa Saldo Anggaran"
        value={formatRupiah(sisaSaldoFakultas)}
        subtitle="Sisa alokasi fakultas"
        icon={Scale}
        iconBg="bg-indigo-50"
        iconColor="text-indigo-600"
        percent={`${Math.max(0, 100 - persentaseSerapanFakultas)}% Sisa`}
        progressColor="bg-indigo-500"
      />
    </div>
  );
}

function AnggaranOrmawaGrid({ 
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
            <h3 className="font-extrabold text-slate-900 text-sm">Alokasi &amp; Serapan Anggaran Ormawa</h3>
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
              </div>

              <div className="space-y-1.5 pt-1">
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[11px] text-slate-500">Alokasi Anggaran:</span>
                  <span className="font-extrabold text-slate-900 text-xs">{formatRupiah(pagu)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs">
                  <span className="text-[11px] text-slate-500">Dana Terserap:</span>
                  <span className="font-bold text-amber-700 text-xs">{formatRupiah(serapan)}</span>
                </div>
                <div className="flex justify-between items-baseline text-xs pt-1 border-t border-slate-200/60">
                  <span className="text-[11px] text-slate-500">Sisa Anggaran:</span>
                  <span className="font-extrabold text-emerald-700 text-xs">{formatRupiah(sisa)}</span>
                </div>
              </div>

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

              {isSelected && onOpenAddTransaction && (
                <div 
                  className="pt-2.5 mt-1 border-t border-blue-200/60 flex items-center gap-2 animate-in fade-in slide-in-from-top-1 duration-200" 
                  onClick={(e) => e.stopPropagation()}
                >
                  <button
                    type="button"
                    onClick={() => onOpenAddTransaction('pemasukan', o.id)}
                    className="flex-1 min-w-0 h-9 min-h-[38px] px-2 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 border border-blue-200/90 font-bold text-[11px] transition flex items-center justify-center gap-1 shadow-2xs active:scale-95 cursor-pointer whitespace-nowrap"
                    title={`Catat Pemasukan Kas ${o.shortName}`}
                  >
                    <ArrowDownLeft className="w-3.5 h-3.5 text-blue-600 shrink-0" />
                    <span className="whitespace-nowrap leading-none">+ Pemasukan</span>
                  </button>
                  <button
                    type="button"
                    onClick={() => onOpenAddTransaction('pengeluaran', o.id)}
                    className="flex-1 min-w-0 h-9 min-h-[38px] px-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-[11px] shadow-xs transition flex items-center justify-center gap-1 active:scale-95 cursor-pointer whitespace-nowrap"
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

function getProkerStats(p) {
  const rab = p.rab || 0;
  const realisasi = p.realisasiDana || 0;
  const selisih = rab - realisasi;
  const isDefisit = selisih < 0;
  const percent = rab > 0 ? Math.round((realisasi / rab) * 100) : 0;
  const badgeStyle = isDefisit 
    ? 'bg-red-50 text-red-700 border-red-200' 
    : percent === 100 
    ? 'bg-blue-50 text-blue-700 border-blue-200' 
    : 'bg-emerald-50 text-emerald-700 border-emerald-200';
  const badgeLabel = isDefisit ? 'Defisit' : percent === 100 ? '100% Sesuai' : 'Efisien';
  const progressBg = isDefisit ? 'bg-red-500' : percent === 100 ? 'bg-blue-600' : 'bg-emerald-500';

  return { rab, realisasi, selisih, isDefisit, percent, badgeStyle, badgeLabel, progressBg };
}

function AnggaranProkerMatrix({ filteredProkers, ormawas, collapsedCards, toggleCollapse }) {
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
      <div className="lg:hidden space-y-3">
        {filteredProkers.map((p) => {
          const ormawa = ormawas.find(o => o.id === p.ormawaId);
          const st = getProkerStats(p);
          const isCollapsed = collapsedCards[p.id];

          return (
            <div key={`mob-proker-budget-${p.id}`} className="p-3.5 rounded-2xl border border-slate-200/80 bg-white shadow-2xs space-y-2.5 w-full max-w-full overflow-hidden">
              <div onClick={() => toggleCollapse(p.id)} className="flex items-start justify-between gap-2 cursor-pointer select-none">
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
                  <span className={`text-[9px] font-extrabold px-2 py-0.5 rounded-full border ${st.badgeStyle}`}>
                    {st.badgeLabel}
                  </span>
                  <button type="button" className="p-1 rounded-lg bg-slate-50 text-slate-600 border border-slate-200/60">
                    {isCollapsed ? <ChevronDown className="w-3.5 h-3.5" /> : <ChevronUp className="w-3.5 h-3.5" />}
                  </button>
                </div>
              </div>

              {!isCollapsed && (
                <div className="space-y-2 pt-2 border-t border-slate-100 text-xs animate-in fade-in-50 duration-150">
                  <div className="grid grid-cols-2 gap-2 bg-slate-50/70 p-2.5 rounded-xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">Alokasi RAB:</span>
                      <span className="font-extrabold text-slate-900 text-xs">{formatRupiah(st.rab)}</span>
                    </div>
                    <div>
                      <span className="text-[10px] font-bold text-slate-500 block">Realisasi Kas:</span>
                      <span className="font-extrabold text-slate-900 text-xs">{formatRupiah(st.realisasi)}</span>
                    </div>
                    <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                      <span className="text-[10px] font-bold text-slate-500">
                        {st.isDefisit ? 'Kekurangan / Defisit:' : 'Sisa Dana Hemat:'}
                      </span>
                      <span className={`font-extrabold text-xs ${st.isDefisit ? 'text-red-600' : 'text-emerald-600'}`}>
                        {formatRupiah(Math.abs(st.selisih))}
                      </span>
                    </div>
                  </div>

                  <div className="px-1">
                    <div className="flex justify-between text-[10px] text-slate-500 mb-1">
                      <span>Rasio Serapan RAB</span>
                      <span className="font-bold text-slate-700">{st.percent}%</span>
                    </div>
                    <div className="w-full h-1.5 bg-slate-100 rounded-full overflow-hidden">
                      <div className={`h-full rounded-full transition-all duration-300 ${st.progressBg}`} style={{ width: `${Math.min(100, st.percent)}%` }} />
                    </div>
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>

      <div className="hidden lg:block overflow-x-auto">
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="text-[11px] font-bold text-slate-600 uppercase tracking-wider border-b border-slate-100">
              <th className="pb-3 pr-4 whitespace-nowrap">Program Kerja</th>
              <th className="pb-3 pr-4 whitespace-nowrap">Ormawa Pelaksana</th>
              <th className="pb-3 pr-4 whitespace-nowrap text-right">Alokasi RAB</th>
              <th className="pb-3 pr-4 whitespace-nowrap text-right">Realisasi Kas</th>
              <th className="pb-3 pr-4 whitespace-nowrap text-right">Selisih Hemat/Defisit</th>
              <th className="pb-3 pr-4 whitespace-nowrap text-center">Persentase</th>
              <th className="pb-3 text-right whitespace-nowrap">Status Rasio</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-slate-100">
            {filteredProkers.map((p) => {
              const ormawa = ormawas.find(o => o.id === p.ormawaId);
              const st = getProkerStats(p);

              return (
                <tr key={p.id} className="hover:bg-slate-50/80 transition">
                  <td className="py-3 pr-4 font-bold text-slate-900 max-w-[200px] truncate" title={p.title}>{p.title}</td>
                  <td className="py-3 pr-4 whitespace-nowrap">
                    <span className="font-semibold text-slate-700">{ormawa?.shortName}</span>
                    <span className="block text-[10px] text-slate-600">PIC: {p.pic}</span>
                  </td>
                  <td className="py-3 pr-4 text-right font-extrabold text-slate-900 whitespace-nowrap">{formatRupiah(st.rab)}</td>
                  <td className="py-3 pr-4 text-right font-extrabold text-blue-700 whitespace-nowrap">{formatRupiah(st.realisasi)}</td>
                  <td className={`py-3 pr-4 text-right font-extrabold whitespace-nowrap ${st.isDefisit ? 'text-red-600' : st.selisih === 0 ? 'text-slate-600' : 'text-emerald-700'}`}>
                    {st.isDefisit ? `- ${formatRupiah(Math.abs(st.selisih))}` : formatRupiah(st.selisih)}
                  </td>
                  <td className="py-3 pr-4 text-center whitespace-nowrap">
                    <div className="inline-flex items-center gap-1.5">
                      <span className="font-bold text-slate-800 text-[11px]">{st.percent}%</span>
                      <div className="w-12 h-1.5 bg-slate-200 rounded-full overflow-hidden">
                        <div className={`h-full rounded-full ${st.progressBg}`} style={{ width: `${Math.min(100, st.percent)}%` }} />
                      </div>
                    </div>
                  </td>
                  <td className="py-3 text-right whitespace-nowrap">
                    <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full border ${st.badgeStyle}`}>
                      {st.isDefisit ? 'Defisit Anggaran' : st.percent === 100 ? 'Sesuai Target' : 'Hemat Anggaran'}
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

function AnggaranTransactionTable({ filteredTransactions, ormawas, deleteBudgetTransaction, setReceiptPreviewData }) {
  const currentUser = useStore(state => state.currentUser);
  const isGuest = currentUser?.role === 'guest';

  if (filteredTransactions.length === 0) {
    return (
      <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-slate-200/80 p-6">
        <Receipt className="w-10 h-10 text-slate-400 mx-auto mb-2" />
        <h4 className="text-xs font-bold text-slate-800">Belum Ada Transaksi Kas</h4>
        <p className="text-[11px] text-slate-400 mt-1 max-w-sm mx-auto">
          Riwayat kas masuk &amp; keluar akan tercatat di sini.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-2.5">
      {filteredTransactions.map((tx) => {
        const ormawa = ormawas.find(o => o.id === tx.ormawaId);
        const isExpense = tx.txMode ? tx.txMode === 'pengeluaran' : ['termin1', 'termin2', 'operasional', 'konsumsi_logistik', 'lainnya'].includes(tx.type);
        const typeBadge = getTransactionTypeBadge(tx.type);

        return (
          <div key={`tx-item-${tx.id}`} className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs">
            <div className="flex items-start sm:items-center gap-3 min-w-0">
              <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${isExpense ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'}`}>
                {isExpense ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-2 flex-wrap">
                  <h4 className="font-bold text-xs text-slate-900 leading-tight">{tx.title}</h4>
                  <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${typeBadge.color}`}>{typeBadge.label}</span>
                  <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">{tx.receiptNumber}</span>
                </div>
                <p className="text-[10px] text-slate-500 mt-0.5">
                  <strong>{ormawa?.shortName}</strong> • {tx.date} • PJ: {tx.pic} • Sumber: {tx.category}
                </p>
                {tx.notes && <p className="text-[10px] text-slate-400 italic mt-0.5">{tx.notes}</p>}

                <div className="pt-1.5 flex items-center gap-2">
                  {tx.receiptPhoto ? (
                    <button
                      type="button"
                      onClick={() => setReceiptPreviewData(tx)}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-blue-50 hover:bg-blue-100 text-blue-700 font-bold text-[10px] border border-blue-200/80 transition shadow-2xs cursor-pointer"
                    >
                      <FileImage className="w-3.5 h-3.5" />
                      <span>Lihat Foto Kwitansi / Nota</span>
                      <Eye className="w-3 h-3 ml-0.5 text-blue-500" />
                    </button>
                  ) : (
                    <span className="text-[10px] text-slate-400 flex items-center gap-1">
                      <Receipt className="w-3 h-3 text-slate-300" />
                      <span>Tanpa Bukti Foto</span>
                    </span>
                  )}
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between sm:justify-end gap-3 pt-2 sm:pt-0 border-t sm:border-t-0 border-slate-100">
              <div className="text-left sm:text-right">
                <span className={`font-black text-xs sm:text-sm block ${isExpense ? 'text-slate-900' : 'text-emerald-700'}`}>
                  {isExpense ? '- ' : '+ '}{formatRupiah(tx.nominal)}
                </span>
                <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">Tercatat di Kas</span>
              </div>
              {!isGuest && (
                <button
                  type="button"
                  onClick={() => {
                    if (window.confirm(`Hapus pencatatan transaksi "${tx.title}"?`)) {
                      deleteBudgetTransaction(tx.id);
                    }
                  }}
                  className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition cursor-pointer"
                  title="Hapus Transaksi"
                >
                  <Trash2 className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function AnggaranReceiptModal({ receiptPreviewData, onClose }) {
  if (!receiptPreviewData) return null;

  return (
    <Dialog open={!!receiptPreviewData} onOpenChange={(open) => !open && onClose()}>
      <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
        <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 bg-slate-50/70 space-y-1 shrink-0">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
              Bukti Kwitansi / Nota
            </span>
            <span className="text-xs font-mono font-bold text-slate-500">{receiptPreviewData?.receiptNumber}</span>
          </div>
          <DialogTitle className="text-base font-extrabold text-slate-900 tracking-tight">{receiptPreviewData?.title}</DialogTitle>
          <DialogDescription className="text-xs text-slate-500">
            Bukti foto resmi yang diunggah untuk pencatatan transaksi kas ini.
          </DialogDescription>
        </DialogHeader>

        <div className="px-4 sm:px-6 py-4 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto">
          {receiptPreviewData?.receiptPhoto && (
            <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/60 p-1 flex items-center justify-center">
              <img src={receiptPreviewData.receiptPhoto} alt="Foto Kwitansi / Nota" className="w-full h-auto max-h-[50vh] object-contain rounded-xl shadow-xs" />
            </div>
          )}

          <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Jumlah Uang:</span>
              <span className="font-extrabold text-slate-900 text-sm">{formatRupiah(receiptPreviewData?.nominal)}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Tanggal Transaksi:</span>
              <span className="font-bold text-slate-800 text-xs">{receiptPreviewData?.date}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Penanggung Jawab:</span>
              <span className="font-semibold text-slate-800 text-xs">{receiptPreviewData?.pic}</span>
            </div>
            <div>
              <span className="text-[10px] text-slate-400 font-bold block">Asal Sumber Dana:</span>
              <span className="font-semibold text-slate-800 text-xs">{receiptPreviewData?.category}</span>
            </div>
            {receiptPreviewData?.notes && (
              <div className="col-span-1 sm:col-span-2 pt-2 border-t border-slate-200/70">
                <span className="text-[10px] text-slate-400 font-bold block">Catatan Tambahan:</span>
                <p className="text-slate-600 text-xs italic mt-0.5">{receiptPreviewData.notes}</p>
              </div>
            )}
          </div>
        </div>

        <DialogFooter className="px-4 sm:px-6 py-3 border-t border-slate-100 bg-slate-50/50 flex flex-col-reverse sm:flex-row items-stretch sm:items-center justify-between gap-2.5">
          {receiptPreviewData?.receiptPhoto ? (
            <a
              href={receiptPreviewData.receiptPhoto}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center justify-center sm:justify-start gap-1.5 py-1"
            >
              <ExternalLink className="w-3.5 h-3.5" />
              <span>Buka Gambar Ukuran Penuh</span>
            </a>
          ) : <div />}
          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs cursor-pointer text-center min-h-[38px] flex items-center justify-center"
          >
            Tutup
          </button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}

export default function AnggaranView({ onOpenSetPagu, onOpenAddTransaction, onPrintDoc }) {
  const { 
    ormawas, 
    prokers, 
    budgetTransactions = [], 
    deleteBudgetTransaction,
    selectedOrmawaFilter,
    setSelectedOrmawaFilter,
    currentUserName,
    currentUser
  } = useStore(useShallow(state => ({ 
    ormawas: state.ormawas, 
    prokers: state.prokers, 
    budgetTransactions: state.budgetTransactions, 
    deleteBudgetTransaction: state.deleteBudgetTransaction, 
    selectedOrmawaFilter: state.selectedOrmawaFilter, 
    setSelectedOrmawaFilter: state.setSelectedOrmawaFilter, 
    currentUserName: state.currentUserName, 
    currentUser: state.currentUser 
  })));

  const isGuest = currentUser?.role === 'guest';
  const activeOrmawaObj = ormawas.find(o => o.id === selectedOrmawaFilter);

  const [activeSubTab, setActiveSubTab] = useState('proker');
  const [collapsedCards, setCollapsedCards] = useState({});
  const [receiptPreviewData, setReceiptPreviewData] = useState(null);
  const [isExportingExcel, setIsExportingExcel] = useState(false);

  const toggleCollapse = (id) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  const totalPaguFakultas = useMemo(() => ormawas.reduce((acc, o) => acc + (o.paguAnggaran || 0), 0), [ormawas]);
  const totalRabTerencana = useMemo(() => prokers.reduce((acc, p) => acc + (p.rab || 0), 0), [prokers]);
  const totalRealisasiAktual = useMemo(() => ormawas.reduce((acc, o) => acc + (o.serapanAnggaran || 0), 0), [ormawas]);
  const sisaSaldoFakultas = Math.max(0, totalPaguFakultas - totalRealisasiAktual);
  const persentaseSerapanFakultas = totalPaguFakultas > 0 ? Math.min(100, Math.round((totalRealisasiAktual / totalPaguFakultas) * 100)) : 0;

  const filteredOrmawas = useMemo(() => {
    if (selectedOrmawaFilter === 'all') return ormawas;
    return ormawas.filter(o => o.id === selectedOrmawaFilter);
  }, [ormawas, selectedOrmawaFilter]);

  const filteredProkers = useMemo(() => {
    if (selectedOrmawaFilter === 'all') return prokers;
    return prokers.filter(p => p.ormawaId === selectedOrmawaFilter);
  }, [prokers, selectedOrmawaFilter]);

  const filteredTransactions = useMemo(() => {
    if (selectedOrmawaFilter === 'all') return budgetTransactions;
    return budgetTransactions.filter(t => t.ormawaId === selectedOrmawaFilter);
  }, [budgetTransactions, selectedOrmawaFilter]);

  const handleDownloadExcel = async () => {
    try {
      setIsExportingExcel(true);
      await exportFinancialWorkbook({
        totalPaguFakultas,
        totalRabTerencana,
        totalRealisasiAktual,
        sisaSaldoFakultas,
        persentaseSerapanFakultas,
        ormawas: filteredOrmawas,
        prokers: filteredProkers,
        transactions: filteredTransactions,
        selectedFilter: selectedOrmawaFilter,
        currentUserName
      });
    } catch (err) {
      console.error('Failed to export Excel:', err);
      exportFormattedCSV({
        totalPaguFakultas,
        totalRabTerencana,
        totalRealisasiAktual,
        sisaSaldoFakultas,
        persentaseSerapanFakultas,
        ormawas: filteredOrmawas,
        prokers: filteredProkers,
        transactions: filteredTransactions,
        selectedFilter: selectedOrmawaFilter
      });
    } finally {
      setIsExportingExcel(false);
    }
  };

  const handleDownloadCSV = () => {
    exportFormattedCSV({
      totalPaguFakultas,
      totalRabTerencana,
      totalRealisasiAktual,
      sisaSaldoFakultas,
      persentaseSerapanFakultas,
      ormawas: filteredOrmawas,
      prokers: filteredProkers,
      transactions: filteredTransactions,
      selectedFilter: selectedOrmawaFilter
    });
  };

  const handlePrintRekap = () => {
    if (onPrintDoc) {
      onPrintDoc({
        type: 'rekap_anggaran',
        title: 'LAPORAN REKAPITULASI PENGAWASAN ANGGARAN & LPJ ORMAWA',
        date: new Date().toLocaleDateString('id-ID', { day: 'numeric', month: 'long', year: 'numeric' }),
        filter: selectedOrmawaFilter,
        selectedFilter: selectedOrmawaFilter,
        ormawaName: selectedOrmawaFilter === 'all' ? 'Seluruh Ormawa FASILKOM' : activeOrmawaObj?.name,
        ormawaShort: selectedOrmawaFilter === 'all' ? 'FASILKOM' : activeOrmawaObj?.shortName,
        totalPagu: totalPaguFakultas,
        totalRab: totalRabTerencana,
        totalRealisasi: totalRealisasiAktual,
        sisaSaldo: sisaSaldoFakultas,
        persenSerap: persentaseSerapanFakultas,
        totalPaguFakultas,
        totalRabTerencana,
        totalRealisasiAktual,
        sisaSaldoFakultas,
        persentaseSerapanFakultas,
        ormawas: filteredOrmawas,
        prokers: filteredProkers,
        transactions: filteredTransactions
      });
    }
  };

  return (
    <div className="space-y-6">
      <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-emerald-50 text-emerald-700 flex items-center justify-center shrink-0 border border-emerald-100 shadow-2xs">
              <Wallet className="w-5 h-5 text-emerald-600" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="font-extrabold text-slate-900 text-xs sm:text-sm">Kelola Anggaran &amp; Realisasi</h3>
                {selectedOrmawaFilter !== 'all' && activeOrmawaObj && (
                  <span className="text-xs font-semibold text-slate-500">
                    — {ORMAWA_DISPLAY_NAMES[activeOrmawaObj.id] || activeOrmawaObj.shortName}
                  </span>
                )}
              </div>
              <p className="text-xs text-slate-500 mt-0.5 font-normal">
                {selectedOrmawaFilter !== 'all' && activeOrmawaObj ? (
                  <span>
                    Menampilkan data kas &amp; anggaran <strong className="font-semibold text-slate-800">{ORMAWA_DISPLAY_NAMES[activeOrmawaObj.id] || activeOrmawaObj.shortName}</strong>
                  </span>
                ) : (
                  'Monitoring alokasi dan realisasi pencatatan kas ormawa'
                )}
              </p>
            </div>
          </div>

          {/* Action Buttons: Layout & Desain Harmonis, Elegan, dan Fungsional */}
          <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 w-full lg:w-auto">
            
            {/* Tombol Ekspor Excel */}
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExportingExcel}
              className="flex-1 sm:flex-initial h-9 px-3.5 bg-white hover:bg-emerald-50/70 border border-slate-200 hover:border-emerald-300 text-slate-700 hover:text-emerald-800 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 disabled:opacity-60 disabled:cursor-not-allowed group"
              title="Unduh Rekapitulasi Excel (.xlsx) Resmi"
            >
              {isExportingExcel ? (
                <Loader2 className="w-4 h-4 animate-spin text-emerald-600" />
              ) : (
                <FileSpreadsheet className="w-4 h-4 text-emerald-600 group-hover:scale-105 transition-transform" />
              )}
              <span>{isExportingExcel ? 'Menyiapkan...' : 'Excel (.xlsx)'}</span>
            </button>

            {/* Tombol Cetak PDF */}
            <button
              type="button"
              onClick={handlePrintRekap}
              className="flex-1 sm:flex-initial h-9 px-3.5 bg-white hover:bg-slate-50 border border-slate-200 hover:border-slate-300 text-slate-700 hover:text-slate-900 rounded-xl text-xs font-semibold shadow-2xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 group"
              title="Cetak Dokumen PDF Resmi Rekapitulasi"
            >
              <Printer className="w-4 h-4 text-slate-600 group-hover:text-slate-900 group-hover:scale-105 transition-transform" />
              <span>Cetak PDF</span>
            </button>

            {/* Pemisah Halus Desktop */}
            {!isGuest && onOpenSetPagu && (
              <div className="hidden sm:block w-px h-5 bg-slate-200" />
            )}

            {/* Tombol Primary: Atur Anggaran */}
            {!isGuest && onOpenSetPagu && (
              <button
                type="button"
                onClick={onOpenSetPagu}
                className="w-full sm:w-auto h-9 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-xl text-xs font-semibold shadow-xs transition flex items-center justify-center gap-1.5 cursor-pointer active:scale-95 group"
                title="Atur Alokasi Pagu Anggaran Ormawa"
              >
                <Settings2 className="w-4 h-4 text-blue-100 group-hover:rotate-45 transition-transform duration-300" />
                <span>Atur Anggaran</span>
              </button>
            )}
          </div>
        </div>
      </div>

      <AnggaranKpiCards
        totalPaguFakultas={totalPaguFakultas}
        totalRabTerencana={totalRabTerencana}
        totalRealisasiAktual={totalRealisasiAktual}
        sisaSaldoFakultas={sisaSaldoFakultas}
        persentaseSerapanFakultas={persentaseSerapanFakultas}
        selectedOrmawaFilter={selectedOrmawaFilter}
        activeOrmawaObj={activeOrmawaObj}
      />

      <AnggaranOrmawaGrid
        filteredOrmawas={filteredOrmawas}
        onOpenSetPagu={isGuest ? null : onOpenSetPagu}
        selectedOrmawaFilter={selectedOrmawaFilter}
        setSelectedOrmawaFilter={setSelectedOrmawaFilter}
        onOpenAddTransaction={isGuest ? null : onOpenAddTransaction}
      />

      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab('proker')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'proker' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Anggaran Proker ({filteredProkers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('transaksi')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'transaksi' ? 'bg-white text-slate-900 shadow-2xs' : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Riwayat Kas ({filteredTransactions.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExportingExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-slate-200 hover:border-emerald-300 bg-white hover:bg-emerald-50/60 text-slate-700 hover:text-emerald-800 font-semibold text-xs shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-50"
              title="Unduh Rekapitulasi Excel (.xlsx) Resmi"
            >
              {isExportingExcel ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin text-emerald-600" />
              ) : (
                <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              )}
              <span className="hidden sm:inline">{isExportingExcel ? 'Menyiapkan...' : 'Ekspor Excel'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 hover:border-slate-300 bg-white hover:bg-slate-50 text-slate-700 font-semibold text-xs shadow-2xs transition cursor-pointer active:scale-95"
              title="Unduh data dalam format CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </button>
          </div>
        </div>

        {activeSubTab === 'proker' && (
          <AnggaranProkerMatrix
            filteredProkers={filteredProkers}
            ormawas={ormawas}
            collapsedCards={collapsedCards}
            toggleCollapse={toggleCollapse}
          />
        )}

        {activeSubTab === 'transaksi' && (
          <AnggaranTransactionTable
            filteredTransactions={filteredTransactions}
            ormawas={ormawas}
            deleteBudgetTransaction={deleteBudgetTransaction}
            setReceiptPreviewData={setReceiptPreviewData}
          />
        )}
      </div>

      <AnggaranReceiptModal
        receiptPreviewData={receiptPreviewData}
        onClose={() => setReceiptPreviewData(null)}
      />
    </div>
  );
}
