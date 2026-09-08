import React, { useState, useMemo } from 'react';
import { useStore } from '../../store/useStore';
import { 
  Wallet, 
  Plus, 
  Settings2, 
  FileSpreadsheet, 
  Printer, 
  Download 
} from 'lucide-react';
import DropdownSelect from '@/components/ui/dropdown-select';
import { exportFinancialWorkbook, exportFormattedCSV } from '../../utils/exportExcel';

// Sub-components
import AnggaranKpiCards from './components/AnggaranKpiCards';
import AnggaranOrmawaGrid from './components/AnggaranOrmawaGrid';
import AnggaranProkerMatrix from './components/AnggaranProkerMatrix';
import AnggaranTransactionTable from './components/AnggaranTransactionTable';
import AnggaranReceiptModal from './components/AnggaranReceiptModal';

export default function AnggaranView({ onOpenSetPagu, onOpenAddTransaction, onPrintDoc }) {
  const { 
    ormawas, 
    prokers, 
    budgetTransactions = [], 
    deleteBudgetTransaction,
    selectedOrmawaFilter,
    setSelectedOrmawaFilter,
    currentUserName
  } = useStore();

  const [activeSubTab, setActiveSubTab] = useState('proker'); // 'proker' | 'transaksi'
  const [collapsedCards, setCollapsedCards] = useState({});
  const [receiptPreviewData, setReceiptPreviewData] = useState(null);

  const toggleCollapse = (id) => {
    setCollapsedCards(prev => ({ ...prev, [id]: !prev[id] }));
  };

  // 1. Perhitungan Agregat Finansial
  const totalPaguFakultas = useMemo(() => {
    return ormawas.reduce((acc, o) => acc + (o.paguAnggaran || 0), 0);
  }, [ormawas]);

  const totalRabTerencana = useMemo(() => {
    return prokers.reduce((acc, p) => acc + (p.rab || 0), 0);
  }, [prokers]);

  const totalRealisasiAktual = useMemo(() => {
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

  // =========================================================================
  // EKSPOR REKAPITULASI KE EXCEL (.XLSX) / CSV & LAPORAN CETAK PDF
  // =========================================================================
  const [isExportingExcel, setIsExportingExcel] = useState(false);

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
        totalPaguFakultas,
        totalRabTerencana,
        totalRealisasiAktual,
        sisaSaldoFakultas,
        persentaseSerapanFakultas,
        ormawas: filteredOrmawas,
        prokers: filteredProkers,
        transactions: filteredTransactions
      });
    } else {
      window.print();
    }
  };

  return (
    <div className="space-y-6 w-full max-w-full overflow-hidden">
      {/* 1. Header & Quick Action Buttons */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full">
        <div className="flex flex-col xl:flex-row xl:items-center justify-between gap-4 pb-4 border-b border-slate-100">
          <div className="flex items-center gap-3 shrink-0">
            <div className="w-10 h-10 rounded-2xl bg-emerald-50 text-emerald-600 flex items-center justify-center shrink-0 shadow-2xs">
              <Wallet className="w-5 h-5" />
            </div>
            <div>
              <h2 className="text-base sm:text-lg font-extrabold text-slate-900 tracking-tight">
                Pengelolaan &amp; Alokasi Anggaran Ormawa
              </h2>
            </div>
          </div>

          {/* Action Buttons: Ekspor Excel (.xlsx), Cetak PDF, Unduh CSV, Atur Anggaran, Input Kas */}
          <div className="flex items-center gap-2 flex-wrap xl:justify-end">
            <button
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExportingExcel}
              className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-emerald-300 bg-emerald-600 hover:bg-emerald-700 disabled:opacity-50 text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95"
              title="Unduh Laporan Rekapitulasi Berformat Microsoft Excel (.xlsx) dengan Kop Surat, Warna & Multi-Sheet"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-100" />
              <span>{isExportingExcel ? 'Menyiapkan...' : 'Excel (.xlsx)'}</span>
            </button>

            <button
              type="button"
              onClick={handlePrintRekap}
              className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer active:scale-95"
              title="Cetak Laporan Rekapitulasi Anggaran & LPJ Semester Resmi DPM FASILKOM"
            >
              <Printer className="w-3.5 h-3.5 text-slate-600" />
              <span>Cetak PDF</span>
            </button>

            <button
              type="button"
              onClick={handleDownloadCSV}
              className="shrink-0 flex items-center justify-center gap-1.5 px-2.5 py-2 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer active:scale-95"
              title="Unduh data tabel dalam format CSV ringan"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </button>

            <button
              type="button"
              onClick={onOpenSetPagu}
              className="shrink-0 flex items-center justify-center gap-1.5 px-3 py-2 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer active:scale-95"
            >
              <Settings2 className="w-3.5 h-3.5 text-slate-500" />
              <span>Atur Anggaran</span>
            </button>

            <button
              type="button"
              onClick={onOpenAddTransaction}
              className="shrink-0 flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-blue-600 hover:bg-blue-700 text-white font-bold text-xs shadow-xs transition cursor-pointer active:scale-95 whitespace-nowrap"
            >
              <Plus className="w-4 h-4" />
              <span>Input Kas</span>
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
      <AnggaranKpiCards
        totalPaguFakultas={totalPaguFakultas}
        totalRabTerencana={totalRabTerencana}
        totalRealisasiAktual={totalRealisasiAktual}
        sisaSaldoFakultas={sisaSaldoFakultas}
        persentaseSerapanFakultas={persentaseSerapanFakultas}
      />

      {/* 3. Kartu Alokasi & Serapan Anggaran per Ormawa */}
      <AnggaranOrmawaGrid
        filteredOrmawas={filteredOrmawas}
        onOpenSetPagu={onOpenSetPagu}
      />

      {/* 4. Tab Sub-Navigasi: "Matriks Anggaran Proker" vs "Riwayat Transaksi Kas" */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-soft w-full max-w-full overflow-hidden space-y-4">
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pb-3 border-b border-slate-100">
          <div className="flex items-center gap-1.5 p-1 bg-slate-100/80 rounded-2xl w-full sm:w-auto">
            <button
              type="button"
              onClick={() => setActiveSubTab('proker')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
                activeSubTab === 'proker'
                  ? 'bg-white text-slate-900 shadow-2xs'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              Matriks Anggaran Proker ({filteredProkers.length})
            </button>
            <button
              type="button"
              onClick={() => setActiveSubTab('transaksi')}
              className={`flex-1 sm:flex-none px-4 py-1.5 rounded-xl text-xs font-bold transition cursor-pointer ${
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
              type="button"
              onClick={handleDownloadExcel}
              disabled={isExportingExcel}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl border border-emerald-300 bg-emerald-50 hover:bg-emerald-100 text-emerald-800 font-bold text-xs shadow-2xs transition cursor-pointer active:scale-95 disabled:opacity-50"
              title="Unduh Rekapitulasi Excel (.xlsx) Resmi"
            >
              <FileSpreadsheet className="w-3.5 h-3.5 text-emerald-600" />
              <span className="hidden sm:inline">{isExportingExcel ? 'Menyiapkan...' : 'Ekspor Excel'}</span>
            </button>
            <button
              type="button"
              onClick={handleDownloadCSV}
              className="hidden md:flex items-center gap-1.5 px-2.5 py-1.5 rounded-xl border border-slate-200 bg-white hover:bg-slate-50 text-slate-700 font-bold text-xs shadow-2xs transition cursor-pointer"
              title="Unduh data dalam format CSV"
            >
              <Download className="w-3.5 h-3.5 text-slate-500" />
              <span>CSV</span>
            </button>
            <button
              type="button"
              onClick={onOpenAddTransaction}
              className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-bold text-xs shadow-2xs transition cursor-pointer"
            >
              <Plus className="w-3.5 h-3.5" />
              <span>Input Pencairan</span>
            </button>
          </div>
        </div>

        {/* SUBTAB 1: MATRIKS ANGGARAN PROKER */}
        {activeSubTab === 'proker' && (
          <AnggaranProkerMatrix
            filteredProkers={filteredProkers}
            ormawas={ormawas}
            collapsedCards={collapsedCards}
            toggleCollapse={toggleCollapse}
          />
        )}

        {/* SUBTAB 2: BUKU KAS & RIWAYAT TRANSAKSI */}
        {activeSubTab === 'transaksi' && (
          <AnggaranTransactionTable
            filteredTransactions={filteredTransactions}
            ormawas={ormawas}
            deleteBudgetTransaction={deleteBudgetTransaction}
            setReceiptPreviewData={setReceiptPreviewData}
          />
        )}
      </div>

      {/* MODAL LIGHTBOX PREVIEW KWITANSI */}
      <AnggaranReceiptModal
        receiptPreviewData={receiptPreviewData}
        onClose={() => setReceiptPreviewData(null)}
      />
    </div>
  );
}
