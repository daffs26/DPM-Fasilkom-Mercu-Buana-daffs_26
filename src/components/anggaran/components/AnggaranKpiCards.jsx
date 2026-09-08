import React from 'react';
import { 
  Coins, 
  FileSpreadsheet, 
  ArrowDownRight, 
  Scale 
} from 'lucide-react';
import { formatRupiah } from '../../../utils/formatters';

export default function AnggaranKpiCards({
  totalPaguFakultas,
  totalRabTerencana,
  totalRealisasiAktual,
  sisaSaldoFakultas,
  persentaseSerapanFakultas,
  selectedOrmawaFilter = 'all',
  activeOrmawaObj = null
}) {
  // Jika user memilih spesifik Ormawa, hanya tampilkan 2 Card:
  // 1. Dana total anggaran berdasarkan pembagian fakultas
  // 2. Sisa saldo
  if (selectedOrmawaFilter !== 'all' && activeOrmawaObj) {
    const paguOrmawa = activeOrmawaObj.paguAnggaran || 0;
    const serapanOrmawa = activeOrmawaObj.serapanAnggaran || 0;
    const sisaOrmawa = Math.max(0, paguOrmawa - serapanOrmawa);
    const persenSerap = paguOrmawa > 0 ? Math.min(100, Math.round((serapanOrmawa / paguOrmawa) * 100)) : 0;
    const persenSisa = Math.max(0, 100 - persenSerap);

    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5 animate-in fade-in duration-200">
        {/* KPI 1: Dana Total Anggaran Berdasarkan Pembagian Fakultas */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Total Alokasi Anggaran ({activeOrmawaObj.shortName})
            </span>
            <div className="w-7 h-7 rounded-xl bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Coins className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {formatRupiah(paguOrmawa)}
            </h3>
            <p className="text-[10px] text-slate-500 mt-1">
              Dana total anggaran berdasarkan pembagian fakultas
            </p>
          </div>
        </div>

        {/* KPI 2: Sisa Saldo Anggaran */}
        <div className="bg-white rounded-3xl p-4 sm:p-5 border border-slate-200/80 shadow-soft flex flex-col justify-between">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-500">
              Sisa Saldo Anggaran ({activeOrmawaObj.shortName})
            </span>
            <div className="w-7 h-7 rounded-xl bg-indigo-50 text-indigo-600 flex items-center justify-center">
              <Scale className="w-3.5 h-3.5" />
            </div>
          </div>
          <div>
            <div className="flex items-baseline gap-2">
              <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
                {formatRupiah(sisaOrmawa)}
              </h3>
              <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md">
                {persenSisa}% Sisa
              </span>
            </div>
            <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
              <div 
                className="bg-indigo-500 h-full rounded-full transition-all duration-500"
                style={{ width: `${persenSisa}%` }}
              />
            </div>
            <p className="text-[10px] text-slate-500 mt-1">
              Sisa saldo kas alokasi fakultas yang siap digunakan
            </p>
          </div>
        </div>
      </div>
    );
  }

  // Tampilan Default Fakultas (4 Kartu)
  return (
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
            {formatRupiah(totalPaguFakultas)}
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
            {formatRupiah(totalRabTerencana)}
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
              {formatRupiah(totalRealisasiAktual)}
            </h3>
            <span className="text-[10px] font-bold text-amber-700 bg-amber-50 px-1.5 py-0.2 rounded-md">
              {persentaseSerapanFakultas}%
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-amber-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.min(persentaseSerapanFakultas, 100)}%` }}
            />
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
          <div className="flex items-baseline gap-2">
            <h3 className="text-lg sm:text-xl font-black text-slate-900 leading-tight">
              {formatRupiah(sisaSaldoFakultas)}
            </h3>
            <span className="text-[10px] font-bold text-indigo-700 bg-indigo-50 px-1.5 py-0.2 rounded-md">
              {Math.max(0, 100 - persentaseSerapanFakultas)}% Sisa
            </span>
          </div>
          <div className="w-full bg-slate-100 h-1.5 rounded-full overflow-hidden mt-2">
            <div 
              className="bg-indigo-500 h-full rounded-full transition-all duration-500"
              style={{ width: `${Math.max(0, 100 - persentaseSerapanFakultas)}%` }}
            />
          </div>
          <p className="text-[10px] text-slate-500 mt-1">
            Dana fakultas siap dialokasikan
          </p>
        </div>
      </div>
    </div>
  );
}
