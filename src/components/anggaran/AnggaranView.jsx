import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Coins, 
  TrendingUp, 
  TrendingDown, 
  Wallet, 
  Plus, 
  Settings2, 
  ArrowUpRight, 
  ArrowDownRight, 
  FileSpreadsheet, 
  Receipt, 
  CheckCircle2, 
  AlertTriangle, 
  Building2, 
  Trash2, 
  Filter,
  ChevronDown,
  ChevronUp,
  BarChart3,
  Scale,
  FileImage,
  ExternalLink,
  Eye
} from 'lucide-react';
import { 
  Dialog, 
  DialogContent, 
  DialogHeader, 
  DialogTitle, 
  DialogDescription,
  DialogFooter 
} from '@/components/ui/dialog';
import DropdownSelect from '@/components/ui/dropdown-select';

export default function AnggaranView({ onOpenSetPagu, onOpenAddTransaction, onPrintDoc }) {
  const { 
    ormawas, 
    prokers, 
    budgetTransactions = [], 
    deleteBudgetTransaction,
    selectedOrmawaFilter,
    setSelectedOrmawaFilter
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState('proker'); // 'proker' | 'transaksi'
  const [collapsedCards, setCollapsedCards] = useState({});
  const [receiptPreviewData, setReceiptPreviewData] = useState(null);

  const toggleCollapse = (id) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // Label transaksi yang mudah dipahami mahasiswa
  const getTransactionTypeBadge = (type) => {
    switch (type) {
      case 'termin1':
        return { label: 'Dana Awal (70%)', color: 'bg-blue-50 text-blue-700 border-blue-200' };
      case 'termin2':
        return { label: 'Pelunasan (30%)', color: 'bg-emerald-50 text-emerald-700 border-emerald-200' };
      case 'operasional':
        return { label: 'Operasional Kas', color: 'bg-purple-50 text-purple-700 border-purple-200' };
      case 'sponsorship':
        return { label: 'Dana Sponsor', color: 'bg-amber-50 text-amber-700 border-amber-200' };
      case 'lainnya':
      default:
        return { label: 'Pengeluaran Lain', color: 'bg-slate-100 text-slate-700 border-slate-200' };
    }
  };

  // 1. Perhitungan Agregat Finansial
  const totalPaguFakultas = useMemo(() => {
    return ormawas.reduce((acc, o) => acc + (o.paguAnggaran || 0), 0);
  }, [ormawas]);

  const totalRabTerencana = useMemo(() => {
    return prokers.reduce((acc, p) => acc + (p.rab || 0), 0);
  }, [prokers]);

  const totalRealisasiAktual = useMemo(() => {
    // Total serapan dari pengeluaran aktual
    return ormawas.reduce((acc, o) => acc + (o.serapanAnggaran || 0), 0);
  }, [ormawas]);

  const sisaSaldoFakultas = Math.max(0, totalPaguFakultas - totalRealisasiAktual);
  const persentaseSerapanFakultas = totalPaguFakultas > 0 
    ? Math.min(100, Math.round((totalRealisasiAktual / totalPaguFakultas) * 100)) 
    : 0;

  // Filter ormawa
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

  const ormawaOrder = ['dpm', 'bem', 'himsisfo', 'himti'];
  const ormawaLabels = {
    dpm: 'DPM',
    bem: 'BEM',
    himsisfo: 'Himsisfo',
    himti: 'Himti'
  };

  const sortedOrmawas = [...ormawas].sort((a, b) => {
    const idxA = ormawaOrder.indexOf(a.id);
    const idxB = ormawaOrder.indexOf(b.id);
    if (idxA !== -1 && idxB !== -1) return idxA - idxB;
    if (idxA !== -1) return -1;
    if (idxB !== -1) return 1;
    return 0;
  });

  const ormawaFilterOptions = [
    { value: 'all', label: 'Semua Ormawa Fasilkom' },
    ...sortedOrmawas.map(o => ({
      value: o.id,
      label: ormawaLabels[o.id] || o.shortName || o.name
    }))
  ];

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* 1. Header & Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full">
        <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Pengelolaan &amp; Alokasi Anggaran Ormawa
              </h2>
            </div>
          </div>

          {/* Action Buttons: Atur Anggaran & Input Anggaran */}
          <div className="flex items-center gap-2.5 flex-wrap sm:flex-nowrap">
            <button
              onClick={onOpenSetPagu}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition"
            >
              <Settings2 className="w-4 h-4 text-slate-500" />
              <span>Atur Alokasi Anggaran</span>
            </button>

            <button
              onClick={onOpenAddTransaction}
              className="flex-1 sm:flex-none flex items-center justify-center gap-1.5 px-4 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition"
            >
              <Plus className="w-4 h-4" />
              <span>Input Anggaran</span>
            </button>
          </div>
        </div>

        {/* Filter Ormawa Dropdown */}
        <div className="pt-3 flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <span className="text-[11px] font-bold text-slate-500 shrink-0">Filter Entitas:</span>
            <DropdownSelect
              value={selectedOrmawaFilter}
              onChange={(val) => setSelectedOrmawaFilter(val)}
              options={ormawaFilterOptions}
              className="flex-1 sm:w-64"
              triggerClassName="w-full py-1.5 px-3 font-bold text-xs rounded-xl bg-slate-50 border border-slate-200 shadow-2xs flex items-center justify-between"
            />
          </div>

          <span className="text-[10px] font-semibold text-slate-500 self-end sm:self-center">
            Periode Anggaran: 2026/2027
          </span>
        </div>
      </div>

      {/* 2. 4 Kartu KPI Ringkasan Finansial */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5">
        {/* KPI 1: Total Alokasi Anggaran */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Alokasi Anggaran
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              Rp {totalPaguFakultas.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              Batas alokasi dana 4 ormawa aktif
            </p>
          </div>
        </div>

        {/* KPI 2: RAB Terencana */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              RAB Proker Diajukan
            </span>
            <div className="w-7 h-7 rounded-xl bg-blue-50 text-blue-600 flex items-center justify-center">
              <FileSpreadsheet className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              Rp {totalRabTerencana.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              Akumulasi RAB proposal proker
            </p>
          </div>
        </div>

        {/* KPI 3: Realisasi Serapan */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Realisasi Dana Cair
            </span>
            <div className="w-7 h-7 rounded-xl bg-amber-50 text-amber-600 flex items-center justify-center">
              <ArrowDownRight className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                Rp {totalRealisasiAktual.toLocaleString('id-ID')}
              </h3>
              <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
                {persentaseSerapanFakultas}%
              </span>
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Total dana kas yang telah terserap
            </p>
          </div>
        </div>

        {/* KPI 4: Sisa Saldo Anggaran */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sisa Saldo Anggaran
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              Rp {sisaSaldoFakultas.toLocaleString('id-ID')}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              Dana fakultas siap dialokasikan
            </p>
          </div>
        </div>
      </div>

      {/* 3. Kartu Alokasi & Serapan Anggaran per Ormawa */}
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
            onClick={onOpenSetPagu}
            className="text-xs font-bold text-blue-600 hover:text-blue-700 flex items-center gap-1"
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
                      Rp {pagu.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs">
                    <span className="text-[11px] text-slate-500">Dana Terserap:</span>
                    <span className="font-bold text-amber-700 text-xs">
                      Rp {serapan.toLocaleString('id-ID')}
                    </span>
                  </div>
                  <div className="flex justify-between items-baseline text-xs pt-1 border-t border-slate-200/60">
                    <span className="text-[11px] text-slate-500">Sisa Anggaran:</span>
                    <span className="font-extrabold text-emerald-700 text-xs">
                      Rp {sisa.toLocaleString('id-ID')}
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

      {/* 4. Tab Sub-Navigasi: "Matriks Anggaran Proker" vs "Riwayat Transaksi Kas" */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl w-full sm:w-auto">
            <button
              onClick={() => setActiveSubTab('proker')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'proker'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matriks Anggaran Proker ({filteredProkers.length})
            </button>
            <button
              onClick={() => setActiveSubTab('transaksi')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition ${
                activeSubTab === 'transaksi'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Buku Kas &amp; Transaksi ({filteredTransactions.length})
            </button>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={onOpenAddTransaction}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Pencairan</span>
            </button>
          </div>
        </div>

        {/* ========================================================================= */}
        {/* SUBTAB 1: MATRIKS ANGGARAN PROKER (RAB vs REALISASI)                      */}
        {/* ========================================================================= */}
        {activeSubTab === 'proker' && (
          <div>
            {filteredProkers.length === 0 ? (
              <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-slate-200/80 p-6">
                <FileSpreadsheet className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800">Belum Ada Program Kerja Terdaftar</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  Daftarkan program kerja terlebih dahulu untuk melihat perbandingan alokasi RAB dan realisasi dana.
                </p>
              </div>
            ) : (
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
                                  Rp {rab.toLocaleString('id-ID')}
                                </span>
                              </div>
                              <div>
                                <span className="text-[10px] font-bold text-slate-500 block">Realisasi Kas:</span>
                                <span className="font-extrabold text-slate-900 text-xs">
                                  Rp {realisasi.toLocaleString('id-ID')}
                                </span>
                              </div>
                              <div className="col-span-2 pt-1 border-t border-slate-200/60 flex items-center justify-between">
                                <span className="text-[10px] font-bold text-slate-500">
                                  {isDefisit ? 'Kekurangan / Defisit:' : 'Sisa Dana Hemat:'}
                                </span>
                                <span className={`font-extrabold text-xs ${isDefisit ? 'text-red-600' : 'text-emerald-600'}`}>
                                  Rp {Math.abs(selisih).toLocaleString('id-ID')}
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
                              Rp {rab.toLocaleString('id-ID')}
                            </td>

                            <td className="py-3 px-3 text-right font-extrabold text-slate-900">
                              Rp {realisasi.toLocaleString('id-ID')}
                            </td>

                            <td className="py-3 px-3 text-right">
                              <span className={`font-bold ${isDefisit ? 'text-red-600' : 'text-emerald-600'}`}>
                                {isDefisit ? '- ' : '+ '}Rp {Math.abs(selisih).toLocaleString('id-ID')}
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
            )}
          </div>
        )}

        {/* ========================================================================= */}
        {/* SUBTAB 2: BUKU KAS & RIWAYAT TRANSAKSI ANGGARAN                           */}
        {/* ========================================================================= */}
        {activeSubTab === 'transaksi' && (
          <div>
            {filteredTransactions.length === 0 ? (
              <div className="py-10 text-center bg-slate-50/50 rounded-2xl border border-slate-200/80 p-6">
                <Receipt className="w-10 h-10 text-slate-400 mx-auto mb-2" />
                <h4 className="text-xs font-bold text-slate-800">Belum Ada Riwayat Transaksi Anggaran</h4>
                <p className="text-[11px] text-slate-500 mt-1 max-w-sm mx-auto">
                  Klik tombol <strong>"Input Anggaran"</strong> di atas untuk mencatat pencairan termin proker atau dana operasional kas.
                </p>
              </div>
            ) : (
              <div className="space-y-2.5">
                {filteredTransactions.map((tx) => {
                  const ormawa = ormawas.find(o => o.id === tx.ormawaId);
                  const isExpense = ['termin1', 'termin2', 'operasional', 'lainnya'].includes(tx.type);
                  const typeBadge = getTransactionTypeBadge(tx.type);

                  return (
                    <div 
                      key={`tx-item-${tx.id}`}
                      className="p-3 sm:p-3.5 rounded-2xl border border-slate-200/80 bg-white hover:bg-slate-50/60 transition flex flex-col sm:flex-row sm:items-center justify-between gap-3 shadow-2xs"
                    >
                      <div className="flex items-start sm:items-center gap-3 min-w-0">
                        <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5 sm:mt-0 ${
                          isExpense ? 'bg-amber-50 text-amber-600' : 'bg-emerald-50 text-emerald-600'
                        }`}>
                          {isExpense ? <ArrowDownRight className="w-4 h-4" /> : <ArrowUpRight className="w-4 h-4" />}
                        </div>

                        <div className="min-w-0 flex-1">
                          <div className="flex items-center gap-2 flex-wrap">
                            <h4 className="font-bold text-xs text-slate-900 leading-tight">{tx.title}</h4>
                            <span className={`text-[9px] font-bold px-2 py-0.5 rounded-full border ${typeBadge.color}`}>
                              {typeBadge.label}
                            </span>
                            <span className="text-[9px] font-mono font-bold bg-slate-100 text-slate-600 px-1.5 py-0.2 rounded">
                              {tx.receiptNumber}
                            </span>
                          </div>
                          <p className="text-[10px] text-slate-500 mt-0.5">
                            <strong>{ormawa?.shortName}</strong> • {tx.date} • PJ: {tx.pic} • Sumber: {tx.category}
                          </p>
                          {tx.notes && (
                            <p className="text-[10px] text-slate-400 italic mt-0.5">{tx.notes}</p>
                          )}

                          {/* Tombol Lihat Foto Kwitansi / Nota */}
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
                          <span className={`font-black text-xs sm:text-sm block ${
                            isExpense ? 'text-slate-900' : 'text-emerald-700'
                          }`}>
                            {isExpense ? '- ' : '+ '}Rp {tx.nominal.toLocaleString('id-ID')}
                          </span>
                          <span className="text-[9px] font-bold text-emerald-600 bg-emerald-50 px-1.5 py-0.2 rounded">
                            Tercatat di Kas
                          </span>
                        </div>

                        <button
                          type="button"
                          onClick={() => {
                            if (window.confirm(`Hapus pencatatan transaksi "${tx.title}"?`)) {
                              deleteBudgetTransaction(tx.id);
                            }
                          }}
                          className="p-1.5 rounded-lg text-slate-400 hover:text-rose-600 hover:bg-rose-50 transition"
                          title="Hapus Transaksi"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        )}
      </div>

      {/* ========================================================================= */}
      {/* MODAL LIGHTBOX: PREVIEW FOTO KWITANSI / NOTA                              */}
      {/* ========================================================================= */}
      <Dialog open={!!receiptPreviewData} onOpenChange={(open) => !open && setReceiptPreviewData(null)}>
        <DialogContent className="w-[95vw] sm:max-w-lg p-0 overflow-hidden rounded-2xl sm:rounded-3xl border border-slate-200/80 shadow-2xl max-h-[92vh] flex flex-col">
          <DialogHeader className="px-4 sm:px-6 pt-4 sm:pt-5 pb-3 border-b border-slate-100 bg-slate-50/70 space-y-1 shrink-0">
            <div className="flex items-center gap-2">
              <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-emerald-50 text-emerald-700 border border-emerald-200">
                Bukti Kwitansi / Nota
              </span>
              <span className="text-xs font-mono font-bold text-slate-500">
                {receiptPreviewData?.receiptNumber}
              </span>
            </div>
            <DialogTitle className="text-base font-extrabold text-slate-900 tracking-tight">
              {receiptPreviewData?.title}
            </DialogTitle>
            <DialogDescription className="text-xs text-slate-500">
              Bukti foto resmi yang diunggah untuk pencatatan transaksi kas ini.
            </DialogDescription>
          </DialogHeader>

          <div className="px-4 sm:px-6 py-4 space-y-4 max-h-[calc(85vh-140px)] overflow-y-auto">
            {/* Foto Kwitansi / Nota Display */}
            {receiptPreviewData?.receiptPhoto && (
              <div className="rounded-2xl overflow-hidden border border-slate-200 bg-slate-100/60 p-1 flex items-center justify-center">
                <img 
                  src={receiptPreviewData.receiptPhoto} 
                  alt="Foto Kwitansi / Nota" 
                  className="w-full h-auto max-h-[50vh] object-contain rounded-xl shadow-xs" 
                />
              </div>
            )}

            {/* Rincian Transaksi */}
            <div className="bg-slate-50/80 rounded-2xl p-3.5 border border-slate-200/70 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Jumlah Uang:</span>
                <span className="font-extrabold text-slate-900 text-sm">
                  Rp {(receiptPreviewData?.nominal || 0).toLocaleString('id-ID')}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Tanggal Transaksi:</span>
                <span className="font-bold text-slate-800 text-xs">
                  {receiptPreviewData?.date}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Penanggung Jawab:</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {receiptPreviewData?.pic}
                </span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold block">Asal Sumber Dana:</span>
                <span className="font-semibold text-slate-800 text-xs">
                  {receiptPreviewData?.category}
                </span>
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
              onClick={() => setReceiptPreviewData(null)}
              className="w-full sm:w-auto px-4 py-2 rounded-xl text-xs font-bold bg-slate-900 hover:bg-slate-800 text-white transition shadow-xs cursor-pointer text-center"
            >
              Tutup
            </button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
}
